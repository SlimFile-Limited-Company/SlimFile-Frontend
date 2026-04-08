import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

// PDF Document State
export interface PDFDocumentState {
  pdfDoc: any | null; // File object
  fileName: string;
  fileSize: number;
  totalPages: number;
  currentPage: number;
  isDirty: boolean;
  sessionId: string | null;
}

// View State
export interface PDFViewState {
  zoom: number;
  fitMode: 'width' | 'page' | 'actual';
  layout: 'single' | 'continuous' | 'facing';
  showThumbnails: boolean;
  showProperties: boolean;
  fullscreen: boolean;
}

// Edit State
export type ToolType = 'select' | 'text' | 'draw' | 'highlight' | 'shape' | 'stamp' | 'redact' | 'eraser';

export interface Annotation {
  id: string;
  type: ToolType;
  pageNumber: number;
  data: any;
  timestamp: number;
  userId?: string;
  userName?: string;
}

export interface PDFEditState {
  mode: ToolType;
  selectedTool: ToolType;
  brushColor: string;
  brushSize: number;
  annotations: Annotation[];
  selectedAnnotation: Annotation | null;
  undoStack: any[];
  redoStack: any[];
  clipboardData: any | null;
}

// Canvas state per page (for save)
export interface PageCanvasState {
  json: any;
  width: number;
  height: number;
}

// Sejda-style text edit — replaces existing PDF text
export interface TextEdit {
  pageNumber: number;
  originalText: string;
  newText: string;
  pdfX: number;      // PDF coordinate space (origin bottom-left)
  pdfY: number;
  pdfWidth: number;
  pdfHeight: number;
  fontSize: number;  // in PDF points
}

// Context State
export interface PDFEditorContextState {
  documentState: PDFDocumentState;
  setDocumentState: (state: Partial<PDFDocumentState>) => void;
  viewState: PDFViewState;
  setViewState: (state: Partial<PDFViewState>) => void;
  editState: PDFEditState;
  setEditState: (state: Partial<PDFEditState>) => void;
  loadPDF: (file: File) => Promise<void>;
  savePDF: () => Promise<Blob | null>;
  closePDF: () => void;
  setPageCanvasState: (pageNumber: number, json: any, width: number, height: number) => void;
  textEdits: TextEdit[];
  addTextEdit: (edit: TextEdit) => void;
  addPage: (position?: number) => void;
  deletePage: (pageNumber: number) => void;
  rotatePage: (pageNumber: number, degrees: 90 | 180 | 270) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, data: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  selectAnnotation: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoom: number) => void;
  fitToWidth: () => void;
  fitToPage: () => void;
  goToPage: (pageNumber: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

const PDFEditorContext = createContext<PDFEditorContextState | null>(null);

export const usePDFEditor = () => {
  const context = useContext(PDFEditorContext);
  if (!context) throw new Error('usePDFEditor must be used within PDFEditorProvider');
  return context;
};

interface PDFEditorProviderProps {
  children: ReactNode;
}

export const PDFEditorProvider = ({ children }: PDFEditorProviderProps) => {
  const [documentState, setDocumentStateInternal] = useState<PDFDocumentState>({
    pdfDoc: null, fileName: '', fileSize: 0, totalPages: 0, currentPage: 1, isDirty: false, sessionId: null,
  });

  const [viewState, setViewStateInternal] = useState<PDFViewState>({
    zoom: 1.0, fitMode: 'width', layout: 'single', showThumbnails: true, showProperties: true, fullscreen: false,
  });

  const [editState, setEditStateInternal] = useState<PDFEditState>({
    mode: 'select', selectedTool: 'select', brushColor: '#ef4444', brushSize: 3,
    annotations: [], selectedAnnotation: null, undoStack: [], redoStack: [], clipboardData: null,
  });

  // Text edits (Sejda-style: replaces existing PDF text)
  const [textEdits, setTextEdits] = useState<TextEdit[]>([]);
  const addTextEdit = useCallback((edit: TextEdit) => {
    setTextEdits(prev => [...prev, edit]);
    setDocumentStateInternal(prev => ({ ...prev, isDirty: true }));
  }, []);

  // Per-page canvas state ref (mutable, doesn't trigger re-renders)
  const pageCanvasStatesRef = useRef<Map<number, PageCanvasState>>(new Map());

  const setDocumentState = useCallback((state: Partial<PDFDocumentState>) => {
    setDocumentStateInternal((prev) => ({ ...prev, ...state }));
  }, []);

  const setViewState = useCallback((state: Partial<PDFViewState>) => {
    setViewStateInternal((prev) => ({ ...prev, ...state }));
  }, []);

  const setEditState = useCallback((state: Partial<PDFEditState>) => {
    setEditStateInternal((prev) => ({ ...prev, ...state }));
  }, []);

  // Store per-page fabric canvas JSON (called by AnnotationLayer on every change)
  const setPageCanvasState = useCallback((pageNumber: number, json: any, width: number, height: number) => {
    pageCanvasStatesRef.current.set(pageNumber, { json, width, height });
  }, []);

  const loadPDF = useCallback(async (file: File) => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.624/build/pdf.worker.min.mjs`;
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      setDocumentState({
        pdfDoc: file, fileName: file.name, fileSize: file.size,
        totalPages: pdf.numPages, currentPage: 1, isDirty: false,
        sessionId: `session-${Date.now()}`,
      });
      setViewState({ zoom: 1.0, fitMode: 'width' });
      setEditState({ annotations: [], selectedAnnotation: null, undoStack: [], redoStack: [] });
      setTextEdits([]);
      pageCanvasStatesRef.current.clear();
    } catch (error) {
      console.error('Error loading PDF:', error);
      throw error;
    }
  }, [setDocumentState, setViewState, setEditState]);

  // Save PDF — embeds fabric.js annotations into the actual PDF using pdf-lib
  const savePDF = useCallback(async (): Promise<Blob | null> => {
    try {
      if (!documentState.pdfDoc) return null;
      console.log('[PDF Save] Starting save...');

      const { PDFDocument } = await import('pdf-lib');
      const fabric = await import('fabric');

      const originalBytes = await (documentState.pdfDoc as File).arrayBuffer();
      const pdfDoc = await PDFDocument.load(originalBytes);
      const pages = pdfDoc.getPages();

      for (const [pageNum, canvasState] of pageCanvasStatesRef.current.entries()) {
        const pageIndex = pageNum - 1;
        if (pageIndex < 0 || pageIndex >= pages.length) continue;

        // Skip pages with no annotations
        if (!canvasState.json?.objects || canvasState.json.objects.length === 0) continue;

        console.log(`[PDF Save] Embedding annotations for page ${pageNum}...`);

        // Create an offscreen DOM canvas to replay fabric objects
        const offscreenEl = document.createElement('canvas');
        offscreenEl.width = canvasState.width;
        offscreenEl.height = canvasState.height;

        const staticCanvas = new fabric.StaticCanvas(offscreenEl, {
          width: canvasState.width,
          height: canvasState.height,
        });

        // Load annotation JSON and render
        await staticCanvas.loadFromJSON(canvasState.json);
        staticCanvas.renderAll();

        // Export as PNG (transparent background = annotations only)
        const dataUrl = staticCanvas.toDataURL({ format: 'png', multiplier: 1 });
        staticCanvas.dispose();

        // Convert base64 to Uint8Array
        const base64 = dataUrl.split(',')[1];
        const binaryStr = atob(base64);
        const pngBytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          pngBytes[i] = binaryStr.charCodeAt(i);
        }

        // Embed PNG over the PDF page
        const pngImage = await pdfDoc.embedPng(pngBytes);
        const page = pages[pageIndex];
        const { width: pageWidth, height: pageHeight } = page.getSize();

        // Draw annotation layer on top of existing page content
        page.drawImage(pngImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });
        console.log(`[PDF Save] Page ${pageNum} annotations embedded (${pageWidth}x${pageHeight} pts)`);
      }

      // Apply text edits (Sejda-style: white-out original + draw new text)
      if (textEdits.length > 0) {
        const { StandardFonts, rgb } = await import('pdf-lib');
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        for (const edit of textEdits) {
          const pageIndex = edit.pageNumber - 1;
          if (pageIndex < 0 || pageIndex >= pages.length) continue;
          const page = pages[pageIndex];
          const { height: pageHeight } = page.getSize();

          // PDF Y origin is bottom-left; pdfY from pdf.js transform is already in PDF space
          const pdfY = edit.pdfY;

          // White rectangle to cover original text
          page.drawRectangle({
            x: edit.pdfX - 1,
            y: pdfY - edit.pdfHeight * 0.3,
            width: edit.pdfWidth + 4,
            height: edit.fontSize * 1.3,
            color: rgb(1, 1, 1),
            borderWidth: 0,
          });

          // Draw the new text
          page.drawText(edit.newText, {
            x: edit.pdfX,
            y: pdfY,
            size: edit.fontSize,
            font,
            color: rgb(0, 0, 0),
          });
        }
        console.log(`[PDF Save] Applied ${textEdits.length} text edits`);
      }

      const savedBytes = await pdfDoc.save();
      console.log('[PDF Save] Done!', savedBytes.length, 'bytes');
      return new Blob([savedBytes], { type: 'application/pdf' });
    } catch (error) {
      console.error('[PDF Save] Error:', error);
      return null;
    }
  }, [documentState.pdfDoc, textEdits]);

  const closePDF = useCallback(() => {
    setDocumentState({ pdfDoc: null, fileName: '', fileSize: 0, totalPages: 0, currentPage: 1, isDirty: false, sessionId: null });
    setEditState({ annotations: [], selectedAnnotation: null, undoStack: [], redoStack: [] });
    setTextEdits([]);
    pageCanvasStatesRef.current.clear();
  }, [setDocumentState, setEditState]);

  const addPage = useCallback((_position?: number) => {
    setDocumentState({ isDirty: true });
  }, [setDocumentState]);

  const deletePage = useCallback((_pageNumber: number) => {
    setDocumentState({ isDirty: true });
  }, [setDocumentState]);

  const rotatePage = useCallback((_pageNumber: number, _degrees: 90 | 180 | 270) => {
    setDocumentState({ isDirty: true });
  }, [setDocumentState]);

  const reorderPages = useCallback((_fromIndex: number, _toIndex: number) => {
    setDocumentState({ isDirty: true });
  }, [setDocumentState]);

  const addAnnotation = useCallback((annotation: Annotation) => {
    setEditState({ annotations: [...editState.annotations, annotation] });
    setDocumentState({ isDirty: true });
  }, [editState.annotations, setEditState, setDocumentState]);

  const updateAnnotation = useCallback((id: string, data: Partial<Annotation>) => {
    setEditState({ annotations: editState.annotations.map((ann) => ann.id === id ? { ...ann, ...data } : ann) });
    setDocumentState({ isDirty: true });
  }, [editState.annotations, setEditState, setDocumentState]);

  const deleteAnnotation = useCallback((id: string) => {
    setEditState({
      annotations: editState.annotations.filter((ann) => ann.id !== id),
      selectedAnnotation: editState.selectedAnnotation?.id === id ? null : editState.selectedAnnotation,
    });
    setDocumentState({ isDirty: true });
  }, [editState.annotations, editState.selectedAnnotation, setEditState, setDocumentState]);

  const selectAnnotation = useCallback((id: string | null) => {
    const annotation = id ? editState.annotations.find((ann) => ann.id === id) : null;
    setEditState({ selectedAnnotation: annotation || null });
  }, [editState.annotations, setEditState]);

  const undo = useCallback(() => {
    if (editState.undoStack.length === 0) return;
    const lastAction = editState.undoStack[editState.undoStack.length - 1];
    setEditState({ undoStack: editState.undoStack.slice(0, -1), redoStack: [...editState.redoStack, lastAction] });
  }, [editState.undoStack, editState.redoStack, setEditState]);

  const redo = useCallback(() => {
    if (editState.redoStack.length === 0) return;
    const lastAction = editState.redoStack[editState.redoStack.length - 1];
    setEditState({ redoStack: editState.redoStack.slice(0, -1), undoStack: [...editState.undoStack, lastAction] });
  }, [editState.undoStack, editState.redoStack, setEditState]);

  const canUndo = editState.undoStack.length > 0;
  const canRedo = editState.redoStack.length > 0;

  const zoomIn = useCallback(() => {
    setViewState({ zoom: Math.min(viewState.zoom * 1.25, 4.0), fitMode: 'actual' });
  }, [viewState.zoom, setViewState]);

  const zoomOut = useCallback(() => {
    setViewState({ zoom: Math.max(viewState.zoom * 0.8, 0.25), fitMode: 'actual' });
  }, [viewState.zoom, setViewState]);

  const setZoom = useCallback((zoom: number) => {
    setViewState({ zoom: Math.max(0.25, Math.min(4.0, zoom)), fitMode: 'actual' });
  }, [setViewState]);

  const fitToWidth = useCallback(() => setViewState({ fitMode: 'width' }), [setViewState]);
  const fitToPage = useCallback(() => setViewState({ fitMode: 'page' }), [setViewState]);

  const goToPage = useCallback((pageNumber: number) => {
    setDocumentState({ currentPage: Math.max(1, Math.min(documentState.totalPages, pageNumber)) });
  }, [documentState.totalPages, setDocumentState]);

  const nextPage = useCallback(() => {
    if (documentState.currentPage < documentState.totalPages)
      setDocumentState({ currentPage: documentState.currentPage + 1 });
  }, [documentState.currentPage, documentState.totalPages, setDocumentState]);

  const previousPage = useCallback(() => {
    if (documentState.currentPage > 1)
      setDocumentState({ currentPage: documentState.currentPage - 1 });
  }, [documentState.currentPage, setDocumentState]);

  const value: PDFEditorContextState = {
    documentState, setDocumentState,
    viewState, setViewState,
    editState, setEditState,
    loadPDF, savePDF, closePDF,
    setPageCanvasState,
    textEdits, addTextEdit,
    addPage, deletePage, rotatePage, reorderPages,
    addAnnotation, updateAnnotation, deleteAnnotation, selectAnnotation,
    undo, redo, canUndo, canRedo,
    zoomIn, zoomOut, setZoom, fitToWidth, fitToPage,
    goToPage, nextPage, previousPage,
  };

  return <PDFEditorContext.Provider value={value}>{children}</PDFEditorContext.Provider>;
};

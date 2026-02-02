import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// PDF Document State
export interface PDFDocumentState {
  pdfDoc: any | null; // pdf-lib PDFDocument
  fileName: string;
  fileSize: number;
  totalPages: number;
  currentPage: number;
  isDirty: boolean; // Has unsaved changes
  sessionId: string | null;
}

// View State
export interface PDFViewState {
  zoom: number; // 0.25 to 4.0 (25% to 400%)
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
  data: any; // Fabric.js object data
  timestamp: number;
  userId?: string;
  userName?: string;
}

export interface PDFEditState {
  mode: ToolType;
  selectedTool: ToolType;
  annotations: Annotation[];
  selectedAnnotation: Annotation | null;
  undoStack: any[];
  redoStack: any[];
  clipboardData: any | null;
}

// Context State
export interface PDFEditorContextState {
  // Document
  documentState: PDFDocumentState;
  setDocumentState: (state: Partial<PDFDocumentState>) => void;

  // View
  viewState: PDFViewState;
  setViewState: (state: Partial<PDFViewState>) => void;

  // Edit
  editState: PDFEditState;
  setEditState: (state: Partial<PDFEditState>) => void;

  // Actions
  loadPDF: (file: File) => Promise<void>;
  savePDF: () => Promise<Blob | null>;
  closePDF: () => void;

  // Page Operations
  addPage: (position?: number) => void;
  deletePage: (pageNumber: number) => void;
  rotatePage: (pageNumber: number, degrees: 90 | 180 | 270) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;

  // Annotation Operations
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, data: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  selectAnnotation: (id: string | null) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Zoom
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoom: number) => void;
  fitToWidth: () => void;
  fitToPage: () => void;

  // Navigation
  goToPage: (pageNumber: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

const PDFEditorContext = createContext<PDFEditorContextState | null>(null);

export const usePDFEditor = () => {
  const context = useContext(PDFEditorContext);
  if (!context) {
    throw new Error('usePDFEditor must be used within PDFEditorProvider');
  }
  return context;
};

interface PDFEditorProviderProps {
  children: ReactNode;
}

export const PDFEditorProvider = ({ children }: PDFEditorProviderProps) => {
  // Document State
  const [documentState, setDocumentStateInternal] = useState<PDFDocumentState>({
    pdfDoc: null,
    fileName: '',
    fileSize: 0,
    totalPages: 0,
    currentPage: 1,
    isDirty: false,
    sessionId: null,
  });

  // View State
  const [viewState, setViewStateInternal] = useState<PDFViewState>({
    zoom: 1.0,
    fitMode: 'width',
    layout: 'single',
    showThumbnails: true,
    showProperties: true,
    fullscreen: false,
  });

  // Edit State
  const [editState, setEditStateInternal] = useState<PDFEditState>({
    mode: 'select',
    selectedTool: 'select',
    annotations: [],
    selectedAnnotation: null,
    undoStack: [],
    redoStack: [],
    clipboardData: null,
  });

  // Setters with partial updates
  const setDocumentState = useCallback((state: Partial<PDFDocumentState>) => {
    setDocumentStateInternal((prev) => ({ ...prev, ...state }));
  }, []);

  const setViewState = useCallback((state: Partial<PDFViewState>) => {
    setViewStateInternal((prev) => ({ ...prev, ...state }));
  }, []);

  const setEditState = useCallback((state: Partial<PDFEditState>) => {
    setEditStateInternal((prev) => ({ ...prev, ...state }));
  }, []);

  // Load PDF
  const loadPDF = useCallback(async (file: File) => {
    try {
      console.log('Loading PDF:', file.name);

      // Dynamically import PDF.js
      const pdfjsLib = await import('pdfjs-dist');

      // Configure worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      // Load PDF to get page count
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      // Set document state with page count
      setDocumentState({
        pdfDoc: file, // Store the File object for PDFCanvas to use
        fileName: file.name,
        fileSize: file.size,
        totalPages: pdf.numPages,
        currentPage: 1,
        isDirty: false,
        sessionId: `session-${Date.now()}`,
      });

      // Reset view state
      setViewState({
        zoom: 1.0,
        fitMode: 'width',
      });

      // Reset edit state
      setEditState({
        annotations: [],
        selectedAnnotation: null,
        undoStack: [],
        redoStack: [],
      });

      console.log(`PDF loaded: ${pdf.numPages} pages`);
    } catch (error) {
      console.error('Error loading PDF:', error);
      throw error;
    }
  }, [setDocumentState, setViewState, setEditState]);

  // Save PDF
  const savePDF = useCallback(async (): Promise<Blob | null> => {
    try {
      console.log('Saving PDF...');

      // TODO: Implement PDF.js/pdf-lib saving with annotations
      // For now, return null
      return null;

    } catch (error) {
      console.error('Error saving PDF:', error);
      return null;
    }
  }, [documentState, editState]);

  // Close PDF
  const closePDF = useCallback(() => {
    setDocumentState({
      pdfDoc: null,
      fileName: '',
      fileSize: 0,
      totalPages: 0,
      currentPage: 1,
      isDirty: false,
      sessionId: null,
    });

    setEditState({
      annotations: [],
      selectedAnnotation: null,
      undoStack: [],
      redoStack: [],
    });
  }, [setDocumentState, setEditState]);

  // Page Operations
  const addPage = useCallback((position?: number) => {
    console.log('Adding page at position:', position);
    // TODO: Implement page addition
    setDocumentState({ isDirty: true });
  }, [setDocumentState]);

  const deletePage = useCallback((pageNumber: number) => {
    console.log('Deleting page:', pageNumber);
    // TODO: Implement page deletion
    setDocumentState({ isDirty: true });
  }, [setDocumentState]);

  const rotatePage = useCallback((pageNumber: number, degrees: 90 | 180 | 270) => {
    console.log(`Rotating page ${pageNumber} by ${degrees} degrees`);
    // TODO: Implement page rotation
    setDocumentState({ isDirty: true });
  }, [setDocumentState]);

  const reorderPages = useCallback((fromIndex: number, toIndex: number) => {
    console.log(`Reordering page from ${fromIndex} to ${toIndex}`);
    // TODO: Implement page reordering
    setDocumentState({ isDirty: true });
  }, [setDocumentState]);

  // Annotation Operations
  const addAnnotation = useCallback((annotation: Annotation) => {
    setEditState({
      annotations: [...editState.annotations, annotation],
    });
    setDocumentState({ isDirty: true });
  }, [editState.annotations, setEditState, setDocumentState]);

  const updateAnnotation = useCallback((id: string, data: Partial<Annotation>) => {
    setEditState({
      annotations: editState.annotations.map((ann) =>
        ann.id === id ? { ...ann, ...data } : ann
      ),
    });
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

  // Undo/Redo
  const undo = useCallback(() => {
    if (editState.undoStack.length === 0) return;

    const lastAction = editState.undoStack[editState.undoStack.length - 1];
    console.log('Undo:', lastAction);

    // TODO: Implement undo logic
    setEditState({
      undoStack: editState.undoStack.slice(0, -1),
      redoStack: [...editState.redoStack, lastAction],
    });
  }, [editState.undoStack, editState.redoStack, setEditState]);

  const redo = useCallback(() => {
    if (editState.redoStack.length === 0) return;

    const lastAction = editState.redoStack[editState.redoStack.length - 1];
    console.log('Redo:', lastAction);

    // TODO: Implement redo logic
    setEditState({
      redoStack: editState.redoStack.slice(0, -1),
      undoStack: [...editState.undoStack, lastAction],
    });
  }, [editState.undoStack, editState.redoStack, setEditState]);

  const canUndo = editState.undoStack.length > 0;
  const canRedo = editState.redoStack.length > 0;

  // Zoom Operations
  const zoomIn = useCallback(() => {
    const newZoom = Math.min(viewState.zoom * 1.25, 4.0);
    setViewState({ zoom: newZoom, fitMode: 'actual' });
  }, [viewState.zoom, setViewState]);

  const zoomOut = useCallback(() => {
    const newZoom = Math.max(viewState.zoom * 0.8, 0.25);
    setViewState({ zoom: newZoom, fitMode: 'actual' });
  }, [viewState.zoom, setViewState]);

  const setZoom = useCallback((zoom: number) => {
    const clampedZoom = Math.max(0.25, Math.min(4.0, zoom));
    setViewState({ zoom: clampedZoom, fitMode: 'actual' });
  }, [setViewState]);

  const fitToWidth = useCallback(() => {
    setViewState({ fitMode: 'width' });
  }, [setViewState]);

  const fitToPage = useCallback(() => {
    setViewState({ fitMode: 'page' });
  }, [setViewState]);

  // Navigation
  const goToPage = useCallback((pageNumber: number) => {
    const clampedPage = Math.max(1, Math.min(documentState.totalPages, pageNumber));
    setDocumentState({ currentPage: clampedPage });
  }, [documentState.totalPages, setDocumentState]);

  const nextPage = useCallback(() => {
    if (documentState.currentPage < documentState.totalPages) {
      setDocumentState({ currentPage: documentState.currentPage + 1 });
    }
  }, [documentState.currentPage, documentState.totalPages, setDocumentState]);

  const previousPage = useCallback(() => {
    if (documentState.currentPage > 1) {
      setDocumentState({ currentPage: documentState.currentPage - 1 });
    }
  }, [documentState.currentPage, setDocumentState]);

  const value: PDFEditorContextState = {
    documentState,
    setDocumentState,
    viewState,
    setViewState,
    editState,
    setEditState,
    loadPDF,
    savePDF,
    closePDF,
    addPage,
    deletePage,
    rotatePage,
    reorderPages,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    selectAnnotation,
    undo,
    redo,
    canUndo,
    canRedo,
    zoomIn,
    zoomOut,
    setZoom,
    fitToWidth,
    fitToPage,
    goToPage,
    nextPage,
    previousPage,
  };

  return (
    <PDFEditorContext.Provider value={value}>
      {children}
    </PDFEditorContext.Provider>
  );
};

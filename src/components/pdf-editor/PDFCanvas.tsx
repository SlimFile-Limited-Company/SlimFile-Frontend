import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { usePDFEditor } from '@/contexts/PDFEditorContext';
import TextEditLayer from './TextEditLayer';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.624/build/pdf.worker.min.mjs`;

interface PDFCanvasProps {
  className?: string;
}

export default function PDFCanvas({ className = '' }: PDFCanvasProps) {
  const { documentState, viewState, textEdits } = usePDFEditor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [currentPageObj, setCurrentPageObj] = useState<any>(null);
  const [displayScale, setDisplayScale] = useState(1);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

  // Load PDF document
  useEffect(() => {
    if (!documentState.pdfDoc) return;

    const loadPDF = async () => {
      try {
        setIsRendering(true);
        setError(null);

        let pdfData: ArrayBuffer;
        if (documentState.pdfDoc instanceof File) {
          pdfData = await documentState.pdfDoc.arrayBuffer();
        } else {
          pdfData = documentState.pdfDoc;
        }

        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        setPdfDocument(pdf);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF. Please try another file.');
      } finally {
        setIsRendering(false);
      }
    };

    loadPDF();
  }, [documentState.pdfDoc]);

  // Core render function — renders to canvas at correct scale
  const renderPageToCanvas = useCallback(async (page: any, scale: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    const outputScale = dpr * scale;
    const scaledViewport = page.getViewport({ scale: outputScale });

    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;
    canvas.style.width = `${scaledViewport.width / dpr}px`;
    canvas.style.height = `${scaledViewport.height / dpr}px`;

    setCanvasDimensions({ width: scaledViewport.width / dpr, height: scaledViewport.height / dpr });
    setDisplayScale(scale);

    await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
  }, []);

  // Calculate scale from viewState
  const calcScale = useCallback((viewport: any) => {
    let scale = viewState.zoom;
    if (viewState.fitMode === 'width') {
      const containerWidth = containerRef.current?.clientWidth || window.innerWidth * 0.7;
      scale = (containerWidth * 0.95) / viewport.width;
    } else if (viewState.fitMode === 'page') {
      const containerWidth = containerRef.current?.clientWidth || window.innerWidth * 0.7;
      const containerHeight = containerRef.current?.clientHeight || window.innerHeight * 0.8;
      scale = Math.min((containerWidth * 0.95) / viewport.width, (containerHeight * 0.95) / viewport.height);
    }
    return Math.max(scale, 1.2);
  }, [viewState.zoom, viewState.fitMode]);

  // Render current page (initial + zoom/page changes)
  useEffect(() => {
    if (!pdfDocument || documentState.currentPage < 1) return;

    const renderPage = async () => {
      try {
        setIsRendering(true);
        setError(null);

        const page = await pdfDocument.getPage(documentState.currentPage);
        setCurrentPageObj(page);

        const baseViewport = page.getViewport({ scale: 1.0 });
        const scale = calcScale(baseViewport);

        await renderPageToCanvas(page, scale);
      } catch (err) {
        console.error('Error rendering page:', err);
        setError('Failed to render page. Please try refreshing.');
      } finally {
        setIsRendering(false);
      }
    };

    renderPage();
  }, [pdfDocument, documentState.currentPage, viewState.zoom, viewState.fitMode]);

  // Re-render page with text edits baked in whenever edits change
  useEffect(() => {
    if (!documentState.pdfDoc || !canvasRef.current || textEdits.length === 0) return;

    const pageEdits = textEdits.filter(e => e.pageNumber === documentState.currentPage);
    if (pageEdits.length === 0) return;

    const rerender = async () => {
      try {
        const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');

        const originalBytes = await (documentState.pdfDoc as File).arrayBuffer();
        const pdfDoc = await PDFDocument.load(originalBytes);
        const pages = pdfDoc.getPages();
        const page = pages[documentState.currentPage - 1];
        const { height: pageHeight } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        for (const edit of pageEdits) {
          // Cover original text with a rectangle matching the page background
          // We use a slightly wider/taller rect to fully erase the original
          page.drawRectangle({
            x: edit.pdfX - 2,
            y: edit.pdfY - edit.fontSize * 0.25,
            width: edit.pdfWidth + 8,
            height: edit.fontSize * 1.4,
            color: rgb(1, 1, 1),
            borderWidth: 0,
            opacity: 1,
          });

          page.drawText(edit.newText, {
            x: edit.pdfX,
            y: edit.pdfY,
            size: edit.fontSize,
            font,
            color: rgb(0, 0, 0),
          });
        }

        const modifiedBytes = await pdfDoc.save();
        const modifiedPdf = await pdfjsLib.getDocument({ data: modifiedBytes }).promise;
        const modifiedPage = await modifiedPdf.getPage(documentState.currentPage);

        setCurrentPageObj(modifiedPage);

        const baseViewport = modifiedPage.getViewport({ scale: 1.0 });
        const scale = calcScale(baseViewport);
        await renderPageToCanvas(modifiedPage, scale);
      } catch (err) {
        console.error('Error re-rendering with edits:', err);
      }
    };

    rerender();
  }, [textEdits]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-white rounded-lg shadow-lg p-8 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠</div>
          <p className="text-red-600 font-semibold mb-2">Error Loading PDF</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {isRendering && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-30 rounded-lg">
          <div className="bg-white rounded-full px-6 py-3 shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
            <span className="text-sm font-medium text-gray-700">Rendering...</span>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="shadow-2xl rounded-lg bg-white block" />

      {canvasDimensions.width > 0 && currentPageObj && (
        <TextEditLayer
          pdfPage={currentPageObj}
          displayScale={displayScale}
          canvasWidth={canvasDimensions.width}
          canvasHeight={canvasDimensions.height}
        />
      )}
    </div>
  );
}

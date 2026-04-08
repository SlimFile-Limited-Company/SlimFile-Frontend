import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { usePDFEditor } from '@/contexts/PDFEditorContext';
import TextEditLayer from './TextEditLayer';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.624/build/pdf.worker.min.mjs`;

interface PDFCanvasProps {
  className?: string;
}

export default function PDFCanvas({ className = '' }: PDFCanvasProps) {
  const { documentState, viewState } = usePDFEditor();
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

        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;
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

  // Render current page
  useEffect(() => {
    if (!pdfDocument || !canvasRef.current || documentState.currentPage < 1) return;

    const renderPage = async () => {
      try {
        setIsRendering(true);
        setError(null);

        const page = await pdfDocument.getPage(documentState.currentPage);
        setCurrentPageObj(page);
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;

        const dpr = window.devicePixelRatio || 1;
        let scale = viewState.zoom;
        const viewport = page.getViewport({ scale: 1.0 });

        if (viewState.fitMode === 'width') {
          const containerWidth = containerRef.current?.clientWidth || window.innerWidth * 0.7;
          scale = (containerWidth * 0.95) / viewport.width;
        } else if (viewState.fitMode === 'page') {
          const containerWidth = containerRef.current?.clientWidth || window.innerWidth * 0.7;
          const containerHeight = containerRef.current?.clientHeight || window.innerHeight * 0.8;
          const scaleX = (containerWidth * 0.95) / viewport.width;
          const scaleY = (containerHeight * 0.95) / viewport.height;
          scale = Math.min(scaleX, scaleY);
        }

        scale = Math.max(scale, 1.2);

        const outputScale = dpr * scale;
        const scaledViewport = page.getViewport({ scale: outputScale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        canvas.style.width = `${scaledViewport.width / dpr}px`;
        canvas.style.height = `${scaledViewport.height / dpr}px`;

        const cssW = scaledViewport.width / dpr;
        const cssH = scaledViewport.height / dpr;
        setCanvasDimensions({ width: cssW, height: cssH });
        setDisplayScale(scale);

        await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
      } catch (err) {
        console.error('Error rendering page:', err);
        setError('Failed to render page. Please try refreshing.');
      } finally {
        setIsRendering(false);
      }
    };

    renderPage();
  }, [pdfDocument, documentState.currentPage, viewState.zoom, viewState.fitMode]);

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

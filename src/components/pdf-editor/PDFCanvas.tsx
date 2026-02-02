import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { usePDFEditor } from '@/contexts/PDFEditorContext';
import AnnotationLayer from './AnnotationLayer';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.624/build/pdf.worker.min.mjs`;

interface PDFCanvasProps {
  className?: string;
}

export default function PDFCanvas({ className = '' }: PDFCanvasProps) {
  const { documentState, viewState } = usePDFEditor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
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

        // If pdfDoc is a File object, convert to ArrayBuffer
        let pdfData: ArrayBuffer;
        if (documentState.pdfDoc instanceof File) {
          pdfData = await documentState.pdfDoc.arrayBuffer();
        } else {
          pdfData = documentState.pdfDoc;
        }

        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;

        setPdfDocument(pdf);
        console.log('PDF loaded successfully:', pdf.numPages, 'pages');
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
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;

        // Get device pixel ratio for high-DPI displays (Retina, etc.)
        const dpr = window.devicePixelRatio || 1;

        // Calculate scale based on zoom and fitMode
        let scale = viewState.zoom;
        const viewport = page.getViewport({ scale: 1.0 });

        if (viewState.fitMode === 'width') {
          // Fit to available width - use container width for better calculation
          const containerWidth = containerRef.current?.clientWidth || window.innerWidth * 0.7;
          scale = (containerWidth * 0.95) / viewport.width; // Use 95% of container width
        } else if (viewState.fitMode === 'page') {
          // Fit entire page to viewport
          const containerWidth = containerRef.current?.clientWidth || window.innerWidth * 0.7;
          const containerHeight = containerRef.current?.clientHeight || window.innerHeight * 0.8;
          const scaleX = (containerWidth * 0.95) / viewport.width;
          const scaleY = (containerHeight * 0.95) / viewport.height;
          scale = Math.min(scaleX, scaleY);
        }

        // Ensure minimum scale for readability (1.2 = 120% minimum size)
        scale = Math.max(scale, 1.2);

        // Apply device pixel ratio for crisp rendering on high-DPI screens
        const outputScale = dpr * scale;
        const scaledViewport = page.getViewport({ scale: outputScale });

        // Set actual canvas dimensions (higher resolution)
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // Set CSS dimensions (display size)
        canvas.style.width = `${scaledViewport.width / dpr}px`;
        canvas.style.height = `${scaledViewport.height / dpr}px`;

        // Update dimensions for annotation layer (use display size)
        setCanvasDimensions({
          width: scaledViewport.width / dpr,
          height: scaledViewport.height / dpr,
        });

        // Render PDF page with high quality
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        await page.render(renderContext).promise;
        console.log(`Rendered page ${documentState.currentPage} at ${Math.round(scale * 100)}% zoom`);
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
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Loading Overlay */}
      {isRendering && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
          <div className="bg-white rounded-full px-6 py-3 shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
            <span className="text-sm font-medium text-gray-700">Rendering...</span>
          </div>
        </div>
      )}

      {/* PDF Canvas */}
      <canvas
        ref={canvasRef}
        className="mx-auto shadow-2xl rounded-lg bg-white"
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />

      {/* Fabric.js Annotation Layer */}
      {canvasDimensions.width > 0 && canvasDimensions.height > 0 && (
        <AnnotationLayer
          pageNumber={documentState.currentPage}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
        />
      )}
    </div>
  );
}

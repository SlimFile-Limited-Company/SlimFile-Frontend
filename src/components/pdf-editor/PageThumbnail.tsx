import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { usePDFEditor } from '@/contexts/PDFEditorContext';

interface PageThumbnailProps {
  pageNumber: number;
  onClick?: () => void;
}

export default function PageThumbnail({ pageNumber, onClick }: PageThumbnailProps) {
  const { documentState } = usePDFEditor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const isActive = documentState.currentPage === pageNumber;

  useEffect(() => {
    if (!documentState.pdfDoc || !canvasRef.current) return;

    const renderThumbnail = async () => {
      try {
        setIsRendering(true);

        // Load PDF
        const arrayBuffer = await (documentState.pdfDoc as File).arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        // Get page
        const page = await pdf.getPage(pageNumber);
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;

        // Calculate scale for thumbnail (fixed width of 180px)
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = 180 / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        // Set canvas size
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // Render
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error('Error rendering thumbnail:', err);
      } finally {
        setIsRendering(false);
      }
    };

    renderThumbnail();
  }, [documentState.pdfDoc, pageNumber]);

  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
        isActive
          ? 'border-red-500 shadow-lg ring-2 ring-red-200'
          : 'border-gray-300 hover:border-red-300 hover:shadow-md'
      }`}
    >
      <div className="relative bg-white">
        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          style={{ display: isRendering ? 'none' : 'block' }}
        />
      </div>
      <div className={`px-2 py-1 text-xs text-center font-medium ${
        isActive ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        Page {pageNumber}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  RotateCw,
  Trash2,
  Copy,
  Scissors,
  Plus,
  Download,
  X
} from 'lucide-react';
import { usePDFEditor } from '@/contexts/PDFEditorContext';

interface PageOperationsDialogProps {
  pageNumber: number;
  onClose: () => void;
}

export default function PageOperationsDialog({ pageNumber, onClose }: PageOperationsDialogProps) {
  const { rotatePage, deletePage, documentState } = usePDFEditor();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRotate = async (degrees: 90 | 180 | 270) => {
    setIsProcessing(true);
    try {
      await rotatePage(pageNumber, degrees);
      console.log(`Rotated page ${pageNumber} by ${degrees}°`);
    } catch (error) {
      console.error('Error rotating page:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete page ${pageNumber}? This action cannot be undone.`)) {
      return;
    }

    setIsProcessing(true);
    try {
      await deletePage(pageNumber);
      console.log(`Deleted page ${pageNumber}`);
      onClose();
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDuplicate = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implement duplicate functionality
      console.log(`Duplicate page ${pageNumber}`);
    } catch (error) {
      console.error('Error duplicating page:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtract = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implement extract functionality
      console.log(`Extract page ${pageNumber}`);
    } catch (error) {
      console.error('Error extracting page:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Page {pageNumber} Operations
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Processing...</p>
            </div>
          </div>
        )}

        {/* Operations Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Rotate 90° */}
          <Button
            onClick={() => handleRotate(90)}
            variant="outline"
            className="h-20 flex-col gap-2 hover:border-red-500 hover:text-red-600"
            disabled={isProcessing}
          >
            <RotateCw className="w-6 h-6" />
            <span className="text-sm font-medium">Rotate 90°</span>
          </Button>

          {/* Rotate 180° */}
          <Button
            onClick={() => handleRotate(180)}
            variant="outline"
            className="h-20 flex-col gap-2 hover:border-red-500 hover:text-red-600"
            disabled={isProcessing}
          >
            <RotateCw className="w-6 h-6" />
            <span className="text-sm font-medium">Rotate 180°</span>
          </Button>

          {/* Duplicate */}
          <Button
            onClick={handleDuplicate}
            variant="outline"
            className="h-20 flex-col gap-2 hover:border-blue-500 hover:text-blue-600"
            disabled={isProcessing}
          >
            <Copy className="w-6 h-6" />
            <span className="text-sm font-medium">Duplicate</span>
          </Button>

          {/* Extract */}
          <Button
            onClick={handleExtract}
            variant="outline"
            className="h-20 flex-col gap-2 hover:border-green-500 hover:text-green-600"
            disabled={isProcessing}
          >
            <Download className="w-6 h-6" />
            <span className="text-sm font-medium">Extract</span>
          </Button>

          {/* Delete */}
          <Button
            onClick={handleDelete}
            variant="outline"
            className="h-20 flex-col gap-2 hover:border-red-500 hover:text-red-600 col-span-2"
            disabled={isProcessing || documentState.totalPages <= 1}
          >
            <Trash2 className="w-6 h-6" />
            <span className="text-sm font-medium">
              {documentState.totalPages <= 1 ? 'Cannot delete last page' : 'Delete Page'}
            </span>
          </Button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Tip:</strong> These operations will modify your PDF. Make sure to save your work!
          </p>
        </div>
      </div>
    </div>
  );
}

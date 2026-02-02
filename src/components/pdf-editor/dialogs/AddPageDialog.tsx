import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { usePDFEditor } from '@/contexts/PDFEditorContext';

interface AddPageDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPageDialog({ isOpen, onClose }: AddPageDialogProps) {
  const { addPage, documentState } = usePDFEditor();
  const [pageSize, setPageSize] = useState<'letter' | 'a4' | 'legal'>('letter');
  const [position, setPosition] = useState<'end' | 'after-current' | 'before-current'>('end');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAddPage = async () => {
    setIsProcessing(true);
    try {
      let insertPosition: number | undefined;

      if (position === 'after-current') {
        insertPosition = documentState.currentPage;
      } else if (position === 'before-current') {
        insertPosition = documentState.currentPage - 1;
      }

      await addPage(insertPosition);
      console.log(`Added ${pageSize} page at position ${position}`);
      onClose();
    } catch (error) {
      console.error('Error adding page:', error);
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Add Blank Page</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Page Size Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Page Size
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPageSize('letter')}
              className={`p-4 border-2 rounded-lg transition-all ${
                pageSize === 'letter'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-sm font-semibold mb-1">US Letter</div>
              <div className="text-xs text-gray-600">8.5" × 11"</div>
            </button>

            <button
              onClick={() => setPageSize('a4')}
              className={`p-4 border-2 rounded-lg transition-all ${
                pageSize === 'a4'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-sm font-semibold mb-1">A4</div>
              <div className="text-xs text-gray-600">210 × 297 mm</div>
            </button>

            <button
              onClick={() => setPageSize('legal')}
              className={`p-4 border-2 rounded-lg transition-all ${
                pageSize === 'legal'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-sm font-semibold mb-1">Legal</div>
              <div className="text-xs text-gray-600">8.5" × 14"</div>
            </button>
          </div>
        </div>

        {/* Position Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Insert Position
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setPosition('end')}
              className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                position === 'end'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">At the end</div>
              <div className="text-xs text-gray-600">After page {documentState.totalPages}</div>
            </button>

            <button
              onClick={() => setPosition('after-current')}
              className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                position === 'after-current'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">After current page</div>
              <div className="text-xs text-gray-600">After page {documentState.currentPage}</div>
            </button>

            <button
              onClick={() => setPosition('before-current')}
              className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                position === 'before-current'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">Before current page</div>
              <div className="text-xs text-gray-600">Before page {documentState.currentPage}</div>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddPage}
            className="flex-1 bg-red-600 hover:bg-red-700"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Page
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Scissors, X } from 'lucide-react';
import { usePDFEditor } from '@/contexts/PDFEditorContext';

interface SplitPDFDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type SplitMode = 'range' | 'every-n' | 'bookmarks';

export default function SplitPDFDialog({ isOpen, onClose }: SplitPDFDialogProps) {
  const { documentState } = usePDFEditor();
  const [splitMode, setSplitMode] = useState<SplitMode>('range');
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(documentState.totalPages);
  const [everyNPages, setEveryNPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const splitByRange = async (start: number, end: number, filename: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
    const formData = new FormData();
    formData.append('pdf', documentState.pdfDoc as File);
    formData.append('startPage', String(start));
    formData.append('endPage', String(end));

    const response = await fetch(`${API_BASE_URL}/pdf/split`, { method: 'POST', body: formData });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Split failed');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSplitByRange = async () => {
    if (startPage < 1 || endPage > documentState.totalPages || startPage > endPage) {
      alert('Invalid page range');
      return;
    }
    setIsProcessing(true);
    try {
      await splitByRange(startPage, endPage, `pages-${startPage}-${endPage}.pdf`);
      onClose();
    } catch (error: any) {
      console.error('Error splitting PDF:', error);
      alert(error.message || 'Failed to split PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSplitEveryN = async () => {
    if (everyNPages < 1 || everyNPages > documentState.totalPages) {
      alert('Invalid page count');
      return;
    }
    setIsProcessing(true);
    try {
      const total = documentState.totalPages;
      const chunks = Math.ceil(total / everyNPages);
      for (let i = 0; i < chunks; i++) {
        const start = i * everyNPages + 1;
        const end = Math.min((i + 1) * everyNPages, total);
        await splitByRange(start, end, `part-${i + 1}-pages-${start}-${end}.pdf`);
      }
      onClose();
    } catch (error: any) {
      console.error('Error splitting PDF:', error);
      alert(error.message || 'Failed to split PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSplitByBookmarks = async () => {
    // Bookmarks require parsing the PDF outline — not supported via the current backend endpoint
    alert('Split by bookmarks is not yet supported. Use "Extract Page Range" instead.');
  };

  const handleSplit = () => {
    switch (splitMode) {
      case 'range':
        handleSplitByRange();
        break;
      case 'every-n':
        handleSplitEveryN();
        break;
      case 'bookmarks':
        handleSplitByBookmarks();
        break;
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
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Split PDF</h3>
              <p className="text-sm text-gray-600">{documentState.totalPages} pages total</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Split Method
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setSplitMode('range')}
              className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                splitMode === 'range'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">Extract Page Range</div>
              <div className="text-xs text-gray-600">Extract specific pages</div>
            </button>

            <button
              onClick={() => setSplitMode('every-n')}
              className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                splitMode === 'every-n'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">Split Every N Pages</div>
              <div className="text-xs text-gray-600">Create multiple files</div>
            </button>

            <button
              onClick={() => setSplitMode('bookmarks')}
              className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                splitMode === 'bookmarks'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">Split by Bookmarks</div>
              <div className="text-xs text-gray-600">Each bookmark becomes a file</div>
            </button>
          </div>
        </div>

        {/* Split Options */}
        <div className="mb-6">
          {splitMode === 'range' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Page</label>
                <input
                  type="number"
                  value={startPage}
                  onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                  min={1}
                  max={documentState.totalPages}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Page</label>
                <input
                  type="number"
                  value={endPage}
                  onChange={(e) => setEndPage(parseInt(e.target.value) || documentState.totalPages)}
                  min={1}
                  max={documentState.totalPages}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-900">
                  Will extract pages {startPage} to {endPage} ({endPage - startPage + 1} pages)
                </p>
              </div>
            </div>
          )}

          {splitMode === 'every-n' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Pages per file</label>
                <input
                  type="number"
                  value={everyNPages}
                  onChange={(e) => setEveryNPages(parseInt(e.target.value) || 1)}
                  min={1}
                  max={documentState.totalPages}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-900">
                  Will create {Math.ceil(documentState.totalPages / everyNPages)} file(s)
                </p>
              </div>
            </div>
          )}

          {splitMode === 'bookmarks' && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                This will detect bookmarks in your PDF and create a separate file for each bookmark section.
              </p>
            </div>
          )}
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
            onClick={handleSplit}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Splitting...
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4 mr-2" />
                Split PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, FileUp, GripVertical, Trash2 } from 'lucide-react';

interface MergePDFDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPDF?: File;
}

interface PDFFileItem {
  id: string;
  file: File;
  pageCount: number;
}

export default function MergePDFDialog({ isOpen, onClose, currentPDF }: MergePDFDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfFiles, setPdfFiles] = useState<PDFFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Pre-load the currently open PDF when dialog opens
  useState(() => {
    if (isOpen && currentPDF && pdfFiles.length === 0) {
      (async () => {
        try {
          const pdfjsLib = await import('pdfjs-dist');
          const arrayBuffer = await currentPDF.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          setPdfFiles([{ id: `pdf-current-${Date.now()}`, file: currentPDF, pageCount: pdf.numPages }]);
        } catch { /* ignore */ }
      })();
    }
  });

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFilesToAdd: PDFFileItem[] = [];

    for (const file of files) {
      if (file.type === 'application/pdf') {
        try {
          // Load PDF to get page count
          const pdfjsLib = await import('pdfjs-dist');
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

          pdfFilesToAdd.push({
            id: `pdf-${Date.now()}-${Math.random()}`,
            file,
            pageCount: pdf.numPages,
          });
        } catch (error) {
          console.error('Error loading PDF:', error);
        }
      }
    }

    setPdfFiles([...pdfFiles, ...pdfFilesToAdd]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (id: string) => {
    setPdfFiles(pdfFiles.filter((f) => f.id !== id));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newFiles = [...pdfFiles];
    const draggedFile = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedFile);

    setPdfFiles(newFiles);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleMergePDFs = async () => {
    if (pdfFiles.length < 2) {
      alert('Please add at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
      const formData = new FormData();
      pdfFiles.forEach((item) => formData.append('pdfs', item.file));

      const response = await fetch(`${API_BASE_URL}/pdf/merge`, { method: 'POST', body: formData });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Merge failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onClose();
    } catch (error: any) {
      console.error('Error merging PDFs:', error);
      alert(error.message || 'Failed to merge PDFs. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPages = pdfFiles.reduce((sum, f) => sum + f.pageCount, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Merge PDFs</h3>
              <p className="text-sm text-gray-600">Combine multiple PDFs into one</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Files Button */}
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full border-2 border-dashed hover:border-blue-500 hover:bg-blue-50"
          >
            <FileUp className="w-4 h-4 mr-2" />
            Add PDF Files
          </Button>
        </div>

        {/* PDF List */}
        {pdfFiles.length > 0 ? (
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>{pdfFiles.length} file(s) • {totalPages} total pages</span>
              <span className="text-xs">Drag to reorder</span>
            </div>

            {pdfFiles.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 transition-all cursor-move ${
                  draggedIndex === index ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                }`}
              >
                <GripVertical className="w-5 h-5 text-gray-400" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {index + 1}. {item.file.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {item.pageCount} pages • {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveFile(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-2"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg mb-6">
            <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No files added yet</p>
            <p className="text-sm text-gray-500">Click "Add PDF Files" to start</p>
          </div>
        )}

        {/* Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-900">
            <strong>Tip:</strong> Drag files to reorder them before merging. The final PDF will follow this order.
          </p>
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
            onClick={handleMergePDFs}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={pdfFiles.length < 2 || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Merging...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Merge {pdfFiles.length} PDFs
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Trash2, Download, X } from 'lucide-react';
import { usePDFEditor } from '@/contexts/PDFEditorContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface PageOperationsDialogProps {
  pageNumber: number;
  onClose: () => void;
}

export default function PageOperationsDialog({ pageNumber, onClose }: PageOperationsDialogProps) {
  const { documentState, loadPDF } = usePDFEditor();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState('');

  const reloadFromBlob = async (blob: Blob, name: string) => {
    const file = new File([blob], name, { type: 'application/pdf' });
    await loadPDF(file);
  };

  const handleRotate = async (degrees: 90 | 180 | 270) => {
    setIsProcessing(true);
    setProcessingLabel(`Rotating ${degrees}°...`);
    try {
      const formData = new FormData();
      formData.append('pdf', documentState.pdfDoc as File);
      formData.append('pageNumber', String(pageNumber));
      formData.append('degrees', String(degrees));

      const response = await fetch(`${API_BASE_URL}/pdf/rotate`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Rotate failed');

      const blob = await response.blob();
      await reloadFromBlob(blob, documentState.fileName);
      onClose();
    } catch (error) {
      console.error('Error rotating page:', error);
      alert('Failed to rotate page. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete page ${pageNumber}? This cannot be undone.`)) return;
    setIsProcessing(true);
    setProcessingLabel('Deleting page...');
    try {
      const formData = new FormData();
      formData.append('pdf', documentState.pdfDoc as File);
      formData.append('pageNumbers', JSON.stringify([pageNumber]));

      const response = await fetch(`${API_BASE_URL}/pdf/delete-pages`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Delete failed');

      const blob = await response.blob();
      await reloadFromBlob(blob, documentState.fileName);
      onClose();
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtract = async () => {
    setIsProcessing(true);
    setProcessingLabel('Extracting page...');
    try {
      const formData = new FormData();
      formData.append('pdf', documentState.pdfDoc as File);
      formData.append('startPage', String(pageNumber));
      formData.append('endPage', String(pageNumber));

      const response = await fetch(`${API_BASE_URL}/pdf/split`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Extract failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `page-${pageNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error('Error extracting page:', error);
      alert('Failed to extract page. Please try again.');
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
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">{processingLabel}</p>
            </div>
          </div>
        )}

        {/* Operations Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => handleRotate(90)} variant="outline"
            className="h-20 flex-col gap-2 hover:border-red-500 hover:text-red-600" disabled={isProcessing}>
            <RotateCw className="w-6 h-6" />
            <span className="text-sm font-medium">Rotate 90°</span>
          </Button>

          <Button onClick={() => handleRotate(180)} variant="outline"
            className="h-20 flex-col gap-2 hover:border-red-500 hover:text-red-600" disabled={isProcessing}>
            <RotateCw className="w-6 h-6" />
            <span className="text-sm font-medium">Rotate 180°</span>
          </Button>

          <Button onClick={handleExtract} variant="outline"
            className="h-20 flex-col gap-2 hover:border-green-500 hover:text-green-600" disabled={isProcessing}>
            <Download className="w-6 h-6" />
            <span className="text-sm font-medium">Extract Page</span>
          </Button>

          <Button onClick={handleDelete} variant="outline"
            className="h-20 flex-col gap-2 hover:border-red-500 hover:text-red-600"
            disabled={isProcessing || documentState.totalPages <= 1}>
            <Trash2 className="w-6 h-6" />
            <span className="text-sm font-medium">
              {documentState.totalPages <= 1 ? 'Last page' : 'Delete Page'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

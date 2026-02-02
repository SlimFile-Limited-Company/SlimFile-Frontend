import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileSearch, X, Download, Copy, Check } from 'lucide-react';
import { usePDFEditor } from '@/contexts/PDFEditorContext';

interface OCRDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type OCRLanguage = 'eng' | 'spa' | 'fra' | 'deu' | 'ita' | 'por' | 'rus' | 'chi_sim' | 'jpn' | 'kor';

const LANGUAGES = [
  { code: 'eng' as OCRLanguage, name: 'English' },
  { code: 'spa' as OCRLanguage, name: 'Spanish' },
  { code: 'fra' as OCRLanguage, name: 'French' },
  { code: 'deu' as OCRLanguage, name: 'German' },
  { code: 'ita' as OCRLanguage, name: 'Italian' },
  { code: 'por' as OCRLanguage, name: 'Portuguese' },
  { code: 'rus' as OCRLanguage, name: 'Russian' },
  { code: 'chi_sim' as OCRLanguage, name: 'Chinese (Simplified)' },
  { code: 'jpn' as OCRLanguage, name: 'Japanese' },
  { code: 'kor' as OCRLanguage, name: 'Korean' },
];

export default function OCRDialog({ isOpen, onClose }: OCRDialogProps) {
  const { documentState } = usePDFEditor();
  const [selectedLanguage, setSelectedLanguage] = useState<OCRLanguage>('eng');
  const [applyToAll, setApplyToAll] = useState(true);
  const [specificPages, setSpecificPages] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleRunOCR = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implement actual OCR API call
      console.log('Running OCR with language:', selectedLanguage);
      console.log('Apply to all pages:', applyToAll);
      if (!applyToAll) {
        console.log('Specific pages:', specificPages);
      }

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock extracted text
      const mockText = `This is sample text extracted from your PDF using OCR.

The OCR process analyzed the images and scanned content in your document and converted them to searchable, editable text.

Key Features:
- Multi-language support
- High accuracy recognition
- Preserves document structure
- Exports to various formats

This text can now be:
1. Copied to clipboard
2. Downloaded as TXT file
3. Searched within the PDF
4. Edited if needed

Language detected: ${LANGUAGES.find(l => l.code === selectedLanguage)?.name}
Pages processed: ${applyToAll ? documentState.totalPages : specificPages}
Processing time: 3.2 seconds`;

      setExtractedText(mockText);
    } catch (error) {
      console.error('Error running OCR:', error);
      alert('Failed to run OCR. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'extracted-text.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleMakeSearchable = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implement make PDF searchable API call
      console.log('Making PDF searchable...');

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('PDF is now searchable!');
      onClose();
    } catch (error) {
      console.error('Error making PDF searchable:', error);
      alert('Failed to make PDF searchable. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">OCR - Text Recognition</h3>
              <p className="text-sm text-gray-600">Extract text from scanned PDFs and images</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!extractedText ? (
          <>
            {/* Language Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Document Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as OCRLanguage)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Page Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pages to Process
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="all-pages"
                    checked={applyToAll}
                    onChange={() => setApplyToAll(true)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <label htmlFor="all-pages" className="text-sm text-gray-700">
                    All pages ({documentState.totalPages} pages)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="specific-pages"
                    checked={!applyToAll}
                    onChange={() => setApplyToAll(false)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <label htmlFor="specific-pages" className="text-sm text-gray-700">
                    Specific pages
                  </label>
                </div>

                {!applyToAll && (
                  <input
                    type="text"
                    value={specificPages}
                    onChange={(e) => setSpecificPages(e.target.value)}
                    placeholder="e.g., 1-5, 8, 10-12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ml-6"
                  />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-900 mb-2">
                <strong>OCR (Optical Character Recognition)</strong> will:
              </p>
              <ul className="text-sm text-purple-900 space-y-1 ml-4">
                <li>• Extract text from images and scanned pages</li>
                <li>• Make your PDF searchable</li>
                <li>• Enable text copying and editing</li>
                <li>• Preserve original formatting where possible</li>
              </ul>
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
                onClick={handleRunOCR}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={isProcessing || (!applyToAll && !specificPages.trim())}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FileSearch className="w-4 h-4 mr-2" />
                    Run OCR
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Extracted Text */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Extracted Text
                </label>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopyText}
                    variant="outline"
                    size="sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDownloadText}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>

              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                placeholder="Extracted text will appear here..."
              />
            </div>

            {/* Success Info */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900">
                <strong>✓ OCR completed successfully!</strong> The text has been extracted and is ready to use.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setExtractedText('');
                  onClose();
                }}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={handleMakeSearchable}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Make PDF Searchable'
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

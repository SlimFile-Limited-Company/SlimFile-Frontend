import { useState } from 'react';
import { Upload, Download, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';

export default function ReplaceBackground() {
  useSEO({ title: 'Replace Background — Change Image Background | SlimFile', description: 'Replace image backgrounds with solid colors or custom images.' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#ffffff');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) { setError('Please select an image'); return; }
    setSelectedFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleReplace = async () => {
    if (!selectedFile) return;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
    try {
      setIsCompressing(true);
      const compressFormData = new FormData();
      compressFormData.append('file', selectedFile);
      const compressResponse = await fetch(`${API_BASE_URL}/compress`, { method: 'POST', body: compressFormData });
      if (!compressResponse.ok) throw new Error('Compression failed');
      const compressedBlob = await compressResponse.blob();
      const compressedFile = new File([compressedBlob], selectedFile.name, { type: selectedFile.type });
      setIsCompressing(false);

      setIsProcessing(true);
      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('backgroundType', 'color');
      formData.append('backgroundColor', bgColor);
      const response = await fetch(`${API_BASE_URL}/images/replace-background`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed');
      const blob = await response.blob();
      setProcessedFile(blob);
      const url = URL.createObjectURL(blob);
      setProcessedPreview(url);
    } catch (err) {
      setError('Failed to replace background');
    } finally {
      setIsCompressing(false);
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedFile) return;
    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `new-bg_${selectedFile?.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white pt-28 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            <ImageIcon className="w-4 h-4" />
            Image Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Replace Background</h1>
          <p className="text-lg text-gray-600">Change image background with solid colors</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border p-6 sm:p-8">
          {!selectedFile ? (
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-12 text-center hover:border-purple-500 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-lg font-semibold mb-2">Click to upload</p>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img src={preview!} alt="Preview" className="w-full h-auto max-h-96 object-contain rounded-lg border" />
                <button onClick={() => { setSelectedFile(null); setPreview(null); if (processedPreview) URL.revokeObjectURL(processedPreview); setProcessedFile(null); setProcessedPreview(null); }} className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-12 border rounded-lg" />
              </div>
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <div className="flex gap-3">
                {processedPreview && (
                <div className="relative bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img src={processedPreview} alt="Processed" className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200" />
                </div>
              )}

              {!processedFile ? (
                  <Button onClick={handleReplace} disabled={isCompressing || isProcessing} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg rounded-xl">
                    {isCompressing ? 'Compressing...' : isProcessing ? 'Replacing...' : 'Replace Background'}
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleDownload} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg rounded-xl">
                      <Download className="w-5 h-5 mr-2" />
                      Download
                    </Button>
                    <Button onClick={() => { setSelectedFile(null); setPreview(null); if (processedPreview) URL.revokeObjectURL(processedPreview); setProcessedFile(null); setProcessedPreview(null); }} variant="outline" className="flex-1 py-6 text-lg rounded-xl">
                      Another
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

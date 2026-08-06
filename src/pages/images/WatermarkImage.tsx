import { useState } from 'react';
import { Upload, Download, Type, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';

export default function WatermarkImage() {
  useSEO({
    title: 'Add Watermark — Free Image Watermark Tool | SlimFile',
    description: 'Add text watermarks to images for free. Protect your photos and images.',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('SlimFile');
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(0.7);
  const [position, setPosition] = useState('bottom-right');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    setSelectedFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleWatermark = async () => {
    if (!selectedFile) return;
    setError(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

    try {
      const fileSizeInMB = selectedFile.size / (1024 * 1024);
      let fileToProcess = selectedFile;
      if (fileSizeInMB >= 10) {
      setIsCompressing(true);
      const compressFormData = new FormData();
      compressFormData.append('file', selectedFile);
      const compressResponse = await fetch(`${API_BASE_URL}/compress`, { method: 'POST', body: compressFormData });
      if (!compressResponse.ok) throw new Error('Compression failed');
      const compressedBlob = await compressResponse.blob();
      const compressedFile = new File([compressedBlob], selectedFile.name, { type: selectedFile.type });
        fileToProcess = compressedFile;
      } else {
        fileToProcess = selectedFile;
      }
      setIsCompressing(false);

      setIsProcessing(true);
      const formData = new FormData();
      formData.append('file', fileToProcess);
      formData.append('type', 'text');
      formData.append('text', text);
      formData.append('fontSize', fontSize.toString());
      formData.append('color', color);
      formData.append('opacity', opacity.toString());
      formData.append('position', position);

      const response = await fetch(`${API_BASE_URL}/images/watermark`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Watermark failed');
      const blob = await response.blob();
      setProcessedFile(blob);
    } catch (err) {
      setError('Failed to add watermark');
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
    a.download = `watermarked_${selectedFile?.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    if (processedPreview) URL.revokeObjectURL(processedPreview); setProcessedFile(null); setProcessedPreview(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white pt-28 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            <Type className="w-4 h-4" />
            Image Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Add Watermark</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Protect your images with custom watermarks
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          {!selectedFile ? (
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 sm:p-12 text-center hover:border-purple-500 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Click to upload</p>
                <p className="text-sm text-gray-500">PNG, JPG, WEBP</p>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img src={preview!} alt="Preview" className="w-full h-auto max-h-96 object-contain rounded-lg border" />
                <button onClick={handleReset} className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Watermark Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                  <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                    <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" min="12" max="72" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 border rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opacity: {Math.round(opacity * 100)}%</label>
                  <input type="range" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} min="0" max="1" step="0.1" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <select value={position} onChange={(e) => setPosition(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {processedPreview && (
                <div className="relative bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img src={processedPreview} alt="Processed" className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200" />
                </div>
              )}

              {!processedFile ? (
                  <Button onClick={handleWatermark} disabled={isCompressing || isProcessing} className="w-full flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl">
                    {isCompressing ? 'Compressing...' : isProcessing ? 'Adding...' : 'Add Watermark'}
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleDownload} className="w-full flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 sm:py-6 text-sm sm:text-base font-semibold rounded-xl flex items-center justify-center gap-2">
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="whitespace-nowrap">Download</span>
                    </Button>
                    <Button onClick={handleReset} variant="outline" className="w-full flex-1 py-4 sm:py-6 text-sm sm:text-base font-semibold rounded-xl">
                      <span className="whitespace-nowrap">Watermark Another</span>
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

import { useState } from 'react';
import { Upload, Download, Scissors, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';

export default function CropImage() {
  useSEO({
    title: 'Crop Image — Free Image Cropping Tool | SlimFile',
    description: 'Crop images for free. Trim and cut images to any size. Fast, easy, and 100% free.',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    setSelectedFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCrop = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('x', x.toString());
    formData.append('y', y.toString());
    formData.append('width', width.toString());
    formData.append('height', height.toString());

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
      const response = await fetch(`${API_BASE_URL}/images/crop`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Crop failed');
      const blob = await response.blob();
      setProcessedFile(blob);
    } catch (err) {
      setError('Failed to crop image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedFile) return;
    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cropped_${selectedFile?.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setProcessedFile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white pt-28 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-4">
            <Scissors className="w-4 h-4" />
            Image Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Crop Image</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trim and cut your images to the perfect size
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          {!selectedFile ? (
            <div className="border-2 border-dashed border-red-300 rounded-xl p-8 sm:p-12 text-center hover:border-red-500 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Click to upload</p>
                <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 50MB</p>
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
                <h3 className="text-lg font-semibold">Crop Settings</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">X</label>
                    <input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Y</label>
                    <input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                    <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" min="1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                    <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" min="1" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {!processedFile ? (
                  <Button onClick={handleCrop} disabled={isProcessing} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold rounded-xl">
                    {isProcessing ? 'Cropping...' : 'Crop Image'}
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleDownload} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold rounded-xl flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      Download
                    </Button>
                    <Button onClick={handleReset} variant="outline" className="flex-1 py-6 text-lg font-semibold rounded-xl">
                      Crop Another
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

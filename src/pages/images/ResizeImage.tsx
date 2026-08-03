import { useState } from 'react';
import { Upload, Download, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';

export default function ResizeImage() {
  useSEO({
    title: 'Resize Image — Free Image Resizer | SlimFile',
    description: 'Resize images for free. Change dimensions, maintain aspect ratio, and optimize quality. Fast, easy, and 100% free.',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Original dimensions
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  // Options
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [quality, setQuality] = useState(100);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [compressFirst, setCompressFirst] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview and get dimensions
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Handle aspect ratio calculations
  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalWidth && originalHeight) {
      const aspectRatio = originalHeight / originalWidth;
      setHeight(Math.round(newWidth * aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalWidth && originalHeight) {
      const aspectRatio = originalWidth / originalHeight;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const handleResize = async () => {
    if (!selectedFile) return;

    setError(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

    try {
      let fileToProcess = selectedFile;

      // Step 1: Optional compression
      if (compressFirst) {
        setIsCompressing(true);
        const compressFormData = new FormData();
        compressFormData.append('file', selectedFile);

        const compressResponse = await fetch(`${API_BASE_URL}/compress`, {
          method: 'POST',
          body: compressFormData,
        });

        if (!compressResponse.ok) throw new Error('Compression failed');

        const compressedBlob = await compressResponse.blob();
        fileToProcess = new File([compressedBlob], selectedFile.name, { type: selectedFile.type });
        setIsCompressing(false);
      }

      // Step 2: Resize the image
      setIsProcessing(true);
      const formData = new FormData();
      formData.append('file', fileToProcess);
      formData.append('width', width.toString());
      formData.append('height', height.toString());
      formData.append('maintainAspectRatio', maintainAspectRatio.toString());
      formData.append('quality', quality.toString());
      formData.append('format', format);

      const response = await fetch(`${API_BASE_URL}/images/resize`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Resize failed');

      const blob = await response.blob();
      setProcessedFile(blob);

      // Create preview of processed image
      const url = URL.createObjectURL(blob);
      setProcessedPreview(url);
    } catch (err) {
      setError('Failed to resize image. Please try again.');
      console.error(err);
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
    a.download = `resized_${selectedFile?.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setProcessedFile(null);
    setProcessedPreview(null);
    setError(null);
    setWidth(800);
    setHeight(600);
    setMaintainAspectRatio(true);
    setQuality(90);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white pt-28 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            <ImageIcon className="w-4 h-4" />
            Image Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Resize Image
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Change image dimensions while maintaining quality. Free, fast, and easy to use.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          {!selectedFile ? (
            /* Upload Area */
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 sm:p-12 text-center hover:border-purple-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, WEBP
                </p>
              </label>
            </div>
          ) : !processedFile ? (
            /* Processing Area */
            <div className="space-y-6">
              {/* Preview */}
              <div className="relative">
                <img
                  src={preview!}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 text-white text-sm rounded">
                  Original: {originalWidth} × {originalHeight}px
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Resize Options</h3>

                {/* Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      max="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      max="10000"
                    />
                  </div>
                </div>

                {/* Output Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['png', 'jpeg', 'webp'].map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setFormat(fmt as 'png' | 'jpeg' | 'webp')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          format === fmt
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {format === 'png' && 'Best quality, larger file size'}
                    {format === 'jpeg' && 'Good quality, medium file size'}
                    {format === 'webp' && 'Great quality, smallest file size'}
                  </p>
                </div>

                {/* Aspect Ratio */}
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="aspect-ratio"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="aspect-ratio" className="ml-2 text-sm font-medium text-gray-700">
                    Maintain aspect ratio (recommended)
                  </label>
                </div>

                {/* Compress First Option */}
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="checkbox"
                    id="compress-first"
                    checked={compressFirst}
                    onChange={(e) => setCompressFirst(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="compress-first" className="ml-2 text-sm font-medium text-gray-700">
                    🗜️ Compress before resizing (faster processing)
                  </label>
                </div>

                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    min="60"
                    max="100"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Higher quality = larger file size</p>
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  New size: {width} × {height}px
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleResize}
                  disabled={isCompressing || isProcessing}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold rounded-xl"
                >
                  {isCompressing ? 'Compressing...' : isProcessing ? 'Resizing...' : 'Resize Image'}
                </Button>
              </div>
            </div>
          ) : (
            /* Result Area with Preview */
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block p-4 bg-green-50 rounded-full mb-4">
                  <ImageIcon className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Image Resized!</h3>
                <p className="text-gray-600">Preview and download your resized image</p>
              </div>

              {/* Preview of resized image */}
              {processedPreview && (
                <div className="relative">
                  <img
                    src={processedPreview}
                    alt="Resized"
                    className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200"
                  />
                  <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 text-white text-sm rounded">
                    Resized: {width} × {height}px
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 py-6 text-lg font-semibold rounded-xl"
                >
                  Resize Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

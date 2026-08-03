import { useState, useCallback } from 'react';
import { Upload, Download, Scissors, X, AlertCircle, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop/types';

export default function CropImage() {
  useSEO({
    title: 'Crop Image — Free Image Cropping Tool | SlimFile',
    description: 'Crop images for free. Drag to select area. Fast, easy, and 100% free.',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cropper state
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
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
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!selectedFile || !croppedAreaPixels) return;
    setError(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

    try {
      // Step 1: Auto-compress
      setIsCompressing(true);
      const compressFormData = new FormData();
      compressFormData.append('file', selectedFile);
      const compressResponse = await fetch(`${API_BASE_URL}/compress`, { method: 'POST', body: compressFormData });
      if (!compressResponse.ok) throw new Error('Compression failed');
      const compressedBlob = await compressResponse.blob();
      const compressedFile = new File([compressedBlob], selectedFile.name, { type: selectedFile.type });
      setIsCompressing(false);

      // Step 2: Crop with pixel-perfect coordinates
      setIsProcessing(true);
      const formData = new FormData();
      formData.append('file', fileToProcess);
      formData.append('x', Math.round(croppedAreaPixels.x).toString());
      formData.append('y', Math.round(croppedAreaPixels.y).toString());
      formData.append('width', Math.round(croppedAreaPixels.width).toString());
      formData.append('height', Math.round(croppedAreaPixels.height).toString());
      const response = await fetch(`${API_BASE_URL}/images/crop`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Crop failed');
      const blob = await response.blob();
      setProcessedFile(blob);

      // Create preview
      const url = URL.createObjectURL(blob);
      setProcessedPreview(url);
    } catch (err) {
      setError('Failed to crop image');
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
    if (processedPreview) URL.revokeObjectURL(processedPreview);
    setProcessedPreview(null);
    setError(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
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
            Drag to select the area you want to keep
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
                <p className="text-sm text-gray-500">PNG, JPG, WEBP</p>
              </label>
            </div>
          ) : !processedFile ? (
            <div className="space-y-6">
              {/* Cropper */}
              <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
                <Cropper
                  image={preview!}
                  crop={crop}
                  zoom={zoom}
                  aspect={undefined}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-4">
                <ZoomOut className="w-5 h-5 text-gray-600" />
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1"
                />
                <ZoomIn className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600 w-16">{Math.round(zoom * 100)}%</span>
              </div>

              {croppedAreaPixels && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium">Crop Area:</span> {Math.round(croppedAreaPixels.width)}px × {Math.round(croppedAreaPixels.height)}px
                </div>
              )}

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
                  🗜️ Compress before cropping (faster processing)
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleCrop} disabled={isCompressing || isProcessing || !croppedAreaPixels} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold rounded-xl">
                  {isCompressing ? 'Compressing...' : isProcessing ? 'Cropping...' : 'Crop Image'}
                </Button>
                <Button onClick={handleReset} variant="outline" className="sm:w-32 py-6 text-lg font-semibold rounded-xl">
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block p-4 bg-green-50 rounded-full mb-4">
                  <Scissors className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Image Cropped!</h3>
                <p className="text-gray-600">Preview your cropped image below</p>
              </div>

              {/* Preview of cropped image */}
              {processedPreview && (
                <div className="relative bg-gray-50 rounded-lg p-4">
                  <img
                    src={processedPreview}
                    alt="Cropped"
                    className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleDownload} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold rounded-xl flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Cropped Image
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1 py-6 text-lg font-semibold rounded-xl">
                  Crop Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

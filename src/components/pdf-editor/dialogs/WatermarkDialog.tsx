import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Droplet, X, FileImage } from 'lucide-react';
import { usePDFEditor } from '@/contexts/PDFEditorContext';

interface WatermarkDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type WatermarkType = 'text' | 'image';
type WatermarkPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export default function WatermarkDialog({ isOpen, onClose }: WatermarkDialogProps) {
  const { documentState } = usePDFEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkImagePreview, setWatermarkImagePreview] = useState<string | null>(null);
  const [position, setPosition] = useState<WatermarkPosition>('center');
  const [opacity, setOpacity] = useState(50);
  const [rotation, setRotation] = useState(45);
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#000000');
  const [applyToAll, setApplyToAll] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setWatermarkImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setWatermarkImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyWatermark = async () => {
    if (watermarkType === 'text' && !watermarkText.trim()) {
      alert('Please enter watermark text');
      return;
    }

    if (watermarkType === 'image' && !watermarkImage) {
      alert('Please select an image');
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Implement actual watermark API call
      const formData = new FormData();
      formData.append('type', watermarkType);
      formData.append('position', position);
      formData.append('opacity', opacity.toString());
      formData.append('rotation', rotation.toString());
      formData.append('applyToAll', applyToAll.toString());

      if (watermarkType === 'text') {
        formData.append('text', watermarkText);
        formData.append('fontSize', fontSize.toString());
        formData.append('color', color);
      } else if (watermarkImage) {
        formData.append('image', watermarkImage);
      }

      console.log('Applying watermark:', {
        type: watermarkType,
        position,
        opacity,
        rotation,
        applyToAll,
      });

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('Watermark applied successfully!');
      onClose();
    } catch (error) {
      console.error('Error applying watermark:', error);
      alert('Failed to apply watermark. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Add Watermark</h3>
              <p className="text-sm text-gray-600">Add text or image watermark to your PDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Watermark Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Watermark Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setWatermarkType('text')}
              className={`p-4 border-2 rounded-lg transition-all ${
                watermarkType === 'text'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">Text Watermark</div>
              <div className="text-xs text-gray-600">Add custom text</div>
            </button>

            <button
              onClick={() => setWatermarkType('image')}
              className={`p-4 border-2 rounded-lg transition-all ${
                watermarkType === 'image'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">Image Watermark</div>
              <div className="text-xs text-gray-600">Upload logo/image</div>
            </button>
          </div>
        </div>

        {/* Text Watermark Options */}
        {watermarkType === 'text' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Watermark Text</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter watermark text"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Font Size</label>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value) || 48)}
                  min={12}
                  max={120}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Watermark Options */}
        {watermarkType === 'image' && (
          <div className="mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {!watermarkImagePreview ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Click to upload image</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, or SVG</p>
              </button>
            ) : (
              <div className="relative">
                <img
                  src={watermarkImagePreview}
                  alt="Watermark preview"
                  className="w-full h-48 object-contain bg-gray-50 rounded-lg border-2 border-gray-300"
                />
                <button
                  onClick={() => {
                    setWatermarkImage(null);
                    setWatermarkImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Common Options */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Top Left', value: 'top-left' },
                { label: 'Top Right', value: 'top-right' },
                { label: 'Center', value: 'center' },
                { label: 'Bottom Left', value: 'bottom-left' },
                { label: 'Bottom Right', value: 'bottom-right' },
              ].map((pos) => (
                <button
                  key={pos.value}
                  onClick={() => setPosition(pos.value as WatermarkPosition)}
                  className={`px-3 py-2 text-xs border-2 rounded-lg transition-all ${
                    position === pos.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Opacity: {opacity}%</label>
            <input
              type="range"
              value={opacity}
              onChange={(e) => setOpacity(parseInt(e.target.value))}
              min={0}
              max={100}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Rotation: {rotation}°</label>
            <input
              type="range"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              min={0}
              max={360}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="applyToAll"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="applyToAll" className="text-sm text-gray-700">
              Apply to all pages ({documentState.totalPages} pages)
            </label>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-xs text-gray-600 mb-2">Preview</label>
          <div className="relative bg-white border-2 border-gray-300 rounded h-48 flex items-center justify-center overflow-hidden">
            <div
              className="absolute"
              style={{
                opacity: opacity / 100,
                transform: `rotate(${rotation}deg)`,
                ...(position === 'center' && { top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${rotation}deg)` }),
                ...(position === 'top-left' && { top: '10px', left: '10px' }),
                ...(position === 'top-right' && { top: '10px', right: '10px' }),
                ...(position === 'bottom-left' && { bottom: '10px', left: '10px' }),
                ...(position === 'bottom-right' && { bottom: '10px', right: '10px' }),
              }}
            >
              {watermarkType === 'text' ? (
                <div
                  style={{
                    fontSize: `${fontSize / 2}px`,
                    color: color,
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {watermarkText}
                </div>
              ) : (
                watermarkImagePreview && (
                  <img
                    src={watermarkImagePreview}
                    alt="Preview"
                    className="max-w-[200px] max-h-[100px] object-contain"
                  />
                )
              )}
            </div>
            <div className="text-gray-400 text-sm">Document Preview</div>
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
            onClick={handleApplyWatermark}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Applying...
              </>
            ) : (
              <>
                <Droplet className="w-4 h-4 mr-2" />
                Apply Watermark
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

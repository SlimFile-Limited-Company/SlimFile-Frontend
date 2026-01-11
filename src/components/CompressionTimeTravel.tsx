import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompressionLevel {
  quality: number;
  blob: Blob;
  url: string;
  size: number;
  label: string;
  recommendation: string;
}

interface CompressionTimeTravelProps {
  file: File;
  onDownload: (blob: Blob, level: number) => void;
}

export const CompressionTimeTravel = ({ file, onDownload }: CompressionTimeTravelProps) => {
  const [levels, setLevels] = useState<CompressionLevel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(2); // Start at medium
  const [isGenerating, setIsGenerating] = useState(true);
  const [originalSize, setOriginalSize] = useState(0);

  useEffect(() => {
    generateCompressionLevels();
  }, [file]);

  const generateCompressionLevels = async () => {
    setIsGenerating(true);
    setOriginalSize(file.size);

    const qualityLevels = [
      { quality: 0.95, label: 'Maximum', recommendation: 'Perfect for Print & Archiving' },
      { quality: 0.85, label: 'High', recommendation: 'Great for Professional Use' },
      { quality: 0.7, label: 'Medium', recommendation: 'Balanced - Perfect for Email' },
      { quality: 0.5, label: 'Low', recommendation: 'Web Optimized - Fast Loading' },
      { quality: 0.3, label: 'Minimum', recommendation: 'Ultra Compact - Thumbnails' },
    ];

    try {
      const compressedLevels = await Promise.all(
        qualityLevels.map(async ({ quality, label, recommendation }) => {
          const compressed = await compressImage(file, quality);
          return {
            quality: Math.round(quality * 100),
            blob: compressed,
            url: URL.createObjectURL(compressed),
            size: compressed.size,
            label,
            recommendation,
          };
        })
      );

      setLevels(compressedLevels);
      setIsGenerating(false);
    } catch (error) {
      console.error('Compression failed:', error);
      setIsGenerating(false);
    }
  };

  const compressImage = (file: File, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Compression failed'));
              }
            },
            file.type,
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getReductionPercentage = (compressedSize: number) => {
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (quality >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (quality >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  if (isGenerating) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <Sparkles className="w-12 h-12 mx-auto text-primary animate-pulse" />
          <h3 className="text-xl font-semibold text-gray-900">
            Generating Compression Levels...
          </h3>
          <p className="text-gray-600">
            Creating 5 optimized versions for you to explore
          </p>
        </motion.div>
      </div>
    );
  }

  const currentLevel = levels[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* File Info Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">{file.name}</h2>
        <p className="text-gray-600">
          Original: <span className="font-semibold">{formatFileSize(originalSize)}</span>
        </p>
      </div>

      {/* Preview Container */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
        <div className="relative bg-gray-50 min-h-[400px] flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={currentLevel?.url}
              alt="Preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg"
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Compression Timeline Slider */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
            <TrendingDown className="w-5 h-5 text-primary" />
            Compression Time Travel
          </h3>
          <p className="text-sm text-gray-600">
            Drag the slider to explore different compression levels
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min={0}
            max={levels.length - 1}
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 rounded-lg appearance-none cursor-pointer slider-thumb"
          />

          {/* Level Markers */}
          <div className="flex justify-between mt-2">
            {levels.map((level, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  idx === currentIndex ? 'scale-110' : 'scale-90 opacity-60'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    idx === currentIndex
                      ? 'bg-primary border-primary'
                      : 'bg-white border-gray-300'
                  }`}
                />
                <span className="text-xs font-medium text-gray-600">
                  {level.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Level Stats */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatFileSize(currentLevel?.size || 0)}
              </p>
              <p className="text-sm text-gray-600">Compressed Size</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {getReductionPercentage(currentLevel?.size || 0)}%
              </p>
              <p className="text-sm text-gray-600">Smaller</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${getQualityColor(currentLevel?.quality || 0).split(' ')[0]}`}>
                {currentLevel?.quality}%
              </p>
              <p className="text-sm text-gray-600">Quality</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-center text-sm font-medium text-gray-700">
              💡 {currentLevel?.recommendation}
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => onDownload(currentLevel.blob, currentIndex)}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download This Version
          </Button>
          <Button
            onClick={() => setCurrentIndex(2)}
            variant="outline"
            size="lg"
          >
            Reset to Medium
          </Button>
        </div>

        {/* Savings Summary */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <Sparkles className="w-5 h-5" />
            <p className="font-semibold">
              You saved {formatFileSize(originalSize - (currentLevel?.size || 0))} of storage space!
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
      `
      }} />
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, RefreshCw, FileText, Image, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ConversionResultProps {
  originalFiles: File[];
  convertedFiles: (File | null)[];
  convertedSizes: number[];
  conversionProgress: number[];
  isConverting: boolean;
  onReset: () => void;
  targetFormat?: string;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({
  originalFiles,
  convertedFiles,
  convertedSizes,
  conversionProgress,
  isConverting,
  onReset,
  targetFormat = 'PDF'
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-600" />;
    } else if (type === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-600" />;
    }
    return <File className="w-6 h-6 text-gray-600" />;
  };

  const handleDownload = (file: File, index: number) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const allComplete = convertedFiles.every((f, i) => conversionProgress[i] === 100);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 p-8"
        style={{ backdropFilter: 'blur(15px)' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-blue-50/70 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-white/50 shadow-xl"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            {allComplete ? (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            ) : (
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            )}
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {allComplete ? 'Conversion Complete!' : 'Converting Files...'}
          </h2>
          <p className="text-gray-600">
            {allComplete 
              ? `Successfully converted to ${targetFormat.toUpperCase()}`
              : `Converting to ${targetFormat.toUpperCase()}...`}
          </p>
        </div>

        {/* File Results */}
        <div className="space-y-4">
          {originalFiles.map((originalFile, index) => {
            const convertedFile = convertedFiles[index];
            const progress = conversionProgress[index];
            const isComplete = progress === 100 && convertedFile;

            return (
              <motion.div
                key={`${originalFile.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/20 backdrop-blur-2xl rounded-xl p-6 border-2 border-white/40 shadow-lg"
                style={{ backdropFilter: 'blur(12px)' }}
              >
                {/* File Info Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(originalFile.type)}
                    <div>
                      <p className="font-semibold text-gray-900 truncate max-w-xs">
                        {originalFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(originalFile.size)}
                      </p>
                    </div>
                  </div>

                  {isComplete && (
                    <Button
                      onClick={() => handleDownload(convertedFile, index)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>

                {/* Progress Bar */}
                {!isComplete && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">
                        Converting to {targetFormat.toUpperCase()}...
                      </span>
                      <span className="text-blue-600 font-bold">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                )}

                {/* Conversion Success Info */}
                {isComplete && (
                  <div className="mt-4 p-4 bg-green-50/50 backdrop-blur-lg rounded-lg border border-green-200/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-green-800">
                          ✅ Converted to {targetFormat.toUpperCase()}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          New file: {convertedFile.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">
                          {formatFileSize(convertedFile.size)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {convertedFile.size > originalFile.size ? 'Larger' : 'Smaller'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          {allComplete && (
            <>
              <Button
                onClick={onReset}
                variant="outline"
                className="bg-white/50 backdrop-blur-sm border-2 border-gray-300 hover:bg-white/70 font-semibold"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Convert Another File
              </Button>
              
              {convertedFiles.length > 1 && (
                <Button
                  onClick={() => {
                    convertedFiles.forEach((file, index) => {
                      if (file) handleDownload(file, index);
                    });
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              )}
            </>
          )}
        </div>

        {/* Conversion Stats Summary */}
        {allComplete && convertedFiles.length > 1 && (
          <div className="mt-6 p-4 bg-blue-50/50 backdrop-blur-lg rounded-xl border border-blue-200/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {convertedFiles.filter(f => f !== null).length}
                </p>
                <p className="text-xs text-gray-600">Files Converted</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {targetFormat.toUpperCase()}
                </p>
                <p className="text-xs text-gray-600">Output Format</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {formatFileSize(
                    convertedSizes.reduce((sum, size) => sum + size, 0)
                  )}
                </p>
                <p className="text-xs text-gray-600">Total Size</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
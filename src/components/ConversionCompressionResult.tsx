import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, RefreshCw, FileText, Image, File, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ConversionCompressionResultProps {
  originalFiles: File[];
  processedFiles: (File | null)[];
  processedSizes: number[];
  processingProgress: number[];
  isProcessing: boolean;
  onReset: () => void;
  targetFormat?: string;
  currentStep?: string[];
}

export const ConversionCompressionResult: React.FC<ConversionCompressionResultProps> = ({
  originalFiles,
  processedFiles,
  processedSizes,
  processingProgress,
  isProcessing,
  onReset,
  targetFormat = 'PDF',
  currentStep = []
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateReduction = (original: number, processed: number): number => {
    if (original === 0) return 0;
    return Math.round(((original - processed) / original) * 100);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-6 h-6 text-purple-600" />;
    } else if (type === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-600" />;
    }
    return <File className="w-6 h-6 text-gray-600" />;
  };

  const getStepIcon = (step: string) => {
    if (step === 'Converting...') {
      return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
    } else if (step === 'Compressing...') {
      return <Zap className="w-5 h-5 text-orange-600 animate-pulse" />;
    } else if (step === 'Complete') {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    return null;
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

  const allComplete = processedFiles.every((f, i) => processingProgress[i] === 100 && f !== null);
  const totalOriginalSize = originalFiles.reduce((sum, file) => sum + file.size, 0);
  const totalProcessedSize = processedSizes.reduce((sum, size) => sum + size, 0);
  const totalReduction = calculateReduction(totalOriginalSize, totalProcessedSize);

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
            className="w-16 h-16 bg-purple-50/70 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-white/50 shadow-xl"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            {allComplete ? (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            ) : (
              <div className="flex items-center gap-1">
                <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
            )}
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {allComplete ? 'Processing Complete!' : 'Converting & Compressing...'}
          </h2>
          <p className="text-gray-600">
            {allComplete 
              ? `Converted to ${targetFormat.toUpperCase()} and optimized`
              : `Converting to ${targetFormat.toUpperCase()} and compressing...`}
          </p>
        </div>

        {/* Processing Steps Indicator */}
        {!allComplete && (
          <div className="mb-6 flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl backdrop-blur-lg border border-white/40">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100/70 rounded-lg">
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-sm font-semibold text-blue-800">Converting</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-100/70 rounded-lg">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-800">Compressing</span>
            </div>
          </div>
        )}

        {/* File Results */}
        <div className="space-y-4">
          {originalFiles.map((originalFile, index) => {
            const processedFile = processedFiles[index];
            const progress = processingProgress[index];
            const isComplete = progress === 100 && processedFile;
            const step = currentStep[index] || '';

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
                        Original: {formatFileSize(originalFile.size)}
                      </p>
                    </div>
                  </div>

                  {isComplete && (
                    <Button
                      onClick={() => handleDownload(processedFile, index)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>

                {/* Progress Bar with Current Step */}
                {!isComplete && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        {getStepIcon(step)}
                        <span className="text-gray-600 font-medium">{step}</span>
                      </div>
                      <span className="text-purple-600 font-bold">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    
                    {/* Step Progress Indicator */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className={`flex items-center gap-1 ${progress < 50 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${progress < 50 ? 'bg-blue-600 animate-pulse' : 'bg-gray-400'}`} />
                        Converting
                      </div>
                      <ArrowRight className="w-3 h-3" />
                      <div className={`flex items-center gap-1 ${progress >= 50 && progress < 100 ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${progress >= 50 && progress < 100 ? 'bg-orange-600 animate-pulse' : 'bg-gray-400'}`} />
                        Compressing
                      </div>
                    </div>
                  </div>
                )}

                {/* Processing Success Info */}
                {isComplete && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50/50 to-blue-50/50 backdrop-blur-lg rounded-lg border border-green-200/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-green-800">
                          ✅ Converted & Compressed
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          {processedFile.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">
                          {formatFileSize(processedFile.size)}
                        </p>
                        <p className="text-xs font-bold text-green-600">
                          {calculateReduction(originalFile.size, processedFile.size)}% smaller
                        </p>
                      </div>
                    </div>
                    
                    {/* Size Comparison Bar */}
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500">Original</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600"
                            style={{ 
                              width: `${Math.max((processedFile.size / originalFile.size) * 100, 5)}%` 
                            }}
                          />
                        </div>
                        <span className="text-green-600 font-semibold">Compressed</span>
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
                Process Another File
              </Button>
              
              {processedFiles.length > 1 && (
                <Button
                  onClick={() => {
                    processedFiles.forEach((file, index) => {
                      if (file) handleDownload(file, index);
                    });
                  }}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              )}
            </>
          )}
        </div>

        {/* Processing Stats Summary */}
        {allComplete && (
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 backdrop-blur-lg rounded-xl border border-purple-200/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {processedFiles.filter(f => f !== null).length}
                </p>
                <p className="text-xs text-gray-600">Files Processed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {targetFormat.toUpperCase()}
                </p>
                <p className="text-xs text-gray-600">Output Format</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {totalReduction}%
                </p>
                <p className="text-xs text-gray-600">Size Reduction</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {formatFileSize(totalProcessedSize)}
                </p>
                <p className="text-xs text-gray-600">Total Size</p>
              </div>
            </div>
            
            {/* Total Savings */}
            <div className="mt-4 pt-4 border-t border-purple-200/50">
              <div className="flex items-center justify-center gap-3 text-sm">
                <span className="text-gray-600">Total savings:</span>
                <span className="font-bold text-green-600">
                  {formatFileSize(totalOriginalSize - totalProcessedSize)}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {formatFileSize(totalOriginalSize)} → {formatFileSize(totalProcessedSize)}
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
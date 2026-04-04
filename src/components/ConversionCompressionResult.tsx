import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, RefreshCw, FileText, Image, File, Zap, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProcessingText } from '@/components/ProcessingText';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { CloudStorageSave } from '@/components/CloudStorageSave';

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [completedFiles, setCompletedFiles] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const hasTriggeredAllCompleteConfetti = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confetti animation function
  const triggerConfetti = (colors: string[], particleCount: number = 150) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces: Array<{
      x: number;
      y: number;
      rotation: number;
      rotationSpeed: number;
      speed: number;
      color: string;
      width: number;
      height: number;
      velocityX: number;
      velocityY: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        speed: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.random() * 10 + 5,
        height: Math.random() * 10 + 5,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: Math.random() * 3 + 2,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiPieces.forEach((piece, index) => {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        ctx.restore();

        piece.y += piece.velocityY;
        piece.x += piece.velocityX;
        piece.rotation += piece.rotationSpeed;
        piece.velocityY += 0.1; // gravity

        if (piece.y > canvas.height) {
          confettiPieces.splice(index, 1);
        }
      });

      if (confettiPieces.length > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        canvas.style.display = 'none';
      }
    };

    canvas.style.display = 'block';
    animate();
  };

  // Trigger confetti when individual files complete
  useEffect(() => {
    processedFiles.forEach((file, index) => {
      const isComplete = processingProgress[index] === 100 && file !== null;
      if (isComplete && !completedFiles.has(index)) {
        setCompletedFiles(prev => new Set(prev).add(index));
        
        // Individual file completion confetti
        triggerConfetti(['#9333EA', '#A855F7', '#C084FC', '#E9D5FF'], 60);
      }
    });
  }, [processedFiles, processingProgress, completedFiles]);

  // Trigger big confetti when all files complete
  useEffect(() => {
    const allComplete = processedFiles.every((f, i) => processingProgress[i] === 100 && f !== null);
    
    if (allComplete && processedFiles.length > 0 && !hasTriggeredAllCompleteConfetti.current) {
      hasTriggeredAllCompleteConfetti.current = true;
      
      // Big celebration confetti with purple theme
      triggerConfetti(['#9333EA', '#A855F7', '#C084FC', '#E9D5FF', '#10B981', '#34D399'], 200);
    }
  }, [processedFiles, processingProgress]);

  // Reset confetti trigger when component resets
  useEffect(() => {
    if (processedFiles.length === 0) {
      hasTriggeredAllCompleteConfetti.current = false;
      setCompletedFiles(new Set());
    }
  }, [processedFiles.length]);

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
      return <Image className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />;
    } else if (type === 'application/pdf') {
      return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />;
    }
    return <File className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />;
  };

  const getStepIcon = (step: string) => {
    if (step === 'Converting...') {
      return <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 animate-spin" />;
    } else if (step === 'Compressing...') {
      return <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 animate-pulse" />;
    } else if (step === 'Complete') {
      return <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
    }
    return null;
  };

  const handleDownload = async (file: File | null, fileIndex?: number) => {
    if (!file) return;
    
    if (!isAuthenticated()) {
      const downloadKey = fileIndex !== undefined ? `pendingDownload_${fileIndex}` : 'pendingDownload';
      
      sessionStorage.setItem(downloadKey, JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        originalFileIndex: fileIndex
      }));
      sessionStorage.setItem('redirectAfterLogin', '/convert-compress');
      sessionStorage.setItem('pendingDownloadIndex', fileIndex?.toString() || '0');
      
      toast({
        title: "Login Required",
        description: "Please login to download your processed file.",
        variant: "default"
      });
      
      navigate('/login');
      return;
    }
    
    setIsDownloading(true);
    setDownloadingIndex(fileIndex || 0);
    try {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "An error occurred while downloading the file.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
      setDownloadingIndex(null);
    }
  };

  const handleShare = async (file: File | null, fileIndex?: number) => {
    if (!file) return;
    
    if (!isAuthenticated()) {
      const shareKey = fileIndex !== undefined ? `pendingShare_${fileIndex}` : 'pendingShare';
      
      sessionStorage.setItem(shareKey, JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        originalFileIndex: fileIndex
      }));
      sessionStorage.setItem('redirectAfterLogin', '/convert-compress');
      sessionStorage.setItem('pendingShareIndex', fileIndex?.toString() || '0');
      
      toast({
        title: "Login Required",
        description: "Please login to share your processed file.",
        variant: "default"
      });
      
      navigate('/login');
      return;
    }
    
    const url = URL.createObjectURL(file);
    try {
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: `Share ${file.name}`,
          text: `Check out this converted and compressed file: ${file.name}`,
        });
        toast({
          title: "Share Successful",
          description: `Successfully shared ${file.name}`,
          variant: "default"
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "File URL copied to clipboard for sharing!",
          variant: "default"
        });
      }
    } catch (err) {
      console.error('Share failed:', err);
      toast({
        title: "Share Failed",
        description: "Failed to share the file. Please try downloading and sharing manually.",
        variant: "destructive"
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadAll = () => {
    if (!isAuthenticated()) {
      toast({
        title: "Login Required",
        description: "Please login to download your processed files.",
        variant: "default"
      });
      navigate('/login');
      return;
    }
    processedFiles.forEach((file) => {
      if (file) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  };

  const allComplete = processedFiles.every((f, i) => processingProgress[i] === 100 && f !== null);
  const totalOriginalSize = originalFiles.reduce((sum, file) => sum + file.size, 0);
  const totalProcessedSize = processedSizes.reduce((sum, size) => sum + size, 0);
  const totalReduction = calculateReduction(totalOriginalSize, totalProcessedSize);

  return (
    <div className="w-full space-y-6">
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
        style={{ display: 'none' }}
      />
      
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
          >
            {!isComplete ? (
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
                <div className="text-center">
                  <motion.div
                    className="h-8 w-8 border-2 border-purple-600 border-r-transparent rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Processing: {originalFile.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{step}</p>
                  <ProcessingText mode="both" progress={progress || 0} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border-2 border-purple-100 shadow-lg">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <CheckCircle2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Processing Complete!
                  </h3>
                  <p className="text-gray-600">
                    {originalFile.name} has been converted to {targetFormat.toUpperCase()} and compressed
                  </p>
                </div>

                {/* File Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-3">
                      {getFileIcon(originalFile.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">Original File</h4>
                        <p className="text-sm text-gray-600 truncate">
                          {originalFile.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatFileSize(originalFile.size)}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      {getFileIcon(processedFile.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">Processed File</h4>
                        <p className="text-sm text-gray-600 truncate">
                          {processedFile.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-purple-600">
                      {formatFileSize(processedFile.size)}
                    </p>
                  </div>
                </div>

                {/* Compression Stats */}
                <div className="text-center mb-6">
                  <div className="inline-flex flex-wrap justify-center items-center gap-2">
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full">
                      <span className="text-xs sm:text-sm font-medium">
                        {calculateReduction(originalFile.size, processedFile.size)}% size reduction
                      </span>
                    </div>
                    <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 sm:px-4 py-2 rounded-full">
                      <span className="text-xs sm:text-sm font-medium">
                        Saved: {formatFileSize(originalFile.size - processedFile.size)}
                      </span>
                    </div>
                  </div>
                  {!isAuthenticated() && (
                    <div className="mt-3 inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 sm:px-4 py-2 rounded-full">
                      <span className="text-xs sm:text-sm font-medium">
                        Login required to download or share processed files
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => handleDownload(processedFile, index)}
                    disabled={(isDownloading && downloadingIndex === index) || !processedFile}
                    className="flex-1"
                  >
                    {(isDownloading && downloadingIndex === index) ? (
                      <>
                        <motion.div
                          className="h-4 w-4 border-2 border-white border-r-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        {isAuthenticated() ? 'Download Processed File' : 'Login to Download'}
                      </>
                    )}
                  </Button>
                  <CloudStorageSave
                    file={processedFile}
                    fileName={processedFile?.name || 'processed-file'}
                    disabled={!processedFile}
                    variant="outline"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleShare(processedFile, index)}
                    disabled={!processedFile}
                    variant="outline"
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {isAuthenticated() ? (navigator.share ? 'Share' : 'Copy Link') : 'Login to Share'}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Download All Button */}
      {processedFiles.filter(Boolean).length > 1 && allComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-4"
        >
          <Button
            onClick={handleDownloadAll}
            className="bg-purple-600 text-white hover:bg-purple-700"
            disabled={!isAuthenticated()}
          >
            <Download className="h-4 w-4 mr-2" />
            Download All Processed Files
          </Button>
        </motion.div>
      )}

      {/* Processing Stats Summary */}
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Total Processing Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-2xl font-bold text-purple-600">
                {processedFiles.filter(f => f !== null).length}
              </p>
              <p className="text-sm text-gray-600">Files Processed</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">
                {targetFormat.toUpperCase()}
              </p>
              <p className="text-sm text-gray-600">Output Format</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-2xl font-bold text-green-600">
                {totalReduction}%
              </p>
              <p className="text-sm text-gray-600">Size Reduction</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-2xl font-bold text-purple-600">
                {formatFileSize(totalProcessedSize)}
              </p>
              <p className="text-sm text-gray-600">Total Size</p>
            </div>
          </div>
          
          {/* Total Savings */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <span className="text-gray-600">Total savings:</span>
              <span className="font-bold text-green-600">
                {formatFileSize(totalOriginalSize - totalProcessedSize)}
              </span>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <span className="text-gray-600 text-center sm:text-left">
                {formatFileSize(totalOriginalSize)} → {formatFileSize(totalProcessedSize)}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reset Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-center mt-4"
      >
        <Button
          variant="outline"
          onClick={onReset}
          className="bg-white hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Process Another File
        </Button>
      </motion.div>
    </div>
  );
};

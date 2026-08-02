import React, { useState, useEffect } from 'react';
import { CheckCircle2, Download, RefreshCw, FileText, Image, File, Zap, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProcessingText } from '@/components/ProcessingText';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import {
  trackGuestActivity,
  canGuestDownload,
  incrementDownloadCount,
  hasReviewed,
  getRemainingDownloads
} from '@/utils/guestTracking';
import { GuestDownloadLimitModal } from '@/components/GuestDownloadLimitModal';

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
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const navigate = useNavigate();

  // Track conversion+compression activity for guests when complete
  useEffect(() => {
    const allComplete = processedFiles.every((f, i) => processingProgress[i] === 100 && f !== null);
    if (allComplete && processedFiles.length > 0 && !isProcessing && !isAuthenticated()) {
      originalFiles.forEach((file, idx) => {
        const processedFile = processedFiles[idx];
        if (processedFile) {
          trackGuestActivity('convert-compress', file.type, file.size, processedFile.size);
        }
      });
    }
  }, [isProcessing, processedFiles, processingProgress, originalFiles]);

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

    // Check if guest or authenticated user
    if (!isAuthenticated()) {
      // Guest user - check download limit
      if (!canGuestDownload()) {
        setShowGuestLimitModal(true);
        return;
      }

      // Increment download count and track
      incrementDownloadCount();
      await trackGuestActivity('download', file.type, 0, file.size);

      const remaining = getRemainingDownloads();
      if (remaining === 1) {
        toast({
          title: "1 download remaining",
          description: hasReviewed()
            ? "Sign in for unlimited downloads"
            : "Leave a review to get 2 more downloads!",
          variant: "default"
        });
      } else if (remaining === 0) {
        toast({
          title: "Last free download used",
          description: hasReviewed()
            ? "Sign in to continue downloading"
            : "Leave a review or sign in to continue",
          variant: "default"
        });
      }
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
      {originalFiles.map((originalFile, index) => {
        const processedFile = processedFiles[index];
        const progress = processingProgress[index];
        const isComplete = progress === 100 && processedFile;
        const step = currentStep[index] || '';

        return (
          <div
            key={`${originalFile.name}-${index}`}
            
            
            
          >
            {!isComplete ? (
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
                <div className="text-center">
                  <div
                    className="h-8 w-8 border-2 border-purple-600 border-r-transparent rounded-full animate-spin mx-auto mb-4"
                    
                    
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
                  <div
                    
                    
                    
                  >
                    <CheckCircle2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  </div>
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
                    <div className="mt-3 inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full">
                      <span className="text-xs sm:text-sm font-medium">
                        {getRemainingDownloads()} free download{getRemainingDownloads() !== 1 ? 's' : ''} remaining
                        {!hasReviewed() && getRemainingDownloads() === 0 && " - Review for 2 more!"}
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
                        <div
                          className="h-4 w-4 border-2 border-white border-r-transparent rounded-full animate-spin mr-2"
                          
                          
                        />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Processed File
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleShare(processedFile, index)}
                    disabled={!processedFile}
                    variant="outline"
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {navigator.share ? 'Share' : 'Copy Link'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Download All Button */}
      {processedFiles.filter(Boolean).length > 1 && allComplete && (
        <div
          
          
          
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
        </div>
      )}

      {/* Processing Stats Summary */}
      {allComplete && (
        <div
          
          
          
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
        </div>
      )}

      {/* Reset Button */}
      <div
        
        
        
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
      </div>

      {/* Guest Download Limit Modal */}
      <GuestDownloadLimitModal
        isOpen={showGuestLimitModal}
        onClose={() => setShowGuestLimitModal(false)}
        onReview={() => setShowReviewPrompt(true)}
        hasReviewed={hasReviewed()}
      />
    </div>
  );
};

import { useState, Fragment, useEffect } from "react";
import { Download, FileText, Image as ImageIcon, RotateCcw, CheckCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProcessingText } from "@/components/ProcessingText";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { playSuccessSound } from "@/utils/sound";
import {
  trackGuestActivity,
  canGuestDownload,
  incrementDownloadCount,
  hasReviewed,
  getRemainingDownloads
} from "@/utils/guestTracking";
import { GuestDownloadLimitModal } from "@/components/GuestDownloadLimitModal";

interface CompressionResultProps {
  originalFiles: File[];
  compressedFiles: (File | null)[];
  compressedSizes: number[];
  compressionProgress: number[];
  isCompressing: boolean;
  onReset: () => void;
}

export const CompressionResult = ({
  originalFiles,
  compressedFiles,
  compressedSizes,
  compressionProgress,
  isCompressing,
  onReset,
}: CompressionResultProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const navigate = useNavigate();

  // Play sound when compression is complete
  useEffect(() => {
    const allFilesCompressed = compressedFiles.length > 0 &&
                             compressedFiles.every(file => file !== null) &&
                             !isCompressing &&
                             !hasPlayedSound;

    if (allFilesCompressed && compressedFiles.length === originalFiles.length) {
      console.log('🎯 Compression completed! Playing success sound...');
      playSuccessSound();
      setHasPlayedSound(true);

      // Track guest compression activity if not authenticated
      if (!isAuthenticated()) {
        originalFiles.forEach((file, idx) => {
          const compressedFile = compressedFiles[idx];
          if (compressedFile) {
            trackGuestActivity(
              'compress',
              file.type,
              file.size,
              compressedFile.size
            );
          }
        });
      }
    }
  }, [isCompressing, compressedFiles, originalFiles, hasPlayedSound]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (original: File, compressed: File | null): number => {
    if (!compressed || compressed.size === 0) return 0;
    return Math.round(((original.size - compressed.size) / original.size) * 100);
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <ImageIcon className="h-8 w-8 text-blue-500" />;
  };

  // Calculate total compression stats
  const calculateTotalStats = () => {
    const totalOriginalSize = originalFiles.reduce((sum, file) => sum + file.size, 0);
    const totalCompressedSize = compressedFiles.reduce((sum, file) => sum + (file?.size || 0), 0);
    const totalSizeReduction = totalOriginalSize - totalCompressedSize;
    const totalCompressionRatio = totalOriginalSize > 0 
      ? Math.round((totalSizeReduction / totalOriginalSize) * 100)
      : 0;

    return {
      totalOriginalSize,
      totalCompressedSize,
      totalSizeReduction,
      totalCompressionRatio
    };
  };

  const handleDownload = async (compressedFile: File | null, fileIndex?: number) => {
    if (!compressedFile) return;

    // Check if guest or authenticated user
    if (!isAuthenticated()) {
      // Guest user - check download limit
      if (!canGuestDownload()) {
        setShowGuestLimitModal(true);
        return;
      }

      // Increment download count and track
      const newCount = incrementDownloadCount();
      await trackGuestActivity('download', compressedFile.type, 0, compressedFile.size);

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
      const url = URL.createObjectURL(compressedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = compressedFile.name;
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

  const handleShare = async (compressedFile: File | null, fileIndex?: number) => {
    if (!compressedFile) return;
    
    if (!isAuthenticated()) {
      const shareKey = fileIndex !== undefined ? `pendingShare_${fileIndex}` : 'pendingShare';
      
      sessionStorage.setItem(shareKey, JSON.stringify({
        fileName: compressedFile.name,
        fileType: compressedFile.type,
        fileSize: compressedFile.size,
        originalFileIndex: fileIndex
      }));
      sessionStorage.setItem('redirectAfterLogin', '/compress');
      sessionStorage.setItem('pendingShareIndex', fileIndex?.toString() || '0');
      
      toast({
        title: "Login Required",
        description: "Please login to share your compressed file.",
        variant: "default"
      });
      
      navigate('/login');
      return;
    }
    
    const url = URL.createObjectURL(compressedFile);
    console.log('Share triggered for:', compressedFile.name);
    try {
      if (navigator.share) {
        await navigator.share({
          files: [compressedFile],
          title: `Share ${compressedFile.name}`,
          text: `Check out this compressed file: ${compressedFile.name}`,
        });
        console.log('File shared successfully:', compressedFile.name);
        toast({
          title: "Share Successful",
          description: `Successfully shared ${compressedFile.name}`,
          variant: "default"
        });
      } else {
        await navigator.clipboard.writeText(url);
        console.log('URL copied to clipboard:', url);
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
        description: "Please login to download your compressed files.",
        variant: "default"
      });
      navigate('/login');
      return;
    }
    compressedFiles.forEach((file) => {
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

  const { totalOriginalSize, totalCompressedSize, totalSizeReduction, totalCompressionRatio } = calculateTotalStats();

  return (
    <div className="w-full space-y-6">
      {originalFiles.map((file, idx) => (
        <div key={file.name + idx}>
          {isCompressing && (!compressedFiles[idx]) ? (
            <Card className="bg-white shadow-lg border border-gray-100 mb-6">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="h-8 w-8 border-2 border-red-600 border-r-transparent rounded-full mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Compressing: {file.name}
                  </h3>
                  <ProcessingText mode="compress" progress={compressionProgress[idx] || 0} />
                </div>
              </CardContent>
            </Card>
          ) : compressedFiles[idx] ? (
            <Card className="bg-white shadow-lg border border-red-100 mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center mb-6">
                  <CheckCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Compression Complete!
                  </h3>
                  <p className="text-gray-600">
                    {file.name} has been successfully compressed
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6">
                  <Card className="bg-gray-50 border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">Original File</h4>
                          <p className="text-sm text-gray-600 truncate">
                            {file.name}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatFileSize(file.size)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">Compressed File</h4>
                          <p className="text-sm text-gray-600 truncate">
                            {compressedFiles[idx]?.name}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-red-600">
                        {formatFileSize(compressedFiles[idx]?.size || 0)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                {/* Individual File Compression Stats */}
                <div className="text-center mb-6">
                  <div className="inline-flex flex-wrap justify-center items-center gap-2">
                    <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-3 sm:px-4 py-2 rounded-full">
                      <span className="text-xs sm:text-sm font-medium">
                        {getCompressionRatio(file, compressedFiles[idx])}% size reduction
                      </span>
                    </div>
                    <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 sm:px-4 py-2 rounded-full">
                      <span className="text-xs sm:text-sm font-medium">
                        Saved: {formatFileSize(file.size - (compressedFiles[idx]?.size || 0))}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => handleDownload(compressedFiles[idx], idx)}
                    disabled={(isDownloading && downloadingIndex === idx) || !compressedFiles[idx]}
                    className="flex-1"
                  >
                    {(isDownloading && downloadingIndex === idx) ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-r-transparent rounded-full mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleShare(compressedFiles[idx], idx)}
                    disabled={!compressedFiles[idx]}
                    variant="outline"
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {navigator.share ? 'Share' : 'Copy Link'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      ))}
      {/* Total Compression Stats for Multiple Files */}
      {compressedFiles.filter(Boolean).length > 1 && (
        <div>
          <Card className="bg-white shadow-lg border border-gray-100 mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Total Compression Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="bg-gray-50 border border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Total Original Size</h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatFileSize(totalOriginalSize)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border border-red-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Total Compressed Size</h4>
                    <p className="text-lg font-semibold text-red-600">
                      {formatFileSize(totalCompressedSize)}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full mr-2">
                  <span className="text-sm font-medium">
                    {totalCompressionRatio}% size reduction
                  </span>
                </div>
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium">
                    Total Saved: {formatFileSize(totalSizeReduction)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Download All Button */}
      {compressedFiles.filter(Boolean).length > 1 && (
        <div className="flex justify-center mt-2">
          <Button
            onClick={handleDownloadAll}
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={!isAuthenticated()}
          >
            <Download className="h-4 w-4 mr-2" />
            Download All Compressed Files
          </Button>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <Button 
          variant="outline" 
          onClick={() => {
            onReset();
            setHasPlayedSound(false); // Reset sound state for next compression
          }}
          className="bg-white hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Compress Another File
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

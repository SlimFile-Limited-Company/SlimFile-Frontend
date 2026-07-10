import React, { useState } from 'react';
import { CheckCircle2, Download, RefreshCw, FileText, Image, File, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProcessingText } from '@/components/ProcessingText';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />;
    } else if (type === 'application/pdf') {
      return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />;
    }
    return <File className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />;
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
      sessionStorage.setItem('redirectAfterLogin', '/convert-only');
      sessionStorage.setItem('pendingDownloadIndex', fileIndex?.toString() || '0');
      
      toast({
        title: "Login Required",
        description: "Please login to download your converted file.",
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
      sessionStorage.setItem('redirectAfterLogin', '/convert-only');
      sessionStorage.setItem('pendingShareIndex', fileIndex?.toString() || '0');
      
      toast({
        title: "Login Required",
        description: "Please login to share your converted file.",
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
          text: `Check out this converted file: ${file.name}`,
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
        description: "Please login to download your converted files.",
        variant: "default"
      });
      navigate('/login');
      return;
    }
    convertedFiles.forEach((file) => {
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

  const allComplete = convertedFiles.every((f, i) => conversionProgress[i] === 100);

  return (
    <div className="w-full space-y-6">
      {originalFiles.map((originalFile, index) => {
        const convertedFile = convertedFiles[index];
        const progress = conversionProgress[index];
        const isComplete = progress === 100 && convertedFile;

        return (
          <div key={`${originalFile.name}-${index}`}>
            {!isComplete ? (
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
                <div className="text-center">
                  <div className="h-8 w-8 border-2 border-blue-600 border-r-transparent rounded-full mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Converting: {originalFile.name}
                  </h3>
                  <ProcessingText mode="convert" progress={progress || 0} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-lg">
                <div className="text-center mb-6">
                  <CheckCircle2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Conversion Complete!
                  </h3>
                  <p className="text-gray-600">
                    {originalFile.name} has been successfully converted to {targetFormat.toUpperCase()}
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

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      {getFileIcon(convertedFile.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">Converted File</h4>
                        <p className="text-sm text-gray-600 truncate">
                          {convertedFile.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatFileSize(convertedFile.size)}
                    </p>
                  </div>
                </div>

                {/* Auth Notice */}
                {!isAuthenticated() && (
                  <div className="mb-6 inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full w-full justify-center">
                    <span className="text-sm font-medium">
                      Login required to download or share converted files
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => handleDownload(convertedFile, index)}
                    disabled={(isDownloading && downloadingIndex === index) || !convertedFile}
                    className="flex-1"
                  >
                    {(isDownloading && downloadingIndex === index) ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-r-transparent rounded-full mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        {isAuthenticated() ? 'Download Converted File' : 'Login to Download'}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleShare(convertedFile, index)}
                    disabled={!convertedFile}
                    variant="outline"
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {isAuthenticated() ? (navigator.share ? 'Share' : 'Copy Link') : 'Login to Share'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Download All Button */}
      {convertedFiles.filter(Boolean).length > 1 && allComplete && (
        <div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-4"
        >
          <Button
            onClick={handleDownloadAll}
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={!isAuthenticated()}
          >
            <Download className="h-4 w-4 mr-2" />
            Download All Converted Files
          </Button>
        </div>
      )}

      {/* Conversion Stats Summary */}
      {allComplete && convertedFiles.length > 1 && (
        <div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Total Conversion Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-2xl font-bold text-blue-600">
                {convertedFiles.filter(f => f !== null).length}
              </p>
              <p className="text-sm text-gray-600">Files Converted</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-2xl font-bold text-green-600">
                {targetFormat.toUpperCase()}
              </p>
              <p className="text-sm text-gray-600">Output Format</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-2xl font-bold text-purple-600">
                {formatFileSize(
                  convertedSizes.reduce((sum, size) => sum + size, 0)
                )}
              </p>
              <p className="text-sm text-gray-600">Total Size</p>
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div
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
          Convert Another File
        </Button>
      </div>
    </div>
  );
};

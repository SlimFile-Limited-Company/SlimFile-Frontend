
import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { CompressionResult } from "@/components/CompressionResult";
import { toast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/lib/auth";
import { Zap, Shield, Clock } from "lucide-react";

const Compress = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<number[]>([]); // per file
  const [compressedFiles, setCompressedFiles] = useState<(File | null)[]>([]);
  const [compressedSizes, setCompressedSizes] = useState<number[]>([]);
  const [pdfWarnings, setPdfWarnings] = useState<string[]>([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  // Handle pending download after login
  useEffect(() => {
    if (isAuthenticated()) {
      const pendingDownloadIndex = sessionStorage.getItem('pendingDownloadIndex');
      const downloadKey = pendingDownloadIndex ? `pendingDownload_${pendingDownloadIndex}` : 'pendingDownload';
      const pendingDownload = sessionStorage.getItem(downloadKey);
      
      if (pendingDownload) {
        try {
          const downloadData = JSON.parse(pendingDownload);
          
          // Show message asking user to re-compress
          toast({
            title: "Login Successful",
            description: "Please re-compress your files to download them.",
            variant: "default"
          });
          
          // Clear the pending download
          sessionStorage.removeItem(downloadKey);
          sessionStorage.removeItem('pendingDownloadIndex');
          sessionStorage.removeItem('redirectAfterLogin');
          
        } catch (error) {
          console.error('Error processing pending download:', error);
          sessionStorage.removeItem(downloadKey);
          sessionStorage.removeItem('pendingDownloadIndex');
          sessionStorage.removeItem('redirectAfterLogin');
        }
      }
    }
  }, []);

  // Send file to backend for compression
  const compressFile = async (file: File, idx: number): Promise<{ file: File | null; warning?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${API_BASE_URL}/compress`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return { file: null, warning: data.error || 'Compression failed' };
      }
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `slimfile_${file.name}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }
      const compressedFile = new File([blob], filename, { type: blob.type, lastModified: Date.now() });
      return { file: compressedFile };
    } catch (err: any) {
      return { file: null, warning: err.message || 'Compression failed' };
    }
  };

  const simulateCompression = async (files: File[]) => {
    setIsCompressing(true);
    setCompressionProgress(Array(files.length).fill(0));
    setCompressedFiles(Array(files.length).fill(null));
    setCompressedSizes(Array(files.length).fill(0));
    setPdfWarnings(Array(files.length).fill(''));

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      // Progress simulation
      const progressSteps = [10, 25, 45, 65, 80, 95, 100];
      const delays = [300, 400, 500, 400, 300, 200, 100];
      for (let i = 0; i < progressSteps.length - 1; i++) {
        await new Promise(resolve => setTimeout(resolve, delays[i]));
        setCompressionProgress(prev => {
          const updated = [...prev];
          updated[idx] = progressSteps[i];
          return updated;
        });
        // Show "Hang in there..." at 95%
        if (progressSteps[i] === 95) {
          toast({
            title: `Almost Done (${file.name})`,
            description: "Hang in there… finalizing compression!",
            variant: "default",
          });
        }
      }
      try {
        const { file: compressed, warning } = await compressFile(file, idx);
        setCompressedFiles(prev => {
          const updated = [...prev];
          updated[idx] = compressed;
          return updated;
        });
        setCompressedSizes(prev => {
          const updated = [...prev];
          updated[idx] = compressed ? compressed.size : 0;
          return updated;
        });
        setCompressionProgress(prev => {
          const updated = [...prev];
          updated[idx] = 100;
          return updated;
        });
        setPdfWarnings(prev => {
          const updated = [...prev];
          updated[idx] = warning || '';
          return updated;
        });
        if (warning) {
          toast({
            title: `Compression Notice (${file.name})`,
            description: warning,
            variant: 'default',
          });
        } else if (compressed) {
          const reductionPercentage = Math.round(((file.size - compressed.size) / file.size) * 100);
          toast({
            title: `Compression Complete! (${file.name})`,
            description: `File compressed successfully. Size reduced by ${reductionPercentage}%`,
          });
        }
      } catch (error: any) {
        toast({
          title: `Compression Failed (${file.name})`,
          description: error?.message || "There was an error compressing your file. Please try again.",
          variant: "destructive"
        });
      }
    }
    setIsCompressing(false);
  };

  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(files);
    setCompressedFiles(Array(files.length).fill(null));
    setCompressedSizes(Array(files.length).fill(0));
    setCompressionProgress(Array(files.length).fill(0));
    setPdfWarnings(Array(files.length).fill(''));
    simulateCompression(files);
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setCompressedFiles([]);
    setCompressedSizes([]);
    setCompressionProgress([]);
    setPdfWarnings([]);
    setIsCompressing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-red-100/50">

      {/* Main Content */}
      <main className="relative pt-16 z-10">
        {/* Enhanced Hero Section */}
        <section className="py-20 px-0 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div
              className="max-w-6xl mx-auto"
            >
              {/* Enhanced Glass Card for Hero Content */}
              <div className="relative bg-white/30 rounded-3xl border border-white/50 shadow-2xl p-6 sm:p-12 lg:p-16 mx-0 sm:mx-6 lg:mx-8 backdrop-blur-sm">

                {/* Content */}
                <div className="relative z-10">
                  {/* Enhanced Title */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-8 sm:mb-10 leading-tight">
                    <span className="block bg-white/40 rounded-2xl px-4 py-3 sm:px-8 sm:py-4 border border-white/60 mb-2">
                      Compress Files
                    </span>
                    <span className="text-red-600 block bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent drop-shadow-lg">
                      Instantly
                    </span>
                  </h1>

                  {/* Compress Now Button */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8">
                    <div>
                      <div
                        className="text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group border-2 border-white/30 cursor-pointer"
                        onClick={() => {
                          const uploadSection = document.getElementById('upload-section');
                          if (uploadSection) {
                            uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          Compress now
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Description */}
                  <div className="bg-white/35 rounded-2xl px-4 sm:px-8 py-5 sm:py-6 border-2 border-white/50 shadow-2xl max-w-4xl mx-auto mb-8 backdrop-blur-sm">
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed text-center" style={{ wordSpacing: '0.1em' }}>
                      Reduce file sizes without compromising quality. Support for PDF, PPTX and image files with
                      <span className="text-red-600 font-semibold"> lightning-fast processing</span>.
                      <br className="hidden sm:block" />
                     
                    </p>
                  </div>

                  {/* Enhanced Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8">
                    <div className="bg-white/40 rounded-2xl p-4 border-2 border-white/50 shadow-xl backdrop-blur-sm">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-red-100/70 rounded-xl flex items-center justify-center mb-3 border border-white/50">
                          <Zap className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Lightning Fast</h3>
                        <p className="text-sm text-gray-600">Compress in seconds</p>
                      </div>
                    </div>

                    <div className="bg-white/40 rounded-2xl p-4 border-2 border-white/50 shadow-xl backdrop-blur-sm">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-blue-100/70 rounded-xl flex items-center justify-center mb-3 border border-white/50">
                          <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">100% Secure</h3>
                        <p className="text-sm text-gray-600">Client-side processing</p>
                      </div>
                    </div>

                    <div className="bg-white/40 rounded-2xl p-4 border-2 border-white/50 shadow-xl backdrop-blur-sm">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-green-100/70 rounded-xl flex items-center justify-center mb-3 border border-white/50">
                          <Clock className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Always Available</h3>
                        <p className="text-sm text-gray-600">24/7 compression</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced File Upload/Result Section */}
        <section id="upload-section" className="pb-20 px-0 sm:px-6 lg:px-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/30 rounded-3xl border border-white/50 shadow-2xl p-4 sm:p-8 max-w-4xl mx-0 sm:mx-auto backdrop-blur-sm">
              {!selectedFiles.length ? (
                <FileUpload
                  onFileSelect={handleFilesSelect}
                  isProcessing={isCompressing}
                />
              ) : (
                <CompressionResult
                  originalFiles={selectedFiles}
                  compressedFiles={compressedFiles}
                  compressedSizes={compressedSizes}
                  compressionProgress={compressionProgress}
                  isCompressing={isCompressing}
                  onReset={handleReset}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Compress;

import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { CompressionResult } from "@/components/CompressionResult";
import { toast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/lib/auth";
import { Zap, Shield, Clock, ArrowDown, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30">

      {/* Main Content */}
      <main className="relative pt-20 z-10">
        {/* Enhanced Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto text-center space-y-6">
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-gray-900 mb-2">
                  Compress Files
                </span>
                <span className="block bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                  Instantly
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Reduce file sizes without compromising quality. Support for PDF, PPTX and image files with
                <span className="text-red-600 font-semibold"> lightning-fast processing</span>.
              </p>

              {/* Scroll to Upload Button */}
              <button
                onClick={() => {
                  const uploadSection = document.getElementById('upload-section');
                  if (uploadSection) {
                    uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Compressing
                <ArrowDown className="w-5 h-5" />
              </button>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto pt-8">
                {[
                  {
                    icon: Zap,
                    title: "Lightning Fast",
                    description: "Compress in seconds",
                    gradient: "from-yellow-400 to-orange-500"
                  },
                  {
                    icon: Shield,
                    title: "100% Secure",
                    description: "Client-side processing",
                    gradient: "from-blue-400 to-blue-600"
                  },
                  {
                    icon: Clock,
                    title: "Always Available",
                    description: "24/7 compression",
                    gradient: "from-green-400 to-green-600"
                  }
                ].map((feature, index) => (
                  <div
                    key={feature.title}
                    className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Upload Files",
                    description: "Select or drag and drop your files"
                  },
                  {
                    step: "2",
                    title: "Compress",
                    description: "We optimize your files instantly"
                  },
                  {
                    step: "3",
                    title: "Download",
                    description: "Get your compressed files"
                  }
                ].map((item, index) => (
                  <div key={item.step} className="text-center">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full text-white text-2xl font-bold mb-4">
                      {item.step}
                      {index < 2 && (
                        <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-full">
                          <div className="h-0.5 bg-gradient-to-r from-red-500 to-red-300"></div>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* File Upload/Result Section */}
        <section id="upload-section" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {!selectedFiles.length ? "Upload Your Files" : "Compression Results"}
                </h2>
                <p className="text-gray-600">
                  {!selectedFiles.length 
                    ? "Drag and drop your files or click to browse" 
                    : "Your files are being compressed"}
                </p>
              </div>

              {/* Upload/Result Card - FIXED: Responsive padding */}
              <div className="relative bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-4 sm:p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-red-500 rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-red-500 rounded-br-3xl"></div>

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
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Why Choose SlimFile?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: CheckCircle2,
                    title: "High Quality",
                    description: "Maintain excellent quality while reducing file size"
                  },
                  {
                    icon: CheckCircle2,
                    title: "All File Types",
                    description: "Support for images, PDFs, and PPTX files"
                  },
                  {
                    icon: CheckCircle2,
                    title: "Batch Processing",
                    description: "Compress multiple files at once"
                  },
                  {
                    icon: CheckCircle2,
                    title: "No Installation",
                    description: "Works directly in your browser"
                  }
                ].map((feature, index) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Compress;

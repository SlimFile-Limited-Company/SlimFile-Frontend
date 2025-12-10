import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { CompressionResult } from "@/components/CompressionResult";
import { toast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/lib/auth";
import { Zap, Shield, Clock, ArrowDown, CheckCircle2, FileText, Image, ArrowRight } from "lucide-react";

const ConvertThenCompress = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<number[]>([]);
  const [processedFiles, setProcessedFiles] = useState<(File | null)[]>([]);
  const [processedSizes, setProcessedSizes] = useState<number[]>([]);
  const [processingWarnings, setProcessingWarnings] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string[]>([]);

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
          
          // Show message asking user to re-process
          toast({
            title: "Login Successful",
            description: "Please re-process your files to download them.",
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

  // Send file to backend for conversion and compression
  const convertAndCompressFile = async (file: File, idx: number): Promise<{ file: File | null; warning?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${API_BASE_URL}/convert-compress`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return { file: null, warning: data.error || 'Processing failed' };
      }
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `slimfile_${file.name}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }
      const processedFile = new File([blob], filename, { type: blob.type, lastModified: Date.now() });
      return { file: processedFile };
    } catch (err: any) {
      return { file: null, warning: err.message || 'Processing failed' };
    }
  };

  const simulateProcessing = async (files: File[]) => {
    setIsProcessing(true);
    setProcessingProgress(Array(files.length).fill(0));
    setProcessedFiles(Array(files.length).fill(null));
    setProcessedSizes(Array(files.length).fill(0));
    setProcessingWarnings(Array(files.length).fill(''));
    setCurrentStep(Array(files.length).fill(''));

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      
      // Step 1: Converting (0-50% progress)
      setCurrentStep(prev => {
        const updated = [...prev];
        updated[idx] = 'Converting...';
        return updated;
      });
      
      const convertProgress = [5, 15, 30, 45, 50];
      const convertDelays = [200, 300, 400, 300, 200];
      for (let i = 0; i < convertProgress.length; i++) {
        await new Promise(resolve => setTimeout(resolve, convertDelays[i]));
        setProcessingProgress(prev => {
          const updated = [...prev];
          updated[idx] = convertProgress[i];
          return updated;
        });
      }

      // Step 2: Compressing (50-100% progress)
      setCurrentStep(prev => {
        const updated = [...prev];
        updated[idx] = 'Compressing...';
        return updated;
      });
      
      const compressProgress = [55, 70, 85, 95, 100];
      const compressDelays = [300, 400, 300, 200, 100];
      for (let i = 0; i < compressProgress.length; i++) {
        await new Promise(resolve => setTimeout(resolve, compressDelays[i]));
        setProcessingProgress(prev => {
          const updated = [...prev];
          updated[idx] = compressProgress[i];
          return updated;
        });
        
        // Show "Hang in there..." at 95%
        if (compressProgress[i] === 95) {
          toast({
            title: `Almost Done (${file.name})`,
            description: "Hang in there… finalizing conversion and compression!",
            variant: "default",
          });
        }
      }
      
      try {
        const { file: processed, warning } = await convertAndCompressFile(file, idx);
        setProcessedFiles(prev => {
          const updated = [...prev];
          updated[idx] = processed;
          return updated;
        });
        setProcessedSizes(prev => {
          const updated = [...prev];
          updated[idx] = processed ? processed.size : 0;
          return updated;
        });
        setProcessingProgress(prev => {
          const updated = [...prev];
          updated[idx] = 100;
          return updated;
        });
        setCurrentStep(prev => {
          const updated = [...prev];
          updated[idx] = 'Complete';
          return updated;
        });
        setProcessingWarnings(prev => {
          const updated = [...prev];
          updated[idx] = warning || '';
          return updated;
        });
        if (warning) {
          toast({
            title: `Processing Notice (${file.name})`,
            description: warning,
            variant: 'default',
          });
        } else if (processed) {
          const reductionPercentage = Math.round(((file.size - processed.size) / file.size) * 100);
          toast({
            title: `Processing Complete! (${file.name})`,
            description: `File converted and compressed successfully. Size reduced by ${reductionPercentage}%`,
          });
        }
      } catch (error: any) {
        toast({
          title: `Processing Failed (${file.name})`,
          description: error?.message || "There was an error processing your file. Please try again.",
          variant: "destructive"
        });
      }
    }
    setIsProcessing(false);
  };

  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(files);
    setProcessedFiles(Array(files.length).fill(null));
    setProcessedSizes(Array(files.length).fill(0));
    setProcessingProgress(Array(files.length).fill(0));
    setProcessingWarnings(Array(files.length).fill(''));
    setCurrentStep(Array(files.length).fill(''));
    simulateProcessing(files);
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setProcessedFiles([]);
    setProcessedSizes([]);
    setProcessingProgress([]);
    setProcessingWarnings([]);
    setCurrentStep([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">

      {/* Main Content */}
      <main className="relative pt-20 z-10">
        {/* Enhanced Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto text-center space-y-6">
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-gray-900 mb-2">
                  Convert & Compress
                </span>
                <span className="block bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  All in One
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Transform your files between formats and optimize their size in a single step. Perfect quality with
                <span className="text-purple-600 font-semibold"> maximum efficiency</span>.
              </p>

              {/* Process Flow */}
              <div className="flex items-center justify-center gap-4 py-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">Convert</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-lg">
                  <Zap className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">Compress</span>
                </div>
              </div>

              {/* Scroll to Upload Button */}
              <button
                onClick={() => {
                  const uploadSection = document.getElementById('upload-section');
                  if (uploadSection) {
                    uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Processing
                <ArrowDown className="w-5 h-5" />
              </button>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto pt-8">
                {[
                  {
                    icon: Zap,
                    title: "Two-in-One",
                    description: "Convert and compress together",
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
                    title: "Time Saver",
                    description: "Single step processing",
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

        {/* Supported Formats Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Supported Formats
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Conversions */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Image Formats</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">JPG/JPEG ↔ PNG ↔ WEBP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">PDF → JPG/PNG (ZIP of pages)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Images → PDF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Compression: JPG, PNG, WEBP</span>
                    </div>
                  </div>
                </div>

                {/* Document Conversions */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Document Formats</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">DOCX → PDF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">PPTX → PDF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">XLSX → PDF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Compression: PDF, DOCX, PPTX, XLSX</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
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
                    title: "Convert & Compress",
                    description: "We transform and optimize your files"
                  },
                  {
                    step: "3",
                    title: "Download",
                    description: "Get your converted and compressed files"
                  }
                ].map((item, index) => (
                  <div key={item.step} className="text-center">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full text-white text-2xl font-bold mb-4">
                      {item.step}
                      {index < 2 && (
                        <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-full">
                          <div className="h-0.5 bg-gradient-to-r from-purple-500 to-purple-300"></div>
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
                  {!selectedFiles.length ? "Upload Your Files" : "Processing Results"}
                </h2>
                <p className="text-gray-600">
                  {!selectedFiles.length 
                    ? "Drag and drop your files or click to browse" 
                    : "Your files are being converted and compressed"}
                </p>
              </div>

              {/* Upload/Result Card */}
              <div className="relative bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-4 sm:p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-purple-500 rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-purple-500 rounded-br-3xl"></div>

                {!selectedFiles.length ? (
                  <FileUpload
                    onFileSelect={handleFilesSelect}
                    isProcessing={isProcessing}
                  />
                ) : (
                  <CompressionResult
                    originalFiles={selectedFiles}
                    compressedFiles={processedFiles}
                    compressedSizes={processedSizes}
                    compressionProgress={processingProgress}
                    isCompressing={isProcessing}
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
                    title: "Perfect Quality",
                    description: "Maintain excellent quality while converting and compressing"
                  },
                  {
                    icon: CheckCircle2,
                    title: "Maximum Efficiency",
                    description: "Get both conversion and compression in one step"
                  },
                  {
                    icon: CheckCircle2,
                    title: "Batch Processing",
                    description: "Process multiple files simultaneously"
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

export default ConvertThenCompress;

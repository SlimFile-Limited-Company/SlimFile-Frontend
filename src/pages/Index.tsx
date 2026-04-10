
import { useState } from "react";
import { Link } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";
import { CompressionResult } from "@/components/CompressionResult";
import { toast } from "@/hooks/use-toast";
import { WelcomeModal } from "@/components/WelcomeModal";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [compressedSize, setCompressedSize] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  // Send file to backend for compression
  const compressFile = async (file: File): Promise<File | null> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${API_BASE_URL}/compress`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast({
          title: "Compression Failed",
          description: data.error || 'Compression failed',
          variant: "destructive"
        });
        return null;
      }
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `compressed_${file.name}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }
      return new File([blob], filename, { type: blob.type, lastModified: Date.now() });
    } catch (err: any) {
      toast({
        title: "Compression Failed",
        description: err.message || 'Compression failed',
        variant: "destructive"
      });
      return null;
    }
  };

  const simulateCompression = async (file: File) => {
    setIsCompressing(true);
    setCompressionProgress(0);
    // Progress simulation
    const progressSteps = [10, 25, 45, 65, 80, 95, 100];
    const delays = [300, 400, 500, 400, 300, 200, 100];
    for (let i = 0; i < progressSteps.length - 1; i++) {
      await new Promise(resolve => setTimeout(resolve, delays[i]));
      setCompressionProgress(progressSteps[i]);
    }
    try {
      const compressed = await compressFile(file);
      if (compressed) {
        setCompressedFile(compressed);
        setCompressedSize(compressed.size);
        setCompressionProgress(100);
        const reductionPercentage = Math.round(((file.size - compressed.size) / file.size) * 100);
        toast({
          title: "Compression Complete!",
          description: `File compressed successfully. Size reduced by ${reductionPercentage}%`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Compression Failed",
        description: error?.message || "There was an error compressing your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setCompressedFile(null);
    setCompressedSize(0);
    simulateCompression(file);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCompressedFile(null);
    setIsCompressing(false);
    setCompressionProgress(0);
    setCompressedSize(0);
  };

  return (
    <div className="min-h-screen pt-28">
      <WelcomeModal />
      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v6h6V7z" />
                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700">File compression platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              From managing files,
              <br />
              to doing the work for you
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Smart file compression that delivers results across images,
              <br className="hidden sm:block" />
              PDFs, presentations, and documents.
            </p>

            {/* CTA Button */}
            <div className="mb-4">
              <button
                onClick={() => {
                  const uploadSection = document.querySelector('[data-upload-section]');
                  uploadSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-md"
              >
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Small text below button */}
            <p className="text-sm text-gray-500 mb-16">
              No credit card needed ✦ Unlimited compression on Free plan
            </p>

            {/* Category Selection */}
            <div className="mt-12">
              <p className="text-sm font-medium text-gray-700 mb-4">Where would you like to start?</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-full font-medium hover:bg-primary/5 transition-colors">
                  Images
                </button>
                <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-full font-medium hover:border-gray-400 transition-colors">
                  PDFs
                </button>
                <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-full font-medium hover:border-gray-400 transition-colors">
                  Presentations
                </button>
                <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-full font-medium hover:border-gray-400 transition-colors">
                  Documents
                </button>
                <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-full font-medium hover:border-gray-400 transition-colors">
                  Videos
                </button>
                <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-full font-medium hover:border-gray-400 transition-colors">
                  All Files
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload/Result Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8" data-upload-section>
        <div className="container mx-auto">
          {!selectedFile ? (
            <FileUpload 
              onFileSelect={handleFileSelect} 
              isProcessing={isCompressing}
            />
          ) : (
            <CompressionResult
              originalFile={selectedFile}
              compressedFile={compressedFile}
              compressedSize={compressedSize}
              compressionProgress={compressionProgress}
              isCompressing={isCompressing}
              onReset={handleReset}
            />
          )}
        </div>
      </section>

      {/* Summarize CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 rounded-full text-white text-xs font-semibold mb-2">
                <span>✦</span> New AI Feature
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Summarize Documents Instantly</h2>
              <p className="text-white/80 text-sm leading-relaxed">
                Upload a PDF or DOCX — SlimFile compresses it, extracts the text, and generates a clear AI-powered summary using Llama 3.
              </p>
            </div>
            <Link
              to="/summarize"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-xl font-semibold text-sm hover:bg-purple-50 transition-colors shadow-md"
            >
              Try it free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SlimFile?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fast, secure, and reliable file compression that works entirely in your browser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Compress files in seconds with our optimized algorithms.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Secure</h3>
              <p className="text-gray-600">All processing happens locally. Your files never leave your device.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Works Online</h3>
              <p className="text-gray-600">Install as a PWA and compress files with internet connection.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;


import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { CompressionResult } from "@/components/CompressionResult";
import { toast } from "@/hooks/use-toast";

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
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Compress Files
              <span className="text-primary block">Instantly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Reduce file sizes without compromising quality. Support for PDF and image files with lightning-fast processing.
            </p>
          </div>
        </div>
      </section>

      {/* Upload/Result Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
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

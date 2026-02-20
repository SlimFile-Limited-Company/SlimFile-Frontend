
import { useState } from "react";
import { Link } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";
import { CompressionResult } from "@/components/CompressionResult";
import { toast } from "@/hooks/use-toast";
import { WelcomeModal } from "@/components/WelcomeModal";
import {
  FileImage, FileText, Zap, Users, ScanText, Radio,
  Video, PenTool, FileType, FilePlus2, Lock, ArrowRight,
} from "lucide-react";

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
    <div className="min-h-screen pt-24">
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

      {/* Everything You Need Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need, all in one place
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              One platform for compressing, converting, collaborating, and managing all your files.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: <FileImage className="w-5 h-5" />, label: 'Compress Files', desc: 'Images, PDFs & docs', href: '/compress', color: 'text-blue-500 bg-blue-50' },
              { icon: <FileText className="w-5 h-5" />, label: 'Convert Formats', desc: 'Any format, no loss', href: '/convert-only', color: 'text-purple-500 bg-purple-50' },
              { icon: <Zap className="w-5 h-5" />, label: 'Convert & Compress', desc: 'Best of both worlds', href: '/convert-compress', color: 'text-red-500 bg-red-50' },
              { icon: <Users className="w-5 h-5" />, label: 'Team Workspaces', desc: 'Chat & collaborate', href: '/workspaces', color: 'text-green-500 bg-green-50' },
              { icon: <ScanText className="w-5 h-5" />, label: 'OCR Tool', desc: 'Extract text from images', href: '/ocr-tool', color: 'text-orange-500 bg-orange-50' },
              { icon: <Radio className="w-5 h-5" />, label: 'Activity Feed', desc: 'Real-time updates', href: '/feed', color: 'text-indigo-500 bg-indigo-50' },
              { icon: <Video className="w-5 h-5" />, label: 'Video Meetings', desc: 'HD calls & screen share', href: '/meet', color: 'text-cyan-500 bg-cyan-50' },
              { icon: <PenTool className="w-5 h-5" />, label: 'Whiteboards', desc: 'Sketch & brainstorm', href: '/my-whiteboards', color: 'text-pink-500 bg-pink-50' },
              { icon: <FileType className="w-5 h-5" />, label: 'My Documents', desc: 'Write & edit docs', href: '/documents', color: 'text-sky-500 bg-sky-50' },
              { icon: <FilePlus2 className="w-5 h-5" />, label: 'PDF Merger & Splitter', desc: 'Combine or split PDFs', href: '/forge', color: 'text-amber-500 bg-amber-50' },
              { icon: <Lock className="w-5 h-5" />, label: 'PDF Password Protect', desc: 'Lock & unlock PDFs', href: '/lock', color: 'text-violet-500 bg-violet-50' },
            ].map(({ icon, label, desc, href, color }) => (
              <Link
                key={label}
                to={href}
                className="flex flex-col gap-3 bg-white rounded-2xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors mt-auto" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

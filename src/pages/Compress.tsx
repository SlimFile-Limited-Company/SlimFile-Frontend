
import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { CompressionResult } from "@/components/CompressionResult";
import { toast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/lib/auth";
import { motion } from "framer-motion";

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





// ✅ Show "Hang in there..." at 95%
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
    <div className="min-h-screen bg-gray-50">
      <main className="pt-16">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Compress Files
                <span className="text-red-600 block bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                  Instantly
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                Reduce file sizes without compromising quality. Support for PDF, PPTX and image files with lightning-fast processing.
                Note that pre compressed files will give a negative compression percentage reduction.
              </p>
            </motion.div>
          </div>
        </section>
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
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
        </section>
      </main>
    </div>
  );
};

export default Compress;

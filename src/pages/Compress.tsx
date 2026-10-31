import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { CompressionResult } from "@/components/CompressionResult";
import { uploadWithProgress, queuedProgress, type TransferProgress } from "@/lib/uploadWithProgress";
import { toast } from "@/hooks/use-toast";
import { isAuthenticated, getUserProfile } from "@/lib/auth";
import { Zap, Shield, Clock, ArrowDown, CheckCircle2 } from "lucide-react";
import { notifyCompressionComplete } from "@/services/pushNotificationService";
import { useTranslation } from "@/hooks/useTranslation";

const Compress = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Compress Files Instantly | SlimFile';
  }, []);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<number[]>([]); // per file
  const [fileProgress, setFileProgress] = useState<TransferProgress[]>([]); // real per-file transfer state
  const [compressedFiles, setCompressedFiles] = useState<(File | null)[]>([]);
  const [compressedSizes, setCompressedSizes] = useState<number[]>([]);
  const [pdfWarnings, setPdfWarnings] = useState<string[]>([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
            title: t('compress.loginSuccess'),
            description: t('compress.recompressPrompt'),
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

    // Include JWT token if user is logged in (for history tracking)
    const token = localStorage.getItem('jwt');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const setProgress = (p: TransferProgress) =>
      setFileProgress(prev => {
        const updated = [...prev];
        updated[idx] = p;
        return updated;
      });

    try {
      const response = await uploadWithProgress(`${API_BASE_URL}/compress`, formData, headers, setProgress);
      if (!response.ok) {
        const data = await response.blob.text().then(t => JSON.parse(t)).catch(() => ({}));
        return { file: null, warning: data.error || 'Compression failed' };
      }
      const blob = response.blob;
      const contentDisposition = response.getHeader('Content-Disposition');
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

  const runCompression = async (files: File[]) => {
    setIsCompressing(true);
    setCompressionProgress(Array(files.length).fill(0));
    setCompressedFiles(Array(files.length).fill(null));
    setCompressedSizes(Array(files.length).fill(0));
    setPdfWarnings(Array(files.length).fill(''));
    // Files go one at a time; the rest wait in the queue until their turn.
    setFileProgress(files.map(() => queuedProgress()));

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      try {
        const { file: compressed, warning } = await compressFile(file, idx);
        if (!compressed) {
          setFileProgress(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], stage: 'error' };
            return updated;
          });
        }
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
            title: `${t('compress.notice')} (${file.name})`,
            description: warning,
            variant: 'default',
          });
        } else if (compressed) {
          const reductionPercentage = Math.round(((file.size - compressed.size) / file.size) * 100);
          const spaceSaved = formatFileSize(file.size - compressed.size);

          toast({
            title: `${t('compress.complete')} (${file.name})`,
            description: `${t('compress.sizeReduced')} ${reductionPercentage}%`,
          });

          // Show push notification
          notifyCompressionComplete(file.name, reductionPercentage, spaceSaved);
        }
      } catch (error: any) {
        toast({
          title: `${t('compress.failed')} (${file.name})`,
          description: error?.message || t('compress.failedDesc'),
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
    runCompression(files);
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setCompressedFiles([]);
    setCompressedSizes([]);
    setCompressionProgress([]);
    setFileProgress([]);
    setPdfWarnings([]);
    setIsCompressing(false);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Main Content */}
      <main className="relative pt-28 z-10">
        {/* Enhanced Hero Section */}
        <section className="pt-10 pb-4 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-5">
              {/* Title */}
              <h1 className="text-4xl sm:text-[56px] sm:leading-[1.07] font-semibold tracking-tight text-[#1d1d1f]">
                <span className="block">
                  {t('compress.heroTitle')}
                </span>
                {' '}
                <span className="block text-red-600">
                  {t('compress.heroSubtitle')}
                </span>
              </h1>

              {/* Description */}
              <p className="text-[#6e6e73] text-lg sm:text-[21px] leading-snug max-w-2xl mx-auto">
                {t('compress.heroDescription')}
                <span className="text-red-600 font-semibold"> {t('compress.lightningFast')}</span>.
              </p>


              {/* Jump to the upload box */}
              <button
                onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="group inline-flex items-center gap-2 h-11 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white text-[15px] font-medium transition-colors duration-200"
              >
                {t('compress.start')}
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </div>
          </div>
        </section>

        {/* File Upload/Result Section */}
        <section id="upload-section" className="scroll-mt-16 pt-6 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-8">
                <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f] mb-2">
                  {!selectedFiles.length ? t('compress.uploadTitle') : t('compress.resultsTitle')}
                </h2>
                <p className="text-[#6e6e73]">
                  {!selectedFiles.length
                    ? t('compress.uploadSubtitle')
                    : t('compress.processingSubtitle')}
                </p>
              </div>

              {/* Upload/Result Card - FIXED: Responsive padding */}
              <div className="relative bg-[#f5f5f7] rounded-[28px] p-4 sm:p-6 md:p-8">

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
                    fileProgress={fileProgress}
                    isCompressing={isCompressing}
                    onReset={handleReset}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Supported Formats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-[40px] font-semibold tracking-tight text-[#1d1d1f] text-center mb-12">
                {t('compress.formatsTitle')}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Compression */}
                <div className="bg-[#f5f5f7] rounded-[28px] p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1d1d1f]">{t('compress.imageCompression')}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">JPG/JPEG</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">PNG</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">WEBP</span>
                    </div>
                  </div>
                </div>

                {/* Document Compression */}
                <div className="bg-[#f5f5f7] rounded-[28px] p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1d1d1f]">{t('compress.documentCompression')}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">PDF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">DOCX</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">PPTX</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">XLSX</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f5f5f7]">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-[40px] font-semibold tracking-tight text-[#1d1d1f] text-center mb-12">
                {t('compress.howItWorks')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: t('compress.step1'),
                    description: t('compress.step1Desc')
                  },
                  {
                    step: "2",
                    title: t('compress.step2'),
                    description: t('compress.step2Desc')
                  },
                  {
                    step: "3",
                    title: t('compress.step3'),
                    description: t('compress.step3Desc')
                  }
                ].map((item, index) => (
                  <div key={item.step} className="text-center">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full text-white text-2xl font-semibold mb-4">
                      {item.step}
                      {index < 2 && (
                        <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-full">
                          <div className="h-0.5 bg-gradient-to-r from-red-500 to-red-300"></div>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">{item.title}</h3>
                    <p className="text-sm text-[#6e6e73]">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-[40px] font-semibold tracking-tight text-[#1d1d1f] text-center mb-12">
                {t('compress.whyChoose')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: CheckCircle2,
                    title: t('compress.quality'),
                    description: t('compress.qualityDesc')
                  },
                  {
                    icon: CheckCircle2,
                    title: t('compress.allTypes'),
                    description: t('compress.allTypesDesc')
                  },
                  {
                    icon: CheckCircle2,
                    title: t('compress.batch'),
                    description: t('compress.batchDesc')
                  },
                  {
                    icon: CheckCircle2,
                    title: t('compress.noInstall'),
                    description: t('compress.noInstallDesc')
                  }
                ].map((feature, index) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-4 p-7 bg-[#f5f5f7] rounded-[28px]"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1d1d1f] mb-1">{feature.title}</h3>
                      <p className="text-sm text-[#6e6e73]">{feature.description}</p>
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

import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ConversionCompressionResult } from "@/components/ConversionCompressionResult";
import { uploadWithProgress, queuedProgress, type TransferProgress } from "@/lib/uploadWithProgress";
import { toast } from "@/hooks/use-toast";
import { isAuthenticated, getToken } from "@/lib/auth";
import { Zap, Shield, Clock, ArrowDown, CheckCircle2, FileText, Image, ArrowRight } from "lucide-react";
import { notifyConversionCompressionComplete } from "@/services/pushNotificationService";
import { useTranslation } from "@/hooks/useTranslation";
import { useSEO } from "@/hooks/useSEO";

const ConvertThenCompress = () => {
  useSEO({
    title: 'Convert Then Compress — Optimize Files in One Step | SlimFile',
    description: 'Convert your file to a new format and compress it in one seamless step. Save time and reduce file size with SlimFile.',
  });
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<number[]>([]);
  const [fileProgress, setFileProgress] = useState<TransferProgress[]>([]); // real per-file transfer state
  const [processedFiles, setProcessedFiles] = useState<(File | null)[]>([]);
  const [processedSizes, setProcessedSizes] = useState<number[]>([]);
  const [processingWarnings, setProcessingWarnings] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string[]>([]);

  // NEW: Format selection states
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [availableFormats, setAvailableFormats] = useState<string[]>([]);
  const [showFormatSelector, setShowFormatSelector] = useState(false);

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
          
          toast({
            title: t('convertCompress.loginSuccess'),
            description: t('convertCompress.reprocessPrompt'),
            variant: "default"
          });
          
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

  // NEW: Detect available formats based on file type
  const getAvailableFormats = (file: File): string[] => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    // Images can convert to: jpg, png, webp, pdf
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      return ['jpg', 'png', 'webp', 'pdf'];
    }

    // PDF can convert to: jpg, png (images) or docx, pptx, xlsx (office)
    if (ext === 'pdf') {
      return ['jpg', 'png', 'docx', 'pptx', 'xlsx'];
    }

    // DOCX can convert to: pdf, pptx, xlsx
    if (ext === 'docx') {
      return ['pdf', 'pptx', 'xlsx'];
    }

    // PPTX can convert to: pdf, docx, xlsx
    if (ext === 'pptx') {
      return ['pdf', 'docx', 'xlsx'];
    }

    // XLSX can convert to: pdf, docx, pptx
    if (ext === 'xlsx') {
      return ['pdf', 'docx', 'pptx'];
    }

    return ['pdf']; // default
  };

  // UPDATED: Send file to backend with targetFormat
  const convertAndCompressFile = async (file: File, targetFormat: string, idx: number): Promise<{ file: File | null; warning?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);
    
    const setProgress = (p: TransferProgress) =>
      setFileProgress(prev => {
        const updated = [...prev];
        updated[idx] = p;
        return updated;
      });

    try {
      const token = getToken();
      const response = await uploadWithProgress(
        `${API_BASE_URL}/convert-compress`,
        formData,
        token ? { Authorization: `Bearer ${token}` } : {},
        setProgress
      );

      if (!response.ok) {
        const data = await response.blob.text().then(t => JSON.parse(t)).catch(() => ({}));
        return { file: null, warning: data.error || 'Processing failed' };
      }

      const blob = response.blob;

      // FIXED: Better header parsing
      const contentDisposition = response.getHeader('Content-Disposition');
      let filename = `converted_compressed_${file.name.replace(/\.[^/.]+$/, '')}.${targetFormat}`; // Better fallback
      
      console.log('Content-Disposition header:', contentDisposition); // Debug log
      
      if (contentDisposition) {
        // Try multiple regex patterns
        const patterns = [
          /filename[^;=\n]*=["']([^"']+)["']/i,  // filename="file.jpg" or filename='file.jpg'
          /filename[^;=\n]*=([^;"\s]+)/i,         // filename=file.jpg
          /filename\*=UTF-8''(.+)/i               // filename*=UTF-8''file.jpg
        ];
        
        for (const pattern of patterns) {
          const match = contentDisposition.match(pattern);
          if (match && match[1]) {
            filename = decodeURIComponent(match[1]);
            console.log('Extracted filename:', filename); // Debug log
            break;
          }
        }
      }
      
      console.log('Final filename:', filename); // Debug log
      
      const processedFile = new File([blob], filename, { type: blob.type, lastModified: Date.now() });
      return { file: processedFile };
    } catch (err: any) {
      return { file: null, warning: err.message || 'Processing failed' };
    }
  };

  // UPDATED: Processing with selected format
  const runProcessing = async (files: File[], targetFormat: string) => {
    setIsProcessing(true);
    setProcessingProgress(Array(files.length).fill(0));
    setProcessedFiles(Array(files.length).fill(null));
    setProcessedSizes(Array(files.length).fill(0));
    setProcessingWarnings(Array(files.length).fill(''));
    setCurrentStep(Array(files.length).fill(''));
    // Files go one at a time; the rest wait in the queue until their turn.
    setFileProgress(files.map(() => queuedProgress()));

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];

      try {
        const { file: processed, warning } = await convertAndCompressFile(file, targetFormat, idx);
        if (!processed) {
          setFileProgress(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], stage: 'error' };
            return updated;
          });
        }
        
        // Only NOW set to 100% after API completes
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
          updated[idx] = 100; // Set to 100% ONLY after API completes
          return updated;
        });
        setCurrentStep(prev => {
          const updated = [...prev];
          updated[idx] = t('convertCompress.complete');
          return updated;
        });
        setProcessingWarnings(prev => {
          const updated = [...prev];
          updated[idx] = warning || '';
          return updated;
        });

        if (warning) {
          toast({
            title: `${t('convertCompress.notice')} (${file.name})`,
            description: warning,
            variant: 'default',
          });
        } else if (processed) {
          const reductionPercentage = Math.round(((file.size - processed.size) / file.size) * 100);
          toast({
            title: `${t('convertCompress.successTitle')} (${file.name})`,
            description: `${t('convertCompress.successDesc')} ${targetFormat.toUpperCase()} ${t('convertCompress.sizeReduced')} ${reductionPercentage}%`,
          });

          // Show push notification
          notifyConversionCompressionComplete(file.name, targetFormat, reductionPercentage);
        }
      } catch (error: any) {
        toast({
          title: `${t('convertCompress.failed')} (${file.name})`,
          description: error?.message || t('convertCompress.failedDesc'),
          variant: "destructive"
        });
      }
    }

    setIsProcessing(false);
  };

  // UPDATED: Handle file selection - don't start processing yet
  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(files);
    setProcessedFiles(Array(files.length).fill(null));
    setProcessedSizes(Array(files.length).fill(0));
    setProcessingProgress(Array(files.length).fill(0));
    setProcessingWarnings(Array(files.length).fill(''));
    setCurrentStep(Array(files.length).fill(''));
    
    // NEW: Set available formats based on first file
    if (files.length > 0) {
      const formats = getAvailableFormats(files[0]);
      setAvailableFormats(formats);
      setSelectedFormat(formats[0]); // Set first format as default
      setShowFormatSelector(true); // Show format selector
    }
  };

  // NEW: Start processing when user clicks the button
  const handleStartProcessing = () => {
    setShowFormatSelector(false);
    runProcessing(selectedFiles, selectedFormat);
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setProcessedFiles([]);
    setProcessedSizes([]);
    setProcessingProgress([]);
    setFileProgress([]);
    setProcessingWarnings([]);
    setCurrentStep([]);
    setIsProcessing(false);
    setShowFormatSelector(false);
    setAvailableFormats([]);
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
                  {t('convertCompress.title')}
                </span>
                <span className="block text-red-600">
                  {t('convertCompress.subtitle')}
                </span>
              </h1>

              {/* Description */}
              <p className="text-[#6e6e73] text-lg sm:text-[21px] leading-snug max-w-2xl mx-auto">
                {t('convertCompress.heroDescription')}
                <span className="text-purple-600 font-semibold"> {t('convertCompress.maxEfficiency')}</span>.
              </p>

              {/* Process Flow */}
              <div className="flex items-center justify-center gap-4 py-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">{t('convertCompress.convertLabel')}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-lg">
                  <Zap className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">{t('convertCompress.compressLabel')}</span>
                </div>
              </div>


              {/* Jump to the upload box */}
              <button
                onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="group inline-flex items-center gap-2 h-11 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white text-[15px] font-medium transition-colors duration-200"
              >
                {t('convertCompress.start')}
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
                  {!selectedFiles.length ? t('convertCompress.uploadTitle') : showFormatSelector ? t('convertCompress.chooseFormat') : t('convertCompress.resultsTitle')}
                </h2>
                <p className="text-[#6e6e73]">
                  {!selectedFiles.length
                    ? t('convertCompress.uploadSubtitle')
                    : showFormatSelector
                    ? t('convertCompress.selectFormatSubtitle')
                    : t('convertCompress.processingSubtitle')}
                </p>
              </div>

              {/* Upload/Result Card */}
              <div className="relative bg-[#f5f5f7] rounded-[28px] p-4 sm:p-6 md:p-8">

                {!selectedFiles.length ? (
                  <FileUpload
                    onFileSelect={handleFilesSelect}
                    isProcessing={isProcessing}
                  />
                ) : showFormatSelector ? (
                  /* NEW: Format Selector UI */
                  <div className="space-y-6">
                    {/* File Info */}
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <p className="text-sm text-gray-600 mb-2">{selectedFiles.length > 1 ? t('convertCompress.selectedFilesPlural') : t('convertCompress.selectedFiles')}:</p>
                      {selectedFiles.map((file, idx) => (
                        <p key={idx} className="font-semibold text-gray-900">{file.name}</p>
                      ))}
                    </div>

                    {/* Format Selection */}
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-4">
                        {t('convertCompress.convertToLabel')}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {availableFormats.map((format) => (
                          <button
                            key={format}
                            onClick={() => setSelectedFormat(format)}
                            className={`px-6 py-4 rounded-xl font-bold text-lg transition-all transform ${
                              selectedFormat === format
                                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                            }`}
                          >
                            {format.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleStartProcessing}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
                      >
                        {t('convertCompress.processButton')} {selectedFormat.toUpperCase()}
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                      >
                        {t('convertCompress.cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <ConversionCompressionResult
                    originalFiles={selectedFiles}
                    processedFiles={processedFiles}
                    processedSizes={processedSizes}
                    processingProgress={processingProgress}
                    fileProgress={fileProgress}
                    isProcessing={isProcessing}
                    onReset={handleReset}
                    targetFormat={selectedFormat}
                    currentStep={currentStep}
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
                {t('convertCompress.formatsTitle')}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Conversions */}
                <div className="bg-[#f5f5f7] rounded-[28px] p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1d1d1f]">{t('convertCompress.imageFormats')}</h3>
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
                <div className="bg-[#f5f5f7] rounded-[28px] p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1d1d1f]">{t('convertCompress.documentFormats')}</h3>
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
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f5f5f7]">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-[40px] font-semibold tracking-tight text-[#1d1d1f] text-center mb-12">
                {t('convertCompress.howItWorks')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: t('convertCompress.step1'),
                    description: t('convertCompress.step1Desc')
                  },
                  {
                    step: "2",
                    title: t('convertCompress.step2'),
                    description: t('convertCompress.step2Desc')
                  },
                  {
                    step: "3",
                    title: t('convertCompress.step3'),
                    description: t('convertCompress.step3Desc')
                  }
                ].map((item, index) => (
                  <div key={item.step} className="text-center">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full text-white text-2xl font-semibold mb-4">
                      {item.step}
                      {index < 2 && (
                        <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-full">
                          <div className="h-0.5 bg-gradient-to-r from-purple-500 to-purple-300"></div>
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
                {t('convertCompress.whyChoose')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: CheckCircle2,
                    title: t('convertCompress.quality'),
                    description: t('convertCompress.qualityDesc')
                  },
                  {
                    icon: CheckCircle2,
                    title: t('convertCompress.efficiency'),
                    description: t('convertCompress.efficiencyDesc')
                  },
                  {
                    icon: CheckCircle2,
                    title: t('convertCompress.batch'),
                    description: t('convertCompress.batchDesc')
                  },
                  {
                    icon: CheckCircle2,
                    title: t('convertCompress.noInstall'),
                    description: t('convertCompress.noInstallDesc')
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

export default ConvertThenCompress;
import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ConversionResult } from "@/components/ConversionResult";
import { toast } from "@/hooks/use-toast";
import { isAuthenticated, getToken } from "@/lib/auth";
import { Zap, Shield, Clock, ArrowDown, CheckCircle2, FileText, Image } from "lucide-react";
import { notifyConversionComplete } from "@/services/pushNotificationService";
import { useTranslation } from "@/hooks/useTranslation";

const ConvertOnly = () => {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState<number[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<(File | null)[]>([]);
  const [convertedSizes, setConvertedSizes] = useState<number[]>([]);
  const [conversionWarnings, setConversionWarnings] = useState<string[]>([]);
  
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
            title: t('convert.loginSuccess'),
            description: t('convert.reconvertPrompt'),
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
  const convertFile = async (file: File, targetFormat: string, idx: number): Promise<{ file: File | null; warning?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);
    
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/convert`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return { file: null, warning: data.error || 'Conversion failed' };
      }
      
      const blob = await response.blob();
      
      // FIXED: Better header parsing
      const contentDisposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition');
      let filename = `converted_${file.name.replace(/\.[^/.]+$/, '')}.${targetFormat}`; // Better fallback
      
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
      
      const convertedFile = new File([blob], filename, { type: blob.type, lastModified: Date.now() });
      return { file: convertedFile };
    } catch (err: any) {
      return { file: null, warning: err.message || 'Conversion failed' };
    }
  };

  // UPDATED: Conversion with selected format
  const simulateConversion = async (files: File[], targetFormat: string) => {
    setIsConverting(true);
    setConversionProgress(Array(files.length).fill(0));
    setConvertedFiles(Array(files.length).fill(null));
    setConvertedSizes(Array(files.length).fill(0));
    setConversionWarnings(Array(files.length).fill(''));

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      
      // Progress simulation - Stop at 95%!
      const progressSteps = [10, 25, 45, 65, 80, 95]; // Don't go to 100 yet!
      const delays = [200, 300, 400, 300, 200, 100];
      
      for (let i = 0; i < progressSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, delays[i]));
        setConversionProgress(prev => {
          const updated = [...prev];
          updated[idx] = progressSteps[i];
          return updated;
        });
      }
      
      // NOW make the actual API call (progress stays at 95%)
      try {
        const { file: converted, warning } = await convertFile(file, targetFormat, idx);
        
        // Only NOW set to 100% after API completes
        setConvertedFiles(prev => {
          const updated = [...prev];
          updated[idx] = converted;
          return updated;
        });
        setConvertedSizes(prev => {
          const updated = [...prev];
          updated[idx] = converted ? converted.size : 0;
          return updated;
        });
        setConversionProgress(prev => {
          const updated = [...prev];
          updated[idx] = 100; // Set to 100% ONLY after API completes
          return updated;
        });
        setConversionWarnings(prev => {
          const updated = [...prev];
          updated[idx] = warning || '';
          return updated;
        });
        
        if (warning) {
          toast({
            title: `${t('convert.notice')} (${file.name})`,
            description: warning,
            variant: 'default',
          });
        } else if (converted) {
          toast({
            title: `${t('convert.complete')} (${file.name})`,
            description: `${t('convert.successDesc')} ${targetFormat.toUpperCase()}.`,
          });

          // Show push notification
          notifyConversionComplete(file.name, targetFormat);
        }
      } catch (error: any) {
        toast({
          title: `${t('convert.failed')} (${file.name})`,
          description: error?.message || t('convert.failedDesc'),
          variant: "destructive"
        });
      }
    }
    
    setIsConverting(false);
  };

  // UPDATED: Handle file selection - don't start processing yet
  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(files);
    setConvertedFiles(Array(files.length).fill(null));
    setConvertedSizes(Array(files.length).fill(0));
    setConversionProgress(Array(files.length).fill(0));
    setConversionWarnings(Array(files.length).fill(''));
    
    // NEW: Set available formats based on first file
    if (files.length > 0) {
      const formats = getAvailableFormats(files[0]);
      setAvailableFormats(formats);
      setSelectedFormat(formats[0]); // Set first format as default
      setShowFormatSelector(true); // Show format selector
    }
  };

  // NEW: Start conversion when user clicks the button
  const handleStartConversion = () => {
    setShowFormatSelector(false);
    simulateConversion(selectedFiles, selectedFormat);
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setConvertedFiles([]);
    setConvertedSizes([]);
    setConversionProgress([]);
    setConversionWarnings([]);
    setIsConverting(false);
    setShowFormatSelector(false);
    setAvailableFormats([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">

      {/* Main Content */}
      <main className="relative pt-28 z-10">
        {/* Enhanced Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto text-center space-y-6">
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-gray-900 mb-2">
                  {t('convert.heroTitle')}
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {t('convert.heroSubtitle')}
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                {t('convert.heroDescription')}
                <span className="text-blue-600 font-semibold"> {t('convert.lightningFast')}</span>.
              </p>

              {/* Scroll to Upload Button */}
              <button
                onClick={() => {
                  const uploadSection = document.getElementById('upload-section');
                  if (uploadSection) {
                    uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t('convert.start')}
                <ArrowDown className="w-5 h-5" />
              </button>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto pt-8">
                {[
                  {
                    icon: Zap,
                    title: t('convert.feature.fast'),
                    description: t('convert.feature.fastDesc'),
                    gradient: "from-yellow-400 to-orange-500"
                  },
                  {
                    icon: Shield,
                    title: t('convert.feature.secure'),
                    description: t('convert.feature.secureDesc'),
                    gradient: "from-blue-400 to-blue-600"
                  },
                  {
                    icon: Clock,
                    title: t('convert.feature.available'),
                    description: t('convert.feature.availableDesc'),
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

        {/* Supported Conversions Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                {t('convert.conversionsTitle')}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Conversions */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{t('convert.imageConversions')}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">JPG/JPEG ↔ PNG ↔ WEBP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Any image format to any other image format</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">PDF → JPG/PNG (returns ZIP of all pages)</span>
                    </div>
                  </div>
                </div>

                {/* Document Conversions */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{t('convert.documentConversions')}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">DOCX ↔ PPTX ↔ XLSX</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">DOCX/PPTX/XLSX → PDF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">PDF → DOCX/PPTX/XLSX</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">JPG/PNG/WEBP → PDF</span>
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
                {t('convert.howItWorks')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: t('convert.step1'),
                    description: t('convert.step1Desc')
                  },
                  {
                    step: "2",
                    title: t('convert.step2'),
                    description: t('convert.step2Desc')
                  },
                  {
                    step: "3",
                    title: t('convert.step3'),
                    description: t('convert.step3Desc')
                  }
                ].map((item, index) => (
                  <div key={item.step} className="text-center">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white text-2xl font-bold mb-4">
                      {item.step}
                      {index < 2 && (
                        <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-full">
                          <div className="h-0.5 bg-gradient-to-r from-blue-500 to-blue-300"></div>
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
                  {!selectedFiles.length ? t('convert.uploadTitle') : showFormatSelector ? t('convert.chooseFormat') : t('convert.resultsTitle')}
                </h2>
                <p className="text-gray-600">
                  {!selectedFiles.length
                    ? t('convert.uploadSubtitle')
                    : showFormatSelector
                    ? t('convert.selectFormatSubtitle')
                    : t('convert.processingSubtitle')}
                </p>
              </div>

              {/* Upload/Result Card */}
              <div className="relative bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-4 sm:p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-blue-500 rounded-br-3xl"></div>

                {!selectedFiles.length ? (
                  <FileUpload
                    onFileSelect={handleFilesSelect}
                    isProcessing={isConverting}
                  />
                ) : showFormatSelector ? (
                  /* NEW: Format Selector UI */
                  <div className="space-y-6">
                    {/* File Info */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <p className="text-sm text-gray-600 mb-2">{selectedFiles.length > 1 ? t('convert.selectedFilesPlural') : t('convert.selectedFiles')}:</p>
                      {selectedFiles.map((file, idx) => (
                        <p key={idx} className="font-semibold text-gray-900">{file.name}</p>
                      ))}
                    </div>

                    {/* Format Selection */}
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-4">
                        {t('convert.convertToLabel')}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {availableFormats.map((format) => (
                          <button
                            key={format}
                            onClick={() => setSelectedFormat(format)}
                            className={`px-6 py-4 rounded-xl font-bold text-lg transition-all transform ${
                              selectedFormat === format
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg scale-105'
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
                        onClick={handleStartConversion}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
                      >
                        {t('convert.convertButton')} {selectedFormat.toUpperCase()}
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                      >
                        {t('convert.cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <ConversionResult
                    originalFiles={selectedFiles}
                    convertedFiles={convertedFiles}
                    convertedSizes={convertedSizes}
                    conversionProgress={conversionProgress}
                    isConverting={isConverting}
                    onReset={handleReset}
                    targetFormat={selectedFormat}
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
                {t('convert.whyChoose')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: CheckCircle2,
                    title: t('convert.quality'),
                    description: t('convert.qualityDesc')
                  },
                  {
                    icon: CheckCircle2,
                    title: t('convert.allTypes'),
                    description: t('convert.allTypesDesc')
                  },
                  {
                    icon: CheckCircle2,
                    title: t('convert.batch'),
                    description: t('convert.batchDesc')
                  },
                  {
                    icon: CheckCircle2,
                    title: t('convert.noInstall'),
                    description: t('convert.noInstallDesc')
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

export default ConvertOnly;
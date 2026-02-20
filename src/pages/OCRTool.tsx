import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  FileText,
  Copy,
  Download,
  Loader2,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Languages
} from 'lucide-react';

// Popular languages for OCR
const LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'ita', name: 'Italian' },
  { code: 'por', name: 'Portuguese' },
  { code: 'rus', name: 'Russian' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'chi_tra', name: 'Chinese (Traditional)' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
  { code: 'ara', name: 'Arabic' },
  { code: 'hin', name: 'Hindi' },
  { code: 'ben', name: 'Bengali' },
  { code: 'tur', name: 'Turkish' },
  { code: 'pol', name: 'Polish' },
  { code: 'ukr', name: 'Ukrainian' },
  { code: 'vie', name: 'Vietnamese' },
  { code: 'tha', name: 'Thai' },
  { code: 'nld', name: 'Dutch' },
];

const OCRTool = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('eng');
  const [processingStage, setProcessingStage] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (JPG, PNG, WebP, etc.)',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 10MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
      setExtractedText('');
      setProgress(0);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast({
        title: 'Image loaded',
        description: 'Click "Extract Text" to start OCR',
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff']
    },
    multiple: false,
  });

  const preprocessImage = (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // Scale up small images for better recognition (min 1500px wide)
        const scale = Math.max(1, 1500 / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // Draw scaled image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Convert to grayscale and increase contrast
        for (let i = 0; i < data.length; i += 4) {
          // Grayscale using luminance formula
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

          // Increase contrast (1.5x)
          const contrast = 1.5;
          const adjusted = ((gray / 255 - 0.5) * contrast + 0.5) * 255;

          // Clamp and apply threshold for cleaner text
          const val = Math.max(0, Math.min(255, adjusted));

          // Adaptive binarization: if close to middle, push to black or white
          const final = val < 140 ? Math.max(0, val * 0.7) : Math.min(255, val * 1.2);

          data[i] = final;
          data[i + 1] = final;
          data[i + 2] = final;
        }

        ctx.putImageData(imageData, 0, 0);

        // Sharpen using convolution (unsharp mask approximation)
        const sharpCanvas = document.createElement('canvas');
        sharpCanvas.width = canvas.width;
        sharpCanvas.height = canvas.height;
        const sharpCtx = sharpCanvas.getContext('2d')!;

        // Apply slight blur then subtract for sharpening
        sharpCtx.filter = 'contrast(1.1) brightness(1.05)';
        sharpCtx.drawImage(canvas, 0, 0);

        resolve(sharpCanvas.toDataURL('image/png'));
      };
      img.src = imageUrl;
    });
  };

  const extractText = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessingStage('Preprocessing image...');

    try {
      // Preprocess image for better OCR accuracy
      const processedImage = await preprocessImage(previewUrl);
      setProgress(5);

      setProcessingStage('Initializing OCR engine...');
      const worker = await createWorker(selectedLanguage, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(30 + Math.round(m.progress * 70));
            setProcessingStage(`Recognizing text... ${Math.round(m.progress * 100)}%`);
          } else if (m.status === 'loading tesseract core') {
            setProcessingStage('Loading OCR engine...');
            setProgress(10);
          } else if (m.status === 'initializing tesseract') {
            setProcessingStage('Initializing...');
            setProgress(15);
          } else if (m.status === 'loading language traineddata') {
            setProcessingStage(`Loading ${LANGUAGES.find(l => l.code === selectedLanguage)?.name} language data...`);
            setProgress(20);
          }
        },
      });

      // Set optimal parameters for text recognition
      await worker.setParameters({
        tessedit_pageseg_mode: '3', // Fully automatic page segmentation
        preserve_interword_spaces: '1',
        tessedit_char_blacklist: '|~`',
      });

      setProcessingStage('Analyzing image...');
      const { data: { text, confidence } } = await worker.recognize(processedImage);

      await worker.terminate();

      // Post-process: clean up common OCR artifacts
      const cleanedText = text
        .replace(/\n{3,}/g, '\n\n') // collapse excessive newlines
        .replace(/[ \t]{2,}/g, ' ') // collapse excessive spaces
        .replace(/([a-z])\s*\n\s*([a-z])/g, '$1 $2') // rejoin broken words mid-sentence
        .trim();

      setExtractedText(cleanedText);
      setProgress(100);
      setProcessingStage('Complete!');

      toast({
        title: 'Text extracted successfully!',
        description: `Confidence: ${confidence.toFixed(1)}% | ${cleanedText.split(/\s+/).filter(w => w).length} words found`,
      });
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: 'Extraction failed',
        description: error instanceof Error ? error.message : 'An error occurred during OCR',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (!extractedText) return;

    navigator.clipboard.writeText(extractedText);
    toast({
      title: 'Copied to clipboard',
      description: 'Text has been copied to your clipboard',
    });
  };

  const downloadAsText = () => {
    if (!extractedText) return;

    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted-text-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded',
      description: 'Text file has been downloaded',
    });
  };

  const resetTool = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedText('');
    setProgress(0);
    setProcessingStage('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            OCR Tool - Extract Text from Images
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an image and extract all text from it instantly — works fully in your browser, nothing is uploaded to any server.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Upload & Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Upload Image
                </CardTitle>
                <CardDescription>
                  Upload an image containing text (JPG, PNG, WebP, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Language Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Language
                  </label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dropzone */}
                {!selectedFile ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                      isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-700 font-medium mb-2">
                      {isDragActive ? 'Drop image here' : 'Drag & drop an image here'}
                    </p>
                    <p className="text-sm text-gray-500">
                      or click to browse files
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Max file size: 10MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Image Preview */}
                    <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                      <img
                        src={previewUrl!}
                        alt="Preview"
                        className="w-full h-auto max-h-96 object-contain bg-gray-50"
                      />
                      <button
                        onClick={resetTool}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* File Info */}
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">File:</span> {selectedFile.name}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Size:</span>{' '}
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    {/* Extract Button */}
                    <Button
                      onClick={extractText}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5 mr-2" />
                          Extract Text
                        </>
                      )}
                    </Button>

                    {/* Progress */}
                    {isProcessing && (
                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-center text-gray-600">{processingStage}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Extracted Text */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Extracted Text
                </CardTitle>
                <CardDescription>
                  The text extracted from your image will appear here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {extractedText ? (
                  <>
                    <Tabs defaultValue="formatted" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="formatted">Formatted</TabsTrigger>
                        <TabsTrigger value="raw">Raw Text</TabsTrigger>
                      </TabsList>
                      <TabsContent value="formatted" className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto whitespace-pre-wrap font-mono text-sm">
                          {extractedText}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Words: {extractedText.split(/\s+/).filter(w => w).length}</p>
                          <p>Characters: {extractedText.length}</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="raw" className="space-y-4">
                        <textarea
                          value={extractedText}
                          onChange={(e) => setExtractedText(e.target.value)}
                          className="w-full min-h-[300px] max-h-[500px] p-4 border rounded-lg font-mono text-sm resize-none"
                          placeholder="Extracted text will appear here..."
                        />
                      </TabsContent>
                    </Tabs>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Text
                      </Button>
                      <Button
                        onClick={downloadAsText}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download TXT
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <FileText className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No text extracted yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Upload an image and click "Extract Text" to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Use Cases */}
        <Card className="mt-8 border-gray-200">
          <CardHeader>
            <CardTitle>Common Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">📚 Students & Researchers</h4>
                <p className="text-sm text-gray-600">
                  Extract text from book pages, lecture slides, and research papers
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">💼 Business Professionals</h4>
                <p className="text-sm text-gray-600">
                  Digitize receipts, business cards, and scanned documents
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">🌐 Translators</h4>
                <p className="text-sm text-gray-600">
                  Extract text from images for translation and localization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OCRTool;

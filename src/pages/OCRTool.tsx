import { useState, useCallback, useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { reportClientTool } from '@/utils/clientToolTracking';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Upload,
  FileText,
  Copy,
  Download,
  Loader2,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'https://service.slim-file.com/api';

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-gray-900 mt-3 mb-1 first:mt-0">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-base font-semibold text-gray-900 mt-3 mb-1 first:mt-0">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-gray-700 leading-relaxed my-2">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-gray-800">{children}</em>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-6 my-2 space-y-1 text-gray-700">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-6 my-2 space-y-1 text-gray-700">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-4 overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-gray-100 text-left">{children}</thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-4 py-2.5 font-semibold text-gray-900 border-b border-gray-200 whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-4 py-2 border-b border-gray-100 text-gray-700 align-top">{children}</td>
  ),
};

const OCRTool = () => {
  useSEO({
    title: 'OCR Tool — Extract Text, Tables & Formatting From Images & PDFs | SlimFile',
    description: 'Convert scanned images and PDFs to editable, formatted text with SlimFile\'s free OCR tool. Keeps headings, lists and tables. No signup required.',
  });
  const { toast } = useToast();

  useEffect(() => {
    reportClientTool('ocr', 'visit');
  }, []);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [resultMeta, setResultMeta] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isImage && !isPdf) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image (JPG, PNG, WebP, TIFF) or a PDF',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Max size is 25MB. Please compress your file at slim-file.com/compress, then re-upload it.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    setMarkdown('');
    setExtractedText('');
    setResultMeta('');

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    toast({
      title: 'File loaded',
      description: 'Click "Extract Text" to start OCR',
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'],
      'application/pdf': ['.pdf']
    },
    multiple: false,
  });

  const extractText = async () => {
    if (!selectedFile) return;

    reportClientTool('ocr', 'complete');

    setIsProcessing(true);
    setStatusMessage('Uploading to our OCR engine...');
    setMarkdown('');
    setExtractedText('');

    try {
      const form = new FormData();
      form.append('file', selectedFile);

      setStatusMessage('Extracting text, layout & tables...');
      const response = await fetch(`${API}/ocr`, { method: 'POST', body: form });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Text extraction failed');
      }

      const md = data.markdown || data.text || '';
      const text = data.text || md.replace(/\*\*/g, '').replace(/[|#>-]/g, '');

      setMarkdown(md);
      setExtractedText(text);
      setResultMeta(
        [
          (data.pages || 1) > 1 ? `${data.pages} pages` : '1 page',
          data.elapsedMs ? `done in ${(data.elapsedMs / 1000).toFixed(1)}s` : null,
        ]
          .filter(Boolean)
          .join(' · ')
      );
      setStatusMessage('Complete!');

      toast({
        title: 'Text extracted successfully!',
        description: `${text.split(/\s+/).filter(w => w).length} words found${data.pages > 1 ? ` across ${data.pages} pages` : ''}`,
      });
    } catch (error) {
      console.error('OCR Error:', error);
      setStatusMessage('');
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
    toast({ title: 'Copied to clipboard' });
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
    toast({ title: 'Downloaded', description: 'Text file has been downloaded' });
  };

  const resetTool = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setMarkdown('');
    setExtractedText('');
    setResultMeta('');
    setStatusMessage('');
  };

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            OCR Tool - Extract Text from Images & PDFs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powered by the PaddleOCR engine — recognizes text, keeps headings, lists and bold formatting,
            and reconstructs tables exactly as they appear.
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
                  Upload File
                </CardTitle>
                <CardDescription>
                  Upload an image or scanned PDF (JPG, PNG, WebP, TIFF, PDF)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-blue-700">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  Auto-detects 100+ languages · keeps tables & formatting
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
                      {isDragActive ? 'Drop file here' : 'Drag & drop an image or PDF here'}
                    </p>
                    <p className="text-sm text-gray-500">or click to browse files</p>
                    <p className="text-xs text-gray-400 mt-2">Max file size: 25MB — larger files? compress at slim-file.com/compress</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Preview */}
                    {previewUrl && (
                      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                        <img
                          src={previewUrl}
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
                    )}

                    {!previewUrl && !isProcessing && (
                      <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-8">
                        <FileText className="w-10 h-10 text-blue-400" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p>PDF selected — ready to extract</p>
                        </div>
                        <button
                          onClick={resetTool}
                          className="ml-auto p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

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

                    {/* Status */}
                    {isProcessing && (
                      <div className="space-y-2 flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 animate-pulse text-blue-500" />
                        <span>{statusMessage}</span>
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
                  {resultMeta
                    ? `Extracted · ${resultMeta}`
                    : 'The text with its layout and tables will appear here'}
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
                        <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto text-sm">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {markdown || extractedText}
                          </ReactMarkdown>
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
                      <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Text
                      </Button>
                      <Button onClick={downloadAsText} variant="outline" className="flex-1">
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
                      Upload an image or PDF and click "Extract Text" to get started
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
                  Digitize invoices, receipts, and financial tables with the structure intact
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">🌐 Translators</h4>
                <p className="text-sm text-gray-600">
                  Extract text from images and PDFs for translation and localization
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
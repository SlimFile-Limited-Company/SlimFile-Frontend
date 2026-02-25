import { useState, useRef } from 'react';
import SectionContainer from '../components/SectionContainer';
import Footer from '../components/Footer';
import { Header } from '../components/Header';

export default function MultipleCompression() {
  const [fileQueue, setFileQueue] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<{file: File, url: string, warning?: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // Constants
  const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  // Send file to backend for compression
  const compressFile = async (file: File): Promise<{ file: File | null; warning?: string }> => {
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
      let filename = `compressed_${file.name}`;
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

  // Batch compress function
  const compressFiles = async (files: File[]) => {
    const results: {file: File, url: string, warning?: string}[] = [];
    for (const file of files) {
      const { file: compressed, warning } = await compressFile(file);
      if (compressed) {
        results.push({ file: compressed, url: URL.createObjectURL(compressed), warning });
      } else {
        results.push({ file, url: URL.createObjectURL(file), warning });
      }
    }
    return results;
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFileQueue(Array.from(e.dataTransfer.files));
      setShowQueue(true);
    }
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDragLeave = (e: React.DragEvent) => e.preventDefault();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileQueue(Array.from(e.target.files));
      setShowQueue(true);
    }
  };

  const startProcessing = async () => {
    setIsProcessing(true);
    setShowProcessing(true);
    setShowQueue(false);
    setError('');
    try {
      const results = await compressFiles(fileQueue);
      setProcessedFiles(results);
      setShowResults(true);
    } catch (err) {
      setError('An error occurred during compression.');
    } finally {
      setIsProcessing(false);
      setShowProcessing(false);
    }
  };

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // NEW: Download all compressed files at once (multiple downloads)
  const handleDownloadAll = () => {
    processedFiles.forEach(item => {
      const a = document.createElement('a');
      a.href = item.url;
      a.download = item.file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <Header />
      <main>
        {/* Hero Section */}
        <SectionContainer className="pt-32 pb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Batch File Compression</h1>
          <p className="text-xl text-gray-600 mb-6">Compress multiple files at once with our powerful batch tool</p>
          <button className="px-8 py-3 bg-accent text-white rounded-full text-lg font-semibold shadow-lg hover:bg-red-600 transition-all duration-300 hover:scale-105" onClick={() => uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}>
            Select Files
          </button>
        </SectionContainer>

        {/* Upload Section */}
        <SectionContainer className="py-16 flex flex-col items-center" ref={uploadSectionRef}>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 w-full max-w-xl flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-2 text-gray-900">Upload Multiple Files</h3>
            <p className="text-gray-600 mb-4">Drag & drop files or <span className="text-accent underline cursor-pointer" onClick={() => fileInputRef.current?.click()}>browse</span>. Supports JPEG, PNG, WebP, PDF up to 1GB each.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              multiple
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            <div
              ref={dropZoneRef}
              className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-accent rounded-2xl bg-gray-50 cursor-pointer transition hover:bg-gray-100 mb-4"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl text-accent"><i className="fas fa-cloud-upload-alt"></i></span>
                <span className="font-medium text-gray-700">Drop your files here or click to select</span>
              </div>
            </div>
            {showQueue && fileQueue.length > 0 && (
              <div className="w-full mt-4">
                <div className="mb-2 text-gray-700 font-semibold">Files to compress:</div>
                <ul className="mb-4">
                  {fileQueue.map((file, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">{file.name}</li>
                  ))}
                </ul>
                <button className="px-6 py-2 bg-accent text-white rounded-full font-semibold shadow hover:bg-red-600 transition-all duration-300 hover:scale-105" onClick={startProcessing} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Start Compression'}
                </button>
              </div>
            )}
            {showProcessing && (
              <div className="text-accent font-semibold mt-4">Processing files...</div>
            )}
            {showResults && processedFiles.length > 0 && (
              <div className="w-full mt-4">
                <div className="mb-2 text-gray-700 font-semibold">Compressed files:</div>
                <ul className="mb-4">
                  {processedFiles.map((item, idx) => (
                    <li key={idx} className="text-gray-600 text-sm flex items-center justify-between">
                      <span>{item.file.name}</span>
                      {item.warning && <span className="text-yellow-500 ml-2">{item.warning}</span>}
                      <button className="ml-4 px-3 py-1 bg-primary text-white rounded hover:bg-primary/90" onClick={() => handleDownload(item.url, item.file.name)}>
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
                {/* Download All Button */}
                <button
                  className="mb-4 px-6 py-2 bg-red-600 text-white rounded-full font-semibold shadow hover:bg-red-700 transition-all duration-300 hover:scale-105"
                  onClick={handleDownloadAll}
                >
                  Download All
                </button>
                <button className="px-6 py-2 bg-accent text-white rounded-full font-semibold shadow hover:bg-red-600 transition-all duration-300 hover:scale-105" onClick={() => { setShowResults(false); setFileQueue([]); setProcessedFiles([]); setShowQueue(false); }}>
                  Compress More Files
                </button>
              </div>
            )}
            {error && <div className="text-red-500 mt-4">{error}</div>}
          </div>
        </SectionContainer>

        {/* Features Section */}
        <SectionContainer className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Batch Compression Features</h2>
            <p className="text-lg text-gray-600">Powerful tools for processing multiple files efficiently</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 flex flex-col items-center text-center">
              <div className="mb-4 text-accent text-4xl"><i className="fas fa-layer-group"></i></div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Multiple Formats</h3>
              <p className="text-gray-600">Support for JPEG, PNG, WebP images and PDF documents in a single batch.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 flex flex-col items-center text-center">
              <div className="mb-4 text-accent text-4xl"><i className="fas fa-tachometer-alt"></i></div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Fast Processing</h3>
              <p className="text-gray-600">Optimized algorithms process multiple files quickly with progress tracking.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 flex flex-col items-center text-center">
              <div className="mb-4 text-accent text-4xl"><i className="fas fa-download"></i></div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Bulk Download</h3>
              <p className="text-gray-600">Download all compressed files at once or individually as needed.</p>
            </div>
          </div>
        </SectionContainer>
      </main>
      <Footer />
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { Upload, X, Folder, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface FolderUploadProps {
  onFilesSelect: (files: File[]) => void;
  isProcessing: boolean;
}

export const FolderUpload: React.FC<FolderUploadProps> = ({ onFilesSelect, isProcessing }) => {
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.pptx', '.docx', '.xlsx'];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSize = (files: File[]): number => {
    return files.reduce((sum, file) => sum + file.size, 0);
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    }
    return <FileText className="w-4 h-4 text-red-500" />;
  };

  const isSupportedFile = (filename: string): boolean => {
    const ext = '.' + filename.toLowerCase().split('.').pop();
    return SUPPORTED_EXTENSIONS.includes(ext);
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const files = Array.from(fileList);

    // Filter out unsupported files and hidden files
    const validFiles = files.filter(file => {
      const filename = file.name;
      // Skip hidden files and system files
      if (filename.startsWith('.') || filename.startsWith('__')) {
        return false;
      }
      return true; // Accept all files, unsupported ones will be passed through
    });

    if (validFiles.length === 0) {
      setError('No valid files found in the selected folder.');
      setSelectedFiles([]);
      return;
    }

    // Count supported vs unsupported
    const supportedCount = validFiles.filter(f => isSupportedFile(f.name)).length;
    const unsupportedCount = validFiles.length - supportedCount;

    if (unsupportedCount > 0) {
      setError(`${supportedCount} files will be compressed, ${unsupportedCount} unsupported files will be included as-is.`);
    } else {
      setError('');
    }

    setSelectedFiles(validFiles);
  };

  const handleFolderSelect = () => {
    folderInputRef.current?.click();
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const items = e.dataTransfer.items;
    const files: File[] = [];

    // Process dropped items
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }
    } else if (e.dataTransfer.files) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        files.push(e.dataTransfer.files[i]);
      }
    }

    if (files.length > 0) {
      const dataTransfer = new DataTransfer();
      files.forEach(f => dataTransfer.items.add(f));
      processFiles(dataTransfer.files);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFilesSelect(selectedFiles);
    }
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setError('');
    if (folderInputRef.current) folderInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const supportedFilesCount = selectedFiles.filter(f => isSupportedFile(f.name)).length;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 p-8"
        style={{ backdropFilter: 'blur(15px)' }}
      >
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Upload a folder or multiple files to compress. Supports: PDF, DOCX, PPTX, XLSX, JPG, PNG, WEBP
          </p>
        </div>

        {selectedFiles.length === 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-red-400 bg-red-50/50 scale-105 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                  : 'border-gray-300 hover:border-red-300 hover:bg-red-50/30'
              } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-6">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Folder className="w-10 h-10 text-white" />
                </motion.div>

                <div>
                  <p className="text-xl font-semibold text-gray-900 mb-2">
                    Drop your folder or files here
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Or use the buttons below to select
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleFolderSelect}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3"
                  >
                    <Folder className="w-5 h-5 mr-2" />
                    Select Folder
                  </Button>
                  <Button
                    onClick={handleFileSelect}
                    disabled={isProcessing}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 px-6 py-3"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Select Files
                  </Button>
                </div>
              </div>

              {/* Hidden inputs */}
              <input
                ref={folderInputRef}
                type="file"
                className="hidden"
                onChange={handleFolderChange}
                disabled={isProcessing}
                // @ts-ignore - webkitdirectory is not in types but works in browsers
                webkitdirectory=""
                directory=""
                multiple
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isProcessing}
                multiple
              />
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-4"
          >
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Folder className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedFiles.length} files selected
                    </p>
                    <p className="text-sm text-gray-600">
                      Total size: {formatFileSize(getTotalSize(selectedFiles))}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFiles}
                  disabled={isProcessing}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {supportedFilesCount} compressible
                </span>
                {selectedFiles.length - supportedFilesCount > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    {selectedFiles.length - supportedFilesCount} pass-through
                  </span>
                )}
              </div>
            </div>

            {/* File List */}
            <div className="max-h-64 overflow-y-auto bg-white/30 rounded-xl p-3 border border-gray-200">
              <div className="space-y-2">
                {selectedFiles.slice(0, 50).map((file, idx) => (
                  <div
                    key={file.name + idx}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      isSupportedFile(file.name) ? 'bg-white/50' : 'bg-yellow-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {getFileIcon(file.name)}
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                ))}
                {selectedFiles.length > 50 && (
                  <p className="text-center text-sm text-gray-500 py-2">
                    ... and {selectedFiles.length - 50} more files
                  </p>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={isProcessing || selectedFiles.length === 0}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-4 text-lg font-semibold"
            >
              {isProcessing ? (
                <>
                  <motion.div
                    className="h-5 w-5 border-2 border-white border-r-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Compressing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Compress {selectedFiles.length} Files
                </>
              )}
            </Button>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-4 p-4 rounded-xl ${
              error.includes('will be compressed')
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className={`text-sm ${
              error.includes('will be compressed') ? 'text-yellow-700' : 'text-red-600'
            }`}>
              {error}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

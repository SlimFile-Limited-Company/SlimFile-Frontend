import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const ACCEPTED_TYPES = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg,.jpeg',
    'image/png': '.png',
    'image/webp': '.webp',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-excel': '.xls'
  };

  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    let errorMsg = '';

    if (files.length > 10) {
      errorMsg = t('fileUpload.errorMaxFiles');
    } else {
      for (const file of files) {
        if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
          errorMsg = t('fileUpload.errorInvalidType');
          break;
        }

        // Warn for old formats
        if (file.type === 'application/vnd.ms-powerpoint') {
          errorMsg = t('fileUpload.errorOldPpt');
          break;
        }

        if (file.type === 'application/msword') {
          errorMsg = t('fileUpload.errorOldDoc');
          break;
        }

        if (file.type === 'application/vnd.ms-excel') {
          errorMsg = t('fileUpload.errorOldXls');
          break;
        }

        if (file.size > MAX_FILE_SIZE) {
          errorMsg = t('fileUpload.errorFileSize');
          break;
        }

        validFiles.push(file);
      }
    }

    setError(errorMsg);
    return errorMsg ? [] : validFiles;
  };

  const handleFilesChange = (files: FileList | null) => {
    if (!files) return;
    const fileArr = Array.from(files);
    const validFiles = validateFiles(fileArr);
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      onFileSelect(validFiles);
    } else {
      setSelectedFiles([]);
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesChange(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesChange(e.target.files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-primary" />;
    }
    return <FileText className="w-8 h-8 text-primary" />;
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 p-8"
        style={{ backdropFilter: 'blur(15px)' }}
      >
        <div className="text-center mb-6">
          <p className="text-gray-600">
            {t('fileUpload.supportText')}
          </p>
        </div>

        {!selectedFiles.length ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-red-400 bg-red-50/50 scale-105 shadow-[0_0_30px_rgba(239,68,68,0.3)] border-white/60 backdrop-blur-2xl'
                : 'border-white/40 hover:border-red-300 hover:bg-red-50/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] backdrop-blur-2xl'
            } ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            style={{ backdropFilter: dragActive ? 'blur(12px)' : 'blur(10px)' }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                className="w-16 h-16 bg-red-50/70 backdrop-blur-lg rounded-2xl flex items-center justify-center border-2 border-white/50 shadow-xl"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                style={{ backdropFilter: 'blur(8px)' }}
              >
                <Upload className="w-8 h-8 text-red-600" />
              </motion.div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {t('fileUpload.dropFiles')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('fileUpload.dragDropText')}
                </p>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={Object.values(ACCEPTED_TYPES).join(',')}
              onChange={handleInputChange}
              disabled={isProcessing}
              multiple
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6 border-2 border-white/40 shadow-2xl"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-3 w-full">
                {selectedFiles.map((file, idx) => (
                  <motion.div
                    key={file.name + idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="flex items-center space-x-4 bg-white/30 backdrop-blur-lg rounded-xl p-3 border border-white/30 shadow-lg"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-semibold text-gray-900 truncate max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFiles}
                disabled={isProcessing}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 ml-4"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-red-50/50 backdrop-blur-lg border-2 border-red-200/50 rounded-xl shadow-lg"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
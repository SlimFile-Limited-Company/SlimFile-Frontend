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

  const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

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
        className="p-1 sm:p-2"
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
            className={`relative border-2 border-dashed rounded-[22px] p-10 sm:p-14 text-center transition-colors duration-200 ${
              dragActive
                ? 'border-red-500 bg-red-50'
                : 'border-[#d2d2d7] bg-white hover:border-red-400'
            } ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="w-8 h-8 text-red-600" />
              </motion.div>
              <div>
                <p className="text-[19px] font-semibold tracking-tight text-[#1d1d1f] mb-1.5">
                  {t('fileUpload.dropFiles')}
                </p>
                <p className="text-sm text-[#6e6e73]">
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
            className="bg-white rounded-[22px] p-4 sm:p-6"
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
                    className="flex items-center space-x-4 bg-[#f5f5f7] rounded-2xl p-3"
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
            className="mt-4 p-4 bg-red-50 rounded-2xl"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
import { useState, useRef } from 'react';
import { Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Supported file formats (matching backend)
const SUPPORTED_FORMATS = {
  image: ['jpg', 'jpeg', 'png', 'webp'],
  document: ['pdf', 'pptx', 'docx', 'xlsx']
};

const ALL_FORMATS = [
  ...SUPPORTED_FORMATS.image,
  ...SUPPORTED_FORMATS.document
];

const ACCEPT_STRING = ALL_FORMATS.map(ext => `.${ext}`).join(',');

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 10;

interface FileUploadInputProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  onClearFiles: () => void;
  disabled?: boolean;
}

function getFileType(filename: string): 'image' | 'document' {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (SUPPORTED_FORMATS.image.includes(ext)) return 'image';
  return 'document';
}

function getFileIcon(type: 'image' | 'document') {
  switch (type) {
    case 'image': return ImageIcon;
    default: return FileText;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadInput({
  onFilesSelected,
  selectedFiles,
  onRemoveFile,
  onClearFiles,
  disabled = false
}: FileUploadInputProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError(null);

    // Validate file count
    if (selectedFiles.length + files.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    // Validate files
    const validFiles: File[] = [];
    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';

      if (!ALL_FORMATS.includes(ext)) {
        setError(`Unsupported format: .${ext}. Supported: ${ALL_FORMATS.join(', ')}`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" exceeds 50MB limit`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected([...selectedFiles, ...validFiles]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPT_STRING}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-white/40 hover:text-white/70 hover:bg-white/10 rounded-full flex-shrink-0"
        onClick={handleButtonClick}
        disabled={disabled || selectedFiles.length >= MAX_FILES}
        title="Attach files"
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {/* Selected files preview */}
      {selectedFiles.length > 0 && (
        <div
          className="absolute bottom-full mb-2 left-0 right-0 min-w-[250px] max-w-[350px] rounded-xl shadow-2xl p-2"
          style={{ background: '#17212b', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-medium text-white/60">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
            </span>
            <button
              className="text-xs text-red-400 hover:text-red-300 px-2 py-0.5 rounded-lg hover:bg-white/10 transition-colors"
              onClick={onClearFiles}
            >
              Clear all
            </button>
          </div>

          <div className="space-y-1 max-h-[150px] overflow-y-auto">
            {selectedFiles.map((file, index) => {
              const type = getFileType(file.name);
              const Icon = getFileIcon(type);

              return (
                <div
                  key={index}
                  className="flex items-center gap-2 p-1.5 rounded-lg group"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <Icon className="h-4 w-4 text-white/40 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white/80 truncate">
                      {file.name}
                    </div>
                    <div className="text-[10px] text-white/35">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-red-400 hover:bg-white/10"
                    onClick={() => onRemoveFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-2 text-xs text-red-400 px-1">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

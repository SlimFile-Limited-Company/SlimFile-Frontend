import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Upload, Trash2, Download, Loader2, HardDrive,
  FileText, Image as ImageIcon, File, CloudUpload,
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
const FREE_LIMIT = 500 * 1024 * 1024; // 500 MB

interface DriveFile {
  _id: string;
  filename: string;
  url: string;
  mimeType: string;
  fileType: 'image' | 'document';
  originalSize: number;
  compressedSize: number;
  createdAt: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(file: DriveFile) {
  if (file.fileType === 'image') return <ImageIcon className="w-6 h-6 text-blue-500" />;
  const ext = file.filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <FileText className="w-6 h-6 text-red-500" />;
  if (ext === 'docx') return <FileText className="w-6 h-6 text-blue-600" />;
  if (ext === 'xlsx') return <FileText className="w-6 h-6 text-green-600" />;
  if (ext === 'pptx') return <FileText className="w-6 h-6 text-orange-500" />;
  return <File className="w-6 h-6 text-gray-500" />;
}

function getExtBadgeColor(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'bg-red-100 text-red-700';
  if (ext === 'docx') return 'bg-blue-100 text-blue-700';
  if (ext === 'xlsx') return 'bg-green-100 text-green-700';
  if (ext === 'pptx') return 'bg-orange-100 text-orange-700';
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'bg-purple-100 text-purple-700';
  return 'bg-gray-100 text-gray-700';
}

async function downloadWithFilename(url: string, filename: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

const SlimFileDrive = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const token = localStorage.getItem('jwt');

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API}/drive`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFiles(data.files || []);
      setStorageUsed(data.storageUsed || 0);
    } catch {
      toast({ title: 'Error', description: 'Failed to load your files.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, []);

  const onDrop = useCallback(async (accepted: File[]) => {
    if (!accepted.length) return;
    setUploading(true);

    for (let i = 0; i < accepted.length; i++) {
      const file = accepted[i];
      setUploadProgress(`Uploading ${file.name} (${i + 1}/${accepted.length})…`);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API}/drive/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        toast({
          title: 'Uploaded & compressed!',
          description: `${file.name} saved (${formatBytes(data.file.compressedSize)})`,
        });
      } catch (err: any) {
        toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
      }
    }

    setUploading(false);
    setUploadProgress('');
    fetchFiles();
  }, [token]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    },
    multiple: true,
    disabled: uploading,
  });

  const handleDownload = async (file: DriveFile) => {
    setDownloading(file._id);
    try {
      const res = await fetch(`${API}/drive/${file._id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Download failed');
      await downloadWithFilename(data.url, file.filename);
    } catch (err: any) {
      toast({ title: 'Download failed', description: err.message, variant: 'destructive' });
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (file: DriveFile) => {
    if (!confirm(`Delete "${file.filename}"?`)) return;
    setDeleting(file._id);
    try {
      const res = await fetch(`${API}/drive/${file._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setFiles(f => f.filter(x => x._id !== file._id));
      setStorageUsed(u => u - file.compressedSize);
      toast({ title: 'Deleted', description: `${file.filename} removed.` });
    } catch {
      toast({ title: 'Error', description: 'Could not delete file.', variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  const usedPct = Math.min(100, (storageUsed / FREE_LIMIT) * 100);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-200">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SlimFile Drive</h1>
              <p className="text-sm text-gray-500">Your files, stored slim.</p>
            </div>
          </div>
        </div>

        {/* Storage bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Storage used</span>
            <span className="text-sm text-gray-500">
              {formatBytes(storageUsed)} / {formatBytes(FREE_LIMIT)}
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${usedPct > 85 ? 'bg-red-500' : 'bg-red-500'}`}
              style={{ width: `${usedPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {formatBytes(FREE_LIMIT - storageUsed)} remaining on free plan
          </p>
        </div>

        {/* Upload zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 mb-6 ${
            isDragActive
              ? 'border-red-500 bg-red-50'
              : uploading
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-70'
              : 'border-gray-300 hover:border-red-400 hover:bg-red-50/30'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                <p className="text-sm font-medium text-gray-700">{uploadProgress}</p>
                <p className="text-xs text-gray-400">Compressing & uploading…</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                  <CloudUpload className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-800">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files'}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">or click to browse</p>
                </div>
                <p className="text-xs text-gray-400">
                  PDF, DOCX, XLSX, PPTX, JPG, PNG, WebP · Max 50 MB per file
                </p>
                <p className="text-xs font-medium text-red-500">
                  Files are automatically compressed before storing
                </p>
              </>
            )}
          </div>
        </div>

        {/* File grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <HardDrive className="w-14 h-14 mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No files yet</p>
            <p className="text-sm text-gray-400 mt-1">Upload your first file above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map(file => {
              const savedPct = file.originalSize > 0
                ? Math.round(((file.originalSize - file.compressedSize) / file.originalSize) * 100)
                : 0;
              const ext = file.filename.split('.').pop()?.toUpperCase() || '';

              return (
                <div
                  key={file._id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
                >
                  {/* Preview or icon */}
                  <div className="w-full h-32 rounded-xl bg-gray-50 flex items-center justify-center mb-3 overflow-hidden">
                    {file.fileType === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.filename}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        {getFileIcon(file)}
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${getExtBadgeColor(file.filename)}`}>
                          {ext}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <p className="text-sm font-semibold text-gray-800 truncate mb-1" title={file.filename}>
                    {file.filename}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">{formatBytes(file.compressedSize)}</span>
                    {savedPct > 0 && (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {savedPct}% saved
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs border-gray-200 hover:bg-gray-50"
                      onClick={() => handleDownload(file)}
                      disabled={downloading === file._id}
                    >
                      {downloading === file._id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <><Download className="w-3.5 h-3.5 mr-1" />Download</>}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      onClick={() => handleDelete(file)}
                      disabled={deleting === file._id}
                    >
                      {deleting === file._id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlimFileDrive;

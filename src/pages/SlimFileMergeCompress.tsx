import { useState, useCallback } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Loader2, Trash2, GripVertical, FilePlus2,
  FileText, Download, ShieldCheck, MergeIcon, Sparkles,
} from 'lucide-react';
import { ReviewPrompt } from '@/components/ReviewPrompt';

const API = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface PdfFile {
  id: string;
  file: File;
  name: string;
}

async function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const MAX_FILES = 20;

const SlimFileMergeCompress = () => {
  useSEO({
    title: 'Merge & Compress PDFs — Combine PDFs and Shrink File Size',
    description: 'Combine multiple PDFs into one and compress it in a single step. One output file, smaller than the originals combined. Fast, free and secure.',
  });

  const { toast } = useToast();
  const [files, setFiles]       = useState<PdfFile[]>([]);
  const [working, setWorking]   = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    setFiles(prev => {
      const room = MAX_FILES - prev.length;
      if (room <= 0) {
        toast({
          title: 'Limit reached',
          description: `You can merge up to ${MAX_FILES} PDFs at once.`,
          variant: 'destructive',
        });
        return prev;
      }
      if (accepted.length > room) {
        toast({
          title: 'Some files were skipped',
          description: `Only the first ${room} file(s) were added — ${MAX_FILES} is the maximum.`,
          variant: 'destructive',
        });
      }
      const newFiles = accepted.slice(0, room).map(f => ({ id: crypto.randomUUID(), file: f, name: f.name }));
      return [...prev, ...newFiles];
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: true,
  });

  const removeFile = (id: string) => setFiles(f => f.filter(x => x.id !== id));

  const moveFile = (fromId: string, toId: string) => {
    setFiles(prev => {
      const arr = [...prev];
      const fi  = arr.findIndex(x => x.id === fromId);
      const ti  = arr.findIndex(x => x.id === toId);
      if (fi < 0 || ti < 0) return prev;
      const [item] = arr.splice(fi, 1);
      arr.splice(ti, 0, item);
      return arr;
    });
  };

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

  const handleMergeCompress = async () => {
    if (files.length < 2) {
      toast({ title: 'Add at least 2 PDFs', description: 'You need at least 2 files to merge.', variant: 'destructive' });
      return;
    }
    setWorking(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f.file));
      const res = await fetch(`${API}/compress/merge-compress`, { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Merge and compress failed');
      }
      const blob = await res.blob();
      await downloadBlob(blob, 'compressed_merged.pdf');
      const savedKb = Math.max(0, Math.round((totalSize - blob.size) / 1024));
      toast({
        title: 'Merged & compressed!',
        description: `${files.length} PDFs combined into one file${savedKb > 0 ? `, saving about ${savedKb} KB.` : '.'}`,
      });
      setFiles([]);
      setTimeout(() => setShowReviewPrompt(true), 1500);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-orange-100">
            <MergeIcon className="w-3 h-3" />
            SlimFile Forge
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Merge &amp; Compress PDFs
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
            Combine multiple PDFs into a single document and compress it in one step.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { icon: <FilePlus2  className="w-3.5 h-3.5 text-orange-500" />, label: `Merge up to ${MAX_FILES} PDFs` },
            { icon: <Sparkles   className="w-3.5 h-3.5 text-orange-500" />, label: 'Compressed after merging' },
            { icon: <Download   className="w-3.5 h-3.5 text-orange-500" />, label: 'One file out' },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
              {icon}
              {label}
            </span>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-7 shadow-sm">
          <div className="space-y-5">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <FilePlus2 className="w-6 h-6 text-gray-400" />
              </div>
              <p className="font-semibold text-gray-700 text-sm">
                {isDragActive ? 'Drop PDFs here' : 'Drop PDF files here or click to browse'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Add {MAX_FILES} files or fewer · PDF only · Max 1 GB each
              </p>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {files.length} file{files.length > 1 ? 's' : ''} — drag rows to reorder
                  </p>
                  <p className="text-xs font-semibold text-gray-400">
                    {(totalSize / 1024 / 1024).toFixed(2)} MB total
                  </p>
                </div>
                {files.map((f, idx) => (
                  <div
                    key={f.id}
                    draggable
                    onDragStart={e => e.dataTransfer.setData('text/plain', f.id)}
                    onDragOver={e => { e.preventDefault(); setDragOver(f.id); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={e => {
                      e.preventDefault();
                      moveFile(e.dataTransfer.getData('text/plain'), f.id);
                      setDragOver(null);
                    }}
                    className={`flex items-center gap-3 p-3 bg-white border rounded-xl transition-all cursor-grab active:cursor-grabbing ${
                      dragOver === f.id ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                      <p className="text-xs text-gray-400">{(f.file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <span className="text-xs text-gray-300 font-mono w-5 text-center shrink-0">{idx + 1}</span>
                    <button onClick={() => removeFile(f.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleMergeCompress}
              disabled={working || files.length < 2}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 text-sm font-semibold shadow-sm"
            >
              {working
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Merging &amp; compressing…</>
                : <><Download className="w-4 h-4 mr-2" />Merge &amp; Compress</>}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Files are processed securely and never stored on our servers</span>
        </div>
      </div>

      {/* Review Prompt */}
      <ReviewPrompt
        isOpen={showReviewPrompt}
        onClose={() => setShowReviewPrompt(false)}
        operationType="forge-merge"
      />
    </div>
  );
};

export default SlimFileMergeCompress;

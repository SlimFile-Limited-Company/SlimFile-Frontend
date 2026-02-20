import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2, Upload, Download, Trash2, GripVertical,
  FilePlus2, Scissors, FileText, MergeIcon,
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface PdfFile {
  id: string;
  file: File;
  name: string;
}

async function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Merge Tab ──────────────────────────────────────────────────────────────
function MergeTab() {
  const { toast } = useToast();
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles = accepted.map(f => ({ id: crypto.randomUUID(), file: f, name: f.name }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  });

  const removeFile = (id: string) => setFiles(f => f.filter(x => x.id !== id));

  const moveFile = (fromId: string, toId: string) => {
    setFiles(prev => {
      const arr = [...prev];
      const fi = arr.findIndex(x => x.id === fromId);
      const ti = arr.findIndex(x => x.id === toId);
      if (fi < 0 || ti < 0) return prev;
      const [item] = arr.splice(fi, 1);
      arr.splice(ti, 0, item);
      return arr;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({ title: 'Add at least 2 PDFs', description: 'You need at least 2 files to merge.', variant: 'destructive' });
      return;
    }
    setMerging(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f.file));
      const res = await fetch(`${API}/forge/merge`, { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Merge failed');
      }
      const blob = await res.blob();
      await downloadBlob(blob, 'merged.pdf');
      toast({ title: 'Merged!', description: `${files.length} PDFs combined into one.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50/30'
        }`}
      >
        <input {...getInputProps()} />
        <FilePlus2 className="w-10 h-10 mx-auto text-gray-400 mb-3" />
        <p className="font-semibold text-gray-700">{isDragActive ? 'Drop PDFs here' : 'Add PDF files'}</p>
        <p className="text-sm text-gray-500 mt-1">Drag & drop or click to browse · Max 50 MB each</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {files.length} file{files.length > 1 ? 's' : ''} — drag to reorder
          </p>
          {files.map((f, idx) => (
            <div
              key={f.id}
              draggable
              onDragStart={e => e.dataTransfer.setData('text/plain', f.id)}
              onDragOver={e => { e.preventDefault(); setDragOver(f.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => {
                e.preventDefault();
                const fromId = e.dataTransfer.getData('text/plain');
                moveFile(fromId, f.id);
                setDragOver(null);
              }}
              className={`flex items-center gap-3 p-3 bg-white border rounded-xl transition-all cursor-grab active:cursor-grabbing ${
                dragOver === f.id ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <GripVertical className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{(f.file.size / 1024).toFixed(0)} KB</p>
              </div>
              <span className="text-xs text-gray-400 font-mono w-5 text-center">{idx + 1}</span>
              <button onClick={() => removeFile(f.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={handleMerge}
        disabled={merging || files.length < 2}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 shadow-md shadow-red-100"
      >
        {merging
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Merging…</>
          : <><Download className="w-4 h-4 mr-2" />Merge & Download</>}
      </Button>
    </div>
  );
}

// ── Split Tab ──────────────────────────────────────────────────────────────
function SplitTab() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState('');
  const [splitting, setSplitting] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleSplit = async () => {
    if (!file) {
      toast({ title: 'No file', description: 'Please upload a PDF first.', variant: 'destructive' });
      return;
    }
    setSplitting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (ranges.trim()) formData.append('ranges', ranges.trim());
      const res = await fetch(`${API}/forge/split`, { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Split failed');
      }
      const blob = await res.blob();
      await downloadBlob(blob, 'split.zip');
      toast({ title: 'Split!', description: 'Your PDF pages are ready in a zip file.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSplitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50/30'
          }`}
        >
          <input {...getInputProps()} />
          <Scissors className="w-10 h-10 mx-auto text-gray-400 mb-3" />
          <p className="font-semibold text-gray-700">{isDragActive ? 'Drop PDF here' : 'Upload a PDF to split'}</p>
          <p className="text-sm text-gray-500 mt-1">Max 50 MB</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          Page ranges <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <Input
          placeholder='e.g. 1-3, 5, 7-9  —  leave empty to split every page'
          value={ranges}
          onChange={e => setRanges(e.target.value)}
          className="border-gray-200 focus:border-red-400 focus:ring-red-400/20"
        />
        <p className="text-xs text-gray-400">
          Separate groups with commas. Each group becomes its own PDF inside a zip file.
        </p>
      </div>

      <Button
        onClick={handleSplit}
        disabled={splitting || !file}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 shadow-md shadow-red-100"
      >
        {splitting
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Splitting…</>
          : <><Download className="w-4 h-4 mr-2" />Split & Download ZIP</>}
      </Button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
const SlimFileForge = () => {
  const [tab, setTab] = useState<'merge' | 'split'>('merge');

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200">
            <MergeIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SlimFile Forge</h1>
          <p className="text-gray-500 mt-1">Merge multiple PDFs into one, or split a PDF into pages.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-6 shadow-sm">
          <button
            onClick={() => setTab('merge')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === 'merge'
                ? 'bg-red-600 text-white shadow-md shadow-red-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Merge PDFs
          </button>
          <button
            onClick={() => setTab('split')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === 'split'
                ? 'bg-red-600 text-white shadow-md shadow-red-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Scissors className="w-4 h-4" />
            Split PDF
          </button>
        </div>

        {/* Content card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {tab === 'merge' ? <MergeTab /> : <SplitTab />}
        </div>

        {/* Info */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Files are processed securely on our server and never stored.
        </p>
      </div>
    </div>
  );
};

export default SlimFileForge;

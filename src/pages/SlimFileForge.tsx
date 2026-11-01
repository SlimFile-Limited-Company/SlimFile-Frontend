import { useState, useCallback } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2, Trash2, GripVertical, FilePlus2,
  Scissors, FileText, Download, ShieldCheck, MergeIcon,
} from 'lucide-react';
import { ReviewButton } from '@/components/ReviewButton';
import { trackCampusFile } from '@/lib/campus';

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

// ── Merge Tab ──────────────────────────────────────────────────────────────
function MergeTab({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const [files, setFiles]       = useState<PdfFile[]>([]);
  const [merging, setMerging]   = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles = accepted.map(f => ({ id: crypto.randomUUID(), file: f, name: f.name }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

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
      trackCampusFile();
      await downloadBlob(blob, 'merged.pdf');
      toast({ title: 'Merged!', description: `${files.length} PDFs combined into one file.` });
      setFiles([]);
      onSuccess?.();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="space-y-5">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-[22px] p-10 bg-white/70 text-center cursor-pointer transition-all ${
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
        <p className="text-xs text-gray-400 mt-1">Add multiple files · Max 50 MB each</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {files.length} file{files.length > 1 ? 's' : ''} — drag rows to reorder
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
        onClick={handleMerge}
        disabled={merging || files.length < 2}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full h-12 text-[15px] font-medium"
      >
        {merging
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Merging PDFs…</>
          : <><Download className="w-4 h-4 mr-2" />Merge & Download</>}
      </Button>
    </div>
  );
}

// ── Split Tab ──────────────────────────────────────────────────────────────
function SplitTab({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const [file, setFile]         = useState<File | null>(null);
  const [ranges, setRanges]     = useState('');
  const [splitting, setSplitting] = useState(false);

  const onDrop = useCallback((accepted: File[]) => { if (accepted[0]) setFile(accepted[0]); }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false,
  });

  const handleSplit = async () => {
    if (!file) {
      toast({ title: 'No file', description: 'Upload a PDF first.', variant: 'destructive' });
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
      trackCampusFile();
      // A single piece comes back as the PDF itself; two or more as a zip.
      const isZip = blob.type.includes('zip');
      await downloadBlob(blob, isZip ? 'split_pages.zip' : 'split_pages.pdf');
      toast({
        title: 'Split complete!',
        description: isZip ? 'Your PDF pages are ready — check the downloaded ZIP.' : 'Your PDF is ready.',
      });
      setFile(null); setRanges('');
      onSuccess?.();
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
          className={`border-2 border-dashed rounded-[22px] p-10 bg-white/70 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Scissors className="w-6 h-6 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-700 text-sm">
            {isDragActive ? 'Drop PDF here' : 'Drop a PDF here or click to browse'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Max 50 MB</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
            <FileText className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB · PDF</p>
          </div>
          <button onClick={() => setFile(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Page ranges <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <Input
          placeholder="e.g. 1-3, 5, 7-9  —  leave blank to split every page separately"
          value={ranges}
          onChange={e => setRanges(e.target.value)}
          className="h-11 border-gray-200 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl"
        />
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">How it works:</span> Use commas to separate groups.
            Each group becomes its own PDF. Several groups come as a ZIP file.{' '}
            <span className="text-gray-400">Example: "1-3, 5, 7-9" → three PDFs (pages 1–3, page 5, pages 7–9).</span>
          </p>
        </div>
      </div>

      <Button
        onClick={handleSplit}
        disabled={splitting || !file}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full h-12 text-[15px] font-medium"
      >
        {splitting
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Splitting PDF…</>
          : <><Download className="w-4 h-4 mr-2" />Split & Download</>}
      </Button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
const SlimFileForge = () => {
  useSEO({
    title: 'SlimFile Forge — Merge & Split PDF Files Online',
    description: 'Merge multiple PDFs into one or split a PDF into separate pages. Free, fast, and secure — no uploads to third-party servers.',
  });
  const [tab, setTab] = useState<'merge' | 'split'>('merge');
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [promptTool, setPromptTool] = useState<'forge-merge' | 'forge-split'>('forge-merge');

  return (
    <div className="min-h-screen bg-white pt-28 sm:pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-red-600 text-sm font-semibold mb-3">
            <MergeIcon className="w-3 h-3" />
            SlimFile Forge
          </div>
          <h1 className="text-4xl sm:text-5xl sm:leading-[1.08] font-semibold text-[#1d1d1f] tracking-tight mb-4">
            PDF Merger & Splitter
          </h1>
          <p className="text-[#6e6e73] text-lg sm:text-[21px] leading-snug max-w-xl mx-auto">
            Combine multiple PDF files into one, or split a PDF into separate pages or custom sections.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
          {[
            { icon: <FilePlus2 className="w-3.5 h-3.5 text-orange-500" />, label: 'Merge up to 20 PDFs' },
            { icon: <Scissors   className="w-3.5 h-3.5 text-orange-500" />, label: 'Split by page ranges' },
            { icon: <Download   className="w-3.5 h-3.5 text-orange-500" />, label: 'Instant download' },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-sm text-[#6e6e73]">
              {icon}
              {label}
            </span>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-[#e8e8ed] rounded-full p-1 mb-6">
          <button
            onClick={() => setTab('merge')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all ${
              tab === 'merge'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FilePlus2 className="w-4 h-4" />
            Merge PDFs
          </button>
          <button
            onClick={() => setTab('split')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all ${
              tab === 'split'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Scissors className="w-4 h-4" />
            Split PDF
          </button>
        </div>

        {/* Card */}
        <div className="bg-[#f5f5f7] rounded-[28px] p-6 sm:p-8">
          {tab === 'merge' ? (
            <MergeTab onSuccess={() => { setPromptTool('forge-merge'); setShowReviewPrompt(true); }} />
          ) : (
            <SplitTab onSuccess={() => { setPromptTool('forge-split'); setShowReviewPrompt(true); }} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Files are processed securely and never stored on our servers</span>
        </div>
      </div>

      {showReviewPrompt && <ReviewButton operationType={promptTool} />}
    </div>
  );
};

export default SlimFileForge;

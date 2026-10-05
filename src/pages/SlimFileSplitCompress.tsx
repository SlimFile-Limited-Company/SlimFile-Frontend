import { useState, useCallback } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2, Trash2, Scissors, FileText,
  Download, ShieldCheck, MergeIcon, Sparkles,
} from 'lucide-react';
import { ReviewPrompt } from '@/components/ReviewPrompt';

const API = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

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

const SlimFileSplitCompress = () => {
  useSEO({
    title: 'Split & Compress PDFs — Split Pages and Shrink File Size',
    description: 'Split a PDF into pages or custom page ranges and compress every piece in one step. Downloads as a ZIP. Fast, free and secure.',
  });

  const { toast } = useToast();
  const [file, setFile]     = useState<File | null>(null);
  const [ranges, setRanges] = useState('');
  const [working, setWorking] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  const onDrop = useCallback((accepted: File[]) => { if (accepted[0]) setFile(accepted[0]); }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false,
  });

  const handleSplitCompress = async () => {
    if (!file) {
      toast({ title: 'No file', description: 'Upload a PDF first.', variant: 'destructive' });
      return;
    }
    setWorking(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (ranges.trim()) formData.append('ranges', ranges.trim());
      const res = await fetch(`${API}/compress/split-compress`, { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Split and compress failed');
      }
      const blob = await res.blob();
      await downloadBlob(blob, 'compressed_split.zip');
      toast({
        title: 'Split & compressed!',
        description: 'Every piece was compressed — check the downloaded ZIP.',
      });
      setFile(null); setRanges('');
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
            Split &amp; Compress PDFs
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
            Split one PDF into separate pages or custom sections, with every piece compressed.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { icon: <Scissors   className="w-3.5 h-3.5 text-orange-500" />, label: 'Split by page ranges' },
            { icon: <Sparkles   className="w-3.5 h-3.5 text-orange-500" />, label: 'Each piece compressed' },
            { icon: <Download   className="w-3.5 h-3.5 text-orange-500" />, label: 'ZIP download' },
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
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
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
                <p className="text-xs text-gray-400 mt-1">PDF only · Max 1 GB</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                  <FileText className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</p>
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
                  <span className="font-semibold text-gray-700">How it works:</span> Each group becomes its own
                  compressed PDF inside a ZIP file.{' '}
                  <span className="text-gray-400">Example: "1-3, 5, 7-9" → three PDFs (pages 1–3, page 5, pages 7–9).</span>
                </p>
              </div>
            </div>

            <Button
              onClick={handleSplitCompress}
              disabled={working || !file}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 text-sm font-semibold shadow-sm"
            >
              {working
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Splitting &amp; compressing…</>
                : <><Download className="w-4 h-4 mr-2" />Split &amp; Compress</>}
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
        operationType="forge-split"
      />
    </div>
  );
};

export default SlimFileSplitCompress;

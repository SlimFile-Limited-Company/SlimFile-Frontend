import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2, Download, Trash2, FileText, Lock, LockOpen, Eye, EyeOff,
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

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

// ── Shared file drop component ─────────────────────────────────────────────
function PdfDropZone({ file, onFile, onClear, icon }: {
  file: File | null;
  onFile: (f: File) => void;
  onClear: () => void;
  icon: React.ReactNode;
}) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  if (file) {
    return (
      <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
          <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
        </div>
        <button onClick={onClear} className="text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
        isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50/30'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        {icon}
        <div>
          <p className="font-semibold text-gray-700">{isDragActive ? 'Drop PDF here' : 'Upload a PDF'}</p>
          <p className="text-sm text-gray-500 mt-0.5">Max 50 MB</p>
        </div>
      </div>
    </div>
  );
}

// ── Password input with show/hide ─────────────────────────────────────────
function PasswordInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Enter password'}
        className="pr-10 border-gray-200 focus:border-red-400 focus:ring-red-400/20"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ── Lock Tab ───────────────────────────────────────────────────────────────
function LockTab() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProtect = async () => {
    if (!file) return toast({ title: 'No file', description: 'Upload a PDF first.', variant: 'destructive' });
    if (!password) return toast({ title: 'No password', description: 'Enter a password.', variant: 'destructive' });
    if (password !== confirm) return toast({ title: 'Passwords do not match', description: 'Both fields must match.', variant: 'destructive' });

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', password);
      const res = await fetch(`${API}/lock/protect`, { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to protect PDF');
      }
      const blob = await res.blob();
      const name = file.name.replace(/\.pdf$/i, '') + '_locked.pdf';
      await downloadBlob(blob, name);
      toast({ title: 'PDF locked!', description: 'Your password-protected PDF is ready.' });
      setPassword('');
      setConfirm('');
      setFile(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <PdfDropZone
        file={file}
        onFile={setFile}
        onClear={() => setFile(null)}
        icon={<Lock className="w-10 h-10 text-gray-400" />}
      />

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <PasswordInput value={password} onChange={setPassword} placeholder="Create a password" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Confirm password</label>
          <PasswordInput value={confirm} onChange={setConfirm} placeholder="Re-enter password" />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs text-amber-700">
          <span className="font-semibold">Important:</span> Keep your password safe. If you lose it, the PDF cannot be recovered.
        </p>
      </div>

      <Button
        onClick={handleProtect}
        disabled={processing || !file || !password}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 shadow-md shadow-red-100"
      >
        {processing
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Locking…</>
          : <><Lock className="w-4 h-4 mr-2" />Lock PDF</>}
      </Button>
    </div>
  );
}

// ── Unlock Tab ─────────────────────────────────────────────────────────────
function UnlockTab() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleUnlock = async () => {
    if (!file) return toast({ title: 'No file', description: 'Upload a PDF first.', variant: 'destructive' });
    if (!password) return toast({ title: 'No password', description: 'Enter the PDF password.', variant: 'destructive' });

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', password);
      const res = await fetch(`${API}/lock/unlock`, { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to unlock PDF');
      }
      const blob = await res.blob();
      const name = file.name.replace(/\.pdf$/i, '').replace(/_locked$/i, '') + '_unlocked.pdf';
      await downloadBlob(blob, name);
      toast({ title: 'PDF unlocked!', description: 'Password removed successfully.' });
      setPassword('');
      setFile(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <PdfDropZone
        file={file}
        onFile={setFile}
        onClear={() => setFile(null)}
        icon={<LockOpen className="w-10 h-10 text-gray-400" />}
      />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">PDF Password</label>
        <PasswordInput value={password} onChange={setPassword} placeholder="Enter the PDF's password" />
      </div>

      <Button
        onClick={handleUnlock}
        disabled={processing || !file || !password}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 shadow-md shadow-red-100"
      >
        {processing
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Unlocking…</>
          : <><LockOpen className="w-4 h-4 mr-2" />Unlock PDF</>}
      </Button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
const SlimFileLock = () => {
  const [tab, setTab] = useState<'lock' | 'unlock'>('lock');

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SlimFile Lock</h1>
          <p className="text-gray-500 mt-1">Password-protect your PDFs or remove existing passwords.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-6 shadow-sm">
          <button
            onClick={() => setTab('lock')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === 'lock'
                ? 'bg-red-600 text-white shadow-md shadow-red-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            Lock PDF
          </button>
          <button
            onClick={() => setTab('unlock')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === 'unlock'
                ? 'bg-red-600 text-white shadow-md shadow-red-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <LockOpen className="w-4 h-4" />
            Unlock PDF
          </button>
        </div>

        {/* Content card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {tab === 'lock' ? <LockTab /> : <UnlockTab />}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Files are processed securely on our server and never stored.
        </p>
      </div>
    </div>
  );
};

export default SlimFileLock;

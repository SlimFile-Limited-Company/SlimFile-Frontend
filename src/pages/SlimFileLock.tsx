import { useState, useCallback } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2, FileText, Lock, LockOpen, Eye, EyeOff,
  Trash2, ShieldCheck, Upload,
} from 'lucide-react';

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

// ── Drop zone ──────────────────────────────────────────────────────────────
function PdfDropZone({ file, onFile, onClear }: {
  file: File | null;
  onFile: (f: File) => void;
  onClear: () => void;
}) {
  const onDrop = useCallback((accepted: File[]) => { if (accepted[0]) onFile(accepted[0]); }, [onFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false,
  });

  if (file) {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
          <FileText className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
          <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB · PDF</p>
        </div>
        <button
          onClick={onClear}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
        isDragActive ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
        <Upload className="w-6 h-6 text-gray-400" />
      </div>
      <p className="font-semibold text-gray-700 text-sm">
        {isDragActive ? 'Drop your PDF here' : 'Drop PDF here or click to browse'}
      </p>
      <p className="text-xs text-gray-400 mt-1">Maximum file size 50 MB</p>
    </div>
  );
}

// ── Password input ─────────────────────────────────────────────────────────
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
        className="pr-10 h-11 border-gray-200 focus:border-red-400 focus:ring-red-400/20 rounded-xl"
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

// ── Protect tab ────────────────────────────────────────────────────────────
function ProtectTab() {
  const { toast } = useToast();
  const [file, setFile]         = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [processing, setProcessing] = useState(false);

  const mismatch = password && confirm && password !== confirm;

  const handleProtect = async () => {
    if (!file)            return toast({ title: 'No file', description: 'Upload a PDF first.', variant: 'destructive' });
    if (!password)        return toast({ title: 'No password', description: 'Enter a password.', variant: 'destructive' });
    if (password !== confirm) return toast({ title: 'Passwords do not match', description: 'Both fields must be identical.', variant: 'destructive' });

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
      await downloadBlob(blob, file.name.replace(/\.pdf$/i, '') + '_locked.pdf');
      toast({ title: 'PDF protected!', description: 'Your password-protected PDF has been downloaded.' });
      setPassword(''); setConfirm(''); setFile(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <PdfDropZone file={file} onFile={setFile} onClear={() => setFile(null)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <PasswordInput value={password} onChange={setPassword} placeholder="Create a strong password" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Confirm password</label>
          <PasswordInput value={confirm} onChange={setConfirm} placeholder="Re-enter password" />
          {mismatch && <p className="text-xs text-red-500">Passwords do not match</p>}
        </div>
      </div>

      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
        <ShieldCheck className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold">Remember your password.</span>{' '}
          There is no way to recover a protected PDF without it.
        </p>
      </div>

      <Button
        onClick={handleProtect}
        disabled={processing || !file || !password || password !== confirm}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 text-sm font-semibold shadow-sm"
      >
        {processing
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Protecting PDF…</>
          : <><Lock className="w-4 h-4 mr-2" />Lock this PDF</>}
      </Button>
    </div>
  );
}

// ── Remove password tab ────────────────────────────────────────────────────
function RemovePasswordTab() {
  const { toast } = useToast();
  const [file, setFile]         = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleUnlock = async () => {
    if (!file)     return toast({ title: 'No file', description: 'Upload a PDF first.', variant: 'destructive' });
    if (!password) return toast({ title: 'No password', description: 'Enter the PDF\'s current password.', variant: 'destructive' });

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
      toast({ title: 'Password removed!', description: 'Your PDF can now be opened without a password.' });
      setPassword(''); setFile(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <PdfDropZone file={file} onFile={setFile} onClear={() => setFile(null)} />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Current password</label>
        <PasswordInput value={password} onChange={setPassword} placeholder="Enter the PDF's existing password" />
      </div>

      <Button
        onClick={handleUnlock}
        disabled={processing || !file || !password}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-12 text-sm font-semibold shadow-sm"
      >
        {processing
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Removing password…</>
          : <><LockOpen className="w-4 h-4 mr-2" />Remove password</>}
      </Button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
const SlimFileLock = () => {
  useSEO({
    title: 'SlimFile Lock — Password Protect & Unlock PDF Files',
    description: 'Add or remove password protection from PDF files instantly. SlimFile Lock keeps your documents secure without any software installation.',
  });
  const [tab, setTab] = useState<'protect' | 'remove'>('protect');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-red-100">
            <Lock className="w-3 h-3" />
            SlimFile Lock
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
            PDF Password Protect
          </h1>
          <p className="text-gray-500 text-base max-w-sm mx-auto leading-relaxed">
            Add a password to any PDF so only you can open it — or remove one you no longer need.
            Files are never stored on our servers.
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-3 mb-10 text-xs text-gray-500">
          {[
            { step: '1', label: 'Upload your PDF' },
            { step: '2', label: 'Set a password' },
            { step: '3', label: 'Download protected file' },
          ].map(({ step, label }, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {step}
                </span>
                <span>{label}</span>
              </div>
              {i < 2 && <span className="text-gray-300">›</span>}
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-100/80 rounded-2xl p-1 mb-6">
          <button
            onClick={() => setTab('protect')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              tab === 'protect'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Lock className="w-4 h-4" />
            Protect PDF
          </button>
          <button
            onClick={() => setTab('remove')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              tab === 'remove'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <LockOpen className="w-4 h-4" />
            Remove Password
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-7 shadow-sm">
          {tab === 'protect' ? <ProtectTab /> : <RemovePasswordTab />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Encrypted in transit · Files are never stored</span>
        </div>
      </div>
    </div>
  );
};

export default SlimFileLock;

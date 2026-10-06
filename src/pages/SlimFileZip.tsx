import { useState, useRef, useCallback } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Loader2, FileArchive, FolderArchive, FilePlus2, FolderPlus,
  Trash2, Download, CheckCircle2, X, FileText, Folder,
} from 'lucide-react';
import { ReviewPrompt } from '@/components/ReviewPrompt';

const API = import.meta.env.VITE_API_BASE_URL || 'https://service.slim-file.com/api';

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

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

type Mode = 'zip' | 'unzip';

export default function SlimFileZip() {
  useSEO({
    title: 'Zip Files Online — Compress & Unzip Folders | SlimFile',
    description: 'Upload files or whole folders, get a ZIP back with the folder structure intact. Unzip any archive too. Free, no sign-up.',
  });
  const { toast } = useToast();

  const [mode, setMode] = useState<Mode>('zip');
  const [items, setItems] = useState<{ path: string; file: File }[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ name: string; size: number } | null>(null);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  // Two inputs because the browser exposes folders and loose files through
  // different properties, and a single input can't offer both cleanly.
  const fileInput = useRef<HTMLInputElement>(null);
  const dirInput = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next: { path: string; file: File }[] = [];
    for (const file of Array.from(list)) {
      const rel = (file as any).webkitRelativePath as string | undefined;
      const path = rel && rel.includes('/') ? rel : file.name;
      // De-dupe by path so re-adding the same folder doesn't double entries.
      next.push({ path, file });
    }
    setItems(prev => {
      const seen = new Map(prev.map(i => [i.path, i]));
      for (const i of next) seen.set(i.path, i);
      return Array.from(seen.values());
    });
    setDone(null);
  };

  const clearAll = () => { setItems([]); setDone(null); };
  const removeAt = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  const submit = async () => {
    if (!items.length || busy) return;
    setBusy(true);
    setDone(null);
    const started = Date.now();

    try {
      const form = new FormData();
      // The path goes in as the form filename. That is the whole trick: the
      // server zips under that path, so `photos/2026/a.jpg` keeps both folders.
      for (const item of items) form.append('files', item.file, item.path);

      const res = await fetch(`${API}/zip/compress`, { method: 'POST', body: form });
      if (!res.ok) {
        let message = 'Zip failed.';
        try { message = (await res.json()).error || message; } catch { /* body wasn't JSON */ }
        throw new Error(message);
      }

      const blob = await res.blob();
      if (!blob.size) throw new Error('The server returned an empty ZIP.');
      await downloadBlob(blob, 'slimfile-zip.zip');
      const size = blob.size;
      setDone({ name: 'slimfile-zip.zip', size });
      if (Date.now() - started > 3000) toast({ title: 'Downloaded!', description: `ZIP is ${fmtSize(size)}.` });
      if (items.length > 1) setShowReviewPrompt(true);
    } catch (err) {
      toast({ title: 'Zip failed', description: err instanceof Error ? err.message : 'Something went wrong.', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const extract = async () => {
    if (!zipFile || busy) return;
    setBusy(true);
    setDone(null);
    const started = Date.now();

    try {
      const { default: JSZip } = await import('jszip');
      const zip = await JSZip.loadAsync(zipFile);

      const files = Object.values(zip.files).filter(f => !f.dir && !f.name.startsWith('__MACOSX/'));
      if (!files.length) throw new Error('That ZIP has no files in it.');
      if (files.length > 300) throw new Error(`That ZIP has ${files.length} files. The limit is 300.`);

      let total = 0;
      for (const f of files) {
        const blob = await f.async('blob');
        total += blob.size;
        await downloadBlob(blob, f.name);
      }
      setDone({ name: `${files.length} files, ${fmtSize(total)}`, size: total });
      if (Date.now() - started > 3000) {
        toast({ title: 'Extracted!', description: `${files.length} files downloaded with folders intact.` });
      }
    } catch (err) {
      toast({ title: 'Unzip failed', description: err instanceof Error ? err.message : 'Something went wrong.', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const totalBytes = items.reduce((sum, i) => sum + i.file.size, 0);

  const tabBtn = (m: Mode, label: string) => (
    <button
      onClick={() => { setMode(m); setDone(null); }}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'zip' ? 'Zip Files & Folders' : 'Unzip a ZIP File'}
          </h1>
          <p className="text-gray-500 mt-2">
            {mode === 'zip'
              ? 'Upload files or a whole folder. Folder structure is kept inside the ZIP.'
              : 'Drop a ZIP and pull everything out, folders included.'}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {tabBtn('zip', 'Compress to ZIP')}
          {tabBtn('unzip', 'Unzip')}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          {mode === 'zip' ? (
            <>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => fileInput.current?.click()} variant="outline" className="gap-2">
                  <FilePlus2 className="w-4 h-4" /> Add files
                </Button>
                <Button onClick={() => dirInput.current?.click()} variant="outline" className="gap-2">
                  <FolderPlus className="w-4 h-4" /> Add folder
                </Button>
                {items.length > 0 && (
                  <Button onClick={clearAll} variant="ghost" className="gap-2 text-red-500">
                    <Trash2 className="w-4 h-4" /> Clear
                  </Button>
                )}
              </div>

              <input ref={fileInput} type="file" multiple hidden onChange={e => addFiles(e.target.files)} />
              <input
                ref={dirInput} type="file" webkitdirectory="" directory="" multiple hidden
                onChange={e => addFiles(e.target.files)}
              />

              {items.length > 0 && (
                <div className="mt-4 max-h-72 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50">
                  {items.map((item, i) => (
                    <div key={item.path + i} className="flex items-center gap-3 px-3 py-2">
                      {item.path.includes('/')
                        ? <Folder className="w-4 h-4 text-gray-400 shrink-0" />
                        : <FileText className="w-4 h-4 text-gray-400 shrink-0" />}
                      <span className="flex-1 text-sm text-gray-700 truncate">{item.path}</span>
                      <span className="text-xs text-gray-400 shrink-0">{fmtSize(item.file.size)}</span>
                      <button onClick={() => removeAt(i)} className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {items.length
                    ? `${items.length} file${items.length === 1 ? '' : 's'} · ${fmtSize(totalBytes)}`
                    : 'No files chosen yet'}
                </p>
                <Button onClick={submit} disabled={!items.length || busy} className="gap-2">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileArchive className="w-4 h-4" />}
                  {busy ? 'Zipping…' : 'Download ZIP'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div
                onClick={() => fileInput.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${zipFile ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <input
                  ref={fileInput} type="file" accept=".zip,application/zip,application/x-zip-compressed" hidden
                  onChange={e => { const f = e.target.files?.[0]; if (f) { setZipFile(f); setDone(null); } }}
                />
                <FolderArchive className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                {zipFile ? (
                  <p className="text-sm font-medium text-gray-800 truncate">{zipFile.name}</p>
                ) : (
                  <p className="text-sm text-gray-500">Click to choose a ZIP file</p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">{zipFile ? fmtSize(zipFile.size) : 'Nothing selected'}</p>
                <Button onClick={extract} disabled={!zipFile || busy} className="gap-2">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {busy ? 'Extracting…' : 'Extract files'}
                </Button>
              </div>
            </>
          )}

          {done && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-800">{done.name} ready</p>
            </div>
          )}

          <p className="mt-4 text-xs text-gray-400 leading-relaxed">
            {mode === 'zip'
              ? 'Files stream from your device to the ZIP and back — nothing is stored. Unzipping happens entirely in your browser.'
              : 'Unzipping runs entirely in your browser. Your ZIP never leaves your device.'}
          </p>
        </div>
      </div>

      <ReviewPrompt
        operationType={mode === 'zip' ? 'zip' : 'unzip'}
        isOpen={showReviewPrompt}
        onClose={() => setShowReviewPrompt(false)}
      />
    </div>
  );
}

import { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Loader2, FileText, Download, CheckCircle2, Eraser, Wand2,
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'https://service.slim-file.com/api';
const MAX_CHARS = 500000;

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const SAMPLE = `# Quarterly Report

## Summary

This document was generated from plain text, but it comes out as a properly
formatted PDF — headings, paragraphs and lists are all kept.

## Highlights

- **Faster downloads**: files are smaller, so sharing is quick.
- *Clean layouts*: headings and lists are formatted automatically.
- No special software: just paste your text and download.

## Next Steps

1. Paste any text.
2. Add a title if you like.
3. Hit Create PDF.

## Stats

**Characters:** 500 limit-free text. **Format:** A4, ready to print.`;

export default function TextToPdf() {
  useSEO({
    title: 'Text to PDF — Create a PDF from Text Online | SlimFile',
    description: 'Paste raw text and download a clean, formatted PDF in seconds. Headings, bullet lists, numbered lists and bold text are all kept. Free, no sign-up.',
  });
  const { toast } = useToast();

  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ name: string; size: number } | null>(null);

  const submit = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    setDone(null);

    try {
      const response = await fetch(`${API}/text-to-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, title }),
      });

      if (!response.ok) {
        let message = 'Could not create the PDF.';
        try { message = (await response.json()).error || message; } catch { /* not JSON */ }
        throw new Error(message);
      }

      const blob = await response.blob();
      if (!blob.size) throw new Error('The server returned an empty PDF.');

      const filename = (title.trim() || 'text-to-pdf')
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'text-to-pdf';

      downloadBlob(blob, `${filename}.pdf`);
      setDone({ name: `${filename}.pdf`, size: blob.size });
      toast({ title: 'Downloaded!', description: `Your PDF is ${fmtSize(blob.size)}.` });
    } catch (err) {
      toast({
        title: 'Failed',
        description: err instanceof Error ? err.message : 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  const canSubmit = text.trim().length > 0 && !busy;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Text to PDF</h1>
          <p className="text-gray-500 mt-2">
            Paste plain text and get a clean, formatted PDF — headings, lists and bold text included.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title (optional)</label>
            <input
              value={title}
              onChange={e => { setTitle(e.target.value); setDone(null); }}
              maxLength={120}
              placeholder="My document"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Your text</label>
              <span className={`text-xs ${text.length > MAX_CHARS ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars
              </span>
            </div>
            <textarea
              value={text}
              onChange={e => { setText(e.target.value); setDone(null); }}
              maxLength={MAX_CHARS}
              rows={14}
              placeholder={'Paste your text here…\n\n# Use # for a title\n- Use - for bullet lists\n1. Use 1. for numbered lists\n**Use ** around bold**, and * around *italic*.'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {!text && (
                <Button variant="outline" onClick={() => setText(SAMPLE)} className="gap-2">
                  <Wand2 className="w-4 h-4" /> Try a sample
                </Button>
              )}
              {text.trim() && (
                <Button variant="ghost" onClick={() => { setText(''); setDone(null); }} className="gap-2 text-red-500">
                  <Eraser className="w-4 h-4" /> Clear
                </Button>
              )}
            </div>

            <Button onClick={submit} disabled={!canSubmit} className="gap-2 min-w-[11rem]">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {busy ? 'Creating…' : 'Create PDF'}
            </Button>
          </div>

          {done && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-800">{done.name} ready ({fmtSize(done.size)})</p>
            </div>
          )}

          <p className="text-xs text-gray-400 leading-relaxed">
            Plain text is formatted with simple shortcuts: <code className="text-gray-500"># </code>headings,
            <code className="text-gray-500">- </code>bullet lists, <code className="text-gray-500">1. </code>numbered
            lists, <code className="text-gray-500">**bold**</code> and <code className="text-gray-500">*italic*</code>.
            Downloading the PDF is generated securely on our servers and nothing is stored.
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState, useCallback, useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { reportClientTool } from '@/utils/clientToolTracking';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Upload,
  FileText,
  Copy,
  Download,
  Loader2,
  X,
  CheckCircle2,
  Eraser,
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'https://service.slim-file.com/api';
const MAX_BYTES = 25 * 1024 * 1024;

const stripTags = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/[ \t]{2,}/g, ' ').trim();

function tablesToGfm(s: string): string {
  if (!/<table/i.test(s)) return s;
  return s.replace(/<table[\s\S]*?<\/table>/gi, tbl => {
    const rows = [...tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m =>
      [...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c => stripTags(c[1]))
    ).filter(r => r.length);
    if (!rows.length) return '';
    const w = Math.max(...rows.map(r => r.length));
    const pad = (r: string[]) => [...r, ...Array(w - r.length).fill('')];
    const out = [`| ${pad(rows[0]).join(' | ')} |`, `| ${Array(w).fill('---').join(' | ')} |`];
    for (const r of rows.slice(1)) out.push(`| ${pad(r).join(' | ')} |`);
    return `\n${out.join('\n')}\n`;
  });
}

const toPlainText = (s: string) => stripTags(tablesToGfm(s));

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-lg font-semibold text-gray-900 mt-4 mb-2 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-base font-semibold text-gray-900 mt-3 mb-1 first:mt-0">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-gray-700 leading-relaxed my-2">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-gray-800">{children}</em>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-6 my-2 space-y-1 text-gray-700">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-6 my-2 space-y-1 text-gray-700">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-4 overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-gray-100 text-left">{children}</thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-4 py-2.5 font-semibold text-gray-900 border-b border-gray-200 whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-4 py-2 border-b border-gray-100 text-gray-700 align-top">{children}</td>
  ),
};

export default function OCRTool() {
  useSEO({
    title: 'OCR Tool — Extract Text, Tables & Formatting From Images & PDFs | SlimFile',
    description: "Convert scanned images and PDFs to editable, formatted text with SlimFile's free OCR tool. Keeps headings, lists and tables. No signup required.",
  });
  const { toast } = useToast();

  useEffect(() => {
    reportClientTool('ocr', 'visit');
  }, []);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [meta, setMeta] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;

    const isImage = f.type.startsWith('image/');
    const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');

    if (!isImage && !isPdf) {
      toast({ title: 'Unsupported file', description: 'Upload an image or a PDF.', variant: 'destructive' });
      return;
    }
    if (f.size > MAX_BYTES) {
      toast({
        title: 'File too large',
        description: 'Max size is 25MB. Compress it at slim-file.com/compress, then re-upload.',
        variant: 'destructive',
      });
      return;
    }

    setFile(f);
    setMarkdown('');
    setText('');
    setMeta('');

    if (isImage) {
      const reader = new FileReader();
      reader.onload = e => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreviewUrl(null);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const extract = async () => {
    if (!file || busy) return;
    reportClientTool('ocr', 'complete');
    setBusy(true);
    setMarkdown('');
    setText('');
    setMeta('');

    try {
      const form = new FormData();
      form.append('file', file);
      const response = await fetch(`${API}/ocr`, { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.detail || 'Text extraction failed');

      const md = tablesToGfm(data.markdown || data.text || '');
      const plain = toPlainText(data.text || md);
      setMarkdown(md);
      setText(plain);
      setMeta(
        [data.pages > 1 ? `${data.pages} pages` : '1 page', data.elapsedMs ? `${(data.elapsedMs / 1000).toFixed(1)}s` : null]
          .filter(Boolean)
          .join(' · ')
      );
      toast({ title: 'Text extracted', description: `${plain.split(/\s+/).filter(Boolean).length} words found.` });
    } catch (err) {
      toast({
        title: 'Extraction failed',
        description: err instanceof Error ? err.message : 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setMarkdown('');
    setText('');
    setMeta('');
  };

  const copyText = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const downloadTxt = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'Downloaded', description: 'Text file saved.' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">OCR</h1>
          <p className="text-gray-500 mt-2">
            Extract text from images and PDFs — headings, lists and tables kept.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-700 font-medium">
                {isDragActive ? 'Drop file here' : 'Drag & drop or click to choose a file'}
              </p>
              <p className="text-xs text-gray-400 mt-1.5">Images (JPG, PNG, WebP, TIFF) or PDF · max 25MB</p>
            </div>
          ) : (
            <>
              {previewUrl && (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={previewUrl} alt="Preview" className="w-full max-h-80 object-contain bg-gray-50" />
                  <button
                    onClick={reset}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {!previewUrl && (
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <FileText className="w-8 h-8 text-blue-400 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button
                    onClick={reset}
                    className="ml-auto p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button variant="ghost" onClick={reset} className="gap-2 text-red-500">
                  <Eraser className="w-4 h-4" /> Clear
                </Button>
                <Button onClick={extract} disabled={busy} className="gap-2 min-w-[11rem]">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  {busy ? 'Extracting…' : 'Extract Text'}
                </Button>
              </div>
            </>
          )}

          {busy && <p className="text-sm text-gray-500 text-center">Working on it — this can take a few seconds…</p>}

          {text && !busy && (
            <>
              <Tabs defaultValue="formatted" className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="formatted">Formatted</TabsTrigger>
                    <TabsTrigger value="raw">Raw Text</TabsTrigger>
                  </TabsList>
                  {meta && <span className="text-xs text-gray-400">{meta}</span>}
                </div>
                <TabsContent value="formatted" className="mt-3">
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[240px] max-h-[460px] overflow-y-auto text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {markdown || text}
                    </ReactMarkdown>
                  </div>
                </TabsContent>
                <TabsContent value="raw" className="mt-3">
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="w-full min-h-[240px] max-h-[460px] p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Button onClick={copyText} variant="outline" className="flex-1 gap-2">
                  <Copy className="w-4 h-4" /> Copy Text
                </Button>
                <Button onClick={downloadTxt} variant="outline" className="flex-1 gap-2">
                  <Download className="w-4 h-4" /> Download TXT
                </Button>
              </div>
            </>
          )}

          {text && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-800">
                {text.split(/\s+/).filter(Boolean).length} words{meta ? ` · ${meta}` : ''}
              </p>
            </div>
          )}

          <p className="text-xs text-gray-400 leading-relaxed">
            Files are processed securely on our servers and nothing is stored.
          </p>
        </div>
      </div>
    </div>
  );
}

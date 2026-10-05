import { useState, type ReactNode } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Smartphone } from 'lucide-react';
import { ReviewPrompt } from '@/components/ReviewPrompt';
import ScanUploader, { type ScanPage } from '@/components/ScanUploader';
import { accent } from '@/lib/scanAccents';

const API = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

export interface ScanToolConfig {
  title: string;
  seoTitle: string;
  seoDescription: string;
  blurb: string;
  accentKey: string;
  endpoint: string;
  submitLabel: string;
  workingLabel: string;
  downloadName: string;
  successTitle: string;
  successBody: (pages: number, savedKb: number) => string;
  pills: { icon: ReactNode; label: string }[];
  desktopHint: string;
  operationType: string;
  maxPages?: number;
  /** Extra fields, e.g. the target format for scan-convert */
  extraFields?: ReactNode;
  extraBody?: (pages: number) => Record<string, string>;
  minPages?: number;
  /** Defaults to pages.length, but split lets a single page be split too */
  submitEnabled?: (pages: number) => boolean;
  preSubmitError?: string;
  postProcess?: (blob: Blob) => Promise<{ blob: Blob; filename: string }>;
}

/**
 * Shared shell for the four scanner tools. They differ only in endpoint, copy
 * and the optional target-format picker, so the page furniture — camera
 * capture, page strip, submit button, download — lives here once.
 */
export default function ScanToolPage({ config }: { config: ScanToolConfig }) {
  useSEO({ title: config.seoTitle, description: config.seoDescription });

  const { toast } = useToast();
  const a = accent(config.accentKey);
  const [pages, setPages] = useState<ScanPage[]>([]);
  const [working, setWorking] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const totalSize = pages.reduce((sum, p) => sum + p.file.size, 0);
  const minPages = config.minPages ?? 1;
  const canSubmit = config.submitEnabled
    ? config.submitEnabled(pages.length)
    : pages.length >= minPages;

  const handleSubmit = async () => {
    if (pages.length < minPages) {
      toast({
        title: config.preSubmitError || 'Capture at least one page',
        description: 'Use the camera button to scan a page first.',
        variant: 'destructive',
      });
      return;
    }

    setWorking(true);
    try {
      const formData = new FormData();
      pages.forEach(p => formData.append('files', p.file, `page_${p.file.name || 'scan.jpg'}`));
      Object.entries(config.extraBody?.(pages.length) ?? {}).forEach(([k, v]) => formData.append(k, v));

      const res = await fetch(`${API}${config.endpoint}`, { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Something went wrong');
      }

      let blob = await res.blob();
      let filename = config.downloadName;
      if (config.postProcess) {
        const out = await config.postProcess(blob);
        blob = out.blob;
        filename = out.filename;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const savedKb = Math.max(0, Math.round((totalSize - blob.size) / 1024));
      toast({ title: config.successTitle, description: config.successBody(pages.length, savedKb) });

      setPages([]);
      setTimeout(() => setShowReview(true), 1500);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-1.5 ${a.badge} text-xs font-semibold px-3 py-1 rounded-full mb-5 border`}>
            <Smartphone className="w-3 h-3" />
            Mobile Scanner
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">{config.title}</h1>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">{config.blurb}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {config.pills.map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
              {icon}
              {label}
            </span>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-200/80 p-7 shadow-sm">
          <div className="space-y-5">
            <ScanUploader
              pages={pages}
              setPages={setPages}
              maxPages={config.maxPages ?? 30}
              accentKey={config.accentKey}
              desktopHint={config.desktopHint}
              onLimitHit={() => toast({
                title: 'Limit reached',
                description: `You can capture up to ${config.maxPages ?? 30} pages in one go.`,
                variant: 'destructive',
              })}
            />

            {config.extraFields}

            <Button
              onClick={handleSubmit}
              disabled={working || !canSubmit}
              className={`w-full rounded-xl h-12 text-sm font-semibold shadow-sm ${a.btn}`}
            >
              {working
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{config.workingLabel}</>
                : <><Download className="w-4 h-4 mr-2" />{config.submitLabel}</>}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Scanning runs on your phone's camera</span>
        </div>
      </div>

      <ReviewPrompt isOpen={showReview} onClose={() => setShowReview(false)} operationType={config.operationType} />
    </div>
  );
}

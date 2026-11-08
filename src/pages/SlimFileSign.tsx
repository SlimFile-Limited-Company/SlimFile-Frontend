import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy, PageViewport } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  CalendarDays, Download, FileUp, Loader2, Minimize2, PenLine, ShieldCheck, Signature, Trash2, Type, X,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { SignatureDialog } from '@/components/esign/SignatureDialog';
import { trackCampusFile } from '@/lib/campus';
import { markDownloaded } from '@/lib/followChannel';
import {
  EncryptedPdfError, LARGE_PDF_BYTES, plainTextToInk, signPdf, todayLabel,
  type FieldKind, type Ink, type SignField,
} from '@/lib/esign';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const formatMb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** Default width of a new field, as a fraction of the page width. */
const DEFAULT_WIDTH: Record<FieldKind, number> = { signature: 0.3, initials: 0.1, date: 0.2, text: 0.25 };
/** Height of new date/text fields as a fraction of the page height (about 14pt on A4/Letter). */
const TEXT_HEIGHT = 0.02;

const TOOLS: { kind: FieldKind; label: string; icon: typeof Signature }[] = [
  { kind: 'signature', label: 'Signature', icon: Signature },
  { kind: 'initials', label: 'Initials', icon: PenLine },
  { kind: 'date', label: 'Date', icon: CalendarDays },
  { kind: 'text', label: 'Text', icon: Type },
];

function downloadBlob(blob: Blob, filename: string) {
  markDownloaded();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const SlimFileSign = () => {
  useSEO({
    title: 'eSign PDF — Sign PDF Documents Online, Free | SlimFile',
    description:
      'Sign PDFs in your browser. Draw, type or upload your signature, add the date and text, and download. Free, and your file never leaves your device.',
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [viewports, setViewports] = useState<PageViewport[]>([]);
  const [loading, setLoading] = useState(false);
  const [largeFile, setLargeFile] = useState<File | null>(null);

  const [fields, setFields] = useState<SignField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<FieldKind | null>(null);
  const [inks, setInks] = useState<Partial<Record<'signature' | 'initials', Ink>>>({});
  const [dialogKind, setDialogKind] = useState<'signature' | 'initials' | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    doc?.destroy();
    setFile(null);
    setDoc(null);
    setViewports([]);
    setFields([]);
    setSelectedId(null);
    setTool(null);
  };

  const openPdf = async (next: File) => {
    setLoading(true);
    try {
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await next.arrayBuffer()) }).promise;
      const pages = await Promise.all(
        Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1).then(p => p.getViewport({ scale: 1 }))),
      );
      setFile(next);
      setDoc(pdf);
      setViewports(pages);
      setFields([]);
    } catch (e) {
      const passwordProtected = e instanceof Error && e.name === 'PasswordException';
      toast({
        title: passwordProtected ? 'This PDF is password-protected' : 'We couldn’t open this PDF',
        description: passwordProtected
          ? 'Remove the password with PDF Password Protect, then sign it here.'
          : 'The file may be damaged. Try saving it again as a PDF.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((accepted: File[]) => {
    const next = accepted[0];
    if (!next) return;
    if (next.size >= LARGE_PDF_BYTES) {
      setLargeFile(next);
      return;
    }
    openPdf(next);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: loading,
    onDropRejected: () =>
      toast({ title: 'PDF files only', description: 'Choose a PDF to sign.', variant: 'destructive' }),
  });

  const compressFirst = () => {
    if (!largeFile) return;
    navigate('/compress', { state: { files: [largeFile], from: 'esign' } });
  };

  const chooseTool = (kind: FieldKind) => {
    if ((kind === 'signature' || kind === 'initials') && !inks[kind]) {
      setDialogKind(kind);
      return;
    }
    setTool(current => (current === kind ? null : kind));
    setSelectedId(null);
  };

  const placeField = (page: number, fx: number, fy: number) => {
    if (!tool) {
      setSelectedId(null);
      return;
    }
    const viewport = viewports[page];
    const pageAspect = viewport.width / viewport.height;
    let ink: Ink;
    let text: string | undefined;
    if (tool === 'signature' || tool === 'initials') {
      const saved = inks[tool];
      if (!saved) return;
      ink = saved;
    } else {
      text = tool === 'date' ? todayLabel() : 'Type here';
      ink = plainTextToInk(text);
    }
    const isText = tool === 'date' || tool === 'text';
    let h = isText ? TEXT_HEIGHT : (DEFAULT_WIDTH[tool] * pageAspect) / ink.aspect;
    let w = isText ? (h * ink.aspect) / pageAspect : DEFAULT_WIDTH[tool];
    if (w > 0.9) {
      h *= 0.9 / w;
      w = 0.9;
    }
    const field: SignField = {
      id: crypto.randomUUID(),
      kind: tool,
      page,
      x: Math.min(Math.max(fx - w / 2, 0), 1 - w),
      y: Math.min(Math.max(fy - h / 2, 0), 1 - h),
      w,
      h,
      image: ink.dataUrl,
      aspect: ink.aspect,
      text,
    };
    setFields(prev => [...prev, field]);
    setSelectedId(field.id);
    setTool(null);
  };

  const updateField = (id: string, patch: Partial<SignField>) =>
    setFields(prev => prev.map(f => (f.id === id ? { ...f, ...patch } : f)));

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    setSelectedId(null);
  };

  const editText = (field: SignField, text: string) => {
    const ink = plainTextToInk(text || ' ');
    const viewport = viewports[field.page];
    const w = Math.min((field.h * ink.aspect * viewport.height) / viewport.width, 1 - field.x);
    updateField(field.id, { text, image: ink.dataUrl, aspect: ink.aspect, w });
  };

  // Delete removes the selected field; Escape stops placing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea')) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) deleteField(selectedId);
      if (e.key === 'Escape') {
        setTool(null);
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId]);

  const download = async () => {
    if (!file || fields.length === 0) return;
    setSaving(true);
    try {
      const blob = await signPdf(file, fields, viewports);
      const stem = file.name.replace(/\.pdf$/i, '');
      downloadBlob(blob, `${stem}-signed.pdf`);
      trackCampusFile();
      toast({ title: 'Signed PDF downloaded', description: `${stem}-signed.pdf is in your downloads.` });
    } catch (e) {
      toast({
        title: e instanceof EncryptedPdfError ? 'This PDF is password-protected' : 'Couldn’t sign this PDF',
        description:
          e instanceof EncryptedPdfError
            ? 'Remove the password with PDF Password Protect, then sign it here.'
            : 'Something went wrong while saving. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const signedCount = fields.length;

  return (
    <div className="min-h-screen bg-white pt-28 sm:pt-32 pb-24">
      {!doc ? (
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-red-600 text-sm font-semibold mb-3">
              <Signature className="w-3.5 h-3.5" />
              eSign
            </div>
            <h1 className="text-4xl sm:text-5xl sm:leading-[1.08] font-semibold text-[#1d1d1f] tracking-tight mb-4">
              Sign PDFs online
            </h1>
            <p className="text-[#6e6e73] text-lg sm:text-[21px] leading-snug max-w-xl mx-auto">
              Draw, type or upload your signature, place it on the page, and download. Your file never leaves your device.
            </p>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
            {[
              { icon: Signature, label: 'Draw, type or upload' },
              { icon: CalendarDays, label: 'Date, initials & text' },
              { icon: ShieldCheck, label: 'Never uploaded' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-sm text-[#6e6e73]">
                <Icon className="w-3.5 h-3.5 text-red-600" />
                {label}
              </span>
            ))}
          </div>

          {/* Upload */}
          <div className="bg-[#f5f5f7] rounded-[28px] p-6 sm:p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-[22px] p-10 sm:p-14 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-red-500 bg-red-50' : 'border-[#d2d2d7] bg-white hover:border-red-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto mb-3">
                {loading ? <Loader2 className="w-6 h-6 text-[#6e6e73] animate-spin" /> : <FileUp className="w-6 h-6 text-[#6e6e73]" />}
              </div>
              <p className="font-medium text-[#1d1d1f]">
                {loading ? 'Opening your PDF…' : isDragActive ? 'Drop your PDF here' : 'Drop a PDF here or click to choose'}
              </p>
              <p className="text-sm text-[#6e6e73] mt-1">One PDF. Over 15 MB? We’ll help you compress it first.</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-[#6e6e73]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Signing happens in your browser. Your PDF is never uploaded.</span>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* File bar */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="min-w-0">
              <p className="text-[15px] font-medium text-[#1d1d1f] truncate">{file?.name}</p>
              <p className="text-sm text-[#6e6e73]">
                {viewports.length} {viewports.length === 1 ? 'page' : 'pages'} · {file && formatMb(file.size)}
              </p>
            </div>
            <button onClick={reset} className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] inline-flex items-center gap-1 shrink-0">
              <X className="w-4 h-4" /> Choose another PDF
            </button>
          </div>

          {/* Toolbar */}
          <div className="sticky top-12 z-20 -mx-4 sm:mx-0 px-4 sm:px-3 py-3 bg-[#fbfbfd]/80 backdrop-blur-xl sm:rounded-full border-y sm:border border-black/[0.06] flex flex-wrap items-center gap-2 mb-4">
            {TOOLS.map(({ kind, label, icon: Icon }) => (
              <button
                key={kind}
                onClick={() => chooseTool(kind)}
                aria-pressed={tool === kind}
                className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium transition-colors ${
                  tool === kind ? 'bg-red-600 text-white' : 'bg-[#e8e8ed] text-[#1d1d1f] hover:bg-[#dcdce1]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
            <div className="flex-1" />
            <Button onClick={download} disabled={saving || signedCount === 0} className="h-9">
              {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Download className="w-4 h-4 mr-1.5" />}
              Download signed PDF
            </Button>
          </div>

          <p className="text-sm text-[#6e6e73] text-center mb-4" aria-live="polite">
            {tool
              ? `Click on the page where the ${tool} should go.`
              : signedCount === 0
                ? 'Choose Signature, Initials, Date or Text, then click on the page.'
                : 'Drag to move, drag the corner to resize. Change your signature anytime.'}
            {(inks.signature || inks.initials) && !tool && (
              <>
                {' '}
                <button className="text-red-600 hover:underline" onClick={() => setDialogKind(inks.signature ? 'signature' : 'initials')}>
                  Redo {inks.signature ? 'signature' : 'initials'}
                </button>
              </>
            )}
          </p>

          {/* Pages */}
          <div className="bg-[#f5f5f7] rounded-[28px] p-3 sm:p-6 space-y-4 sm:space-y-6">
            {viewports.map((viewport, index) => (
              <PdfPage
                key={index}
                doc={doc}
                index={index}
                viewport={viewport}
                placing={tool !== null}
                onPlace={(fx, fy) => placeField(index, fx, fy)}
              >
                {(pageRef) =>
                  fields
                    .filter(f => f.page === index)
                    .map(field => (
                      <FieldBox
                        key={field.id}
                        field={field}
                        pageRef={pageRef}
                        selected={field.id === selectedId}
                        onSelect={() => setSelectedId(field.id)}
                        onChange={patch => updateField(field.id, patch)}
                        onDelete={() => deleteField(field.id)}
                        onText={text => editText(field, text)}
                      />
                    ))
                }
              </PdfPage>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-[#6e6e73]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Signing happens in your browser. Your PDF is never uploaded.</span>
          </div>
        </div>
      )}

      <SignatureDialog
        open={dialogKind !== null}
        kind={dialogKind ?? 'signature'}
        onOpenChange={open => !open && setDialogKind(null)}
        onDone={ink => {
          const kind = dialogKind ?? 'signature';
          setInks(prev => ({ ...prev, [kind]: ink }));
          // Fields already placed with the old signature switch to the new one.
          setFields(prev =>
            prev.map(f => {
              if (f.kind !== kind) return f;
              const viewport = viewports[f.page];
              const h = Math.min((f.w * viewport.width) / viewport.height / ink.aspect, 1 - f.y);
              return { ...f, image: ink.dataUrl, aspect: ink.aspect, h };
            }),
          );
          setTool(kind);
        }}
      />

      <AlertDialog open={largeFile !== null} onOpenChange={open => !open && setLargeFile(null)}>
        <AlertDialogContent className="rounded-[28px] p-6 sm:p-8">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-2">
              <Minimize2 className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
              Compress this PDF first
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[15px] leading-relaxed text-[#6e6e73]">
              <span className="font-medium text-[#1d1d1f]">{largeFile?.name}</span> is{' '}
              {largeFile && formatMb(largeFile.size)}. Large PDFs are slow to sign in the browser. Compress it first: it
              gets much smaller and keeps its quality. Then download it and sign it here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="rounded-full border-0 bg-[#e8e8ed] text-[#1d1d1f] hover:bg-[#dcdce1] hover:text-[#1d1d1f]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={compressFirst} className="rounded-full bg-red-600 hover:bg-red-700">
              Compress it now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

/** One PDF page, drawn when it scrolls near the screen. Fields are positioned on top of it. */
function PdfPage({
  doc,
  index,
  viewport,
  placing,
  onPlace,
  children,
}: {
  doc: PDFDocumentProxy;
  index: number;
  viewport: PageViewport;
  placing: boolean;
  onPlace: (fx: number, fy: number) => void;
  children: (pageRef: React.RefObject<HTMLDivElement>) => React.ReactNode;
}) {
  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), {
      rootMargin: '600px 0px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    let task: ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']> | null = null;
    (async () => {
      const page = await doc.getPage(index + 1);
      const canvas = canvasRef.current;
      const container = pageRef.current;
      if (cancelled || !canvas || !container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = (container.clientWidth * dpr) / viewport.width;
      const scaled = page.getViewport({ scale });
      canvas.width = Math.floor(scaled.width);
      canvas.height = Math.floor(scaled.height);
      task = page.render({ canvas, canvasContext: canvas.getContext('2d')!, viewport: scaled });
      await task.promise.catch(() => {});
    })();
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [visible, doc, index, viewport]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onPlace((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
  };

  return (
    <div
      ref={pageRef}
      onClick={handleClick}
      className={`relative bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.08)] select-none ${
        placing ? 'cursor-crosshair ring-2 ring-red-400/60' : ''
      }`}
      style={{ aspectRatio: `${viewport.width} / ${viewport.height}` }}
      aria-label={`Page ${index + 1}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-lg" />
      {children(pageRef)}
      <span className="absolute bottom-2 right-3 text-[11px] text-[#6e6e73]/70 pointer-events-none">{index + 1}</span>
    </div>
  );
}

/** A placed signature/text: drag to move, corner to resize (keeps its shape). */
function FieldBox({
  field,
  pageRef,
  selected,
  onSelect,
  onChange,
  onDelete,
  onText,
}: {
  field: SignField;
  pageRef: React.RefObject<HTMLDivElement>;
  selected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<SignField>) => void;
  onDelete: () => void;
  onText: (text: string) => void;
}) {
  const drag = useRef<{ mode: 'move' | 'resize'; px: number; py: number; x: number; y: number; w: number } | null>(null);

  const start = (mode: 'move' | 'resize') => (e: ReactPointerEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();
    drag.current = { mode, px: e.clientX, py: e.clientY, x: field.x, y: field.y, w: field.w };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const move = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    const rect = pageRef.current?.getBoundingClientRect();
    if (!d || !rect) return;
    const dx = (e.clientX - d.px) / rect.width;
    const dy = (e.clientY - d.py) / rect.height;
    if (d.mode === 'move') {
      onChange({
        x: Math.min(Math.max(d.x + dx, 0), 1 - field.w),
        y: Math.min(Math.max(d.y + dy, 0), 1 - field.h),
      });
    } else {
      const pageAspect = rect.width / rect.height;
      let w = Math.max(d.w + dx, 0.03);
      w = Math.min(w, 1 - field.x, ((1 - field.y) * field.aspect) / pageAspect);
      onChange({ w, h: (w * pageAspect) / field.aspect });
    }
  };

  const end = () => {
    drag.current = null;
  };

  const isText = field.kind === 'date' || field.kind === 'text';

  return (
    <div
      className={`absolute group touch-none ${selected ? 'z-10' : ''}`}
      style={{ left: `${field.x * 100}%`, top: `${field.y * 100}%`, width: `${field.w * 100}%`, height: `${field.h * 100}%` }}
      onClick={e => e.stopPropagation()}
    >
      <div
        onPointerDown={start('move')}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        className={`w-full h-full cursor-move rounded-sm ${
          selected ? 'outline outline-2 outline-red-500' : 'outline-dashed outline-1 outline-red-400/50 hover:outline-red-500'
        }`}
        role="img"
        aria-label={field.kind === 'signature' ? 'Signature' : field.kind === 'initials' ? 'Initials' : field.text}
      >
        <img src={field.image} alt="" draggable={false} className="w-full h-full object-fill pointer-events-none" />
      </div>

      {selected && (
        <>
          <span
            onPointerDown={start('resize')}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            className="absolute -right-2 -bottom-2 w-4 h-4 rounded-full bg-white border-2 border-red-500 cursor-nwse-resize"
            aria-label="Resize"
          />
          <div className="absolute left-0 bottom-full mb-2 flex items-center gap-1 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-black/[0.06] p-1">
            {isText && (
              <input
                value={field.text ?? ''}
                onChange={e => onText(e.target.value)}
                onPointerDown={e => e.stopPropagation()}
                className="h-7 w-44 px-3 rounded-full bg-[#f5f5f7] text-[13px] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Text"
                autoFocus={field.kind === 'text'}
              />
            )}
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={onDelete}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#6e6e73] hover:bg-red-50 hover:text-red-600"
              aria-label="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SlimFileSign;

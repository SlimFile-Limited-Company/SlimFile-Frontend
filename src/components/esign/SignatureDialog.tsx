import { useEffect, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';
import { ImageUp, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HANDWRITING_FONTS, imageFileToInk, loadHandwritingFont, textToInk, trimCanvas, type Ink,
} from '@/lib/esign';

const INKS = [
  { color: '#111111', label: 'Black' },
  { color: '#1d3fa8', label: 'Blue' },
];

type Props = {
  open: boolean;
  /** "signature" or "initials": changes the wording and the typed default. */
  kind: 'signature' | 'initials';
  onOpenChange: (open: boolean) => void;
  onDone: (ink: Ink) => void;
};

export function SignatureDialog({ open, kind, onOpenChange, onDone }: Props) {
  const [tab, setTab] = useState('draw');
  const [ink, setInk] = useState(INKS[0].color);
  const [typed, setTyped] = useState('');
  const [font, setFont] = useState<string>(HANDWRITING_FONTS[0].family);
  const [uploaded, setUploaded] = useState<Ink | null>(null);
  const [empty, setEmpty] = useState(true);
  const [error, setError] = useState('');

  // State, not a plain ref: the dialog mounts its content after `open` flips, so the pad must start
  // when the canvas element actually appears (and again if the Draw tab remounts it).
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);

  const noun = kind === 'signature' ? 'signature' : 'initials';

  // Handwriting fonts load when the dialog first opens.
  useEffect(() => {
    if (open) HANDWRITING_FONTS.forEach(f => loadHandwritingFont(f.family));
    if (open) setError('');
  }, [open]);

  // Signature pad: created while the Draw tab's canvas is on screen, sized at device resolution.
  useEffect(() => {
    if (!canvas) return;
    setEmpty(true);
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const size = () => {
      const data = padRef.current?.toData();
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d')!.scale(ratio, ratio);
      padRef.current?.clear();
      if (data) padRef.current?.fromData(data);
    };
    const pad = new SignaturePad(canvas, { penColor: ink, minWidth: 1, maxWidth: 3 });
    padRef.current = pad;
    size();
    const onEnd = () => setEmpty(pad.isEmpty());
    pad.addEventListener('endStroke', onEnd);
    const observer = new ResizeObserver(size);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      pad.removeEventListener('endStroke', onEnd);
      pad.off();
      padRef.current = null;
    };
  }, [canvas]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (padRef.current) padRef.current.penColor = ink;
  }, [ink]);

  const clearPad = () => {
    padRef.current?.clear();
    setEmpty(true);
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    const result = await imageFileToInk(file).catch(() => null);
    if (!result) setError('We couldn’t find a signature in that image. Try a photo of dark ink on white paper.');
    setUploaded(result);
  };

  const canSave =
    (tab === 'draw' && !empty) || (tab === 'type' && typed.trim().length > 0) || (tab === 'upload' && !!uploaded);

  const save = async () => {
    let result: Ink | null = null;
    if (tab === 'draw' && canvas) result = trimCanvas(canvas);
    if (tab === 'type') {
      await loadHandwritingFont(font);
      result = textToInk(typed.trim(), `"${font}", cursive`, ink);
    }
    if (tab === 'upload') result = uploaded;
    if (!result) return;
    onDone(result);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-[28px] p-6 sm:p-8 gap-5">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            {kind === 'signature' ? 'Create your signature' : 'Create your initials'}
          </DialogTitle>
          <DialogDescription className="text-[#6e6e73]">
            Draw, type or upload your {noun}. It stays in your browser.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-3 w-full rounded-full bg-[#e8e8ed] p-1 h-auto">
            {['draw', 'type', 'upload'].map(value => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-full py-1.5 text-[13px] capitalize data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                {value}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="draw" className="mt-4">
            <div className="relative bg-white rounded-[22px] border border-[#d2d2d7]">
              <canvas
                ref={setCanvas}
                className="w-full h-48 touch-none cursor-crosshair rounded-[22px]"
                aria-label={`Draw your ${noun} here`}
              />
              <div className="pointer-events-none absolute left-6 right-6 bottom-12 border-b border-dashed border-[#d2d2d7]" />
              {empty && (
                <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-[#6e6e73]">
                  Draw your {noun} here
                </p>
              )}
              <button
                type="button"
                onClick={clearPad}
                className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs text-[#6e6e73] hover:text-[#1d1d1f]"
              >
                <Eraser className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </TabsContent>

          <TabsContent value="type" className="mt-4 space-y-3">
            <input
              value={typed}
              onChange={e => setTyped(e.target.value)}
              placeholder={kind === 'signature' ? 'Your full name' : 'Your initials'}
              maxLength={kind === 'signature' ? 60 : 6}
              className="w-full h-11 px-4 rounded-full border border-[#d2d2d7] text-[15px] focus:outline-none focus:border-red-400"
              autoFocus
            />
            <div className="grid gap-2">
              {HANDWRITING_FONTS.map(f => (
                <button
                  key={f.family}
                  type="button"
                  onClick={() => setFont(f.family)}
                  className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${
                    font === f.family ? 'bg-white ring-2 ring-red-500' : 'bg-white hover:bg-[#fbfbfd] ring-1 ring-[#e8e8ed]'
                  }`}
                >
                  <span
                    className="text-[28px] leading-none truncate"
                    style={{ fontFamily: `"${f.family}", cursive`, color: ink }}
                  >
                    {typed.trim() || (kind === 'signature' ? 'Your name' : 'AB')}
                  </span>
                  <span className="text-xs text-[#6e6e73] shrink-0">{f.label}</span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <label className="flex flex-col items-center justify-center gap-2 h-48 bg-white rounded-[22px] border-2 border-dashed border-[#d2d2d7] hover:border-red-400 cursor-pointer text-center px-6">
              {uploaded ? (
                <img src={uploaded.dataUrl} alt={`Your ${noun}`} className="max-h-32 max-w-full object-contain" />
              ) : (
                <>
                  <span className="w-11 h-11 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                    <ImageUp className="w-5 h-5 text-[#6e6e73]" />
                  </span>
                  <span className="text-sm font-medium text-[#1d1d1f]">Upload a photo of your {noun}</span>
                  <span className="text-xs text-[#6e6e73]">Dark ink on white paper works best. The background is removed.</span>
                </>
              )}
              <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={e => handleUpload(e.target.files?.[0])} />
            </label>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </TabsContent>
        </Tabs>

        {tab !== 'upload' && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6e6e73]">Ink</span>
            {INKS.map(option => (
              <button
                key={option.color}
                type="button"
                aria-label={option.label}
                aria-pressed={ink === option.color}
                onClick={() => setInk(option.color)}
                className={`w-6 h-6 rounded-full ring-offset-2 ${ink === option.color ? 'ring-2 ring-red-500' : ''}`}
                style={{ backgroundColor: option.color }}
              />
            ))}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!canSave}>
            Use this {noun}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

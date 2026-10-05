import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, Monitor, Trash2, GripVertical, ImageIcon, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTouchDevice } from '@/hooks/use-touch-device';
import { accent } from '@/lib/scanAccents';

export interface ScanPage {
  id: string;
  file: File;
  previewUrl: string;
}

interface ScanUploaderProps {
  pages: ScanPage[];
  setPages: React.Dispatch<React.SetStateAction<ScanPage[]>>;
  maxPages?: number;
  /** Copy shown on the desktop panel, e.g. "Scan and compress up to 30 pages" */
  desktopHint?: string;
  accentKey?: string;
  onLimitHit?: () => void;
}

/**
 * Page capture for the scanner tools.
 *
 * On a phone this is a camera button: `capture="environment"` asks the OS to
 * open the rear camera directly rather than the file picker, so the user never
 * leaves the page to hunt for a photo. Browsers will not let one tap take
 * twenty photos, so each capture appends to a strip and the user shoots the
 * next page until the document is done.
 *
 * On a desktop there is no camera to reach, so nothing is uploaded from here.
 * The panel shows a QR code pointing at this same URL, which opens the tool on
 * a phone that does have one.
 */
export default function ScanUploader({
  pages, setPages, maxPages = 30, desktopHint, accentKey = 'orange', onLimitHit,
}: ScanUploaderProps) {
  const isTouch = useTouchDevice();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragIndex, setDragIndex] = useState<string | null>(null);
  const a = accent(accentKey);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const images = Array.from(incoming).filter(f => f.type.startsWith('image/'));
    if (images.length === 0) return;

    setPages(prev => {
      const room = maxPages - prev.length;
      if (room <= 0) { onLimitHit?.(); return prev; }
      const added = images.slice(0, room).map(file => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      return [...prev, ...added];
    });

    // Reset so the same page can be captured again straight away.
    if (inputRef.current) inputRef.current.value = '';
  };

  const removePage = (id: string) => setPages(prev => {
    const target = prev.find(p => p.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    return prev.filter(p => p.id !== id);
  });

  const movePage = (fromId: string, toId: string) => setPages(prev => {
    const arr = [...prev];
    const fi = arr.findIndex(x => x.id === fromId);
    const ti = arr.findIndex(x => x.id === toId);
    if (fi < 0 || ti < 0) return prev;
    const [item] = arr.splice(fi, 1);
    arr.splice(ti, 0, item);
    return arr;
  });

  // ── Desktop: no camera, so point the user at their phone ──
  if (!isTouch) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <Monitor className="w-6 h-6 text-gray-400" />
        </div>
        <p className="font-semibold text-gray-700 text-sm">Scanning works on your phone</p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
          {desktopHint || 'Open this page on a phone or tablet to use the camera.'}
        </p>

        <div className="flex justify-center mt-6 p-4 bg-white rounded-2xl border border-gray-200 w-fit mx-auto">
          <QRCodeSVG
            value={typeof window !== 'undefined' ? window.location.href : ''}
            size={168}
            level="M"
            marginSize={1}
          />
        </div>
        <p className="text-xs text-gray-400 mt-3">Point your camera at the code</p>
      </div>
    );
  }

  // ── Phone / tablet: camera capture ──
  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={e => addFiles(e.target.files)}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center transition-all active:scale-[0.99] hover:bg-gray-50"
      >
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <Camera className={`w-7 h-7 ${a.text}`} />
        </div>
        <p className="font-semibold text-gray-700 text-sm">Capture a page</p>
        <p className="text-xs text-gray-400 mt-1">
          Opens your camera · {pages.length} of {maxPages} captured
        </p>
      </button>

      {pages.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {pages.length} page{pages.length > 1 ? 's' : ''} — drag to reorder
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPages([])}
              className="h-7 px-2 text-xs text-gray-400 hover:text-red-500"
            >
              Clear all
            </Button>
          </div>

          {pages.map((p, idx) => (
            <div
              key={p.id}
              draggable
              onDragStart={e => e.dataTransfer.setData('text/plain', p.id)}
              onDragOver={e => { e.preventDefault(); setDragIndex(p.id); }}
              onDragLeave={() => setDragIndex(null)}
              onDrop={e => {
                e.preventDefault();
                movePage(e.dataTransfer.getData('text/plain'), p.id);
                setDragIndex(null);
              }}
              className={`flex items-center gap-3 p-2.5 bg-white border rounded-xl transition-all ${
                dragIndex === p.id ? a.border : 'border-gray-200'
              }`}
            >
              <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
              <img
                src={p.previewUrl}
                alt={`Page ${idx + 1}`}
                className="w-11 h-14 object-cover rounded-lg border border-gray-200 shrink-0 bg-gray-50"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">Page {idx + 1}</p>
                <p className="text-xs text-gray-400">{(p.file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => removePage(p.id)}
                aria-label={`Remove page ${idx + 1}`}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {pages.length === 0 && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ImageIcon className="w-3.5 h-3.5" />
          Take one photo at a time, then capture the next page
        </p>
      )}

      <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-1">
        <ShieldCheck className="w-3.5 h-3.5" />
        Pages are processed securely and never stored
      </p>
    </div>
  );
}

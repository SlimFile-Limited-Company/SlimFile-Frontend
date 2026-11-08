import { PDFDocument, degrees } from 'pdf-lib';
import type { PageViewport } from 'pdfjs-dist';

/** PDFs this size or larger are sent to Compress first: smaller files sign faster in the browser. */
export const LARGE_PDF_BYTES = 15_000_000;

export type FieldKind = 'signature' | 'initials' | 'date' | 'text';

/** A placed field. Position and size are fractions of the page as displayed (rotation applied). */
export interface SignField {
  id: string;
  kind: FieldKind;
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /** PNG data URL of what gets stamped. */
  image: string;
  /** Width / height of the image. */
  aspect: number;
  /** Date and text fields: the words shown. */
  text?: string;
}

export interface Ink {
  dataUrl: string;
  aspect: number;
}

export const HANDWRITING_FONTS = [
  { family: 'Dancing Script', label: 'Classic' },
  { family: 'Great Vibes', label: 'Elegant' },
  { family: 'Caveat', label: 'Casual' },
] as const;

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Dancing+Script:wght@600&family=Great+Vibes&display=swap';

/** Loads the handwriting fonts once; resolves when the requested family can be drawn on a canvas. */
export async function loadHandwritingFont(family: string) {
  if (!document.querySelector(`link[href="${FONTS_HREF}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    document.head.appendChild(link);
  }
  try {
    await document.fonts.load(`64px "${family}"`);
  } catch {
    /* falls back to a cursive system font */
  }
}

/** Crops a canvas to its non-transparent pixels. */
export function trimCanvas(source: HTMLCanvasElement, padding = 8): Ink | null {
  const ctx = source.getContext('2d');
  if (!ctx) return null;
  const { width, height } = source;
  const data = ctx.getImageData(0, 0, width, height).data;
  let top = height, left = width, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (right < 0) return null;
  left = Math.max(0, left - padding);
  top = Math.max(0, top - padding);
  right = Math.min(width - 1, right + padding);
  bottom = Math.min(height - 1, bottom + padding);
  const out = document.createElement('canvas');
  out.width = right - left + 1;
  out.height = bottom - top + 1;
  out.getContext('2d')!.drawImage(source, left, top, out.width, out.height, 0, 0, out.width, out.height);
  return { dataUrl: out.toDataURL('image/png'), aspect: out.width / out.height };
}

/** Draws a line of text into a tight transparent PNG. `fontFamily` is a CSS font-family list. */
export function textToInk(text: string, fontFamily: string, color: string, sizePx = 120): Ink {
  const font = `${sizePx}px ${fontFamily}`;
  const measure = document.createElement('canvas').getContext('2d')!;
  measure.font = font;
  const width = Math.ceil(measure.measureText(text || ' ').width) + sizePx;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = Math.ceil(sizePx * 1.8);
  const ctx = canvas.getContext('2d')!;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, sizePx / 2, canvas.height / 2);
  return trimCanvas(canvas, Math.round(sizePx * 0.08)) ?? { dataUrl: canvas.toDataURL('image/png'), aspect: width / canvas.height };
}

/** Plain text for date and text fields (not handwriting). */
export function plainTextToInk(text: string): Ink {
  return textToInk(text, '-apple-system, "Segoe UI", Helvetica, Arial, sans-serif', '#111111', 96);
}

/** Turns a photo of a signature on paper into a transparent PNG (near-white pixels removed). */
export async function imageFileToInk(file: File): Promise<Ink | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      const lightness = (d[i] + d[i + 1] + d[i + 2]) / 3;
      if (lightness > 200) d[i + 3] = 0;
      else if (lightness > 150) d[i + 3] = Math.round(d[i + 3] * ((200 - lightness) / 50));
    }
    ctx.putImageData(pixels, 0, 0);
    return trimCanvas(canvas);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function todayLabel() {
  return new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
}

export class EncryptedPdfError extends Error {}

/**
 * Stamps every field into the PDF and returns the signed file.
 * `viewports` are pdf.js viewports at scale 1 for each page; they map displayed positions to PDF
 * points, including page rotation and crop box, so rotated scans are signed the right way up.
 */
export async function signPdf(file: File, fields: SignField[], viewports: PageViewport[]): Promise<Blob> {
  let pdf: PDFDocument;
  try {
    pdf = await PDFDocument.load(await file.arrayBuffer());
  } catch (e) {
    if (e instanceof Error && /encrypt/i.test(e.message)) throw new EncryptedPdfError(e.message);
    throw e;
  }
  for (const field of fields) {
    const viewport = viewports[field.page];
    const page = pdf.getPage(field.page);
    const boxW = field.w * viewport.width;
    const boxH = field.h * viewport.height;
    const left = field.x * viewport.width;
    const bottom = (field.y + field.h) * viewport.height;
    const [x, y] = viewport.convertToPdfPoint(left, bottom);
    const image = await pdf.embedPng(field.image);
    page.drawImage(image, { x, y, width: boxW, height: boxH, rotate: degrees(viewport.rotation) });
  }
  const bytes = await pdf.save();
  return new Blob([bytes as BlobPart], { type: 'application/pdf' });
}

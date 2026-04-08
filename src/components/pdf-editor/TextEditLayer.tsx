import { useEffect, useState, useRef } from 'react';
import { usePDFEditor } from '@/contexts/PDFEditorContext';

interface EditableTextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  id: string;
  cssX: number;
  cssY: number;
  cssFontSize: number;
  cssWidth: number;
  cssFontFamily: string;
  cssFontWeight: string;
  cssFontStyle: string;
  cssColor: string;
}

interface TextEditLayerProps {
  pdfPage: any;
  displayScale: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

function parseFontName(raw: string): { family: string; weight: string; style: string } {
  // Strip subset prefix e.g. "ABCDEF+"
  const name = raw.replace(/^[A-Z]{6}\+/, '');
  const lower = name.toLowerCase();

  const weight = /bold|heavy|black/i.test(name) ? 'bold' : 'normal';
  const style = /italic|oblique/i.test(name) ? 'italic' : 'normal';

  let family = 'Arial, sans-serif';
  if (/times|minion|palatino|garamond|georgia|serif/i.test(lower)) family = '"Times New Roman", Times, serif';
  else if (/courier|mono|typewriter/i.test(lower)) family = '"Courier New", Courier, monospace';
  else if (/helvetica/i.test(lower)) family = 'Helvetica, Arial, sans-serif';
  else if (/arial/i.test(lower)) family = 'Arial, Helvetica, sans-serif';
  else if (/verdana/i.test(lower)) family = 'Verdana, sans-serif';
  else if (/tahoma/i.test(lower)) family = 'Tahoma, sans-serif';
  else if (/trebuchet/i.test(lower)) family = '"Trebuchet MS", sans-serif';
  else if (/calibri/i.test(lower)) family = 'Calibri, sans-serif';
  else if (/cambria/i.test(lower)) family = 'Cambria, serif';

  return { family, weight, style };
}

function sampleCanvasColor(
  canvas: HTMLCanvasElement,
  cssX: number,
  cssY: number,
  cssFontSize: number,
): string {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return '#000000';
    const dpr = window.devicePixelRatio || 1;
    // Sample near the vertical center of the text
    const px = Math.round((cssX + 2) * dpr);
    const py = Math.round((cssY - cssFontSize * 0.5) * dpr);
    const d = ctx.getImageData(px, py, 1, 1).data;
    // If pixel is very light (background), fall back to black
    const brightness = (d[0] + d[1] + d[2]) / 3;
    if (brightness > 200) return '#000000';
    return `rgb(${d[0]},${d[1]},${d[2]})`;
  } catch {
    return '#000000';
  }
}

export default function TextEditLayer({
  pdfPage, displayScale, canvasWidth, canvasHeight, canvasRef,
}: TextEditLayerProps) {
  const { addTextEdit, documentState } = usePDFEditor();
  const [textItems, setTextItems] = useState<EditableTextItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pdfPage) return;

    const extractText = async () => {
      try {
        const textContent = await pdfPage.getTextContent();
        const viewport = pdfPage.getViewport({ scale: displayScale });
        const canvas = canvasRef.current;
        const items: EditableTextItem[] = [];

        for (const item of textContent.items) {
          if (!item.str?.trim()) continue;
          const [a, b, , , tx, ty] = item.transform;
          const [cssX, cssY] = viewport.convertToViewportPoint(tx, ty);
          const cssFontSize = Math.sqrt(a * a + b * b) * displayScale;
          const cssWidth = Math.max(item.width * displayScale, cssFontSize * item.str.length * 0.55);

          const { family, weight, style } = parseFontName(item.fontName || '');
          const cssColor = canvas
            ? sampleCanvasColor(canvas, cssX, cssY, cssFontSize)
            : '#000000';

          items.push({
            str: item.str,
            transform: item.transform,
            width: item.width,
            height: item.height || cssFontSize,
            id: `text-${tx}-${ty}-${item.str.slice(0, 8)}`,
            cssX,
            cssY,
            cssFontSize,
            cssWidth,
            cssFontFamily: family,
            cssFontWeight: weight,
            cssFontStyle: style,
            cssColor,
          });
        }
        setTextItems(items);
      } catch (err) {
        console.error('[TextEditLayer] Failed to extract text:', err);
      }
    };

    extractText();
  }, [pdfPage, displayScale]);

  const startEdit = (item: EditableTextItem) => {
    setEditingId(item.id);
    setEditValue(item.str);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);
  };

  const commitEdit = (item: EditableTextItem) => {
    const trimmed = editValue.trim();
    if (trimmed !== '' && editValue !== item.str) {
      const [a, b, , , tx, ty] = item.transform;
      const fontSize = Math.sqrt(a * a + b * b);

      addTextEdit({
        pageNumber: documentState.currentPage,
        originalText: item.str,
        newText: editValue,
        pdfX: tx,
        pdfY: ty,
        pdfWidth: item.width,
        pdfHeight: item.height || fontSize * 1.2,
        fontSize,
      });

      setTextItems(prev => prev.map(t => t.id === item.id ? { ...t, str: editValue } : t));
    }
    setEditingId(null);
  };

  return (
    <div
      className="absolute top-0 left-0"
      style={{ width: canvasWidth, height: canvasHeight, pointerEvents: 'auto', zIndex: 20, cursor: 'text' }}
    >
      {textItems.map((item) => {
        const isEditing = editingId === item.id;
        const top = item.cssY - item.cssFontSize;

        return (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: item.cssX,
              top,
              width: item.cssWidth + 4,
              height: item.cssFontSize * 1.4,
              cursor: 'text',
              zIndex: isEditing ? 30 : 20,
            }}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => commitEdit(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit(item);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  fontSize: item.cssFontSize,
                  fontFamily: item.cssFontFamily,
                  fontWeight: item.cssFontWeight,
                  fontStyle: item.cssFontStyle,
                  color: item.cssColor,
                  caretColor: item.cssColor,
                  border: 'none',
                  background: 'transparent',
                  padding: '0 2px',
                  outline: 'none',
                  lineHeight: 1,
                  boxSizing: 'border-box',
                }}
              />
            ) : (
              <div
                onClick={() => startEdit(item)}
                style={{ width: '100%', height: '100%', background: 'transparent', borderRadius: 2 }}
                className="hover:bg-blue-200/30 hover:outline hover:outline-1 hover:outline-blue-400"
                title={`Click to edit: "${item.str}"`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

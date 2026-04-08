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
}

interface TextEditLayerProps {
  pdfPage: any;
  displayScale: number;
  canvasWidth: number;
  canvasHeight: number;
}

function parseFontName(raw: string): { family: string; weight: string; style: string } {
  const name = raw.replace(/^[A-Z]{6}\+/, '');
  const weight = /bold|heavy|black/i.test(name) ? 'bold' : 'normal';
  const style = /italic|oblique/i.test(name) ? 'italic' : 'normal';
  let family = 'Arial, sans-serif';
  if (/times|minion|palatino|garamond|georgia/i.test(name)) family = '"Times New Roman", Times, serif';
  else if (/courier|mono|typewriter/i.test(name)) family = '"Courier New", Courier, monospace';
  else if (/helvetica/i.test(name)) family = 'Helvetica, Arial, sans-serif';
  else if (/calibri/i.test(name)) family = 'Calibri, sans-serif';
  else if (/cambria/i.test(name)) family = 'Cambria, serif';
  else if (/verdana/i.test(name)) family = 'Verdana, sans-serif';
  return { family, weight, style };
}

export default function TextEditLayer({ pdfPage, displayScale, canvasWidth, canvasHeight }: TextEditLayerProps) {
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
        const items: EditableTextItem[] = [];

        for (const item of textContent.items) {
          if (!item.str?.trim()) continue;
          const [a, b, , , tx, ty] = item.transform;
          const [cssX, cssY] = viewport.convertToViewportPoint(tx, ty);
          const cssFontSize = Math.sqrt(a * a + b * b) * displayScale;
          const cssWidth = Math.max(item.width * displayScale, cssFontSize * item.str.length * 0.6);
          const { family, weight, style } = parseFontName(item.fontName || '');

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
    }, 30);
  };

  const commitEdit = (item: EditableTextItem) => {
    if (editValue !== item.str) {
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

  const sharedFont = (item: EditableTextItem) => ({
    fontSize: item.cssFontSize,
    fontFamily: item.cssFontFamily,
    fontWeight: item.cssFontWeight,
    fontStyle: item.cssFontStyle,
    lineHeight: `${item.cssFontSize * 1.2}px`,
  });

  return (
    <div
      className="absolute top-0 left-0"
      style={{ width: canvasWidth, height: canvasHeight, pointerEvents: 'auto', zIndex: 20 }}
    >
      {textItems.map((item) => {
        const isEditing = editingId === item.id;
        const top = item.cssY - item.cssFontSize;
        const boxH = item.cssFontSize * 1.4;

        return (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: item.cssX,
              top,
              width: item.cssWidth + 6,
              height: boxH,
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
                  if (e.key === 'Enter') { e.preventDefault(); commitEdit(item); }
                  if (e.key === 'Escape') setEditingId(null);
                }}
                style={{
                  ...sharedFont(item),
                  width: '100%',
                  height: '100%',
                  color: '#000',
                  background: '#fff',
                  border: '1.5px solid #60a5fa',
                  borderRadius: 2,
                  padding: '0 3px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            ) : (
              <div
                onClick={() => startEdit(item)}
                style={{
                  width: '100%',
                  height: '100%',
                  cursor: 'text',
                  background: 'transparent',
                  borderRadius: 2,
                }}
                className="group hover:bg-blue-100/40 hover:outline hover:outline-1 hover:outline-blue-400"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

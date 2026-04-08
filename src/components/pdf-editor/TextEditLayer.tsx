import { useEffect, useState, useRef } from 'react';
import { usePDFEditor } from '@/contexts/PDFEditorContext';

interface TextItem {
  str: string;
  transform: number[]; // [a, b, c, d, tx, ty]
  width: number;
  height: number;
  fontName: string;
  id: string;
}

interface EditableTextItem extends TextItem {
  cssX: number;
  cssY: number;
  cssFontSize: number;
  cssWidth: number;
}

interface TextEditLayerProps {
  pdfPage: any;
  displayScale: number;
  canvasWidth: number;
  canvasHeight: number;
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
          const cssWidth = Math.max(item.width * displayScale, cssFontSize * item.str.length * 0.55);

          items.push({
            str: item.str,
            transform: item.transform,
            width: item.width,
            height: item.height || cssFontSize,
            fontName: item.fontName || 'Arial',
            id: `text-${tx}-${ty}-${item.str.slice(0, 8)}`,
            cssX,
            cssY,
            cssFontSize,
            cssWidth,
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
    if (editValue !== item.str && editValue.trim() !== '') {
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
      style={{
        width: canvasWidth,
        height: canvasHeight,
        pointerEvents: 'auto',
        zIndex: 20,
        cursor: 'text',
      }}
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
                  fontFamily: 'Arial, sans-serif',
                  border: '1px solid #3b82f6',
                  background: 'white',
                  padding: '0 2px',
                  outline: 'none',
                  lineHeight: 1,
                  boxSizing: 'border-box',
                  borderRadius: 2,
                }}
              />
            ) : (
              <div
                onClick={() => startEdit(item)}
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                  borderRadius: 2,
                  transition: 'background 0.1s',
                }}
                className="hover:bg-blue-200/40 hover:outline hover:outline-1 hover:outline-blue-400"
                title={`Click to edit: "${item.str}"`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

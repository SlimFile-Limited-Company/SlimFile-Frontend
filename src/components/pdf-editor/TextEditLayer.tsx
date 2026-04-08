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
  pdfPage: any; // pdf.js page object
  displayScale: number; // the CSS-pixel scale (not dpr-scaled)
  canvasWidth: number;
  canvasHeight: number;
}

export default function TextEditLayer({ pdfPage, displayScale, canvasWidth, canvasHeight }: TextEditLayerProps) {
  const { editState, addTextEdit, documentState } = usePDFEditor();
  const [textItems, setTextItems] = useState<EditableTextItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isTextMode = editState.selectedTool === 'text';

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
          // Convert PDF coordinates to CSS pixel coordinates
          const [cssX, cssY] = viewport.convertToViewportPoint(tx, ty);
          // Font size from transform scale
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
    if (!isTextMode) return;
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
      const fontSize = Math.sqrt(a * a + b * b); // PDF points

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

      // Update the displayed text immediately
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
        pointerEvents: isTextMode ? 'auto' : 'none',
        zIndex: isTextMode ? 20 : 5,
        cursor: isTextMode ? 'text' : 'default',
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
              cursor: isTextMode ? 'text' : 'default',
              zIndex: isEditing ? 20 : 10,
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
                  // Transparent by default — PDF canvas text shows through
                  // Blue tint on hover to show it's editable
                  background: 'transparent',
                  borderRadius: 2,
                  transition: 'background 0.1s',
                }}
                className={isTextMode ? 'hover:bg-blue-200/40 hover:outline hover:outline-1 hover:outline-blue-400' : ''}
                title={isTextMode ? `Click to edit: "${item.str}"` : ''}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

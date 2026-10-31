import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TableRow as DocxTableRow, TableCell as DocxTableCell, Table as DocxTable, WidthType, BorderStyle, UnderlineType } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Word (.docx) export for SlimFile Documents. Converts the editor's HTML
 * into docx paragraphs, keeping headings, emphasis, lists, quotes, code,
 * links, rules and tables.
 */
const parseHtmlToDocxChildren = (html: string): (Paragraph | DocxTable)[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const children: (Paragraph | DocxTable)[] = [];

  const getAlignment = (el: HTMLElement): (typeof AlignmentType)[keyof typeof AlignmentType] | undefined => {
    const align = el.style?.textAlign;
    if (align === 'center') return AlignmentType.CENTER;
    if (align === 'right') return AlignmentType.RIGHT;
    if (align === 'justify') return AlignmentType.JUSTIFIED;
    return undefined;
  };

  const extractTextRuns = (node: Node, inherited: { bold?: boolean; italic?: boolean; underline?: boolean; strike?: boolean; code?: boolean; color?: string; highlight?: string } = {}): TextRun[] => {
    const runs: TextRun[] = [];

    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || '';
        if (text) {
          runs.push(new TextRun({
            text,
            bold: inherited.bold,
            italics: inherited.italic,
            underline: inherited.underline ? { type: UnderlineType.SINGLE } : undefined,
            strike: inherited.strike,
            font: inherited.code ? 'Courier New' : undefined,
            color: inherited.color?.replace('#', ''),
            highlight: inherited.highlight === '#fef08a' ? 'yellow' : undefined,
          }));
        }
        return;
      }

      if (child.nodeType !== Node.ELEMENT_NODE) return;
      const el = child as HTMLElement;
      const tag = el.tagName.toLowerCase();

      const next = { ...inherited };
      if (tag === 'strong' || tag === 'b') next.bold = true;
      if (tag === 'em' || tag === 'i') next.italic = true;
      if (tag === 'u') next.underline = true;
      if (tag === 's' || tag === 'del') next.strike = true;
      if (tag === 'code') next.code = true;
      if (tag === 'mark') next.highlight = el.style?.backgroundColor || '#fef08a';
      if (el.style?.color) next.color = el.style.color;

      if (tag === 'br') {
        runs.push(new TextRun({ break: 1 }));
        return;
      }

      if (tag === 'a') {
        const text = el.textContent || '';
        runs.push(new TextRun({
          text,
          color: '2563EB',
          underline: { type: UnderlineType.SINGLE },
          bold: inherited.bold,
          italics: inherited.italic,
        }));
        return;
      }

      runs.push(...extractTextRuns(el, next));
    });

    return runs;
  };

  const processElement = (el: Element) => {
    const tag = el.tagName.toLowerCase();
    const htmlEl = el as HTMLElement;

    if (tag === 'h1') {
      children.push(new Paragraph({
        children: extractTextRuns(el, { bold: true }),
        heading: HeadingLevel.HEADING_1,
        alignment: getAlignment(htmlEl),
      }));
    } else if (tag === 'h2') {
      children.push(new Paragraph({
        children: extractTextRuns(el, { bold: true }),
        heading: HeadingLevel.HEADING_2,
        alignment: getAlignment(htmlEl),
      }));
    } else if (tag === 'h3') {
      children.push(new Paragraph({
        children: extractTextRuns(el, { bold: true }),
        heading: HeadingLevel.HEADING_3,
        alignment: getAlignment(htmlEl),
      }));
    } else if (tag === 'p') {
      const runs = extractTextRuns(el);
      children.push(new Paragraph({
        children: runs.length > 0 ? runs : [new TextRun('')],
        alignment: getAlignment(htmlEl),
      }));
    } else if (tag === 'blockquote') {
      el.querySelectorAll('p').forEach(p => {
        children.push(new Paragraph({
          children: extractTextRuns(p, { italic: true }),
          indent: { left: 720 },
          alignment: getAlignment(htmlEl),
        }));
      });
      if (el.querySelectorAll('p').length === 0) {
        children.push(new Paragraph({
          children: extractTextRuns(el, { italic: true }),
          indent: { left: 720 },
        }));
      }
    } else if (tag === 'ul' || tag === 'ol') {
      const items = el.querySelectorAll(':scope > li');
      items.forEach((li, idx) => {
        children.push(new Paragraph({
          children: extractTextRuns(li),
          bullet: tag === 'ul' ? { level: 0 } : undefined,
          numbering: tag === 'ol' ? { reference: 'default-numbering', level: 0 } : undefined,
        }));
      });
    } else if (tag === 'pre') {
      const code = el.querySelector('code');
      const text = (code || el).textContent || '';
      text.split('\n').forEach(line => {
        children.push(new Paragraph({
          children: [new TextRun({ text: line, font: 'Courier New', size: 20 })],
        }));
      });
    } else if (tag === 'hr') {
      children.push(new Paragraph({
        children: [new TextRun('')],
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'E5E7EB' } },
      }));
    } else if (tag === 'table') {
      try {
        const rows = Array.from(el.querySelectorAll('tr'));
        const docxRows = rows.map(tr => {
          const cells = Array.from(tr.querySelectorAll('td, th'));
          return new DocxTableRow({
            children: cells.map(cell => {
              return new DocxTableCell({
                children: [new Paragraph({
                  children: extractTextRuns(cell, { bold: cell.tagName.toLowerCase() === 'th' }),
                })],
                width: { size: 100 / Math.max(cells.length, 1), type: WidthType.PERCENTAGE },
              });
            }),
          });
        });
        if (docxRows.length > 0) {
          children.push(new DocxTable({ rows: docxRows }));
        }
      } catch (e) {
        console.error('Error converting table:', e);
      }
    } else {
      // Fallback for other elements
      const runs = extractTextRuns(el);
      if (runs.length > 0) {
        children.push(new Paragraph({ children: runs }));
      }
    }
  };

  // Process top-level elements
  doc.body.childNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      processElement(node as Element);
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      children.push(new Paragraph({
        children: [new TextRun(node.textContent)],
      }));
    }
  });

  return children;
};

export async function exportHtmlToDocx(html: string, title: string) {
  const doc = new Document({
    numbering: {
      config: [{
        reference: 'default-numbering',
        levels: [{ level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.LEFT }],
      }],
    },
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: title, heading: HeadingLevel.TITLE }),
        ...parseHtmlToDocxChildren(html),
      ],
    }],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title || 'document'}.docx`);
}

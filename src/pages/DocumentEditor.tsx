import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import type { PartialBlock } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import mammoth from 'mammoth';
import { ChevronLeft, Download, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportHtmlToDocx } from '@/lib/docxExport';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

// Images are stored inside the document, which MongoDB caps at 16 MB.
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_DOC_BYTES = 12 * 1024 * 1024;
const SAVE_DELAY_MS = 1200;

type SaveState = 'saved' | 'saving' | 'unsaved' | 'error';

interface LoadedDocument {
  title: string;
  content: string;
  blocks: PartialBlock[] | null;
  tags: string[];
}

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
  'Content-Type': 'application/json',
});

const fileToDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * Loads the document, then hands it to the editor. The editor is created only
 * after loading so BlockNote starts with the right content.
 */
const DocumentEditor = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doc, setDoc] = useState<LoadedDocument | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/documents/${documentId}`, { headers: authHeaders(), cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load document');
        const { document } = await res.json();
        setDoc({
          title: document.title || '',
          content: document.content || '',
          blocks: Array.isArray(document.blocks) && document.blocks.length ? document.blocks : null,
          tags: document.tags || [],
        });
      } catch (err) {
        console.error('Error loading document:', err);
        setFailed(true);
        toast({ title: 'Error', description: 'Failed to load document', variant: 'destructive' });
      }
    };
    load();
  }, [documentId]);

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-12">
      {doc ? (
        <Editor documentId={documentId!} initial={doc} onBack={() => navigate('/documents')} />
      ) : (
        <div className="h-[60vh] flex items-center justify-center text-[#6e6e73]">
          {failed ? (
            <button onClick={() => navigate('/documents')} className="text-[15px] text-red-600 hover:text-red-700">
              Couldn't open this document. Back to Documents
            </button>
          ) : (
            <Loader2 className="w-5 h-5 animate-spin" />
          )}
        </div>
      )}
    </div>
  );
};

const Editor = ({ documentId, initial, onBack }: { documentId: string; initial: LoadedDocument; onBack: () => void }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(initial.title);
  const [tags, setTags] = useState(initial.tags.join(', '));
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [wordCount, setWordCount] = useState(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const ready = useRef(false);

  const editor = useCreateBlockNote({
    initialContent: initial.blocks ?? undefined,
    uploadFile: async (file: File) => {
      if (file.size > MAX_IMAGE_BYTES) {
        toast({ title: 'Image too large', description: 'Images must be 2 MB or smaller.', variant: 'destructive' });
        throw new Error('Image too large');
      }
      return fileToDataURL(file);
    },
  });

  // Documents written before BlockNote only have HTML. Convert it once.
  useEffect(() => {
    if (!initial.blocks && initial.content) {
      const blocks = editor.tryParseHTMLToBlocks(initial.content);
      if (blocks.length) editor.replaceBlocks(editor.document, blocks);
    }
    setWordCount(countWords(editor.blocksToHTMLLossy(editor.document)));
    // Ignore the change events fired while the content is first put in place.
    setTimeout(() => { ready.current = true; }, 0);
  }, [editor]);

  const save = useCallback(async () => {
    const html = editor.blocksToHTMLLossy(editor.document);
    const body = JSON.stringify({
      title: title.trim() || 'Untitled Document',
      content: html,
      blocks: editor.document,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    if (body.length > MAX_DOC_BYTES) {
      setSaveState('error');
      toast({ title: 'Document too large to save', description: 'Remove some images, then it will save again.', variant: 'destructive' });
      return;
    }
    setSaveState('saving');
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${documentId}`, { method: 'PATCH', headers: authHeaders(), body });
      if (!res.ok) throw new Error('Failed to save document');
      setSaveState('saved');
    } catch (err) {
      console.error('Error saving document:', err);
      setSaveState('error');
    }
  }, [editor, documentId, title, tags, toast]);

  const scheduleSave = useCallback(() => {
    setSaveState('unsaved');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(), SAVE_DELAY_MS);
  }, [save]);

  // Title and tag edits save too, once they differ from what was loaded.
  const initialTags = initial.tags.join(', ');
  useEffect(() => {
    if (title === initial.title && tags === initialTags) return;
    scheduleSave();
  }, [title, tags]);

  // Save anything pending when leaving.
  useEffect(() => () => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); save(); }
  }, [save]);

  const handleChange = () => {
    if (!ready.current) return;
    setWordCount(countWords(editor.blocksToHTMLLossy(editor.document)));
    scheduleSave();
  };

  const importWord = async (file: File) => {
    try {
      const { value } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
      editor.replaceBlocks(editor.document, editor.tryParseHTMLToBlocks(value));
      toast({ title: 'Imported', description: `"${file.name}" was added to this document.` });
    } catch (err) {
      console.error('Error importing DOCX:', err);
      toast({ title: 'Error', description: 'Failed to import that Word file', variant: 'destructive' });
    }
  };

  const exportWord = async () => {
    try {
      await exportHtmlToDocx(editor.blocksToHTMLLossy(editor.document), title || 'Untitled Document');
    } catch (err) {
      console.error('Error exporting DOCX:', err);
      toast({ title: 'Error', description: 'Failed to export document', variant: 'destructive' });
    }
  };

  const statusText = { saved: 'Saved', saving: 'Saving…', unsaved: 'Editing', error: 'Not saved' }[saveState];

  return (
    <>
      {/* Document bar, styled like the site header */}
      <div className="sticky top-12 z-20 h-12 flex items-center gap-3 px-3 sm:px-4 border-b border-black/[0.06] bg-[#fbfbfd]/80 backdrop-blur-xl backdrop-saturate-150">
        <button onClick={onBack} className="flex items-center gap-0.5 text-[13px] text-red-600 hover:text-red-700 shrink-0">
          <ChevronLeft className="w-4 h-4" />
          Documents
        </button>
        <p className="flex-1 min-w-0 text-center truncate text-[13px] font-semibold text-[#1d1d1f]">
          {title || 'Untitled Document'}
        </p>
        <span className={`hidden sm:inline text-xs w-[4.5rem] text-right ${saveState === 'error' ? 'text-red-600' : 'text-[#6e6e73]'}`}>
          {statusText}
        </span>
        <input
          ref={fileInput}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) importWord(f); e.target.value = ''; }}
        />
        <button
          onClick={() => fileInput.current?.click()}
          title="Import a Word document"
          className="flex items-center gap-1.5 h-8 px-3 rounded-full text-[13px] text-[#1d1d1f] hover:bg-black/[0.05]"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Import</span>
        </button>
        <button
          onClick={exportWord}
          title="Download as a Word document"
          className="flex items-center gap-1.5 h-8 px-3 rounded-full text-[13px] text-white bg-red-600 hover:bg-red-700"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export to Word</span>
        </button>
      </div>

      {/* Page */}
      <div className="px-3 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-[22px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-2 sm:px-6 py-10 sm:py-14 min-h-[70vh]">
          <div className="px-[54px] mb-6">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Untitled Document"
              className="w-full text-3xl sm:text-[40px] font-semibold tracking-tight text-[#1d1d1f] placeholder:text-[#d2d2d7] bg-transparent focus:outline-none"
            />
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Add tags, separated by commas"
              className="mt-2 w-full text-[13px] text-[#6e6e73] placeholder:text-[#d2d2d7] bg-transparent focus:outline-none"
            />
          </div>
          <BlockNoteView editor={editor} theme="light" onChange={handleChange} />
        </div>
        <p className="max-w-3xl mx-auto mt-3 text-right text-xs text-[#6e6e73]">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </p>
      </div>
    </>
  );
};

const countWords = (html: string) => {
  const text = html.replace(/<[^>]*>/g, ' ');
  return text.split(/\s+/).filter(Boolean).length;
};

export default DocumentEditor;

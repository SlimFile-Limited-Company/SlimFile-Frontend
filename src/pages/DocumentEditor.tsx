import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Save,
  Download,
  Upload,
  Loader2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  FileType
} from 'lucide-react';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import '../styles/editor.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface DocumentData {
  _id: string;
  title: string;
  content: string;
  folder?: string;
  tags: string[];
  wordCount?: number;
  pageCount?: number;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const DocumentEditor = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [lastSaveTime, setLastSaveTime] = useState<number>(Date.now());
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[600px] p-8',
      },
    },
    onUpdate: ({ editor }) => {
      // Update word count as user types
      const text = editor.getText();
      const words = text.split(/\s+/).filter(word => word.length > 0).length;
      setWordCount(words);
      setPageCount(Math.max(1, Math.ceil(words / 500)));
    },
  });

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  // Auto-save every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastSaveTime > 15000) {
        saveDocument(true);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [title, lastSaveTime]);

  const loadDocument = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to load document');

      const data = await response.json();
      setDocument(data.document);
      setTitle(data.document.title || '');
      setTags(data.document.tags?.join(', ') || '');
      setWordCount(data.document.wordCount || 0);
      setPageCount(data.document.pageCount || 1);

      if (editor) {
        editor.commands.setContent(data.document.content || '');
      }
    } catch (error) {
      console.error('Error loading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to load document',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDocument = useCallback(
    async (isAutoSave = false) => {
      if (!editor) return;

      try {
        if (!isAutoSave) setIsSaving(true);

        const htmlContent = editor.getHTML();
        const token = localStorage.getItem('jwt');

        const tagArray = tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

        const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content: htmlContent,
            tags: tagArray,
          }),
        });

        if (!response.ok) throw new Error('Failed to save document');

        setLastSaveTime(Date.now());

        if (!isAutoSave) {
          toast({
            title: 'Saved',
            description: 'Document saved successfully',
          });
        }
      } catch (error) {
        console.error('Error saving document:', error);
        if (!isAutoSave) {
          toast({
            title: 'Error',
            description: 'Failed to save document',
            variant: 'destructive',
          });
        }
      } finally {
        if (!isAutoSave) setIsSaving(false);
      }
    },
    [documentId, title, tags, editor, toast]
  );

  const exportToDocx = async () => {
    if (!editor) return;

    try {
      const htmlContent = editor.getHTML();
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: title,
                heading: HeadingLevel.TITLE,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: htmlContent.replace(/<[^>]*>/g, ''),
                  }),
                ],
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${title || 'document'}.docx`);

      toast({
        title: 'Exported',
        description: 'Document exported as DOCX',
      });
    } catch (error) {
      console.error('Error exporting to DOCX:', error);
      toast({
        title: 'Error',
        description: 'Failed to export document',
        variant: 'destructive',
      });
    }
  };

  const importFromDocx = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

      if (editor) {
        editor.commands.setContent(result.value);
      }

      toast({
        title: 'Imported',
        description: 'DOCX file imported successfully',
      });
    } catch (error) {
      console.error('Error importing DOCX:', error);
      toast({
        title: 'Error',
        description: 'Failed to import DOCX file',
        variant: 'destructive',
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      importFromDocx(file);
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  };

  if (isLoading || !editor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 py-3">
          {/* Top Row */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/documents')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Back</span>
              </Button>

              <FileType className="w-5 h-5 text-blue-600 hidden sm:block" />

              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Document"
                className="font-semibold text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-600 mr-2">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
              </div>

              <input
                type="file"
                accept=".docx"
                onChange={handleFileUpload}
                className="hidden"
                id="docx-upload"
              />
              <label htmlFor="docx-upload">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 hover:bg-gray-50"
                  asChild
                >
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Import</span>
                  </span>
                </Button>
              </label>

              <Button
                variant="outline"
                size="sm"
                onClick={exportToDocx}
                className="hidden sm:flex border-gray-200 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button
                size="sm"
                onClick={() => saveDocument(false)}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline ml-2">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Save</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 flex-wrap pb-2 border-b border-gray-100">
            <Button
              variant={editor.isActive('bold') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`w-8 h-8 p-0 ${editor.isActive('bold') ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive('italic') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`w-8 h-8 p-0 ${editor.isActive('italic') ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive('underline') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`w-8 h-8 p-0 ${editor.isActive('underline') ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive('strike') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`w-8 h-8 p-0 ${editor.isActive('strike') ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <Button
              variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`w-8 h-8 p-0 ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`w-8 h-8 p-0 ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`w-8 h-8 p-0 ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <Button
              variant={editor.isActive('bulletList') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`w-8 h-8 p-0 ${editor.isActive('bulletList') ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive('orderedList') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`w-8 h-8 p-0 ${editor.isActive('orderedList') ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <Button
              variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`w-8 h-8 p-0 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`w-8 h-8 p-0 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`w-8 h-8 p-0 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`w-8 h-8 p-0 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <Button
              variant="outline"
              size="sm"
              onClick={addLink}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addImage}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Insert Image"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addTable}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Insert Table"
            >
              <TableIcon className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <Button
              variant={editor.isActive('blockquote') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`w-8 h-8 p-0 ${editor.isActive('blockquote') ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive('code') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`w-8 h-8 p-0 ${editor.isActive('code') ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}
              title="Code"
            >
              <Code className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Horizontal Line"
            >
              <Minus className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          {/* Tags */}
          <div className="mt-2">
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="text-sm border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;

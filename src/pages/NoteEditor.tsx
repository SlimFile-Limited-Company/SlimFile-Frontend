import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Save,
  Download,
  Loader2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  Quote,
  Minus,
  FileText
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface NoteData {
  _id: string;
  title: string;
  content: string;
  folder?: string;
  tags: string[];
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

type FormatType = 'bold' | 'italic' | 'h1' | 'h2' | 'ul' | 'ol' | 'code' | 'quote';

const NoteEditor = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [note, setNote] = useState<NoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const contentRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    loadNote();
  }, [noteId]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setInterval(() => {
      if (Date.now() - lastSaveTimeRef.current > 10000) {
        saveNote(true);
      }
    }, 10000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [title, content]);

  const loadNote = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(
        `${API_BASE_URL}/my-notes/${noteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to load note');

      const data = await response.json();
      setNote(data.note);
      setTitle(data.note.title || '');
      setContent(data.note.content || '');
      setTags(data.note.tags?.join(', ') || '');

      if (contentRef.current) {
        contentRef.current.innerHTML = data.note.content || '';
      }
    } catch (error) {
      console.error('Error loading note:', error);
      toast({
        title: 'Error',
        description: 'Failed to load note',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveNote = useCallback(async (isAutoSave = false) => {
    if (!contentRef.current) return;

    try {
      if (!isAutoSave) setIsSaving(true);

      const htmlContent = contentRef.current.innerHTML;
      const token = localStorage.getItem('jwt');

      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await fetch(
        `${API_BASE_URL}/my-notes/${noteId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content: htmlContent,
            tags: tagArray
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to save note');

      lastSaveTimeRef.current = Date.now();

      if (!isAutoSave) {
        toast({
          title: 'Saved',
          description: 'Note saved successfully',
        });
      }
    } catch (error) {
      console.error('Error saving note:', error);
      if (!isAutoSave) {
        toast({
          title: 'Error',
          description: 'Failed to save note',
          variant: 'destructive',
        });
      }
    } finally {
      if (!isAutoSave) setIsSaving(false);
    }
  }, [noteId, title, tags, toast]);

  const applyFormat = (format: FormatType) => {
    document.execCommand(format === 'h1' ? 'formatBlock' : format === 'h2' ? 'formatBlock' : format, false,
      format === 'h1' ? 'h1' : format === 'h2' ? 'h2' : undefined);

    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  const exportNote = () => {
    if (!contentRef.current) return;

    try {
      const element = document.createElement('a');
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { font-size: 2em; margin-bottom: 0.5em; }
    h2 { font-size: 1.5em; margin-top: 1em; margin-bottom: 0.5em; }
    p { margin-bottom: 1em; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    blockquote { border-left: 4px solid #ddd; padding-left: 16px; margin-left: 0; color: #666; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${contentRef.current.innerHTML}
</body>
</html>`;

      const file = new Blob([htmlContent], { type: 'text/html' });
      element.href = URL.createObjectURL(file);
      element.download = `${title || 'note'}.html`;
      element.click();

      toast({
        title: 'Exported',
        description: 'Note exported as HTML',
      });
    } catch (error) {
      console.error('Error exporting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to export note',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 py-3">
          {/* Top row */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/my-notes')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Back</span>
              </Button>

              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Note"
                className="font-semibold text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportNote}
                className="hidden sm:flex border-gray-200 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button
                size="sm"
                onClick={() => saveNote(false)}
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

          {/* Toolbar */}
          <div className="flex items-center gap-1 flex-wrap pb-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormat('bold')}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormat('italic')}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormat('h1')}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormat('h2')}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <Button
              variant="outline"
              size="sm"
              onClick={() => document.execCommand('insertUnorderedList')}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.execCommand('insertOrderedList')}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <Button
              variant="outline"
              size="sm"
              onClick={() => document.execCommand('formatBlock', false, 'blockquote')}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.execCommand('insertHorizontalRule')}
              className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-100"
              title="Divider"
            >
              <Minus className="w-4 h-4" />
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

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div
            ref={contentRef}
            contentEditable
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
            className="min-h-[600px] bg-white rounded-lg border border-gray-200 p-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent prose prose-sm sm:prose max-w-none"
            style={{
              fontSize: '16px',
              lineHeight: '1.7',
            }}
            data-placeholder="Start writing..."
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;

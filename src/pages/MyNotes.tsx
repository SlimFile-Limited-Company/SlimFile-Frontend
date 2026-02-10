import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  FileText,
  Search,
  Clock,
  FolderOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface Note {
  _id: string;
  title: string;
  content: string;
  preview: string;
  createdBy: {
    _id: string;
    name: string;
    picture?: string;
  };
  folder?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const MyNotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}/my-notes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch notes');

      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async () => {
    try {
      setIsCreating(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}/my-notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Untitled Note',
          content: ''
        })
      });

      if (!response.ok) throw new Error('Failed to create note');

      const data = await response.json();
      toast({
        title: 'Note created',
        description: 'Your new note is ready',
      });

      navigate(`/my-notes/${data.note._id}`);
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: 'Error',
        description: 'Failed to create note',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(
        `${API_BASE_URL}/my-notes/${noteId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to delete note');

      toast({
        title: 'Note deleted',
        description: 'The note has been removed',
      });

      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.preview?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="px-2 sm:px-3 hover:bg-white">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                My Notes
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Create, organize, and manage your notes
              </p>
            </div>

            <Button
              onClick={createNote}
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto shadow-sm"
              size="sm"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  New Note
                </>
              )}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Notes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card className="text-center py-16 border-gray-200 bg-white">
            <CardContent>
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Create your first note to start organizing your thoughts and ideas'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={createNote}
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Note
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map((note) => (
              <Card
                key={note._id}
                className="hover:shadow-md transition-all cursor-pointer group border-gray-200 bg-white"
                onClick={() => navigate(`/my-notes/${note._id}`)}
              >
                <CardContent className="p-4">
                  {/* Note Content */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2 truncate text-base">
                      {note.title || 'Untitled Note'}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px]">
                      {note.preview || note.content || 'No content yet...'}
                    </p>
                  </div>

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 2 && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          +{note.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {note.folder && (
                      <div className="flex items-center gap-1">
                        <FolderOpen className="w-3 h-3" />
                        <span className="truncate max-w-[80px]">{note.folder}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/my-notes/${note._id}`);
                      }}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs border-gray-200 hover:bg-gray-50"
                    >
                      Open
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note._id);
                      }}
                      size="sm"
                      variant="outline"
                      className="border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNotes;

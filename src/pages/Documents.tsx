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
  FolderOpen,
  FileType
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface Document {
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
  wordCount?: number;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
}

const Documents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch documents');

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDocument = async () => {
    try {
      setIsCreating(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Untitled Document',
          content: ''
        })
      });

      if (!response.ok) throw new Error('Failed to create document');

      const data = await response.json();
      toast({
        title: 'Document created',
        description: 'Your new document is ready',
      });

      navigate(`/documents/${data.document._id}`);
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: 'Error',
        description: 'Failed to create document',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(
        `${API_BASE_URL}/documents/${documentId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to delete document');

      toast({
        title: 'Document deleted',
        description: 'The document has been removed',
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.preview?.toLowerCase().includes(searchQuery.toLowerCase())
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
                <FileType className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                My Documents
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Create, edit, and manage your documents with a professional word processor
              </p>
            </div>

            <Button
              onClick={createDocument}
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
                  New Document
                </>
              )}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Documents Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="text-center py-16 border-gray-200 bg-white">
            <CardContent>
              <FileType className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No documents found' : 'No documents yet'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Create your first document to start writing with our professional word processor'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={createDocument}
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Document
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc._id}
                className="hover:shadow-md transition-all cursor-pointer group border-gray-200 bg-white"
                onClick={() => navigate(`/documents/${doc._id}`)}
              >
                <CardContent className="p-4">
                  {/* Document Icon & Info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate text-base">
                        {doc.title || 'Untitled Document'}
                      </h3>
                      {doc.wordCount !== undefined && (
                        <p className="text-xs text-gray-500">
                          {doc.wordCount} words • {doc.pageCount || 1} {doc.pageCount === 1 ? 'page' : 'pages'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preview */}
                  <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] mb-3">
                    {doc.preview || doc.content || 'Start writing...'}
                  </p>

                  {/* Tags */}
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {doc.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length > 2 && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          +{doc.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {doc.folder && (
                      <div className="flex items-center gap-1">
                        <FolderOpen className="w-3 h-3" />
                        <span className="truncate max-w-[80px]">{doc.folder}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/documents/${doc._id}`);
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
                        deleteDocument(doc._id);
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

export default Documents;

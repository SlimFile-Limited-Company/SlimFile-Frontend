import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Presentation
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface Whiteboard {
  _id: string;
  name: string;
  description: string;
  createdBy: {
    _id: string;
    name: string;
    picture?: string;
  };
  lastModifiedBy: {
    _id: string;
    name: string;
  };
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  isPersonal: boolean;
}

const PersonalWhiteboards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchWhiteboards();
  }, []);

  const fetchWhiteboards = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}/my-whiteboards`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch whiteboards');

      const data = await response.json();
      setWhiteboards(data.whiteboards || []);
    } catch (error) {
      console.error('Error fetching whiteboards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load whiteboards',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createWhiteboard = async () => {
    try {
      setIsCreating(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}/my-whiteboards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `My Whiteboard ${whiteboards.length + 1}`,
          description: ''
        })
      });

      if (!response.ok) throw new Error('Failed to create whiteboard');

      const data = await response.json();
      toast({
        title: 'Whiteboard created',
        description: 'Your new whiteboard is ready',
      });

      // Navigate to the new whiteboard
      navigate(`/my-whiteboards/${data.whiteboard._id}`);
    } catch (error) {
      console.error('Error creating whiteboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to create whiteboard',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteWhiteboard = async (whiteboardId: string) => {
    if (!confirm('Are you sure you want to delete this whiteboard?')) return;

    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(
        `${API_BASE_URL}/my-whiteboards/${whiteboardId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to delete whiteboard');

      toast({
        title: 'Whiteboard deleted',
        description: 'The whiteboard has been removed',
      });

      fetchWhiteboards();
    } catch (error) {
      console.error('Error deleting whiteboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete whiteboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-12 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <Presentation className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                My Whiteboards
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Personal whiteboards for quick brainstorming and sketching
              </p>
            </div>

            <Button
              onClick={createWhiteboard}
              disabled={isCreating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto"
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
                  New Whiteboard
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Whiteboards Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : whiteboards.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Presentation className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No whiteboards yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first personal whiteboard to start sketching ideas, brainstorming, or planning
              </p>
              <Button
                onClick={createWhiteboard}
                disabled={isCreating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Whiteboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whiteboards.map((board) => (
              <Card
                key={board._id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div
                    onClick={() => navigate(`/my-whiteboards/${board._id}`)}
                    className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative overflow-hidden"
                  >
                    {board.thumbnail ? (
                      <img
                        src={board.thumbnail}
                        alt={board.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Presentation className="w-16 h-16 text-purple-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {board.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 truncate">
                      {board.description || 'No description'}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Personal
                      </span>
                      <span>
                        {new Date(board.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/my-whiteboards/${board._id}`);
                        }}
                        size="sm"
                        className="flex-1"
                      >
                        Open
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWhiteboard(board._id);
                        }}
                        size="sm"
                        variant="outline"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default PersonalWhiteboards;

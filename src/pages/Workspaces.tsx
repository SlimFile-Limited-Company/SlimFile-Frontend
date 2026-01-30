import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Users,
  MessageSquare,
  Calendar,
  Trash2,
  Settings,
  Crown,
  Edit3,
  Eye,
  Mail,
  Loader2,
  FolderOpen
} from 'lucide-react';
import {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
  getPendingInvitations,
  Workspace,
  WorkspaceInvitation,
  getRoleBadgeColor
} from '@/services/workspaceService';

const Workspaces = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });

  // Fetch workspaces
  const { data: workspaces, isLoading, error } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  });

  // Fetch pending invitations
  const { data: invitations } = useQuery({
    queryKey: ['pendingInvitations'],
    queryFn: getPendingInvitations,
  });

  // Create workspace mutation
  const createMutation = useMutation({
    mutationFn: () => createWorkspace(newWorkspace.name, newWorkspace.description),
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setCreateDialogOpen(false);
      setNewWorkspace({ name: '', description: '' });
      toast({
        title: 'Workspace Created',
        description: `"${workspace.name}" has been created successfully.`,
      });
      navigate(`/workspaces/${workspace._id}`);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete workspace mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setDeleteDialogOpen(false);
      setWorkspaceToDelete(null);
      toast({
        title: 'Workspace Deleted',
        description: 'The workspace has been permanently deleted.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a workspace name.',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate();
  };

  const handleDeleteWorkspace = () => {
    if (workspaceToDelete) {
      deleteMutation.mutate(workspaceToDelete._id);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-3 w-3" />;
      case 'editor':
        return <Edit3 className="h-3 w-3" />;
      case 'viewer':
        return <Eye className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Error loading workspaces</h2>
          <p className="text-gray-600 mt-2">{(error as Error).message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
            <p className="text-gray-600 mt-1">
              Collaborate with your team on file compression projects and many others
            </p>
          </div>

          <div className="flex items-center gap-3">
            {invitations && invitations.length > 0 && (
              <Link to="/workspaces/invitations">
                <Button variant="outline" className="relative">
                  <Mail className="h-4 w-4 mr-2" />
                  Invitations
                  <Badge className="absolute -top-2 -right-2 bg-red-600 text-white h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {invitations.length}
                  </Badge>
                </Button>
              </Link>
            )}

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Workspace
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Workspace</DialogTitle>
                  <DialogDescription>
                    Create a workspace to collaborate with your team on file compression tasks.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Workspace Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Marketing Team Files"
                      value={newWorkspace.name}
                      onChange={(e) =>
                        setNewWorkspace({ ...newWorkspace, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="What is this workspace for?"
                      value={newWorkspace.description}
                      onChange={(e) =>
                        setNewWorkspace({ ...newWorkspace, description: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateWorkspace}
                    disabled={createMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Workspace'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Workspaces Grid */}
        {workspaces && workspaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <Card
                key={workspace._id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1" onClick={() => navigate(`/workspaces/${workspace._id}`)}>
                      <CardTitle className="text-lg group-hover:text-red-600 transition-colors">
                        {workspace.name}
                      </CardTitle>
                      {workspace.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {workspace.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge className={`ml-2 flex items-center gap-1 ${getRoleBadgeColor(workspace.role || 'viewer')}`}>
                      {getRoleIcon(workspace.role || 'viewer')}
                      {workspace.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(workspace.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/workspaces/${workspace._id}`)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>

                      {workspace.role === 'owner' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWorkspaceToDelete(workspace);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No workspaces yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first workspace to start collaborating with your team on file
                compression projects.
              </p>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Workspace
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{workspaceToDelete?.name}"? This action cannot
                be undone. All members will lose access and all chat messages will be
                permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteWorkspace}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Workspace'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Workspaces;

import { useState, useEffect, useMemo } from 'react';
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
  Folder,
  FolderOpen,
  FolderPlus,
  LayoutGrid,
  List,
  Search,
  X
} from 'lucide-react';
import {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
  updateWorkspace,
  getPendingInvitations,
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  moveWorkspaceToFolder,
  Workspace,
  WorkspaceInvitation,
  WorkspaceFolder,
  WorkspaceWithFolder,
  getRoleBadgeColor
} from '@/services/workspaceService';
import { FolderTree } from '@/components/workspace/FolderTree';
import { RenameDialog, CreateFolderDialog } from '@/components/workspace/RenameDialog';

const Workspaces = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });

  // Folder state
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('tree');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [parentFolderForNew, setParentFolderForNew] = useState<string | undefined>(undefined);
  const [folderToRename, setFolderToRename] = useState<WorkspaceFolder | null>(null);
  const [workspaceToRename, setWorkspaceToRename] = useState<WorkspaceWithFolder | null>(null);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch workspaces (for grid view)
  const { data: workspaces, isLoading: isLoadingWorkspaces } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  });

  // Fetch folders with workspaces (for tree view)
  const { data: foldersData, isLoading: isLoadingFolders } = useQuery({
    queryKey: ['folders'],
    queryFn: getFolders,
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
      queryClient.invalidateQueries({ queryKey: ['folders'] });
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
      queryClient.invalidateQueries({ queryKey: ['folders'] });
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

  // Folder operations
  const handleCreateFolder = async (name: string, color?: string) => {
    try {
      await createFolder(name, parentFolderForNew, color);
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      setCreateFolderDialogOpen(false);
      setParentFolderForNew(undefined);
      toast({
        title: 'Folder Created',
        description: `Folder "${name}" has been created.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleRenameFolder = async (newName: string) => {
    if (!folderToRename) return;
    try {
      await updateFolder(folderToRename._id, { name: newName });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      setFolderToRename(null);
      toast({
        title: 'Folder Renamed',
        description: `Folder renamed to "${newName}".`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return;
    try {
      await deleteFolder(folderToDelete);
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      setDeleteFolderDialogOpen(false);
      setFolderToDelete(null);
      toast({
        title: 'Folder Deleted',
        description: 'Folder has been deleted. Contents moved to parent.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleRenameWorkspace = async (newName: string) => {
    if (!workspaceToRename) return;
    try {
      await updateWorkspace(workspaceToRename._id, { name: newName });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      setWorkspaceToRename(null);
      toast({
        title: 'Workspace Renamed',
        description: `Workspace renamed to "${newName}".`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleMoveWorkspace = async (result: { workspaceId?: string; folderId?: string; targetFolderId: string | null }) => {
    if (!result.workspaceId) return;
    try {
      await moveWorkspaceToFolder(result.workspaceId, result.targetFolderId);
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast({
        title: 'Workspace Moved',
        description: 'Workspace has been moved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleFolderToggle = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
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

  const isLoading = isLoadingWorkspaces || isLoadingFolders;

  // Filter folders and workspaces based on search query
  const filteredData = useMemo(() => {
    if (!foldersData || !searchQuery.trim()) {
      return foldersData;
    }

    const query = searchQuery.toLowerCase().trim();

    // Filter folders that match the query
    const matchingFolders = foldersData.folders.filter(folder =>
      folder.name.toLowerCase().includes(query)
    );

    // Get IDs of matching folders
    const matchingFolderIds = new Set(matchingFolders.map(f => f._id));

    // Filter workspaces that match the query or are in matching folders
    const filteredWorkspacesByFolder: Record<string, typeof foldersData.workspacesByFolder[string]> = {};

    Object.entries(foldersData.workspacesByFolder).forEach(([folderId, workspaces]) => {
      const matchingWorkspaces = workspaces.filter(ws =>
        ws.name.toLowerCase().includes(query) ||
        ws.description?.toLowerCase().includes(query) ||
        matchingFolderIds.has(folderId)
      );

      if (matchingWorkspaces.length > 0 || matchingFolderIds.has(folderId)) {
        filteredWorkspacesByFolder[folderId] = matchingWorkspaces.length > 0
          ? matchingWorkspaces
          : workspaces;
      }
    });

    // Include folders that have matching workspaces
    const foldersWithMatchingWorkspaces = new Set(
      Object.keys(filteredWorkspacesByFolder).filter(id => id !== 'root')
    );

    const finalFolders = foldersData.folders.filter(folder =>
      matchingFolderIds.has(folder._id) || foldersWithMatchingWorkspaces.has(folder._id)
    );

    return {
      folders: finalFolders,
      workspacesByFolder: filteredWorkspacesByFolder
    };
  }, [foldersData, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
            <p className="text-gray-600 mt-1">
              Collaborate with your team on file compression projects and many others
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {invitations && invitations.length > 0 && (
              <Link to="/workspaces/invitations">
                <Button variant="outline" size="sm" className="relative">
                  <Mail className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Invitations</span>
                  <Badge className="absolute -top-2 -right-2 bg-red-600 text-white h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {invitations.length}
                  </Badge>
                </Button>
              </Link>
            )}

            {/* View mode toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'tree' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('tree')}
                className={viewMode === 'tree' ? 'bg-slate-900' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-slate-900' : ''}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            {/* New Folder button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setParentFolderForNew(undefined);
                setCreateFolderDialogOpen(true);
              }}
            >
              <FolderPlus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">New Folder</span>
            </Button>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">New Workspace</span>
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search workspaces and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {viewMode === 'tree' && filteredData ? (
          /* Tree View with Folders */
          <Card className="p-4">
            <FolderTree
              folders={filteredData.folders}
              workspacesByFolder={filteredData.workspacesByFolder}
              searchQuery={searchQuery}
              onFolderToggle={handleFolderToggle}
              onFolderCreate={(parentId) => {
                setParentFolderForNew(parentId);
                setCreateFolderDialogOpen(true);
              }}
              onFolderRename={setFolderToRename}
              onFolderDelete={(folderId) => {
                setFolderToDelete(folderId);
                setDeleteFolderDialogOpen(true);
              }}
              onWorkspaceClick={(id) => navigate(`/workspaces/${id}`)}
              onWorkspaceRename={setWorkspaceToRename}
              onWorkspaceDelete={(id) => {
                const workspace = Object.values(foldersData.workspacesByFolder)
                  .flat()
                  .find(w => w._id === id);
                if (workspace) {
                  setWorkspaceToDelete(workspace as Workspace);
                  setDeleteDialogOpen(true);
                }
              }}
              onDragEnd={handleMoveWorkspace}
              expandedFolders={expandedFolders}
            />
          </Card>
        ) : filteredData ? (
          /* Grid View with Folders */
          <div className="space-y-8">
            {/* Folders */}
            {filteredData.folders.filter(f => !f.parentFolderId).map((folder) => {
              const folderWorkspaces = filteredData.workspacesByFolder[folder._id] || [];
              const isExpanded = expandedFolders.has(folder._id);

              return (
                <div key={folder._id}>
                  {/* Folder Header */}
                  <div
                    className="flex items-center gap-3 mb-4 cursor-pointer group"
                    onClick={() => handleFolderToggle(folder._id)}
                  >
                    {isExpanded ? (
                      <FolderOpen className="h-6 w-6" style={{ color: folder.color || '#64748b' }} />
                    ) : (
                      <Folder className="h-6 w-6" style={{ color: folder.color || '#64748b' }} />
                    )}
                    <h2 className="text-xl font-semibold text-gray-800">{folder.name}</h2>
                    <span className="text-sm text-gray-500">({folderWorkspaces.length})</span>
                    <div className="flex-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFolderToRename(folder);
                      }}
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFolderToDelete(folder._id);
                        setDeleteFolderDialogOpen(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Folder Workspaces */}
                  {isExpanded && folderWorkspaces.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-4">
                      {folderWorkspaces.map((workspace) => (
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
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(workspace.createdAt).toLocaleDateString()}
                              </span>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/workspaces/${workspace._id}`)}>
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                {workspace.role === 'owner' && (
                                  <>
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setWorkspaceToRename(workspace); }}>
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setWorkspaceToDelete(workspace as Workspace); setDeleteDialogOpen(true); }} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  {isExpanded && folderWorkspaces.length === 0 && (
                    <p className="text-sm text-gray-500 ml-9 mb-4">No workspaces in this folder</p>
                  )}
                </div>
              );
            })}

            {/* Root Workspaces (not in any folder) */}
            {(filteredData.workspacesByFolder['root']?.length > 0) && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Workspaces</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.workspacesByFolder['root'].map((workspace) => (
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
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(workspace.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/workspaces/${workspace._id}`)}>
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            {workspace.role === 'owner' && (
                              <>
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setWorkspaceToRename(workspace); }}>
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setWorkspaceToDelete(workspace as Workspace); setDeleteDialogOpen(true); }} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {filteredData.folders.length === 0 && (!filteredData.workspacesByFolder['root'] || filteredData.workspacesByFolder['root'].length === 0) && (
              <Card className="text-center py-12">
                <CardContent>
                  <FolderOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No workspaces yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Create your first workspace to start collaborating with your team.
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)} className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Workspace
                  </Button>
                </CardContent>
              </Card>
            )}
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

        {/* Delete Workspace Confirmation Dialog */}
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

        {/* Delete Folder Confirmation Dialog */}
        <AlertDialog open={deleteFolderDialogOpen} onOpenChange={setDeleteFolderDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Folder</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this folder? The folder contents (subfolders and
                workspaces) will be moved to the parent folder.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteFolder}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Folder
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Create Folder Dialog */}
        <CreateFolderDialog
          isOpen={createFolderDialogOpen}
          onClose={() => {
            setCreateFolderDialogOpen(false);
            setParentFolderForNew(undefined);
          }}
          onCreate={handleCreateFolder}
          parentFolderName={
            parentFolderForNew
              ? foldersData?.folders.find(f => f._id === parentFolderForNew)?.name
              : undefined
          }
        />

        {/* Rename Folder Dialog */}
        <RenameDialog
          isOpen={!!folderToRename}
          onClose={() => setFolderToRename(null)}
          title="Rename Folder"
          currentName={folderToRename?.name || ''}
          onRename={handleRenameFolder}
          placeholder="Enter folder name"
        />

        {/* Rename Workspace Dialog */}
        <RenameDialog
          isOpen={!!workspaceToRename}
          onClose={() => setWorkspaceToRename(null)}
          title="Rename Workspace"
          currentName={workspaceToRename?.name || ''}
          onRename={handleRenameWorkspace}
          placeholder="Enter workspace name"
        />
      </div>
    </div>
  );
};

export default Workspaces;

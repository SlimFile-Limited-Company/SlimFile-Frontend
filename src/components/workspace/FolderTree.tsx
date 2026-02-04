import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WorkspaceCard } from './WorkspaceCard';
import type { WorkspaceFolder, WorkspaceWithFolder } from '@/services/workspaceService';

interface FolderTreeProps {
  folders: WorkspaceFolder[];
  workspacesByFolder: Record<string, WorkspaceWithFolder[]>;
  onFolderToggle: (folderId: string) => void;
  onFolderCreate: (parentFolderId?: string) => void;
  onFolderRename: (folder: WorkspaceFolder) => void;
  onFolderDelete: (folderId: string) => void;
  onWorkspaceClick: (workspaceId: string) => void;
  onWorkspaceRename: (workspace: WorkspaceWithFolder) => void;
  onWorkspaceDelete: (workspaceId: string) => void;
  onDragEnd: (result: { workspaceId?: string; folderId?: string; targetFolderId: string | null; newOrder: number }) => void;
  expandedFolders: Set<string>;
}

interface FolderItemProps {
  folder: WorkspaceFolder;
  workspaces: WorkspaceWithFolder[];
  childFolders: WorkspaceFolder[];
  allFolders: WorkspaceFolder[];
  workspacesByFolder: Record<string, WorkspaceWithFolder[]>;
  isExpanded: boolean;
  depth: number;
  onToggle: () => void;
  onCreateSubfolder: () => void;
  onRename: () => void;
  onDelete: () => void;
  onWorkspaceClick: (workspaceId: string) => void;
  onWorkspaceRename: (workspace: WorkspaceWithFolder) => void;
  onWorkspaceDelete: (workspaceId: string) => void;
  expandedFolders: Set<string>;
  onFolderToggle: (folderId: string) => void;
  onFolderRename: (folder: WorkspaceFolder) => void;
  onFolderDelete: (folderId: string) => void;
  onFolderCreate: (parentFolderId?: string) => void;
}

function FolderItem({
  folder,
  workspaces,
  childFolders,
  allFolders,
  workspacesByFolder,
  isExpanded,
  depth,
  onToggle,
  onCreateSubfolder,
  onRename,
  onDelete,
  onWorkspaceClick,
  onWorkspaceRename,
  onWorkspaceDelete,
  expandedFolders,
  onFolderToggle,
  onFolderRename,
  onFolderDelete,
  onFolderCreate
}: FolderItemProps) {
  const paddingLeft = depth * 16;
  const hasContent = workspaces.length > 0 || childFolders.length > 0;

  return (
    <div>
      {/* Folder header */}
      <div
        className="flex items-center gap-1 py-2 px-2 hover:bg-slate-100 rounded-lg group cursor-pointer"
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        <button
          onClick={onToggle}
          className="p-0.5 hover:bg-slate-200 rounded"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-500" />
          )}
        </button>

        <div
          className="flex items-center gap-2 flex-1 min-w-0"
          onClick={onToggle}
        >
          {isExpanded ? (
            <FolderOpen
              className="h-5 w-5 flex-shrink-0"
              style={{ color: folder.color || '#64748b' }}
            />
          ) : (
            <Folder
              className="h-5 w-5 flex-shrink-0"
              style={{ color: folder.color || '#64748b' }}
            />
          )}
          <span className="text-sm font-medium text-slate-700 truncate">
            {folder.name}
          </span>
          <span className="text-xs text-slate-400">
            ({workspaces.length})
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {depth < 2 && (
              <DropdownMenuItem onClick={onCreateSubfolder}>
                <Plus className="h-4 w-4 mr-2" />
                New Subfolder
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onRename}>
              <Edit2 className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Folder contents */}
      {isExpanded && hasContent && (
        <div className="ml-4">
          {/* Child folders */}
          {childFolders.map((childFolder) => {
            const childWorkspaces = workspacesByFolder[childFolder._id] || [];
            const grandchildFolders = allFolders.filter(
              f => f.parentFolderId === childFolder._id
            );

            return (
              <FolderItem
                key={childFolder._id}
                folder={childFolder}
                workspaces={childWorkspaces}
                childFolders={grandchildFolders}
                allFolders={allFolders}
                workspacesByFolder={workspacesByFolder}
                isExpanded={expandedFolders.has(childFolder._id)}
                depth={depth + 1}
                onToggle={() => onFolderToggle(childFolder._id)}
                onCreateSubfolder={() => onFolderCreate(childFolder._id)}
                onRename={() => onFolderRename(childFolder)}
                onDelete={() => onFolderDelete(childFolder._id)}
                onWorkspaceClick={onWorkspaceClick}
                onWorkspaceRename={onWorkspaceRename}
                onWorkspaceDelete={onWorkspaceDelete}
                expandedFolders={expandedFolders}
                onFolderToggle={onFolderToggle}
                onFolderRename={onFolderRename}
                onFolderDelete={onFolderDelete}
                onFolderCreate={onFolderCreate}
              />
            );
          })}

          {/* Workspaces in folder */}
          <SortableContext
            items={workspaces.map(w => w._id)}
            strategy={verticalListSortingStrategy}
          >
            {workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace._id}
                workspace={workspace}
                onClick={() => onWorkspaceClick(workspace._id)}
                onRename={() => onWorkspaceRename(workspace)}
                onDelete={() => onWorkspaceDelete(workspace._id)}
                depth={depth + 1}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

export function FolderTree({
  folders,
  workspacesByFolder,
  onFolderToggle,
  onFolderCreate,
  onFolderRename,
  onFolderDelete,
  onWorkspaceClick,
  onWorkspaceRename,
  onWorkspaceDelete,
  onDragEnd,
  expandedFolders
}: FolderTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get root level folders and workspaces
  const rootFolders = folders.filter(f => !f.parentFolderId);
  const rootWorkspaces = workspacesByFolder['root'] || [];

  // All workspace IDs for drag context
  const allWorkspaceIds = Object.values(workspacesByFolder).flat().map(w => w._id);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string | null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    // Find what was dragged and where
    const draggedWorkspace = Object.values(workspacesByFolder)
      .flat()
      .find(w => w._id === active.id);

    if (draggedWorkspace) {
      // Determine target folder
      let targetFolderId: string | null = null;

      // Check if dropped on a folder
      const targetFolder = folders.find(f => f._id === over.id);
      if (targetFolder) {
        targetFolderId = targetFolder._id;
      } else {
        // Dropped on another workspace - find its folder
        const targetWorkspace = Object.entries(workspacesByFolder).find(
          ([_, workspaces]) => workspaces.some(w => w._id === over.id)
        );
        if (targetWorkspace) {
          targetFolderId = targetWorkspace[0] === 'root' ? null : targetWorkspace[0];
        }
      }

      onDragEnd({
        workspaceId: draggedWorkspace._id,
        targetFolderId,
        newOrder: 0 // Will be calculated on backend
      });
    }
  };

  // Find active workspace for overlay
  const activeWorkspace = activeId
    ? Object.values(workspacesByFolder).flat().find(w => w._id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-1">
        {/* Root folders */}
        {rootFolders.map((folder) => {
          const folderWorkspaces = workspacesByFolder[folder._id] || [];
          const childFolders = folders.filter(f => f.parentFolderId === folder._id);

          return (
            <FolderItem
              key={folder._id}
              folder={folder}
              workspaces={folderWorkspaces}
              childFolders={childFolders}
              allFolders={folders}
              workspacesByFolder={workspacesByFolder}
              isExpanded={expandedFolders.has(folder._id)}
              depth={0}
              onToggle={() => onFolderToggle(folder._id)}
              onCreateSubfolder={() => onFolderCreate(folder._id)}
              onRename={() => onFolderRename(folder)}
              onDelete={() => onFolderDelete(folder._id)}
              onWorkspaceClick={onWorkspaceClick}
              onWorkspaceRename={onWorkspaceRename}
              onWorkspaceDelete={onWorkspaceDelete}
              expandedFolders={expandedFolders}
              onFolderToggle={onFolderToggle}
              onFolderRename={onFolderRename}
              onFolderDelete={onFolderDelete}
              onFolderCreate={onFolderCreate}
            />
          );
        })}

        {/* Root level workspaces (not in any folder) */}
        {rootWorkspaces.length > 0 && (
          <div className="pt-2 border-t border-slate-200 mt-2">
            <div className="text-xs font-medium text-slate-500 px-2 mb-2">
              Workspaces
            </div>
            <SortableContext
              items={rootWorkspaces.map(w => w._id)}
              strategy={verticalListSortingStrategy}
            >
              {rootWorkspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace._id}
                  workspace={workspace}
                  onClick={() => onWorkspaceClick(workspace._id)}
                  onRename={() => onWorkspaceRename(workspace)}
                  onDelete={() => onWorkspaceDelete(workspace._id)}
                  depth={0}
                />
              ))}
            </SortableContext>
          </div>
        )}

        {/* Empty state */}
        {rootFolders.length === 0 && rootWorkspaces.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Folder className="h-12 w-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No workspaces yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Create a workspace to get started
            </p>
          </div>
        )}
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeWorkspace && (
          <div className="bg-white shadow-lg rounded-lg border-2 border-blue-500 opacity-90">
            <WorkspaceCard
              workspace={activeWorkspace}
              onClick={() => {}}
              onRename={() => {}}
              onDelete={() => {}}
              depth={0}
              isDragging
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

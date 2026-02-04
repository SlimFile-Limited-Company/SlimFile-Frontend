import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MessageSquare, MoreHorizontal, Edit2, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getRoleBadgeColor, type WorkspaceWithFolder } from '@/services/workspaceService';

interface WorkspaceCardProps {
  workspace: WorkspaceWithFolder;
  onClick: () => void;
  onRename: () => void;
  onDelete: () => void;
  depth?: number;
  isDragging?: boolean;
}

export function WorkspaceCard({
  workspace,
  onClick,
  onRename,
  onDelete,
  depth = 0,
  isDragging = false
}: WorkspaceCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: workspace._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${depth * 16 + 8}px`,
  };

  const isCurrentlyDragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center gap-2 py-2 pr-2 rounded-lg group transition-colors ${
        isCurrentlyDragging
          ? 'bg-blue-50 shadow-md'
          : 'hover:bg-slate-50'
      }`}
    >
      {/* Drag handle */}
      <button
        {...listeners}
        className="p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity touch-none"
      >
        <GripVertical className="h-4 w-4 text-slate-400" />
      </button>

      {/* Workspace content */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <span className="text-sm font-medium text-slate-700 truncate">
            {workspace.name}
          </span>
          {workspace.role && (
            <Badge
              variant="secondary"
              className={`text-[10px] px-1.5 py-0 ${getRoleBadgeColor(workspace.role)}`}
            >
              {workspace.role}
            </Badge>
          )}
        </div>
        {workspace.description && (
          <p className="text-xs text-slate-500 truncate mt-0.5 ml-6">
            {workspace.description}
          </p>
        )}
      </div>

      {/* Actions */}
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
          <DropdownMenuItem onClick={onClick}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Open Chat
          </DropdownMenuItem>
          {workspace.role === 'owner' && (
            <>
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
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

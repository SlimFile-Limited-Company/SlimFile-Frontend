import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Crown, Edit3, Eye, Loader2, UserMinus, X, Clock, Mail } from 'lucide-react';
import {
  WorkspaceMember,
  WorkspaceInvitation,
  updateMemberRole,
  removeMember,
  cancelInvitation,
  getRoleBadgeColor,
} from '@/services/workspaceService';

interface MemberListProps {
  workspaceId: string;
  members: WorkspaceMember[];
  pendingInvites: WorkspaceInvitation[];
  currentUserRole: 'owner' | 'editor' | 'viewer';
  currentUserId: string | null;
}

const MemberList = ({
  workspaceId,
  members,
  pendingInvites,
  currentUserRole,
  currentUserId,
}: MemberListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMember | null>(null);
  const [inviteToCancel, setInviteToCancel] = useState<WorkspaceInvitation | null>(null);

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: 'editor' | 'viewer' }) =>
      updateMemberRole(workspaceId, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
      toast({
        title: 'Role Updated',
        description: 'Member role has been updated successfully',
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

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => removeMember(workspaceId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
      setMemberToRemove(null);
      toast({
        title: 'Member Removed',
        description: 'The member has been removed from the workspace',
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

  // Cancel invitation mutation
  const cancelInviteMutation = useMutation({
    mutationFn: (invitationId: string) => cancelInvitation(workspaceId, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
      setInviteToCancel(null);
      toast({
        title: 'Invitation Cancelled',
        description: 'The invitation has been cancelled',
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isOwner = currentUserRole === 'owner';

  return (
    <div className="mt-6 space-y-6">
      {/* Active Members */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-3">Members</h4>
        <div className="space-y-3">
          {members.map((member) => {
            const isSelf = member.user._id === currentUserId;
            const isOwnerMember = member.role === 'owner';

            return (
              <div
                key={member._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.user.picture} />
                    <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.user.name}
                      {isSelf && <span className="text-gray-500 ml-1">(You)</span>}
                    </p>
                    <p className="text-sm text-gray-500">{member.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isOwner && !isOwnerMember ? (
                    <Select
                      value={member.role}
                      onValueChange={(value: 'editor' | 'viewer') =>
                        updateRoleMutation.mutate({ memberId: member._id, role: value })
                      }
                      disabled={updateRoleMutation.isPending}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`flex items-center gap-1 ${getRoleBadgeColor(member.role)}`}>
                      {getRoleIcon(member.role)}
                      {member.role}
                    </Badge>
                  )}

                  {/* Remove button (owner can remove anyone except self, members can leave) */}
                  {!isOwnerMember && (isOwner || isSelf) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMemberToRemove(member)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Invitations (Owner only) */}
      {isOwner && pendingInvites.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Invitations
            </h4>
            <div className="space-y-3">
              {pendingInvites.map((invite) => (
                <div
                  key={invite._id}
                  className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invite.inviteeEmail}</p>
                      <p className="text-sm text-gray-500">
                        Invited as {invite.role} • Expires{' '}
                        {new Date(invite.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInviteToCancel(invite)}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Remove Member Dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {memberToRemove?.user._id === currentUserId
                ? 'Leave Workspace'
                : 'Remove Member'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {memberToRemove?.user._id === currentUserId
                ? 'Are you sure you want to leave this workspace? You will lose access to all workspace content.'
                : `Are you sure you want to remove ${memberToRemove?.user.name} from this workspace?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToRemove && removeMemberMutation.mutate(memberToRemove._id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {removeMemberMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : memberToRemove?.user._id === currentUserId ? (
                'Leave'
              ) : (
                'Remove'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Invitation Dialog */}
      <AlertDialog open={!!inviteToCancel} onOpenChange={() => setInviteToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the invitation to {inviteToCancel?.inviteeEmail}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Invitation</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => inviteToCancel && cancelInviteMutation.mutate(inviteToCancel._id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelInviteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Cancel Invitation'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MemberList;

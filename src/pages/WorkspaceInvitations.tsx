import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Check,
  X,
  Loader2,
  Mail,
  Calendar,
  Users,
  Clock,
  MailOpen
} from 'lucide-react';
import {
  getPendingInvitations,
  acceptInvitation,
  declineInvitation,
  WorkspaceInvitation,
} from '@/services/workspaceService';

const WorkspaceInvitations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [autoAccepting, setAutoAccepting] = useState(false);

  // Fetch pending invitations
  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ['pendingInvitations'],
    queryFn: getPendingInvitations,
  });

  // Handle token from email link - auto-accept invitation
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && !autoAccepting) {
      setAutoAccepting(true);
      // Clear the token from URL
      setSearchParams({});

      // Auto-accept the invitation
      acceptInvitation(token)
        .then((workspaceId) => {
          queryClient.invalidateQueries({ queryKey: ['pendingInvitations'] });
          queryClient.invalidateQueries({ queryKey: ['workspaces'] });
          toast({
            title: 'Invitation Accepted',
            description: 'You have joined the workspace successfully!',
          });
          navigate(`/workspaces/${workspaceId}`);
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to accept invitation',
            variant: 'destructive',
          });
          setAutoAccepting(false);
        });
    }
  }, [searchParams, autoAccepting, navigate, queryClient, setSearchParams, toast]);

  // Accept invitation mutation
  const acceptMutation = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: (workspaceId) => {
      queryClient.invalidateQueries({ queryKey: ['pendingInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast({
        title: 'Invitation Accepted',
        description: 'You have joined the workspace successfully!',
      });
      navigate(`/workspaces/${workspaceId}`);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Decline invitation mutation
  const declineMutation = useMutation({
    mutationFn: declineInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingInvitations'] });
      toast({
        title: 'Invitation Declined',
        description: 'The invitation has been declined.',
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatExpiry = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return 'Expires tomorrow';
    if (diffDays <= 7) return `Expires in ${diffDays} days`;
    return `Expires on ${expiry.toLocaleDateString()}`;
  };

  if (isLoading || autoAccepting) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto" />
          {autoAccepting && (
            <p className="mt-4 text-gray-600">Accepting invitation...</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Error loading invitations</h2>
          <p className="text-gray-600 mt-2">{(error as Error).message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/workspaces')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workspaces
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Mail className="h-8 w-8 text-red-600" />
            Workspace Invitations
          </h1>
          <p className="text-gray-600 mt-1">
            Review and respond to workspace invitations
          </p>
        </div>

        {/* Invitations List */}
        {invitations && invitations.length > 0 ? (
          <div className="space-y-4">
            {invitations.map((invitation) => {
              const workspace = invitation.workspaceId as any;
              const inviter = invitation.inviterId as any;
              const isPending =
                acceptMutation.isPending &&
                acceptMutation.variables === invitation.token;
              const isDeclinePending =
                declineMutation.isPending &&
                declineMutation.variables === invitation.token;

              return (
                <Card key={invitation._id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{workspace?.name}</CardTitle>
                        {workspace?.description && (
                          <CardDescription className="mt-1">
                            {workspace.description}
                          </CardDescription>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-white text-gray-700"
                      >
                        {invitation.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-3">
                        {/* Inviter */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={inviter?.picture} />
                            <AvatarFallback className="text-xs">
                              {inviter?.name ? getInitials(inviter.name) : '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm text-gray-600">
                              Invited by <span className="font-medium">{inviter?.name}</span>
                            </p>
                          </div>
                        </div>

                        {/* Expiry */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{formatExpiry(invitation.expiresAt)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => declineMutation.mutate(invitation.token)}
                          disabled={isPending || isDeclinePending}
                        >
                          {isDeclinePending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-2" />
                              Decline
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => acceptMutation.mutate(invitation.token)}
                          disabled={isPending || isDeclinePending}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Accept
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <MailOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No pending invitations
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You don't have any workspace invitations at the moment. When someone invites
                you to collaborate, you'll see it here.
              </p>
              <Link to="/workspaces">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View Your Workspaces
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkspaceInvitations;

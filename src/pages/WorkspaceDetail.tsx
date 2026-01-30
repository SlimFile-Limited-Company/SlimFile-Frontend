import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Send,
  Users,
  Settings,
  UserPlus,
  Loader2,
  Crown,
  Edit3,
  Eye,
  MoreVertical,
  Trash2,
  ChevronUp
} from 'lucide-react';
import {
  getWorkspace,
  getMessages,
  sendMessage,
  deleteMessage,
  Message,
  WorkspaceDetails,
  getRoleBadgeColor,
  formatMessageTime
} from '@/services/workspaceService';
import {
  initializeSocket,
  authenticateSocket,
  joinWorkspace,
  leaveWorkspace,
  sendTypingIndicator,
  onNewMessage,
  onMessageDeleted,
  onUserTyping,
  onMemberJoined,
  onMemberRemoved,
  showMessageNotification
} from '@/services/socketService';
import InviteMemberDialog from '@/components/workspace/InviteMemberDialog';
import MemberList from '@/components/workspace/MemberList';

const WorkspaceDetail = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [membersSheetOpen, setMembersSheetOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current user ID from JWT
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('jwt');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      }
    } catch {
      return null;
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  // Fetch workspace details
  const { data: workspaceData, isLoading: loadingWorkspace } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => getWorkspace(workspaceId!),
    enabled: !!workspaceId,
  });

  // Fetch initial messages
  const { isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', workspaceId],
    queryFn: async () => {
      const result = await getMessages(workspaceId!);
      setMessages(result.messages);
      setHasMore(result.hasMore);
      return result;
    },
    enabled: !!workspaceId,
  });

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (text: string) => sendMessage(workspaceId!, text),
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete message mutation
  const deleteMutation = useMutation({
    mutationFn: (messageId: string) => deleteMessage(workspaceId!, messageId),
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token && workspaceId) {
      initializeSocket();
      authenticateSocket(token);
      joinWorkspace(workspaceId);
    }

    return () => {
      if (workspaceId) {
        leaveWorkspace(workspaceId);
      }
    };
  }, [workspaceId]);

  // Socket event listeners
  useEffect(() => {
    if (!workspaceId) return;

    // New message handler
    const unsubMessage = onNewMessage((message) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });

      // Show notification if from another user and window is not focused
      if (message.senderId._id !== currentUserId) {
        showMessageNotification(
          message.senderId.name,
          message.text,
          workspaceId
        );
      }

      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    // Message deleted handler
    const unsubDelete = onMessageDeleted(({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, deleted: true, text: '[Message deleted]' } : m
        )
      );
    });

    // Typing indicator handler
    const unsubTyping = onUserTyping(({ userId, isTyping }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (isTyping) {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });
    });

    // Member joined handler
    const unsubMemberJoined = onMemberJoined((event) => {
      if (event.workspaceId === workspaceId) {
        queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
        toast({
          title: 'New Member',
          description: `${event.user.name} joined the workspace`,
        });
      }
    });

    // Member removed handler
    const unsubMemberRemoved = onMemberRemoved((event) => {
      if (event.workspaceId === workspaceId) {
        queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
        if (event.userId === currentUserId) {
          toast({
            title: 'Removed from Workspace',
            description: 'You have been removed from this workspace',
            variant: 'destructive',
          });
          navigate('/workspaces');
        }
      }
    });

    return () => {
      unsubMessage();
      unsubDelete();
      unsubTyping();
      unsubMemberJoined();
      unsubMemberRemoved();
    };
  }, [workspaceId, currentUserId, queryClient, navigate, toast]);

  // Auto-scroll to bottom on initial load
  useEffect(() => {
    if (!loadingMessages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView();
    }
  }, [loadingMessages]);

  // Handle sending message
  const handleSendMessage = async () => {
    const text = messageText.trim();
    if (!text) return;

    setMessageText('');
    sendTypingIndicator(workspaceId!, false);
    await sendMutation.mutateAsync(text);
  };

  // Handle typing indicator
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);

    // Send typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    sendTypingIndicator(workspaceId!, true);

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(workspaceId!, false);
    }, 2000);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Load more messages
  const loadMoreMessages = async () => {
    if (!hasMore || loadingMore || messages.length === 0) return;

    setLoadingMore(true);
    try {
      const oldestMessage = messages[0];
      const result = await getMessages(workspaceId!, oldestMessage.createdAt);
      setMessages((prev) => [...result.messages, ...prev]);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Get role icon
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

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loadingWorkspace || loadingMessages) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!workspaceData) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Workspace not found</h2>
          <Link to="/workspaces">
            <Button className="mt-4">Back to Workspaces</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { workspace, members, pendingInvites, currentUserRole } = workspaceData;

  return (
    <div className="min-h-screen pt-16 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-16 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/workspaces')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-semibold text-gray-900">{workspace.name}</h1>
            <p className="text-xs text-gray-500">{members.length} members</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUserRole === 'owner' && (
            <Button variant="outline" size="sm" onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
          )}

          <Sheet open={membersSheetOpen} onOpenChange={setMembersSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Members
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Workspace Members</SheetTitle>
                <SheetDescription>
                  {members.length} members in this workspace
                </SheetDescription>
              </SheetHeader>
              <MemberList
                workspaceId={workspaceId!}
                members={members}
                pendingInvites={pendingInvites}
                currentUserRole={currentUserRole}
                currentUserId={currentUserId}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={messagesContainerRef}>
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadMoreMessages}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ChevronUp className="h-4 w-4 mr-2" />
                )}
                Load earlier messages
              </Button>
            </div>
          )}

          {/* Messages List */}
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId._id === currentUserId;
              const showAvatar =
                index === 0 ||
                messages[index - 1].senderId._id !== message.senderId._id;

              return (
                <div
                  key={message._id}
                  className={`flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                >
                  {!isOwnMessage && showAvatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.senderId.picture} />
                      <AvatarFallback className="text-xs">
                        {getInitials(message.senderId.name)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8" />
                  )}

                  <div
                    className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}
                  >
                    {showAvatar && !isOwnMessage && (
                      <p className="text-xs text-gray-500 mb-1 ml-1">
                        {message.senderId.name}
                      </p>
                    )}
                    <div
                      className={`group relative rounded-2xl px-4 py-2 ${
                        message.deleted
                          ? 'bg-gray-100 text-gray-400 italic'
                          : isOwnMessage
                          ? 'bg-red-600 text-white'
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          message.deleted
                            ? 'text-gray-400'
                            : isOwnMessage
                            ? 'text-red-200'
                            : 'text-gray-400'
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                      </p>

                      {/* Delete button for own messages */}
                      {isOwnMessage && !message.deleted && (
                        <button
                          onClick={() => deleteMutation.mutate(message._id)}
                          className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {typingUsers.size > 0 && (
            <div className="flex items-center gap-2 mt-4 text-gray-500 text-sm">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
              <span>Someone is typing...</span>
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={sendMutation.isPending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sendMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {sendMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Invite Dialog */}
      <InviteMemberDialog
        workspaceId={workspaceId!}
        workspaceName={workspace.name}
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
    </div>
  );
};

export default WorkspaceDetail;

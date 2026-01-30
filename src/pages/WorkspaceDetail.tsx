import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  UserPlus,
  Loader2,
  Trash2,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import {
  getWorkspace,
  getMessages,
  sendMessage,
  deleteMessage,
  Message,
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
  showMessageNotification,
  playSendSound,
  playReceiveSound,
  requestNotificationPermission,
  setActiveWorkspace
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
  // Store typing users as Map<userId, userName> for displaying names
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [membersSheetOpen, setMembersSheetOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  // Scroll to bottom of chat
  const scrollToBottom = (smooth = true) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  // Initialize socket connection and request notification permission
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token && workspaceId) {
      initializeSocket();
      authenticateSocket(token);
      joinWorkspace(workspaceId);

      // Set this as the active workspace (to prevent self-notifications)
      setActiveWorkspace(workspaceId);

      // Request notification permission for WhatsApp-style notifications
      requestNotificationPermission();
    }

    return () => {
      if (workspaceId) {
        leaveWorkspace(workspaceId);
        setActiveWorkspace(null);
      }
    };
  }, [workspaceId]);

  // Socket event listeners
  useEffect(() => {
    if (!workspaceId || !workspaceData) return;

    // New message handler
    const unsubMessage = onNewMessage((message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });

      // Play sound and show notification for messages from other users
      if (message.senderId._id !== currentUserId) {
        playReceiveSound();
        showMessageNotification(
          message.senderId.name,
          message.text,
          workspaceId,
          workspaceData?.workspace.name
        );
      }

      // Scroll to bottom after new message
      setTimeout(() => scrollToBottom(), 100);
    });

    // Message deleted handler
    const unsubDelete = onMessageDeleted(({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, deleted: true, text: '[Message deleted]' } : m
        )
      );
    });

    // Typing indicator handler - store user name from members list
    const unsubTyping = onUserTyping(({ userId, isTyping }) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (isTyping && userId !== currentUserId) {
          // Find user name from members
          const member = workspaceData.members.find(m => m.user._id === userId);
          const userName = member?.user.name || 'Someone';
          next.set(userId, userName);
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
  }, [workspaceId, workspaceData, currentUserId, queryClient, navigate, toast]);

  // Auto-scroll to bottom on initial load
  useEffect(() => {
    if (!loadingMessages && messages.length > 0) {
      setTimeout(() => scrollToBottom(false), 100);
    }
  }, [loadingMessages]);

  // Handle sending message
  const handleSendMessage = async () => {
    const text = messageText.trim();
    if (!text) return;

    setMessageText('');
    sendTypingIndicator(workspaceId!, false);
    playSendSound();

    await sendMutation.mutateAsync(text);
    setTimeout(() => scrollToBottom(), 50);
  };

  // Handle typing indicator
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);

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
    const scrollContainer = scrollContainerRef.current;
    const previousScrollHeight = scrollContainer?.scrollHeight || 0;

    try {
      const oldestMessage = messages[0];
      const result = await getMessages(workspaceId!, oldestMessage.createdAt);
      setMessages((prev) => [...result.messages, ...prev]);
      setHasMore(result.hasMore);

      // Maintain scroll position after loading more
      setTimeout(() => {
        if (scrollContainer) {
          const newScrollHeight = scrollContainer.scrollHeight;
          scrollContainer.scrollTop = newScrollHeight - previousScrollHeight;
        }
      }, 0);
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setLoadingMore(false);
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

  // Format date for date separators
  const formatDateSeparator = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Check if we should show date separator
  const shouldShowDateSeparator = (currentMsg: Message, prevMsg?: Message) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const prevDate = new Date(prevMsg.createdAt).toDateString();
    return currentDate !== prevDate;
  };

  // Get typing users text
  const getTypingText = () => {
    const names = Array.from(typingUsers.values());
    if (names.length === 0) return '';
    if (names.length === 1) return `${names[0]} is typing...`;
    if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`;
    return `${names[0]} and ${names.length - 1} others are typing...`;
  };

  if (loadingWorkspace || loadingMessages) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-red-600 mx-auto" />
          <p className="mt-3 text-gray-500">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!workspaceData) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Workspace not found</h2>
          <p className="text-gray-500 mt-2">This workspace may have been deleted</p>
          <Link to="/workspaces">
            <Button className="mt-6 bg-red-600 hover:bg-red-700">Back to Workspaces</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { workspace, members, pendingInvites, currentUserRole } = workspaceData;

  return (
    <div className="min-h-screen pt-16 flex flex-col bg-gray-100">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-4 flex items-center justify-between sticky top-16 z-10 shadow-md">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/workspaces')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg">{workspace.name}</h1>
            <p className="text-xs text-red-100">{members.length} members • {workspace.description || 'Team workspace'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUserRole === 'owner' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInviteDialogOpen(true)}
              className="text-white hover:bg-white/20"
            >
              <UserPlus className="h-5 w-5" />
            </Button>
          )}

          <Sheet open={membersSheetOpen} onOpenChange={setMembersSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Users className="h-5 w-5" />
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

      {/* Chat Area with background pattern */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative">
        {/* Chat background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Messages Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 relative"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMoreMessages}
                disabled={loadingMore}
                className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
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

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="bg-white rounded-full p-6 shadow-lg mb-4">
                <MessageCircle className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">No messages yet</h3>
              <p className="text-gray-500 mt-1">Start the conversation by sending a message!</p>
            </div>
          )}

          {/* Messages List */}
          <div className="space-y-1">
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId._id === currentUserId;
              const prevMessage = index > 0 ? messages[index - 1] : undefined;
              const showDateSeparator = shouldShowDateSeparator(message, prevMessage);
              const showAvatar = !isOwnMessage && (
                index === 0 ||
                messages[index - 1].senderId._id !== message.senderId._id ||
                showDateSeparator
              );
              const showName = showAvatar;
              const isConsecutive = !showDateSeparator && index > 0 &&
                messages[index - 1].senderId._id === message.senderId._id;

              return (
                <div key={message._id}>
                  {/* Date Separator */}
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-6">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 shadow-sm">
                        {formatDateSeparator(message.createdAt)}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div
                    className={`flex items-end gap-2 ${isConsecutive ? 'mt-0.5' : 'mt-3'} ${
                      isOwnMessage ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    {!isOwnMessage && (
                      <div className="w-8 flex-shrink-0">
                        {showAvatar && (
                          <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                            <AvatarImage src={message.senderId.picture} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-red-500 to-orange-500 text-white">
                              {getInitials(message.senderId.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                      {/* Sender Name */}
                      {showName && (
                        <p className="text-xs font-medium text-gray-600 mb-1 ml-1">
                          {message.senderId.name}
                        </p>
                      )}

                      <div
                        className={`group relative px-4 py-2.5 shadow-sm ${
                          message.deleted
                            ? 'bg-gray-200 text-gray-400 italic rounded-2xl'
                            : isOwnMessage
                            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl rounded-br-md'
                            : 'bg-white text-gray-800 rounded-2xl rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {message.text}
                        </p>
                        <p
                          className={`text-[10px] mt-1.5 ${
                            message.deleted
                              ? 'text-gray-400'
                              : isOwnMessage
                              ? 'text-red-200'
                              : 'text-gray-400'
                          }`}
                        >
                          {formatMessageTime(message.createdAt)}
                        </p>

                        {/* Delete button */}
                        {isOwnMessage && !message.deleted && (
                          <button
                            onClick={() => deleteMutation.mutate(message._id)}
                            className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 bg-white hover:bg-red-50 rounded-full shadow-md"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-gray-400 hover:text-red-600" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Spacer for own messages */}
                    {isOwnMessage && <div className="w-8 flex-shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="px-4 py-2 bg-white/80 backdrop-blur-sm border-t border-gray-200 flex items-center gap-3">
            <div className="flex -space-x-1">
              {Array.from(typingUsers.entries()).slice(0, 3).map(([userId]) => {
                const member = workspaceData.members.find(m => m.user._id === userId);
                return (
                  <Avatar key={userId} className="h-6 w-6 ring-2 ring-white">
                    <AvatarImage src={member?.user.picture} />
                    <AvatarFallback className="text-[10px] bg-red-500 text-white">
                      {member ? getInitials(member.user.name) : '?'}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
              <span className="text-sm text-gray-600 font-medium">{getTypingText()}</span>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={handleTyping}
                onKeyPress={handleKeyPress}
                className="pr-4 py-6 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                disabled={sendMutation.isPending}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sendMutation.isPending}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {sendMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
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

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  MoreVertical,
  Settings,
  Check,
  CheckCheck,
  Reply,
  X,
  Mic,
  StopCircle,
  Play,
  Pause,
  ArrowDown
} from 'lucide-react';
import {
  getWorkspace,
  getMessages,
  sendMessage,
  deleteMessage,
  markMessageAsDelivered,
  markMessageAsRead,
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
  onMessageDelivered,
  onMessageRead,
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
import { useInAppNotification } from '@/components/InAppNotification';

const WorkspaceDetail = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { showNotification } = useInAppNotification();

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [membersSheetOpen, setMembersSheetOpen] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const { data: workspaceData, isLoading: loadingWorkspace } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => getWorkspace(workspaceId!),
    enabled: !!workspaceId,
  });

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

  const sendMutation = useMutation({
    mutationFn: ({
      text,
      replyTo,
      audioData,
      audioDuration,
    }: {
      text?: string;
      replyTo?: string;
      audioData?: string;
      audioDuration?: number;
    }) => sendMessage(workspaceId!, text, replyTo, audioData, audioDuration),
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

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

  const scrollToBottom = (smooth = true) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isAtBottom);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token && workspaceId) {
      initializeSocket();
      authenticateSocket(token);
      joinWorkspace(workspaceId);
      setActiveWorkspace(workspaceId);
      requestNotificationPermission();
    }

    return () => {
      if (workspaceId) {
        leaveWorkspace(workspaceId);
        setActiveWorkspace(null);
      }
    };
  }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId || !workspaceData) return;

    const unsubMessage = onNewMessage((message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });

      if (message.senderId._id !== currentUserId) {
        playReceiveSound();
        showNotification({
          senderName: message.senderId.name,
          senderPicture: message.senderId.picture,
          message: message.text,
          workspaceId: workspaceId,
          workspaceName: workspaceData?.workspace.name
        });
        showMessageNotification(
          message.senderId.name,
          message.text,
          workspaceId,
          workspaceData?.workspace.name
        );
      }

      setTimeout(() => scrollToBottom(), 100);
    });

    const unsubDelete = onMessageDeleted(({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, deleted: true, text: '[Message deleted]' } : m
        )
      );
    });

    const unsubTyping = onUserTyping(({ userId, isTyping }) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (isTyping && userId !== currentUserId) {
          const member = workspaceData.members.find(m => m.user._id === userId);
          const userName = member?.user.name || 'Someone';
          next.set(userId, userName);
        } else {
          next.delete(userId);
        }
        return next;
      });
    });

    const unsubMemberJoined = onMemberJoined((event) => {
      if (event.workspaceId === workspaceId) {
        queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
        toast({
          title: 'New Member',
          description: `${event.user.name} joined the workspace`,
        });
      }
    });

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

    const unsubDelivered = onMessageDelivered(({ messageId, userId }) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m._id === messageId) {
            const deliveredTo = m.deliveredTo || [];
            if (!deliveredTo.includes(userId)) {
              return { ...m, deliveredTo: [...deliveredTo, userId] };
            }
          }
          return m;
        })
      );
    });

    const unsubRead = onMessageRead(({ messageId, userId }) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m._id === messageId) {
            const deliveredTo = m.deliveredTo || [];
            const readBy = m.readBy || [];
            const updatedDeliveredTo = deliveredTo.includes(userId)
              ? deliveredTo
              : [...deliveredTo, userId];
            const updatedReadBy = readBy.includes(userId)
              ? readBy
              : [...readBy, userId];
            return { ...m, deliveredTo: updatedDeliveredTo, readBy: updatedReadBy };
          }
          return m;
        })
      );
    });

    return () => {
      unsubMessage();
      unsubDelete();
      unsubTyping();
      unsubMemberJoined();
      unsubMemberRemoved();
      unsubDelivered();
      unsubRead();
    };
  }, [workspaceId, workspaceData, currentUserId, queryClient, navigate, toast]);

  useEffect(() => {
    if (!loadingMessages && messages.length > 0) {
      setTimeout(() => scrollToBottom(false), 100);
    }
  }, [loadingMessages]);

  // Mark messages as delivered and read
  useEffect(() => {
    if (!workspaceId || !currentUserId || messages.length === 0) return;

    // Mark messages as delivered when they appear
    const undeliveredMessages = messages.filter(
      (m) => m.senderId._id !== currentUserId &&
      m.deliveredTo &&
      !m.deliveredTo.includes(currentUserId)
    );

    undeliveredMessages.forEach((msg) => {
      markMessageAsDelivered(workspaceId, msg._id).catch((err) =>
        console.error('Failed to mark as delivered:', err)
      );
    });

    // Mark messages as read when page is visible
    if (!document.hidden) {
      const unreadMessages = messages.filter(
        (m) => m.senderId._id !== currentUserId &&
        m.readBy &&
        !m.readBy.includes(currentUserId)
      );

      unreadMessages.forEach((msg) => {
        markMessageAsRead(workspaceId, msg._id).catch((err) =>
          console.error('Failed to mark as read:', err)
        );
      });
    }

    // Listen for visibility changes to mark messages as read
    const handleVisibilityChange = () => {
      if (!document.hidden && messages.length > 0) {
        const unreadMessages = messages.filter(
          (m) => m.senderId._id !== currentUserId &&
          m.readBy &&
          !m.readBy.includes(currentUserId)
        );

        unreadMessages.forEach((msg) => {
          markMessageAsRead(workspaceId, msg._id).catch((err) =>
            console.error('Failed to mark as read:', err)
          );
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [messages, workspaceId, currentUserId]);

  const handleSendMessage = async () => {
    const text = messageText.trim();
    if (!text) return;

    const replyTo = replyToMessage?._id;

    setMessageText('');
    setReplyToMessage(null);
    sendTypingIndicator(workspaceId!, false);
    playSendSound();

    await sendMutation.mutateAsync({ text, replyTo });
    setTimeout(() => scrollToBottom(), 50);
  };

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Ctrl+Enter or Cmd+Enter sends the message
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage();
    }
    // Plain Enter creates a new line (default textarea behavior)
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        setAudioChunks(chunks);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access to record voice messages',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioChunks([]);
    setRecordingTime(0);
  };

  const sendAudioMessage = async () => {
    if (audioChunks.length === 0) return;

    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      const replyTo = replyToMessage?._id;

      setAudioChunks([]);
      setRecordingTime(0);
      setReplyToMessage(null);
      playSendSound();

      await sendMutation.mutateAsync({
        audioData: base64Audio,
        audioDuration: recordingTime,
        replyTo,
      });

      setTimeout(() => scrollToBottom(), 50);
    };

    reader.readAsDataURL(audioBlob);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

  const shouldShowDateSeparator = (currentMsg: Message, prevMsg?: Message) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const prevDate = new Date(prevMsg.createdAt).toDateString();
    return currentDate !== prevDate;
  };

  const getTypingText = () => {
    const names = Array.from(typingUsers.values());
    if (names.length === 0) return '';
    if (names.length === 1) return `${names[0]} is typing...`;
    if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`;
    return `${names[0]} and ${names.length - 1} others are typing...`;
  };

  const renderMessageStatus = (message: Message) => {
    // Only show status for own messages
    if (message.senderId._id !== currentUserId || message.deleted) {
      return null;
    }

    const isRead = message.readBy && message.readBy.length > 0;
    const isDelivered = message.deliveredTo && message.deliveredTo.length > 0;

    if (isRead) {
      // Blue double check for read
      return (
        <CheckCheck className="inline-block h-3.5 w-3.5 ml-1 text-blue-300" />
      );
    } else if (isDelivered) {
      // Gray double check for delivered
      return (
        <CheckCheck className="inline-block h-3.5 w-3.5 ml-1 text-blue-200 opacity-60" />
      );
    } else {
      // Single check for sent
      return (
        <Check className="inline-block h-3.5 w-3.5 ml-1 text-blue-200 opacity-60" />
      );
    }
  };

  const AudioPlayer = ({ audioData, duration, isOwnMessage }: { audioData: string; duration: number; isOwnMessage: boolean }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
      if (!audioRef.current) return;

      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className={`flex-shrink-0 p-2 rounded-full transition-colors ${
            isOwnMessage
              ? 'bg-blue-500 hover:bg-blue-400'
              : 'bg-slate-200 hover:bg-slate-300'
          }`}
        >
          {isPlaying ? (
            <Pause className={`h-4 w-4 ${isOwnMessage ? 'text-white' : 'text-slate-700'}`} />
          ) : (
            <Play className={`h-4 w-4 ${isOwnMessage ? 'text-white' : 'text-slate-700'}`} />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className={`h-1 rounded-full ${isOwnMessage ? 'bg-blue-400' : 'bg-slate-300'} overflow-hidden`}>
            <div
              className={`h-full ${isOwnMessage ? 'bg-white' : 'bg-blue-600'} transition-all`}
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-slate-500'}`}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
        <audio
          ref={audioRef}
          src={audioData}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          preload="metadata"
        />
      </div>
    );
  };

  if (loadingWorkspace || loadingMessages) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-slate-600 mx-auto" />
          <p className="mt-3 text-slate-500">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!workspaceData) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-slate-900">Workspace not found</h2>
          <p className="text-slate-500 mt-2">This workspace may have been deleted</p>
          <Button onClick={() => navigate('/workspaces')} className="mt-6">
            Back to Workspaces
          </Button>
        </div>
      </div>
    );
  }

  const { workspace, members, pendingInvites, currentUserRole } = workspaceData;

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Modern Header - Mobile Optimized */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/workspaces')}
            className="hover:bg-slate-100 flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
              {getInitials(workspace.name)}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{workspace.name}</h1>
              <p className="text-xs text-slate-500 hidden sm:block">{members.length} {members.length === 1 ? 'member' : 'members'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {currentUserRole === 'owner' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInviteDialogOpen(true)}
              className="hover:bg-slate-100"
            >
              <UserPlus className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Invite</span>
            </Button>
          )}

          <Sheet open={membersSheetOpen} onOpenChange={setMembersSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                <Users className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Members</span>
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

      {/* Chat Messages Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6 relative"
      >
        {hasMore && (
          <div className="text-center mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={loadMoreMessages}
              disabled={loadingMore}
              className="bg-white shadow-sm"
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

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="bg-slate-100 rounded-full p-6 mb-4">
              <Send className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Start the conversation</h3>
            <p className="text-slate-500 mt-1 max-w-sm">Send your first message to get things rolling!</p>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-1">
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
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-8">
                    <div className="bg-white px-4 py-1.5 rounded-full text-xs font-medium text-slate-600 shadow-sm border border-slate-200">
                      {formatDateSeparator(message.createdAt)}
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-end gap-2 ${isConsecutive ? 'mt-1' : 'mt-4'} ${
                    isOwnMessage ? 'flex-row-reverse' : ''
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="w-8 flex-shrink-0">
                      {showAvatar && (
                        <Avatar className="h-8 w-8 ring-2 ring-white shadow">
                          <AvatarImage src={message.senderId.picture} />
                          <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                            {getInitials(message.senderId.name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}

                  <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    {showName && (
                      <p className="text-xs font-medium text-slate-600 mb-1 ml-1">
                        {message.senderId.name}
                      </p>
                    )}

                    <div
                      className={`group relative px-4 py-2.5 ${
                        message.deleted
                          ? 'bg-slate-200 text-slate-400 italic rounded-2xl'
                          : isOwnMessage
                          ? 'bg-blue-600 text-white rounded-2xl rounded-br-md shadow-md'
                          : 'bg-white text-slate-800 rounded-2xl rounded-bl-md shadow-sm border border-slate-100'
                      }`}
                    >
                      {/* Show quoted message if this is a reply */}
                      {message.replyTo && (
                        <div
                          className={`mb-2 pb-2 border-l-2 pl-3 ${
                            isOwnMessage
                              ? 'border-blue-400 bg-blue-500 bg-opacity-20'
                              : 'border-slate-300 bg-slate-50'
                          } rounded-r`}
                        >
                          <p
                            className={`text-[10px] font-medium ${
                              isOwnMessage ? 'text-blue-200' : 'text-slate-600'
                            }`}
                          >
                            {message.replyTo.senderId.name}
                          </p>
                          <p
                            className={`text-xs ${
                              message.replyTo.deleted
                                ? 'italic'
                                : ''
                            } ${
                              isOwnMessage ? 'text-blue-100' : 'text-slate-600'
                            } truncate`}
                          >
                            {message.replyTo.deleted
                              ? '[Message deleted]'
                              : message.replyTo.text}
                          </p>
                        </div>
                      )}

                      {message.type === 'audio' && (message.audioUrl || message.audioData) ? (
                        <AudioPlayer
                          audioData={message.audioUrl
                            ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://slimfile-fb.onrender.com'}${message.audioUrl}`
                            : message.audioData || ''}
                          duration={message.audioDuration || 0}
                          isOwnMessage={isOwnMessage}
                        />
                      ) : (
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {message.text}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-1.5">
                        <p
                          className={`text-[10px] ${
                            message.deleted
                              ? 'text-slate-400'
                              : isOwnMessage
                              ? 'text-blue-200'
                              : 'text-slate-400'
                          }`}
                        >
                          {formatMessageTime(message.createdAt)}
                        </p>
                        {renderMessageStatus(message)}
                      </div>

                      {/* Reply and Delete buttons */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1 ${
                          isOwnMessage ? '-left-20' : '-right-20'
                        }`}
                      >
                        {!message.deleted && (
                          <button
                            onClick={() => setReplyToMessage(message)}
                            className="p-2 bg-white hover:bg-slate-50 rounded-full shadow-md border border-slate-200"
                            title="Reply to this message"
                          >
                            <Reply className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600" />
                          </button>
                        )}
                        {isOwnMessage && !message.deleted && (
                          <button
                            onClick={() => deleteMutation.mutate(message._id)}
                            className="p-2 bg-white hover:bg-slate-50 rounded-full shadow-md border border-slate-200"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {isOwnMessage && <div className="w-8 flex-shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Scroll to Bottom Button */}
        {showScrollButton && (
          <div className="absolute bottom-6 right-6 z-10">
            <Button
              onClick={() => scrollToBottom()}
              size="icon"
              className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
              title="Scroll to bottom"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Typing Indicator */}
      {typingUsers.size > 0 && (
        <div className="px-6 py-2 bg-white border-t border-slate-100 flex items-center gap-3">
          <div className="flex -space-x-1">
            {Array.from(typingUsers.entries()).slice(0, 3).map(([userId]) => {
              const member = workspaceData.members.find(m => m.user._id === userId);
              return (
                <Avatar key={userId} className="h-6 w-6 ring-2 ring-white">
                  <AvatarImage src={member?.user.picture} />
                  <AvatarFallback className="text-[10px] bg-blue-500 text-white">
                    {member ? getInitials(member.user.name) : '?'}
                  </AvatarFallback>
                </Avatar>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
            <span className="text-sm text-slate-600">{getTypingText()}</span>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        {/* Reply Preview */}
        {replyToMessage && (
          <div className="max-w-4xl mx-auto mb-3 bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Reply className="h-3.5 w-3.5 text-slate-500" />
                <p className="text-xs font-medium text-slate-700">
                  Replying to {replyToMessage.senderId.name}
                </p>
              </div>
              <p className="text-sm text-slate-600 truncate">
                {replyToMessage.deleted ? '[Message deleted]' : replyToMessage.text}
              </p>
            </div>
            <button
              onClick={() => setReplyToMessage(null)}
              className="p-1 hover:bg-slate-200 rounded-full transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        )}

        <div className="max-w-4xl mx-auto flex items-end gap-3">
          {isRecording ? (
            /* Recording UI */
            <div className="flex-1 flex items-center gap-3 bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">Recording</span>
                <span className="text-sm text-blue-600">{formatRecordingTime(recordingTime)}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={cancelRecording}
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={stopRecording}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Stop
                </Button>
              </div>
            </div>
          ) : audioChunks.length > 0 ? (
            /* Audio Preview UI */
            <div className="flex-1 flex items-center gap-3 bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-3">
              <Mic className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-700">Voice message ready</p>
                <p className="text-xs text-blue-600">{formatRecordingTime(recordingTime)}</p>
              </div>
              <Button
                onClick={cancelRecording}
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            /* Normal Text Input */
            <>
              <Textarea
                placeholder="Type a message"
                value={messageText}
                onChange={handleTyping}
                onKeyDown={handleKeyPress}
                className="flex-1 border-slate-200 focus-visible:ring-blue-500 min-h-[40px] max-h-[120px] resize-none"
                disabled={sendMutation.isPending}
                rows={1}
              />
              <Button
                onClick={startRecording}
                size="icon"
                variant="outline"
                className="h-10 w-10 flex-shrink-0 border-slate-200 hover:bg-slate-50"
                title="Record voice message"
              >
                <Mic className="h-5 w-5 text-slate-600" />
              </Button>
            </>
          )}

          <Button
            onClick={audioChunks.length > 0 ? sendAudioMessage : handleSendMessage}
            disabled={
              (audioChunks.length === 0 && !messageText.trim()) ||
              sendMutation.isPending ||
              isRecording
            }
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 h-10 w-10 flex-shrink-0"
          >
            {sendMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

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

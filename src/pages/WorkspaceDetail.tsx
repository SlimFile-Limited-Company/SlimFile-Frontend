import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MentionInput } from '@/components/workspace/MentionInput';
import { MentionText } from '@/components/workspace/MentionText';
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
  ArrowDown,
  Edit2
} from 'lucide-react';
import {
  getWorkspace,
  getWorkspaces,
  getMessages,
  sendMessage,
  sendMessageWithAttachments,
  editMessage,
  deleteMessage,
  markMessageAsDelivered,
  markMessageAsRead,
  Message,
  Workspace,
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
  onMessageEdited,
  onUserTyping,
  onMessageDelivered,
  onMessageRead,
  onMentioned,
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
import { FileAttachmentsList } from '@/components/workspace/FileAttachment';
import { FileUploadInput } from '@/components/workspace/FileUploadInput';
import { EditMessageDialog } from '@/components/workspace/EditMessageDialog';

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

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

  const { data: allWorkspacesData } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
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

    const unsubEdited = onMessageEdited((editedMessage) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === editedMessage._id ? editedMessage : m
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

    const unsubMention = onMentioned((event) => {
      if (!document.hidden) {
        showNotification({
          senderName: event.senderName,
          message: `mentioned you: ${event.messagePreview}`,
          workspaceId: event.workspaceId
        });
      }
    });

    return () => {
      unsubMessage();
      unsubDelete();
      unsubEdited();
      unsubTyping();
      unsubMemberJoined();
      unsubMemberRemoved();
      unsubDelivered();
      unsubRead();
      unsubMention();
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
    if (!text && selectedFiles.length === 0) return;

    const replyTo = replyToMessage?._id;
    const filesToSend = [...selectedFiles];

    setMessageText('');
    setReplyToMessage(null);
    setSelectedFiles([]);
    sendTypingIndicator(workspaceId!, false);
    playSendSound();

    try {
      // Use file upload if there are files
      if (filesToSend.length > 0) {
        await sendMessageWithAttachments(workspaceId!, text || undefined, replyTo, filesToSend);
      } else {
        await sendMutation.mutateAsync({ text, replyTo });
      }
      setTimeout(() => scrollToBottom(), 50);
    } catch (error) {
      toast({
        title: 'Failed to send message',
        description: (error as Error).message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleEditMessage = async (messageId: string, newText: string) => {
    await editMessage(workspaceId!, messageId, newText);
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
      return <CheckCheck className="inline-block h-3 w-3 ml-0.5 text-sky-400" />;
    } else if (isDelivered) {
      return <CheckCheck className="inline-block h-3 w-3 ml-0.5" style={{ color: 'rgba(255,255,255,0.4)' }} />;
    } else {
      return <Check className="inline-block h-3 w-3 ml-0.5" style={{ color: 'rgba(255,255,255,0.4)' }} />;
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
      <div className="flex items-center gap-2.5 min-w-[180px]">
        <button
          onClick={togglePlay}
          className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: isOwnMessage ? 'rgba(255,255,255,0.2)' : 'rgba(220,38,38,0.25)' }}
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5 text-white" />
          ) : (
            <Play className="h-3.5 w-3.5 text-white" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: isOwnMessage ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                background: isOwnMessage ? 'rgba(255,255,255,0.8)' : '#5288c1'
              }}
            />
          </div>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
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
      <div className="h-screen flex items-center justify-center" style={{ background: '#1a2633' }}>
        <div className="text-center">
          <Loader2 className="h-9 w-9 animate-spin text-[#5288c1] mx-auto" />
          <p className="mt-3 text-sm text-white/40">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!workspaceData) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: '#1a2633' }}>
        <div className="text-center p-8 rounded-2xl" style={{ background: '#1f2b38', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-lg font-semibold text-white">Workspace not found</h2>
          <p className="text-white/40 text-sm mt-2">This workspace may have been deleted</p>
          <Button onClick={() => navigate('/workspaces')} className="mt-6 bg-[#5288c1] hover:bg-[#3a6d9e] text-white">
            Back to Workspaces
          </Button>
        </div>
      </div>
    );
  }

  const { workspace, members, pendingInvites, currentUserRole } = workspaceData;

  const allWorkspaces: Workspace[] = allWorkspacesData ?? [];

  // Strip @[Name](id) → @Name for plain-text previews (reply quotes, etc.)
  const stripMentions = (text: string) =>
    text.replace(/@\[([^\]]+)\]\([a-f0-9]{24}\)/g, '@$1');

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: '#0d1117' }}>

      {/* ─── Left panel: workspace list ───
           Mobile: full screen when mobileChatOpen=false, hidden when mobileChatOpen=true
           Desktop (md+): always visible, fixed 288px wide
      ─── */}
      <aside
        className={`
          flex-col flex-shrink-0
          w-full md:w-[300px]
          ${mobileChatOpen ? 'hidden md:flex' : 'flex'}
        `}
        style={{ background: '#212d3b', borderRight: '1px solid rgba(255,255,255,0.04)' }}
      >
        {/* Header — Telegram style */}
        <div
          className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ background: '#1f2b38', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <button
            onClick={() => navigate('/workspaces')}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            title="Back to Workspaces"
          >
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
          <span className="text-[16px] font-semibold text-white flex-1">Workspaces</span>
        </div>

        {/* Workspace list */}
        <div className="flex-1 overflow-y-auto">
          {allWorkspaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="h-14 w-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Users className="h-6 w-6 text-white/40" />
              </div>
              <p className="text-white/60 text-sm font-medium">No workspaces yet</p>
              <p className="text-white/30 text-xs mt-1">Create one to start chatting</p>
              <button
                onClick={() => navigate('/workspaces')}
                className="mt-4 px-4 py-2 rounded-full text-xs font-medium text-white transition-colors"
                style={{ background: '#5288c1' }}
              >
                Create Workspace
              </button>
            </div>
          ) : (
            allWorkspaces.map((ws) => {
              const isActive = ws._id === workspaceId;
              const initials = ws.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
              // Telegram-style avatar colours based on first char
              const avatarColors = ['#5288c1','#3d9a6e','#b5562e','#6c5faa','#5288c1','#4b8b9e','#9c6b31'];
              const colorIndex = ws.name.charCodeAt(0) % avatarColors.length;
              const avatarBg = avatarColors[colorIndex];
              return (
                <button
                  key={ws._id}
                  onClick={() => {
                    navigate(`/workspaces/${ws._id}`);
                    setMobileChatOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left"
                  style={{ background: isActive ? '#2b5278' : 'transparent' }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                    style={{ background: avatarBg }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium truncate leading-tight text-white">
                      {ws.name}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: isActive ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.35)' }}>
                      {ws.description || 'Tap to open chat'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ─── Right panel: chat ───
           Mobile: full screen when mobileChatOpen=true, hidden otherwise
           Desktop (md+): always visible, takes remaining space
      ─── */}
      <div
        className={`flex-col min-w-0 flex-1 ${mobileChatOpen ? 'flex' : 'hidden md:flex'}`}
        style={{ background: '#1a2633' }}
      >
      {/* Telegram-style Header */}
      <div
        className="flex items-center justify-between px-3 sm:px-4 py-2.5 flex-shrink-0"
        style={{ background: '#1f2b38', borderBottom: '1px solid #151f29' }}
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Mobile: tap to go back to workspace list */}
          <button
            onClick={() => setMobileChatOpen(false)}
            className="p-1.5 rounded-full transition-colors hover:bg-white/10 flex-shrink-0 md:hidden"
          >
            <ArrowLeft className="h-5 w-5 text-white/80" />
          </button>
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#5288c1] to-[#3a6d9e] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {getInitials(workspace.name)}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#1f2b38]" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-white text-sm sm:text-[15px] truncate leading-tight">{workspace.name}</h1>
              <p className="text-xs text-white/50 leading-tight mt-0.5">
                {members.length} {members.length === 1 ? 'member' : 'members'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          {currentUserRole === 'owner' && (
            <button
              onClick={() => setInviteDialogOpen(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Invite member"
            >
              <UserPlus className="h-5 w-5 text-white/70" />
            </button>
          )}


          <Sheet open={membersSheetOpen} onOpenChange={setMembersSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Members">
                <Users className="h-5 w-5 text-white/70" />
              </button>
            </SheetTrigger>
            <SheetContent className="bg-[#1f2b38] border-[#151f29]">
              <SheetHeader>
                <SheetTitle className="text-white">Workspace Members</SheetTitle>
                <SheetDescription className="text-white/50">
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

      {/* Chat Messages Area — Telegram background */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-4 py-3 relative"
        style={{ background: '#1a2633' }}
      >
        {hasMore && (
          <div className="text-center mb-4">
            <button
              onClick={loadMoreMessages}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-white/70 bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
            >
              {loadingMore ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5" />
              )}
              Load earlier messages
            </button>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="rounded-full p-5 mb-4" style={{ background: 'rgba(82,136,193,0.15)' }}>
              <Send className="h-9 w-9 text-[#5288c1]" />
            </div>
            <h3 className="text-base font-semibold text-white/80">No messages yet</h3>
            <p className="text-white/40 text-sm mt-1 max-w-xs">Be the first to send a message in this workspace</p>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-0.5">
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
                  <div className="flex items-center justify-center my-6">
                    <div
                      className="px-4 py-1 rounded-full text-xs font-medium text-white/70"
                      style={{ background: 'rgba(0,0,0,0.35)' }}
                    >
                      {formatDateSeparator(message.createdAt)}
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-end gap-1.5 ${isConsecutive ? 'mt-0.5' : 'mt-3'} ${
                    isOwnMessage ? 'flex-row-reverse' : ''
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="w-7 flex-shrink-0 self-end mb-0.5">
                      {showAvatar ? (
                        <Avatar className="h-7 w-7 ring-1 ring-white/10">
                          <AvatarImage src={message.senderId.picture} />
                          <AvatarFallback className="text-[10px] bg-gradient-to-br from-[#5288c1] to-[#3a6d9e] text-white font-bold">
                            {getInitials(message.senderId.name)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-7" />
                      )}
                    </div>
                  )}

                  <div className={`max-w-[80%] sm:max-w-[65%] min-w-0 flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    {showName && (
                      <p className="text-xs font-semibold text-[#5288c1] mb-1 ml-3">
                        {message.senderId.name}
                      </p>
                    )}

                    <div
                      className={`group relative px-3 py-2 w-full ${
                        message.deleted
                          ? 'italic rounded-2xl'
                          : isOwnMessage
                          ? 'rounded-2xl rounded-br-sm'
                          : 'rounded-2xl rounded-bl-sm'
                      }`}
                      style={
                        message.deleted
                          ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }
                          : isOwnMessage
                          ? { background: '#2b5278', color: '#fff' }
                          : { background: '#182533', color: '#e8e8e8' }
                      }
                    >
                      {/* Reply quote */}
                      {message.replyTo && (
                        <div
                          className="mb-2 pb-2 pl-3 border-l-2 rounded-r overflow-hidden min-w-0"
                          style={
                            isOwnMessage
                              ? { borderColor: '#5b9bd5', background: 'rgba(91,155,213,0.15)' }
                              : { borderColor: '#5288c1', background: 'rgba(82,136,193,0.1)' }
                          }
                        >
                          <p className="text-[10px] font-semibold" style={{ color: isOwnMessage ? '#7db8e8' : '#f87171' }}>
                            {message.replyTo.senderId.name}
                          </p>
                          <p className={`text-xs truncate ${message.replyTo.deleted ? 'italic' : ''}`}
                            style={{ color: isOwnMessage ? 'rgba(255,255,255,0.6)' : 'rgba(232,232,232,0.6)' }}>
                            {message.replyTo.deleted ? '[Message deleted]' : stripMentions(message.replyTo.text)}
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
                        <MentionText
                          text={message.text}
                          currentUserId={currentUserId}
                          isOwnMessage={isOwnMessage}
                          className="text-sm whitespace-pre-wrap break-words break-all leading-relaxed"
                        />
                      )}

                      {/* Display attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2">
                          <FileAttachmentsList
                            attachments={message.attachments}
                            isOwnMessage={isOwnMessage}
                          />
                        </div>
                      )}

                      {/* Timestamp + status — Telegram-style bottom-right inline */}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span
                          className="text-[10px] leading-none"
                          style={{ color: message.deleted ? 'rgba(255,255,255,0.3)' : isOwnMessage ? 'rgba(255,255,255,0.5)' : 'rgba(232,232,232,0.4)' }}
                        >
                          {formatMessageTime(message.createdAt)}
                          {message.editedAt && <span className="ml-1 italic">edited</span>}
                        </span>
                        {renderMessageStatus(message)}
                      </div>

                      {/* Action buttons — appear on hover */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex gap-0.5 rounded-xl p-0.5 z-20 ${
                          isOwnMessage ? '-left-24' : '-right-24'
                        }`}
                        style={{ background: '#1f2b38', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        {!message.deleted && (
                          <button
                            onClick={() => setReplyToMessage(message)}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            title="Reply"
                          >
                            <Reply className="h-3.5 w-3.5 text-white/60" />
                          </button>
                        )}
                        {isOwnMessage && !message.deleted && message.type === 'text' && (
                          <button
                            onClick={() => { setEditingMessage(message); setIsEditDialogOpen(true); }}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-white/60" />
                          </button>
                        )}
                        {isOwnMessage && !message.deleted && (
                          <button
                            onClick={() => deleteMutation.mutate(message._id)}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-[#5288c1]/70" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Scroll to Bottom Button */}
        {showScrollButton && (
          <div className="absolute bottom-5 right-5 z-10">
            <button
              onClick={() => scrollToBottom()}
              className="h-10 w-10 rounded-full flex items-center justify-center shadow-xl transition-colors"
              style={{ background: '#1f2b38', border: '1px solid rgba(255,255,255,0.12)' }}
              title="Scroll to bottom"
            >
              <ArrowDown className="h-4 w-4 text-white/70" />
            </button>
          </div>
        )}
      </div>

      {/* Typing Indicator */}
      {typingUsers.size > 0 && (
        <div
          className="px-4 py-2 flex items-center gap-2.5"
          style={{ background: '#1f2b38', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex -space-x-1.5">
            {Array.from(typingUsers.entries()).slice(0, 3).map(([userId]) => {
              const member = workspaceData.members.find(m => m.user._id === userId);
              return (
                <Avatar key={userId} className="h-5 w-5 ring-1 ring-[#1f2b38]">
                  <AvatarImage src={member?.user.picture} />
                  <AvatarFallback className="text-[9px] bg-gradient-to-br from-[#5288c1] to-[#3a6d9e] text-white font-bold">
                    {member ? getInitials(member.user.name) : '?'}
                  </AvatarFallback>
                </Avatar>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#5288c1', animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#5288c1', animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#5288c1', animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-white/40">{getTypingText()}</span>
          </div>
        </div>
      )}

      {/* Message Input — Telegram-style */}
      <div
        className="px-3 sm:px-4 py-1 flex-shrink-0"
        style={{ background: '#1f2b38', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Reply Preview */}
        {replyToMessage && (
          <div
            className="max-w-3xl mx-auto mb-2 px-3 py-2 rounded-xl flex items-start gap-3"
            style={{ background: 'rgba(255,255,255,0.06)', borderLeft: '3px solid #5288c1' }}
          >
            <Reply className="h-3.5 w-3.5 text-[#5288c1] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#5288c1] mb-0.5">
                {replyToMessage.senderId.name}
              </p>
              <p className="text-xs text-white/50 truncate">
                {replyToMessage.deleted ? '[Message deleted]' : stripMentions(replyToMessage.text)}
              </p>
            </div>
            <button
              onClick={() => setReplyToMessage(null)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X className="h-3.5 w-3.5 text-white/40" />
            </button>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {isRecording ? (
            /* Recording UI — full-width pill */
            <div
              className="flex items-center gap-3 rounded-full px-4 py-2.5"
              style={{ background: '#253545', border: '1px solid rgba(82,136,193,0.3)' }}
            >
              <div className="h-2.5 w-2.5 bg-[#5288c1] rounded-full animate-pulse flex-shrink-0" />
              <span className="text-sm font-medium text-[#5288c1]">Recording</span>
              <span className="text-sm text-white/50 flex-1">{formatRecordingTime(recordingTime)}</span>
              <button
                onClick={cancelRecording}
                className="text-xs text-white/50 hover:text-white/80 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={stopRecording}
                className="text-xs font-medium text-white px-3 py-1 rounded-full bg-[#5288c1] hover:bg-[#3a6d9e] transition-colors"
              >
                Stop
              </button>
            </div>
          ) : audioChunks.length > 0 ? (
            /* Audio Preview UI — full-width pill */
            <div
              className="flex items-center gap-3 rounded-full px-4 py-2.5"
              style={{ background: '#253545', border: '1px solid rgba(82,136,193,0.3)' }}
            >
              <Mic className="h-4 w-4 text-[#5288c1] flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white/80">Voice message ready</p>
                <p className="text-[11px] text-white/40">{formatRecordingTime(recordingTime)}</p>
              </div>
              <button
                onClick={cancelRecording}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 text-white/40" />
              </button>
              <button
                onClick={sendAudioMessage}
                disabled={sendMutation.isPending}
                className="h-8 w-8 rounded-full flex items-center justify-center transition-all disabled:opacity-40 hover:brightness-110 flex-shrink-0"
                style={{ background: '#5288c1' }}
              >
                {sendMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Send className="h-3.5 w-3.5 text-white" />
                )}
              </button>
            </div>
          ) : (
            /* Normal Text Input — all inline in one pill */
            <div
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 focus-within:ring-1 focus-within:ring-[#5288c1]/40 transition-all"
              style={{ background: '#253545', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <FileUploadInput
                onFilesSelected={setSelectedFiles}
                selectedFiles={selectedFiles}
                onRemoveFile={(index) => {
                  setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                }}
                onClearFiles={() => setSelectedFiles([])}
                disabled={sendMutation.isPending}
              />
              <MentionInput
                placeholder="Message..."
                value={messageText}
                onChange={(value) => {
                  setMessageText(value);
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                  }
                  sendTypingIndicator(workspaceId!, true);
                  typingTimeoutRef.current = setTimeout(() => {
                    sendTypingIndicator(workspaceId!, false);
                  }, 3000);
                }}
                onKeyDown={handleKeyPress}
                members={workspaceData?.members || []}
                disabled={sendMutation.isPending}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 py-0 text-white/90 placeholder:text-white/30 text-sm self-center"
              />
              <button
                onClick={startRecording}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 self-center"
                title="Record voice message"
              >
                <Mic className="h-4 w-4 text-white/40" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={
                  (!messageText.trim() && selectedFiles.length === 0) ||
                  sendMutation.isPending
                }
                className="h-7 w-7 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 flex-shrink-0 self-center"
                style={{ background: '#5288c1' }}
              >
                {sendMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                ) : (
                  <Send className="h-3 w-3 text-white" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <InviteMemberDialog
        workspaceId={workspaceId!}
        workspaceName={workspace.name}
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />

      <EditMessageDialog
        message={editingMessage}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingMessage(null);
        }}
        onSave={handleEditMessage}
        members={workspaceData?.members}
      />
      </div>
    </div>
  );
};

export default WorkspaceDetail;

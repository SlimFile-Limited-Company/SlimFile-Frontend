import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
type SocketInstance = ReturnType<typeof io>;
import {
  Send, ArrowLeft, Search, Plus, Mic, Paperclip,
  Check, CheckCheck, X, Smile, Reply, Trash2, Star, Pencil,
  BellOff, Bell, ChevronDown, MessageCircle, UserPlus, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const API = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api').replace('/api', '');
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserMini { _id: string; name: string; email: string; picture?: string; }
interface Reaction { emoji: string; userId: string; }
interface DMMessage {
  _id: string;
  conversationId: string;
  senderId: UserMini;
  text: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number;
  replyTo?: { _id: string; text: string; senderId: { _id: string; name: string }; type: string };
  reactions: Reaction[];
  status: 'sent' | 'delivered' | 'read';
  deletedAt?: string;
  deletedForAll?: boolean;
  editedAt?: string;
  starredBy: string[];
  createdAt: string;
}
interface Conversation {
  _id: string;
  participants: UserMini[];
  lastMessage?: DMMessage;
  lastMessageAt: string;
  unreadCounts: Record<string, number>;
  mutedBy: string[];
}
interface ChatRequest {
  _id: string;
  senderName: string;
  senderEmail: string;
  senderPicture?: string;
  sender?: UserMini;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getToken() { return localStorage.getItem('jwt') || ''; }
function getCurrentUserId(): string {
  try {
    const payload = JSON.parse(atob(getToken().split('.')[1]));
    return payload.id || payload._id || '';
  } catch { return ''; }
}
function getOtherParticipant(convo: Conversation, myId: string): UserMini {
  return convo.participants.find(p => p._id !== myId) || convo.participants[0];
}
function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000 && d.getDate() === now.getDate()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function avatarUrl(user?: UserMini | null): string {
  if (user?.picture) return user.picture;
  const name = encodeURIComponent(user?.name || '?');
  return `https://ui-avatars.com/api/?name=${name}&background=dc2626&color=fff&size=128`;
}


// ─── Audio Player ─────────────────────────────────────────────────────────────
function AudioPlayer({ fileUrl, isMine }: { fileUrl: string; isMine: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const ref = useRef<HTMLAudioElement>(null);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play().catch(() => {}); setPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!ref.current || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    ref.current.currentTime = ((e.clientX - r.left) / r.width) * duration;
  };

  const fmt = (s: number) =>
    !s || isNaN(s) ? '0:00' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const pct = duration ? (currentTime / duration) * 100 : 0;
  const bars = [3, 5, 8, 6, 10, 7, 4, 9, 6, 8, 5, 10, 7, 4, 9, 6, 5, 8, 4, 6];

  return (
    <div className="flex items-center gap-2.5 w-[210px] py-0.5" onClick={e => e.stopPropagation()}>
      <audio
        ref={ref}
        src={fileUrl}
        onTimeUpdate={() => ref.current && setCurrentTime(ref.current.currentTime)}
        onLoadedMetadata={() => ref.current && setDuration(ref.current.duration)}
        onEnded={() => setPlaying(false)}
        className="hidden"
        preload="metadata"
      />
      <button
        onClick={toggle}
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors
          ${isMine ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
      >
        {playing ? (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-end gap-[2px] h-7 cursor-pointer" onClick={seek}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{ height: `${h * 2.4}px` }}
              className={`flex-1 rounded-full transition-colors
                ${(i / bars.length) * 100 < pct
                  ? (isMine ? 'bg-white' : 'bg-gray-600')
                  : (isMine ? 'bg-white/35' : 'bg-gray-300')}`}
            />
          ))}
        </div>
        <span className={`text-[9px] font-medium ${isMine ? 'text-white/55' : 'text-gray-400'}`}>
          {playing ? fmt(currentTime) : fmt(duration)}
        </span>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const myId = getCurrentUserId();

  // ── Auth guard
  useEffect(() => {
    if (!getToken()) navigate('/login');
  }, []);

  // ── State
  const [conversations, setConversations]     = useState<Conversation[]>([]);
  const [requests, setRequests]               = useState<ChatRequest[]>([]);
  const [activeConvoId, setActiveConvoId]     = useState<string | null>(null);
  const [messages, setMessages]               = useState<DMMessage[]>([]);
  const [tab, setTab]                         = useState<'chats' | 'requests'>('chats');
  const [searchQ, setSearchQ]                 = useState('');
  const [userResults, setUserResults]         = useState<UserMini[]>([]);
  const [showNewChat, setShowNewChat]         = useState(false);
  const [newChatEmail, setNewChatEmail]       = useState('');
  const [sendingRequest, setSendingRequest]   = useState(false);
  const [text, setText]                       = useState('');
  const [sending, setSending]                 = useState(false);
  const [replyTo, setReplyTo]                 = useState<DMMessage | null>(null);
  const [editingMsg, setEditingMsg]           = useState<DMMessage | null>(null);
  const [selectedMsg, setSelectedMsg]         = useState<string | null>(null);
  const [partnerTyping, setPartnerTyping]     = useState(false);
  const [isRecording, setIsRecording]         = useState(false);
  const [loadingMsgs, setLoadingMsgs]         = useState(false);
  const [hasMore, setHasMore]                 = useState(true);
  const [showScrollBtn, setShowScrollBtn]     = useState(false);
  const [emojiInputMsgId, setEmojiInputMsgId] = useState<string | null>(null);

  const socketRef   = useRef<SocketInstance | null>(null);
  const msgEndRef   = useRef<HTMLDivElement>(null);
  const fileInputRef= useRef<HTMLInputElement>(null);
  const mediaRef    = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();
  const messagesBoxRef = useRef<HTMLDivElement>(null);

  const activeConvo = conversations.find(c => c._id === activeConvoId);
  const partner = activeConvo ? getOtherParticipant(activeConvo, myId) : null;

  // ── Push notification setup
  useEffect(() => {
    console.log('[Push] Setup starting. VAPID_PUBLIC_KEY present:', !!VAPID_PUBLIC_KEY);
    console.log('[Push] VAPID key (first 20 chars):', VAPID_PUBLIC_KEY?.slice(0, 20));
    if (!('serviceWorker' in navigator)) { console.log('[Push] SKIP: no serviceWorker support'); return; }
    if (!('PushManager' in window)) { console.log('[Push] SKIP: no PushManager support'); return; }
    if (!VAPID_PUBLIC_KEY) { console.log('[Push] SKIP: VAPID_PUBLIC_KEY is empty'); return; }

    navigator.serviceWorker.ready.then(async (reg) => {
      console.log('[Push] SW ready. Scope:', reg.scope);
      try {
        const expectedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        console.log('[Push] Expected key length:', expectedKey.length);

        let sub = await reg.pushManager.getSubscription();
        console.log('[Push] Existing subscription:', sub ? sub.endpoint.slice(0, 60) + '...' : 'none');

        // If the existing subscription was created with a different VAPID key
        // (e.g. a dummy key used before real keys were configured), unsubscribe
        // so we can create a fresh one with the correct key.
        if (sub) {
          const rawKey = sub.options?.applicationServerKey;
          if (rawKey) {
            const existingKey = new Uint8Array(rawKey as ArrayBuffer);
            console.log('[Push] Existing key length:', existingKey.length, 'Expected:', expectedKey.length);
            const keyMismatch =
              existingKey.length !== expectedKey.length ||
              existingKey.some((b, i) => b !== expectedKey[i]);
            console.log('[Push] Key mismatch:', keyMismatch);
            if (keyMismatch) {
              console.log('[Push] Unsubscribing stale subscription...');
              await sub.unsubscribe();
              sub = null;
              console.log('[Push] Unsubscribed.');
            }
          } else {
            console.log('[Push] No applicationServerKey on existing sub — keeping it');
          }
        }

        if (!sub) {
          console.log('[Push] Creating new subscription...');
          try {
            sub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: expectedKey as unknown as BufferSource,
            });
            console.log('[Push] New subscription created:', sub.endpoint.slice(0, 60) + '...');
          } catch (subErr: any) {
            console.error('[Push] Failed to subscribe:', subErr.message, subErr);
            return;
          }
        }

        // Always sync to backend — server upserts so duplicates are harmless
        console.log('[Push] Sending subscription to backend...');
        const res = await fetch(`${API}/notifications/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(sub),
        });
        const data = await res.json();
        console.log('[Push] Backend response:', res.status, JSON.stringify(data));
      } catch (err: any) {
        console.error('[Push] Unexpected error:', err.message, err);
      }
    }).catch((err: any) => {
      console.error('[Push] SW not ready:', err.message);
    });
  }, []);

  // ── Socket setup
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('connect', () => {
      socket.emit('authenticate', getToken());
    });
    socket.on('dm:message', ({ conversationId, message }: { conversationId: string; message: DMMessage }) => {
      setMessages(prev => {
        if (prev.find(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
      setConversations(prev => prev.map(c =>
        c._id === conversationId ? { ...c, lastMessage: message, lastMessageAt: message.createdAt } : c
      ).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()));
      // Mark delivered
      socket.emit('dm:delivered', { messageId: message._id, conversationId, senderId: message.senderId._id });
    });
    socket.on('dm:typing', ({ conversationId, isTyping }: { conversationId: string; isTyping: boolean }) => {
      if (conversationId === activeConvoId) setPartnerTyping(isTyping);
    });
    socket.on('dm:read', ({ conversationId }: { conversationId: string }) => {
      if (conversationId === activeConvoId) {
        setMessages(prev => prev.map(m => m.status !== 'read' && m.senderId._id === myId ? { ...m, status: 'read' } : m));
      }
    });
    socket.on('dm:message_edited', ({ messageId, text: newText, editedAt }: any) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, text: newText, editedAt } : m));
    });
    socket.on('dm:message_deleted', ({ messageId, forAll }: any) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, deletedAt: new Date().toISOString(), deletedForAll: forAll } : m));
    });
    socket.on('dm:reaction', ({ messageId, reactions }: any) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, reactions } : m));
    });
    socket.on('dm:chat_request', (req: ChatRequest) => {
      setRequests(prev => [req, ...prev]);
      toast({ title: `${req.senderName} wants to chat`, description: 'New chat request' });
    });
    socket.on('dm:request_accepted', ({ conversationId }: any) => {
      toast({ title: 'Chat request accepted!', description: 'You can now chat.' });
      // Wait for conversations to load before opening the chat window
      fetchConversations().then(() => setActiveConvoId(conversationId));
    });
    return () => { socket.disconnect(); };
  }, [activeConvoId]);

  // ── Load conversations + requests on mount
  useEffect(() => {
    const c = searchParams.get('c');
    const t = searchParams.get('tab');
    if (t === 'requests') setTab('requests');
    // Wait for conversations to load before activating one from URL
    fetchConversations().then(() => {
      if (c) setActiveConvoId(c);
    });
    fetchRequests();
  }, []);

  // ── Load messages when active conversation changes
  useEffect(() => {
    if (!activeConvoId) return;
    setMessages([]);
    setHasMore(true);
    setLoadingMsgs(true);
    fetchMessages(activeConvoId);
    markRead(activeConvoId);
    if (partner) {
      socketRef.current?.emit('dm:open_conversation', { conversationId: activeConvoId, partnerUserId: partner._id });
    }
  }, [activeConvoId]);

  // ── Scroll to bottom on new messages
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Search users
  useEffect(() => {
    if (!searchQ.trim()) { setUserResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/dm/search?q=${encodeURIComponent(searchQ)}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        setUserResults(data.users || []);
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [searchQ]);

  // ── Typing indicator
  const handleTextChange = (val: string) => {
    setText(val);
    if (!activeConvoId || !partner) return;
    socketRef.current?.emit('dm:typing', { conversationId: activeConvoId, isTyping: true });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current?.emit('dm:typing', { conversationId: activeConvoId, isTyping: false });
    }, 1500);
  };

  // ── API calls
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API}/dm/conversations`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch {}
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API}/dm/requests`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {}
  };

  const fetchMessages = async (convoId: string, before?: string) => {
    setLoadingMsgs(true);
    try {
      const url = before
        ? `${API}/dm/conversations/${convoId}/messages?before=${before}&limit=30`
        : `${API}/dm/conversations/${convoId}/messages?limit=30`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      const msgs: DMMessage[] = data.messages || [];
      if (before) {
        setMessages(prev => [...msgs, ...prev]);
      } else {
        setMessages(msgs);
      }
      setHasMore(msgs.length === 30);
    } catch {} finally {
      setLoadingMsgs(false);
    }
  };

  const markRead = async (convoId: string) => {
    await fetch(`${API}/dm/conversations/${convoId}/read`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    }).catch(() => {});
    setConversations(prev => prev.map(c =>
      c._id === convoId ? { ...c, unreadCounts: { ...c.unreadCounts, [myId]: 0 } } : c
    ));
  };

  const sendMessage = async () => {
    if ((!text.trim() && !editingMsg) || !activeConvoId) return;
    if (sending) return;

    if (editingMsg) {
      setSending(true);
      try {
        await fetch(`${API}/dm/messages/${editingMsg._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({ text }),
        });
        setEditingMsg(null);
        setText('');
      } catch {} finally { setSending(false); }
      return;
    }

    setSending(true);
    const fd = new FormData();
    fd.append('text', text);
    if (replyTo) fd.append('replyTo', replyTo._id);
    try {
      await fetch(`${API}/dm/conversations/${activeConvoId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      setText('');
      setReplyTo(null);
      socketRef.current?.emit('dm:typing', { conversationId: activeConvoId, isTyping: false });
    } catch {} finally { setSending(false); }
  };

  const sendFile = async (file: File) => {
    if (!activeConvoId) return;
    const fd = new FormData();
    fd.append('file', file);
    if (replyTo) fd.append('replyTo', replyTo._id);
    try {
      await fetch(`${API}/dm/conversations/${activeConvoId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      setReplyTo(null);
    } catch { toast({ title: 'Failed to send file', variant: 'destructive' }); }
  };

  const sendChatRequest = async () => {
    if (!newChatEmail.trim()) return;
    setSendingRequest(true);
    try {
      const res = await fetch(`${API}/dm/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ email: newChatEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.alreadyConnected) {
        setActiveConvoId(data.conversationId);
        setShowNewChat(false);
        setNewChatEmail('');
        return;
      }
      toast({ title: 'Request sent!', description: `Chat request sent to ${newChatEmail}` });
      setShowNewChat(false);
      setNewChatEmail('');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setSendingRequest(false); }
  };

  const acceptRequest = async (id: string) => {
    try {
      const res = await fetch(`${API}/dm/requests/${id}/accept`, {
        method: 'POST', headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setRequests(prev => prev.filter(r => r._id !== id));
      await fetchConversations();
      if (data.conversationId) { setActiveConvoId(data.conversationId); setTab('chats'); }
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  };

  const declineRequest = async (id: string) => {
    try {
      await fetch(`${API}/dm/requests/${id}/decline`, {
        method: 'POST', headers: { Authorization: `Bearer ${getToken()}` },
      });
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch {}
  };

  const deleteMessage = async (msg: DMMessage, forAll: boolean) => {
    await fetch(`${API}/dm/messages/${msg._id}?forAll=${forAll}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` },
    }).catch(() => {});
    setSelectedMsg(null);
  };

  const reactToMessage = async (msgId: string, emoji: string) => {
    await fetch(`${API}/dm/messages/${msgId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ emoji }),
    }).catch(() => {});
  };

  const starMessage = async (msgId: string) => {
    await fetch(`${API}/dm/messages/${msgId}/star`, {
      method: 'POST', headers: { Authorization: `Bearer ${getToken()}` },
    }).catch(() => {});
    setSelectedMsg(null);
  };

  const muteConversation = async (convoId: string) => {
    await fetch(`${API}/dm/conversations/${convoId}/mute`, {
      method: 'POST', headers: { Authorization: `Bearer ${getToken()}` },
    }).catch(() => {});
    await fetchConversations();
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = e => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], 'voice.webm', { type: 'audio/webm' });
        await sendFile(file);
      };
      recorder.start();
      setIsRecording(true);
    } catch { toast({ title: 'Microphone access denied', variant: 'destructive' }); }
  };

  const stopVoiceRecording = () => {
    mediaRef.current?.stop();
    setIsRecording(false);
  };

  const loadMoreMessages = async () => {
    if (!activeConvoId || !hasMore || loadingMsgs || messages.length === 0) return;
    await fetchMessages(activeConvoId, messages[0]._id);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
    if (el.scrollTop < 80 && hasMore && !loadingMsgs) loadMoreMessages();
  };

  const startChatWithUser = async (user: UserMini) => {
    setSearchQ('');
    setUserResults([]);
    // Fetch fresh conversations from server to catch any accepted invites
    try {
      const res = await fetch(`${API}/dm/conversations`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      const fresh: Conversation[] = data.conversations || [];
      setConversations(fresh);
      const existing = fresh.find(c => c.participants.some(p => String(p._id) === String(user._id)));
      if (existing) { setActiveConvoId(existing._id); return; }
    } catch {}
    // No accepted connection — open new chat modal to send a request
    setNewChatEmail(user.email);
    setShowNewChat(true);
  };

  // ─── Render helpers ───────────────────────────────────────────────────────

  const renderTick = (msg: DMMessage) => {
    if (msg.senderId._id !== myId) return null;
    if (msg.status === 'read') return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />;
    if (msg.status === 'delivered') return <CheckCheck className="w-3.5 h-3.5 text-gray-400" />;
    return <Check className="w-3.5 h-3.5 text-gray-400" />;
  };

  const renderMessage = (msg: DMMessage, index: number, arr: DMMessage[]) => {
    const isMine = msg.senderId._id === myId;
    const isDeleted = msg.deletedForAll || (msg.deletedAt && isMine);
    const isSelected = selectedMsg === msg._id;
    const prev = arr[index - 1];
    const isNewGroup = !prev || prev.senderId._id !== msg.senderId._id;

    return (
      <div
        key={msg._id}
        className={`flex ${isNewGroup ? 'mt-5' : 'mt-3'} ${isMine ? 'justify-end' : 'justify-start'} group`}
        onClick={() => setSelectedMsg(isSelected ? null : msg._id)}
      >
        {/* Avatar (others only) */}
        {!isMine && (
          <img src={avatarUrl(msg.senderId)} className="w-7 h-7 rounded-full mr-2 mt-auto mb-1 shrink-0" />
        )}

        <div className={`relative max-w-[65%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>

          {/* Bubble */}
          <div className={`rounded-2xl px-3 py-2 shadow-sm text-sm relative
            ${isMine
              ? 'bg-gray-800 text-white rounded-br-sm'
              : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'}
            ${isSelected ? 'ring-2 ring-offset-1 ring-gray-400' : ''}
          `}>
            {isDeleted ? (
              <span className="italic opacity-60 text-xs">
                {msg.deletedForAll ? 'This message was deleted' : 'You deleted this message'}
              </span>
            ) : (
              <>
                {/* Reply quote */}
                {msg.replyTo && (
                  <div className={`rounded-lg mb-2 px-2 py-1.5 border-l-[3px] border-red-400 ${isMine ? 'bg-white/10' : 'bg-gray-50'}`}>
                    <p className="text-[10px] font-bold text-red-400 mb-0.5">
                      {msg.replyTo.senderId._id === myId ? 'You' : partner?.name}
                    </p>
                    <p className={`text-[11px] truncate ${isMine ? 'text-white/70' : 'text-gray-500'}`}>
                      {msg.replyTo.text || (msg.replyTo.type === 'image' ? '📷 Photo' : '📎 File')}
                    </p>
                  </div>
                )}
                {/* Image */}
                {msg.type === 'image' && msg.fileUrl && (
                  <img
                    src={msg.fileUrl}
                    className="rounded-xl max-w-full max-h-64 mb-1 cursor-pointer"
                    onClick={() => window.open(msg.fileUrl, '_blank')}
                  />
                )}
                {/* File */}
                {msg.type === 'file' && msg.fileUrl && (
                  <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-2 rounded-lg mb-1 ${isMine ? 'bg-gray-700' : 'bg-gray-50'}`}
                    onClick={e => e.stopPropagation()}
                  >
                    <Paperclip className="w-4 h-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{msg.fileName}</p>
                      {msg.fileSize && <p className="text-[10px] opacity-70">{formatBytes(msg.fileSize)}</p>}
                    </div>
                  </a>
                )}
                {/* Voice */}
                {msg.type === 'voice' && msg.fileUrl && (
                  <AudioPlayer fileUrl={msg.fileUrl} isMine={isMine} />
                )}
                {/* Text */}
                {msg.text && <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}
                {msg.editedAt && <span className="text-[9px] opacity-60 ml-1">edited</span>}
              </>
            )}

            {/* Time + tick */}
            <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
              <span className={`text-[10px] ${isMine ? 'text-white/50' : 'text-gray-400'}`}>
                {formatTime(msg.createdAt)}
              </span>
              {renderTick(msg)}
            </div>
          </div>

          {/* Reactions */}
          {msg.reactions.length > 0 && (
            <div className={`flex flex-wrap gap-0.5 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
              {Object.entries(
                msg.reactions.reduce((acc: Record<string, number>, r) => { acc[r.emoji] = (acc[r.emoji] || 0) + 1; return acc; }, {})
              ).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={e => { e.stopPropagation(); reactToMessage(msg._id, emoji); }}
                  className="text-xs bg-white border border-gray-200 rounded-full px-1.5 py-0.5 shadow-sm"
                >
                  {emoji} {count > 1 ? count : ''}
                </button>
              ))}
            </div>
          )}

          {/* Action bar (on select) */}
          {isSelected && !isDeleted && (
            <div className={`flex items-center gap-1 mt-1 ${isMine ? 'self-end' : 'self-start'}`}>
              {/* Emoji reactions — uses native keyboard emoji picker */}
              <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-100 px-2 py-1">
                {emojiInputMsgId === msg._id ? (
                  <input
                    type="text"
                    autoFocus
                    className="w-14 text-base outline-none bg-transparent text-center placeholder:text-gray-300"
                    placeholder="😀"
                    onKeyDown={ev => ev.stopPropagation()}
                    onChange={ev => {
                      ev.stopPropagation();
                      const val = ev.target.value.trim();
                      if (val) {
                        reactToMessage(msg._id, val);
                        setEmojiInputMsgId(null);
                      }
                    }}
                    onBlur={() => setEmojiInputMsgId(null)}
                  />
                ) : (
                  <button
                    onClick={ev => { ev.stopPropagation(); setEmojiInputMsgId(msg._id); }}
                    className="text-base leading-none"
                    title="React with emoji"
                  >
                    <Smile className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
              <div className="flex bg-white rounded-full shadow-lg border border-gray-100 px-1 py-0.5 gap-1">
                <button onClick={e => { e.stopPropagation(); setReplyTo(msg); setSelectedMsg(null); }} title="Reply" className="p-1 hover:text-red-500">
                  <Reply className="w-3.5 h-3.5" />
                </button>
                <button onClick={e => { e.stopPropagation(); starMessage(msg._id); }} title="Star" className="p-1 hover:text-yellow-500">
                  <Star className="w-3.5 h-3.5" />
                </button>
                {isMine && msg.type === 'text' && (
                  <button onClick={e => { e.stopPropagation(); setEditingMsg(msg); setText(msg.text); setSelectedMsg(null); }} title="Edit" className="p-1 hover:text-blue-500">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                {isMine && (
                  <button onClick={e => { e.stopPropagation(); deleteMessage(msg, true); }} title="Delete" className="p-1 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const unreadCount = (convo: Conversation) => {
    const raw = convo.unreadCounts;
    if (!raw) return 0;
    if (typeof (raw as any).get === 'function') return (raw as any).get(myId) || 0;
    return (raw as Record<string, number>)[myId] || 0;
  };

  const isMuted = (convo: Conversation) => convo.mutedBy?.includes(myId);

  // ─── Left panel ───────────────────────────────────────────────────────────
  const renderLeftPanel = () => (
    <div className={`flex flex-col h-full bg-white ${activeConvoId ? 'hidden md:flex' : 'flex'} w-full md:w-[340px] md:min-w-[340px] border-r border-gray-100`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">Messages</h1>
        <button
          onClick={() => setShowNewChat(true)}
          className="w-9 h-9 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search conversations..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-xl text-sm outline-none placeholder:text-gray-400 focus:bg-gray-50 focus:ring-2 focus:ring-red-200 transition-all"
          />
        </div>
        {/* User search results */}
        {userResults.length > 0 && (
          <div className="mt-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
            {userResults.map(u => (
              <button key={u._id} onClick={() => startChatWithUser(u)}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                <img src={avatarUrl(u)} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex mx-4 mb-1 gap-1 bg-gray-100 p-1 rounded-xl">
        <button onClick={() => setTab('chats')}
          className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${tab === 'chats' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}>
          Chats
        </button>
        <button onClick={() => setTab('requests')}
          className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${tab === 'requests' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}>
          Requests
          {requests.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {tab === 'chats' && (
          conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-red-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No chats yet</p>
              <p className="text-xs text-gray-400 mb-4">Send a chat request to start messaging anyone</p>
              <button onClick={() => setShowNewChat(true)}
                className="flex items-center gap-2 text-sm text-red-500 font-medium hover:text-red-600">
                <Plus className="w-4 h-4" /> New Chat
              </button>
            </div>
          ) : (
            conversations.map(convo => {
              const other = getOtherParticipant(convo, myId);
              const unread = unreadCount(convo);
              const muted = isMuted(convo);
              const lastMsg = convo.lastMessage;
              return (
                <button
                  key={convo._id}
                  onClick={() => setActiveConvoId(convo._id)}
                  className={`flex items-center gap-3 w-full px-4 py-3.5 transition-colors text-left ${activeConvoId === convo._id ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="relative shrink-0">
                    <img src={avatarUrl(other)} className="w-12 h-12 rounded-full object-cover" />
                    {unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                        {unread > 9 ? '9+' : unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-sm font-semibold truncate ${unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>{other.name}</p>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {muted && <BellOff className="w-3 h-3 text-gray-400" />}
                        <span className="text-[10px] text-gray-400">
                          {lastMsg ? formatTime(lastMsg.createdAt) : ''}
                        </span>
                      </div>
                    </div>
                    <p className={`text-xs truncate ${unread > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                      {lastMsg
                        ? lastMsg.deletedForAll
                          ? 'This message was deleted'
                          : lastMsg.type !== 'text'
                            ? '📎 Attachment'
                            : (lastMsg.senderId._id === myId ? 'You: ' : '') + lastMsg.text
                        : 'Start chatting'
                      }
                    </p>
                  </div>
                </button>
              );
            })
          )
        )}

        {tab === 'requests' && (
          requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <UserPlus className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No pending requests</p>
              <p className="text-xs text-gray-400">Chat requests you receive will appear here</p>
            </div>
          ) : (
            requests.map(req => (
              <div key={req._id} className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50">
                <img src={avatarUrl(req.sender || { _id: '', name: req.senderName, email: req.senderEmail })} className="w-12 h-12 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{req.senderName}</p>
                  <p className="text-xs text-gray-500 truncate">{req.senderEmail}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatTime(req.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button onClick={() => acceptRequest(req._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">
                    Accept
                  </button>
                  <button onClick={() => declineRequest(req._id)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );

  // ─── Right panel (chat window) ────────────────────────────────────────────
  const renderChatWindow = () => {
    if (!activeConvoId) {
      return (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-9 h-9 text-red-300" />
            </div>
            <p className="text-base font-semibold text-gray-500">Select a chat to start messaging</p>
          </div>
        </div>
      );
    }

    // Conversation not yet in list (still loading) — show spinner
    if (!activeConvo) {
      return (
        <div className="flex flex-1 items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading conversation...</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex flex-col flex-1 h-full pb-24 md:pb-0 ${activeConvoId ? 'flex' : 'hidden md:flex'}`}>
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white shadow-sm">
          <button onClick={() => setActiveConvoId(null)} className="md:hidden mr-1 p-1 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <img src={avatarUrl(partner)} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{partner?.name}</p>
            <p className="text-xs text-gray-400">
              {partnerTyping ? <span className="text-red-500 font-medium">typing...</span> : partner?.email}
            </p>
          </div>
          <button onClick={() => muteConversation(activeConvoId)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500" title={isMuted(activeConvo!) ? 'Unmute' : 'Mute'}>
            {isMuted(activeConvo!) ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </button>
        </div>

        {/* Messages area */}
        <div
          ref={messagesBoxRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 space-y-0"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)', backgroundSize: '20px 20px' }}
          onClick={() => setSelectedMsg(null)}
        >
          {/* Load more */}
          {hasMore && (
            <div className="text-center mb-4">
              <button onClick={loadMoreMessages} disabled={loadingMsgs}
                className="text-xs text-red-500 hover:text-red-600 font-medium bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                {loadingMsgs ? 'Loading...' : 'Load earlier messages'}
              </button>
            </div>
          )}

          {/* Messages */}
          {messages.map(renderMessage)}

          {/* Typing indicator */}
          {partnerTyping && (
            <div className="flex items-end gap-2 mb-1">
              <img src={avatarUrl(partner)} className="w-7 h-7 rounded-full" />
              <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm border border-gray-100">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={msgEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button onClick={() => msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="absolute right-6 bottom-24 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
            <ChevronDown className="w-5 h-5" />
          </button>
        )}

        {/* Reply/Edit bar */}
        {(replyTo || editingMsg) && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-t border-red-100">
            <div className="flex-1 min-w-0 border-l-2 border-red-400 pl-2">
              <p className="text-[10px] font-semibold text-red-500">
                {editingMsg ? 'Editing' : `Reply to ${replyTo?.senderId._id === myId ? 'yourself' : partner?.name}`}
              </p>
              <p className="text-xs text-gray-600 truncate">{editingMsg?.text || replyTo?.text}</p>
            </div>
            <button onClick={() => { setReplyTo(null); setEditingMsg(null); if (editingMsg) setText(''); }}
              className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input bar */}
        <div className="flex items-end gap-2 px-3 py-3 bg-white border-t border-gray-100 pb-safe">
          {/* File attach */}
          <button onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-gray-100 shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.pptx"
            onChange={e => e.target.files?.[0] && sendFile(e.target.files[0])} />

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              rows={1}
              placeholder="Message..."
              value={text}
              onChange={e => handleTextChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:bg-white transition-all max-h-32"
              style={{ lineHeight: '1.5' }}
            />
          </div>

          {/* Send / Voice */}
          {text.trim() ? (
            <button onClick={sendMessage} disabled={sending}
              className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm transition-colors">
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              onMouseDown={startVoiceRecording}
              onMouseUp={stopVoiceRecording}
              onTouchStart={startVoiceRecording}
              onTouchEnd={stopVoiceRecording}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : ''}`} />
            </button>
          )}
        </div>
      </div>
    );
  };

  // ─── New Chat Modal ───────────────────────────────────────────────────────
  const renderNewChatModal = () => (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 pb-20 sm:pb-4 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowNewChat(false)}>
      <div className="bg-white rounded-2xl sm:rounded-2xl w-full sm:max-w-sm p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">New Chat</h2>
          <button onClick={() => setShowNewChat(false)} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Enter an email address to send a chat request. They'll receive an email to accept or decline.
        </p>
        <Input
          type="email"
          placeholder="Enter email address..."
          value={newChatEmail}
          onChange={e => setNewChatEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendChatRequest()}
          className="mb-4"
          autoFocus
        />
        <Button
          onClick={sendChatRequest}
          disabled={sendingRequest || !newChatEmail.trim()}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl"
        >
          {sendingRequest ? 'Sending...' : 'Send Chat Request'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 relative">
      {renderLeftPanel()}
      {renderChatWindow()}
      {showNewChat && renderNewChatModal()}
    </div>
  );
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

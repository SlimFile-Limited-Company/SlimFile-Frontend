import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, PhoneOff,
  Users, MessageSquare, Hand, Smile, Grid, User, Settings,
  Bell, Radio, Square, Maximize2, Minimize2,
  Copy, Circle, Pin, X,
} from 'lucide-react';
import { getToken } from '@/lib/auth';
import { meetingService } from '@/services/meetingService';
import { initializeSocket, getSocket } from '@/services/socketService';

interface ChatMessage { userId: string; userName: string; message: string; timestamp: string; }
interface Participant { userId: string; userName: string; isHandRaised: boolean; isMuted: boolean; isCameraOff: boolean; isScreenSharing?: boolean; }
interface Reaction { userId: string; userName: string; emoji: string; timestamp: number; }

// ─── Avatar ──────────────────────────────────────────────────────────────────
const COLORS = ['#1a73e8','#34a853','#fbbc04','#ea4335','#9c27b0','#00bcd4','#ff5722','#607d8b'];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

// ─── Remote video tile ────────────────────────────────────────────────────────
function RemoteVideoCard({ participantId, stream, participant, isPinned, onPin, compact, fill, isActiveSpeaker }: {
  participantId: string; stream: MediaStream; participant?: Participant;
  isPinned?: boolean; onPin?: () => void; compact?: boolean; fill?: boolean; isActiveSpeaker?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;
    const attach = () => {
      video.srcObject = stream;
      const vt = stream.getVideoTracks();
      setHasVideo(vt.length > 0 && vt[0].enabled && vt[0].readyState === 'live');
      video.onloadedmetadata = () => video.play().catch(e => { if (e.name !== 'AbortError') console.error(e); });
    };
    attach();
    const onAdd = (e: MediaStreamTrackEvent) => { if (e.track.kind === 'video') attach(); };
    const onRemove = () => { const vt = stream.getVideoTracks(); setHasVideo(vt.length > 0 && vt[0].enabled); };
    stream.addEventListener('addtrack', onAdd);
    stream.addEventListener('removetrack', onRemove);
    stream.getTracks().forEach(t => { t.onunmute = () => attach(); t.onmute = () => { if (t.kind === 'video') setHasVideo(false); }; });
    return () => { stream.removeEventListener('addtrack', onAdd); stream.removeEventListener('removetrack', onRemove); };
  }, [stream]);

  const name = participant?.userName || participantId.substring(0, 10);
  const initial = name.charAt(0).toUpperCase();
  const color = avatarColor(name);

  return (
    <div
      className={`relative bg-[#3C4043] overflow-hidden flex items-center justify-center group cursor-pointer min-h-[120px] sm:min-h-[180px]
        ${compact ? 'rounded-xl' : 'rounded-xl sm:rounded-2xl'}
        ${fill ? 'w-full h-full' : ''}
        ${isActiveSpeaker ? 'ring-2 ring-[#1a73e8]' : isPinned ? 'ring-2 ring-white/40' : ''}`}
      style={fill ? undefined : { aspectRatio: '16/9' }}
      onClick={onPin}
    >
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      {!hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full flex items-center justify-center text-white font-medium shadow-lg"
            style={{
              backgroundColor: color,
              width: compact ? 40 : (window.innerWidth < 640 ? 48 : 72),
              height: compact ? 40 : (window.innerWidth < 640 ? 48 : 72),
              fontSize: compact ? 16 : (window.innerWidth < 640 ? 20 : 30)
            }}>
            {initial}
          </div>
        </div>
      )}
      {!compact && (
        <button onClick={e => { e.stopPropagation(); onPin?.(); }}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-1 sm:p-1.5">
          <Pin className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isPinned ? 'text-[#1a73e8]' : 'text-white'}`} />
        </button>
      )}
      <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg flex items-center gap-1">
        <span className="text-white text-[10px] sm:text-xs font-medium truncate max-w-[100px] sm:max-w-[200px]">{name}</span>
        {participant?.isMuted && <MicOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400 flex-shrink-0" />}
      </div>
      {participant?.isHandRaised && <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 text-sm sm:text-base animate-bounce">✋</div>}
      {participant?.isScreenSharing && <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-[#1a73e8] text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 rounded-md font-medium flex items-center gap-0.5 sm:gap-1"><Monitor className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> <span className="hidden sm:inline">Presenting</span><span className="sm:hidden">Present</span></div>}
      {isActiveSpeaker && !participant?.isScreenSharing && <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#1a73e8] rounded-full animate-pulse" />}
    </div>
  );
}

// ─── Control button ───────────────────────────────────────────────────────────
function CtrlBtn({ onClick, active = true, danger = false, label, children }: {
  onClick: () => void; active?: boolean; danger?: boolean; label?: string; children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
      <button onClick={onClick} title={label}
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-150 focus:outline-none shadow-lg
          ${danger ? 'bg-red-600 hover:bg-red-500 text-white' : active ? 'bg-[#3C4043] hover:bg-[#4A4D51] text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}>
        {children}
      </button>
      {label && <span className="text-[#E8EAED] text-[9px] font-medium hidden lg:block drop-shadow-md">{label}</span>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MeetingRoom() {
  const { meetingCode } = useParams<{ meetingCode: string }>();
  const navigate = useNavigate();

  // ✅ TRAINING APP INTEGRATION: Read query params
  const urlParams = new URLSearchParams(window.location.search);
  const trainingId = urlParams.get('trainingId');
  const urlUserId = urlParams.get('userId');
  const urlUserName = urlParams.get('userName');

  // ── Pre-join lobby
  const [inLobby, setInLobby] = useState(true);
  const lobbyVideoRef = useRef<HTMLVideoElement>(null);

  // ── Media
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);

  // ── Meeting state
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [admissionState, setAdmissionState] = useState<'checking' | 'waiting' | 'admitted' | 'denied'>('checking');
  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const userIdRef = useRef('');
  const userNameRef = useRef('');
  const hasJoinedRef = useRef(false); // prevents Phase 2 from running twice

  // ── Participants & streams
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [admitRequests, setAdmitRequests] = useState<Array<{ socketId: string; userId: string; userName: string }>>([]);

  // ── UI state
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker'>('grid');
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Misc
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'medium' | 'poor'>('good');
  const [notificationSounds, setNotificationSounds] = useState(true);
  const [isPipMode, setIsPipMode] = useState(false);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [clock, setClock] = useState('');
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: string }>>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const meetingStartRef = useRef<number | null>(null);

  // ── Clock
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Meeting duration timer (starts when joined)
  useEffect(() => {
    if (!isJoined) return;
    meetingStartRef.current = Date.now();
    const id = setInterval(() => {
      setMeetingDuration(Math.floor((Date.now() - meetingStartRef.current!) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [isJoined]);

  const showToast = useCallback((message: string, type = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  // ── Media init (runs immediately on mount for lobby preview)
  useEffect(() => {
    const init = async () => {
      console.log('[Meet] Media init: requesting camera/mic...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        localStream.current = stream;
        meetingService.setLocalStream(stream);
        console.log('[Meet] Media init: stream ready, tracks:', stream.getTracks().map(t => `${t.kind}(${t.readyState})`));
        // Attach to lobby preview
        if (lobbyVideoRef.current) {
          lobbyVideoRef.current.srcObject = stream;
          lobbyVideoRef.current.play().catch(() => {});
          console.log('[Meet] Media init: attached to lobbyVideoRef');
        } else {
          console.warn('[Meet] Media init: lobbyVideoRef not mounted yet');
        }
        setIsStreamReady(true);
      } catch (err: any) {
        console.error('[Meet] Media init FAILED:', err);
        alert('Unable to access camera/microphone: ' + err.message);
      }
    };
    const t = setTimeout(init, 100);
    return () => {
      clearTimeout(t);
      console.log('[Meet] Media init cleanup: stopping tracks');
      localStream.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // ── Attach local stream to localVideoRef whenever layout changes OR after lobby exit
  useEffect(() => {
    const tracks = localStream.current?.getTracks().map(t => `${t.kind}(${t.readyState})`) ?? [];
    console.log(`[Meet] Re-attach effect — admissionState=${admissionState} isJoined=${isJoined} isScreenSharing=${isScreenSharing} remotes=${remoteStreams.size} stream=${!!localStream.current} ref=${!!localVideoRef.current} tracks=[${tracks}]`);
    if (!localStream.current || !localVideoRef.current) {
      console.warn('[Meet] Re-attach: skipped — stream or ref missing');
      return;
    }
    if (isScreenSharing) {
      console.log('[Meet] Re-attach: skipped — screen sharing active');
      return;
    }
    localVideoRef.current.srcObject = localStream.current;
    localVideoRef.current.play().catch(e => console.warn('[Meet] Re-attach play() error:', e));
    console.log('[Meet] Re-attach: stream attached to localVideoRef');
  }, [remoteStreams.size, isScreenSharing, isJoined, admissionState]);

  // ── Phase 1: Request admission when stream ready AND lobby exited
  useEffect(() => {
    if (!meetingCode || !isStreamReady || inLobby) return;
    console.log('[Meet] Phase 1: requesting admission for meeting', meetingCode);

    let socket = getSocket();
    if (!socket || !socket.connected) {
      console.log('[Meet] Phase 1: no socket, initializing...');
      socket = initializeSocket();
      const token = getToken();
      if (token) socket.emit('authenticate', token);
    } else {
      console.log('[Meet] Phase 1: reusing existing socket', socket.id);
    }

    const token = getToken();
    let userId = `guest-${Date.now()}`;
    let userName = 'Guest';

    // 1. Try to get from JWT token
    if (token) {
      try {
        const p = JSON.parse(atob(token.split('.')[1]));
        userId = p.id || userId;
        userName = p.name || p.email || userName;
      } catch {}
    }

    // 2. ✅ TRAINING APP INTEGRATION: Override with URL params if provided
    if (urlUserId) {
      userId = urlUserId;
      console.log('[Meet] Phase 1: userId from Training App URL:', userId);
    }
    if (urlUserName) {
      userName = urlUserName;
      console.log('[Meet] Phase 1: userName from Training App URL:', userName);
    }
    if (trainingId) {
      console.log('[Meet] Phase 1: trainingId from URL:', trainingId);
    }

    console.log('[Meet] Phase 1: identity —', { userId, userName, trainingId });
    setCurrentUserId(userId);
    setCurrentUserName(userName);
    userIdRef.current = userId;
    userNameRef.current = userName;

    const onAdmitted = (data: any) => {
      console.log('[Meet] Phase 1: received meeting:admitted', data);
      if (data?.wasEmpty) { console.log('[Meet] Phase 1: I am the host'); setIsHost(true); }
      setAdmissionState('admitted');
    };
    const onWaiting = (data: any) => {
      console.log('[Meet] Phase 1: received meeting:waiting', data);
      setAdmissionState('waiting');
    };
    const onDenied = (data: any) => {
      console.log('[Meet] Phase 1: received meeting:denied', data);
      setAdmissionState('denied');
    };

    socket.on('meeting:admitted', onAdmitted);
    socket.on('meeting:waiting', onWaiting);
    socket.on('meeting:denied', onDenied);

    console.log('[Meet] Phase 1: emitting meeting:request-admit');
    socket.emit('meeting:request-admit', { meetingId: meetingCode, userId, userName });

    return () => {
      console.log('[Meet] Phase 1 cleanup');
      socket.off('meeting:admitted', onAdmitted);
      socket.off('meeting:waiting', onWaiting);
      socket.off('meeting:denied', onDenied);
    };
  }, [meetingCode, isStreamReady, inLobby]);

  // ── Phase 2: Join once admitted
  useEffect(() => {
    console.log(`[Meet] Phase 2 check — admissionState=${admissionState} hasJoined=${hasJoinedRef.current} meetingCode=${meetingCode} stream=${!!localStream.current}`);
    if (admissionState !== 'admitted' || hasJoinedRef.current || !meetingCode || !localStream.current) {
      if (admissionState === 'admitted' && hasJoinedRef.current) console.log('[Meet] Phase 2: already joined, skipping');
      return;
    }
    hasJoinedRef.current = true;
    console.log('[Meet] Phase 2: joining meeting as', userIdRef.current);

    const userId = userIdRef.current;
    const userName = userNameRef.current;

    setParticipants(prev => {
      const m = new Map(prev);
      m.set(userId, { userId, userName, isHandRaised: false, isMuted: false, isCameraOff: false });
      return m;
    });

    meetingService.onRemoteStreamAdded = (pid, stream) => {
      console.log('[Meet] Remote stream added for', pid, 'tracks:', stream.getTracks().map(t => `${t.kind}(${t.readyState})`));
      setRemoteStreams(prev => { const m = new Map(prev); m.set(pid, stream); return m; });
    };
    meetingService.onParticipantLeft = (pid) => {
      console.log('[Meet] Participant left:', pid);
      setRemoteStreams(prev => { const m = new Map(prev); m.delete(pid); return m; });
      setParticipants(prev => { const m = new Map(prev); m.delete(pid); return m; });
    };
    meetingService.onParticipantMetadata = (pid, name) => {
      console.log('[Meet] Participant metadata:', pid, name);
      setParticipants(prev => {
        const m = new Map(prev);
        m.set(pid, { userId: pid, userName: name, isHandRaised: false, isMuted: false, isCameraOff: false });
        return m;
      });
    };
    meetingService.onError = (msg) => { console.error('[Meet] meetingService error:', msg); showToast(msg, 'warning'); };

    try {
      // ✅ TRAINING APP INTEGRATION: Pass trainingId if available
      meetingService.joinMeeting(meetingCode, userId, userName, trainingId);
      console.log('[Meet] Phase 2: joinMeeting() called', trainingId ? `with trainingId: ${trainingId}` : '');
    } catch (e) {
      console.error('[Meet] Phase 2: joinMeeting() threw:', e);
    }
    setIsJoined(true);

    return () => {
      console.log('[Meet] Phase 2 cleanup: calling leaveMeeting()');
      meetingService.leaveMeeting();
    };
  }, [admissionState, meetingCode, showToast]); // isJoined intentionally excluded — adding it would trigger leaveMeeting() cleanup on every join

  // ── Socket listeners (UI events)
  useEffect(() => {
    if (!isJoined) return;
    const socket = getSocket();
    if (!socket) return;

    const onChat = (data: ChatMessage) => {
      setChatMessages(p => [...p, data]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };
    const onJoined = (data: { userId: string; userName: string }) => {
      setParticipants(prev => {
        const m = new Map(prev);
        m.set(data.userId, { userId: data.userId, userName: data.userName, isHandRaised: false, isMuted: false, isCameraOff: false });
        return m;
      });
      if (notificationSounds) playSound('join');
      showToast(`${data.userName} joined`);
    };
    const onHandRaised = (d: { userId: string; userName: string; isRaised: boolean }) => {
      setParticipants(prev => {
        const m = new Map(prev);
        const p = m.get(d.userId);
        if (p) m.set(d.userId, { ...p, isHandRaised: d.isRaised });
        return m;
      });
      // Toast notification when someone raises hand
      if (d.isRaised && d.userId !== currentUserId) {
        showToast(`✋ ${d.userName} raised their hand`, 'info');
      }
    };
    const onReaction = (d: { userId: string; userName: string; emoji: string }) => {
      const r: Reaction = { ...d, timestamp: Date.now() };
      setReactions(p => [...p, r]);
      setTimeout(() => setReactions(p => p.filter(x => x.timestamp !== r.timestamp)), 3000);
    };
    const onUpdate = (d: any) => {
      setParticipants(prev => {
        const m = new Map(prev);
        const p = m.get(d.userId);
        if (p) m.set(d.userId, { ...p, ...d });
        return m;
      });
    };
    const onTyping = (d: { userName: string; isTyping: boolean }) => {
      setTypingUsers(prev => {
        const s = new Set(prev);
        d.isTyping ? s.add(d.userName) : s.delete(d.userName);
        return s;
      });
    };

    const onAdmitRequest = (data: { socketId: string; userId: string; userName: string }) => {
      setAdmitRequests(prev => prev.some(r => r.socketId === data.socketId) ? prev : [...prev, data]);
      // Play sound and show toast when someone requests to join
      if (notificationSounds) playSound('join');
      showToast(`${data.userName} wants to join`, 'info');
    };

    socket.on('meeting:chat-message', onChat);
    socket.on('meeting:participant-joined', onJoined);
    socket.on('meeting:hand-raised', onHandRaised);
    socket.on('meeting:reaction', onReaction);
    socket.on('meeting:participant-update', onUpdate);
    socket.on('meeting:user-typing', onTyping);
    socket.on('meeting:admit-request', onAdmitRequest);

    return () => {
      socket.off('meeting:chat-message', onChat);
      socket.off('meeting:participant-joined', onJoined);
      socket.off('meeting:hand-raised', onHandRaised);
      socket.off('meeting:reaction', onReaction);
      socket.off('meeting:participant-update', onUpdate);
      socket.off('meeting:user-typing', onTyping);
      socket.off('meeting:admit-request', onAdmitRequest);
    };
  }, [isJoined, notificationSounds, currentUserId, showToast]);

  // ── Active speaker detection via Web Audio API
  useEffect(() => {
    if (!isJoined) return;
    const analysers: { id: string; analyser: AnalyserNode; ctx: AudioContext }[] = [];
    let animFrame: number;

    const setupAnalyser = (id: string, stream: MediaStream) => {
      try {
        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analysers.push({ id, analyser, ctx });
      } catch {}
    };

    // Local
    if (localStream.current) setupAnalyser('local', localStream.current);
    // Remote
    remoteStreams.forEach((stream, pid) => setupAnalyser(pid, stream));

    const detect = () => {
      let loudestId: string | null = null;
      let loudestLevel = 8; // threshold
      const buf = new Uint8Array(128);
      for (const { id, analyser } of analysers) {
        analyser.getByteFrequencyData(buf);
        const avg = buf.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
        if (avg > loudestLevel) { loudestLevel = avg; loudestId = id === 'local' ? null : id; }
      }
      setActiveSpeaker(loudestId);
      animFrame = requestAnimationFrame(detect);
    };
    detect();

    return () => {
      cancelAnimationFrame(animFrame);
      analysers.forEach(({ ctx }) => ctx.close().catch(() => {}));
    };
  }, [isJoined, remoteStreams]);

  // ── Connection quality monitor
  useEffect(() => {
    const id = setInterval(() => {
      const s = getSocket();
      setConnectionQuality(s?.connected ? 'good' : 'poor');
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // ── Auto-hide controls on mouse inactivity
  useEffect(() => {
    if (!isJoined) return;

    const handleMouseMove = () => {
      setShowControls(true);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleMouseLeave = () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Initial timer
    handleMouseMove();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [isJoined]);

  // ── Auto-focus on screen share
  useEffect(() => {
    // Check if anyone is screen sharing
    const sharingParticipant = Array.from(participants.entries()).find(([id, p]) => p.isScreenSharing && id !== currentUserId);

    if (sharingParticipant) {
      const [sharingId] = sharingParticipant;
      // Auto-switch to speaker view and pin the sharing participant
      setViewMode('speaker');
      setPinnedParticipant(sharingId);
      showToast(`${sharingParticipant[1].userName} is sharing their screen`, 'info');
    } else if (isScreenSharing) {
      // If I'm sharing, show toast
      showToast('You are now presenting', 'success');
    }
  }, [participants, isScreenSharing, currentUserId, showToast]);

  const playSound = (type: 'join' | 'leave' | 'message') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = type === 'join' ? 880 : type === 'leave' ? 440 : 660;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch {}
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── Controls
  const toggleMic = () => {
    if (!localStream.current) return;
    const t = localStream.current.getAudioTracks()[0];
    if (!t) return;
    t.enabled = !t.enabled;
    setIsMicOn(t.enabled);
    getSocket()?.emit('meeting:participant-update', { meetingId: meetingCode, userId: currentUserId, isMuted: !t.enabled });
  };

  const toggleCamera = () => {
    if (!localStream.current) return;
    const t = localStream.current.getVideoTracks()[0];
    if (!t) return;
    t.enabled = !t.enabled;
    setIsCameraOn(t.enabled);
    getSocket()?.emit('meeting:participant-update', { meetingId: meetingCode, userId: currentUserId, isCameraOff: !t.enabled });
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await meetingService.stopScreenShare();
      setIsScreenSharing(false);
      getSocket()?.emit('meeting:participant-update', { meetingId: meetingCode, userId: currentUserId, isScreenSharing: false });
      if (localVideoRef.current && localStream.current) {
        localVideoRef.current.srcObject = localStream.current;
        localVideoRef.current.play().catch(() => {});
      }
    } else {
      try {
        const screenStream = await meetingService.startScreenShare();
        setIsScreenSharing(true);
        getSocket()?.emit('meeting:participant-update', { meetingId: meetingCode, userId: currentUserId, isScreenSharing: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
          localVideoRef.current.play().catch(() => {});
        }
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          getSocket()?.emit('meeting:participant-update', { meetingId: meetingCode, userId: currentUserId, isScreenSharing: false });
          meetingService.stopScreenShare().catch(() => {});
          if (localVideoRef.current && localStream.current) {
            localVideoRef.current.srcObject = localStream.current;
            localVideoRef.current.play().catch(() => {});
          }
        };
      } catch (err) { console.error('Screen share error:', err); }
    }
  };

  const toggleHandRaise = () => {
    const next = !isHandRaised;
    setIsHandRaised(next);
    getSocket()?.emit('meeting:raise-hand', { meetingId: meetingCode, userId: currentUserId, userName: currentUserName, isRaised: next });
  };

  const sendReaction = (emoji: string) => {
    const r: Reaction = { userId: currentUserId, userName: currentUserName || 'You', emoji, timestamp: Date.now() };
    setReactions(p => [...p, r]);
    setTimeout(() => setReactions(p => p.filter(x => x.timestamp !== r.timestamp)), 3000);
    getSocket()?.emit('meeting:reaction', { meetingId: meetingCode, userId: currentUserId, userName: currentUserName, emoji });
    setShowReactions(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meet/${meetingCode}`);
    showToast('Meeting link copied!', 'success');
  };

  const admitUser = (socketId: string) => {
    getSocket()?.emit('meeting:admit-user', { meetingId: meetingCode, socketId });
    setAdmitRequests(prev => prev.filter(r => r.socketId !== socketId));
  };

  const denyUser = (socketId: string) => {
    getSocket()?.emit('meeting:deny-user', { meetingId: meetingCode, socketId });
    setAdmitRequests(prev => prev.filter(r => r.socketId !== socketId));
  };

  // Host: mute a remote participant
  const muteParticipant = (userId: string) => {
    getSocket()?.emit('meeting:participant-update', { meetingId: meetingCode, userId, isMuted: true });
    showToast('Participant muted', 'info');
  };

  // Host: remove a participant
  const removeParticipant = (userId: string) => {
    getSocket()?.emit('meeting:remove-participant', { meetingId: meetingCode, targetUserId: userId });
    showToast('Participant removed', 'info');
  };

  const leaveMeeting = () => {
    localStream.current?.getTracks().forEach(t => t.stop());
    meetingService.leaveMeeting();
    navigate('/meet');
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !meetingCode) return;
    const socket = getSocket();
    if (!socket) return;
    socket.emit('meeting:typing', { meetingId: meetingCode, userId: currentUserId, userName: currentUserName, isTyping: false });
    const msg: ChatMessage = { userId: currentUserId, userName: currentUserName || 'You', message: chatInput.trim(), timestamp: new Date().toISOString() };
    setChatMessages(p => [...p, msg]);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    socket.emit('meeting:chat-message', { meetingId: meetingCode, message: chatInput.trim(), userName: currentUserName || 'You' });
    setChatInput('');
  };

  const handleChatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
    const socket = getSocket();
    if (!socket || !meetingCode) return;
    socket.emit('meeting:typing', { meetingId: meetingCode, userId: currentUserId, userName: currentUserName, isTyping: true });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('meeting:typing', { meetingId: meetingCode, userId: currentUserId, userName: currentUserName, isTyping: false });
    }, 2000);
  };

  const togglePiP = async () => {
    if (!localVideoRef.current) return;
    try {
      if (document.pictureInPictureElement) { await document.exitPictureInPicture(); setIsPipMode(false); }
      else { await localVideoRef.current.requestPictureInPicture(); setIsPipMode(true); }
    } catch { showToast('PiP not supported in this browser', 'warning'); }
  };

  const startRecording = async () => {
    try {
      const stream = localStream.current!;
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `slimfile-meet-${meetingCode}-${Date.now()}.webm`;
        a.click();
        showToast('Recording saved!', 'success');
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      recordingIntervalRef.current = setInterval(() => setRecordingDuration(p => p + 1), 1000);
      showToast('Recording started', 'success');
    } catch { showToast('Failed to start recording', 'warning'); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
    if (recordingIntervalRef.current) { clearInterval(recordingIntervalRef.current); recordingIntervalRef.current = null; }
    setRecordingDuration(0);
  };

  const total = remoteStreams.size + 1;
  const myInitial = currentUserName.charAt(0).toUpperCase() || 'Y';
  const myColor = avatarColor(currentUserName || 'You');

  // ── Video layout
  const renderVideos = () => {
    if (total === 1) return (
      <div className="relative w-full h-full p-1">
        <div className="absolute inset-1 bg-[#3C4043] rounded-xl sm:rounded-2xl overflow-hidden">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" style={isBackgroundBlurred ? { filter: 'blur(8px)', transform: 'scaleX(-1)' } : undefined} />
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#3C4043]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-medium" style={{ backgroundColor: myColor }}>{myInitial}</div>
            </div>
          )}
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-black/60 backdrop-blur-sm px-2 py-1 sm:px-2.5 rounded-md sm:rounded-lg flex items-center gap-1 sm:gap-1.5">
            <span className="text-white text-[10px] sm:text-xs font-medium truncate max-w-[150px] sm:max-w-none">{currentUserName} (You)</span>
            {!isMicOn && <MicOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400 flex-shrink-0" />}
          </div>
          {isHandRaised && <div className="absolute top-2 left-2 sm:top-3 sm:left-3 text-lg sm:text-xl animate-bounce">✋</div>}
          {isScreenSharing && <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#1a73e8] text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md font-medium">Sharing</div>}
        </div>
        {/* Waiting overlay — sits above controls */}
        <div className="absolute bottom-20 sm:bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-none z-10 w-full px-4">
          <div className="flex items-center gap-2 sm:gap-3 bg-[#3C4043]/90 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 rounded-full">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#BDC1C6] flex-shrink-0" />
            <span className="text-[#BDC1C6] text-xs sm:text-sm font-medium">Waiting for others to join…</span>
          </div>
          <p className="text-[#9AA0A6] text-[10px] sm:text-xs text-center">Share the meeting link to invite people</p>
        </div>
      </div>
    );

    if (total === 2 && viewMode === 'grid') {
      const [[rid, rs]] = Array.from(remoteStreams.entries());
      const remoteParticipant = participants.get(rid);

      // If someone is screen sharing, show their stream full screen
      return (
        <div className="relative w-full h-full p-1">
          <RemoteVideoCard participantId={rid} stream={rs} participant={remoteParticipant}
            isPinned={pinnedParticipant === rid} onPin={() => setPinnedParticipant(p => p === rid ? null : rid)}
            fill isActiveSpeaker={activeSpeaker === rid} />
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-32 sm:w-48 md:w-56 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border border-white/20 sm:border-2 bg-[#3C4043]" style={{ aspectRatio: '16/9' }}>
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" style={isBackgroundBlurred ? { filter: 'blur(8px)', transform: 'scaleX(-1)' } : undefined} />
            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#3C4043]">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-base sm:text-xl font-medium" style={{ backgroundColor: myColor }}>{myInitial}</div>
              </div>
            )}
            <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded text-white text-[10px] sm:text-xs font-medium">You</div>
            {!isMicOn && <MicOff className="absolute top-1 right-1 sm:top-2 sm:right-2 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-red-400" />}
            {isScreenSharing && <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-[#1a73e8] text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 rounded-md font-medium">Sharing</div>}
          </div>
        </div>
      );
    }

    if (viewMode === 'speaker' || pinnedParticipant) {
      const sid = pinnedParticipant || Array.from(remoteStreams.keys())[0];
      const ss = sid ? remoteStreams.get(sid) : null;
      return (
        <div className="w-full h-full flex flex-col gap-1.5 sm:gap-2 p-1">
          <div className="flex-1 min-h-0">
            {ss && sid
              ? <RemoteVideoCard participantId={sid} stream={ss} participant={participants.get(sid)} isPinned onPin={() => setPinnedParticipant(null)} fill isActiveSpeaker={activeSpeaker === sid} />
              : <div className="w-full h-full bg-[#3C4043] rounded-xl sm:rounded-2xl flex items-center justify-center"><p className="text-[#9AA0A6] text-sm">No active speaker</p></div>}
          </div>
          <div className="h-20 sm:h-24 flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="relative bg-[#3C4043] rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0" style={{ aspectRatio: '16/9', height: '100%' }}>
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" style={isBackgroundBlurred ? { filter: 'blur(8px)', transform: 'scaleX(-1)' } : undefined} />
              {!isCameraOn && <div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium" style={{ backgroundColor: myColor }}>{myInitial}</div></div>}
              <div className="absolute bottom-0.5 left-0.5 sm:bottom-1 sm:left-1 bg-black/60 px-1 py-0.5 sm:px-1.5 rounded text-[9px] sm:text-[10px] text-white">You</div>
              {!isMicOn && <MicOff className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400" />}
            </div>
            {Array.from(remoteStreams.entries()).filter(([id]) => id !== sid).map(([pid, st]) => (
              <div key={pid} className="relative bg-[#3C4043] rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 cursor-pointer active:ring-2 sm:hover:ring-2 ring-[#1a73e8] transition-all"
                style={{ aspectRatio: '16/9', height: '100%' }} onClick={() => setPinnedParticipant(pid)}>
                <RemoteVideoCard participantId={pid} stream={st} participant={participants.get(pid)} compact isActiveSpeaker={activeSpeaker === pid} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Responsive grid: 1 col on mobile for 2-3 people, 2 cols for 4+
    const cols = total <= 1 ? 1 : total <= 3 ? (window.innerWidth < 640 ? 1 : 2) : total <= 4 ? 2 : total <= 9 ? (window.innerWidth < 640 ? 2 : 3) : (window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4);

    return (
      <div className="grid gap-2 sm:gap-3 w-full h-full p-1" style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridAutoRows: 'minmax(0, 1fr)',
        maxHeight: '100%'
      }}>
        <div className="relative bg-[#3C4043] rounded-xl sm:rounded-2xl overflow-hidden min-h-[120px] sm:min-h-[180px]">
          <video ref={localVideoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" style={isBackgroundBlurred ? { filter: 'blur(8px)', transform: 'scaleX(-1)' } : undefined} />
          {!isCameraOn && <div className="absolute inset-0 flex items-center justify-center bg-[#3C4043]"><div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-medium" style={{ backgroundColor: myColor }}>{myInitial}</div></div>}
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg flex items-center gap-1">
            <span className="text-white text-[10px] sm:text-xs font-medium truncate max-w-[100px] sm:max-w-none">{currentUserName} (You)</span>
            {!isMicOn && <MicOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400 flex-shrink-0" />}
          </div>
          {isHandRaised && <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 text-base sm:text-lg animate-bounce">✋</div>}
          {isScreenSharing && <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-[#1a73e8] text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 rounded-md font-medium">Sharing</div>}
        </div>
        {Array.from(remoteStreams.entries()).map(([pid, st]) => (
          <RemoteVideoCard key={pid} participantId={pid} stream={st} participant={participants.get(pid)}
            isPinned={pinnedParticipant === pid} onPin={() => setPinnedParticipant(p => p === pid ? null : pid)} fill isActiveSpeaker={activeSpeaker === pid} />
        ))}
      </div>
    );
  };

  // ── Lobby screen (pre-join camera/mic check)
  if (inLobby) {
    return (
      <div className="h-screen bg-[#202124] flex flex-col items-center justify-center gap-6 px-4 select-none">
        <p className="text-[#9AA0A6] text-sm font-medium tracking-wide uppercase">Ready to join?</p>
        <h1 className="text-white text-2xl font-medium -mt-2">{meetingCode}</h1>

        {/* Camera preview */}
        <div className="relative bg-[#3C4043] rounded-2xl overflow-hidden shadow-2xl w-full max-w-sm" style={{ aspectRatio: '16/9' }}>
          <video ref={lobbyVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#3C4043]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-medium" style={{ backgroundColor: avatarColor('You') }}>
                {currentUserName.charAt(0).toUpperCase() || 'Y'}
              </div>
            </div>
          )}
          {/* Mic/cam toggles overlay */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            <button onClick={toggleMic}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isMicOn ? 'bg-black/50 text-white' : 'bg-red-600 text-white'}`}>
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <button onClick={toggleCamera}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isCameraOn ? 'bg-black/50 text-white' : 'bg-red-600 text-white'}`}>
              {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 w-full max-w-sm">
          <button
            onClick={() => setInLobby(false)}
            disabled={!isStreamReady}
            className="w-full py-3 bg-[#1a73e8] hover:bg-[#1765cc] disabled:opacity-50 text-white font-medium rounded-full transition-colors text-sm"
          >
            {isStreamReady ? 'Join now' : 'Setting up camera…'}
          </button>
          <button onClick={() => navigate('/meet')} className="text-[#9AA0A6] hover:text-white text-sm transition-colors">
            Return to home
          </button>
        </div>
      </div>
    );
  }

  // ── Checking (spinner)
  if (admissionState === 'checking') {
    return (
      <div className="h-screen bg-[#202124] flex flex-col items-center justify-center gap-4 select-none">
        <div className="w-10 h-10 border-2 border-[#3C4043] border-t-[#1a73e8] rounded-full animate-spin" />
        <p className="text-[#9AA0A6] text-sm">Connecting…</p>
      </div>
    );
  }

  // ── Waiting to be admitted
  if (admissionState === 'waiting') {
    return (
      <div className="h-screen bg-[#202124] flex flex-col items-center justify-center gap-6 select-none px-4">
        <div className="relative bg-[#3C4043] rounded-2xl overflow-hidden shadow-2xl w-full max-w-xs" style={{ aspectRatio: '16/9' }}>
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" style={isBackgroundBlurred ? { filter: 'blur(8px)', transform: 'scaleX(-1)' } : undefined} />
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#3C4043]">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-medium" style={{ backgroundColor: avatarColor(currentUserName || 'You') }}>
                {(currentUserName || 'Y').charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-full bg-[#3C4043] flex items-center justify-center animate-pulse">
            <Users className="w-5 h-5 text-[#BDC1C6]" />
          </div>
          <h2 className="text-white text-xl font-medium">Waiting to be admitted</h2>
          <p className="text-[#9AA0A6] text-sm">Someone in the meeting will let you in soon</p>
          <p className="text-[#5F6368] text-xs font-mono">{meetingCode}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={toggleMic} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMicOn ? 'bg-[#3C4043] text-white' : 'bg-red-600 text-white'}`}>
            {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
          <button onClick={toggleCamera} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isCameraOn ? 'bg-[#3C4043] text-white' : 'bg-red-600 text-white'}`}>
            {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>
          <button onClick={() => { localStream.current?.getTracks().forEach(t => t.stop()); navigate('/meet'); }}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white transition-colors">
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Denied
  if (admissionState === 'denied') {
    return (
      <div className="h-screen bg-[#202124] flex flex-col items-center justify-center gap-5 select-none">
        <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center">
          <PhoneOff className="w-7 h-7 text-red-400" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-white text-xl font-medium">You weren't let in</h2>
          <p className="text-[#9AA0A6] text-sm">The meeting host didn't admit your request</p>
        </div>
        <button onClick={() => navigate('/meet')}
          className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1765cc] text-white text-sm font-medium rounded-full transition-colors">
          Return to home
        </button>
      </div>
    );
  }

  // ── Main meeting room
  return (
    <div className="h-screen bg-[#202124] relative overflow-hidden select-none">

      {/* Header - Overlay */}
      <div className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-white font-medium text-xs sm:text-sm whitespace-nowrap">SlimFile Meet</span>
          <span className="text-[#9AA0A6] text-sm hidden sm:inline">·</span>
          <span className="text-[#9AA0A6] text-xs sm:text-sm hidden sm:inline">{clock}</span>
          {/* Meeting duration */}
          {isJoined && (
            <span className="text-[#9AA0A6] text-xs sm:text-sm font-mono">{fmt(meetingDuration)}</span>
          )}
          {/* Quality */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-[#3C4043] rounded-full">
            <Circle className={`w-2 h-2 fill-current ${connectionQuality === 'good' ? 'text-green-400' : connectionQuality === 'medium' ? 'text-yellow-400' : 'text-red-400'}`} />
            <span className="text-[#BDC1C6] text-[10px] sm:text-xs capitalize hidden sm:inline">{connectionQuality}</span>
          </div>
          {isRecording && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-600/20 border border-red-600/40 rounded-full animate-pulse">
              <Radio className="w-3 h-3 text-red-400" />
              <span className="text-red-400 text-[10px] font-medium hidden sm:inline">REC {fmt(recordingDuration)}</span>
            </div>
          )}
          {isScreenSharing && (
            <div className="flex items-center gap-1 px-2 py-1 bg-[#1a73e8]/20 border border-[#1a73e8]/40 rounded-full">
              <Monitor className="w-3 h-3 text-[#1a73e8]" />
              <span className="text-[#1a73e8] text-[10px] font-medium hidden sm:inline">Sharing</span>
            </div>
          )}
          {isHost && (
            <span className="text-[#9AA0A6] text-[10px] hidden sm:inline">Host</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#3C4043] rounded-full">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#BDC1C6]" />
            <span className="text-white text-xs sm:text-sm font-medium">{participants.size}</span>
          </div>
          <button onClick={copyLink}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 bg-[#1a73e8] hover:bg-[#1765cc] text-white text-xs sm:text-sm font-medium rounded-full transition-colors">
            <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Invite</span>
          </button>
        </div>
      </div>

      {/* Main content - Full screen */}
      <div className="absolute inset-0 flex overflow-hidden">

        {/* Video area */}
        <div className="flex-1 p-2 overflow-hidden">
          {renderVideos()}
        </div>

        {/* Floating reactions */}
        {reactions.map((r, i) => (
          <div key={`${r.userId}-${r.timestamp}`} className="fixed text-5xl pointer-events-none z-50 animate-bounce"
            style={{ left: `${15 + (i % 6) * 12}%`, bottom: '25%' }}>
            {r.emoji}
          </div>
        ))}

        {/* Participants sidebar */}
        {showParticipants && (
          <>
            {/* Mobile backdrop */}
            <div className="fixed inset-0 bg-black/50 z-40 sm:hidden" onClick={() => setShowParticipants(false)} />

            {/* Participants panel */}
            <div className="fixed inset-x-0 bottom-0 top-16 z-50 sm:static sm:inset-auto sm:w-72 bg-[#292B2F] border-l border-[#3C4043] flex flex-col flex-shrink-0 rounded-t-2xl sm:rounded-none">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#3C4043] flex-shrink-0">
                <span className="text-white font-medium text-sm">People ({participants.size})</span>
                <button
                  onClick={() => setShowParticipants(false)}
                  className="text-[#9AA0A6] hover:text-white transition-colors p-1 hover:bg-[#3C4043] rounded-full"
                  aria-label="Close participants"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {/* Self */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#3C4043]/50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0" style={{ backgroundColor: myColor }}>{myInitial}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{currentUserName}</p>
                  <p className="text-[#9AA0A6] text-xs">{isHost ? 'You · Host' : 'You'}</p>
                </div>
                <div className="flex gap-1">
                  {!isMicOn && <MicOff className="w-4 h-4 text-red-400" />}
                  {!isCameraOn && <VideoOff className="w-4 h-4 text-red-400" />}
                  {isHandRaised && <span className="text-sm">✋</span>}
                </div>
              </div>
              {/* Others */}
              {Array.from(participants.entries()).filter(([id]) => id !== currentUserId)
                .sort((a, b) => {
                  if (a[1].isHandRaised && !b[1].isHandRaised) return -1;
                  if (!a[1].isHandRaised && b[1].isHandRaised) return 1;
                  return a[1].userName.localeCompare(b[1].userName);
                })
                .map(([pid, p]) => (
                  <div key={pid} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#3C4043]/50 cursor-pointer group"
                    onClick={() => setPinnedParticipant(prev => prev === pid ? null : pid)}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                      style={{ backgroundColor: avatarColor(p.userName) }}>{p.userName.charAt(0).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{p.userName}</p>
                      {activeSpeaker === pid && <p className="text-[#1a73e8] text-[10px]">Speaking</p>}
                    </div>
                    <div className="flex gap-1 items-center">
                      {p.isHandRaised && <span className="text-sm animate-bounce">✋</span>}
                      {p.isScreenSharing && <Monitor className="w-4 h-4 text-[#1a73e8]" />}
                      {p.isMuted && <MicOff className="w-4 h-4 text-red-400" />}
                      {p.isCameraOff && <VideoOff className="w-4 h-4 text-red-400" />}
                      {pinnedParticipant === pid && <Pin className="w-3.5 h-3.5 text-[#1a73e8]" />}
                      {/* Host controls */}
                      {isHost && (
                        <div className="hidden group-hover:flex gap-1 ml-1">
                          {!p.isMuted && (
                            <button onClick={e => { e.stopPropagation(); muteParticipant(pid); }}
                              className="p-1 rounded-full bg-[#3C4043] hover:bg-red-600/20 text-[#9AA0A6] hover:text-red-400 transition-colors" title="Mute">
                              <MicOff className="w-3 h-3" />
                            </button>
                          )}
                          <button onClick={e => { e.stopPropagation(); removeParticipant(pid); }}
                            className="p-1 rounded-full bg-[#3C4043] hover:bg-red-600/20 text-[#9AA0A6] hover:text-red-400 transition-colors" title="Remove">
                            <PhoneOff className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          </>
        )}

        {/* Chat sidebar */}
        {showChat && (
          <>
            {/* Mobile backdrop */}
            <div className="fixed inset-0 bg-black/50 z-40 sm:hidden" onClick={() => setShowChat(false)} />

            {/* Chat panel */}
            <div className="fixed inset-x-0 bottom-0 top-16 z-50 sm:static sm:inset-auto sm:w-80 bg-[#292B2F] border-l border-[#3C4043] flex flex-col flex-shrink-0 rounded-t-2xl sm:rounded-none">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#3C4043] flex-shrink-0">
                <span className="text-white font-medium text-sm">In-call messages</span>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-[#9AA0A6] hover:text-white transition-colors p-1 hover:bg-[#3C4043] rounded-full"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <MessageSquare className="w-12 h-12 text-[#5F6368]" />
                    <p className="text-[#9AA0A6] text-xs text-center">
                      Messages can only be seen by<br />people in the call
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg, i) => {
                    const isMe = msg.userId === currentUserId;
                    return (
                      <div key={i} className={`flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                        {!isMe && <span className="text-[#9AA0A6] text-[10px] px-2">{msg.userName}</span>}
                        <div className={`max-w-[85%] sm:max-w-[75%] px-3 py-2 rounded-2xl text-sm break-words ${
                          isMe
                            ? 'bg-[#1a73e8] text-white rounded-tr-md'
                            : 'bg-[#3C4043] text-white rounded-tl-md'
                        }`}>
                          {msg.message}
                        </div>
                        <span className="text-[#9AA0A6] text-[9px] px-2">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}

                {/* Typing indicator */}
                {typingUsers.size > 0 && (
                  <div className="flex items-center gap-2 text-[#9AA0A6] text-xs px-2">
                    <div className="flex gap-0.5">
                      {[0, 150, 300].map(d => (
                        <span
                          key={d}
                          className="w-1.5 h-1.5 bg-[#9AA0A6] rounded-full animate-bounce"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                    <span className="truncate">
                      {Array.from(typingUsers).slice(0, 2).join(', ')} typing…
                    </span>
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={chatEndRef} />
              </div>

              {/* Input area */}
              <form onSubmit={sendChatMessage} className="p-3 border-t border-[#3C4043] flex-shrink-0 bg-[#292B2F]">
                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={handleChatInput}
                    placeholder="Send a message…"
                    autoComplete="off"
                    className="flex-1 bg-[#3C4043] text-white text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1a73e8] placeholder-[#9AA0A6] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="px-3 sm:px-4 py-2 bg-[#1a73e8] hover:bg-[#1765cc] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-full transition-all active:scale-95 flex-shrink-0"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Controls bar - Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 z-30 pb-4 sm:pb-6 pt-6 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        onMouseEnter={() => setShowControls(true)}>
        <div className="flex items-end justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto px-3 sm:px-0 scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}>

          <CtrlBtn onClick={toggleMic} active={isMicOn} label={isMicOn ? 'Mute' : 'Unmute'}>
            {isMicOn ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
          </CtrlBtn>

          <CtrlBtn onClick={toggleCamera} active={isCameraOn} label={isCameraOn ? 'Camera off' : 'Camera on'}>
            {isCameraOn ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
          </CtrlBtn>

          <CtrlBtn onClick={toggleScreenShare} active={!isScreenSharing} label={isScreenSharing ? 'Stop sharing' : 'Present'}>
            {isScreenSharing ? <MonitorOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />}
          </CtrlBtn>

          <CtrlBtn onClick={toggleHandRaise} active={!isHandRaised} label={isHandRaised ? 'Lower hand' : 'Raise hand'}>
            <Hand className="w-4 h-4 sm:w-5 sm:h-5" />
          </CtrlBtn>

          {/* Reactions */}
          <div className="relative flex flex-col items-center gap-1 flex-shrink-0">
            <button onClick={() => setShowReactions(p => !p)}
              className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#3C4043] hover:bg-[#4A4D51] flex items-center justify-center text-white transition-colors">
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="text-[#BDC1C6] text-[10px] font-medium hidden sm:block">React</span>
            {showReactions && (
              <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 bg-[#292B2F] border border-[#3C4043] rounded-2xl p-2 sm:p-3 shadow-2xl flex gap-1.5 sm:gap-2 z-50">
                {['👍','❤️','😂','😮','👏','🎉'].map(e => (
                  <button key={e} onClick={() => sendReaction(e)} className="text-xl sm:text-2xl hover:scale-125 transition-transform p-1 sm:p-1.5 rounded-xl hover:bg-[#3C4043]">{e}</button>
                ))}
              </div>
            )}
          </div>

          <CtrlBtn onClick={() => setShowChat(p => !p)} active={!showChat} label="Chat">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </CtrlBtn>

          <CtrlBtn onClick={() => setShowParticipants(p => !p)} active={!showParticipants} label="People">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </CtrlBtn>

          {remoteStreams.size > 0 && (
            <CtrlBtn onClick={() => setViewMode(p => p === 'grid' ? 'speaker' : 'grid')} label={viewMode === 'grid' ? 'Speaker' : 'Grid'}>
              {viewMode === 'grid' ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Grid className="w-4 h-4 sm:w-5 sm:h-5" />}
            </CtrlBtn>
          )}

          <CtrlBtn onClick={() => setShowSettings(p => !p)} label="More">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </CtrlBtn>

          <CtrlBtn onClick={leaveMeeting} danger label="Leave">
            <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
          </CtrlBtn>
        </div>

        <p className="hidden sm:block text-center text-[#E8EAED] text-[10px] mt-2 drop-shadow-md">
          Meeting ID: <span className="font-mono">{meetingCode}</span>
        </p>
      </div>

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowSettings(false)}>
          <div className="bg-[#292B2F] rounded-2xl p-6 w-full max-w-sm mx-4 border border-[#3C4043] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="text-white font-medium">Settings</span>
              <button onClick={() => setShowSettings(false)} className="text-[#9AA0A6] hover:text-white text-xl">×</button>
            </div>
            <div className="space-y-2">
              {[
                { icon: isPipMode ? Minimize2 : Maximize2, label: 'Picture-in-Picture', sub: 'Float your video on top', action: togglePiP, active: isPipMode },
                { icon: Bell, label: 'Notification sounds', sub: 'Sounds when people join/leave', action: () => setNotificationSounds(p => !p), active: notificationSounds },
                { icon: Monitor, label: 'Background blur', sub: 'Blur your background', action: () => setIsBackgroundBlurred(p => !p), active: isBackgroundBlurred },
                { icon: isRecording ? Square : Radio, label: 'Record meeting', sub: isRecording ? `Recording: ${fmt(recordingDuration)}` : 'Save as video file', action: isRecording ? stopRecording : startRecording, active: isRecording, danger: isRecording },
              ].map(({ icon: Icon, label, sub, action, active, danger }) => (
                <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-[#3C4043]/50 hover:bg-[#3C4043] cursor-pointer" onClick={action}>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${danger ? 'text-red-400' : active ? 'text-[#1a73e8]' : 'text-[#9AA0A6]'}`} />
                    <div>
                      <p className="text-white text-sm font-medium">{label}</p>
                      <p className="text-[#9AA0A6] text-xs">{sub}</p>
                    </div>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors ${active ? (danger ? 'bg-red-600' : 'bg-[#1a73e8]') : 'bg-[#5F6368]'} flex items-center`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mx-0.5 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admit requests */}
      {admitRequests.length > 0 && (
        <div className="absolute bottom-24 sm:bottom-28 left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 flex flex-col gap-2 items-stretch sm:items-center">
          {admitRequests.map(req => (
            <div key={req.socketId} className="flex items-center gap-3 sm:gap-4 bg-[#292B2F] border border-[#3C4043] rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 shadow-2xl sm:min-w-[340px]">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                style={{ backgroundColor: avatarColor(req.userName) }}>
                {req.userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{req.userName}</p>
                <p className="text-[#9AA0A6] text-xs">wants to join</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => denyUser(req.socketId)}
                  className="px-3.5 py-1.5 rounded-full border border-[#5F6368] text-[#BDC1C6] text-xs font-medium hover:bg-[#3C4043] transition-colors">
                  Deny
                </button>
                <button onClick={() => admitUser(req.socketId)}
                  className="px-3.5 py-1.5 rounded-full bg-[#1a73e8] hover:bg-[#1765cc] text-white text-xs font-medium transition-colors">
                  Admit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-16 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-2.5 rounded-xl shadow-lg text-white text-sm font-medium ${t.type === 'success' ? 'bg-[#34a853]' : t.type === 'warning' ? 'bg-[#fbbc04] text-gray-900' : 'bg-[#3C4043]'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

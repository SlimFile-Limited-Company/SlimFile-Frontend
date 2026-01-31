import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Copy,
  Users,
  Settings,
  MessageSquare,
  Hand,
  Smile,
  Grid,
  User,
  Pin,
  MoreVertical,
  UserPlus,
  Circle,
  Maximize2,
  Minimize2,
  Sparkles,
  Bell,
  BellOff,
  Radio,
  Square,
} from 'lucide-react';
import { isAuthenticated, getToken } from '@/lib/auth';
import { meetingService } from '@/services/meetingService';
import { initializeSocket, getSocket } from '@/services/socketService';

interface ChatMessage {
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

interface Participant {
  userId: string;
  userName: string;
  isHandRaised: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  socketId?: string;
}

interface Reaction {
  userId: string;
  userName: string;
  emoji: string;
  timestamp: number;
}

export default function MeetingRoom() {
  const { meetingCode } = useParams<{ meetingCode: string }>();
  const navigate = useNavigate();

  // Media states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isStreamReady, setIsStreamReady] = useState(false);

  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Participant management
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // New features
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker'>('grid');
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'medium' | 'poor'>('good');
  const [isPipMode, setIsPipMode] = useState(false);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSounds, setNotificationSounds] = useState(true);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'info' | 'success' | 'warning' }>>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Initialize local media
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        console.log('Requesting camera and microphone access...');

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        console.log('Media access granted:', stream.getTracks().map(t => t.kind));

        localStream.current = stream;
        // Set stream in meeting service so it can add tracks to peer connections
        meetingService.setLocalStream(stream);

        // Wait for video element to be ready
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          // Force play to ensure video starts
          localVideoRef.current.play().catch(e => console.error('Video play error:', e));
        }

        // Signal that stream is ready
        setIsStreamReady(true);
      } catch (error: any) {
        console.error('Error accessing media devices:', error);

        let errorMessage = 'Unable to access camera/microphone. ';

        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage += 'Permission denied. Please allow camera and microphone access in your browser settings.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage += 'No camera or microphone found on this device.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage += 'Camera or microphone is already in use by another application.';
        } else {
          errorMessage += error.message || 'Please check your device permissions.';
        }

        alert(errorMessage);
      }
    };

    // Add a small delay to ensure component is mounted
    const timeoutId = setTimeout(() => {
      initializeMedia();
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Join meeting and set up WebRTC signaling
  useEffect(() => {
    if (!meetingCode || !isStreamReady || !localStream.current) {
      console.log('Waiting for stream...', { meetingCode, isStreamReady, hasStream: !!localStream.current });
      return;
    }

    console.log('Initializing meeting connection with stream ready...');

    // Initialize socket if not already connected
    const socket = getSocket();
    if (!socket || !socket.connected) {
      initializeSocket();
    }

    // Get userId and userName from token
    const token = getToken();
    let userId = `guest-${Date.now()}`;
    let userName = 'Guest User';

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id || `user-${Date.now()}`;
        userName = payload.name || payload.email || 'User';
        setCurrentUserId(userId);
        setCurrentUserName(userName);
      } catch (e) {
        console.error('Failed to parse token:', e);
        userId = `user-${Date.now()}`;
        userName = 'User';
      }
    }

    // Add self to participants
    setParticipants((prev) => {
      const newParticipants = new Map(prev);
      newParticipants.set(userId, {
        userId,
        userName,
        isHandRaised: false,
        isMuted: !isMicOn,
        isCameraOff: !isCameraOn,
      });
      return newParticipants;
    });

    // Set up meeting service callbacks
    meetingService.onRemoteStreamAdded = (participantId: string, stream: MediaStream) => {
      console.log('Remote stream added from:', participantId);
      setRemoteStreams((prev) => {
        const newStreams = new Map(prev);
        newStreams.set(participantId, stream);
        return newStreams;
      });
    };

    meetingService.onParticipantLeft = (participantId: string) => {
      console.log('Participant left:', participantId);

      const participant = participants.get(participantId);

      setRemoteStreams((prev) => {
        const newStreams = new Map(prev);
        newStreams.delete(participantId);
        return newStreams;
      });
      setParticipants((prev) => {
        const newParticipants = new Map(prev);
        newParticipants.delete(participantId);
        return newParticipants;
      });

      // Play notification sound
      if (notificationSounds && participant) {
        playNotificationSound('leave');
        showToast(`${participant.userName} left the meeting`, 'warning');
      }
    };

    meetingService.onParticipantMetadata = (participantId: string, userName: string) => {
      console.log('Participant metadata received:', participantId, userName);
      setParticipants((prev) => {
        const newParticipants = new Map(prev);
        newParticipants.set(participantId, {
          userId: participantId,
          userName: userName,
          isHandRaised: false,
          isMuted: false,
          isCameraOff: false,
        });
        return newParticipants;
      });
    };

    // Join the meeting
    try {
      meetingService.joinMeeting(meetingCode, userId, userName);
      console.log('Joined meeting:', meetingCode, 'as', userName);
    } catch (error) {
      console.error('Failed to join meeting:', error);
      alert('Failed to join meeting. Please try again.');
    }

    // Cleanup on unmount
    return () => {
      console.log('Leaving meeting...');
      meetingService.leaveMeeting();
    };
  }, [meetingCode, isStreamReady]);

  // Monitor connection quality
  useEffect(() => {
    const monitorConnection = setInterval(() => {
      const socket = getSocket();
      if (!socket || !socket.connected) {
        setConnectionQuality('poor');
        return;
      }

      // Simple quality check based on socket state
      const latency = socket.io.engine?.transport?.ping || 0;
      if (latency < 100) {
        setConnectionQuality('good');
      } else if (latency < 250) {
        setConnectionQuality('medium');
      } else {
        setConnectionQuality('poor');
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(monitorConnection);
  }, []);

  // Picture-in-Picture event listeners
  useEffect(() => {
    const handlePipChange = () => {
      setIsPipMode(!!document.pictureInPictureElement);
    };

    document.addEventListener('enterpictureinpicture', handlePipChange);
    document.addEventListener('leavepictureinpicture', handlePipChange);

    return () => {
      document.removeEventListener('enterpictureinpicture', handlePipChange);
      document.removeEventListener('leavepictureinpicture', handlePipChange);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Cmd/Ctrl + D: Toggle microphone
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        toggleMic();
      }

      // Cmd/Ctrl + E: Toggle camera
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        toggleCamera();
      }

      // Cmd/Ctrl + H: Toggle raise hand
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        toggleHandRaise();
      }

      // Cmd/Ctrl + Shift + M: Toggle chat
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        setShowChat((prev) => !prev);
      }

      // Cmd/Ctrl + Shift + P: Toggle participants
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowParticipants((prev) => !prev);
      }

      // Cmd/Ctrl + Shift + V: Toggle view mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        toggleViewMode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isMicOn, isCameraOn, isHandRaised]); // Include dependencies

  // Listen for chat messages and new features
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleChatMessage = (data: ChatMessage) => {
      setChatMessages((prev) => [...prev, data]);
      // Auto-scroll to bottom
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    const handleParticipantJoined = (data: { userId: string; userName: string }) => {
      setParticipants((prev) => {
        const newParticipants = new Map(prev);
        newParticipants.set(data.userId, {
          userId: data.userId,
          userName: data.userName,
          isHandRaised: false,
          isMuted: false,
          isCameraOff: false,
        });
        return newParticipants;
      });

      // Play notification sound
      if (notificationSounds) {
        playNotificationSound('join');
      }

      // Show toast notification
      showToast(`${data.userName} joined the meeting`, 'info');
    };

    const handleHandRaised = (data: { userId: string; isRaised: boolean; userName?: string }) => {
      setParticipants((prev) => {
        const newParticipants = new Map(prev);
        const participant = newParticipants.get(data.userId);
        if (participant) {
          participant.isHandRaised = data.isRaised;
          newParticipants.set(data.userId, { ...participant });
        }
        return newParticipants;
      });
    };

    const handleReaction = (data: { userId: string; userName: string; emoji: string }) => {
      const reaction: Reaction = {
        ...data,
        timestamp: Date.now(),
      };
      setReactions((prev) => [...prev, reaction]);
      // Remove reaction after 3 seconds
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.timestamp !== reaction.timestamp));
      }, 3000);
    };

    const handleParticipantUpdate = (data: Partial<Participant> & { userId: string }) => {
      setParticipants((prev) => {
        const newParticipants = new Map(prev);
        const participant = newParticipants.get(data.userId);
        if (participant) {
          newParticipants.set(data.userId, { ...participant, ...data });
        }
        return newParticipants;
      });
    };

    const handleUserTyping = (data: { userId: string; userName: string; isTyping: boolean }) => {
      if (data.userId === currentUserId) return; // Don't show own typing

      setTypingUsers((prev) => {
        const newTyping = new Set(prev);
        if (data.isTyping) {
          newTyping.add(data.userName);
        } else {
          newTyping.delete(data.userName);
        }
        return newTyping;
      });
    };

    socket.on('meeting:chat-message', handleChatMessage);
    socket.on('meeting:participant-joined', handleParticipantJoined);
    socket.on('meeting:hand-raised', handleHandRaised);
    socket.on('meeting:reaction', handleReaction);
    socket.on('meeting:participant-update', handleParticipantUpdate);
    socket.on('meeting:user-typing', handleUserTyping);

    return () => {
      socket.off('meeting:chat-message', handleChatMessage);
      socket.off('meeting:participant-joined', handleParticipantJoined);
      socket.off('meeting:hand-raised', handleHandRaised);
      socket.off('meeting:reaction', handleReaction);
      socket.off('meeting:participant-update', handleParticipantUpdate);
      socket.off('meeting:user-typing', handleUserTyping);
    };
  }, []);

  const toggleMic = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);

        // Notify other participants
        const socket = getSocket();
        if (socket && meetingCode) {
          socket.emit('meeting:participant-update', {
            meetingId: meetingCode,
            userId: currentUserId,
            isMuted: !audioTrack.enabled,
          });
        }
      }
    }
  };

  const toggleCamera = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);

        // Notify other participants
        const socket = getSocket();
        if (socket && meetingCode) {
          socket.emit('meeting:participant-update', {
            meetingId: meetingCode,
            userId: currentUserId,
            isCameraOff: !videoTrack.enabled,
          });
        }
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      setIsScreenSharing(false);
      // TODO: Revert to camera stream
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        // TODO: Switch video track to screen stream
        setIsScreenSharing(true);

        // When user stops sharing via browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    }
  };

  const copyMeetingLink = () => {
    const meetingLink = `${window.location.origin}/meet/${meetingCode}`;
    navigator.clipboard.writeText(meetingLink);
    alert('Meeting link copied to clipboard!');
  };

  const leaveMeeting = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    navigate('/meet');
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);

    const socket = getSocket();
    if (!socket || !meetingCode) return;

    // Emit typing indicator
    socket.emit('meeting:typing', {
      meetingId: meetingCode,
      userId: currentUserId,
      userName: currentUserName,
      isTyping: true,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('meeting:typing', {
        meetingId: meetingCode,
        userId: currentUserId,
        userName: currentUserName,
        isTyping: false,
      });
    }, 2000);
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatInput.trim() || !meetingCode) return;

    const socket = getSocket();
    if (!socket) {
      alert('Not connected to meeting');
      return;
    }

    // Stop typing indicator
    socket.emit('meeting:typing', {
      meetingId: meetingCode,
      userId: currentUserId,
      userName: currentUserName,
      isTyping: false,
    });

    // Add message to local chat immediately
    const newMessage: ChatMessage = {
      userId: currentUserId,
      userName: currentUserName || 'Anonymous',
      message: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMessage]);

    // Auto-scroll to bottom
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Emit chat message
    socket.emit('meeting:chat-message', {
      meetingId: meetingCode,
      message: chatInput.trim(),
      userName: currentUserName || 'Anonymous',
    });

    // Clear input
    setChatInput('');
  };

  const toggleHandRaise = () => {
    const newHandRaisedState = !isHandRaised;
    setIsHandRaised(newHandRaisedState);

    const socket = getSocket();
    if (socket && meetingCode) {
      socket.emit('meeting:raise-hand', {
        meetingId: meetingCode,
        userId: currentUserId,
        userName: currentUserName,
        isRaised: newHandRaisedState,
      });
    }
  };

  const sendReaction = (emoji: string) => {
    const socket = getSocket();
    if (socket && meetingCode) {
      socket.emit('meeting:reaction', {
        meetingId: meetingCode,
        userId: currentUserId,
        userName: currentUserName,
        emoji,
      });
    }
    setShowReactions(false);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'grid' ? 'speaker' : 'grid'));
  };

  const pinParticipant = (participantId: string) => {
    setPinnedParticipant((prev) => (prev === participantId ? null : participantId));
  };

  const togglePictureInPicture = async () => {
    if (!localVideoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPipMode(false);
      } else {
        await localVideoRef.current.requestPictureInPicture();
        setIsPipMode(true);
      }
    } catch (error) {
      console.error('PiP error:', error);
      alert('Picture-in-Picture is not supported on this browser');
    }
  };

  const toggleBackgroundBlur = async () => {
    if (!localStream.current) return;

    // This is a placeholder - actual implementation would require a library like @mediapipe/selfie_segmentation
    // For now, we'll just toggle the state
    setIsBackgroundBlurred((prev) => !prev);

    // In production, you would:
    // 1. Use MediaPipe or TensorFlow.js for background segmentation
    // 2. Apply blur to background pixels
    // 3. Replace the video track with the processed stream

    showToast(
      isBackgroundBlurred
        ? 'Background blur disabled'
        : 'Background blur enabled (Demo mode)',
      'info'
    );
  };

  const playNotificationSound = (type: 'join' | 'leave' | 'message') => {
    if (!notificationSounds) return;

    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different events
    oscillator.frequency.value = type === 'join' ? 800 : type === 'leave' ? 400 : 600;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const showToast = (message: string, type: 'info' | 'success' | 'warning') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const startRecording = async () => {
    if (!localStream.current) {
      showToast('Cannot start recording: No stream available', 'warning');
      return;
    }

    try {
      // Create a canvas to combine local and remote streams
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      // For now, just record the local stream
      // In production, you'd combine all video streams on the canvas
      const recordingStream = canvas.captureStream(30);

      // Add audio from local stream
      if (localStream.current.getAudioTracks().length > 0) {
        recordingStream.addTrack(localStream.current.getAudioTracks()[0]);
      }

      const mediaRecorder = new MediaRecorder(recordingStream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `slimfile-meet-${meetingCode}-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);

        showToast('Recording saved successfully!', 'success');
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      showToast('Recording started', 'success');
    } catch (error) {
      console.error('Recording error:', error);
      showToast('Failed to start recording', 'warning');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      setRecordingDuration(0);
      showToast('Recording stopped', 'info');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 px-4 py-3 flex-shrink-0 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-white font-semibold text-lg">SlimFile Meet</h1>
              <p className="text-gray-400 text-sm">Meeting: {meetingCode}</p>
            </div>

            {/* Connection Quality Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full">
              <Circle
                className={`w-2 h-2 ${
                  connectionQuality === 'good'
                    ? 'text-green-500 fill-green-500'
                    : connectionQuality === 'medium'
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-red-500 fill-red-500'
                }`}
              />
              <span className="text-gray-300 text-xs capitalize">{connectionQuality}</span>
            </div>

            {/* Recording Indicator */}
            {isRecording && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full animate-pulse">
                <Radio className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-medium">REC {formatDuration(recordingDuration)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Participant count badge */}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full">
              <Users className="w-4 h-4 text-gray-300" />
              <span className="text-white text-sm font-medium">{participants.size}</span>
            </div>

            <Button
              onClick={copyMeetingLink}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              Invite
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden min-h-0">
        {/* Video Grid */}
        <div className="flex-1 p-6 flex items-center justify-center overflow-y-auto overflow-x-hidden">
          {(() => {
            const totalParticipants = remoteStreams.size + 1; // +1 for self
            const remoteCount = remoteStreams.size;

            // Calculate grid class based on participant count
            let gridClass = 'grid gap-4 w-full h-full';
            if (totalParticipants === 1) {
              gridClass = 'flex flex-col items-center justify-center w-full h-full'; // Centered view when alone
            } else if (totalParticipants === 2) {
              // Google Meet style: 2 people = large view with small PiP
              gridClass = 'relative w-full h-full';
            } else if (totalParticipants <= 4) {
              gridClass += ' grid-cols-1 md:grid-cols-2 auto-rows-fr max-w-7xl mx-auto'; // 2x2 grid
            } else if (totalParticipants <= 9) {
              gridClass += ' grid-cols-2 md:grid-cols-3 auto-rows-fr max-w-7xl mx-auto'; // 3x3 grid
            } else if (totalParticipants <= 16) {
              gridClass += ' grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr max-w-7xl mx-auto'; // 4x4 grid
            } else {
              gridClass += ' grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr max-w-7xl mx-auto'; // 5 columns for many
            }

            // 2-PERSON LAYOUT: Google Meet style (1 large + 1 small PiP)
            if (totalParticipants === 2 && viewMode === 'grid') {
              const [firstRemoteId, firstRemoteStream] = Array.from(remoteStreams.entries())[0];
              const firstParticipant = participants.get(firstRemoteId);

              return (
                <div className="relative w-full h-full">
                  {/* Large view - Remote participant */}
                  <div className="w-full h-full">
                    <RemoteVideoCard
                      participantId={firstRemoteId}
                      stream={firstRemoteStream}
                      participant={firstParticipant}
                      isPinned={pinnedParticipant === firstRemoteId}
                      onPin={() => pinParticipant(firstRemoteId)}
                    />
                  </div>

                  {/* Small PiP - You (bottom-right corner) */}
                  <div className="absolute bottom-6 right-6 w-72 md:w-80 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-600 z-10 hover:scale-105 transition-transform">
                    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 aspect-video">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                      {!isCameraOn && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full p-4 shadow-xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                              {currentUserName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700">
                        <span className="text-white text-xs font-semibold">{currentUserName} (You)</span>
                      </div>
                      {!isMicOn && (
                        <div className="absolute top-2 right-2 bg-red-600 rounded-full p-1.5 shadow-lg">
                          <MicOff className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      {isHandRaised && (
                        <div className="absolute top-2 left-2 bg-yellow-500 rounded-full p-1.5 animate-bounce shadow-lg">
                          <Hand className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // SPEAKER VIEW: Pinned or first participant large
            if (viewMode === 'speaker' || pinnedParticipant) {
              const speakerId = pinnedParticipant || Array.from(remoteStreams.keys())[0];
              const speakerStream = speakerId ? remoteStreams.get(speakerId) : null;
              const speakerParticipant = speakerId ? participants.get(speakerId) : undefined;

              return (
                <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
                  {/* Large speaker view */}
                  <div className="flex-1 min-h-0">
                    {speakerStream && speakerId ? (
                      <RemoteVideoCard
                        participantId={speakerId}
                        stream={speakerStream}
                        participant={speakerParticipant}
                        isPinned={pinnedParticipant === speakerId}
                        onPin={() => pinParticipant(speakerId)}
                      />
                    ) : (
                      <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video h-full flex items-center justify-center">
                        <div className="text-center">
                          <Users className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400">No active speaker</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnails at bottom */}
                  <div className="h-28 overflow-x-auto">
                    <div className="flex gap-2 h-full">
                      {/* Local video thumbnail */}
                      <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video h-full flex-shrink-0 w-40">
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                        {!isCameraOn && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {currentUserName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 px-2 py-0.5 rounded-full">
                          <span className="text-white text-xs">You</span>
                        </div>
                      </div>

                      {/* Remote participants thumbnails */}
                      {Array.from(remoteStreams.entries())
                        .filter(([id]) => id !== speakerId)
                        .map(([participantId, stream]) => (
                          <div
                            key={participantId}
                            className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video h-full flex-shrink-0 w-40 cursor-pointer hover:ring-2 hover:ring-purple-500"
                            onClick={() => pinParticipant(participantId)}
                          >
                            <video
                              ref={(el) => {
                                if (el && stream) {
                                  el.srcObject = stream;
                                  el.play().catch((e) => console.error('Thumbnail play error:', e));
                                }
                              }}
                              autoPlay
                              playsInline
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 px-2 py-0.5 rounded-full">
                              <span className="text-white text-xs">
                                {participants.get(participantId)?.userName || participantId.substring(0, 8)}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              );
            }

            // GRID VIEW: Standard grid for 1, 3+ participants

            // SOLO VIEW: Just you - Google Meet style centered view
            if (totalParticipants === 1) {
              return (
                <div className={gridClass}>
                  <div className="w-full max-w-5xl px-4">
                    {/* Your Video - Large centered */}
                    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden aspect-video shadow-2xl border border-gray-700">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                      {!isCameraOn && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full p-10 shadow-xl">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                              {currentUserName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-gray-700">
                        <span className="text-white text-base font-semibold">{currentUserName}</span>
                        <span className="text-gray-400 text-sm">(You)</span>
                        {!isMicOn && <MicOff className="w-4 h-4 text-red-400" />}
                      </div>
                      {isHandRaised && (
                        <div className="absolute top-4 left-4 bg-yellow-500 rounded-full p-3 animate-bounce shadow-lg">
                          <Hand className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Waiting message below video - with bottom padding to avoid controls */}
                    <div className="text-center mt-8 mb-24">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-4 rounded-full border border-gray-600 shadow-lg">
                        <Users className="w-6 h-6 text-purple-400" />
                        <p className="text-white text-base font-medium">Waiting for others to join...</p>
                      </div>
                      <p className="text-gray-400 text-sm mt-4 font-medium">Share the meeting link to invite people</p>
                    </div>
                  </div>
                </div>
              );
            }

            // GRID VIEW: 3+ participants
            return (
              <div className={gridClass}>
                {/* Local Video */}
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden aspect-video border border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  {!isCameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full p-6 shadow-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {currentUserName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md border border-gray-700">
                    <span className="text-white text-sm font-semibold">{currentUserName}</span>
                    <span className="text-gray-400 text-xs">(You)</span>
                    {!isMicOn && <MicOff className="w-3.5 h-3.5 text-red-400" />}
                  </div>
                  {isHandRaised && (
                    <div className="absolute top-3 left-3 bg-yellow-500 rounded-full p-2 animate-bounce shadow-lg">
                      <Hand className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Remote Participants */}
                {Array.from(remoteStreams.entries()).map(([participantId, stream]) => (
                  <RemoteVideoCard
                    key={participantId}
                    participantId={participantId}
                    stream={stream}
                    participant={participants.get(participantId)}
                    isPinned={pinnedParticipant === participantId}
                    onPin={() => pinParticipant(participantId)}
                  />
                ))}
              </div>
            );
          })()}
        </div>

        {/* Floating Reactions */}
        {reactions.map((reaction, index) => (
          <div
            key={`${reaction.userId}-${reaction.timestamp}`}
            className="fixed text-6xl animate-float-up pointer-events-none z-50"
            style={{
              left: `${20 + (index % 5) * 15}%`,
              bottom: '20%',
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {reaction.emoji}
          </div>
        ))}

        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                Participants ({participants.size})
              </h3>
              <button
                onClick={() => setShowParticipants(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {/* You */}
              <div className="flex items-center gap-3 p-2 rounded bg-gray-700 hover:bg-gray-600">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {currentUserName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <span className="text-white font-medium">{currentUserName}</span>
                  <span className="text-gray-400 text-xs ml-1">(You)</span>
                </div>
                <div className="flex items-center gap-1">
                  {isHandRaised && (
                    <div className="bg-yellow-500 rounded-full p-1">
                      <Hand className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {!isMicOn && <MicOff className="w-4 h-4 text-red-500" />}
                  {!isCameraOn && <VideoOff className="w-4 h-4 text-red-500" />}
                </div>
              </div>

              {/* Remote participants */}
              {Array.from(participants.entries())
                .filter(([id]) => id !== currentUserId)
                .sort((a, b) => {
                  // Sort by hand raised first, then alphabetically
                  if (a[1].isHandRaised && !b[1].isHandRaised) return -1;
                  if (!a[1].isHandRaised && b[1].isHandRaised) return 1;
                  return a[1].userName.localeCompare(b[1].userName);
                })
                .map(([participantId, participant]) => (
                  <div
                    key={participantId}
                    className="flex items-center gap-3 p-2 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
                    onClick={() => pinParticipant(participantId)}
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {participant.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-medium">{participant.userName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {participant.isHandRaised && (
                        <div className="bg-yellow-500 rounded-full p-1 animate-bounce">
                          <Hand className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {participant.isMuted && <MicOff className="w-4 h-4 text-red-500" />}
                      {participant.isCameraOff && <VideoOff className="w-4 h-4 text-red-500" />}
                      {pinnedParticipant === participantId && (
                        <Pin className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {chatMessages.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                chatMessages.map((msg, index) => {
                  const isOwnMessage = msg.userName === currentUserName;
                  return (
                    <div
                      key={index}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isOwnMessage
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        {!isOwnMessage && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {msg.userName}
                            </span>
                          </div>
                        )}
                        <p className="text-sm break-words">{msg.message}</p>
                        <span className={`text-xs mt-1 block ${
                          isOwnMessage ? 'text-purple-200' : 'text-gray-400'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {typingUsers.size > 0 && (
                <div className="flex items-center gap-2 text-gray-400 text-sm px-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>
                    {Array.from(typingUsers).slice(0, 2).join(', ')}
                    {typingUsers.size > 2 && ` and ${typingUsers.size - 2} more`} typing...
                  </span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendChatMessage} className="flex flex-col gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={handleChatInputChange}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-400"
              />
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 w-full py-3">
                Send Message
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 border-t border-gray-600 px-4 py-5 flex-shrink-0 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          {/* Microphone */}
          <Button
            onClick={toggleMic}
            className={`rounded-full w-12 h-12 p-0 ${
              isMicOn
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isMicOn ? (
              <Mic className="w-5 h-5 text-white" />
            ) : (
              <MicOff className="w-5 h-5 text-white" />
            )}
          </Button>

          {/* Camera */}
          <Button
            onClick={toggleCamera}
            className={`rounded-full w-12 h-12 p-0 ${
              isCameraOn
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isCameraOn ? (
              <Video className="w-5 h-5 text-white" />
            ) : (
              <VideoOff className="w-5 h-5 text-white" />
            )}
          </Button>

          {/* Screen Share */}
          <Button
            onClick={toggleScreenShare}
            className={`rounded-full w-12 h-12 p-0 ${
              isScreenSharing
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isScreenSharing ? (
              <MonitorOff className="w-5 h-5 text-white" />
            ) : (
              <Monitor className="w-5 h-5 text-white" />
            )}
          </Button>

          {/* Raise Hand */}
          <Button
            onClick={toggleHandRaise}
            className={`rounded-full w-12 h-12 p-0 ${
              isHandRaised
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Raise hand"
          >
            <Hand className={`w-5 h-5 ${isHandRaised ? 'text-white' : 'text-gray-300'}`} />
          </Button>

          {/* Reactions */}
          <div className="relative">
            <Button
              onClick={() => setShowReactions(!showReactions)}
              className={`rounded-full w-12 h-12 p-0 ${
                showReactions
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Send reaction"
            >
              <Smile className="w-5 h-5 text-white" />
            </Button>
            {showReactions && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-purple-500 rounded-xl p-3 shadow-2xl flex gap-3 z-[100]">
                {['👍', '❤️', '😂', '😮', '👏', '🎉'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={(e) => {
                      e.stopPropagation();
                      sendReaction(emoji);
                    }}
                    className="text-3xl hover:scale-125 transition-transform bg-gray-700 hover:bg-gray-600 rounded-lg p-2 active:scale-95"
                    type="button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          {remoteStreams.size > 0 && (
            <Button
              onClick={toggleViewMode}
              className="rounded-full w-12 h-12 p-0 bg-gray-700 hover:bg-gray-600"
              title={viewMode === 'grid' ? 'Switch to speaker view' : 'Switch to grid view'}
            >
              {viewMode === 'grid' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Grid className="w-5 h-5 text-white" />
              )}
            </Button>
          )}

          {/* Chat */}
          <Button
            onClick={() => setShowChat(!showChat)}
            className={`rounded-full w-12 h-12 p-0 ${
              showChat
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Toggle chat"
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </Button>

          {/* Participants */}
          <Button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`rounded-full w-12 h-12 p-0 ${
              showParticipants
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Show participants"
          >
            <Users className="w-5 h-5 text-white" />
          </Button>

          {/* Settings */}
          <Button
            onClick={() => setShowSettings(!showSettings)}
            className={`rounded-full w-12 h-12 p-0 ${
              showSettings
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Settings"
          >
            <Settings className="w-5 h-5 text-white" />
          </Button>

          {/* Leave Call */}
          <Button
            onClick={leaveMeeting}
            className="rounded-full w-12 h-12 p-0 bg-red-600 hover:bg-red-700 ml-4"
          >
            <PhoneOff className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Meeting Info */}
        <div className="max-w-4xl mx-auto mt-3 text-center">
          <p className="text-gray-400 text-sm">
            Meeting ID: <span className="text-white font-mono">{meetingCode}</span>
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Meeting Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Picture-in-Picture */}
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600">
                <div className="flex items-center gap-3">
                  {isPipMode ? (
                    <Minimize2 className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">Picture-in-Picture</p>
                    <p className="text-gray-400 text-xs">Float your video on top of other windows</p>
                  </div>
                </div>
                <button
                  onClick={togglePictureInPicture}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isPipMode
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {isPipMode ? 'Disable' : 'Enable'}
                </button>
              </div>

              {/* Background Blur */}
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Background Blur</p>
                    <p className="text-gray-400 text-xs">Blur your background (Demo mode)</p>
                  </div>
                </div>
                <button
                  onClick={toggleBackgroundBlur}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isBackgroundBlurred
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {isBackgroundBlurred ? 'On' : 'Off'}
                </button>
              </div>

              {/* Notification Sounds */}
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600">
                <div className="flex items-center gap-3">
                  {notificationSounds ? (
                    <Bell className="w-5 h-5 text-green-400" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">Notification Sounds</p>
                    <p className="text-gray-400 text-xs">Play sounds when people join/leave</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotificationSounds((prev) => !prev)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    notificationSounds
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {notificationSounds ? 'On' : 'Off'}
                </button>
              </div>

              {/* Recording */}
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600">
                <div className="flex items-center gap-3">
                  {isRecording ? (
                    <Square className="w-5 h-5 text-red-500" />
                  ) : (
                    <Radio className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">Record Meeting</p>
                    <p className="text-gray-400 text-xs">
                      {isRecording ? `Recording: ${formatDuration(recordingDuration)}` : 'Save meeting as video file'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isRecording
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {isRecording ? 'Stop' : 'Record'}
                </button>
              </div>

              {/* Connection Quality */}
              <div className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Circle
                    className={`w-4 h-4 ${
                      connectionQuality === 'good'
                        ? 'text-green-500 fill-green-500'
                        : connectionQuality === 'medium'
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-red-500 fill-red-500'
                    }`}
                  />
                  <p className="text-white font-medium">Connection Quality</p>
                </div>
                <p className="text-gray-400 text-sm">
                  Status: <span className="text-white capitalize">{connectionQuality}</span>
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {participants.size} participants • WebRTC P2P
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => setShowSettings(false)}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Close Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg border-l-4 max-w-sm animate-slide-in ${
              toast.type === 'info'
                ? 'bg-gray-800 border-blue-500'
                : toast.type === 'success'
                ? 'bg-gray-800 border-green-500'
                : 'bg-gray-800 border-yellow-500'
            }`}
          >
            <p className="text-white text-sm">{toast.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Remote video card component
interface RemoteVideoCardProps {
  participantId: string;
  stream: MediaStream;
  participant?: Participant;
  isPinned?: boolean;
  onPin?: () => void;
}

function RemoteVideoCard({
  participantId,
  stream,
  participant,
  isPinned,
  onPin
}: RemoteVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((e) => console.error('Remote video play error:', e));
    }
  }, [stream]);

  const displayName = participant?.userName || participantId.substring(0, 12);

  return (
    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden aspect-video border border-gray-700 shadow-lg hover:shadow-xl transition-all group hover:border-purple-500">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Camera off indicator */}
      {participant?.isCameraOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full p-6 shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Name badge */}
      <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md border border-gray-700">
        <span className="text-white text-sm font-semibold">{displayName}</span>
        {participant?.isMuted && (
          <MicOff className="w-3.5 h-3.5 text-red-400" />
        )}
      </div>

      {/* Hand raised indicator */}
      {participant?.isHandRaised && (
        <div className="absolute top-3 left-3 bg-yellow-500 rounded-full p-2 animate-bounce shadow-lg">
          <Hand className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Pin button - visible on hover */}
      {onPin && (
        <button
          onClick={onPin}
          className={`absolute top-3 right-3 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all shadow-lg ${
            isPinned ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 'bg-black bg-opacity-75 backdrop-blur-sm hover:bg-opacity-90'
          }`}
        >
          <Pin className={`w-4 h-4 ${isPinned ? 'text-white' : 'text-gray-300'}`} />
        </button>
      )}
    </div>
  );
}

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

  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

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
    if (!meetingCode || !localStream.current) {
      return;
    }

    console.log('Initializing meeting connection...');

    // Initialize socket if not already connected
    const socket = getSocket();
    if (!socket || !socket.connected) {
      initializeSocket();
    }

    // Get userId from token
    const token = getToken();
    const userId = token ? `user-${Date.now()}` : `guest-${Date.now()}`;

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
      setRemoteStreams((prev) => {
        const newStreams = new Map(prev);
        newStreams.delete(participantId);
        return newStreams;
      });
    };

    // Join the meeting
    try {
      meetingService.joinMeeting(meetingCode, userId);
      console.log('Joined meeting:', meetingCode);
    } catch (error) {
      console.error('Failed to join meeting:', error);
      alert('Failed to join meeting. Please try again.');
    }

    // Cleanup on unmount
    return () => {
      console.log('Leaving meeting...');
      meetingService.leaveMeeting();
    };
  }, [meetingCode, localStream.current]);

  // Listen for chat messages
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

    socket.on('meeting:chat-message', handleChatMessage);

    return () => {
      socket.off('meeting:chat-message', handleChatMessage);
    };
  }, []);

  const toggleMic = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
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

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatInput.trim() || !meetingCode) return;

    const socket = getSocket();
    if (!socket) {
      alert('Not connected to meeting');
      return;
    }

    // Get user name from token or use 'Anonymous'
    const token = getToken();
    let userName = 'Anonymous';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userName = payload.name || 'User';
      } catch (e) {
        console.error('Failed to parse token:', e);
      }
    }

    // Emit chat message
    socket.emit('meeting:chat-message', {
      meetingId: meetingCode,
      message: chatInput.trim(),
      userName,
    });

    // Clear input
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-semibold text-lg">SlimFile Meet</h1>
            <p className="text-gray-400 text-sm">Meeting: {meetingCode}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={copyMeetingLink}
              className="bg-gray-700 border border-gray-600 text-white hover:bg-gray-600"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              onClick={() => setShowParticipants(!showParticipants)}
              className="bg-gray-700 border border-gray-600 text-white hover:bg-gray-600"
            >
              <Users className="w-4 h-4 mr-2" />
              Participants
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        {/* Video Grid */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl w-full">
            {/* Local Video */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="bg-gray-700 rounded-full p-6">
                    <VideoOff className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 px-3 py-1 rounded-full">
                <span className="text-white text-sm">You</span>
              </div>
              {!isMicOn && (
                <div className="absolute top-3 right-3 bg-red-600 rounded-full p-2">
                  <MicOff className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Remote Participants */}
            {Array.from(remoteStreams.entries()).map(([participantId, stream]) => (
              <RemoteVideoCard
                key={participantId}
                participantId={participantId}
                stream={stream}
              />
            ))}

            {/* Placeholder if no remote participants */}
            {remoteStreams.size === 0 && (
              <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center border-2 border-dashed border-gray-600">
                <div className="text-center">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Waiting for others to join...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Participants (1)</h3>
              <button
                onClick={() => setShowParticipants(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded bg-gray-700">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  Y
                </div>
                <span className="text-white">You</span>
                {!isMicOn && <MicOff className="w-4 h-4 text-red-500 ml-auto" />}
              </div>
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
                chatMessages.map((msg, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-400 font-semibold text-sm">
                        {msg.userName}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-white text-sm break-words">{msg.message}</p>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendChatMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Send
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-4">
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

          {/* Chat */}
          <Button
            onClick={() => setShowChat(!showChat)}
            className={`rounded-full w-12 h-12 p-0 ${
              showChat
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </Button>

          {/* Settings */}
          <Button className="rounded-full w-12 h-12 p-0 bg-gray-700 hover:bg-gray-600">
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
    </div>
  );
}

// Remote video card component
interface RemoteVideoCardProps {
  participantId: string;
  stream: MediaStream;
}

function RemoteVideoCard({ participantId, stream }: RemoteVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((e) => console.error('Remote video play error:', e));
    }
  }, [stream]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 px-3 py-1 rounded-full">
        <span className="text-white text-sm">{participantId.substring(0, 8)}</span>
      </div>
    </div>
  );
}

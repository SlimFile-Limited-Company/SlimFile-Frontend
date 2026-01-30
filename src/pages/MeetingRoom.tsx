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
import { isAuthenticated } from '@/lib/auth';

export default function MeetingRoom() {
  const { meetingCode } = useParams<{ meetingCode: string }>();
  const navigate = useNavigate();

  // Media states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);

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
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStream.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Unable to access camera/microphone. Please check permissions.');
      }
    };

    initializeMedia();

    // Cleanup function
    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
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
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              onClick={() => setShowParticipants(!showParticipants)}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
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

            {/* Placeholder for remote participants */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center border-2 border-dashed border-gray-600">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Waiting for others to join...</p>
              </div>
            </div>
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
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mb-4">
              <p className="text-gray-500 text-sm text-center py-8">
                No messages yet. Start the conversation!
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <Button className="bg-purple-600 hover:bg-purple-700">Send</Button>
            </div>
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

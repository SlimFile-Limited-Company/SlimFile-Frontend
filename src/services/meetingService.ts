/**
 * Meeting Service for SlimFile Meet
 * Handles WebRTC connections, signaling, and media management
 */

import { getSocket } from './socketService';

// Free STUN servers for NAT traversal
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun.services.mozilla.com' },
];

export interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isCameraOff: boolean;
}

export interface MeetingState {
  participants: Map<string, Participant>;
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
}

class MeetingService {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private remoteStreams: Map<string, MediaStream> = new Map();
  private currentMeetingId: string | null = null;

  /**
   * Initialize local media (camera and microphone)
   */
  async getLocalStream(constraints?: MediaStreamConstraints): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        constraints || {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        }
      );

      this.localStream = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw new Error('Failed to access camera/microphone. Please check permissions.');
    }
  }

  /**
   * Get screen sharing stream
   */
  async getScreenStream(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
        },
        audio: false,
      });

      return stream;
    } catch (error) {
      console.error('Error accessing screen share:', error);
      throw new Error('Failed to start screen sharing.');
    }
  }

  /**
   * Join a meeting room
   */
  joinMeeting(meetingId: string, userId: string, userName?: string) {
    this.currentMeetingId = meetingId;
    const socket = getSocket();

    if (!socket) {
      throw new Error('Socket connection not available');
    }

    // Emit join meeting event
    socket.emit('meeting:join', { meetingId, userId, userName });

    // Listen for other participants
    socket.on('meeting:user-joined', this.handleUserJoined.bind(this));
    socket.on('meeting:existing-participants', this.handleExistingParticipants.bind(this));
    socket.on('meeting:user-left', this.handleUserLeft.bind(this));
    socket.on('meeting:offer', this.handleOffer.bind(this));
    socket.on('meeting:answer', this.handleAnswer.bind(this));
    socket.on('meeting:ice-candidate', this.handleIceCandidate.bind(this));
    socket.on('meeting:error', this.handleError.bind(this));
  }

  /**
   * Leave the current meeting
   */
  leaveMeeting() {
    const socket = getSocket();

    if (socket && this.currentMeetingId) {
      socket.emit('meeting:leave', { meetingId: this.currentMeetingId });
    }

    // Close all peer connections
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    // Clear remote streams
    this.remoteStreams.clear();
    this.currentMeetingId = null;

    // Remove socket listeners
    if (socket) {
      socket.off('meeting:user-joined');
      socket.off('meeting:existing-participants');
      socket.off('meeting:user-left');
      socket.off('meeting:offer');
      socket.off('meeting:answer');
      socket.off('meeting:ice-candidate');
      socket.off('meeting:error');
    }
  }

  /**
   * Create peer connection for a participant
   */
  private createPeerConnection(participantId: string): RTCPeerConnection {
    const peerConnection = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
    });

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      console.log('Received remote track from', participantId);
      const [remoteStream] = event.streams;
      this.remoteStreams.set(participantId, remoteStream);

      // Notify listeners about new stream
      this.onRemoteStreamAdded?.(participantId, remoteStream);
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const socket = getSocket();
        socket?.emit('meeting:ice-candidate', {
          meetingId: this.currentMeetingId,
          targetUserId: participantId,
          candidate: event.candidate,
        });
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(
        `Connection state with ${participantId}:`,
        peerConnection.connectionState
      );

      if (peerConnection.connectionState === 'failed') {
        console.error('Connection failed with', participantId);
      }
    };

    this.peerConnections.set(participantId, peerConnection);
    return peerConnection;
  }

  /**
   * Handle existing participants when joining a meeting
   */
  private async handleExistingParticipants({
    participants,
  }: {
    participants: Array<{ userId: string; userName?: string; socketId: string }>;
  }) {
    console.log('Existing participants:', participants);

    // Notify about participants (so UI can add them to participant list)
    participants.forEach(participant => {
      this.onParticipantMetadata?.(participant.userId, participant.userName || 'User');
    });

    // Create peer connections and send offers to all existing participants
    for (const participant of participants) {
      const peerConnection = this.createPeerConnection(participant.userId);

      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        const socket = getSocket();
        socket?.emit('meeting:offer', {
          meetingId: this.currentMeetingId,
          targetUserId: participant.userId,
          offer,
        });
      } catch (error) {
        console.error('Error creating offer for existing participant:', error);
      }
    }
  }

  /**
   * Handle new user joining the meeting
   * Note: We don't create offers here because the new user will create offers
   * to all existing participants via handleExistingParticipants.
   * We'll create the peer connection when we receive their offer in handleOffer.
   */
  private handleUserJoined({ userId }: { userId: string }) {
    console.log('User joined:', userId, '- waiting for their offer (no action needed)');
    // No action needed - the new user will send us an offer
    // and handleOffer will create the peer connection
  }

  /**
   * Handle user leaving the meeting
   */
  private handleUserLeft({ userId }: { userId: string }) {
    console.log('User left:', userId);

    // Close and remove peer connection
    const peerConnection = this.peerConnections.get(userId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(userId);
    }

    // Remove remote stream
    this.remoteStreams.delete(userId);

    // Notify listeners
    this.onParticipantLeft?.(userId);
  }

  /**
   * Handle incoming offer
   */
  private async handleOffer({
    fromUserId,
    offer,
  }: {
    fromUserId: string;
    offer: RTCSessionDescriptionInit;
  }) {
    console.log('Received offer from:', fromUserId);

    // Create peer connection if doesn't exist
    let peerConnection = this.peerConnections.get(fromUserId);
    if (!peerConnection) {
      peerConnection = this.createPeerConnection(fromUserId);
    }

    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      // Create and send answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      const socket = getSocket();
      socket?.emit('meeting:answer', {
        meetingId: this.currentMeetingId,
        targetUserId: fromUserId,
        answer,
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  /**
   * Handle incoming answer
   */
  private async handleAnswer({
    fromUserId,
    answer,
  }: {
    fromUserId: string;
    answer: RTCSessionDescriptionInit;
  }) {
    console.log('Received answer from:', fromUserId);

    const peerConnection = this.peerConnections.get(fromUserId);
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  }

  /**
   * Handle incoming ICE candidate
   */
  private async handleIceCandidate({
    fromUserId,
    candidate,
  }: {
    fromUserId: string;
    candidate: RTCIceCandidateInit;
  }) {
    const peerConnection = this.peerConnections.get(fromUserId);
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }

  /**
   * Handle meeting errors from server
   */
  private handleError({ message }: { message: string }) {
    console.error('Meeting error:', message);
    this.onError?.(message);
  }

  /**
   * Toggle microphone
   */
  toggleMicrophone(enabled: boolean) {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = enabled;
      }
    }
  }

  /**
   * Toggle camera
   */
  toggleCamera(enabled: boolean) {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = enabled;
      }
    }
  }

  /**
   * Replace camera with screen share
   */
  async startScreenShare(): Promise<MediaStream> {
    const screenStream = await this.getScreenStream();

    const videoTrack = screenStream.getVideoTracks()[0];

    // Replace track in all peer connections
    this.peerConnections.forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
      if (sender) {
        sender.replaceTrack(videoTrack);
      }
    });

    // Handle when user stops sharing via browser UI
    videoTrack.onended = () => {
      this.stopScreenShare();
    };

    return screenStream;
  }

  /**
   * Stop screen share and revert to camera
   */
  async stopScreenShare() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];

      // Replace track back to camera in all peer connections
      this.peerConnections.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });
    }
  }

  /**
   * Set local stream (when obtained externally)
   */
  setLocalStream(stream: MediaStream) {
    this.localStream = stream;
  }

  /**
   * Get local stream
   */
  getLocalStreamRef(): MediaStream | null {
    return this.localStream;
  }

  /**
   * Get remote stream for a participant
   */
  getRemoteStream(participantId: string): MediaStream | null {
    return this.remoteStreams.get(participantId) || null;
  }

  /**
   * Callbacks for UI updates
   */
  onRemoteStreamAdded?: (participantId: string, stream: MediaStream) => void;
  onParticipantLeft?: (participantId: string) => void;
  onParticipantMetadata?: (participantId: string, userName: string) => void;
  onError?: (message: string) => void;
}

// Export singleton instance
export const meetingService = new MeetingService();

/**
 * Meeting Service for SlimFile Meet
 * Handles WebRTC connections, signaling, and media management
 */

import { getSocket } from './socketService';

// ICE servers for NAT traversal
// STUN servers help discover public IP, TURN servers relay traffic when direct connection fails
const ICE_SERVERS: RTCIceServer[] = [
  // Google STUN servers (primary)
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },

  // OpenRelay - Free TURN (try first, most reliable)
  {
    urls: [
      'turn:openrelay.metered.ca:80',
      'turn:openrelay.metered.ca:443',
      'turn:openrelay.metered.ca:443?transport=tcp'
    ],
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },

  // Numb Viagenie - Free TURN with explicit ports
  {
    urls: [
      'turn:numb.viagenie.ca:3478',
      'turn:numb.viagenie.ca:3478?transport=tcp'
    ],
    username: 'webrtc@live.com',
    credential: 'muazkh',
  },

  // Metered TURN (free tier - 50GB/month)
  {
    urls: [
      'turn:a.relay.metered.ca:80',
      'turn:a.relay.metered.ca:80?transport=tcp',
      'turn:a.relay.metered.ca:443',
      'turn:a.relay.metered.ca:443?transport=tcp'
    ],
    username: 'e88a3b4bbef7dbb950e296a1',
    credential: 'D+6OPaAYKiZoI2XO',
  },

  // Additional backup STUN
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stunserver.stunprotocol.org:3478' },
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
  private iceRestartInProgress: Map<string, boolean> = new Map();

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

    // Set up listeners BEFORE emitting join to ensure we don't miss any responses
    socket.on('meeting:user-joined', this.handleUserJoined.bind(this));
    socket.on('meeting:existing-participants', this.handleExistingParticipants.bind(this));
    socket.on('meeting:user-left', this.handleUserLeft.bind(this));
    socket.on('meeting:offer', this.handleOffer.bind(this));
    socket.on('meeting:answer', this.handleAnswer.bind(this));
    socket.on('meeting:ice-candidate', this.handleIceCandidate.bind(this));
    socket.on('meeting:error', this.handleError.bind(this));

    // Wait for socket to be connected before emitting
    const emitJoin = () => {
      console.log(`📡 Emitting meeting:join for meeting ${meetingId} as ${userName} (${userId})`);
      socket.emit('meeting:join', { meetingId, userId, userName });
    };

    if (socket.connected) {
      emitJoin();
    } else {
      console.log('⏳ Waiting for socket connection before joining meeting...');
      socket.once('connect', () => {
        console.log('✅ Socket connected, now joining meeting');
        emitJoin();
      });
    }
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
    console.log(`🔗 Creating peer connection for ${participantId}`);

    const peerConnection = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      iceCandidatePoolSize: 10, // Pre-gather ICE candidates for faster connection
      bundlePolicy: 'max-bundle', // Bundle all media on one connection
      rtcpMuxPolicy: 'require', // Multiplex RTP and RTCP on same port
    });

    // Add local stream tracks
    if (this.localStream) {
      const tracks = this.localStream.getTracks();
      console.log(`📹 Adding ${tracks.length} local tracks to peer connection:`, tracks.map(t => `${t.kind} (enabled: ${t.enabled})`));

      tracks.forEach((track) => {
        const sender = peerConnection.addTrack(track, this.localStream!);
        console.log(`  ✅ Added ${track.kind} track:`, track.label);
      });
    } else {
      console.warn(`⚠️  No local stream available when creating peer connection for ${participantId}`);
    }

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      console.log(`📥 Received remote ${event.track.kind} track from ${participantId}`);
      console.log(`   Track info: label="${event.track.label}", enabled=${event.track.enabled}, readyState=${event.track.readyState}`);
      console.log(`   Streams received:`, event.streams.length);

      let remoteStream = event.streams[0];

      // If no stream provided, create one and add the track
      if (!remoteStream) {
        console.log(`   ⚠️ No stream in event, creating new MediaStream for track`);
        remoteStream = this.remoteStreams.get(participantId) || new MediaStream();
        remoteStream.addTrack(event.track);
      }

      console.log(`   Remote stream tracks:`, remoteStream.getTracks().map(t => `${t.kind} (${t.label}, enabled: ${t.enabled})`));

      // Store the stream
      this.remoteStreams.set(participantId, remoteStream);

      // Notify listeners about new/updated stream
      this.onRemoteStreamAdded?.(participantId, remoteStream);

      // Also listen for track ending
      event.track.onended = () => {
        console.log(`   ⚠️ Track ${event.track.kind} from ${participantId} ended`);
      };

      event.track.onmute = () => {
        console.log(`   🔇 Track ${event.track.kind} from ${participantId} muted`);
      };

      event.track.onunmute = () => {
        console.log(`   🔊 Track ${event.track.kind} from ${participantId} unmuted`);
        // Re-notify when track unmutes to ensure video displays
        this.onRemoteStreamAdded?.(participantId, remoteStream);
      };
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Log candidate type for debugging
        const candidateType = event.candidate.candidate.includes('typ relay') ? 'relay (TURN)' :
                              event.candidate.candidate.includes('typ srflx') ? 'srflx (STUN)' :
                              event.candidate.candidate.includes('typ host') ? 'host (local)' : 'unknown';
        console.log(`🧊 ICE candidate for ${participantId}: ${candidateType}`);

        const socket = getSocket();
        socket?.emit('meeting:ice-candidate', {
          meetingId: this.currentMeetingId,
          targetUserId: participantId,
          candidate: event.candidate,
        });
      } else {
        console.log(`🧊 ICE candidate gathering complete for ${participantId}`);
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(
        `🔌 Connection state with ${participantId}: ${peerConnection.connectionState}`
      );

      if (peerConnection.connectionState === 'connected') {
        console.log(`✅ Successfully connected to ${participantId}`);
      } else if (peerConnection.connectionState === 'failed') {
        console.error(`❌ Connection failed with ${participantId}`);
        // Attempt ICE restart
        this.attemptIceRestart(participantId);
      }
    };

    // Handle ICE connection state changes
    peerConnection.oniceconnectionstatechange = () => {
      console.log(
        `🧊 ICE connection state with ${participantId}: ${peerConnection.iceConnectionState}`
      );

      if (peerConnection.iceConnectionState === 'connected') {
        console.log(`✅ ICE connected to ${participantId}`);
      } else if (peerConnection.iceConnectionState === 'failed') {
        console.error(`❌ ICE connection failed with ${participantId}`);
        // Attempt ICE restart
        this.attemptIceRestart(participantId);
      } else if (peerConnection.iceConnectionState === 'disconnected') {
        console.warn(`⚠️ ICE disconnected from ${participantId}, waiting for recovery...`);
        // Give it a few seconds to recover before attempting restart
        setTimeout(() => {
          if (peerConnection.iceConnectionState === 'disconnected' ||
              peerConnection.iceConnectionState === 'failed') {
            this.attemptIceRestart(participantId);
          }
        }, 5000);
      }
    };

    // Handle ICE gathering state
    peerConnection.onicegatheringstatechange = () => {
      console.log(
        `🧊 ICE gathering state with ${participantId}: ${peerConnection.iceGatheringState}`
      );
    };

    this.peerConnections.set(participantId, peerConnection);
    console.log(`✅ Peer connection created and stored for ${participantId}`);
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
    console.log(`👥 Found ${participants.length} existing participants:`, participants.map(p => p.userName || p.userId));

    if (!this.localStream) {
      console.error('❌ Cannot create peer connections - local stream not set!');
      return;
    }

    console.log('✅ Local stream is available with tracks:', this.localStream.getTracks().map(t => `${t.kind} (enabled: ${t.enabled})`));

    // Notify about participants (so UI can add them to participant list)
    participants.forEach(participant => {
      this.onParticipantMetadata?.(participant.userId, participant.userName || 'User');
    });

    // Create peer connections and send offers to all existing participants
    for (const participant of participants) {
      console.log(`📤 Creating offer for ${participant.userName || participant.userId}`);
      const peerConnection = this.createPeerConnection(participant.userId);

      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        console.log(`   ✅ Offer created, sending to server...`);

        const socket = getSocket();
        socket?.emit('meeting:offer', {
          meetingId: this.currentMeetingId,
          targetUserId: participant.userId,
          offer,
        });

        console.log(`   ✅ Offer sent to ${participant.userName || participant.userId}`);
      } catch (error) {
        console.error(`   ❌ Error creating offer for ${participant.userName}:`, error);
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
    console.log(`📥 Received offer from: ${fromUserId}`);

    if (!this.localStream) {
      console.error(`❌ Cannot handle offer - local stream not set!`);
      return;
    }

    // Create peer connection if doesn't exist
    let peerConnection = this.peerConnections.get(fromUserId);
    if (!peerConnection) {
      console.log(`   Creating new peer connection for ${fromUserId}`);
      peerConnection = this.createPeerConnection(fromUserId);
    }

    try {
      console.log(`   Setting remote description...`);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      // Create and send answer
      console.log(`   Creating answer...`);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      console.log(`   Sending answer to ${fromUserId}`);
      const socket = getSocket();
      socket?.emit('meeting:answer', {
        meetingId: this.currentMeetingId,
        targetUserId: fromUserId,
        answer,
      });

      console.log(`   ✅ Answer sent successfully`);
    } catch (error) {
      console.error(`   ❌ Error handling offer from ${fromUserId}:`, error);
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
    console.log(`📥 Received answer from: ${fromUserId}`);

    const peerConnection = this.peerConnections.get(fromUserId);
    if (peerConnection) {
      try {
        // Check signaling state to avoid setting answer in wrong state
        const signalingState = peerConnection.signalingState;
        console.log(`   Current signaling state: ${signalingState}`);

        if (signalingState === 'stable') {
          console.warn(`   ⚠️ Ignoring answer - already in stable state (likely offer collision)`);
          return;
        }

        if (signalingState !== 'have-local-offer') {
          console.warn(`   ⚠️ Unexpected signaling state: ${signalingState}`);
        }

        console.log(`   Setting remote description...`);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log(`   ✅ Answer processed successfully`);
        console.log(`   Connection state: ${peerConnection.connectionState}`);
        console.log(`   ICE connection state: ${peerConnection.iceConnectionState}`);
      } catch (error) {
        console.error(`   ❌ Error handling answer from ${fromUserId}:`, error);
      }
    } else {
      console.error(`   ❌ No peer connection found for ${fromUserId}`);
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
   * Attempt ICE restart when connection fails
   */
  private async attemptIceRestart(participantId: string) {
    // Prevent multiple simultaneous ICE restarts
    if (this.iceRestartInProgress.get(participantId)) {
      console.log(`⏭️ ICE restart already in progress for ${participantId}, skipping...`);
      return;
    }

    const peerConnection = this.peerConnections.get(participantId);
    if (!peerConnection) {
      console.error(`❌ Cannot restart ICE - no peer connection for ${participantId}`);
      return;
    }

    // Check signaling state - don't restart if we're already negotiating
    if (peerConnection.signalingState !== 'stable') {
      console.log(`⏭️ Skipping ICE restart - signaling state is ${peerConnection.signalingState}`);
      return;
    }

    console.log(`🔄 Attempting ICE restart for ${participantId}...`);
    this.iceRestartInProgress.set(participantId, true);

    try {
      // Create a new offer with ICE restart flag
      const offer = await peerConnection.createOffer({ iceRestart: true });
      await peerConnection.setLocalDescription(offer);

      // Send the new offer to the remote peer
      const socket = getSocket();
      socket?.emit('meeting:offer', {
        meetingId: this.currentMeetingId,
        targetUserId: participantId,
        offer,
      });

      console.log(`✅ ICE restart offer sent to ${participantId}`);

      // Clear the flag after a delay
      setTimeout(() => {
        this.iceRestartInProgress.set(participantId, false);
      }, 3000);
    } catch (error) {
      console.error(`❌ ICE restart failed for ${participantId}:`, error);
      this.iceRestartInProgress.set(participantId, false);
      this.onError?.(`Connection to ${participantId} failed. Please try rejoining the meeting.`);
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

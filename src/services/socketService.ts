import { io, Socket } from 'socket.io-client';
import type { Message } from './workspaceService';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://slimfile-fb.onrender.com';

// Event types
export interface TypingEvent {
  userId: string;
  isTyping: boolean;
}

export interface MemberJoinedEvent {
  workspaceId: string;
  user: {
    _id: string;
    name: string;
    picture?: string;
  };
  role: string;
}

export interface MemberRemovedEvent {
  workspaceId: string;
  memberId: string;
  userId: string;
}

export interface NewInvitationEvent {
  workspaceId: string;
  workspaceName: string;
  role: string;
  token: string;
  inviterName: string;
}

export interface MessageDeletedEvent {
  messageId: string;
}

// Singleton socket instance
let socket: Socket | null = null;
let isAuthenticated = false;

// Event listeners storage
type EventCallback = (...args: any[]) => void;
const eventListeners: Map<string, Set<EventCallback>> = new Map();

/**
 * Initialize socket connection
 */
export function initializeSocket(): Socket {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  // Connection events
  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
    // Re-authenticate on reconnect
    const token = localStorage.getItem('jwt');
    if (token && !isAuthenticated) {
      authenticateSocket(token);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    isAuthenticated = false;
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  // Auth events
  socket.on('authenticated', (data) => {
    console.log('Socket authenticated:', data);
    isAuthenticated = true;
  });

  socket.on('authError', (error) => {
    console.error('Socket auth error:', error);
    isAuthenticated = false;
  });

  return socket;
}

/**
 * Authenticate socket with JWT token
 */
export function authenticateSocket(token: string): void {
  if (!socket) {
    initializeSocket();
  }
  socket?.emit('authenticate', token);
}

/**
 * Disconnect socket
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    isAuthenticated = false;
  }
}

/**
 * Get socket instance
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Check if socket is connected and authenticated
 */
export function isSocketReady(): boolean {
  return socket?.connected && isAuthenticated;
}

// ============================================
// WORKSPACE ROOM MANAGEMENT
// ============================================

/**
 * Join a workspace room for real-time updates
 */
export function joinWorkspace(workspaceId: string): void {
  if (socket?.connected) {
    socket.emit('joinWorkspace', workspaceId);
  }
}

/**
 * Leave a workspace room
 */
export function leaveWorkspace(workspaceId: string): void {
  if (socket?.connected) {
    socket.emit('leaveWorkspace', workspaceId);
  }
}

// ============================================
// CHAT EVENTS
// ============================================

/**
 * Send typing indicator
 */
export function sendTypingIndicator(workspaceId: string, isTyping: boolean): void {
  if (socket?.connected) {
    socket.emit('typing', { workspaceId, isTyping });
  }
}

/**
 * Subscribe to new messages
 */
export function onNewMessage(callback: (message: Message) => void): () => void {
  socket?.on('newMessage', callback);

  return () => {
    socket?.off('newMessage', callback);
  };
}

/**
 * Play received message sound (exported for conditional use)
 */
export function playReceiveSound(): void {
  playMessageSound();
}

/**
 * Subscribe to message deletions
 */
export function onMessageDeleted(callback: (event: MessageDeletedEvent) => void): () => void {
  socket?.on('messageDeleted', callback);
  return () => {
    socket?.off('messageDeleted', callback);
  };
}

/**
 * Subscribe to typing indicators
 */
export function onUserTyping(callback: (event: TypingEvent) => void): () => void {
  socket?.on('userTyping', callback);
  return () => {
    socket?.off('userTyping', callback);
  };
}

// ============================================
// MEMBER EVENTS
// ============================================

/**
 * Subscribe to member joined events
 */
export function onMemberJoined(callback: (event: MemberJoinedEvent) => void): () => void {
  socket?.on('memberJoined', callback);
  return () => {
    socket?.off('memberJoined', callback);
  };
}

/**
 * Subscribe to member removed events
 */
export function onMemberRemoved(callback: (event: MemberRemovedEvent) => void): () => void {
  socket?.on('memberRemoved', callback);
  return () => {
    socket?.off('memberRemoved', callback);
  };
}

// ============================================
// INVITATION EVENTS
// ============================================

/**
 * Subscribe to new invitation events
 */
export function onNewInvitation(callback: (event: NewInvitationEvent) => void): () => void {
  const handler = (event: NewInvitationEvent) => {
    callback(event);
    // Show browser notification
    showInvitationNotification(event);
    // Play notification sound
    playNotificationSound();
  };

  socket?.on('newInvitation', handler);
  return () => {
    socket?.off('newInvitation', handler);
  };
}

// ============================================
// NOTIFICATION HELPERS
// ============================================

/**
 * Play message notification sound (received)
 */
function playMessageSound(): void {
  try {
    // Use Web Audio API for a simple pop sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch {
    // Audio not supported
  }
}

/**
 * Play send message sound
 */
export function playSendSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Slightly higher pitch for sent messages
    oscillator.frequency.value = 600;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch {
    // Audio not supported
  }
}

/**
 * Play notification sound
 */
function playNotificationSound(): void {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Ignore if audio play fails
    });
  } catch {
    // Audio not supported
  }
}

/**
 * Show browser notification for invitation
 */
function showInvitationNotification(event: NewInvitationEvent): void {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Workspace Invitation', {
      body: `${event.inviterName} invited you to join "${event.workspaceName}" as ${event.role}`,
      icon: '/logo.gif',
      tag: `invitation-${event.workspaceId}`,
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = '/workspaces/invitations';
      notification.close();
    };
  }
}

/**
 * Show browser notification for new message
 */
export function showMessageNotification(
  senderName: string,
  messageText: string,
  workspaceId: string
): void {
  if (Notification.permission === 'granted' && document.hidden) {
    const truncatedText = messageText.length > 50
      ? messageText.substring(0, 50) + '...'
      : messageText;

    const notification = new Notification(senderName, {
      body: truncatedText,
      icon: '/logo.gif',
      tag: `message-${workspaceId}`,
      silent: true // We play our own sound
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = `/workspaces/${workspaceId}`;
      notification.close();
    };

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }
}

// ============================================
// INITIALIZATION HOOK
// ============================================

/**
 * React hook to initialize socket on app load
 */
export function useSocketInit(): void {
  const token = localStorage.getItem('jwt');

  if (token && !socket) {
    initializeSocket();
    authenticateSocket(token);
  }
}

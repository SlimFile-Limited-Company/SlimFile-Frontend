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

export interface MessageDeliveredEvent {
  messageId: string;
  userId: string;
  deliveredToCount: number;
}

export interface MessageReadEvent {
  messageId: string;
  userId: string;
  readByCount: number;
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

/**
 * Subscribe to message delivered events
 */
export function onMessageDelivered(callback: (event: MessageDeliveredEvent) => void): () => void {
  socket?.on('messageDelivered', callback);
  return () => {
    socket?.off('messageDelivered', callback);
  };
}

/**
 * Subscribe to message read events
 */
export function onMessageRead(callback: (event: MessageReadEvent) => void): () => void {
  socket?.on('messageRead', callback);
  return () => {
    socket?.off('messageRead', callback);
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

// Track current workspace to avoid notifications for messages in active workspace
let currentActiveWorkspaceId: string | null = null;

/**
 * Set the currently active workspace (to avoid self-notifications)
 */
export function setActiveWorkspace(workspaceId: string | null): void {
  currentActiveWorkspaceId = workspaceId;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Check if notifications are enabled
 */
export function areNotificationsEnabled(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Vibrate device if supported (for mobile)
 */
function vibrateDevice(pattern: number | number[] = 200): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

/**
 * Play message notification sound (received) - WhatsApp style double beep
 */
function playMessageSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // First beep
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    osc1.frequency.value = 880;
    osc1.type = 'sine';
    gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    osc1.start(audioContext.currentTime);
    osc1.stop(audioContext.currentTime + 0.1);

    // Second beep (slightly delayed)
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    osc2.frequency.value = 988;
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
    osc2.start(audioContext.currentTime + 0.15);
    osc2.stop(audioContext.currentTime + 0.25);
  } catch {
    // Audio not supported
  }
}

/**
 * Play send message sound - subtle swoosh
 */
export function playSendSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch {
    // Audio not supported
  }
}

/**
 * Play notification sound for invitations
 */
function playNotificationSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Play a pleasant notification chime
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const startTime = audioContext.currentTime + (i * 0.1);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
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
    vibrateDevice([200, 100, 200]);

    const notification = new Notification('Workspace Invitation', {
      body: `${event.inviterName} invited you to join "${event.workspaceName}" as ${event.role}`,
      icon: '/logo.gif',
      badge: '/logo.gif',
      tag: `invitation-${event.workspaceId}`,
      requireInteraction: true,
      silent: false
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = '/workspaces/invitations';
      notification.close();
    };
  }
}

/**
 * Show browser notification for new message - WhatsApp style (always shows)
 */
export function showMessageNotification(
  senderName: string,
  messageText: string,
  workspaceId: string,
  workspaceName?: string
): void {
  // Skip if user is currently viewing this workspace and page is visible
  if (currentActiveWorkspaceId === workspaceId && !document.hidden) {
    return;
  }

  // Vibrate for incoming messages (mobile)
  vibrateDevice(200);

  // Show browser notification
  if (Notification.permission === 'granted') {
    const truncatedText = messageText.length > 100
      ? messageText.substring(0, 100) + '...'
      : messageText;

    const title = workspaceName ? `${senderName} • ${workspaceName}` : senderName;

    const notification = new Notification(title, {
      body: truncatedText,
      icon: '/logo.gif',
      badge: '/logo.gif',
      tag: `message-${workspaceId}-${Date.now()}`, // Unique tag for each message
      renotify: true, // Show each notification even with same tag
      silent: true, // We play our own sound
      requireInteraction: false
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = `/workspaces/${workspaceId}`;
      notification.close();
    };

    // Auto-close after 4 seconds
    setTimeout(() => notification.close(), 4000);
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

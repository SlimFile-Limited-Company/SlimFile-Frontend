import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import io, { Socket } from 'socket.io-client';

// User info
export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  cursor?: { page: number; x: number; y: number };
  currentPage: number;
  isTyping?: boolean;
  lastActivity: number;
}

// Comment structure
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  pageNumber: number;
  x: number;
  y: number;
  text: string;
  timestamp: number;
  replies: CommentReply[];
  resolved: boolean;
}

export interface CommentReply {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

// Chat message
export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  text: string;
  timestamp: number;
}

// Activity log
export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  action: string;
  description: string;
  timestamp: number;
}

// Session info
export interface CollaborationSession {
  id: string;
  name: string;
  createdBy: string;
  createdAt: number;
  isPublic: boolean;
  password?: string;
}

// Context state
export interface CollaborationContextState {
  // Session
  session: CollaborationSession | null;
  isConnected: boolean;

  // Users & Presence
  currentUser: CollaborationUser | null;
  onlineUsers: CollaborationUser[];

  // Y.js document
  ydoc: Y.Doc | null;
  provider: WebrtcProvider | null;

  // Socket.io
  socket: Socket | null;

  // Comments
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'timestamp' | 'replies' | 'resolved'>) => void;
  addReply: (commentId: string, text: string) => void;
  resolveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;

  // Activity
  activities: Activity[];
  addActivity: (action: string, description: string) => void;

  // Session management
  createSession: (name: string, isPublic: boolean, password?: string) => Promise<string>;
  joinSession: (sessionId: string, password?: string) => Promise<void>;
  leaveSession: () => void;

  // Presence
  updateCursor: (page: number, x: number, y: number) => void;
  updateCurrentPage: (page: number) => void;
}

const CollaborationContext = createContext<CollaborationContextState | null>(null);

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return context;
};

interface CollaborationProviderProps {
  children: ReactNode;
}

// Generate random color for users
const generateUserColor = () => {
  const colors = [
    '#ef4444', // red
    '#f59e0b', // orange
    '#10b981', // green
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const CollaborationProvider = ({ children }: CollaborationProviderProps) => {
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<CollaborationUser | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<CollaborationUser[]>([]);
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebrtcProvider | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Initialize current user
  useEffect(() => {
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const userName = `User ${Math.floor(Math.random() * 1000)}`;
    const userColor = generateUserColor();

    setCurrentUser({
      id: userId,
      name: userName,
      color: userColor,
      currentPage: 1,
      lastActivity: Date.now(),
    });
  }, []);

  // Create collaboration session
  const createSession = useCallback(async (name: string, isPublic: boolean, password?: string): Promise<string> => {
    try {
      const sessionId = `session-${Date.now()}`;

      const newSession: CollaborationSession = {
        id: sessionId,
        name,
        createdBy: currentUser?.id || '',
        createdAt: Date.now(),
        isPublic,
        password,
      };

      // Initialize Y.js document
      const doc = new Y.Doc();
      const webrtcProvider = new WebrtcProvider(sessionId, doc, {
        signaling: ['wss://signaling.yjs.dev'],
      });

      setYdoc(doc);
      setProvider(webrtcProvider);
      setSession(newSession);
      setIsConnected(true);

      // Initialize Socket.io connection
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        query: { sessionId, userId: currentUser?.id },
      });

      newSocket.on('connect', () => {
        console.log('Socket.io connected');
        if (currentUser) {
          newSocket.emit('join-session', {
            sessionId,
            user: currentUser,
          });
        }
      });

      newSocket.on('user-joined', (user: CollaborationUser) => {
        setOnlineUsers((prev) => [...prev, user]);
        addActivity('user-joined', `${user.name} joined the session`);
      });

      newSocket.on('user-left', (userId: string) => {
        setOnlineUsers((prev) => {
          const user = prev.find(u => u.id === userId);
          if (user) {
            addActivity('user-left', `${user.name} left the session`);
          }
          return prev.filter((u) => u.id !== userId);
        });
      });

      newSocket.on('cursor-update', (data: { userId: string; cursor: { page: number; x: number; y: number } }) => {
        setOnlineUsers((prev) =>
          prev.map((u) => (u.id === data.userId ? { ...u, cursor: data.cursor } : u))
        );
      });

      newSocket.on('page-change', (data: { userId: string; page: number }) => {
        setOnlineUsers((prev) =>
          prev.map((u) => (u.id === data.userId ? { ...u, currentPage: data.page } : u))
        );
      });

      newSocket.on('chat-message', (message: ChatMessage) => {
        setChatMessages((prev) => [...prev, message]);
      });

      newSocket.on('comment-added', (comment: Comment) => {
        setComments((prev) => [...prev, comment]);
      });

      setSocket(newSocket);

      console.log('Collaboration session created:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }, [currentUser]);

  // Join existing session
  const joinSession = useCallback(async (sessionId: string, password?: string): Promise<void> => {
    try {
      // TODO: Validate password if session is protected

      // Initialize Y.js document
      const doc = new Y.Doc();
      const webrtcProvider = new WebrtcProvider(sessionId, doc, {
        signaling: ['wss://signaling.yjs.dev'],
      });

      setYdoc(doc);
      setProvider(webrtcProvider);
      setIsConnected(true);

      // Initialize Socket.io connection (same as createSession)
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        query: { sessionId, userId: currentUser?.id },
      });

      newSocket.on('connect', () => {
        console.log('Socket.io connected');
        if (currentUser) {
          newSocket.emit('join-session', {
            sessionId,
            user: currentUser,
          });
        }
      });

      // Same event handlers as createSession
      newSocket.on('user-joined', (user: CollaborationUser) => {
        setOnlineUsers((prev) => [...prev, user]);
        addActivity('user-joined', `${user.name} joined the session`);
      });

      newSocket.on('user-left', (userId: string) => {
        setOnlineUsers((prev) => {
          const user = prev.find(u => u.id === userId);
          if (user) {
            addActivity('user-left', `${user.name} left the session`);
          }
          return prev.filter((u) => u.id !== userId);
        });
      });

      setSocket(newSocket);

      console.log('Joined collaboration session:', sessionId);
    } catch (error) {
      console.error('Error joining session:', error);
      throw error;
    }
  }, [currentUser]);

  // Leave session
  const leaveSession = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    if (provider) {
      provider.destroy();
      setProvider(null);
    }

    if (ydoc) {
      ydoc.destroy();
      setYdoc(null);
    }

    setSession(null);
    setIsConnected(false);
    setOnlineUsers([]);
    setComments([]);
    setChatMessages([]);
    setActivities([]);

    console.log('Left collaboration session');
  }, [socket, provider, ydoc]);

  // Update cursor position
  const updateCursor = useCallback((page: number, x: number, y: number) => {
    if (socket && currentUser) {
      socket.emit('cursor-update', {
        cursor: { page, x, y },
      });
    }
  }, [socket, currentUser]);

  // Update current page
  const updateCurrentPage = useCallback((page: number) => {
    if (socket && currentUser) {
      socket.emit('page-change', { page });
      setCurrentUser((prev) => prev ? { ...prev, currentPage: page } : null);
    }
  }, [socket, currentUser]);

  // Add comment
  const addComment = useCallback((comment: Omit<Comment, 'id' | 'timestamp' | 'replies' | 'resolved'>) => {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
      timestamp: Date.now(),
      replies: [],
      resolved: false,
    };

    setComments((prev) => [...prev, newComment]);

    if (socket) {
      socket.emit('add-comment', newComment);
    }

    addActivity('comment-added', `${comment.userName} added a comment on page ${comment.pageNumber}`);
  }, [socket]);

  // Add reply to comment
  const addReply = useCallback((commentId: string, text: string) => {
    const reply: CommentReply = {
      id: `reply-${Date.now()}`,
      userId: currentUser?.id || '',
      userName: currentUser?.name || '',
      text,
      timestamp: Date.now(),
    };

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c
      )
    );

    if (socket) {
      socket.emit('add-reply', { commentId, reply });
    }
  }, [currentUser, socket]);

  // Resolve comment
  const resolveComment = useCallback((commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, resolved: true } : c))
    );

    if (socket) {
      socket.emit('resolve-comment', { commentId });
    }
  }, [socket]);

  // Delete comment
  const deleteComment = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    if (socket) {
      socket.emit('delete-comment', { commentId });
    }
  }, [socket]);

  // Send chat message
  const sendChatMessage = useCallback((text: string) => {
    if (!currentUser) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userColor: currentUser.color,
      text,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, message]);

    if (socket) {
      socket.emit('chat-message', message);
    }
  }, [currentUser, socket]);

  // Add activity
  const addActivity = useCallback((action: string, description: string) => {
    if (!currentUser) return;

    const activity: Activity = {
      id: `activity-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userColor: currentUser.color,
      action,
      description,
      timestamp: Date.now(),
    };

    setActivities((prev) => [activity, ...prev].slice(0, 50)); // Keep last 50 activities
  }, [currentUser]);

  const value: CollaborationContextState = {
    session,
    isConnected,
    currentUser,
    onlineUsers,
    ydoc,
    provider,
    socket,
    comments,
    addComment,
    addReply,
    resolveComment,
    deleteComment,
    chatMessages,
    sendChatMessage,
    activities,
    addActivity,
    createSession,
    joinSession,
    leaveSession,
    updateCursor,
    updateCurrentPage,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

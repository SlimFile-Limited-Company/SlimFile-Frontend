/**
 * SlimFile Meet - Standalone Signaling Server
 *
 * This is a complete, ready-to-run Socket.io server for SlimFile Meet.
 * Use this if you don't have a Socket.io server yet, or want to run
 * the meeting signaling on a separate server.
 *
 * SETUP:
 * 1. npm install express socket.io cors dotenv
 * 2. Create .env file with:
 *    PORT=3001
 *    FRONTEND_URL=http://localhost:5173
 * 3. node BACKEND_MEETING_SERVER_EXAMPLE.js
 *
 * OR integrate into your existing server using BACKEND_MEETING_HANDLERS.js
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Configuration
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Create Express app
const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'SlimFile Meet Signaling Server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Meeting stats endpoint
app.get('/api/meetings/stats', (req, res) => {
  const stats = getMeetingStats();
  res.json(stats);
});

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store active sockets by userId
const userSockets = new Map();

// ==========================================
// SOCKET.IO EVENT HANDLERS
// ==========================================

io.on('connection', (socket) => {
  console.log('\n🔌 New connection:', socket.id);

  // Get userId from auth or use socket.id
  const userId = socket.handshake.auth?.userId || socket.id;
  userSockets.set(userId, socket);
  socket.userId = userId;

  console.log(`   User ID: ${userId}`);

  // ========================================
  // JOIN MEETING
  // ========================================
  socket.on('meeting:join', ({ meetingId, userId: clientUserId }) => {
    const joinUserId = clientUserId || socket.userId;

    // Join the Socket.io room
    socket.join(`meeting-${meetingId}`);
    socket.meetingId = meetingId;
    socket.userId = joinUserId;

    const roomSize = io.sockets.adapter.rooms.get(`meeting-${meetingId}`)?.size || 0;

    console.log(`\n✅ JOIN - User ${joinUserId} joined meeting ${meetingId}`);
    console.log(`   Total participants: ${roomSize}`);

    // Notify existing participants
    socket.to(`meeting-${meetingId}`).emit('meeting:user-joined', {
      userId: joinUserId,
      meetingId
    });

    // Send list of existing participants to new user
    const roomSockets = io.sockets.adapter.rooms.get(`meeting-${meetingId}`);
    if (roomSockets) {
      const existingParticipants = [];
      for (const socketId of roomSockets) {
        const participantSocket = io.sockets.sockets.get(socketId);
        if (participantSocket && participantSocket.id !== socket.id) {
          existingParticipants.push({
            userId: participantSocket.userId,
            socketId: participantSocket.id
          });
        }
      }

      if (existingParticipants.length > 0) {
        console.log(`   Sending ${existingParticipants.length} existing participants to ${joinUserId}`);
        socket.emit('meeting:existing-participants', {
          participants: existingParticipants
        });
      }
    }
  });

  // ========================================
  // LEAVE MEETING
  // ========================================
  socket.on('meeting:leave', ({ meetingId }) => {
    const userId = socket.userId;

    console.log(`\n👋 LEAVE - User ${userId} left meeting ${meetingId}`);

    // Notify others
    socket.to(`meeting-${meetingId}`).emit('meeting:user-left', {
      userId
    });

    // Leave room
    socket.leave(`meeting-${meetingId}`);
    socket.meetingId = null;
  });

  // ========================================
  // WEBRTC: OFFER
  // ========================================
  socket.on('meeting:offer', ({ meetingId, targetUserId, offer }) => {
    const fromUserId = socket.userId;

    console.log(`\n📤 OFFER - ${fromUserId} → ${targetUserId}`);

    const targetSocket = findSocketInRoom(meetingId, targetUserId);

    if (targetSocket) {
      targetSocket.emit('meeting:offer', {
        fromUserId,
        offer
      });
      console.log(`   ✅ Offer delivered`);
    } else {
      console.log(`   ❌ Target not found`);
      socket.emit('meeting:error', {
        message: `User ${targetUserId} not found in meeting`
      });
    }
  });

  // ========================================
  // WEBRTC: ANSWER
  // ========================================
  socket.on('meeting:answer', ({ meetingId, targetUserId, answer }) => {
    const fromUserId = socket.userId;

    console.log(`\n📥 ANSWER - ${fromUserId} → ${targetUserId}`);

    const targetSocket = findSocketInRoom(meetingId, targetUserId);

    if (targetSocket) {
      targetSocket.emit('meeting:answer', {
        fromUserId,
        answer
      });
      console.log(`   ✅ Answer delivered`);
    } else {
      console.log(`   ❌ Target not found`);
      socket.emit('meeting:error', {
        message: `User ${targetUserId} not found in meeting`
      });
    }
  });

  // ========================================
  // WEBRTC: ICE CANDIDATE
  // ========================================
  socket.on('meeting:ice-candidate', ({ meetingId, targetUserId, candidate }) => {
    const fromUserId = socket.userId;

    console.log(`🧊 ICE - ${fromUserId} → ${targetUserId}`);

    const targetSocket = findSocketInRoom(meetingId, targetUserId);

    if (targetSocket) {
      targetSocket.emit('meeting:ice-candidate', {
        fromUserId,
        candidate
      });
    }
  });

  // ========================================
  // DISCONNECT
  // ========================================
  socket.on('disconnect', (reason) => {
    const { userId, meetingId } = socket;

    console.log(`\n🔌 DISCONNECT - User ${userId} (${reason})`);

    if (meetingId) {
      socket.to(`meeting-${meetingId}`).emit('meeting:user-left', {
        userId
      });
      console.log(`   Notified meeting ${meetingId}`);
    }

    if (userId) {
      userSockets.delete(userId);
    }
  });

  // ========================================
  // ERROR
  // ========================================
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Find socket in a specific meeting room
 */
function findSocketInRoom(meetingId, userId) {
  const roomSockets = io.sockets.adapter.rooms.get(`meeting-${meetingId}`);

  if (!roomSockets) {
    return null;
  }

  for (const socketId of roomSockets) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket && socket.userId === userId) {
      return socket;
    }
  }

  return null;
}

/**
 * Get statistics about active meetings
 */
function getMeetingStats() {
  const stats = {
    totalConnections: io.sockets.sockets.size,
    activeMeetings: [],
    totalParticipants: 0
  };

  // Get all rooms starting with "meeting-"
  for (const [roomName, sockets] of io.sockets.adapter.rooms.entries()) {
    if (roomName.startsWith('meeting-')) {
      const meetingId = roomName.replace('meeting-', '');
      const participantCount = sockets.size;

      stats.activeMeetings.push({
        meetingId,
        participants: participantCount
      });

      stats.totalParticipants += participantCount;
    }
  }

  return stats;
}

// ==========================================
// START SERVER
// ==========================================

server.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 SlimFile Meet Signaling Server');
  console.log('='.repeat(50));
  console.log(`✅ Server running on: http://localhost:${PORT}`);
  console.log(`✅ Frontend URL: ${FRONTEND_URL}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ Meeting stats: http://localhost:${PORT}/api/meetings/stats`);
  console.log('='.repeat(50) + '\n');
  console.log('📡 Waiting for connections...\n');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

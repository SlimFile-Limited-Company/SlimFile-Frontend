/**
 * SlimFile Meet - Socket.io Signaling Handlers
 *
 * Copy this code into your backend Socket.io setup.
 * This handles WebRTC signaling for video calls.
 *
 * Installation:
 * npm install socket.io
 *
 * Usage:
 * const io = require('socket.io')(server);
 * setupMeetingHandlers(io);
 */

// Store active sockets by userId for quick lookup
const userSockets = new Map();

/**
 * Set up all meeting-related Socket.io handlers
 * @param {Object} io - Socket.io server instance
 */
function setupMeetingHandlers(io) {
  io.on('connection', (socket) => {
    console.log('🔌 New socket connection:', socket.id);

    // Store socket reference
    const userId = socket.handshake.auth?.userId || socket.id;
    userSockets.set(userId, socket);
    socket.userId = userId;

    // ==========================================
    // MEETING: JOIN
    // ==========================================
    socket.on('meeting:join', ({ meetingId, userId: clientUserId }) => {
      const joinUserId = clientUserId || socket.userId;

      // Join the meeting room
      socket.join(`meeting-${meetingId}`);
      socket.meetingId = meetingId;
      socket.userId = joinUserId;

      console.log(`✅ User ${joinUserId} joined meeting ${meetingId}`);
      console.log(`   Room size: ${io.sockets.adapter.rooms.get(`meeting-${meetingId}`)?.size || 0} participants`);

      // Notify all OTHER participants that someone joined
      socket.to(`meeting-${meetingId}`).emit('meeting:user-joined', {
        userId: joinUserId,
        meetingId
      });

      // Send list of existing participants to the new user
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
          socket.emit('meeting:existing-participants', {
            participants: existingParticipants
          });
        }
      }
    });

    // ==========================================
    // MEETING: LEAVE
    // ==========================================
    socket.on('meeting:leave', ({ meetingId }) => {
      const userId = socket.userId;

      console.log(`👋 User ${userId} leaving meeting ${meetingId}`);

      // Notify others in the room
      socket.to(`meeting-${meetingId}`).emit('meeting:user-left', {
        userId
      });

      // Leave the room
      socket.leave(`meeting-${meetingId}`);
      socket.meetingId = null;
    });

    // ==========================================
    // WEBRTC: OFFER
    // ==========================================
    socket.on('meeting:offer', ({ meetingId, targetUserId, offer }) => {
      const fromUserId = socket.userId;

      console.log(`📤 Forwarding offer: ${fromUserId} → ${targetUserId}`);

      // Find target user's socket
      const targetSocket = findSocketInRoom(io, meetingId, targetUserId);

      if (targetSocket) {
        targetSocket.emit('meeting:offer', {
          fromUserId,
          offer
        });
        console.log(`   ✅ Offer delivered`);
      } else {
        console.log(`   ❌ Target user ${targetUserId} not found in meeting ${meetingId}`);
        socket.emit('meeting:error', {
          message: `User ${targetUserId} not found in meeting`
        });
      }
    });

    // ==========================================
    // WEBRTC: ANSWER
    // ==========================================
    socket.on('meeting:answer', ({ meetingId, targetUserId, answer }) => {
      const fromUserId = socket.userId;

      console.log(`📥 Forwarding answer: ${fromUserId} → ${targetUserId}`);

      // Find target user's socket
      const targetSocket = findSocketInRoom(io, meetingId, targetUserId);

      if (targetSocket) {
        targetSocket.emit('meeting:answer', {
          fromUserId,
          answer
        });
        console.log(`   ✅ Answer delivered`);
      } else {
        console.log(`   ❌ Target user ${targetUserId} not found`);
        socket.emit('meeting:error', {
          message: `User ${targetUserId} not found in meeting`
        });
      }
    });

    // ==========================================
    // WEBRTC: ICE CANDIDATE
    // ==========================================
    socket.on('meeting:ice-candidate', ({ meetingId, targetUserId, candidate }) => {
      const fromUserId = socket.userId;

      console.log(`🧊 Forwarding ICE candidate: ${fromUserId} → ${targetUserId}`);

      // Find target user's socket
      const targetSocket = findSocketInRoom(io, meetingId, targetUserId);

      if (targetSocket) {
        targetSocket.emit('meeting:ice-candidate', {
          fromUserId,
          candidate
        });
      } else {
        console.log(`   ❌ Target user ${targetUserId} not found for ICE candidate`);
      }
    });

    // ==========================================
    // DISCONNECT
    // ==========================================
    socket.on('disconnect', (reason) => {
      const { userId, meetingId } = socket;

      console.log(`🔌 User ${userId} disconnected (${reason})`);

      // Notify others if user was in a meeting
      if (meetingId) {
        socket.to(`meeting-${meetingId}`).emit('meeting:user-left', {
          userId
        });
        console.log(`   📢 Notified meeting ${meetingId} about disconnect`);
      }

      // Clean up
      if (userId) {
        userSockets.delete(userId);
      }
    });

    // ==========================================
    // ERROR HANDLING
    // ==========================================
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  });
}

/**
 * Helper function to find a socket in a specific meeting room
 * @param {Object} io - Socket.io instance
 * @param {String} meetingId - Meeting room ID
 * @param {String} userId - User ID to find
 * @returns {Object|null} Socket instance or null
 */
function findSocketInRoom(io, meetingId, userId) {
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
 * Get meeting statistics (optional - for monitoring)
 * @param {Object} io - Socket.io instance
 * @returns {Object} Statistics object
 */
function getMeetingStats(io) {
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
// EXPORT
// ==========================================
module.exports = {
  setupMeetingHandlers,
  getMeetingStats
};

/**
 * INTEGRATION EXAMPLE:
 *
 * // In your server.js or app.js:
 *
 * const express = require('express');
 * const http = require('http');
 * const { Server } = require('socket.io');
 * const { setupMeetingHandlers, getMeetingStats } = require('./meetingHandlers');
 *
 * const app = express();
 * const server = http.createServer(app);
 *
 * // Configure Socket.io with CORS
 * const io = new Server(server, {
 *   cors: {
 *     origin: process.env.FRONTEND_URL || "http://localhost:5173",
 *     methods: ["GET", "POST"],
 *     credentials: true
 *   }
 * });
 *
 * // Set up meeting handlers
 * setupMeetingHandlers(io);
 *
 * // Optional: Endpoint to check meeting stats
 * app.get('/api/meetings/stats', (req, res) => {
 *   res.json(getMeetingStats(io));
 * });
 *
 * const PORT = process.env.PORT || 3000;
 * server.listen(PORT, () => {
 *   console.log(`✅ Server running on port ${PORT}`);
 *   console.log(`✅ SlimFile Meet signaling ready`);
 * });
 */

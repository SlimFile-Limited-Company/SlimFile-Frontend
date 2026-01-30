# SlimFile Meet - Backend Implementation Guide

## Overview

SlimFile Meet is a standalone video conferencing tool similar to Google Meet. This document outlines the backend requirements for implementing WebRTC signaling through Socket.io.

---

## Architecture

```
┌─────────────┐                 ┌─────────────┐
│  Browser A  │◄────WebRTC─────►│  Browser B  │
│   (Peer 1)  │                 │   (Peer 2)  │
└──────┬──────┘                 └──────┬──────┘
       │                               │
       │         Signaling via          │
       │         Socket.io             │
       │                               │
       └──────►┌──────────────┐◄───────┘
               │   Backend    │
               │ Socket Server│
               └──────────────┘
```

**Key Points:**
- **WebRTC**: Peer-to-peer video/audio (happens in browsers, NOT through backend)
- **Backend Role**: Only handles signaling (exchanging connection info)
- **No media routing**: Video/audio streams go directly between browsers
- **Low server load**: Backend only relays small signaling messages

---

## Socket Events to Implement

### 1. **Join Meeting**

**Event:** `meeting:join`

**Payload from frontend:**
```javascript
{
  meetingId: string,  // e.g., "abc-def-ghi"
  userId: string      // Authenticated user ID from JWT
}
```

**Backend actions:**
1. Join the user to a Socket.io room with name `meeting-${meetingId}`
2. Broadcast to all other participants in that room:

**Broadcast:** `meeting:user-joined`
```javascript
socket.to(`meeting-${meetingId}`).emit('meeting:user-joined', {
  userId: string,     // The user who just joined
  meetingId: string
});
```

**Backend code example:**
```javascript
socket.on('meeting:join', ({ meetingId, userId }) => {
  // Join the meeting room
  socket.join(`meeting-${meetingId}`);

  console.log(`User ${userId} joined meeting ${meetingId}`);

  // Notify others in the room
  socket.to(`meeting-${meetingId}`).emit('meeting:user-joined', {
    userId,
    meetingId
  });

  // Store userId with socket for later
  socket.userId = userId;
  socket.meetingId = meetingId;
});
```

---

### 2. **Leave Meeting**

**Event:** `meeting:leave`

**Payload from frontend:**
```javascript
{
  meetingId: string
}
```

**Backend actions:**
1. Broadcast to all participants that user left
2. Remove user from Socket.io room

**Broadcast:** `meeting:user-left`
```javascript
socket.to(`meeting-${meetingId}`).emit('meeting:user-left', {
  userId: string
});
```

**Backend code example:**
```javascript
socket.on('meeting:leave', ({ meetingId }) => {
  const userId = socket.userId;

  console.log(`User ${userId} left meeting ${meetingId}`);

  // Notify others
  socket.to(`meeting-${meetingId}`).emit('meeting:user-left', {
    userId
  });

  // Leave the room
  socket.leave(`meeting-${meetingId}`);
});

// Also handle disconnect
socket.on('disconnect', () => {
  const { userId, meetingId } = socket;

  if (meetingId) {
    socket.to(`meeting-${meetingId}`).emit('meeting:user-left', {
      userId
    });
  }
});
```

---

### 3. **WebRTC Offer**

**Event:** `meeting:offer`

**Payload from frontend:**
```javascript
{
  meetingId: string,
  targetUserId: string,  // Who this offer is for
  offer: RTCSessionDescriptionInit  // WebRTC SDP offer
}
```

**Backend actions:**
Forward the offer to the target user (find their socket by userId)

**Emit to target:** `meeting:offer`
```javascript
{
  fromUserId: string,
  offer: RTCSessionDescriptionInit
}
```

**Backend code example:**
```javascript
socket.on('meeting:offer', ({ meetingId, targetUserId, offer }) => {
  const fromUserId = socket.userId;

  console.log(`Forwarding offer from ${fromUserId} to ${targetUserId}`);

  // Find target user's socket in the meeting room
  const targetSocket = findSocketByUserId(meetingId, targetUserId);

  if (targetSocket) {
    targetSocket.emit('meeting:offer', {
      fromUserId,
      offer
    });
  }
});
```

---

### 4. **WebRTC Answer**

**Event:** `meeting:answer`

**Payload from frontend:**
```javascript
{
  meetingId: string,
  targetUserId: string,  // Who this answer is for
  answer: RTCSessionDescriptionInit  // WebRTC SDP answer
}
```

**Backend actions:**
Forward the answer to the target user

**Emit to target:** `meeting:answer`
```javascript
{
  fromUserId: string,
  answer: RTCSessionDescriptionInit
}
```

**Backend code example:**
```javascript
socket.on('meeting:answer', ({ meetingId, targetUserId, answer }) => {
  const fromUserId = socket.userId;

  console.log(`Forwarding answer from ${fromUserId} to ${targetUserId}`);

  const targetSocket = findSocketByUserId(meetingId, targetUserId);

  if (targetSocket) {
    targetSocket.emit('meeting:answer', {
      fromUserId,
      answer
    });
  }
});
```

---

### 5. **ICE Candidate**

**Event:** `meeting:ice-candidate`

**Payload from frontend:**
```javascript
{
  meetingId: string,
  targetUserId: string,
  candidate: RTCIceCandidateInit  // ICE candidate for NAT traversal
}
```

**Backend actions:**
Forward the ICE candidate to the target user

**Emit to target:** `meeting:ice-candidate`
```javascript
{
  fromUserId: string,
  candidate: RTCIceCandidateInit
}
```

**Backend code example:**
```javascript
socket.on('meeting:ice-candidate', ({ meetingId, targetUserId, candidate }) => {
  const fromUserId = socket.userId;

  const targetSocket = findSocketByUserId(meetingId, targetUserId);

  if (targetSocket) {
    targetSocket.emit('meeting:ice-candidate', {
      fromUserId,
      candidate
    });
  }
});
```

---

## Helper Functions

### Find Socket by User ID

You'll need a way to map userId to socket instances:

```javascript
// Store socket instances by userId
const userSockets = new Map();

// When socket connects
io.on('connection', (socket) => {
  // After authentication
  const userId = getUserIdFromToken(socket.handshake.auth.token);
  userSockets.set(userId, socket);

  socket.on('disconnect', () => {
    userSockets.delete(userId);
  });
});

// Helper function
function findSocketByUserId(meetingId, userId) {
  const socket = userSockets.get(userId);

  // Verify socket is in the meeting room
  if (socket && socket.rooms.has(`meeting-${meetingId}`)) {
    return socket;
  }

  return null;
}
```

---

## Complete Backend Implementation Example

```javascript
// server.js or socket handler file

import { Server } from 'socket.io';

// Store user sockets
const userSockets = new Map();

export function setupMeetingHandlers(io: Server) {
  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    // Authenticate (get userId from JWT token)
    const userId = socket.handshake.auth.userId || socket.userId;

    if (userId) {
      userSockets.set(userId, socket);
      socket.userId = userId;
    }

    // Join meeting
    socket.on('meeting:join', ({ meetingId, userId }) => {
      socket.join(`meeting-${meetingId}`);
      socket.meetingId = meetingId;
      socket.userId = userId;

      console.log(`✅ User ${userId} joined meeting ${meetingId}`);

      // Notify others
      socket.to(`meeting-${meetingId}`).emit('meeting:user-joined', {
        userId,
        meetingId
      });
    });

    // Leave meeting
    socket.on('meeting:leave', ({ meetingId }) => {
      const userId = socket.userId;

      console.log(`👋 User ${userId} left meeting ${meetingId}`);

      socket.to(`meeting-${meetingId}`).emit('meeting:user-left', {
        userId
      });

      socket.leave(`meeting-${meetingId}`);
    });

    // Forward offer
    socket.on('meeting:offer', ({ meetingId, targetUserId, offer }) => {
      const fromUserId = socket.userId;
      const targetSocket = userSockets.get(targetUserId);

      if (targetSocket && targetSocket.rooms.has(`meeting-${meetingId}`)) {
        targetSocket.emit('meeting:offer', {
          fromUserId,
          offer
        });
      }
    });

    // Forward answer
    socket.on('meeting:answer', ({ meetingId, targetUserId, answer }) => {
      const fromUserId = socket.userId;
      const targetSocket = userSockets.get(targetUserId);

      if (targetSocket && targetSocket.rooms.has(`meeting-${meetingId}`)) {
        targetSocket.emit('meeting:answer', {
          fromUserId,
          answer
        });
      }
    });

    // Forward ICE candidate
    socket.on('meeting:ice-candidate', ({ meetingId, targetUserId, candidate }) => {
      const fromUserId = socket.userId;
      const targetSocket = userSockets.get(targetUserId);

      if (targetSocket && targetSocket.rooms.has(`meeting-${meetingId}`)) {
        targetSocket.emit('meeting:ice-candidate', {
          fromUserId,
          candidate
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const { userId, meetingId } = socket;

      console.log(`🔌 User ${userId} disconnected`);

      if (meetingId) {
        socket.to(`meeting-${meetingId}`).emit('meeting:user-left', {
          userId
        });
      }

      if (userId) {
        userSockets.delete(userId);
      }
    });
  });
}
```

---

## Testing

### Test with 2 browsers

1. **Browser A** - Open `/meet` → Start new meeting → Get code (e.g., `abc-def-ghi`)
2. **Browser B** - Open `/meet` → Join with code `abc-def-ghi`
3. **Expected:**
   - Both browsers see each other's video
   - Audio works both ways
   - Can toggle mic/camera
   - Can share screen

### Console Logs to Monitor

**Backend:**
```
✅ User user123 joined meeting abc-def-ghi
👋 User user456 left meeting abc-def-ghi
```

**Frontend (Browser Console):**
```
Socket connected: socket-id-123
User joined: user456
Received offer from: user456
Connection state with user456: connected
```

---

## Database (Optional)

You **don't need** a database for basic functionality. WebRTC is peer-to-peer.

**Optional enhancements:**
- Store meeting history (who joined, when, duration)
- Store meeting recordings (if you add recording feature)
- Store chat messages from meetings

```javascript
// Optional: Meeting model
const meetingSchema = new mongoose.Schema({
  meetingId: String,
  createdBy: ObjectId,
  participants: [{
    userId: ObjectId,
    joinedAt: Date,
    leftAt: Date
  }],
  createdAt: Date,
  endedAt: Date
});
```

---

## Security Considerations

1. **Authenticate socket connections:**
   ```javascript
   io.use((socket, next) => {
     const token = socket.handshake.auth.token;
     try {
       const user = verifyJWT(token);
       socket.userId = user.id;
       next();
     } catch (err) {
       next(new Error('Authentication error'));
     }
   });
   ```

2. **Validate meeting access** (optional):
   - Check if user has permission to join meeting
   - Implement waiting rooms
   - Meeting passwords

3. **Rate limiting:**
   - Limit meeting creation per user
   - Limit signaling message rate

---

## Performance

**Server requirements:**
- **Very low** - Only relaying signaling messages
- **No video/audio processing** - happens peer-to-peer
- **Scalability:** 1000s of concurrent meetings on modest server
- **Bandwidth:** Minimal (just JSON signaling messages)

**Horizontal scaling:**
If you need to scale across multiple servers, use Redis adapter for Socket.io:
```bash
npm install @socket.io/redis-adapter redis
```

---

## That's It!

The backend is **extremely simple** because WebRTC does the heavy lifting. You're just relaying connection setup messages between browsers.

**Frontend handles:**
- Camera/mic access
- Video encoding/decoding
- Peer-to-peer connections
- Screen sharing
- All media processing

**Backend handles:**
- Socket rooms (meetings)
- Forwarding signaling messages
- User presence

---

## Questions?

Check the frontend code:
- [meetingService.ts](./src/services/meetingService.ts) - WebRTC logic
- [MeetingRoom.tsx](./src/pages/MeetingRoom.tsx) - UI component
- [Meet.tsx](./src/pages/Meet.tsx) - Landing page

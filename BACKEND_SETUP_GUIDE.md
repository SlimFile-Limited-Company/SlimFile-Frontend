# SlimFile Meet Backend Setup Guide

## Quick Start (5 Minutes)

This guide will get your SlimFile Meet signaling server running in 5 minutes!

---

## Option 1: Standalone Server (Recommended for Testing)

Use this if you want to quickly test SlimFile Meet or don't have a Socket.io server yet.

### Step 1: Create a new folder for the backend

```bash
mkdir slimfile-meet-backend
cd slimfile-meet-backend
```

### Step 2: Copy the files

Copy these files from the root SlimFile folder to your new backend folder:
- `BACKEND_MEETING_SERVER_EXAMPLE.js`
- `backend-meet-package.json` (rename to `package.json`)
- `backend-meet.env.example` (rename to `.env`)

```bash
# On Windows
copy ..\BACKEND_MEETING_SERVER_EXAMPLE.js .
copy ..\backend-meet-package.json package.json
copy ..\backend-meet.env.example .env

# On Mac/Linux
cp ../BACKEND_MEETING_SERVER_EXAMPLE.js .
cp ../backend-meet-package.json package.json
cp ../backend-meet.env.example .env
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Configure the .env file

Edit the `.env` file:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Important:** Make sure `FRONTEND_URL` matches where your frontend is running!

### Step 5: Start the server

```bash
npm start
```

You should see:
```
==================================================
🚀 SlimFile Meet Signaling Server
==================================================
✅ Server running on: http://localhost:3001
✅ Frontend URL: http://localhost:5173
✅ Health check: http://localhost:3001/health
✅ Meeting stats: http://localhost:3001/api/meetings/stats
==================================================

📡 Waiting for connections...
```

### Step 6: Test it

1. Open your frontend at `http://localhost:5173/meet`
2. Start a new meeting
3. Open another browser/incognito window
4. Join the same meeting
5. You should see each other! 🎉

---

## Option 2: Integrate into Existing Server

If you already have a Node.js/Express server with Socket.io:

### Step 1: Copy the handler file

Copy `BACKEND_MEETING_HANDLERS.js` to your backend project:

```bash
cp BACKEND_MEETING_HANDLERS.js /path/to/your/backend/
```

### Step 2: Install Socket.io (if not already installed)

```bash
npm install socket.io
```

### Step 3: Integrate into your server

In your main server file (e.g., `server.js` or `app.js`):

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { setupMeetingHandlers } = require('./BACKEND_MEETING_HANDLERS');

const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Set up meeting handlers
setupMeetingHandlers(io);

// Your other routes...

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('✅ SlimFile Meet signaling ready');
});
```

### Step 4: Restart your server

```bash
npm start
```

---

## Frontend Configuration

Update your frontend `.env` file to point to the backend:

```env
# If using standalone server on port 3001:
VITE_SOCKET_URL=http://localhost:3001

# If integrated into existing server:
VITE_SOCKET_URL=http://localhost:3000

# Production:
VITE_SOCKET_URL=https://your-backend.com
```

---

## Testing the Setup

### 1. Check Backend Health

Open `http://localhost:3001/health` (or your backend URL)

You should see:
```json
{
  "status": "OK",
  "service": "SlimFile Meet Signaling Server",
  "timestamp": "2024-01-30T...",
  "uptime": 123.45
}
```

### 2. Check Meeting Stats

Open `http://localhost:3001/api/meetings/stats`

You should see:
```json
{
  "totalConnections": 0,
  "activeMeetings": [],
  "totalParticipants": 0
}
```

### 3. Test with Browser Console

1. Open frontend at `/meet`
2. Start a new meeting
3. Open browser console (F12)
4. You should see:
   ```
   Requesting camera and microphone access...
   Media access granted: ['video', 'audio']
   Initializing meeting connection...
   Joined meeting: abc-def-ghi
   ```

5. In the backend terminal, you should see:
   ```
   🔌 New connection: socket-id-123
      User ID: user-1234567890

   ✅ JOIN - User user-1234567890 joined meeting abc-def-ghi
      Total participants: 1
   ```

### 4. Test with Two Browsers

1. **Browser A**: Start meeting → Get code `abc-def-ghi`
2. **Browser B**: Join with code `abc-def-ghi`
3. **Expected:**
   - Both see each other's video ✅
   - Backend shows 2 participants
   - Console shows WebRTC signaling messages

---

## Troubleshooting

### Issue: "Socket connection failed"

**Check:**
1. Is the backend running? (`npm start`)
2. Is the port correct in frontend `.env`?
3. Check CORS settings in backend

**Fix:**
```javascript
// In backend Socket.io config:
cors: {
  origin: "http://localhost:5173",  // Match your frontend URL!
  methods: ["GET", "POST"],
  credentials: true
}
```

### Issue: "Meeting joined but can't see other person"

**Check backend logs:**
- Do you see "OFFER" and "ANSWER" messages?
- Are there any errors?

**Check frontend console:**
- Are there WebRTC errors?
- Is camera permission granted?

**Common fix:**
Make sure both users are on the same network or use HTTPS (required for WebRTC).

### Issue: "Camera works but no video from other person"

**This usually means:**
- Signaling is working (backend OK)
- WebRTC peer connection failed (network/firewall issue)

**Try:**
1. Use HTTPS (WebRTC requires secure context)
2. Test on same WiFi network first
3. Check browser console for ICE connection state

### Issue: "ERR_CONNECTION_REFUSED"

**Backend not running!**

```bash
cd slimfile-meet-backend
npm start
```

---

## Production Deployment

### Environment Variables

```env
PORT=3001
FRONTEND_URL=https://slimfile.com
NODE_ENV=production
```

### Deploy Options

#### 1. **Render.com** (Free tier available)
- Push code to GitHub
- Connect to Render
- Deploy as Node.js service

#### 2. **Railway** (Free tier)
- Similar to Render
- Auto-deploy from Git

#### 3. **VPS (DigitalOcean, AWS, etc.)**
```bash
# Install PM2 for process management
npm install -g pm2

# Start server with PM2
pm2 start BACKEND_MEETING_SERVER_EXAMPLE.js --name "slimfile-meet"

# Set to auto-start on reboot
pm2 startup
pm2 save
```

### HTTPS Setup

WebRTC **requires HTTPS** in production!

Use:
- **Cloudflare** (free SSL)
- **Let's Encrypt** (free SSL)
- **Nginx** reverse proxy with SSL

---

## Performance & Scaling

### Single Server Capacity

One server can handle:
- **1000+ concurrent connections**
- **200+ active meetings**
- **Very low CPU/memory** (just relaying messages)

### Horizontal Scaling (Multiple Servers)

If you need more capacity, use Redis adapter:

```bash
npm install @socket.io/redis-adapter redis
```

```javascript
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
});
```

---

## Monitoring

### View Active Meetings

```bash
curl http://localhost:3001/api/meetings/stats
```

### Backend Logs

Watch the terminal for:
- ✅ JOIN messages (users joining)
- 👋 LEAVE messages (users leaving)
- 📤 OFFER messages (WebRTC offers)
- 📥 ANSWER messages (WebRTC answers)
- 🧊 ICE messages (NAT traversal)

### Errors to Watch For

- ❌ "Target user not found" → User disconnected
- ❌ "Socket connection error" → Network issue
- 🔌 "User disconnected" → Expected when leaving

---

## Security Considerations

### 1. **Authentication**

Current implementation uses userId from frontend. For production, authenticate socket connections:

```javascript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const user = verifyJWT(token); // Your JWT verification
    socket.userId = user.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});
```

### 2. **Rate Limiting**

Prevent abuse:

```javascript
const rateLimit = require('socket.io-rate-limiter');

io.use(rateLimit({
  interval: 1000, // 1 second
  limit: 10      // 10 messages per second
}));
```

### 3. **Meeting Access Control**

Add meeting passwords or access tokens if needed.

---

## Cost Estimate

### Infrastructure

- **Server**: $5-10/month (DigitalOcean Droplet)
- **Bandwidth**: Minimal (only signaling, not video)
- **Total**: ~$10/month for 1000s of meetings

### Comparison

- **Daily.co**: $99/month for 10,000 minutes
- **Agora**: $0.99 per 1000 minutes
- **SlimFile Meet**: ~$10/month unlimited ✅

---

## Support & Next Steps

### Working? 🎉

If you can see each other in the meeting, you're done!

Optional enhancements:
- Add recording (save to S3/cloud storage)
- Add waiting rooms
- Add meeting history to database
- Add virtual backgrounds

### Not Working? 🔧

Check:
1. Backend logs for errors
2. Frontend console for errors
3. Network/firewall settings
4. HTTPS requirement for production

### Questions?

Refer to:
- [BACKEND_MEETING_HANDLERS.js](./BACKEND_MEETING_HANDLERS.js) - Handler code with comments
- [BACKEND_MEETING_SERVER_EXAMPLE.js](./BACKEND_MEETING_SERVER_EXAMPLE.js) - Complete server example
- [SLIMFILE_MEET_BACKEND_GUIDE.md](./SlimFile-Frontend/SLIMFILE_MEET_BACKEND_GUIDE.md) - Original technical guide

---

**Happy video conferencing! 🎥**

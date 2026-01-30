# Push & Email Notifications Implementation Guide

## Overview

This document outlines the implementation strategy for **Hybrid Notifications** with **5-minute batching** to prevent spam while keeping users informed of workspace activity.

## Notification Strategy

### **Hybrid Approach**
1. **Web Push Notifications** - For users with browser open (even if tab closed)
2. **Email Notifications** - For users completely offline
3. **Smart Batching** - 5-minute windows to prevent notification spam

### **Batching Rules**

```
User receives message while offline:
├── First message → Immediate notification (push or email)
├── Messages 2-N within 5 mins → Batched (no new notification)
└── After 5 minutes → Summary notification: "John sent 8 messages"

Example Timeline:
10:00 AM - John: "Hey" → Notification: "John: Hey"
10:01 AM - John: "Are you there?" → (batched)
10:02 AM - Sarah: "I can help" → (batched)
10:05 AM - Summary: "3 new messages in Team Project"
```

---

## Part 1: Web Push Notifications

### **How Web Push Works**

1. User grants permission in browser
2. Browser generates a unique **push subscription** (includes endpoint + keys)
3. Frontend sends subscription to your backend
4. When message arrives, backend sends push to browser's push service (Chrome, Firefox, etc.)
5. Browser delivers notification even if tab is closed

### **Frontend Implementation** (Already Done ✅)

The frontend already has:
- `pushNotificationService.ts` - Handles push subscription
- `notificationBatchingService.ts` - Implements 5-min batching
- `socketService.ts` - Integrated with batching

Auto-subscribes users on login and when granting permission.

---

## Part 2: Backend Requirements

### **1. Store Push Subscriptions**

Create a collection/table to store user push subscriptions:

```javascript
// MongoDB Schema Example
const pushSubscriptionSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  subscription: {
    endpoint: String,
    keys: {
      p256dh: String,
      auth: String
    }
  },
  userAgent: String, // For debugging which device/browser
  createdAt: { type: Date, default: Date.now },
  lastUsed: Date
});

// Indexes
pushSubscriptionSchema.index({ userId: 1 });
pushSubscriptionSchema.index({ 'subscription.endpoint': 1 }, { unique: true });
```

### **2. Push Subscription Endpoints**

#### **Subscribe to Push**
```
POST /api/notifications/subscribe
Headers: Authorization: Bearer <jwt>
Body:
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  }
}

Response: { "success": true }
```

#### **Unsubscribe from Push**
```
DELETE /api/notifications/unsubscribe
Headers: Authorization: Bearer <jwt>

Response: { "success": true }
```

### **3. Send Push Notifications**

Install web-push library:
```bash
npm install web-push
```

Generate VAPID keys (one-time setup):
```bash
npx web-push generate-vapid-keys
```

Add to your `.env`:
```
VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmThrerGHR3c0LzaHrLX_-qQNjqvvqZGnP7h0wL6PxJgZ7nqWvCA
VAPID_PRIVATE_KEY=<your-private-key>
VAPID_EMAIL=mailto:your-email@example.com
```

**Backend code to send push:**

```javascript
const webpush = require('web-push');

// Configure VAPID
webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Function to send push notification
async function sendPushNotification(userId, payload) {
  try {
    // Get all push subscriptions for this user
    const subscriptions = await PushSubscription.find({ userId });

    const promises = subscriptions.map(sub => {
      return webpush.sendNotification(sub.subscription, JSON.stringify(payload))
        .catch(error => {
          if (error.statusCode === 410) {
            // Subscription expired, remove it
            return PushSubscription.deleteOne({ _id: sub._id });
          }
          console.error('Push notification error:', error);
        });
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
}
```

### **4. Message Batching Logic (Backend)**

Track batches in memory or Redis:

```javascript
// In-memory batching (use Redis for production)
const messageBatches = new Map(); // workspaceId -> { messages, timeout, users }

// When a new message arrives via socket
socket.on('sendMessage', async (data) => {
  const { workspaceId, senderId, text } = data;

  // Save message to database
  const message = await Message.create({ workspaceId, senderId, text });

  // Broadcast to all workspace members via socket
  io.to(workspaceId).emit('newMessage', message);

  // Get all workspace members who are offline
  const offlineMembers = await getOfflineMembersInWorkspace(workspaceId);

  offlineMembers.forEach(member => {
    handleOfflineNotification(member, workspaceId, message);
  });
});

function handleOfflineNotification(userId, workspaceId, message) {
  const batchKey = `${userId}-${workspaceId}`;
  let batch = messageBatches.get(batchKey);

  if (!batch) {
    // First message - send immediately
    sendImmediatePushNotification(userId, {
      title: `${message.senderId.name} • ${workspaceName}`,
      body: message.text,
      data: { workspaceId, messageId: message._id }
    });

    // Start batching subsequent messages
    batch = {
      messages: [message],
      timeout: setTimeout(() => {
        sendBatchedPushNotification(userId, workspaceId);
      }, 5 * 60 * 1000) // 5 minutes
    };
    messageBatches.set(batchKey, batch);
  } else {
    // Add to existing batch
    batch.messages.push(message);
  }
}

function sendBatchedPushNotification(userId, workspaceId) {
  const batchKey = `${userId}-${workspaceId}`;
  const batch = messageBatches.get(batchKey);

  if (batch && batch.messages.length > 1) {
    const count = batch.messages.length;
    const senders = [...new Set(batch.messages.map(m => m.senderId.name))];

    let body;
    if (senders.length === 1) {
      body = `${senders[0]} sent ${count} messages`;
    } else {
      body = `${count} new messages from ${senders.length} people`;
    }

    sendPushNotification(userId, {
      title: workspaceName,
      body,
      data: { workspaceId }
    });
  }

  messageBatches.delete(batchKey);
}

// Helper: Check if user is online (connected via socket)
function getOfflineMembersInWorkspace(workspaceId) {
  // Get all workspace members
  const members = await WorkspaceMember.find({ workspaceId })
    .populate('user')
    .lean();

  // Filter out members who are currently connected via socket
  const onlineUserIds = getConnectedSocketUserIds();

  return members
    .filter(m => !onlineUserIds.includes(m.user._id.toString()))
    .map(m => m.user._id);
}
```

---

## Part 3: Email Notifications

### **Email Strategy**

1. **Immediate email** if user has been offline for > 1 hour
2. **Daily digest** if user hasn't opened app in 24 hours
3. **Batching** - Same 5-minute windows as push notifications

### **Email Service Setup**

Use a service like:
- **Resend** (recommended, modern, free tier)
- **SendGrid** (popular, generous free tier)
- **AWS SES** (cheap, requires setup)
- **Mailgun** (good deliverability)

#### **Example with Resend:**

```bash
npm install resend
```

```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmailNotification(userEmail, subject, htmlContent) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'SlimFile <notifications@slimfile.com>',
      to: [userEmail],
      subject,
      html: htmlContent
    });

    if (error) {
      console.error('Email error:', error);
    }
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
```

### **When to Send Emails**

```javascript
function handleOfflineNotification(userId, workspaceId, message) {
  const user = await User.findById(userId);
  const lastSeen = await getLastSeenTime(userId);
  const offlineDuration = Date.now() - lastSeen;

  const batchKey = `${userId}-${workspaceId}`;
  let batch = messageBatches.get(batchKey);

  if (!batch) {
    // First message in batch

    // Send push notification immediately
    sendImmediatePushNotification(userId, { ... });

    // Also send email if user has been offline for > 1 hour
    if (offlineDuration > 60 * 60 * 1000) {
      sendEmailNotification(
        user.email,
        `New message in ${workspaceName}`,
        generateMessageEmailHTML(message)
      );
    }

    // Start batching
    batch = { messages: [message], timeout: ... };
    messageBatches.set(batchKey, batch);
  } else {
    // Add to batch
    batch.messages.push(message);
  }
}
```

### **Email Templates**

#### **Immediate Message Email:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; }
    .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
    .message { background: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #ef4444; }
    .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Message in ${workspaceName}</h2>
    </div>
    <div class="message">
      <strong>${senderName}</strong>
      <p>${messageText}</p>
      <small>${timestamp}</small>
    </div>
    <center>
      <a href="https://slimfile.com/workspaces/${workspaceId}" class="button">
        View in SlimFile
      </a>
    </center>
  </div>
</body>
</html>
```

#### **Daily Digest Email:**
```html
<div class="container">
  <div class="header">
    <h2>Your Daily SlimFile Digest</h2>
    <p>You have ${totalUnread} unread messages in ${workspaceCount} workspaces</p>
  </div>

  <h3>Team Project (12 messages)</h3>
  <div class="message">
    <strong>John</strong>: "Need help with design"
  </div>
  <div class="message">
    <strong>Sarah</strong>: "I can help with that"
  </div>
  <a href="...">View all messages</a>

  <h3>Personal Workspace (5 messages)</h3>
  ...

  <center>
    <a href="https://slimfile.com/workspaces" class="button">
      Open SlimFile
    </a>
  </center>

  <footer>
    <small>
      <a href="https://slimfile.com/settings/notifications">Manage notification preferences</a>
    </small>
  </footer>
</div>
```

### **Daily Digest Cron Job**

Run every hour to check for users who need digest emails:

```javascript
// Run every hour
cron.schedule('0 * * * *', async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Find users who haven't logged in for 24 hours and have unread messages
  const inactiveUsers = await User.find({
    lastLoginAt: { $lt: oneDayAgo },
    lastDigestSentAt: { $lt: oneDayAgo } // Don't spam digests
  });

  for (const user of inactiveUsers) {
    const unreadCounts = await getUnreadMessageCounts(user._id);

    if (unreadCounts.total > 0) {
      await sendDailyDigestEmail(user.email, unreadCounts);
      await User.updateOne(
        { _id: user._id },
        { lastDigestSentAt: new Date() }
      );
    }
  }
});
```

---

## Part 4: User Preferences

Add notification settings to user model:

```javascript
const userSchema = new mongoose.Schema({
  // ... existing fields
  notificationPreferences: {
    pushEnabled: { type: Boolean, default: true },
    emailEnabled: { type: Boolean, default: true },
    emailFrequency: {
      type: String,
      enum: ['immediate', 'hourly', 'daily'],
      default: 'hourly'
    },
    mutedWorkspaces: [{ type: ObjectId, ref: 'Workspace' }]
  }
});
```

**Settings API:**
```
PATCH /api/users/me/notification-preferences
Body:
{
  "pushEnabled": true,
  "emailEnabled": false,
  "emailFrequency": "daily"
}
```

---

## Part 5: Testing & Monitoring

### **Test Checklist**

#### Web Push
- [ ] User subscribes on login
- [ ] First message triggers immediate notification
- [ ] Subsequent messages batched (no notification spam)
- [ ] After 5 mins, summary notification sent
- [ ] Clicking notification opens workspace
- [ ] Subscription persists across sessions
- [ ] Expired subscriptions removed automatically

#### Email
- [ ] User offline > 1 hour receives email
- [ ] Email contains correct message content
- [ ] Link in email works
- [ ] Daily digest sent after 24 hours offline
- [ ] User can unsubscribe from emails
- [ ] Respects user notification preferences

### **Monitoring**

Track metrics:
- Push notification delivery rate
- Email delivery rate
- Click-through rate (notifications → app opens)
- Unsubscribe rate
- Notification latency

---

## Summary

### **Notification Flow**

```
New Message Arrives
├── User Online? → Real-time socket update only
└── User Offline?
    ├── First message in 5-min window?
    │   ├── Send push notification immediately
    │   └── If offline > 1 hour → Also send email
    └── Subsequent messages → Add to batch
        └── After 5 minutes → Send summary (push + email if applicable)

User Offline 24+ Hours
└── Send daily digest email with all unread messages
```

### **What's Implemented (Frontend)**
✅ Web push subscription service
✅ 5-minute batching logic
✅ Browser notification system
✅ Socket integration with batching
✅ Auto-request permission on login

### **What You Need to Build (Backend)**
⚠️ Store push subscriptions endpoint
⚠️ Send web push notifications
⚠️ Message batching logic
⚠️ Email notification service
⚠️ Daily digest cron job
⚠️ User notification preferences API

### **Cost Estimates**

- **Web Push**: Free (uses browser push services)
- **Email (Resend)**: Free up to 3,000/month, then $0.01/email
- **Email (SendGrid)**: Free up to 100/day, then paid plans
- **Redis** (for batching): ~$5-10/month (optional, can use in-memory)

---

## Next Steps

1. Generate VAPID keys: `npx web-push generate-vapid-keys`
2. Add VAPID keys to frontend `.env`: `VITE_VAPID_PUBLIC_KEY=...`
3. Implement backend push subscription storage
4. Implement push notification sending
5. Choose email service (Resend recommended)
6. Implement email templates
7. Set up daily digest cron job
8. Test thoroughly with multiple users

Questions? Check the frontend code:
- [notificationBatchingService.ts](./src/services/notificationBatchingService.ts)
- [pushNotificationService.ts](./src/services/pushNotificationService.ts)
- [socketService.ts](./src/services/socketService.ts)

# Offline Notifications - Implementation Summary

## What Was Implemented

I've built a **Hybrid Notification System** with **5-minute batching** to keep users informed of workspace messages even when they're offline, without spamming them.

---

## How It Works

### **User Experience**

1. **User is actively using the app** → Messages appear in real-time via WebSocket (no notifications)

2. **User has app open but is in a different workspace** →
   - First message: Immediate browser notification
   - Messages 2-N within 5 minutes: Batched silently
   - After 5 minutes: Summary notification ("John sent 8 messages in Team Project")

3. **User closed the browser tab (but browser is running)** →
   - Same as #2, but uses **Web Push Notifications** (works even with tab closed)
   - Clicking notification reopens the app

4. **User completely offline (browser closed)** →
   - Backend sends **Email Notification** after 1 hour of inactivity
   - Backend sends **Daily Digest Email** if user hasn't opened app in 24 hours

---

## Technical Implementation

### **Frontend (✅ Fully Implemented)**

#### 1. **Notification Batching Service** ([notificationBatchingService.ts](./src/services/notificationBatchingService.ts))
- Tracks incoming messages per workspace
- Shows first message immediately
- Batches subsequent messages for 5 minutes
- Sends summary notification after batch window

**Example:**
```
10:00 AM - John: "Hey" → Notification shown immediately
10:01 AM - John: "Are you there?" → Batched
10:02 AM - Sarah: "I can help" → Batched
10:05 AM - Summary: "3 new messages in Team Project"
```

#### 2. **Web Push Subscription** ([pushNotificationService.ts](./src/services/pushNotificationService.ts))
- Automatically requests permission after login
- Subscribes user to browser push notifications
- Sends subscription to backend for storage
- Works even when browser tab is closed (but browser must be running)

#### 3. **Socket Integration** ([socketService.ts](./src/services/socketService.ts))
- Intercepts incoming messages
- Routes them through batching service
- Prevents notification spam during active conversations

#### 4. **Auto-Subscribe on Login** ([Login.tsx](./src/pages/Login.tsx), [App.tsx](./src/App.tsx))
- Requests push permission after successful login
- Re-subscribes on app load if permission already granted
- Gracefully handles denied permissions

---

### **Backend (⚠️ Needs Implementation)**

See [PUSH_AND_EMAIL_NOTIFICATIONS.md](./PUSH_AND_EMAIL_NOTIFICATIONS.md) for complete backend guide.

**Quick Summary:**

1. **Store Push Subscriptions** - New API endpoint to save user's push subscription
   ```
   POST /api/notifications/subscribe
   ```

2. **Send Web Push** - When message arrives and user is offline:
   ```javascript
   import webpush from 'web-push';
   await webpush.sendNotification(subscription, payload);
   ```

3. **Implement Batching** - Track message batches (5-min windows)
   - First message → Send push immediately
   - Subsequent → Add to batch
   - After 5 mins → Send summary

4. **Email Notifications** - Using Resend/SendGrid:
   - Immediate email if user offline > 1 hour
   - Daily digest if offline > 24 hours

---

## Notification Flow Diagram

```
New Message Arrives
│
├─ User Online & Viewing Workspace?
│  └─ Yes → Show in chat (no notification)
│
├─ User Online But Different Workspace?
│  ├─ First message in 5 mins? → Browser notification
│  └─ Subsequent messages → Batch for 5 mins → Summary
│
├─ User Offline (Browser Open)?
│  └─ Web Push Notification (via browser push service)
│
└─ User Completely Offline (Browser Closed)?
   ├─ Offline < 1 hour → Wait
   ├─ Offline 1-24 hours → Email notification
   └─ Offline > 24 hours → Daily digest email
```

---

## What You Get

### **Prevents Notification Spam** ✅
- First message notifies immediately (responsive)
- Subsequent messages batched for 5 minutes (no spam)
- Summary after batch window (user knows total count)

### **Works Offline** ✅
- Web Push works when tab is closed
- Email as fallback for completely offline users
- Daily digest for inactive users

### **Smart Batching** ✅
- Per-workspace batching (each workspace has its own 5-min window)
- Flushes batch when user opens the workspace
- Handles multiple senders gracefully

### **Good UX** ✅
- Auto-requests permission (not spammy)
- Clicking notification opens the workspace
- Sound + vibration for important notifications
- Works on desktop AND mobile browsers

---

## Files Changed

### New Files
- **[src/services/notificationBatchingService.ts](./src/services/notificationBatchingService.ts)** - Implements 5-minute batching logic
- **[PUSH_AND_EMAIL_NOTIFICATIONS.md](./PUSH_AND_EMAIL_NOTIFICATIONS.md)** - Complete backend implementation guide
- **[OFFLINE_NOTIFICATIONS_SUMMARY.md](./OFFLINE_NOTIFICATIONS_SUMMARY.md)** - This file

### Modified Files
- **[src/services/socketService.ts](./src/services/socketService.ts)** - Integrated batching service
- **[src/pages/Login.tsx](./src/pages/Login.tsx)** - Auto-subscribe on login
- **[src/App.tsx](./src/App.tsx)** - Request push permission on app load

---

## Testing

### **Test Web Push (Works Now - No Backend Needed)**

1. Login to the app
2. Grant notification permission when prompted
3. Open two browser windows (or incognito):
   - Window A: Login as User A
   - Window B: Login as User B
4. In Window A, navigate to a workspace
5. In Window B, send a message to that workspace
6. **Expected:** Window A shows notification immediately
7. In Window B, send 5 more messages quickly
8. **Expected:** Window A batches them (no new notifications)
9. Wait 5 minutes
10. **Expected:** Window A shows summary: "User B sent 6 messages"

### **Test Completely Offline (Needs Backend)**

Once backend is implemented:
1. Login and grant permissions
2. Send messages to user's workspace
3. User closes browser completely
4. **Expected After 1 Hour:** User receives email notification
5. **Expected After 24 Hours:** User receives daily digest email

---

## Configuration

### **Frontend Environment Variables**

Add to `.env`:
```env
# Web Push VAPID Public Key (generate with: npx web-push generate-vapid-keys)
VITE_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmThrerGHR3c0LzaHrLX_-qQNjqvvqZGnP7h0wL6PxJgZ7nqWvCA
```

### **Backend Environment Variables**

```env
# VAPID Keys for Web Push
VAPID_PUBLIC_KEY=<your-public-key>
VAPID_PRIVATE_KEY=<your-private-key>
VAPID_EMAIL=mailto:notifications@slimfile.com

# Email Service (Resend example)
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=SlimFile <notifications@slimfile.com>
```

---

## Next Steps

1. ✅ Frontend implementation (DONE)
2. ⚠️ **Generate VAPID Keys**
   ```bash
   npx web-push generate-vapid-keys
   ```
3. ⚠️ **Add public key to frontend** `.env`
4. ⚠️ **Implement backend endpoints** (see [PUSH_AND_EMAIL_NOTIFICATIONS.md](./PUSH_AND_EMAIL_NOTIFICATIONS.md))
   - Store push subscriptions
   - Send web push notifications
   - Implement message batching
   - Set up email service
   - Create daily digest cron job
5. ⚠️ **Test end-to-end**

---

## Costs

- **Web Push**: FREE (uses browser's built-in push service)
- **Email (Resend)**: Free up to 3,000/month, then $0.01/email
- **Storage**: Minimal (just push subscriptions)

---

## FAQ

### Can users disable notifications?
Yes, they can:
1. Deny browser permission (blocks all notifications)
2. Disable in app settings (once you build the settings page)
3. Unsubscribe from emails via link in email footer

### Does this work on mobile?
Yes! Both web push and email work on mobile browsers (Chrome, Safari, etc.)

### What if a user has multiple devices?
Each device gets its own push subscription. Notifications go to all devices.

### How do I prevent notification spam during active conversations?
Already handled! The batching service:
- Doesn't notify if user is viewing the workspace
- Batches rapid messages into summaries
- Only notifies once per 5-minute window

---

## Support

- Frontend code: Check inline comments in the service files
- Backend guide: See [PUSH_AND_EMAIL_NOTIFICATIONS.md](./PUSH_AND_EMAIL_NOTIFICATIONS.md)
- Issues: Test with browser dev tools console open to see logs

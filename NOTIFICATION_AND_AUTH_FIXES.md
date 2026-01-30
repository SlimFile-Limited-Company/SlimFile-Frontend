# Frontend Notification & Authentication Fixes

## Summary of Changes

This document outlines all the changes made to fix two critical issues:
1. **No notifications for offline users** - Users didn't know they had new messages when they returned to the app
2. **Token expiration errors** - Existing users with expired tokens got errors instead of being logged out

---

## Problem 1: No Notifications for Offline Users

### Issue
- Users only saw notifications while the app was open
- When users closed the app and returned later, they had no idea if new messages were waiting
- Socket connection dies when app closes, so no real-time updates

### Solution Implemented

#### Frontend Changes

1. **Added Unread Message Check** ([socketService.ts:492-536](e:\SlimFile\SlimFile-Frontend\src\services\socketService.ts#L492-L536))
   - New function `checkUnreadMessages()` that calls backend API
   - Gets total unread count and breakdown by workspace
   - Shows browser notification if there are unread messages
   - Example: "You have 5 unread messages in 2 workspaces"

2. **Check on App Load** ([socketService.ts:556](e:\SlimFile\SlimFile-Frontend\src\services\socketService.ts#L556))
   - Automatically checks for unread messages when user opens the app
   - Also checks when socket reconnects after disconnection

3. **Added API Function** ([workspaceService.ts:465-488](e:\SlimFile\SlimFile-Frontend\src\services\workspaceService.ts#L465-L488))
   - New `getUnreadMessageCounts()` function
   - Calls `GET /api/workspaces/unread-counts`
   - Handles 404 gracefully (if backend endpoint doesn't exist yet)

#### Backend Requirements (To Be Implemented)

Create a new endpoint:
```
GET /api/workspaces/unread-counts
```

See [BACKEND_REQUIREMENTS.md](./BACKEND_REQUIREMENTS.md#1-unread-message-counts-api) for full details.

---

## Problem 2: Token Expiration Errors

### Issue
- JWT tokens expire on the backend (typically after 7 days)
- Frontend never checked if token was expired
- Users got confusing 401 errors when making API calls
- No automatic logout when session expired

### Solution Implemented

#### Frontend Changes

1. **Enhanced Auth Utility** ([auth.ts:3-100](e:\SlimFile\SlimFile-Frontend\src\lib\auth.ts#L3-L100))
   - Added `getToken()`, `setToken()`, `clearToken()` functions
   - Added `isTokenExpired()` - decodes JWT and checks exp field
   - Added `validateToken()` - checks if token is valid before API calls
   - Added `handleAuthError()` - shows message and logs out user

2. **Created API Client** ([utils/apiClient.ts](e:\SlimFile\SlimFile-Frontend\src\utils\apiClient.ts))
   - New centralized API wrapper around `fetch`
   - Automatically adds Authorization header
   - Checks token expiration before each request
   - Intercepts 401 errors globally and auto-logs out
   - Provides convenience methods: `apiGet`, `apiPost`, `apiPatch`, `apiDelete`

3. **Token Validation on App Mount** ([App.tsx:14-18](e:\SlimFile\SlimFile-Frontend\src\App.tsx#L14-L18))
   - Validates token when app loads
   - Auto-logs out if token is expired (before making any API calls)

#### How It Works

**Before (Old Flow):**
```
User opens app → Makes API call → Token expired → 401 error → User confused
```

**After (New Flow):**
```
User opens app → Token checked → Expired? → Auto logout → Redirect to login → Clear message: "Session expired"
```

#### Backend Requirements

Your backend should already:
1. Set proper JWT expiration (7-30 days recommended)
2. Return 401 status for expired tokens
3. Include clear error messages

No backend changes required unless you want to implement refresh tokens (optional, see [BACKEND_REQUIREMENTS.md](./BACKEND_REQUIREMENTS.md#2-token-expiration-handling)).

---

## Files Changed

### New Files
- `src/utils/apiClient.ts` - Centralized API client with auth error handling
- `BACKEND_REQUIREMENTS.md` - Backend implementation guide
- `NOTIFICATION_AND_AUTH_FIXES.md` - This file

### Modified Files
- `src/lib/auth.ts` - Enhanced authentication utilities
- `src/services/socketService.ts` - Added unread message checking
- `src/services/workspaceService.ts` - Added `getUnreadMessageCounts()` function
- `src/App.tsx` - Added token validation on mount

---

## Usage Examples

### Using the New API Client

Instead of plain `fetch`:
```typescript
// Old way (no error handling)
const response = await fetch(`${API_BASE_URL}/workspaces`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json'
  }
});
```

Use the new API client:
```typescript
import { apiGet } from '@/utils/apiClient';

// New way (automatic error handling, token validation)
const data = await apiGet('/workspaces');
```

### Manually Validating Token

```typescript
import { validateToken } from '@/lib/auth';

if (validateToken()) {
  // Token is valid, safe to proceed
  doSomething();
} else {
  // User will be auto-logged out
}
```

### Checking for Unread Messages

```typescript
import { checkUnreadMessages } from '@/services/socketService';

// Manually trigger unread message check
await checkUnreadMessages();
```

---

## Testing

### Test Token Expiration
1. Login to the app
2. In browser console:
   ```javascript
   // Set an expired token (exp in the past)
   localStorage.setItem('jwt', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjF9.fake')
   ```
3. Refresh the page
4. Should see alert: "Your session has expired. Please log in again."
5. Should be redirected to login page

### Test Unread Messages (Once Backend Implemented)
1. Login as User A, send messages in a workspace
2. Login as User B (in a different browser/incognito)
3. Don't open the workspace (don't read messages)
4. Close the app completely
5. Reopen the app
6. Should see notification: "You have X unread messages in Y workspaces"
7. Click notification → should go to workspace
8. Mark messages as read
9. Close and reopen app
10. Should NOT see notification (no unread messages)

---

## Benefits

### For Users
- ✅ Know immediately if they have new messages when they return to the app
- ✅ No more confusing 401 errors
- ✅ Clear messaging when session expires
- ✅ Seamless auto-logout experience

### For Developers
- ✅ Centralized API error handling
- ✅ Automatic token validation
- ✅ Cleaner API calls with `apiGet`, `apiPost`, etc.
- ✅ Better debugging with console logs for auth issues

---

## Future Enhancements (Optional)

1. **Push Notifications for Completely Offline Users**
   - Use Service Worker push notifications
   - Requires backend push notification server (Web Push protocol)
   - See `src/services/pushNotificationService.ts` for existing infrastructure

2. **Refresh Token Flow**
   - Implement token refresh to avoid forcing users to re-login every 7 days
   - Backend needs to support refresh tokens
   - Frontend API client can be enhanced to auto-refresh expired tokens

3. **In-App Notification Center**
   - Show unread message badge in header
   - Dropdown with list of unread messages
   - Mark as read without opening workspace

4. **Email Notifications**
   - Send email digest if user hasn't opened app in 24 hours with unread messages
   - Requires backend email service

---

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify JWT token in localStorage: `localStorage.getItem('jwt')`
3. Check if backend endpoints are implemented (see [BACKEND_REQUIREMENTS.md](./BACKEND_REQUIREMENTS.md))
4. Verify notification permissions: `Notification.permission` should be `"granted"`

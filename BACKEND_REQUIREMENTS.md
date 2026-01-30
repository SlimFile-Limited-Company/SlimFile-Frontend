# Backend Requirements for Notification & Auth Fixes

This document outlines the backend API endpoints needed to support the new frontend notification and authentication features.

## 1. Unread Message Counts API

The frontend now checks for unread messages when users open the app. You need to implement this endpoint:

### Endpoint
```
GET /api/workspaces/unread-counts
```

### Headers
```
Authorization: Bearer <jwt_token>
```

### Response Format
```json
{
  "total": 15,
  "byWorkspace": [
    {
      "workspaceId": "workspace123",
      "workspaceName": "Team Project",
      "count": 10
    },
    {
      "workspaceId": "workspace456",
      "workspaceName": "Personal Space",
      "count": 5
    }
  ]
}
```

### Logic
1. Get the authenticated user from the JWT token
2. Find all workspaces the user is a member of
3. For each workspace, count messages where:
   - `createdAt` is after the user last read the workspace (or joined the workspace)
   - OR the message is not in the user's `readBy` array
4. Return the total count and breakdown by workspace

### Implementation Notes
- This should be a fast query (add database indexes on `workspaceId` and `readBy`)
- Cache the results for 30 seconds to avoid overloading the database
- Consider tracking "last read timestamp" per user per workspace for better performance

---

## 2. Token Expiration Handling

The frontend now validates JWT tokens and auto-logs out expired sessions.

### Current Backend Behavior
Make sure your backend:
1. **Sets proper JWT expiration** - Recommended: 7 days for web apps, 30 days for mobile
2. **Returns 401 status** for expired or invalid tokens
3. **Includes clear error messages** like:
   ```json
   {
     "error": "Token expired",
     "message": "Your session has expired. Please log in again."
   }
   ```

### Recommended Enhancement: Refresh Token Flow (Optional)

If you want to implement token refresh (so users don't get logged out after 7 days):

1. **On login, return both tokens:**
   ```json
   {
     "token": "short-lived-jwt-token",
     "refreshToken": "long-lived-refresh-token"
   }
   ```

2. **Add refresh endpoint:**
   ```
   POST /api/auth/refresh
   Body: { "refreshToken": "..." }
   Response: { "token": "new-jwt-token" }
   ```

3. **Frontend will use this** when the access token expires (future enhancement)

---

## 3. Message Tracking Improvements

To support unread counts, ensure your message schema tracks:

```javascript
{
  _id: ObjectId,
  workspaceId: ObjectId,
  senderId: ObjectId,
  text: String,
  deliveredTo: [ObjectId], // Array of user IDs who received the message
  readBy: [ObjectId],      // Array of user IDs who read the message
  createdAt: Date,
  updatedAt: Date
}
```

### Endpoint to Update (if needed)
```
POST /api/workspaces/:workspaceId/messages/:messageId/delivered
POST /api/workspaces/:workspaceId/messages/:messageId/read
```

These endpoints should:
1. Add the authenticated user's ID to the respective array
2. Broadcast socket event to update message status in real-time

---

## 4. Database Indexes for Performance

Add these indexes to improve query performance:

```javascript
// Messages collection
db.messages.createIndex({ workspaceId: 1, createdAt: -1 });
db.messages.createIndex({ readBy: 1 });
db.messages.createIndex({ workspaceId: 1, readBy: 1 });

// Workspace members collection (if separate)
db.workspaceMembers.createIndex({ userId: 1 });
db.workspaceMembers.createIndex({ workspaceId: 1, userId: 1 });
```

---

## Testing Checklist

### Unread Messages
- [ ] Create a workspace and send messages
- [ ] Close the app (without reading messages)
- [ ] Reopen the app - should see notification with unread count
- [ ] Mark messages as read
- [ ] Reopen the app - should NOT see notification

### Token Expiration
- [ ] Manually expire a token (set exp to past time)
- [ ] Try to access a protected route
- [ ] Should be auto-logged out with a message
- [ ] Login again - should work normally

### Performance
- [ ] Test with 100+ workspaces - unread count should return in < 500ms
- [ ] Test with 10,000+ messages - should still be fast

---

## Implementation Priority

1. **High Priority** (breaks current functionality):
   - Token expiration handling (401 responses)
   - Unread message counts endpoint

2. **Medium Priority** (improves UX):
   - Database indexes for performance
   - Caching for unread counts

3. **Low Priority** (nice to have):
   - Refresh token flow
   - Advanced read tracking

---

## Questions?

If you have questions about implementing these endpoints, check:
- Frontend code: `src/services/workspaceService.ts` (line 462+)
- Socket handling: `src/services/socketService.ts` (line 492+)
- Auth handling: `src/lib/auth.ts`

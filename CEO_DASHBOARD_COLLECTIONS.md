# CEO Dashboard - Database Collections

**Last Updated:** 2026-09-01

---

## 📊 Collections to Include in CEO Dashboard

### **Core Metrics:**
1. **users** - 3,400 registered users (Web App)
2. **compressionhistories** - 9,100 file compressions (Web App)
3. **guestactivities** - 1,000 guest user actions (Web App)
4. **stats** - 1 global statistics document (Web App)

### **Customer Feedback:**
5. **reviews** - 268 user reviews (Web App)

### **B2B & API:**
6. **b2bapikeys** - B2B customer API keys (Web App)
7. **apikeys** - 1,000 API keys (Web App)
8. **free-api** - 1,000 free API users (Web App)

### **Engagement:**
9. **pwainstalls** - 41 PWA installations (Web App)
10. **notifications** - 15,500 notifications sent (Web App)

### **Security & Monitoring:**
11. **securityaccesses** - 1 security access log (Web App)
12. **securityevents** - 3 security events (Web App)

### **Mobile App:**
13. **SlimFile App** - 36 documents (Mobile App data)

---

## 📝 Notes:
- **SlimFile App collection** = Mobile app data
- **All other collections** = Web app data
- Total collections in database: 42
- Collections selected for dashboard: 13

---

## 📈 Google Analytics Integration

### **Live Analytics Dashboard (Google Data Studio/Looker Studio)**
- **URL:** `https://datastudio.google.com/embed/reporting/336ae76d-a21e-493c-b697-d936274fcb5a/page/kIV1C`
- **Type:** Embedded iframe from Google Data Studio
- **Previously:** Had a button in Home.tsx (now removed)
- **Purpose:** Real-time website analytics from Google Analytics
- **Data Includes:**
  - Traffic sources
  - User behavior
  - Page views
  - Geographic distribution
  - Device/browser breakdown
  - Real-time active users

### **Implementation Notes:**
```jsx
// Analytics Modal (previously in Home.tsx lines 997-1041)
const [analyticsOpen, setAnalyticsOpen] = useState(false);

<iframe
  src="https://datastudio.google.com/embed/reporting/336ae76d-a21e-493c-b697-d936274fcb5a/page/kIV1C"
  frameBorder="0"
  style={{ border: 0, minWidth: "800px", width: "100%", height: "100%" }}
  allowFullScreen
  sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
/>
```

---

---

## 🎨 CEO Dashboard Design Requirements

### **Technical Requirements:**
- ✅ **Real-time data** from database collections
- ✅ **Strictly internal** - Secure access only (admin authentication)
- ✅ **Dedicated page** - Separate route (e.g., `/ceo-dashboard` or `/internal-analytics`)
- ✅ **No header/footer** - Clean, full-screen dashboard interface
- ✅ **Standalone layout** - Independent of main app layout

### **Visual Design:**
- 🎨 **Color Scheme:**
  - Primary: **Red** (matching SlimFile branding)
  - Secondary: **White** (clean backgrounds)
  - Accent: **Purple** (highlights, gradients)
  - Use existing app color palette for consistency

### **Data Visualization:**
- 📊 **Graphs & Charts:**
  - Line charts (trends over time)
  - Bar charts (comparisons)
  - Pie charts (distributions)
  - Stat cards (KPIs)
  - Real-time counters

### **Filters:**
- 📅 Time range filters:
  - Today
  - Yesterday
  - Last 7 days
  - Last 30 days
  - This month
  - Last month
  - All time
  - Custom date range

---

## 🔌 External Integrations (To Add)

### **Google AdSense API** 💰
- **Status:** ⏳ Pending approval (1-2 weeks)
- **Add after:** AdSense account approved
- **Data to show:**
  - Daily/monthly earnings
  - Impressions, clicks, CTR
  - RPM, page RPM
  - Earnings by country/device

### **Google Search Console API** 🔍
- **Status:** ✅ Available now
- **Can integrate:** YES
- **Data to show:**
  - Top search queries
  - Clicks, impressions, CTR
  - Average position in Google
  - Index coverage
  - Top performing pages
  - Mobile usability

---

---

## 🔌 Existing Backend Endpoints (Read-Only Reference)

### **1. users (3,400 users)**
```
POST   /api/auth/google           - Google Sign-In (Web)
POST   /api/auth/register          - Mobile app registration
POST   /api/auth/login             - Mobile app login
POST   /api/auth/signup            - Desktop signup
POST   /api/auth/signin            - Desktop signin
POST   /api/auth/forgot-password   - Password reset
```

### **2. compressionhistories (9,100 compressions)**
```
GET    /api/dashboard/stats        - User compression stats
GET    /api/dashboard/recent       - Recent compressions
GET    /api/dashboard/history      - Compression history with pagination
GET    /api/leaderboard            - Top compressors
```

### **3. guestactivities (1,000 guest actions)**
```
POST   /api/guest-activity/                    - Record guest action
GET    /api/guest-activity/:guestId            - Get guest data
POST   /api/guest-activity/:guestId/review     - Guest review
GET    /api/guest-activity/stats/summary       - Guest statistics
```

### **4. reviews (268 reviews)**
```
POST   /api/reviews/               - Create review
GET    /api/reviews/               - Get all reviews
GET    /api/reviews/stats          - Review statistics
POST   /api/reviews/replies        - Reply to review
DELETE /api/reviews/:id            - Delete review
```

### **5. b2bapikeys (1 B2B customer)**
```
POST   /api/b2b-api-keys/generate            - Generate B2B API key
GET    /api/b2b-api-keys/                    - List all keys
GET    /api/b2b-api-keys/:id                 - Get one key
PUT    /api/b2b-api-keys/:id/revoke          - Revoke key
PUT    /api/b2b-api-keys/:id/activate        - Activate key
DELETE /api/b2b-api-keys/:id                 - Delete key
```

### **6-7. apikeys (1,000) & free-api (1,000)**
```
(To be located - likely in admin or separate API management routes)
```

### **8. pwainstalls (41 installs)**
```
POST   /api/pwa-installs/          - Record PWA installation
GET    /api/pwa-installs/stats     - PWA installation statistics
```

### **9. notifications (15,500 notifications)**
```
GET    /api/dashboard/notifications            - Get user notifications
GET    /api/dashboard/notifications/unread     - Unread count
PUT    /api/dashboard/notifications/read-all   - Mark all as read
PUT    /api/dashboard/notifications/:id/read   - Mark one as read
```

### **10. stats (1 global document)**
```
(Global statistics - likely accessed via leaderboard or analytics)
```

### **11-12. securityaccesses (1) & securityevents (3)**
```
POST   /api/security/authenticate        - Security authentication
POST   /api/security/track-session       - Track active session
POST   /api/security/log-event           - Log security event
GET    /api/security/dashboard-stats     - Security statistics
GET    /api/security/ip-lookup/:ip       - IP lookup
POST   /api/security/block-ip            - Block IP address
```

### **13. SlimFile App (36 mobile users)**
**Collection:** `SlimFile App` = MobileUser model
```
// Authentication
POST   /api/auth/register          - Mobile app registration
POST   /api/auth/login             - Mobile app login
POST   /api/auth/forgot-password   - Password reset request
POST   /api/auth/reset-password    - Set new password

// Mobile Features
GET    /api/mobile/version         - App version check
POST   /api/mobile/history         - Save mobile compression
GET    /api/mobile/history         - Get mobile compression history
GET    /api/mobile/stats           - Mobile user statistics
POST   /api/mobile/notify-update   - Notify about app updates
POST   /api/mobile/test-notification - Test push notifications
```

---

## 🆕 New CEO Dashboard Endpoints (To Be Created)

These will be **admin-only** endpoints that aggregate data across ALL users:

```
GET /api/ceo-dashboard/overview              - Total stats (users, compressions, revenue)
GET /api/ceo-dashboard/users-analytics       - User growth & demographics
GET /api/ceo-dashboard/compression-analytics - Compression trends & file types
GET /api/ceo-dashboard/revenue               - B2B, API usage & revenue
GET /api/ceo-dashboard/engagement            - PWA, reviews, guest activity
GET /api/ceo-dashboard/security              - Security events & accesses
GET /api/ceo-dashboard/mobile-stats          - Mobile app usage

// All endpoints support date filters: ?period=7d|30d|all
```

---

## ⏳ Status:
✅ Collections documented (13 collections)
✅ Google Analytics integration added
✅ Dashboard design requirements documented
✅ Filter requirements noted
✅ External integrations identified
✅ Existing endpoints documented
✅ Search Console OAuth credentials created
⏳ Search Console API integration pending
⏳ CEO Dashboard endpoints creation pending
⏳ CEO Dashboard frontend implementation pending

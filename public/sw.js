const CACHE_NAME = 'slimfile-v2';

// ─── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(['/']).catch(() => {}))
  );
});

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => clients.claim())
  );
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
// Only cache GET requests for non-API, non-socket URLs.
// API calls MUST bypass the cache so push subscriptions are always registered.
self.addEventListener('fetch', event => {
  const url = event.request.url;
  const isApi    = url.includes('/api/') || url.includes('/socket.io');
  const isGet    = event.request.method === 'GET';
  const isOpaque = !url.startsWith(self.location.origin);   // cross-origin (CDN etc.)

  if (!isGet || isApi || isOpaque) {
    // Pass straight through — no caching
    return;
  }

  // Network-first for same-origin GET (page navigations / static assets)
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// ─── Push ─────────────────────────────────────────────────────────────────────
self.addEventListener('push', event => {
  console.log('[SW Push] Push event received');
  let data = {
    title: 'SlimFile',
    body:  'You have a new notification',
    icon:  '/logo.gif',
    data:  {},
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
      console.log('[SW Push] Data parsed:', JSON.stringify(data));
    } catch (e) {
      console.error('[SW Push] Failed to parse push data:', e);
    }
  } else {
    console.log('[SW Push] No event.data');
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      console.log('[SW Push] Clients found:', clientList.length);
      clientList.forEach(client =>
        client.postMessage({ type: 'PUSH_RECEIVED', payload: data })
      );

      console.log('[SW Push] Calling showNotification...');
      return self.registration.showNotification(data.title, {
        body:             data.body,
        icon:             data.icon || '/logo.gif',
        badge:            '/logo.gif',
        tag:              data.tag || 'slimfile-push',
        vibrate:          [200, 100, 200],
        data:             data.data || {},
        requireInteraction: false,
        actions: [
          { action: 'open',  title: 'View' },
          { action: 'close', title: 'Dismiss' },
        ],
      }).then(() => {
        console.log('[SW Push] showNotification resolved OK');
      }).catch(err => {
        console.error('[SW Push] showNotification FAILED:', err);
      });
    }).catch(err => {
      console.error('[SW Push] clients.matchAll FAILED:', err);
    })
  );
});

// ─── Notification click ───────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'close') return;

  const urlToOpen = event.notification.data?.url || '/messages';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Focus and navigate an existing tab if possible
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          if ('navigate' in client) client.navigate(self.location.origin + urlToOpen);
          return;
        }
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});

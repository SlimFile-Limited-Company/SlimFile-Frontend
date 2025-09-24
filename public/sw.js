const CACHE_NAME = 'slimfile-v1';
const urlsToCache = [
  '/',
  '/compress',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/lovable-uploads/c546f9d9-6a8d-44c6-ac8a-fe1a572902a8.png',
  '/pdf.worker.min.js'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).catch(() => {
          // Fallback response for failed fetch
          return new Response('Network error occurred', { status: 408 });
        });
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 

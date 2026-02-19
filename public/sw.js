const CACHE_NAME = 'monocle-v1';

const PRECACHE_URLS = [
    '/',
    '/icon-192.png',
    '/icon-512.png',
    '/manifest.json'
];

// Install Event
self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
    );
});

// Activate Event
self.addEventListener('activate', (event: any) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Event
self.addEventListener('fetch', (event: any) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

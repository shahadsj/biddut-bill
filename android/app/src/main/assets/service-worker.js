const CACHE_NAME = 'electricity-bill-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/auth.js',
    '/js/dashboard.js',
    '/js/meters.js',
    '/js/transactions.js',
    '/js/calculator.js',
    '/js/reports.js',
    '/js/analytics.js',
    '/js/settings.js',
    '/js/backup.js',
    '/js/admin.js',
    '/js/profile.js',
    '/js/utils.js',
    '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('Caching app shell');
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch Strategy: Cache First, then Network
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // Return cached version or fetch from network
            return response || fetch(event.request).then(function(fetchResponse) {
                // Cache new requests for future offline use
                if (event.request.method === 'GET') {
                    const responseClone = fetchResponse.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseClone);
                    });
                }
                return fetchResponse;
            });
        }).catch(function() {
            // Offline fallback
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        })
    );
});

// Activate: Clean old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(name) {
                    return name !== CACHE_NAME;
                }).map(function(name) {
                    console.log('Deleting old cache:', name);
                    return caches.delete(name);
                })
            );
        })
    );
});
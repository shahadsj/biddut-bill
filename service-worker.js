const CACHE_NAME = 'electricity-bill-v3';  // v2 থেকে v3 করে দিলাম

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
    '/js/firebase-init.js',
    '/manifest.json',
    '/favicon.svg'
];

// ===== Install Service Worker =====
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('📦 Caching app shell');
            return cache.addAll(ASSETS).catch(function(err) {
                console.warn('Some assets failed to cache:', err);
            });
        })
    );
    // নতুন SW instal হলে activate হওয়ার জন্য
    self.skipWaiting();
});

// ===== Fetch Strategy =====
self.addEventListener('fetch', function(event) {
    // CDN ফাইলগুলো নেটওয়ার্ক থেকে fetch করবে, ক্যাশে করবে না
    if (event.request.url.includes('cdn.jsdelivr.net') || 
        event.request.url.includes('googleapis.com') ||
        event.request.url.includes('firebase') ||
        event.request.url.includes('gstatic.com')) {
        event.respondWith(
            fetch(event.request).catch(function() {
                // CDN না পেলে offline fallback
                return new Response('Offline', { status: 503 });
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(response) {
            // ক্যাশে থাকলে ক্যাশে থেকে দিন
            if (response) {
                return response;
            }
            
            // ক্যাশে না থাকলে নেটওয়ার্ক থেকে fetch করুন
            return fetch(event.request).then(function(fetchResponse) {
                // GET request এবং HTML/JS/CSS ফাইল ক্যাশে করুন
                if (event.request.method === 'GET' && 
                    (event.request.url.includes('.js') || 
                     event.request.url.includes('.css') || 
                     event.request.url.includes('.html'))) {
                    const responseClone = fetchResponse.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseClone);
                    });
                }
                return fetchResponse;
            }).catch(function() {
                // Offline fallback
                return new Response('Offline - Please check your connection', { 
                    status: 503,
                    headers: { 'Content-Type': 'text/plain' }
                });
            });
        })
    );
});

// ===== Activate: Clean old caches =====
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(name) {
                    return name !== CACHE_NAME;
                }).map(function(name) {
                    console.log('🗑️ Deleting old cache:', name);
                    return caches.delete(name);
                })
            );
        }).then(function() {
            // নতুন SW ক্লায়েন্টদের কন্ট্রোল নিতে
            return self.clients.claim();
        })
    );
});

// ===== Push Notification (optional) =====
self.addEventListener('push', function(event) {
    if (!event.data) return;
    
    var data = event.data.json();
    var options = {
        body: data.body || 'Electricity Bill Update',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Biddut Bill', options)
    );
});

// ===== Notification Click =====
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    var url = event.notification.data.url || '/';
    event.waitUntil(
        clients.openWindow(url)
    );
});
// ==================== SERVICE WORKER ====================
// Biddut Bill - PWA Service Worker
// Version: 2.0.0

const CACHE_NAME = 'biddut-bill-v2.0.0';
const OFFLINE_URL = '/index.html';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
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
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js'
];

// ==================== INSTALL ====================
self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
      .catch(function(error) {
        console.error('[ServiceWorker] Install failed:', error);
      })
  );
});

// ==================== ACTIVATE ====================
self.addEventListener('activate', function(event) {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache:', key);
          return caches.delete(key);
        }
      }));
    })
    .then(function() {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// ==================== FETCH ====================
self.addEventListener('fetch', function(event) {
  console.log('[ServiceWorker] Fetch:', event.request.url);
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('[ServiceWorker] Cache hit:', event.request.url);
          return response;
        }
        
        console.log('[ServiceWorker] Cache miss, fetching:', event.request.url);
        
        // Clone the request
        var fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(function(response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            var responseToCache = response.clone();
            
            // Cache the fetched response
            caches.open(CACHE_NAME)
              .then(function(cache) {
                try {
                  cache.put(event.request, responseToCache);
                  console.log('[ServiceWorker] Cached:', event.request.url);
                } catch (e) {
                  console.warn('[ServiceWorker] Cache put failed:', e);
                }
              });
            
            return response;
          })
          .catch(function(error) {
            console.error('[ServiceWorker] Fetch failed:', error);
            
            // If offline, return the offline page
            return caches.match(OFFLINE_URL);
          });
      })
  );
});

// ==================== MESSAGE HANDLING ====================
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ==================== PUSH NOTIFICATION ====================
self.addEventListener('push', function(event) {
  console.log('[ServiceWorker] Push Received');
  
  var title = 'বিদ্যুৎ বিল';
  var options = {
    body: event.data ? event.data.text() : 'আপনার বিল আপডেট হয়েছে!',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'খুলুন'
      },
      {
        action: 'close',
        title: 'বন্ধ করুন'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ==================== NOTIFICATION CLICK ====================
self.addEventListener('notificationclick', function(event) {
  console.log('[ServiceWorker] Notification click Received.');
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
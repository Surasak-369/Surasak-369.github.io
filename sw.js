const CACHE_NAME = 'pem3-cache-v3'; // เปลี่ยนชื่อเวอร์ชันเพื่อบังคับอัปเดต
const ASSETS_TO_CACHE = [
  'https://github.io',
  'https://github.ioindex.html',
  'https://github.iomanifest.json',
  'https://github.iopem3-192.png',
  'https://github.iopem3-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

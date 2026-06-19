const CACHE = 'pet-tracker-v2';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // ไม่ cache API calls
  if (e.request.url.includes('script.google.com')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => {}))
  );
});

// Keep alive — ป้องกัน iOS kill background
self.addEventListener('message', e => {
  if (e.data === 'keepalive') {
    // ตอบกลับเพื่อให้ SW ยังทำงานอยู่
    e.source && e.source.postMessage('alive');
  }
});

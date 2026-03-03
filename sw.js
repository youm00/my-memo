const CACHE_NAME = 'gist-memo-v6';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json'
];

// install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// activate
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// fetch
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // GitHub APIはキャッシュしない
  if (url.hostname.includes('api.github.com')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
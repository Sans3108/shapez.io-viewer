const staticShapeViewer = 'shape-viewer-site-v1';
const assets = ['/', '/index.html', '/index.css', '/index.js', '/logo.png', '/favicon.ico'];

self.addEventListener('install', installEvent => {
  installEvent.waitUntil(
    caches.open(staticShapeViewer).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});

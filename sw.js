const CACHE_NAME = 'v2';
const CACHE_URLs = [
  '/lionel.medini/cercle/',
  '/lionel.medini/cercle/index.html',
  '/lionel.medini/cercle/css/style.css',
  '/lionel.medini/cercle/js/app.js',
  'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css',
  'https://code.jquery.com/jquery-3.4.1.min.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
    .open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(CACHE_URLs);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
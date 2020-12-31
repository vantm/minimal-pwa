const APP_VERSION = '1.42';
const CACHE_NAME = 'static-v' + APP_VERSION;

const precaching = [
  '/',
  '/index.html',
  '/index.js',
  '/manifest.json',
  '/static/icon.svg',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css'
];

function isPage(request) {
  if (request.mode !== 'navigate') {
    return false;
  }

  if (request.destination !== 'document') {
    return false;
  }

  if (!/\/[\w\-]*\/?$/gi.test(request.url)) {
    return false;
  }

  return true;
}

self.addEventListener('install', function (event) {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(precaching);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then(function (cacheNames) {
        const staleCacheNames = cacheNames.filter((x) => x !== CACHE_NAME);
        staleCacheNames.forEach(function (cacheName) {
          caches.delete(cacheName);
        });
      })
    ]).then(function () {
      return clients.matchAll().then(function (clientList) {
        clientList.forEach(function (client) {
          client.postMessage({ type: 'installed', version: APP_VERSION });
        });
      });
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (isPage(event.request)) {
    event.respondWith(caches.match('/'));
  } else {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
  }
});

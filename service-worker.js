var precaching = [
  '/',
  '/index.html',
  '/index.js',
  '/manifest.json',
  '/static/icon.svg'
];

function isPage(request) {
  if (request.mode === 'navigate' && /\/[\w\-]+$/gi.test(request.url)) {
    return true;
  }

  return false;
}

self.addEventListener('install', function (event) {
  self.skipWaiting();

  event.waitUntil(
    caches.open('static').then(function (cache) {
      console.log('[sw] precaching resources ...');
      return cache.addAll(precaching).then(function () {
        console.log('[sw] resources had been precached!');
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

function postSWRegistration(sw) {}

function registerSW() {
  console.log('Installing service worker ...');

  navigator.serviceWorker
    .register('/service-worker.js')
    .then(function (sw) {
      console.log('Service worker had been installed!');
      return sw;
    })
    .then(postSWRegistration)
    .catch(function (err) {
      console.log('ServiceWorker registration failed: ', err);
    });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', registerSW);
}

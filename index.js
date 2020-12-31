function registerNotification(sw) {
  navigator.serviceWorker.onmessage = function (event) {
    if (event.data?.type === 'installed') {
      new Notification(
        "🎉 Your app've updated. Please refresh by click reload button to update new version"
      );

      var btnUpdateVersion = document.getElementById('btn-update-version');
      var toastUpdateVersion = document.getElementById('toast-update-version');
      var textVersion = document.getElementById('version-text');

      btnUpdateVersion.onclick = function () {
        window.location.reload();
      };
      textVersion.innerText = '✨ New version ' + event.data.version;
      toastUpdateVersion.classList.add('show');
    }
  };
}

function postSWRegistration(sw) {
  var btnUpdate = document.getElementById('btn-update');

  btnUpdate.onclick = function () {
    sw.update();
  };

  var btnAskNotificationGrant = document.getElementById(
    'btn-ask-notification-grant'
  );

  btnAskNotificationGrant.onclick = function () {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      new Notification('🎉 Hooray!!! You was granted this permission.');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          new Notification('🎉 Hi there! The notification works.');
          registerNotification(sw);
        }
      });
    } else {
      alert('Notification was rejected! Turn on by change browser settings.');
    }
  };

  if (Notification.permission === 'granted') {
    registerNotification(sw);
  }
}

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

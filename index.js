function registerNotification(sw) {
  navigator.serviceWorker.onmessage = function (event) {
    if (event.data?.type === 'installed') {
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
  var btnAskNotificationGrant = document.getElementById(
    'btn-ask-notification-grant'
  );

  btnAskNotificationGrant.onclick = function () {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      new Notification('🎉 Hooray!!! You was granted this permission.');
    } else if (Notification.permission !== 'denied') {
      btnAskNotificationGrant.setAttribute('disabled', 'disabled');

      Notification.requestPermission()
        .then(function (permission) {
          if (permission === 'granted') {
            new Notification('🎉 Hi there! The notification works.');
            registerNotification(sw);
            document.getElementById('permission-div').classList.add('d-none');
          }
        })
        .finally(function () {
          btnAskNotificationGrant.removeAttribute('disabled');
        });
    } else {
      alert('Notification was rejected! Turn on by change browser settings.');
    }
  };

  if (Notification.permission === 'granted') {
    registerNotification(sw);
  } else {
    document.getElementById('permission-div').classList.remove('d-none');
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

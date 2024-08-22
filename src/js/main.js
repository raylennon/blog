// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import 'bootstrap/js/dist/modal';

import {  Toast } from 'bootstrap';

// import 'bootstrap/js/dist/navbar';

const toastTriggers = document.querySelectorAll('[id^="toast"]');
const toastLiveExample = document.getElementById('ToastNotif');

if (toastTriggers.length > 0) {
//   console.log("Toast triggered...");
  const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample);
//   navigator.clipboard.writeText(window.location.href);
  toastTriggers.forEach(toastTrigger => {
    toastTrigger.addEventListener('click', () => {
      toastBootstrap.show();
    });
  });
}
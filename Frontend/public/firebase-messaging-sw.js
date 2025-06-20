importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyCYxFdQLiQwh-s8r-3d1l-mmWEy1UWNSKw",
  authDomain: "bisiblvd-a4d68.firebaseapp.com",
  databaseURL: "https://bisiblvd-a4d68-default-rtdb.firebaseio.com",
  projectId: "bisiblvd-a4d68",
  storageBucket: "bisiblvd-a4d68.appspot.com",
  messagingSenderId: "106359115992",
  appId: "1:106359115992:web:fbc269dea108de146dc7ad",
  measurementId: "G-4CYCZW2E3M"
};
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

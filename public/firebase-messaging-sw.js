importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

const firebaseConfig = {
  apiKey: "AIzaSyDaoRQlGo6oghhkTmRIqrqEPWofr1BSm9E",
  authDomain: "webpushtest-c99b3.firebaseapp.com",
  projectId: "webpushtest-c99b3",
  storageBucket: "webpushtest-c99b3.appspot.com",
  messagingSenderId: "992191789757",
  appId: "1:992191789757:web:5c7cbed7fbfccf2355d5d4",
  measurementId: "G-N7SX341HTV",
}

const app = firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()


messaging.onBackgroundMessage(payload => {
  console.log("Message background received. ", payload)
  self.registration.showNotification("알림", {
    body: "블라블라",
    icon: "favicon.ico",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    tag: "vibration-sample",
  })
})


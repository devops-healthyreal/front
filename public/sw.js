self.addEventListener("install", function (event) {
  console.log("installed")
  self.skipWaiting()
})
self.addEventListener("activate", function (event) {
  console.log("activated")
  event.waitUntil(self.clients.claim())
})
self.addEventListener("push", function(event){
  self.registration.showNotification("알림", {
    body: "블라블라",
    icon: "favicon.ico",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    tag: "vibration-sample",
  })
})

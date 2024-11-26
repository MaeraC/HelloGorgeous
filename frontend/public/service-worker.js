
// Fichier public/service-worker.js
self.addEventListener('push', (event) => {
    const data = event.data.json()
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
      })
    )
})
  
  
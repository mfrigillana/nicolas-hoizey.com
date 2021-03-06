self.addEventListener('install', () => {
  // Skip over the "waiting" lifecycle state, to ensure that our
  // new service worker is activated immediately, even if there's
  // another tab open controlled by our older service worker code.
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  event
    .waitUntil(
      // Get the list of caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete each cache
            // https://mdn.io/cache+delete
            return caches.delete(cacheName)
          }),
        )
      }),
    )
    .then(() => {
      // Unregister the Service Worker
      self.registration.unregister().then(() => {
        // Get a list of all the current open windows/tabs controled
        // by the Service Worker and force them to reload.
        return self.clients.matchAll({ type: 'window' }).then(windowClients => {
          windowClients.forEach(windowClient => {
            if (windowClient.url && 'navigate' in windowClient) {
              windowClient.navigate(windowClient.url)
            }
          })
        })
      })
    })
})

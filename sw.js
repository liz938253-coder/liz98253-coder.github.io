const CACHE_NAME = "life-v1-cache";
const files = ['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(files)))
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    })
  )
})

self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))
})

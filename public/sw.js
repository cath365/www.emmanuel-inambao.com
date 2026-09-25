const CACHE_NAME = 'inambao-portfolio-v2'
const OFFLINE_URL = '/offline.html'

const PRECACHE_URLS = [
  OFFLINE_URL,
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Never cache dynamic portfolio data, Next.js image optimization,
  // application bundles, or admin/API requests. Let the browser/Next.js
  // always request the current production version.
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/_next/')
  ) {
    return
  }

  // For page navigation, always prefer the network and only use the
  // dedicated offline page when the visitor is actually offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const offlinePage = await caches.match(OFFLINE_URL)
        return offlinePage || new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
        })
      })
    )
  }
})

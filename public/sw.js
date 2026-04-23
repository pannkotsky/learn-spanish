/// <reference lib="webworker" />

// Bump this to invalidate previously cached responses on deploy.
const CACHE = 'learn-spanish-v1'
const OFFLINE_URL = '/offline.html'

// Static assets precached at install time so the offline page (and browser tab
// icon / home-screen launcher) still render when the network is gone.
const PRECACHE_ASSETS = [OFFLINE_URL, '/favicon.svg', '/favicon.ico']
const PRECACHED = new Set(PRECACHE_ASSETS)

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      await cache.addAll(PRECACHE_ASSETS.map((url) => new Request(url, { cache: 'reload' })))
    })(),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  const sameOrigin = url.origin === self.location.origin

  // Top-level navigations: network-first, fall back to the offline page.
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req)
        } catch {
          const cache = await caches.open(CACHE)
          const offline = await cache.match(OFFLINE_URL)
          return offline ?? Response.error()
        }
      })(),
    )
    return
  }

  // Precached static assets: cache-first so they keep working offline and on
  // the offline page. Refresh opportunistically from the network.
  if (sameOrigin && PRECACHED.has(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE)
        const cached = await cache.match(url.pathname)
        const networked = fetch(req)
          .then((resp) => {
            if (resp.ok) cache.put(url.pathname, resp.clone()).catch(() => {})
            return resp
          })
          .catch(() => cached)
        return cached ?? (await networked)
      })(),
    )
  }

  // Everything else (GraphQL, API, hashed build assets, third-party) passes
  // through untouched so SSR / auth / data fetches are never served stale.
})

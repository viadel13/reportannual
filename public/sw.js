const CACHE_NAME = "reportannual-cache-v1";
const OFFLINE_URL = "/offline.html";
const PRECACHE_URLS = [
    "/",
    OFFLINE_URL,
    "/manifest.webmanifest",
    "/favicon.ico",
    "/icon-192.png",
    "/icon-512.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const requestUrl = new URL(event.request.url);

    // Network-first strategy for navigation requests
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                    return response;
                })
                .catch(() =>
                    caches.match(event.request).then((cached) => cached || caches.match(OFFLINE_URL))
                )
        );
        return;
    }

    // Cache-first for core assets
    if (requestUrl.origin === self.location.origin) {
        const cacheFirstPaths = new Set([
            "/icon-192.png",
            "/icon-512.png",
            "/manifest.webmanifest",
            "/favicon.ico",
            OFFLINE_URL,
        ]);

        if (cacheFirstPaths.has(requestUrl.pathname)) {
            event.respondWith(
                caches.match(event.request).then((cached) => {
                    if (cached) return cached;
                    return fetch(event.request).then((response) => {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                        return response;
                    });
                })
            );
            return;
        }
    }

    // Fallback to cache on failure for other GET requests
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});

/**
 * E(CA)² · Service Worker Oficial (PWA Offline & Cache Instantâneo)
 * Centro Acadêmico de Engenharia de Controle e Automação — UERGS
 */

const CACHE_NAME = "eca2-uergs-pwa-v3";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./css/admin.css",
  "./js/app.js",
  "./js/config.js",
  "./js/content.js",
  "./js/store.js",
  "./js/modules/academic.js",
  "./js/modules/curso.js",
  "./js/modules/institucional.js",
  "./js/modules/comunidade.js",
  "./js/modules/shop.js",
  "./js/services/uergs-events.js",
  "./data/uergs_eventos_poa.json",
  "./img/favicon.svg",
  "./img/logo_option2_microchip.jpg",
  "./img/hero_estudantes.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(CORE_ASSETS.map((url) => cache.add(url)));
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Dados dinâmicos (.json): Estratégia Network-First com fallback para cache offline
  if (url.pathname.endsWith(".json")) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Ativos estáticos: Estratégia Stale-While-Revalidate para carregamento instantâneo
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

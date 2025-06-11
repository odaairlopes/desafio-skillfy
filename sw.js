const CACHE_NAME = "task-manager-v1";
const urlsToCache = [
  "/",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
];

// Instalar o Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache aberto");
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar requisições de rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - retorna resposta do cache
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Verifica se temos uma resposta válida
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // IMPORTANTE: Clona a resposta
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Ativar Service Worker e limpar caches antigos
self.addEventListener("activate", (event) => {
  const cacheWhitelist = ["task-manager-v1"];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

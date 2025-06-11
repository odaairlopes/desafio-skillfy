importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);

const { precacheAndRoute, cleanupOutdatedCaches } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst, NetworkFirst } = workbox.strategies;

// ✅ Corrigir o manifesto
precacheAndRoute(self.__WB_MANIFEST || []);

// Limpa caches antigos
cleanupOutdatedCaches();

// Cache para imagens
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => {
          return `${request.url}?version=1`;
        },
      },
    ],
  })
);

// Cache para API calls
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 3,
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          return response.status === 200 ? response : null;
        },
      },
    ],
  })
);

// Cache para CSS e JS
registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "static-resources",
  })
);

// Cache para navegação
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages",
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          return response.status === 200 ? response : null;
        },
      },
    ],
  })
);

// ✅ Adicionar manifesto manual para desenvolvimento
if (!self.__WB_MANIFEST) {
  const devManifest = [
    { url: "/", revision: "1" },
    { url: "/static/js/main.js", revision: "1" },
    { url: "/static/css/main.css", revision: "1" },
  ];

  precacheAndRoute(devManifest);
  workbox.precaching.precacheAndRoute(devManifest, {
    ignoreVary: true,
  });
}

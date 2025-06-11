const CACHE_NAME = "task-manager-v1";
const STATIC_CACHE = "static-v1";
const DYNAMIC_CACHE = "dynamic-v1";

const STATIC_FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  // Adicionar outros assets estáticos
];

const API_ENDPOINTS = ["/tasks", "/categories", "/suggestions"];

// Install event - cache static files
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Caching static files");
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - cache strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (
    url.pathname.startsWith("/api/") ||
    API_ENDPOINTS.some((endpoint) => url.pathname.includes(endpoint))
  ) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (
    request.destination === "image" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(handleStaticAssets(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Default: try network first, then cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle API requests - Network first, cache fallback
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Network failed, trying cache for:", request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for failed API requests
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "Dados não disponíveis offline",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Handle static assets - Cache first, network fallback
async function handleStaticAssets(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Failed to fetch static asset:", request.url);
    return new Response("Asset not available offline", { status: 503 });
  }
}

// Handle navigation requests - Network first, cache fallback
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match("/index.html");
    return (
      cachedResponse ||
      new Response("App not available offline", { status: 503 })
    );
  }
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "task-sync") {
    event.waitUntil(syncTasks());
  }
});

async function syncTasks() {
  try {
    // Get pending tasks from IndexedDB or localStorage
    const pendingTasks = await getPendingTasks();

    for (const task of pendingTasks) {
      try {
        await fetch("/api/tasks", {
          method: task.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task.data),
        });

        // Remove from pending queue
        await removePendingTask(task.id);
      } catch (error) {
        console.log("Failed to sync task:", task.id);
      }
    }
  } catch (error) {
    console.log("Background sync failed:", error);
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      tag: data.tag || "task-notification",
      data: data.data,
      actions: [
        {
          action: "view",
          title: "Ver Tarefa",
        },
        {
          action: "dismiss",
          title: "Dispensar",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(
      clients.openWindow(`/tasks/${event.notification.data.taskId}`)
    );
  }
});

// Helper functions for background sync
async function getPendingTasks() {
  // Implementation depends on your storage choice
  return [];
}

async function removePendingTask(taskId) {
  // Implementation depends on your storage choice
}

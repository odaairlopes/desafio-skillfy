export const registerServiceWorker = async (): Promise<void> => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("Service Worker registered successfully:", registration);

      // Handle updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New content is available, show update notification
              showUpdateNotification();
            }
          });
        }
      });

      // Register for background sync
      if (
        "serviceWorker" in navigator &&
        "sync" in window.ServiceWorkerRegistration.prototype
      ) {
        (registration as any).sync.register("task-sync");
      }

      // Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
        await Notification.requestPermission();
      }
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
};

export const unregisterServiceWorker = async (): Promise<void> => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log("Service Worker unregistered successfully");
      }
    } catch (error) {
      console.error("Service Worker unregistration failed:", error);
    }
  }
};

const showUpdateNotification = (): void => {
  // Show a toast or modal to inform user about the update
  if (window.confirm("Nova versão disponível! Recarregar página?")) {
    window.location.reload();
  }
};

// Offline status detection
export const setupOfflineDetection = (): void => {
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    document.body.classList.toggle("offline", !isOnline);

    // Dispatch custom event
    window.dispatchEvent(
      new CustomEvent("connectivity-change", {
        detail: { isOnline },
      })
    );
  };

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  // Initial check
  updateOnlineStatus();
};

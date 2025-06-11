interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem<unknown>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    const isExpired = Date.now() - item.timestamp > item.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Store in localStorage for persistence
  persist(): void {
    if (typeof window === "undefined") return;

    try {
      const cacheData = Array.from(this.cache.entries());
      localStorage.setItem("skillfy-cache", JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Failed to persist cache:", error);
    }
  }

  // Load from localStorage
  restore(): void {
    if (typeof window === "undefined") return;

    try {
      const cacheData = localStorage.getItem("skillfy-cache");
      if (cacheData) {
        const entries = JSON.parse(cacheData);
        this.cache = new Map(entries);

        // Clean expired items
        for (const [key, item] of this.cache.entries()) {
          if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to restore cache:", error);
    }
  }
}

export const cacheManager = new CacheManager();

// Auto-persist cache every 30 seconds (only on client side)
if (typeof window !== "undefined") {
  setInterval(() => {
    cacheManager.persist();
  }, 30000);

  // Restore cache on load
  cacheManager.restore();
}

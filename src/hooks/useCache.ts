import { useState, useEffect } from "react";

interface CacheConfig {
  key: string;
  ttl?: number; // Time to live em milliseconds
  storage?: "localStorage" | "sessionStorage";
}

export function useCache<T>(config: CacheConfig) {
  const { key, ttl = 5 * 60 * 1000, storage = "localStorage" } = config; // 5 min default
  const storageApi = storage === "localStorage" ? localStorage : sessionStorage;

  const [cachedData, setCachedData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCachedData = (): T | null => {
    try {
      const cached = storageApi.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp > ttl) {
        storageApi.removeItem(key);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  };

  const setCacheData = (data: T) => {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
      };
      storageApi.setItem(key, JSON.stringify(cacheEntry));
      setCachedData(data);
    } catch (error) {
      console.warn("Failed to cache data:", error);
    }
  };

  const clearCache = () => {
    storageApi.removeItem(key);
    setCachedData(null);
  };

  useEffect(() => {
    const cached = getCachedData();
    if (cached) {
      setCachedData(cached);
    }
  }, [key]);

  return {
    cachedData,
    setCacheData,
    clearCache,
    isLoading,
    setIsLoading,
  };
}

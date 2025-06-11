import { useState, useCallback } from "react";

export interface ToastData {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      return addToast({ message, type: "success", duration });
    },
    [addToast]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      return addToast({ message, type: "error", duration });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      return addToast({ message, type: "info", duration });
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
  };
};

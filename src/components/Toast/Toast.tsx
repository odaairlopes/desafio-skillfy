"use client";

import React, { useEffect, useState } from "react";
import {
  CloseButton,
  IconContainer,
  ToastContainer,
  ToastMessage,
} from "./Toast.styles";

export interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isClosing) {
        setIsClosing(true);
        setIsVisible(false);
        setTimeout(onClose, 300);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, isClosing]);

  const handleClose = () => {
    if (!isClosing) {
      setIsClosing(true);
      setIsVisible(false);
      setTimeout(onClose, 300);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="100%"
            height="100%"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="100%"
            height="100%"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="100%"
            height="100%"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <ToastContainer $isVisible={isVisible} $type={type}>
      <IconContainer>{getIcon()}</IconContainer>
      <ToastMessage>{message}</ToastMessage>
      <CloseButton onClick={handleClose}>
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </CloseButton>
    </ToastContainer>
  );
};

export default Toast;

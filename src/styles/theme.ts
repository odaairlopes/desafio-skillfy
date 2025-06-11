import type { DefaultTheme } from "styled-components";

export type ThemeMode = "light" | "dark";

export const lightTheme: DefaultTheme = {
  colors: {
    primary: "#6366F1", // Indigo
    secondary: "#10B981", // Emerald
    background: "#F9FAFB",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
  },
  fonts: {
    family: "'Inter', sans-serif",
    sizes: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "24px",
    },
    weights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "24px",
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  lineHeights: {
    xs: "1rem",
    sm: "1.25rem",
    md: "1.5rem",
    lg: "1.75rem",
    xl: "2rem",
  },
  zIndex: {
    modal: 1000,
    dropdown: 999,
    tooltip: 998,
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  breakpoints: {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  transitions: {
    default: "0.3s ease",
  },
};

export const darkTheme: DefaultTheme = {
  ...lightTheme,
  colors: {
    primary: "#818CF8", // Lighter Indigo for dark mode
    secondary: "#34D399", // Lighter Emerald for dark mode
    background: "#111827",
    surface: "#1F2937",
    text: "#F9FAFB",
    textSecondary: "#9CA3AF",
    border: "#374151",
    error: "#F87171",
    success: "#34D399",
    warning: "#FBBF24",
  },
};

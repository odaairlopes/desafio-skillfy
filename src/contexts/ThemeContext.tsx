/// <reference path="../types/styled.d.ts" />
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import type { DefaultTheme } from "styled-components";
import { darkTheme, lightTheme, ThemeMode } from "../styles/theme";

// Tipo local para o tema
type AppTheme = typeof lightTheme;

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  theme: AppTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get saved theme from localStorage or use system preference
  const getInitialTheme = (): ThemeMode => {
    try {
      const savedTheme = localStorage.getItem("theme") as ThemeMode | null;

      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        return savedTheme;
      }

      // Check system preference
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
    } catch (error) {
      // localStorage might not be available
      console.warn("localStorage not available:", error);
    }

    return "light";
  };

  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const theme: AppTheme = themeMode === "light" ? lightTheme : darkTheme;

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      try {
        localStorage.setItem("theme", newMode);
      } catch (error) {
        console.warn("Could not save theme to localStorage:", error);
      }
      return newMode;
    });
  };

  // Update theme when system preference changes
  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem("theme")) {
          setThemeMode(e.matches ? "dark" : "light");
        }
      } catch (error) {
        // localStorage might not be available
        setThemeMode(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Update document attributes when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      // Use os temas diretamente
      const backgroundColor =
        themeMode === "light"
          ? (lightTheme as DefaultTheme).colors.background
          : (darkTheme as DefaultTheme).colors.background;
      metaThemeColor.setAttribute("content", backgroundColor);
    }
  }, [themeMode]);

  const value = {
    themeMode,
    toggleTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={theme as DefaultTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ThemeProvider, useTheme } from "../ThemeContext";

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock do matchMedia
const mockMatchMedia = (matches: boolean) => ({
  matches,
  media: "(prefers-color-scheme: dark)",
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

// Mock do document.querySelector para meta theme-color
const mockMetaElement = {
  setAttribute: jest.fn(),
  getAttribute: jest.fn(),
};

// Componente de teste para acessar o contexto
const TestComponent = ({
  onThemeChange,
}: {
  onThemeChange?: (themeData: any) => void;
}) => {
  const { themeMode, toggleTheme, theme } = useTheme();

  React.useEffect(() => {
    if (onThemeChange) {
      onThemeChange({ themeMode, toggleTheme, theme });
    }
  }, [themeMode, toggleTheme, theme, onThemeChange]);

  // Usar JSON.stringify para acessar propriedades sem problemas de tipo
  const themeStr = JSON.stringify(theme);
  const themeObj = JSON.parse(themeStr);

  return React.createElement("div", { "data-testid": "test-component" }, [
    React.createElement(
      "div",
      { key: "theme-mode", "data-testid": "theme-mode" },
      themeMode
    ),
    React.createElement(
      "div",
      { key: "background-color", "data-testid": "background-color" },
      themeObj.colors?.background || "no-background"
    ),
    React.createElement(
      "div",
      { key: "text-color", "data-testid": "text-color" },
      themeObj.colors?.text || "no-text"
    ),
    React.createElement(
      "div",
      { key: "theme-data", "data-testid": "theme-data" },
      themeStr
    ),
    React.createElement(
      "button",
      {
        key: "toggle-button",
        "data-testid": "toggle-button",
        onClick: toggleTheme,
      },
      "Toggle Theme"
    ),
  ]);
};

describe("ThemeContext", () => {
  beforeEach(() => {
    // Limpar localStorage
    localStorageMock.clear();

    // Mock padrão do matchMedia (light theme)
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMatchMedia(false)),
    });

    // Mock do document.querySelector
    jest.spyOn(document, "querySelector").mockImplementation((selector) => {
      if (selector === 'meta[name="theme-color"]') {
        return mockMetaElement as any;
      }
      return null;
    });

    // Mock do document.documentElement.setAttribute
    jest.spyOn(document.documentElement, "setAttribute").mockImplementation();

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("ThemeProvider", () => {
    it("deve renderizar children corretamente", () => {
      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement("div", { "data-testid": "child" }, "Test Child")
        )
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByTestId("child")).toHaveTextContent("Test Child");
    });

    it("deve fornecer contexto inicial com tema claro por padrão", () => {
      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");

      // Verificar se o tema tem propriedades esperadas
      const themeData = screen.getByTestId("theme-data").textContent;
      expect(themeData).toBeTruthy();
      expect(themeData).toContain("colors");
      expect(themeData).toContain("background");
      expect(themeData).toContain("text");
    });

    it("deve usar tema escuro quando sistema prefere dark mode", () => {
      // Mock para preferir dark mode
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(() => mockMatchMedia(true)),
      });

      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
    });

    it("deve usar tema salvo no localStorage", () => {
      localStorageMock.setItem("theme", "dark");

      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
    });

    it("deve priorizar localStorage sobre preferência do sistema", () => {
      // Sistema prefere light, mas localStorage tem dark
      localStorageMock.setItem("theme", "dark");
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(() => mockMatchMedia(false)),
      });

      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
    });

    it("deve ignorar valores inválidos no localStorage", () => {
      localStorageMock.setItem("theme", "invalid-theme");

      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");
    });
  });

  describe("useTheme", () => {
    it("deve lançar erro quando usado fora do provider", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const TestComponentOutsideProvider = () => {
        useTheme();
        return React.createElement("div", null, "Should not render");
      };

      expect(() => {
        render(React.createElement(TestComponentOutsideProvider, null));
      }).toThrow("useTheme must be used within a ThemeProvider");

      consoleSpy.mockRestore();
    });

    it("deve retornar contexto quando usado dentro do provider", () => {
      let themeContext: any = null;

      const TestComponentInsideProvider = () => {
        themeContext = useTheme();
        return React.createElement(
          "div",
          { "data-testid": "inside-provider" },
          "Inside Provider"
        );
      };

      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponentInsideProvider, null)
        )
      );

      expect(screen.getByTestId("inside-provider")).toBeInTheDocument();
      expect(themeContext).toBeTruthy();
      expect(themeContext.themeMode).toBeDefined();
      expect(themeContext.toggleTheme).toBeDefined();
      expect(themeContext.theme).toBeDefined();
      expect(typeof themeContext.toggleTheme).toBe("function");
    });

    it("deve fornecer tema completo com todas as propriedades", () => {
      let themeContext: any = null;

      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, {
            onThemeChange: (data) => {
              themeContext = data;
            },
          })
        )
      );

      expect(themeContext.theme).toBeDefined();

      // Verificar propriedades do tema através de serialização
      const themeStr = JSON.stringify(themeContext.theme);
      expect(themeStr).toContain("colors");
      expect(themeStr).toContain("spacing");
      expect(themeStr).toContain("fonts");
      expect(themeStr).toContain("borderRadius");
      expect(themeStr).toContain("shadows");
      expect(themeStr).toContain("transitions");
      expect(themeStr).toContain("breakpoints");
    });
  });

  describe("Alternância de Tema", () => {
    it("deve alternar de light para dark", async () => {
      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");

      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
    });

    it("deve alternar de dark para light", async () => {
      localStorageMock.setItem("theme", "dark");

      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");

      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");
    });

    it("deve salvar tema no localStorage ao alternar", async () => {
      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      expect(localStorageMock.getItem("theme")).toBe("dark");

      fireEvent.click(toggleButton);

      expect(localStorageMock.getItem("theme")).toBe("light");
    });

    it("deve permitir múltiplas alternâncias", async () => {
      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      const toggleButton = screen.getByTestId("toggle-button");

      // Light -> Dark
      fireEvent.click(toggleButton);
      expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");

      // Dark -> Light
      fireEvent.click(toggleButton);
      expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");

      // Light -> Dark
      fireEvent.click(toggleButton);
      expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
    });

    it("deve alterar cores do tema ao alternar", () => {
      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      const initialBackground =
        screen.getByTestId("background-color").textContent;
      const initialText = screen.getByTestId("text-color").textContent;

      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      const newBackground = screen.getByTestId("background-color").textContent;
      const newText = screen.getByTestId("text-color").textContent;

      expect(newBackground).not.toBe(initialBackground);
      expect(newText).not.toBe(initialText);
    });
  });

  describe("Efeitos no DOM", () => {
    it("deve definir atributo data-theme no documentElement", () => {
      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
        "data-theme",
        "light"
      );

      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
        "data-theme",
        "dark"
      );
    });

    it("deve atualizar meta theme-color quando existe", () => {
      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(mockMetaElement.setAttribute).toHaveBeenCalledWith(
        "content",
        expect.any(String)
      );

      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      expect(mockMetaElement.setAttribute).toHaveBeenCalledWith(
        "content",
        expect.any(String)
      );
    });

    it("não deve quebrar quando meta theme-color não existe", () => {
      jest.spyOn(document, "querySelector").mockReturnValue(null);

      expect(() => {
        render(
          React.createElement(
            ThemeProvider,
            null,
            React.createElement(TestComponent, null)
          )
        );
      }).not.toThrow();
    });
  });

  describe("Preferência do Sistema", () => {
    it("deve escutar mudanças na preferência do sistema", () => {
      const mockAddEventListener = jest.fn();
      const mockRemoveEventListener = jest.fn();

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          ...mockMatchMedia(false),
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener,
        })),
      });

      const { unmount } = render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(mockAddEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function)
      );

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function)
      );
    });

    it("deve atualizar tema quando preferência do sistema muda e não há tema salvo", () => {
      let mediaQueryCallback: ((e: MediaQueryListEvent) => void) | null = null;
      const mockAddEventListener = jest.fn((event, callback) => {
        if (event === "change") {
          mediaQueryCallback = callback;
        }
      });

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          ...mockMatchMedia(false),
          addEventListener: mockAddEventListener,
          removeEventListener: jest.fn(),
        })),
      });

      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");

      // Simular mudança para dark mode
      if (mediaQueryCallback) {
        act(() => {
          mediaQueryCallback({ matches: true } as MediaQueryListEvent);
        });
      }

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
    });

    it("não deve atualizar tema quando há tema salvo no localStorage", () => {
      localStorageMock.setItem("theme", "light");

      let mediaQueryCallback: ((e: MediaQueryListEvent) => void) | null = null;
      const mockAddEventListener = jest.fn((event, callback) => {
        if (event === "change") {
          mediaQueryCallback = callback;
        }
      });

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          ...mockMatchMedia(false),
          addEventListener: mockAddEventListener,
          removeEventListener: jest.fn(),
        })),
      });

      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");

      // Simular mudança do sistema para dark
      if (mediaQueryCallback) {
        act(() => {
          mediaQueryCallback({ matches: true } as MediaQueryListEvent);
        });
      }

      // Deve manter o tema salvo
      expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");
    });
  });

  describe("Temas Light e Dark", () => {
    it("deve usar cores diferentes entre temas light e dark", () => {
      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      const lightBackground =
        screen.getByTestId("background-color").textContent;
      const lightText = screen.getByTestId("text-color").textContent;

      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      const darkBackground = screen.getByTestId("background-color").textContent;
      const darkText = screen.getByTestId("text-color").textContent;

      expect(darkBackground).not.toBe(lightBackground);
      expect(darkText).not.toBe(lightText);
    });

    it("deve ter todas as propriedades do tema definidas", () => {
      let lightThemeData: any = null;
      let darkThemeData: any = null;

      // First, capture light theme
      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, {
            onThemeChange: (data) => {
              lightThemeData = data;
            },
          })
        )
      );

      // Wait for theme to be captured
      expect(lightThemeData).toBeTruthy();
      const lightThemeStr = JSON.stringify(lightThemeData.theme);

      // Then toggle to dark theme and capture it
      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      // Use a new render to capture dark theme data
      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, {
            onThemeChange: (data) => {
              if (data.themeMode === "dark") {
                darkThemeData = data;
              }
            },
          })
        )
      );

      // Force dark mode by setting localStorage and re-rendering
      localStorageMock.setItem("theme", "dark");
      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, {
            onThemeChange: (data) => {
              darkThemeData = data;
            },
          })
        )
      );

      // Verificar que ambos os temas têm estrutura similar
      const darkThemeStr = JSON.stringify(darkThemeData.theme);

      expect(lightThemeStr).toContain("colors");
      expect(darkThemeStr).toContain("colors");

      // Instead of comparing the entire theme objects, compare specific color properties
      // that should be different between light and dark themes
      const lightTheme = JSON.parse(lightThemeStr);
      const darkTheme = JSON.parse(darkThemeStr);

      expect(lightTheme.colors.background).not.toBe(
        darkTheme.colors.background
      );
    });
  });

  describe("Múltiplos Consumidores", () => {
    it("deve fornecer mesmo contexto para múltiplos consumidores", () => {
      const Consumer1 = () => {
        const { themeMode } = useTheme();
        return React.createElement(
          "div",
          { "data-testid": "consumer-1" },
          themeMode
        );
      };

      const Consumer2 = () => {
        const { theme } = useTheme();
        const themeObj = JSON.parse(JSON.stringify(theme));
        return React.createElement(
          "div",
          { "data-testid": "consumer-2" },
          themeObj.colors?.background || "no-background"
        );
      };

      const Consumer3 = () => {
        const { toggleTheme } = useTheme();
        return React.createElement(
          "button",
          { "data-testid": "consumer-3", onClick: toggleTheme },
          "Toggle"
        );
      };

      render(
        React.createElement(ThemeProvider, null, [
          React.createElement(Consumer1, { key: "1" }),
          React.createElement(Consumer2, { key: "2" }),
          React.createElement(Consumer3, { key: "3" }),
        ])
      );

      expect(screen.getByTestId("consumer-1")).toHaveTextContent("light");
      expect(screen.getByTestId("consumer-2")).not.toHaveTextContent(
        "no-background"
      );

      const initialBackground = screen.getByTestId("consumer-2").textContent;

      fireEvent.click(screen.getByTestId("consumer-3"));

      expect(screen.getByTestId("consumer-1")).toHaveTextContent("dark");
      expect(screen.getByTestId("consumer-2").textContent).not.toBe(
        initialBackground
      );
    });
  });

  describe("Casos Extremos", () => {
    it("deve lidar com localStorage não disponível", () => {
      // Mock localStorage para lançar erro
      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: () => {
            throw new Error("localStorage not available");
          },
          setItem: () => {
            throw new Error("localStorage not available");
          },
        },
        writable: true,
      });

      expect(() => {
        render(
          React.createElement(
            ThemeProvider,
            null,
            React.createElement(TestComponent, null)
          )
        );
      }).not.toThrow();

      // Restaurar localStorage
      Object.defineProperty(window, "localStorage", {
        value: originalLocalStorage,
        writable: true,
      });
    });

    it("deve lidar com matchMedia não disponível", () => {
      Object.defineProperty(window, "matchMedia", {
        value: undefined,
        writable: true,
      });

      expect(() => {
        render(
          React.createElement(
            ThemeProvider,
            null,
            React.createElement(TestComponent, null)
          )
        );
      }).not.toThrow();

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");
    });

    it("deve funcionar corretamente com re-renders", () => {
      const { rerender } = render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");

      rerender(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");

      fireEvent.click(screen.getByTestId("toggle-button"));
      expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
    });
  });

  describe("Performance", () => {
    it("deve memoizar contexto adequadamente", () => {
      const mockCallback = jest.fn();

      const TestMemoComponent = () => {
        const context = useTheme();
        mockCallback(context);
        return React.createElement(
          "div",
          { "data-testid": "memo-test" },
          context.themeMode
        );
      };

      const { rerender } = render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestMemoComponent, null)
        )
      );

      expect(mockCallback).toHaveBeenCalledTimes(1);

      // Re-render sem mudança de estado
      rerender(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestMemoComponent, null)
        )
      );

      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it("deve cleanup event listeners corretamente", () => {
      const mockRemoveEventListener = jest.fn();

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          ...mockMatchMedia(false),
          addEventListener: jest.fn(),
          removeEventListener: mockRemoveEventListener,
        })),
      });

      const { unmount } = render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function)
      );
    });
  });

  describe("Integração com Styled Components", () => {
    it("deve fornecer tema para styled-components", () => {
      let styledTheme: any = null;

      // Componente que recebe tema do styled-components
      const StyledTestComponent = () => {
        const { theme } = useTheme();

        React.useEffect(() => {
          styledTheme = theme;
        }, [theme]);

        return React.createElement("div", {
          "data-testid": "styled-component",
        });
      };

      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(StyledTestComponent, null)
        )
      );

      expect(styledTheme).toBeDefined();
      expect(JSON.stringify(styledTheme)).toContain("colors");
    });

    it("deve permitir alternar tema via styled-components", () => {
      let currentTheme: any = null;

      const StyledTestComponent = () => {
        const { theme, toggleTheme } = useTheme();

        React.useEffect(() => {
          currentTheme = theme;
        }, [theme]);

        return React.createElement("button", {
          "data-testid": "styled-toggle",
          onClick: toggleTheme,
        });
      };

      render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(StyledTestComponent, null)
        )
      );

      const initialTheme = JSON.stringify(currentTheme);

      fireEvent.click(screen.getByTestId("styled-toggle"));

      const newTheme = JSON.stringify(currentTheme);
      expect(newTheme).not.toBe(initialTheme);
    });
  });
});

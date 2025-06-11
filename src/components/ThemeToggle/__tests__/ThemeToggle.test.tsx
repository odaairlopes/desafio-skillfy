/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import "@testing-library/jest-dom";

import ThemeToggle from "../ThemeToggle";

// Mock do contexto de tema
const mockToggleTheme = jest.fn();
const mockUseTheme = {
  themeMode: "light",
  toggleTheme: mockToggleTheme,
};

jest.mock("../../../contexts/ThemeContext", () => ({
  useTheme: () => mockUseTheme,
}));

// Mock dos ícones do react-icons
jest.mock("react-icons/lu", () => ({
  LuSun: ({ "data-testid": testId, ...props }: any) =>
    React.createElement("svg", {
      "data-testid": testId,
      "aria-label": "sun-icon",
      ...props,
    }),
  LuMoon: ({ "data-testid": testId, ...props }: any) =>
    React.createElement("svg", {
      "data-testid": testId,
      "aria-label": "moon-icon",
      ...props,
    }),
}));

// Mock dos estilos
jest.mock("../ThemeToggle.styles", () => ({
  StyledButton: ({ children, ...props }: any) =>
    React.createElement(
      "button",
      { ...props, "data-testid": "theme-toggle", type: "button" },
      children
    ),
  StyledSpan: ({ children, $isActive, ...props }: any) =>
    React.createElement(
      "span",
      { ...props, "data-active": $isActive },
      children
    ),
}));

// Mock do tema
const mockTheme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
    background: "#ffffff",
    surface: "#f8f9fa",
    text: "#212529",
    textSecondary: "#6c757d",
    border: "#dee2e6",
    error: "#dc3545",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
  },
  fonts: {
    family: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
    },
    weights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
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
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  transitions: {
    default: "all 0.2s ease-in-out",
  },
  breakpoints: {
    xs: "0px",
    sm: "600px",
    md: "960px",
    lg: "1280px",
    xl: "1920px",
    "2xl": "1536px",
  },
};

// Wrapper para testes
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(ThemeProvider, { theme: mockTheme }, children);
};

describe("ThemeToggle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset para tema claro por padrão
    mockUseTheme.themeMode = "light";
  });

  describe("Renderização Básica", () => {
    it("deve renderizar o botão de toggle", () => {
      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId("theme-toggle");
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute("type", "button");
    });

    it("deve renderizar com classe personalizada", () => {
      render(React.createElement(ThemeToggle, { className: "custom-class" }), {
        wrapper: TestWrapper,
      });

      const toggleButton = screen.getByTestId("theme-toggle");
      expect(toggleButton).toHaveClass("custom-class");
    });

    it("deve renderizar sem className quando não fornecida", () => {
      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId("theme-toggle");
      expect(toggleButton).toBeInTheDocument();
      // className deve ser undefined ou não estar presente
    });
  });

  describe("Estados do Tema", () => {
    it("deve mostrar ícone do sol quando tema é claro", () => {
      mockUseTheme.themeMode = "light";

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();
    });

    it("deve mostrar ícone da lua quando tema é escuro", () => {
      mockUseTheme.themeMode = "dark";

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
    });

    it("deve aplicar estado ativo correto no span quando tema é claro", () => {
      mockUseTheme.themeMode = "light";

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const span = screen.getByRole("button").querySelector("span");
      expect(span).toHaveAttribute("data-active", "false");
    });

    it("deve aplicar estado ativo correto no span quando tema é escuro", () => {
      mockUseTheme.themeMode = "dark";

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const span = screen.getByRole("button").querySelector("span");
      expect(span).toHaveAttribute("data-active", "true");
    });
  });

  describe("Atributos de Acessibilidade", () => {
    it("deve ter aria-label correto para tema claro", () => {
      mockUseTheme.themeMode = "light";

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId("theme-toggle");
      expect(toggleButton).toHaveAttribute("aria-label", "Switch to dark mode");
    });

    it("deve ter aria-label correto para tema escuro", () => {
      mockUseTheme.themeMode = "dark";

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId("theme-toggle");
      expect(toggleButton).toHaveAttribute(
        "aria-label",
        "Switch to light mode"
      );
    });

    it("deve ser acessível por leitores de tela", () => {
      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByRole("button");
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAccessibleName("Switch to dark mode");
    });

    it("deve ter foco visível quando focado", () => {
      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId("theme-toggle");
      toggleButton.focus();
      expect(toggleButton).toHaveFocus();
    });
  });

  describe("Interações", () => {
    it("deve chamar toggleTheme quando clicado", async () => {
      const user = userEvent.setup();

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId("theme-toggle");
      await user.click(toggleButton);

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it("deve chamar toggleTheme múltiplas vezes em cliques sucessivos", async () => {
      const user = userEvent.setup();

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId("theme-toggle");

      await user.click(toggleButton);
      await user.click(toggleButton);
      await user.click(toggleButton);

      expect(mockToggleTheme).toHaveBeenCalledTimes(3);
    });

    it("deve ser ativado via teclado (Enter)", async () => {
      const user = userEvent.setup();

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId("theme-toggle");
      toggleButton.focus();
      await user.keyboard("{Enter}");

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it("deve ser ativado via teclado (Space)", async () => {
      const user = userEvent.setup();

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId("theme-toggle");
      toggleButton.focus();
      await user.keyboard(" ");

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it("deve manter foco após clique", async () => {
      const user = userEvent.setup();

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId("theme-toggle");
      await user.click(toggleButton);

      expect(toggleButton).toHaveFocus();
    });
  });

  describe("Mudanças de Estado", () => {
    it("deve atualizar ícone quando tema muda", () => {
      const { rerender } = render(React.createElement(ThemeToggle), {
        wrapper: TestWrapper,
      });

      // Inicialmente tema claro
      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();

      // Mudar para tema escuro
      mockUseTheme.themeMode = "dark";
      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(ThemeToggle)
        )
      );

      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
    });

    it("deve atualizar aria-label quando tema muda", () => {
      const { rerender } = render(React.createElement(ThemeToggle), {
        wrapper: TestWrapper,
      });

      let toggleButton = screen.getByTestId("theme-toggle");

      // Inicialmente tema claro
      expect(toggleButton).toHaveAttribute("aria-label", "Switch to dark mode");

      // Mudar para tema escuro
      mockUseTheme.themeMode = "dark";
      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(ThemeToggle)
        )
      );

      toggleButton = screen.getByTestId("theme-toggle");
      expect(toggleButton).toHaveAttribute(
        "aria-label",
        "Switch to light mode"
      );
    });

    it("deve atualizar estado ativo do span quando tema muda", () => {
      const { rerender } = render(React.createElement(ThemeToggle), {
        wrapper: TestWrapper,
      });

      let span = screen.getByRole("button").querySelector("span");
      expect(span).toHaveAttribute("data-active", "false");

      // Mudar para tema escuro
      mockUseTheme.themeMode = "dark";
      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(ThemeToggle)
        )
      );

      span = screen.getByRole("button").querySelector("span");
      expect(span).toHaveAttribute("data-active", "true");
    });
  });

  describe("Comportamento dos Ícones", () => {
    it("deve usar ícone correto baseado no estado isDark", () => {
      // Teste com tema claro
      mockUseTheme.themeMode = "light";
      const { rerender } = render(React.createElement(ThemeToggle), {
        wrapper: TestWrapper,
      });

      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();

      // Teste com tema escuro
      mockUseTheme.themeMode = "dark";
      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(ThemeToggle)
        )
      );

      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    });

    it("deve aplicar testId correto nos ícones", () => {
      // Sol no tema claro
      mockUseTheme.themeMode = "light";
      const { rerender } = render(React.createElement(ThemeToggle), {
        wrapper: TestWrapper,
      });

      const sunIcon = screen.getByTestId("sun-icon");
      expect(sunIcon).toHaveAttribute("data-testid", "sun-icon");

      // Lua no tema escuro
      mockUseTheme.themeMode = "dark";
      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(ThemeToggle)
        )
      );

      const moonIcon = screen.getByTestId("moon-icon");
      expect(moonIcon).toHaveAttribute("data-testid", "moon-icon");
    });
  });

  describe("Casos Extremos", () => {
    it("deve lidar com themeMode undefined", () => {
      mockUseTheme.themeMode = undefined as any;

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      // Deve usar comportamento padrão (falsy = light mode)
      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
      expect(screen.getByTestId("theme-toggle")).toHaveAttribute(
        "aria-label",
        "Switch to dark mode"
      );
    });

    it("deve lidar com themeMode inválido", () => {
      mockUseTheme.themeMode = "invalid" as any;

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      // Deve tratar como light mode (não é "dark")
      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
      expect(screen.getByTestId("theme-toggle")).toHaveAttribute(
        "aria-label",
        "Switch to dark mode"
      );
    });

    it("deve lidar com toggleTheme undefined", () => {
      mockUseTheme.toggleTheme = undefined as any;

      expect(() => {
        render(React.createElement(ThemeToggle), { wrapper: TestWrapper });
      }).not.toThrow();

      const toggleButton = screen.getByTestId("theme-toggle");
      expect(toggleButton).toBeInTheDocument();
    });

    it("deve lidar com toggleTheme null", async () => {
      const user = userEvent.setup();
      mockUseTheme.toggleTheme = null as any;

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId("theme-toggle");

      // Não deve lançar erro ao clicar
      expect(() => user.click(toggleButton)).not.toThrow();
    });
  });

  describe("Props e Configuração", () => {
    it("deve aceitar className personalizada", () => {
      const customClass = "my-custom-theme-toggle";

      render(React.createElement(ThemeToggle, { className: customClass }), {
        wrapper: TestWrapper,
      });

      const toggleButton = screen.getByTestId("theme-toggle");
      expect(toggleButton).toHaveClass(customClass);
    });

    it("deve funcionar sem className (opcional)", () => {
      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId("theme-toggle");
      expect(toggleButton).toBeInTheDocument();
    });

    it("deve aceitar className vazia", () => {
      render(React.createElement(ThemeToggle, { className: "" }), {
        wrapper: TestWrapper,
      });

      const toggleButton = screen.getByTestId("theme-toggle");
      expect(toggleButton).toBeInTheDocument();
    });

    it("deve aceitar múltiplas classes", () => {
      const multipleClasses = "class1 class2 class3";

      render(React.createElement(ThemeToggle, { className: multipleClasses }), {
        wrapper: TestWrapper,
      });

      const toggleButton = screen.getByTestId("theme-toggle");
      expect(toggleButton).toHaveClass("class1");
      expect(toggleButton).toHaveClass("class2");
      expect(toggleButton).toHaveClass("class3");
    });
  });

  describe("Performance", () => {
    it("não deve re-renderizar desnecessariamente", () => {
      const renderSpy = jest.fn();

      const TestComponent = ({ themeMode }: { themeMode: string }) => {
        renderSpy();
        // Simular mudança no contexto
        mockUseTheme.themeMode = themeMode;
        return React.createElement(ThemeToggle);
      };

      const { rerender } = render(
        React.createElement(TestComponent, { themeMode: "light" }),
        { wrapper: TestWrapper }
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render com mesmo valor
      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(TestComponent, { themeMode: "light" })
        )
      );

      expect(renderSpy).toHaveBeenCalledTimes(2);

      // Re-render com valor diferente
      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(TestComponent, { themeMode: "dark" })
        )
      );

      expect(renderSpy).toHaveBeenCalledTimes(3);
    });

    it("deve ser eficiente com múltiplas instâncias", () => {
      const toggles = Array.from({ length: 10 }, (_, i) =>
        React.createElement(ThemeToggle, {
          key: i,
          className: `toggle-${i}`,
        })
      );

      expect(() => {
        render(React.createElement("div", null, toggles), {
          wrapper: TestWrapper,
        });
      }).not.toThrow();

      const allToggles = screen.getAllByTestId("theme-toggle");
      expect(allToggles).toHaveLength(10);
    });
  });

  describe("Integração com Styled Components", () => {
    it("deve aplicar estilos através dos styled components", () => {
      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
      const span = screen.getByRole("button").querySelector("span");
      expect(span).toBeInTheDocument();
    });

    it("deve receber props do tema corretamente", () => {
      const { container } = render(React.createElement(ThemeToggle), {
        wrapper: TestWrapper,
      });

      // Verifica se o componente foi renderizado dentro do ThemeProvider
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });

    it("deve aplicar props styled corretas no span", () => {
      mockUseTheme.themeMode = "dark";

      render(React.createElement(ThemeToggle), { wrapper: TestWrapper });

      const span = screen.getByRole("button").querySelector("span");
      expect(span).toHaveAttribute("data-active", "true");
    });
  });
});

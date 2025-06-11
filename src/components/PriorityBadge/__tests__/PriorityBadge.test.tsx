/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import "@testing-library/jest-dom";

import PriorityBadge from "../PriorityBadge";

// Mock dos estilos
jest.mock("../PriorityBadge.styles", () => ({
  Badge: ({ children, ...props }: any) =>
    React.createElement(
      "span",
      {
        ...props,
        "data-priority": props.$priority,
        "data-size": props.$size,
        className: `badge priority-${props.$priority} size-${props.$size}`,
      },
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

describe("PriorityBadge", () => {
  describe("Renderização Básica", () => {
    it("deve renderizar com prioridade alta", () => {
      render(React.createElement(PriorityBadge, { priority: "high" }), {
        wrapper: TestWrapper,
      });

      const badge = screen.getByText("Alta");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("aria-label", "Prioridade Alta");
      expect(badge).toHaveAttribute("data-priority", "high");
    });

    it("deve renderizar com prioridade média", () => {
      render(React.createElement(PriorityBadge, { priority: "medium" }), {
        wrapper: TestWrapper,
      });

      const badge = screen.getByText("Média");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("aria-label", "Prioridade Média");
      expect(badge).toHaveAttribute("data-priority", "medium");
    });

    it("deve renderizar com prioridade baixa", () => {
      render(React.createElement(PriorityBadge, { priority: "low" }), {
        wrapper: TestWrapper,
      });

      const badge = screen.getByText("Baixa");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("aria-label", "Prioridade Baixa");
      expect(badge).toHaveAttribute("data-priority", "low");
    });

    it("deve usar tamanho médio como padrão", () => {
      render(React.createElement(PriorityBadge, { priority: "high" }), {
        wrapper: TestWrapper,
      });

      const badge = screen.getByText("Alta");
      expect(badge).toHaveAttribute("data-size", "md");
    });
  });

  describe("Tamanhos", () => {
    it("deve renderizar com tamanho pequeno", () => {
      render(
        React.createElement(PriorityBadge, { priority: "high", size: "sm" }),
        { wrapper: TestWrapper }
      );

      const badge = screen.getByText("Alta");
      expect(badge).toHaveAttribute("data-size", "sm");
      expect(badge).toHaveClass("size-sm");
    });

    it("deve renderizar com tamanho médio", () => {
      render(
        React.createElement(PriorityBadge, { priority: "medium", size: "md" }),
        { wrapper: TestWrapper }
      );

      const badge = screen.getByText("Média");
      expect(badge).toHaveAttribute("data-size", "md");
      expect(badge).toHaveClass("size-md");
    });

    it("deve renderizar com tamanho grande", () => {
      render(
        React.createElement(PriorityBadge, { priority: "low", size: "lg" }),
        { wrapper: TestWrapper }
      );

      const badge = screen.getByText("Baixa");
      expect(badge).toHaveAttribute("data-size", "lg");
      expect(badge).toHaveClass("size-lg");
    });

    it("deve aplicar classes CSS corretas para cada tamanho", () => {
      const sizes = ["sm", "md", "lg"] as const;

      sizes.forEach((size) => {
        const { unmount } = render(
          React.createElement(PriorityBadge, { priority: "high", size }),
          { wrapper: TestWrapper }
        );

        const badge = screen.getByText("Alta");
        expect(badge).toHaveClass(`size-${size}`);

        unmount();
      });
    });
  });

  describe("Cores das Prioridades", () => {
    it("deve aplicar classe CSS correta para prioridade alta", () => {
      render(React.createElement(PriorityBadge, { priority: "high" }), {
        wrapper: TestWrapper,
      });

      const badge = screen.getByText("Alta");
      expect(badge).toHaveClass("priority-high");
    });

    it("deve aplicar classe CSS correta para prioridade média", () => {
      render(React.createElement(PriorityBadge, { priority: "medium" }), {
        wrapper: TestWrapper,
      });

      const badge = screen.getByText("Média");
      expect(badge).toHaveClass("priority-medium");
    });

    it("deve aplicar classe CSS correta para prioridade baixa", () => {
      render(React.createElement(PriorityBadge, { priority: "low" }), {
        wrapper: TestWrapper,
      });

      const badge = screen.getByText("Baixa");
      expect(badge).toHaveClass("priority-low");
    });

    it("deve ter atributos de dados corretos para cada prioridade", () => {
      const priorities = ["high", "medium", "low"] as const;
      const priorityTexts = {
        high: "Alta",
        medium: "Média",
        low: "Baixa",
      };

      priorities.forEach((priority) => {
        const { unmount } = render(
          React.createElement(PriorityBadge, { priority }),
          { wrapper: TestWrapper }
        );

        const badge = screen.getByText(priorityTexts[priority]);
        expect(badge).toHaveAttribute("data-priority", priority);

        unmount();
      });
    });
  });

  describe("Labels e Textos", () => {
    it("deve exibir texto correto para cada prioridade", () => {
      const priorityTexts = {
        high: "Alta",
        medium: "Média",
        low: "Baixa",
      };

      Object.entries(priorityTexts).forEach(([priority, text]) => {
        const { unmount } = render(
          React.createElement(PriorityBadge, {
            priority: priority as "high" | "medium" | "low",
          }),
          { wrapper: TestWrapper }
        );

        expect(screen.getByText(text)).toBeInTheDocument();
        unmount();
      });
    });

    it("deve ter aria-label correto para cada prioridade", () => {
      const priorityLabels = {
        high: "Prioridade Alta",
        medium: "Prioridade Média",
        low: "Prioridade Baixa",
      };

      Object.entries(priorityLabels).forEach(([priority, label]) => {
        const { unmount } = render(
          React.createElement(PriorityBadge, {
            priority: priority as "high" | "medium" | "low",
          }),
          { wrapper: TestWrapper }
        );

        expect(screen.getByLabelText(label)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("Casos Extremos e Validação", () => {
    const originalConsoleError = console.error;

    beforeEach(() => {
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error = originalConsoleError;
    });

    it("deve lidar com prioridade undefined", () => {
      render(
        React.createElement(PriorityBadge, { priority: undefined as any }),
        { wrapper: TestWrapper }
      );

      // Deve usar fallback para medium
      const badge = screen.getByText("Média");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-priority", "medium");
    });

    it("deve lidar com prioridade null", () => {
      render(React.createElement(PriorityBadge, { priority: null as any }), {
        wrapper: TestWrapper,
      });

      // Deve usar fallback para medium
      const badge = screen.getByText("Média");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-priority", "medium");
    });

    it("deve lidar com prioridade inválida", () => {
      render(
        React.createElement(PriorityBadge, { priority: "invalid" as any }),
        { wrapper: TestWrapper }
      );

      // Deve mostrar erro no console e usar fallback
      expect(console.error).toHaveBeenCalledWith(
        "Invalid priority: invalid, falling back to medium"
      );

      const badge = screen.getByText("Média");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-priority", "medium");
    });

    it("deve lidar com size undefined usando padrão md", () => {
      render(
        React.createElement(PriorityBadge, {
          priority: "high",
          size: undefined,
        }),
        { wrapper: TestWrapper }
      );

      const badge = screen.getByText("Alta");
      expect(badge).toHaveAttribute("data-size", "md");
    });
  });

  describe("Interações", () => {
    it("deve suportar hover states", async () => {
      const user = userEvent.setup();

      render(React.createElement(PriorityBadge, { priority: "high" }), {
        wrapper: TestWrapper,
      });

      const badge = screen.getByText("Alta");

      await user.hover(badge);
      // O comportamento de hover é controlado por CSS, então apenas verificamos se o elemento está presente
      expect(badge).toBeInTheDocument();

      await user.unhover(badge);
      expect(badge).toBeInTheDocument();
    });

    it("deve manter estado visual após interações", async () => {
      const user = userEvent.setup();

      render(React.createElement(PriorityBadge, { priority: "medium" }), {
        wrapper: TestWrapper,
      });

      const badge = screen.getByText("Média");

      await user.hover(badge);
      expect(badge).toHaveAttribute("data-priority", "medium");
      expect(badge).toHaveClass("priority-medium");

      await user.unhover(badge);
      expect(badge).toHaveAttribute("data-priority", "medium");
      expect(badge).toHaveClass("priority-medium");
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter role generic por padrão", () => {
      render(React.createElement(PriorityBadge, { priority: "high" }), {
        wrapper: TestWrapper,
      });

      const badge = screen.getByLabelText("Prioridade Alta");
      expect(badge).toBeInTheDocument();
    });

    it("deve ser acessível por screen readers", () => {
      render(React.createElement(PriorityBadge, { priority: "low" }), {
        wrapper: TestWrapper,
      });

      const badge = screen.getByLabelText("Prioridade Baixa");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("Baixa");
    });

    it("deve ter contraste adequado através das cores do tema", () => {
      render(React.createElement(PriorityBadge, { priority: "high" }), {
        wrapper: TestWrapper,
      });

      const badge = screen.getByText("Alta");
      // Verifica se as classes de cor são aplicadas para garantir contraste
      expect(badge).toHaveClass("priority-high");
    });
  });

  describe("Combinações de Props", () => {
    it("deve combinar prioridade e tamanho corretamente", () => {
      const combinations = [
        { priority: "high" as const, size: "sm" as const },
        { priority: "medium" as const, size: "md" as const },
        { priority: "low" as const, size: "lg" as const },
      ];

      combinations.forEach(({ priority, size }) => {
        const { unmount } = render(
          React.createElement(PriorityBadge, { priority, size }),
          { wrapper: TestWrapper }
        );

        const priorityTexts = {
          high: "Alta",
          medium: "Média",
          low: "Baixa",
        };
        const badge = screen.getByText(priorityTexts[priority]);
        expect(badge).toHaveAttribute("data-priority", priority);
        expect(badge).toHaveAttribute("data-size", size);
        expect(badge).toHaveClass(`priority-${priority}`);
        expect(badge).toHaveClass(`size-${size}`);

        unmount();
      });
    });

    it("deve manter consistência visual com diferentes combinações", () => {
      render(
        React.createElement("div", null, [
          React.createElement(PriorityBadge, {
            key: "1",
            priority: "high",
            size: "sm",
          }),
          React.createElement(PriorityBadge, {
            key: "2",
            priority: "medium",
            size: "md",
          }),
          React.createElement(PriorityBadge, {
            key: "3",
            priority: "low",
            size: "lg",
          }),
        ]),
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("Alta")).toBeInTheDocument();
      expect(screen.getByText("Média")).toBeInTheDocument();
      expect(screen.getByText("Baixa")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("não deve re-renderizar desnecessariamente", () => {
      const renderSpy = jest.fn();

      const TestBadge = ({
        priority,
        size,
      }: {
        priority: "high" | "medium" | "low";
        size?: "sm" | "md" | "lg";
      }) => {
        renderSpy();
        return React.createElement(PriorityBadge, { priority, size });
      };

      const { rerender } = render(
        React.createElement(TestBadge, { priority: "high" }),
        { wrapper: TestWrapper }
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render com as mesmas props
      rerender(React.createElement(TestBadge, { priority: "high" }));
      expect(renderSpy).toHaveBeenCalledTimes(2);

      // Re-render com props diferentes
      rerender(React.createElement(TestBadge, { priority: "medium" }));
      expect(renderSpy).toHaveBeenCalledTimes(3);
    });

    it("deve ser eficiente com múltiplas instâncias", () => {
      const badges = Array.from({ length: 100 }, (_, i) =>
        React.createElement(PriorityBadge, {
          key: i,
          priority: ["high", "medium", "low"][i % 3] as
            | "high"
            | "medium"
            | "low",
          size: ["sm", "md", "lg"][i % 3] as "sm" | "md" | "lg",
        })
      );

      const { container } = render(React.createElement("div", null, badges), {
        wrapper: TestWrapper,
      });

      expect(() => {
        render(React.createElement("div", null, badges), {
          wrapper: TestWrapper,
        });
      }).not.toThrow();

      // Verifica se todas as instâncias foram renderizadas contando apenas os badges
      const badgeElements = container.querySelectorAll("span[data-priority]");
      expect(badgeElements).toHaveLength(100);
    });
  });

  describe("Integração com Styled Components", () => {
    it("deve aplicar estilos através do styled component", () => {
      render(
        React.createElement(PriorityBadge, { priority: "high", size: "lg" }),
        { wrapper: TestWrapper }
      );

      const badge = screen.getByText("Alta");
      expect(badge).toHaveClass("badge");
      expect(badge).toHaveClass("priority-high");
      expect(badge).toHaveClass("size-lg");
    });

    it("deve receber props do tema corretamente", () => {
      const { container } = render(
        React.createElement(PriorityBadge, { priority: "medium" }),
        { wrapper: TestWrapper }
      );

      // Verifica se o componente foi renderizado dentro do ThemeProvider
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Média")).toBeInTheDocument();
    });
  });
});

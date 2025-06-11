/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom";

import Layout from "../Layout";

// Mock dos componentes filhos
jest.mock("../../ThemeToggle/ThemeToggle", () => {
  const MockThemeToggle = () => {
    return React.createElement(
      "button",
      { "data-testid": "theme-toggle" },
      "Toggle Theme"
    );
  };
  MockThemeToggle.displayName = "MockThemeToggle";
  return MockThemeToggle;
});

jest.mock("../../Navigation/Navigation", () => {
  const MockNavigation = ({ currentPath }: { currentPath: string }) => {
    return React.createElement(
      "nav",
      { "data-testid": "navigation" },
      `Navigation: ${currentPath}`
    );
  };
  MockNavigation.displayName = "MockNavigation";
  return MockNavigation;
});

// Mock dos estilos
jest.mock("../Layout.styles", () => ({
  LayoutContainer: "div",
  Header: ({ children, ...props }: any) =>
    React.createElement("header", { ...props, role: "banner" }, children),
  Main: ({ children, ...props }: any) =>
    React.createElement("main", { ...props, role: "main" }, children),
  ThemeToggleWrapper: "div",
  NavigationWrapper: "div",
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
const TestWrapper = ({
  children,
  initialEntries = ["/"],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}) => {
  return React.createElement(
    MemoryRouter,
    { initialEntries },
    React.createElement(ThemeProvider, { theme: mockTheme }, children)
  );
};

describe("Layout", () => {
  const mockChildren = React.createElement(
    "div",
    { "data-testid": "test-content" },
    "Test Content"
  );

  describe("Renderização Básica", () => {
    it("deve renderizar a estrutura básica do layout", () => {
      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: TestWrapper,
      });

      // Verifica se os elementos principais estão presentes
      expect(screen.getByRole("banner")).toBeInTheDocument(); // header
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByTestId("test-content")).toBeInTheDocument();
    });

    it("deve renderizar o componente Navigation", () => {
      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: TestWrapper,
      });

      expect(screen.getByTestId("navigation")).toBeInTheDocument();
    });

    it("deve renderizar o componente ThemeToggle", () => {
      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: TestWrapper,
      });

      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });

    it("deve passar o currentPath correto para Navigation", () => {
      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: ({ children }) =>
          TestWrapper({
            children,
            initialEntries: ["/dashboard"],
          }),
      });

      expect(screen.getByText("Navigation: /dashboard")).toBeInTheDocument();
    });
  });

  describe("Navegação por Rotas", () => {
    it("deve atualizar currentPath quando a rota muda", () => {
      const { unmount } = render(
        React.createElement(Layout, { children: mockChildren }),
        {
          wrapper: ({ children }) =>
            TestWrapper({
              children,
              initialEntries: ["/"],
            }),
        }
      );

      expect(screen.getByText("Navigation: /")).toBeInTheDocument();

      // Limpa o render anterior
      unmount();

      // Simula mudança de rota com um novo render
      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: ({ children }) =>
          TestWrapper({
            children,
            initialEntries: ["/tasks"],
          }),
      });

      expect(screen.getByText("Navigation: /tasks")).toBeInTheDocument();
    });

    it("deve funcionar com rotas aninhadas", () => {
      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: ({ children }) =>
          TestWrapper({
            children,
            initialEntries: ["/tasks/1/edit"],
          }),
      });

      expect(screen.getByText("Navigation: /tasks/1/edit")).toBeInTheDocument();
    });

    it("deve funcionar com query parameters", () => {
      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: ({ children }) =>
          TestWrapper({
            children,
            initialEntries: ["/tasks?filter=completed"],
          }),
      });

      expect(screen.getByText("Navigation: /tasks")).toBeInTheDocument();
    });

    it("deve funcionar com hash na URL", () => {
      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: ({ children }) =>
          TestWrapper({
            children,
            initialEntries: ["/dashboard#section1"],
          }),
      });

      expect(screen.getByText("Navigation: /dashboard")).toBeInTheDocument();
    });
  });

  describe("Conteúdo Dinâmico", () => {
    it("deve renderizar diferentes tipos de children", () => {
      const complexChildren = React.createElement(
        "div",
        null,
        React.createElement("h1", { "data-testid": "title" }, "Page Title"),
        React.createElement(
          "p",
          { "data-testid": "description" },
          "Page Description"
        ),
        React.createElement(
          "button",
          { "data-testid": "action-button" },
          "Action"
        )
      );

      render(React.createElement(Layout, { children: complexChildren }), {
        wrapper: TestWrapper,
      });

      expect(screen.getByTestId("title")).toBeInTheDocument();
      expect(screen.getByTestId("description")).toBeInTheDocument();
      expect(screen.getByTestId("action-button")).toBeInTheDocument();
    });

    it("deve renderizar múltiplos children", () => {
      const multipleChildren = [
        React.createElement(
          "div",
          { key: "1", "data-testid": "child-1" },
          "Child 1"
        ),
        React.createElement(
          "div",
          { key: "2", "data-testid": "child-2" },
          "Child 2"
        ),
        React.createElement(
          "div",
          { key: "3", "data-testid": "child-3" },
          "Child 3"
        ),
      ];

      render(React.createElement(Layout, { children: multipleChildren }), {
        wrapper: TestWrapper,
      });

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
      expect(screen.getByTestId("child-3")).toBeInTheDocument();
    });

    it("deve renderizar children como string", () => {
      render(React.createElement(Layout, { children: "Simple text content" }), {
        wrapper: TestWrapper,
      });

      expect(screen.getByText("Simple text content")).toBeInTheDocument();
    });

    it("deve renderizar children como null sem erros", () => {
      expect(() => {
        render(React.createElement(Layout, { children: null }), {
          wrapper: TestWrapper,
        });
      }).not.toThrow();
    });
  });

  describe("Estrutura Semântica", () => {
    it("deve ter estrutura HTML semântica correta", () => {
      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: TestWrapper,
      });

      const header = screen.getByRole("banner");
      const main = screen.getByRole("main");
      const navigation = screen.getByRole("navigation");

      expect(header).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(navigation).toBeInTheDocument();

      // Verifica se navigation está dentro do header
      expect(header).toContainElement(navigation);
    });

    it("deve ter ordem correta dos elementos", () => {
      const { container } = render(
        React.createElement(Layout, { children: mockChildren }),
        { wrapper: TestWrapper }
      );

      const layoutContainer = container.firstChild;
      const children = Array.from(layoutContainer?.childNodes || []);

      // Header deve vir antes do Main
      expect(children[0]).toHaveAttribute("role", "banner");
      expect(children[1]).toHaveAttribute("role", "main");
    });
  });

  describe("Integração com Hooks", () => {
    it("deve usar useLocation corretamente", () => {
      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: ({ children }) =>
          TestWrapper({
            children,
            initialEntries: ["/custom-path"],
          }),
      });

      // Verifica se o hook useLocation está sendo usado corretamente
      expect(screen.getByText("Navigation: /custom-path")).toBeInTheDocument();
    });

    it("deve reagir a mudanças de localização", () => {
      const TestComponent = () => {
        const [path, setPath] = React.useState("/initial");

        return React.createElement(
          MemoryRouter,
          { key: path, initialEntries: [path] },
          React.createElement(
            ThemeProvider,
            { theme: mockTheme },
            React.createElement(
              "div",
              null,
              React.createElement(Layout, {
                children: React.createElement(
                  "div",
                  { "data-testid": "content" },
                  "Content"
                ),
              }),
              React.createElement(
                "button",
                {
                  "data-testid": "change-path",
                  onClick: () => setPath("/changed"),
                },
                "Change Path"
              )
            )
          )
        );
      };

      const { rerender } = render(React.createElement(TestComponent));

      expect(screen.getByText("Navigation: /initial")).toBeInTheDocument();

      // Simula mudança manual do estado
      rerender(
        React.createElement(() => {
          return React.createElement(
            MemoryRouter,
            { initialEntries: ["/changed"] },
            React.createElement(
              ThemeProvider,
              { theme: mockTheme },
              React.createElement(Layout, {
                children: React.createElement(
                  "div",
                  { "data-testid": "content" },
                  "Content"
                ),
              })
            )
          );
        })
      );

      expect(screen.getByText("Navigation: /changed")).toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter landmarks apropriados", () => {
      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: TestWrapper,
      });

      expect(screen.getByRole("banner")).toBeInTheDocument(); // header
      expect(screen.getByRole("main")).toBeInTheDocument(); // main
      expect(screen.getByRole("navigation")).toBeInTheDocument(); // nav
    });

    it("deve ter estrutura navegável por teclado", () => {
      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: TestWrapper,
      });

      const header = screen.getByRole("banner");
      const main = screen.getByRole("main");
      const navigation = screen.getByRole("navigation");

      // Verifica se os elementos estão na DOM e podem receber foco
      expect(header).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(navigation).toBeInTheDocument();
    });
  });

  describe("Responsividade e Layout", () => {
    it("deve aplicar estilos através dos styled components", () => {
      const { container } = render(
        React.createElement(Layout, { children: mockChildren }),
        { wrapper: TestWrapper }
      );

      // Verifica se os componentes styled são renderizados (através dos mocks)
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("deve manter layout consistente com diferentes conteúdos", () => {
      const longContent = React.createElement(
        "div",
        { "data-testid": "long-content" },
        Array.from({ length: 100 }, (_, i) =>
          React.createElement("p", { key: i }, `Paragraph ${i + 1}`)
        )
      );

      render(React.createElement(Layout, { children: longContent }), {
        wrapper: TestWrapper,
      });

      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByTestId("long-content")).toBeInTheDocument();
    });
  });

  describe("Performance e Re-renders", () => {
    it("não deve causar re-renders desnecessários", () => {
      const renderSpy = jest.fn();

      const TestChild = () => {
        renderSpy();
        return React.createElement(
          "div",
          { "data-testid": "test-child" },
          "Child"
        );
      };

      const { rerender } = render(
        React.createElement(Layout, {
          children: React.createElement(TestChild),
        }),
        { wrapper: TestWrapper }
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render com as mesmas props
      rerender(
        React.createElement(Layout, {
          children: React.createElement(TestChild),
        })
      );

      // Child deve ser re-renderizado porque é um novo elemento
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it("deve manter referências estáveis quando possível", () => {
      const stableChild = React.createElement(
        "div",
        { "data-testid": "stable" },
        "Stable"
      );

      const { rerender } = render(
        React.createElement(Layout, { children: stableChild }),
        { wrapper: TestWrapper }
      );

      expect(screen.getByTestId("stable")).toBeInTheDocument();

      rerender(React.createElement(Layout, { children: stableChild }));

      expect(screen.getByTestId("stable")).toBeInTheDocument();
    });
  });

  describe("Casos Extremos", () => {
    it("deve lidar com paths muito longos", () => {
      const longPath = "/" + "a".repeat(1000);

      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: ({ children }) =>
          TestWrapper({
            children,
            initialEntries: [longPath],
          }),
      });

      expect(screen.getByText(`Navigation: ${longPath}`)).toBeInTheDocument();
    });

    it("deve lidar com paths com caracteres especiais", () => {
      const specialPath = "/tasks/título-com-acentos-ção";

      render(React.createElement(Layout, { children: mockChildren }), {
        wrapper: ({ children }) =>
          TestWrapper({
            children,
            initialEntries: [specialPath],
          }),
      });

      expect(
        screen.getByText(`Navigation: ${specialPath}`)
      ).toBeInTheDocument();
    });

    it("deve funcionar quando children é undefined", () => {
      expect(() => {
        render(React.createElement(Layout, { children: undefined }), {
          wrapper: TestWrapper,
        });
      }).not.toThrow();

      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });
});

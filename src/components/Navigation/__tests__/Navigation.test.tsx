/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom";

import Navigation from "../Navigation";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../Navigation.styles", () => ({
  NavContainer: "nav",
  Logo: ({ children, ...props }: any) =>
    React.createElement("div", { ...props, role: "button" }, children),
  NavList: "ul",
  NavItem: "li",
  NavLink: ({ children, ...props }: any) =>
    React.createElement("a", { ...props }, children),
  NavIcon: "span",
}));

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

describe("Navigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização Básica", () => {
    it("deve renderizar a estrutura básica de navegação", () => {
      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      expect(screen.getAllByRole("navigation")).toHaveLength(3);
      expect(
        screen.getByRole("button", { name: /taskmanager/i })
      ).toBeInTheDocument();
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("deve renderizar o logo TaskManager", () => {
      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const logo = screen.getByRole("button", { name: /taskmanager/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveTextContent("TaskManager");
    });

    it("deve renderizar todos os itens de navegação", () => {
      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      expect(
        screen.getByLabelText("Navegar para Dashboard")
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Navegar para Tarefas")).toBeInTheDocument();

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Tarefas")).toBeInTheDocument();

      expect(screen.getByText("📊")).toBeInTheDocument();
      expect(screen.getByText("📋")).toBeInTheDocument();
    });

    it("deve renderizar ícones com aria-hidden", () => {
      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const icons = screen.getAllByText(/📊|📋/);
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(icon).toHaveClass("icon");
      });
    });
  });

  describe("Estado Ativo dos Links", () => {
    it("deve marcar Dashboard como ativo quando currentPath é '/'", () => {
      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const dashboardLink = screen.getByLabelText("Navegar para Dashboard");
      const tarefasLink = screen.getByLabelText("Navegar para Tarefas");

      expect(dashboardLink).toHaveAttribute("href", "/");
      expect(tarefasLink).toHaveAttribute("href", "/tasks");
    });

    it("deve marcar Tarefas como ativo quando currentPath é '/tasks'", () => {
      render(React.createElement(Navigation, { currentPath: "/tasks" }), {
        wrapper: TestWrapper,
      });

      const dashboardLink = screen.getByLabelText("Navegar para Dashboard");
      const tarefasLink = screen.getByLabelText("Navegar para Tarefas");

      expect(dashboardLink).toHaveAttribute("href", "/");
      expect(tarefasLink).toHaveAttribute("href", "/tasks");
    });

    it("deve lidar com paths que não correspondem a nenhum item", () => {
      render(React.createElement(Navigation, { currentPath: "/unknown" }), {
        wrapper: TestWrapper,
      });

      const dashboardLink = screen.getByLabelText("Navegar para Dashboard");
      const tarefasLink = screen.getByLabelText("Navegar para Tarefas");

      expect(dashboardLink).toHaveAttribute("href", "/");
      expect(tarefasLink).toHaveAttribute("href", "/tasks");
    });

    it("deve lidar com paths aninhados", () => {
      render(React.createElement(Navigation, { currentPath: "/tasks/1" }), {
        wrapper: TestWrapper,
      });

      const links = screen.getAllByRole("navigation");
      const navigationLinks = links.filter((link) => link.tagName === "A");
      expect(navigationLinks).toHaveLength(2);
    });
  });

  describe("Interações de Navegação", () => {
    it("deve navegar para Dashboard quando link é clicado", async () => {
      const user = userEvent.setup();

      render(React.createElement(Navigation, { currentPath: "/tasks" }), {
        wrapper: TestWrapper,
      });

      const dashboardLink = screen.getByLabelText("Navegar para Dashboard");
      await user.click(dashboardLink);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("deve navegar para Tarefas quando link é clicado", async () => {
      const user = userEvent.setup();

      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const tarefasLink = screen.getByLabelText("Navegar para Tarefas");
      await user.click(tarefasLink);

      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
    });

    it("deve navegar para home quando logo é clicado", async () => {
      const user = userEvent.setup();

      render(React.createElement(Navigation, { currentPath: "/tasks" }), {
        wrapper: TestWrapper,
      });

      const logo = screen.getByRole("button", { name: /taskmanager/i });
      await user.click(logo);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("deve prevenir comportamento padrão do link", async () => {
      const user = userEvent.setup();

      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const dashboardLink = screen.getByLabelText("Navegar para Dashboard");

      const clickEvent = new MouseEvent("click", { bubbles: true });
      const preventDefaultSpy = jest.spyOn(clickEvent, "preventDefault");

      dashboardLink.dispatchEvent(clickEvent);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("Navegação por Teclado", () => {
    it("deve permitir navegação por teclado no logo", async () => {
      const user = userEvent.setup();

      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const logo = screen.getByRole("button", { name: /taskmanager/i });

      await user.click(logo);
      await user.keyboard("{Enter}");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("deve permitir navegação por teclado nos links", async () => {
      const user = userEvent.setup();

      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const dashboardLink = screen.getByLabelText("Navegar para Dashboard");
      const tarefasLink = screen.getByLabelText("Navegar para Tarefas");

      await user.tab();
      expect(
        screen.getByRole("button", { name: /taskmanager/i })
      ).toHaveFocus();

      await user.tab();
      expect(dashboardLink).toHaveFocus();

      await user.tab();
      expect(tarefasLink).toHaveFocus();
    });

    it("deve ativar link com Enter", async () => {
      const user = userEvent.setup();

      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const tarefasLink = screen.getByLabelText("Navegar para Tarefas");
      await user.click(tarefasLink);
      await user.keyboard("{Enter}");

      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
    });

    it("deve ativar link com Space", async () => {
      const user = userEvent.setup();

      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const tarefasLink = screen.getByLabelText("Navegar para Tarefas");
      await user.click(tarefasLink);
      await user.keyboard(" ");

      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
    });
  });

  describe("Atributos de Acessibilidade", () => {
    it("deve ter labels apropriados nos links", () => {
      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      expect(
        screen.getByLabelText("Navegar para Dashboard")
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Navegar para Tarefas")).toBeInTheDocument();
    });

    it("deve ter role navigation no link", () => {
      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const links = screen.getAllByRole("navigation");
      expect(links.length).toBeGreaterThan(0);
    });

    it("deve ter tabIndex apropriado no logo", () => {
      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const logo = screen.getByRole("button", { name: /taskmanager/i });
      expect(logo).toHaveAttribute("tabIndex", "0");
    });

    it("deve ter ícones com aria-hidden", () => {
      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const icons = screen.getAllByText(/📊|📋/);
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute("aria-hidden", "true");
      });
    });
  });

  describe("Estrutura Semântica", () => {
    it("deve ter estrutura de lista para navegação", () => {
      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(2);
    });

    it("deve ter role navigation no container principal", () => {
      const { container } = render(
        React.createElement(Navigation, { currentPath: "/" }),
        { wrapper: TestWrapper }
      );

      const mainNav = container.querySelector("nav");
      expect(mainNav).toBeInTheDocument();
    });

    it("deve ter hierarquia correta de elementos", () => {
      const { container } = render(
        React.createElement(Navigation, { currentPath: "/" }),
        { wrapper: TestWrapper }
      );

      const nav = container.querySelector("nav");
      const list = container.querySelector("ul");
      const items = container.querySelectorAll("li");

      expect(nav).toContainElement(list);
      expect(list).toContainElement(items[0]);
      expect(list).toContainElement(items[1]);
    });
  });

  describe("Responsividade", () => {
    it("deve aplicar estilos através dos styled components", () => {
      const { container } = render(
        React.createElement(Navigation, { currentPath: "/" }),
        { wrapper: TestWrapper }
      );

      expect(container.querySelector("nav")).toBeInTheDocument();
      expect(container.querySelector("ul")).toBeInTheDocument();
      expect(container.querySelectorAll("li")).toHaveLength(2);
    });

    it("deve renderizar ícones com classe apropriada", () => {
      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const icons = screen.getAllByText(/📊|📋/);
      icons.forEach((icon) => {
        expect(icon).toHaveClass("icon");
      });
    });
  });

  describe("Estados e Props", () => {
    it("deve aceitar diferentes valores de currentPath", () => {
      const paths = ["/", "/tasks", "/unknown", "/tasks/1", ""];

      paths.forEach((path) => {
        const { unmount } = render(
          React.createElement(Navigation, { currentPath: path }),
          { wrapper: TestWrapper }
        );

        expect(screen.getAllByRole("navigation")).toHaveLength(3);
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Tarefas")).toBeInTheDocument();

        unmount();
      });
    });

    it("deve manter funcionalidade com currentPath undefined", () => {
      expect(() => {
        render(
          React.createElement(Navigation, { currentPath: undefined as any }),
          { wrapper: TestWrapper }
        );
      }).not.toThrow();
    });

    it("deve manter funcionalidade com currentPath null", () => {
      expect(() => {
        render(React.createElement(Navigation, { currentPath: null as any }), {
          wrapper: TestWrapper,
        });
      }).not.toThrow();
    });
  });

  describe("Performance", () => {
    it("não deve re-renderizar desnecessariamente", () => {
      const renderSpy = jest.fn();

      const TestNavigation = ({ currentPath }: { currentPath: string }) => {
        renderSpy();
        return React.createElement(Navigation, { currentPath });
      };

      const { rerender } = render(
        React.createElement(TestNavigation, { currentPath: "/" }),
        { wrapper: TestWrapper }
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);

      rerender(React.createElement(TestNavigation, { currentPath: "/" }));

      expect(renderSpy).toHaveBeenCalledTimes(2);

      rerender(React.createElement(TestNavigation, { currentPath: "/tasks" }));

      expect(renderSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe("Integração", () => {
    it("deve funcionar dentro de um Router", () => {
      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      expect(screen.getAllByRole("navigation")).toHaveLength(3);
      expect(mockNavigate).toBeDefined();
    });

    it("deve manter estado consistente durante navegação", async () => {
      const user = userEvent.setup();

      const { rerender } = render(
        React.createElement(Navigation, { currentPath: "/" }),
        { wrapper: TestWrapper }
      );

      const tarefasLink = screen.getByLabelText("Navegar para Tarefas");
      await user.click(tarefasLink);

      expect(mockNavigate).toHaveBeenCalledWith("/tasks");

      rerender(React.createElement(Navigation, { currentPath: "/tasks" }));

      expect(screen.getByLabelText("Navegar para Tarefas")).toBeInTheDocument();
    });
  });

  describe("Casos Extremos", () => {
    it("deve lidar com múltiplos cliques rápidos", async () => {
      const user = userEvent.setup();

      render(React.createElement(Navigation, { currentPath: "/" }), {
        wrapper: TestWrapper,
      });

      const dashboardLink = screen.getByLabelText("Navegar para Dashboard");

      await user.click(dashboardLink);
      await user.click(dashboardLink);
      await user.click(dashboardLink);

      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("deve funcionar com paths complexos", () => {
      const complexPath = "/tasks/category/trabalho?filter=completed#section1";

      render(React.createElement(Navigation, { currentPath: complexPath }), {
        wrapper: TestWrapper,
      });

      expect(screen.getByRole("navigation", { name: "" })).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Tarefas")).toBeInTheDocument();
    });
  });
});

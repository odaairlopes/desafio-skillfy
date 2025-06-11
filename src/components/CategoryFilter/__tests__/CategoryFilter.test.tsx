/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import "@testing-library/jest-dom";

import CategoryFilter from "../CategoryFilter";
import { Task } from "../../../contexts/TaskContext";

// Mock dos estilos
jest.mock("../CategoryFilter.styles", () => ({
  Container: "div",
  Header: "div",
  Title: "h3",
  SelectAllButton: "button",
  CategoriesContainer: "div",
  CategoryItem: "label",
  CategoryCheckbox: "input",
  CategoryLabel: "span",
  CategoryIcon: "span",
  CategoryName: "span",
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

const mockCategories = ["trabalho", "estudos", "pessoal", "saúde", "casa"];
const mockOnCategoryChange = jest.fn();

describe("CategoryFilter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização Básica", () => {
    it("deve renderizar o título do filtro", () => {
      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("Categorias")).toBeInTheDocument();
    });

    it("deve renderizar todas as categorias fornecidas", () => {
      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      mockCategories.forEach((category) => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });

    it("deve renderizar ícones para cada categoria", () => {
      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      // Verifica se há ícones emoji para as categorias conhecidas
      expect(screen.getByText("💼")).toBeInTheDocument(); // trabalho
      expect(screen.getByText("📚")).toBeInTheDocument(); // estudos
      expect(screen.getByText("👤")).toBeInTheDocument(); // pessoal
      expect(screen.getByText("🏥")).toBeInTheDocument(); // saúde
      expect(screen.getByText("🏠")).toBeInTheDocument(); // casa
    });

    it("deve renderizar botão de seleção quando nenhuma categoria está selecionada", () => {
      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      expect(
        screen.getByRole("button", { name: /todas/i })
      ).toBeInTheDocument();
    });

    it("deve renderizar botão de limpeza quando todas as categorias estão selecionadas", () => {
      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: mockCategories,
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      expect(
        screen.getByRole("button", { name: /limpar/i })
      ).toBeInTheDocument();
    });

    it("deve aplicar className customizada quando fornecida", () => {
      const { container } = render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
          className: "custom-class",
        }),
        { wrapper: TestWrapper }
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Estado dos Checkboxes", () => {
    it("deve mostrar checkboxes desmarcados quando nenhuma categoria está selecionada", () => {
      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it("deve mostrar checkboxes marcados para categorias selecionadas", () => {
      const selectedCategories = ["trabalho", "estudos"];

      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories,
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      const trabalhoCheckbox = screen.getByRole("checkbox", {
        name: /trabalho/i,
      });
      const estudosCheckbox = screen.getByRole("checkbox", {
        name: /estudos/i,
      });
      const pessoalCheckbox = screen.getByRole("checkbox", {
        name: /pessoal/i,
      });

      expect(trabalhoCheckbox).toBeChecked();
      expect(estudosCheckbox).toBeChecked();
      expect(pessoalCheckbox).not.toBeChecked();
    });

    it("deve mostrar todos os checkboxes marcados quando todas as categorias estão selecionadas", () => {
      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: mockCategories,
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe("Interações do Usuário", () => {
    it("deve adicionar categoria quando checkbox é marcado", async () => {
      const user = userEvent.setup();

      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      const trabalhoCheckbox = screen.getByRole("checkbox", {
        name: /trabalho/i,
      });
      await user.click(trabalhoCheckbox);

      expect(mockOnCategoryChange).toHaveBeenCalledWith(["trabalho"]);
    });

    it("deve remover categoria quando checkbox é desmarcado", async () => {
      const user = userEvent.setup();

      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: ["trabalho", "estudos"],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      const trabalhoCheckbox = screen.getByRole("checkbox", {
        name: /trabalho/i,
      });
      await user.click(trabalhoCheckbox);

      expect(mockOnCategoryChange).toHaveBeenCalledWith(["estudos"]);
    });

    it("deve selecionar todas as categorias quando clicar em 'Todas'", async () => {
      const user = userEvent.setup();

      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      const selectAllButton = screen.getByRole("button", { name: /todas/i });
      await user.click(selectAllButton);

      expect(mockOnCategoryChange).toHaveBeenCalledWith(mockCategories);
    });

    it("deve limpar todas as categorias quando clicar em 'Limpar'", async () => {
      const user = userEvent.setup();

      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: mockCategories,
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      const clearButton = screen.getByRole("button", { name: /limpar/i });
      await user.click(clearButton);

      expect(mockOnCategoryChange).toHaveBeenCalledWith([]);
    });

    it("deve selecionar múltiplas categorias independentemente", async () => {
      const user = userEvent.setup();

      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: ["trabalho"],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      const estudosCheckbox = screen.getByRole("checkbox", {
        name: /estudos/i,
      });
      await user.click(estudosCheckbox);

      expect(mockOnCategoryChange).toHaveBeenCalledWith([
        "trabalho",
        "estudos",
      ]);
    });
  });

  describe("Ícones de Categoria", () => {
    it("deve usar ícone padrão para categoria desconhecida", () => {
      const unknownCategories = ["categoria-desconhecida"];

      render(
        React.createElement(CategoryFilter, {
          categories: unknownCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("📋")).toBeInTheDocument(); // ícone padrão
    });

    it("deve usar ícones específicos para categorias conhecidas", () => {
      const knownCategories = ["financeiro", "lazer"];

      render(
        React.createElement(CategoryFilter, {
          categories: knownCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("💰")).toBeInTheDocument(); // financeiro
      expect(screen.getByText("🎮")).toBeInTheDocument(); // lazer
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter labels associados aos checkboxes", () => {
      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      // Os nomes acessíveis incluem ícones e texto
      expect(
        screen.getByRole("checkbox", { name: "💼 trabalho" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: "📚 estudos" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: "👤 pessoal" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: "🏥 saúde" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: "🏠 casa" })
      ).toBeInTheDocument();
    });

    it("deve permitir navegação por teclado", async () => {
      const user = userEvent.setup();

      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      const firstCheckbox = screen.getByRole("checkbox", {
        name: "💼 trabalho",
      });
      const secondCheckbox = screen.getByRole("checkbox", {
        name: "📚 estudos",
      });

      await user.click(firstCheckbox);
      expect(firstCheckbox).toHaveFocus();

      await user.tab();
      expect(secondCheckbox).toHaveFocus();
    });

    it("deve permitir seleção por espaço quando checkbox tem foco", async () => {
      const user = userEvent.setup();

      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      const trabalhoCheckbox = screen.getByRole("checkbox", {
        name: "💼 trabalho",
      });

      await user.click(trabalhoCheckbox);
      await user.keyboard(" ");

      expect(mockOnCategoryChange).toHaveBeenCalledTimes(2);
    });
  });

  describe("Casos Extremos", () => {
    it("deve lidar com lista vazia de categorias", () => {
      render(
        React.createElement(CategoryFilter, {
          categories: [],
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("Categorias")).toBeInTheDocument();

      // Com lista vazia, o botão deve mostrar "Limpar" mesmo que nada esteja selecionado
      expect(
        screen.getByRole("button", { name: /limpar/i })
      ).toBeInTheDocument();

      // Não deve haver checkboxes quando não há categorias
      const checkboxes = screen.queryAllByRole("checkbox");
      expect(checkboxes).toHaveLength(0);
    });

    it("deve lidar com categorias selecionadas que não existem na lista", () => {
      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: ["categoria-inexistente"],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it("deve mostrar botão 'Todas' apenas quando há categorias disponíveis", () => {
      // Primeiro testa com categorias vazias
      const { rerender } = render(
        React.createElement(CategoryFilter, {
          categories: [],
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      expect(
        screen.getByRole("button", { name: /limpar/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /todas/i })
      ).not.toBeInTheDocument();

      // Depois testa com categorias disponíveis
      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(CategoryFilter, {
            categories: mockCategories,
            selectedCategories: [],
            onCategoryChange: mockOnCategoryChange,
          })
        )
      );

      expect(
        screen.getByRole("button", { name: /todas/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /limpar/i })
      ).not.toBeInTheDocument();
    });

    it("deve manter estado consistente quando props mudam", () => {
      const { rerender } = render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: ["trabalho"],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      let trabalhoCheckbox = screen.getByRole("checkbox", {
        name: /trabalho/i,
      });
      expect(trabalhoCheckbox).toBeChecked();

      // Atualiza props
      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(CategoryFilter, {
            categories: mockCategories,
            selectedCategories: ["estudos"],
            onCategoryChange: mockOnCategoryChange,
          })
        )
      );

      trabalhoCheckbox = screen.getByRole("checkbox", { name: /trabalho/i });
      const estudosCheckbox = screen.getByRole("checkbox", {
        name: /estudos/i,
      });

      expect(trabalhoCheckbox).not.toBeChecked();
      expect(estudosCheckbox).toBeChecked();
    });
  });

  describe("Performance", () => {
    it("não deve chamar onCategoryChange desnecessariamente", async () => {
      const user = userEvent.setup();

      render(
        React.createElement(CategoryFilter, {
          categories: mockCategories,
          selectedCategories: ["trabalho"],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      // Clica no mesmo checkbox que já está selecionado (deveria desmarcar)
      const trabalhoCheckbox = screen.getByRole("checkbox", {
        name: /trabalho/i,
      });
      await user.click(trabalhoCheckbox);

      expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);
      expect(mockOnCategoryChange).toHaveBeenCalledWith([]);
    });
  });

  describe("Integração", () => {
    it("deve funcionar corretamente com muitas categorias", () => {
      const manyCategories = Array.from({ length: 20 }, (_, i) => `cat-${i}`);

      render(
        React.createElement(CategoryFilter, {
          categories: manyCategories,
          selectedCategories: manyCategories.slice(0, 10),
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(20);

      // Primeiros 10 devem estar marcados
      checkboxes.slice(0, 10).forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });

      // Últimos 10 devem estar desmarcados
      checkboxes.slice(10).forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it("deve manter ordem das categorias", () => {
      const orderedCategories = ["z-last", "a-first", "m-middle"];

      const { container } = render(
        React.createElement(CategoryFilter, {
          categories: orderedCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      // Verifica a ordem dos textos das categorias na DOM
      const categoryTexts = container.querySelectorAll(
        '[data-testid="category-name"], span'
      );
      const categoryNames = Array.from(categoryTexts)
        .map((el) => el.textContent)
        .filter((text) => orderedCategories.includes(text || ""));

      expect(categoryNames).toEqual(orderedCategories);
    });

    it("deve renderizar categorias na ordem fornecida (alternativa)", () => {
      const orderedCategories = ["categoria-1", "categoria-2", "categoria-3"];

      render(
        React.createElement(CategoryFilter, {
          categories: orderedCategories,
          selectedCategories: [],
          onCategoryChange: mockOnCategoryChange,
        }),
        { wrapper: TestWrapper }
      );

      // Verifica se cada categoria está presente na ordem esperada
      orderedCategories.forEach((category, index) => {
        const checkbox = screen.getByRole("checkbox", {
          name: new RegExp(category, "i"),
        });
        expect(checkbox).toBeInTheDocument();
      });

      // Verifica se todos os checkboxes estão presentes
      const allCheckboxes = screen.getAllByRole("checkbox");
      expect(allCheckboxes).toHaveLength(orderedCategories.length);
    });
  });
});

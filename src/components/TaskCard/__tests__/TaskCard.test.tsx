import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import "@testing-library/jest-dom";

import { Task } from "../../../contexts/TaskContext";
import TaskCard from "../TaskCard";

// Mock todos os styled-components
jest.mock("../TaskCard.styles", () => ({
  CardContainer: "div",
  CardContent: "div",
  Header: "div",
  HeaderContent: "div",
  Title: "h3",
  Description: "p",
  InfoSection: "div",
  CategoryIcon: "span",
  CategoryBadge: "span",
  CompletedBadge: "span",
  DetailsSection: "div",
  DetailRow: "div",
  DateSpan: "span",
  SuggestedTime: "div",
  ActionsSection: "div",
  ActionButton: "button",
  ScreenReaderOnly: "span",
}));

// Mock simples do PriorityBadge
jest.mock("../../PriorityBadge/PriorityBadge", () => {
  const MockPriorityBadge = (props: any) => {
    return React.createElement(
      "span",
      { "data-testid": "priority-badge" },
      props.priority
    );
  };
  MockPriorityBadge.displayName = "MockPriorityBadge";
  return MockPriorityBadge;
});

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
  },
};

const createThemeWrapper =
  (theme: any) =>
  ({ children }: { children: React.ReactNode }) => {
    return React.createElement(ThemeProvider, { theme }, children);
  };

describe("TaskCard", () => {
  const mockTask: Task = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    category: "trabalho",
    priority: "high",
    completed: false,
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2023-06-01T10:00:00Z",
    dueDate: "2023-06-15T23:59:59Z",
    estimatedDuration: 120,
  };

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onToggleComplete: jest.fn(),
    onCardClick: jest.fn(),
  };

  const ThemeWrapper = createThemeWrapper(mockTheme);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização Básica", () => {
    it("deve renderizar título e descrição da tarefa", () => {
      render(
        React.createElement(TaskCard, { task: mockTask, ...mockHandlers }),
        { wrapper: ThemeWrapper }
      );

      expect(screen.getByText("Test Task")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("deve renderizar o badge de prioridade", () => {
      render(
        React.createElement(TaskCard, { task: mockTask, ...mockHandlers }),
        { wrapper: ThemeWrapper }
      );

      expect(screen.getByTestId("priority-badge")).toBeInTheDocument();
    });

    it("deve renderizar ícone e badge da categoria", () => {
      render(
        React.createElement(TaskCard, { task: mockTask, ...mockHandlers }),
        { wrapper: ThemeWrapper }
      );

      expect(screen.getByText("💼")).toBeInTheDocument();
      expect(screen.getByText("trabalho")).toBeInTheDocument();
    });
  });

  describe("Ações do Usuário", () => {
    it("deve chamar onCardClick quando o card é clicado", async () => {
      const user = userEvent.setup();
      render(
        React.createElement(TaskCard, { task: mockTask, ...mockHandlers }),
        { wrapper: ThemeWrapper }
      );

      // Buscar especificamente pelo card usando o aria-label
      const card = screen.getByLabelText(/Ver detalhes da tarefa: Test Task/);
      await user.click(card);

      expect(mockHandlers.onCardClick).toHaveBeenCalledWith("1");
    });

    it("deve chamar onToggleComplete quando botão concluir é clicado", async () => {
      const user = userEvent.setup();
      render(
        React.createElement(TaskCard, { task: mockTask, ...mockHandlers }),
        { wrapper: ThemeWrapper }
      );

      const completeButton = screen.getByText("✓ Concluir");
      await user.click(completeButton);

      expect(mockHandlers.onToggleComplete).toHaveBeenCalledWith("1");
    });
  });

  describe("Formatação de Duração", () => {
    it("deve formatar duração em horas e minutos", () => {
      render(
        React.createElement(TaskCard, { task: mockTask, ...mockHandlers }),
        { wrapper: ThemeWrapper }
      );

      expect(screen.getByText("⏱️ 2h 0min")).toBeInTheDocument();
    });
  });
});

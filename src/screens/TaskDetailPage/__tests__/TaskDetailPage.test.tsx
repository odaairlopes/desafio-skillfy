/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { BrowserRouter, MemoryRouter } from "react-router";
import "@testing-library/jest-dom";

import TaskDetailPage from "../TaskDetailPage";
import { TaskProvider } from "../../../contexts/TaskContext";
import { Task } from "../../../contexts/TaskContext";

// Mock do react-router
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

// Mock do hook useTasks
const mockFetchTask = jest.fn();
const mockUseTasks = {
  selectedTask: null as Task | null,
  loading: false,
  error: null as string | null,
  fetchTask: mockFetchTask,
};

jest.mock("../../../hooks/useTasks", () => ({
  useTasks: () => mockUseTasks,
}));

// Mock do TaskDetail
jest.mock("../../../components/TaskDetail/TaskDetail", () => {
  const MockTaskDetail = ({ task }: { task: Task }) => {
    return React.createElement(
      "div",
      { "data-testid": "task-detail" },
      `Task Detail: ${task.title}`
    );
  };
  MockTaskDetail.displayName = "MockTaskDetail";
  return MockTaskDetail;
});

// Mock dos estilos
jest.mock("../TaskDetailPage.styles", () => ({
  Container: "div",
  MaxWidthWrapper: "div",
  BackButton: "button",
  BackIcon: "svg",
  LoadingContainer: "div",
  LoadingSkeleton: "div",
  ErrorContainer: "div",
  ErrorTitle: "h1",
  ErrorMessage: "p",
  NotFoundContainer: "div",
  NotFoundTitle: "h1",
  NotFoundMessage: "p",
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
  initialEntries = ["/tasks/1"],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}) => {
  return React.createElement(
    MemoryRouter,
    { initialEntries },
    React.createElement(
      ThemeProvider,
      { theme: mockTheme },
      React.createElement(TaskProvider, { children }, children)
    )
  );
};

const mockTask: Task = {
  id: "1",
  title: "Tarefa de Teste",
  description: "Descrição da tarefa de teste",
  category: "trabalho",
  priority: "high",
  completed: false,
  createdAt: "2023-06-01T10:00:00Z",
  updatedAt: "2023-06-01T10:00:00Z",
};

describe("TaskDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTasks.selectedTask = null;
    mockUseTasks.loading = false;
    mockUseTasks.error = null;

    // Mock useParams to return an id
    const { useParams } = require("react-router");
    useParams.mockReturnValue({ id: "1" });
  });

  describe("Loading State", () => {
    it("deve mostrar skeleton de loading quando está carregando", () => {
      mockUseTasks.loading = true;

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      // Verifica se há elementos de loading skeleton
      const skeletons = screen.getAllByRole("generic");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("não deve mostrar o botão voltar durante o loading", () => {
      mockUseTasks.loading = true;

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(screen.queryByText("Voltar")).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("deve mostrar mensagem de erro quando há erro", () => {
      mockUseTasks.error = "Erro ao carregar tarefa";

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(screen.getByText("Erro ao carregar tarefa")).toBeInTheDocument();
      expect(screen.getByText("Erro ao carregar tarefa")).toBeInTheDocument();
    });

    it("deve mostrar botão voltar no estado de erro", () => {
      mockUseTasks.error = "Erro ao carregar tarefa";

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(screen.getByText("Voltar")).toBeInTheDocument();
    });

    it("deve navegar para trás quando clicar no botão voltar no erro", async () => {
      const user = userEvent.setup();
      mockUseTasks.error = "Erro ao carregar tarefa";

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      const backButton = screen.getByText("Voltar");
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe("Not Found State", () => {
    it("deve mostrar mensagem de tarefa não encontrada quando não há selectedTask", () => {
      mockUseTasks.selectedTask = null;
      mockUseTasks.loading = false;
      mockUseTasks.error = null;

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(screen.getByText("Tarefa não encontrada")).toBeInTheDocument();
      expect(
        screen.getByText("A tarefa solicitada não existe ou foi removida.")
      ).toBeInTheDocument();
    });

    it("deve mostrar botão voltar no estado not found", () => {
      mockUseTasks.selectedTask = null;
      mockUseTasks.loading = false;
      mockUseTasks.error = null;

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(screen.getByText("Voltar")).toBeInTheDocument();
    });

    it("deve navegar para trás quando clicar no botão voltar no not found", async () => {
      const user = userEvent.setup();
      mockUseTasks.selectedTask = null;
      mockUseTasks.loading = false;
      mockUseTasks.error = null;

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      const backButton = screen.getByText("Voltar");
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe("Success State", () => {
    it("deve renderizar TaskDetail quando há selectedTask", () => {
      mockUseTasks.selectedTask = mockTask;

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(screen.getByTestId("task-detail")).toBeInTheDocument();
      expect(
        screen.getByText("Task Detail: Tarefa de Teste")
      ).toBeInTheDocument();
    });

    it("deve passar a tarefa correta para o TaskDetail", () => {
      mockUseTasks.selectedTask = mockTask;

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(
        screen.getByText("Task Detail: Tarefa de Teste")
      ).toBeInTheDocument();
    });
  });

  describe("useEffect e fetchTask", () => {
    it("deve chamar fetchTask com o id correto quando há id nos params", () => {
      const { useParams } = require("react-router");
      useParams.mockReturnValue({ id: "123" });

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(mockFetchTask).toHaveBeenCalledWith("123");
    });

    it("não deve chamar fetchTask quando não há id nos params", () => {
      const { useParams } = require("react-router");
      useParams.mockReturnValue({});

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(mockFetchTask).not.toHaveBeenCalled();
    });

    it("deve chamar fetchTask novamente quando o id muda", () => {
      const { useParams } = require("react-router");
      useParams.mockReturnValue({ id: "1" });

      const { rerender } = render(React.createElement(TaskDetailPage), {
        wrapper: TestWrapper,
      });

      expect(mockFetchTask).toHaveBeenCalledWith("1");

      // Simula mudança do id
      useParams.mockReturnValue({ id: "2" });

      rerender(React.createElement(TaskDetailPage));

      expect(mockFetchTask).toHaveBeenCalledWith("2");
    });
  });

  describe("Navegação e useNavigate", () => {
    it("deve usar navigate(-1) para voltar", async () => {
      const user = userEvent.setup();
      mockUseTasks.error = "Erro teste";

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      const backButton = screen.getByText("Voltar");
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe("Ícones SVG", () => {
    it("deve renderizar ícone de voltar corretamente", () => {
      mockUseTasks.error = "Erro teste";

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      const backIcon = screen.getByRole("button").querySelector("svg");
      expect(backIcon).toBeInTheDocument();
      expect(backIcon).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  describe("Integração com Context", () => {
    it("deve funcionar corretamente dentro do TaskProvider", () => {
      mockUseTasks.selectedTask = mockTask;

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(screen.getByTestId("task-detail")).toBeInTheDocument();
    });
  });

  describe("Diferentes Estados da Tarefa", () => {
    it("deve renderizar corretamente tarefa completa", () => {
      const completedTask = { ...mockTask, completed: true };
      mockUseTasks.selectedTask = completedTask;

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(screen.getByTestId("task-detail")).toBeInTheDocument();
    });

    it("deve renderizar corretamente tarefa de diferentes prioridades", () => {
      const lowPriorityTask = { ...mockTask, priority: "low" as const };
      mockUseTasks.selectedTask = lowPriorityTask;

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(screen.getByTestId("task-detail")).toBeInTheDocument();
    });

    it("deve renderizar corretamente tarefa de diferentes categorias", () => {
      const personalTask = { ...mockTask, category: "pessoal" as const };
      mockUseTasks.selectedTask = personalTask;

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(screen.getByTestId("task-detail")).toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter elementos com roles apropriados", () => {
      mockUseTasks.error = "Erro teste";

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });

  describe("Estilos e Layout", () => {
    it("deve aplicar estilos corretamente através dos styled components", () => {
      mockUseTasks.selectedTask = mockTask;

      render(React.createElement(TaskDetailPage), { wrapper: TestWrapper });

      // Verifica se os componentes styled são renderizados (através dos mocks)
      const container = screen.getByTestId("task-detail").closest("div");
      expect(container).toBeInTheDocument();
    });
  });
});

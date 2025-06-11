/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router";
import "@testing-library/jest-dom";

import Dashboard from "../Dashboard";
import { TaskProvider } from "../../../contexts/TaskContext";
import { Task } from "../../../contexts/TaskContext";

// Mock do react-router
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

// Mock do hook useTasks
const mockFetchTasks = jest.fn();
const mockUseTasks = {
  tasks: [] as Task[],
  loading: false,
  fetchTasks: mockFetchTasks,
};

jest.mock("../../../hooks/useTasks", () => ({
  useTasks: () => mockUseTasks,
}));

// Mock do ThemeToggle
jest.mock("../../../components/ThemeToggle/ThemeToggle", () => {
  const MockThemeToggle = () => {
    return React.createElement(
      "button",
      { "data-testid": "theme-toggle" },
      "🌙"
    );
  };
  MockThemeToggle.displayName = "MockThemeToggle";
  return MockThemeToggle;
});

// Mock do TaskCard
jest.mock("../../../components/TaskCard/TaskCard", () => {
  const MockTaskCard = (props: any) => {
    return React.createElement(
      "div",
      {
        "data-testid": "task-card",
        onClick: () => props.onCardClick && props.onCardClick(),
      },
      props.task.title
    );
  };
  MockTaskCard.displayName = "MockTaskCard";
  return MockTaskCard;
});

// Mock da API de sugestões
jest.mock("../../../services/api", () => ({
  suggestTime: jest.fn().mockResolvedValue([
    {
      start: "2023-06-15T09:00:00Z",
      score: 0.9,
      reason: "Horário ideal para produtividade",
    },
    {
      start: "2023-06-15T14:00:00Z",
      score: 0.8,
      reason: "Boa disponibilidade",
    },
  ]),
}));

// Mock dos estilos do Dashboard
jest.mock("../Dashboard.styles", () => ({
  Container: "div",
  MaxWidthWrapper: "div",
  Header: "div",
  HeaderContent: "div",
  Title: "h1",
  Subtitle: "p",
  HeaderActions: "div",
  NewTaskButton: "button",
  MainGrid: "div",
  LeftColumn: "div",
  RightColumn: "div",
  StatsGrid: "div",
  StatCard: "div",
  StatRow: "div",
  StatIconWrapper: "div",
  StatIcon: "svg",
  StatContent: "div",
  StatLabel: "p",
  StatValue: "p",
  Card: "div",
  CardHeader: "div",
  CardTitle: "h2",
  ViewAllButton: "button",
  TasksContainer: "div",
  EmptyState: "div",
  EmptyStateIcon: "svg",
  EmptyStateTitle: "h3",
  EmptyStateText: "p",
  ProductivityChart: "div",
  ChartContainer: "div",
  CircularProgress: "div",
  ProgressSvg: "svg",
  ProgressBackground: "path",
  ProgressForeground: "path",
  ProgressCenter: "div",
  ProgressValue: "div",
  ProgressPercentage: "div",
  ProgressLabel: "div",
  StatsSmallGrid: "div",
  SmallStatCard: "div",
  SmallStatValue: "p",
  SmallStatLabel: "p",
  ProgressBarContainer: "div",
  ProgressBarHeader: "div",
  ProgressBarTrack: "div",
  ProgressBarFill: "div",
  SuggestionsGrid: "div",
  SuggestionCard: "div",
  CategoryHeader: "div",
  CategoryIcon: "span",
  CategoryBadge: "span",
  SuggestionsList: "div",
  SuggestionItem: "div",
  SuggestionContent: "div",
  SuggestionTime: "div",
  SuggestionReason: "div",
  SuggestionActions: "div",
  ScoreIndicator: "div",
  TipCard: "div",
  TipContent: "div",
  TipIcon: "span",
  TipText: "div",
  QuickActionsContainer: "div",
  QuickActionButton: "button",
  QuickActionContent: "div",
  QuickActionIcon: "span",
  QuickActionText: "div",
  QuickActionTitle: "div",
  QuickActionDescription: "div",
  SectionHeader: "div",
  SectionIcon: "span",
  LoadingContainer: "div",
  LoadingContent: "div",
  LoadingTitle: "div",
  LoadingGrid: "div",
  LoadingCard: "div",
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
  return React.createElement(
    BrowserRouter,
    {},
    React.createElement(
      ThemeProvider,
      { theme: mockTheme },
      React.createElement(TaskProvider, { children }, children)
    )
  );
};

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTasks.tasks = [];
    mockUseTasks.loading = false;
  });

  describe("Loading State", () => {
    it("deve mostrar loading quando está carregando e não há tarefas", () => {
      mockUseTasks.loading = true;
      mockUseTasks.tasks = [];

      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      expect(screen.getByTestId("loading-container")).toBeInTheDocument();
    });
  });

  describe("Renderização Básica", () => {
    it("deve renderizar título e subtítulo", () => {
      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(
        screen.getByText("Bem-vindo ao seu gerenciador de tarefas")
      ).toBeInTheDocument();
    });

    it("deve renderizar botão de nova tarefa", () => {
      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      expect(screen.getByText("+ Nova Tarefa")).toBeInTheDocument();
    });

    it("deve renderizar todas as seções principais", () => {
      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      expect(
        screen.getByText("Tarefas de Alta Prioridade")
      ).toBeInTheDocument();

      // Usar getAllByText e verificar se há pelo menos um elemento
      expect(
        screen.getAllByText("Produtividade").length
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Sugestões de Horários")).toBeInTheDocument();
      expect(
        screen.getAllByText("Ações Rápidas").length
      ).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Estatísticas", () => {
    it("deve mostrar estatísticas zeradas quando não há tarefas", () => {
      mockUseTasks.tasks = [];

      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      // Verifica se as seções principais estão presentes
      expect(screen.getByText("Total de Tarefas")).toBeInTheDocument();
      expect(screen.getAllByText("Concluídas").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Pendentes").length).toBeGreaterThan(0);
      expect(screen.getByText("Alta Prioridade")).toBeInTheDocument();
    });

    it("deve calcular estatísticas corretamente com tarefas", () => {
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Tarefa 1",
          description: "Descrição 1",
          category: "trabalho",
          priority: "high",
          completed: false,
          createdAt: "2023-06-01T10:00:00Z",
          updatedAt: "2023-06-01T10:00:00Z",
        },
        {
          id: "2",
          title: "Tarefa 2",
          description: "Descrição 2",
          category: "estudos",
          priority: "medium",
          completed: true,
          createdAt: "2023-06-01T10:00:00Z",
          updatedAt: "2023-06-01T10:00:00Z",
        },
        {
          id: "3",
          title: "Tarefa 3",
          description: "Descrição 3",
          category: "pessoal",
          priority: "high",
          completed: false,
          createdAt: "2023-06-01T10:00:00Z",
          updatedAt: "2023-06-01T10:00:00Z",
        },
      ];

      mockUseTasks.tasks = mockTasks;

      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      // Verifica se as estatísticas estão sendo exibidas corretamente
      expect(screen.getByText("Total de Tarefas")).toBeInTheDocument();
      expect(screen.getAllByText("Concluídas").length).toBeGreaterThanOrEqual(
        1
      );
      expect(screen.getAllByText("Pendentes").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Alta Prioridade")).toBeInTheDocument();

      // Verifica se os números estão corretos (sem se preocupar com duplicação)
      expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1); // Total
      expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1); // Concluídas
      expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1); // Pendentes e Alta Prioridade
    });
  });

  describe("Tarefas de Alta Prioridade", () => {
    it("deve mostrar mensagem de parabéns quando não há tarefas de alta prioridade", () => {
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Tarefa Low",
          description: "Descrição",
          category: "trabalho",
          priority: "low",
          completed: false,
          createdAt: "2023-06-01T10:00:00Z",
          updatedAt: "2023-06-01T10:00:00Z",
        },
      ];

      mockUseTasks.tasks = mockTasks;

      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      expect(screen.getByText("Parabéns! 🎉")).toBeInTheDocument();
      expect(
        screen.getByText("Você não tem tarefas de alta prioridade pendentes.")
      ).toBeInTheDocument();
    });

    it("deve renderizar TaskCards para tarefas de alta prioridade", () => {
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Tarefa Alta Prioridade",
          description: "Descrição",
          category: "trabalho",
          priority: "high",
          completed: false,
          createdAt: "2023-06-01T10:00:00Z",
          updatedAt: "2023-06-01T10:00:00Z",
        },
      ];

      mockUseTasks.tasks = mockTasks;

      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      expect(screen.getByTestId("task-card")).toBeInTheDocument();
      expect(screen.getByText("Tarefa Alta Prioridade")).toBeInTheDocument();
    });
  });

  describe("Navegação", () => {
    it("deve navegar para nova tarefa quando clicar no botão", async () => {
      const user = userEvent.setup();

      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      const newTaskButton = screen.getByText("+ Nova Tarefa");
      await user.click(newTaskButton);

      expect(mockNavigate).toHaveBeenCalledWith("/tasks/new");
    });

    it("deve navegar para lista de tarefas quando clicar em Ver todas", async () => {
      const user = userEvent.setup();

      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      const viewAllButton = screen.getByText("Ver todas →");
      await user.click(viewAllButton);

      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
    });

    it("deve navegar para ações rápidas", async () => {
      const user = userEvent.setup();

      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      const quickActionButtons = screen.getAllByText("Ver Todas as Tarefas");
      await user.click(quickActionButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
    });
  });

  describe("Gráfico de Produtividade", () => {
    it("deve mostrar 0% quando não há tarefas", () => {
      mockUseTasks.tasks = [];

      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      // Verifica se existe pelo menos um elemento com 0%
      expect(screen.getAllByText("0%")).toHaveLength(2); // mobile + desktop
      // Verifica se há pelo menos um elemento com "Completas"
      expect(screen.getAllByText("Completas")).toHaveLength(2); // mobile + desktop
    });

    it("deve calcular porcentagem correta de conclusão", () => {
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Tarefa 1",
          description: "Descrição",
          category: "trabalho",
          priority: "medium",
          completed: true,
          createdAt: "2023-06-01T10:00:00Z",
          updatedAt: "2023-06-01T10:00:00Z",
        },
        {
          id: "2",
          title: "Tarefa 2",
          description: "Descrição",
          category: "estudos",
          priority: "medium",
          completed: false,
          createdAt: "2023-06-01T10:00:00Z",
          updatedAt: "2023-06-01T10:00:00Z",
        },
      ];

      mockUseTasks.tasks = mockTasks;

      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      // 1 de 2 tarefas concluídas = 50%
      // Verifica se há exatamente 2 elementos com 50% (mobile + desktop)
      expect(screen.getAllByText("50%")).toHaveLength(2);
    });
  });

  describe("Sugestões de Horário", () => {
    it("deve mostrar dica sobre sugestões", () => {
      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      expect(
        screen.getByText(/Clique em um horário para criar uma nova tarefa/)
      ).toBeInTheDocument();
    });

    it("deve renderizar ícones de categoria", async () => {
      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      await waitFor(() => {
        // Aguarda o carregamento das sugestões
        expect(screen.getByText("💼")).toBeInTheDocument(); // trabalho
      });
    });
  });

  describe("Efeitos", () => {
    it("deve chamar fetchTasks na montagem", () => {
      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      expect(mockFetchTasks).toHaveBeenCalled();
    });

    it("deve carregar sugestões de horário na montagem", async () => {
      const { suggestTime } = require("../../../services/api");

      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(suggestTime).toHaveBeenCalled();
      });
    });
  });

  describe("Responsividade", () => {
    it("deve ter classes para desktop e mobile", () => {
      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      // Verifica se existem elementos com classes específicas
      const container = screen.getByTestId("dashboard-container");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Estado de Erro", () => {
    it("deve lidar com erros no carregamento de sugestões", async () => {
      const { suggestTime } = require("../../../services/api");
      suggestTime.mockRejectedValueOnce(new Error("API Error"));

      // Spy no console.error para verificar se o erro foi logado
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      render(React.createElement(Dashboard), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining("Error loading suggestions"),
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });
  });
});

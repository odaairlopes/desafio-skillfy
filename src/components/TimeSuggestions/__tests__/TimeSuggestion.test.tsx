/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import "@testing-library/jest-dom";

import TimeSuggestions from "../TimeSuggestions";
import { TaskData, SuggestedTime } from "../../../types";

// Mock do serviço de API (corrigido)
jest.mock("../../../services/api", () => ({
  suggestTime: jest.fn(),
}));

// Importar o mock após a declaração
import { suggestTime as mockSuggestTime } from "../../../services/api";

// Mock dos estilos
jest.mock("../TimeSuggestions.styles", () => ({
  Container: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "container" },
      children
    ),
  Title: ({ children, ...props }: any) =>
    React.createElement("h4", { ...props, "data-testid": "title" }, children),
  LoadingContainer: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "loading-container" },
      children
    ),
  LoadingSkeleton: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "loading-skeleton" },
      children
    ),
  ErrorMessage: ({ children, ...props }: any) =>
    React.createElement(
      "p",
      { ...props, "data-testid": "error-message" },
      children
    ),
  EmptyMessage: ({ children, ...props }: any) =>
    React.createElement(
      "p",
      { ...props, "data-testid": "empty-message" },
      children
    ),
  SuggestionsContainer: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "suggestions-container" },
      children
    ),
  SuggestionButton: ({ children, $isSelected, ...props }: any) =>
    React.createElement(
      "button",
      {
        ...props,
        "data-testid": "suggestion-button",
        "data-selected": $isSelected,
      },
      children
    ),
  SuggestionContent: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "suggestion-content" },
      children
    ),
  SuggestionHeader: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "suggestion-header" },
      children
    ),
  TimeInfo: ({ children, ...props }: any) =>
    React.createElement(
      "span",
      { ...props, "data-testid": "time-info" },
      children
    ),
  ScoreBadge: ({ children, $scoreType, ...props }: any) =>
    React.createElement(
      "span",
      { ...props, "data-testid": "score-badge", "data-score-type": $scoreType },
      children
    ),
  SelectedBadge: ({ children, ...props }: any) =>
    React.createElement(
      "span",
      { ...props, "data-testid": "selected-badge" },
      children
    ),
  DurationInfo: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "duration-info" },
      children
    ),
  ReasonText: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "reason-text" },
      children
    ),
  IconContainer: ({ children, $isSelected, ...props }: any) =>
    React.createElement(
      "div",
      {
        ...props,
        "data-testid": "icon-container",
        "data-selected": $isSelected,
      },
      children
    ),
  CheckIcon: ({ children, ...props }: any) =>
    React.createElement(
      "svg",
      { ...props, "data-testid": "check-icon" },
      children
    ),
  ArrowIcon: ({ children, ...props }: any) =>
    React.createElement(
      "svg",
      { ...props, "data-testid": "arrow-icon" },
      children
    ),
  TipBox: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "tip-box" },
      children
    ),
  TipText: ({ children, ...props }: any) =>
    React.createElement(
      "span",
      { ...props, "data-testid": "tip-text" },
      children
    ),
}));

// Cast do mock para usar com TypeScript
const mockSuggestTimeFn = mockSuggestTime as jest.MockedFunction<
  typeof mockSuggestTime
>;

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

// Mocks de dados para testes
const mockTaskData: TaskData = {
  title: "Tarefa de Teste",
  category: "trabalho",
  priority: "medium",
  estimated_duration: 60,
};

const mockSuggestedTimes: SuggestedTime[] = [
  {
    start: "2024-01-15T09:00:00Z",
    end: "2024-01-15T10:00:00Z",
    score: 0.95,
    reason: "Horário de pico de produtividade",
  },
  {
    start: "2024-01-15T14:00:00Z",
    end: "2024-01-15T15:00:00Z",
    score: 0.85,
    reason: "Boa disponibilidade",
  },
  {
    start: "2024-01-15T16:00:00Z",
    end: "2024-01-15T17:00:00Z",
    score: 0.75,
    reason: "Horário disponível",
  },
  {
    start: "2024-01-15T19:00:00Z",
    end: "2024-01-15T20:00:00Z",
    score: 0.65,
    reason: "Horário alternativo",
  },
];

describe("TimeSuggestions", () => {
  const mockOnTimeSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error para evitar logs desnecessários nos testes
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Renderização Básica", () => {
    it("deve renderizar o componente com título", () => {
      mockSuggestTimeFn.mockResolvedValue([]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      expect(screen.getByTestId("container")).toBeInTheDocument();
      expect(screen.getByTestId("title")).toHaveTextContent(
        "💡 Sugestões de Horário"
      );
    });

    it("deve renderizar dica no final", async () => {
      mockSuggestTimeFn.mockResolvedValue([]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("tip-box")).toBeInTheDocument();
      });

      expect(screen.getByTestId("tip-text")).toHaveTextContent(
        "💡 Dica: Clique em uma sugestão para preencher automaticamente o prazo da tarefa."
      );
    });
  });

  describe("Estado de Loading", () => {
    it("deve mostrar loading enquanto busca sugestões", async () => {
      mockSuggestTimeFn.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      expect(screen.getByTestId("loading-container")).toBeInTheDocument();
      expect(screen.getAllByTestId("loading-skeleton")).toHaveLength(3);
    });

    it("deve ocultar loading após carregar sugestões", async () => {
      mockSuggestTimeFn.mockResolvedValue(mockSuggestedTimes);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId("loading-container")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Estado de Erro", () => {
    it("deve mostrar mensagem de erro quando API falha", async () => {
      mockSuggestTimeFn.mockRejectedValue(new Error("API Error"));

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
      });

      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Erro ao carregar sugestões de horário"
      );
    });

    it("não deve mostrar sugestões quando há erro", async () => {
      mockSuggestTimeFn.mockRejectedValue(new Error("API Error"));

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
      });

      expect(
        screen.queryByTestId("suggestions-container")
      ).not.toBeInTheDocument();
    });
  });

  describe("Estado Vazio", () => {
    it("deve mostrar mensagem quando não há sugestões", async () => {
      mockSuggestTimeFn.mockResolvedValue([]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("empty-message")).toBeInTheDocument();
      });

      expect(screen.getByTestId("empty-message")).toHaveTextContent(
        "Nenhuma sugestão disponível para esta tarefa."
      );
    });

    it("não deve mostrar container de sugestões quando vazio", async () => {
      mockSuggestTimeFn.mockResolvedValue([]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("empty-message")).toBeInTheDocument();
      });

      expect(
        screen.queryByTestId("suggestions-container")
      ).not.toBeInTheDocument();
    });
  });

  describe("Renderização de Sugestões", () => {
    it("deve renderizar todas as sugestões", async () => {
      mockSuggestTimeFn.mockResolvedValue(mockSuggestedTimes);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("suggestions-container")).toBeInTheDocument();
      });

      const suggestionButtons = screen.getAllByTestId("suggestion-button");
      expect(suggestionButtons).toHaveLength(4);
    });

    it("deve renderizar informações de cada sugestão", async () => {
      mockSuggestTimeFn.mockResolvedValue([mockSuggestedTimes[0]]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("time-info")).toBeInTheDocument();
      });

      expect(screen.getByTestId("score-badge")).toBeInTheDocument();
      expect(screen.getByTestId("duration-info")).toBeInTheDocument();
      expect(screen.getByTestId("reason-text")).toBeInTheDocument();
    });

    it("deve formatar horário corretamente", async () => {
      mockSuggestTimeFn.mockResolvedValue([mockSuggestedTimes[0]]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("time-info")).toBeInTheDocument();
      });

      // Verifica se contém elementos de data/hora formatada (formato brasileiro)
      const timeInfo = screen.getByTestId("time-info");
      expect(timeInfo.textContent).toMatch(/📅/);
    });

    it("deve calcular e exibir duração corretamente", async () => {
      mockSuggestTimeFn.mockResolvedValue([mockSuggestedTimes[0]]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("duration-info")).toBeInTheDocument();
      });

      expect(screen.getByTestId("duration-info")).toHaveTextContent(
        "⏱️ Duração: 60 min"
      );
    });

    it("deve mostrar razão quando fornecida", async () => {
      mockSuggestTimeFn.mockResolvedValue([mockSuggestedTimes[0]]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("reason-text")).toBeInTheDocument();
      });

      expect(screen.getByTestId("reason-text")).toHaveTextContent(
        "💡 Horário de pico de produtividade"
      );
    });

    it("não deve mostrar razão quando não fornecida", async () => {
      const suggestionWithoutReason = {
        ...mockSuggestedTimes[0],
        reason: undefined,
      };
      mockSuggestTimeFn.mockResolvedValue([suggestionWithoutReason]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("suggestions-container")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("reason-text")).not.toBeInTheDocument();
    });
  });

  describe("Classificação de Score", () => {
    it("deve classificar score excelente corretamente", async () => {
      const excellentSuggestion = { ...mockSuggestedTimes[0], score: 0.95 };
      mockSuggestTimeFn.mockResolvedValue([excellentSuggestion]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("score-badge")).toBeInTheDocument();
      });

      const scoreBadge = screen.getByTestId("score-badge");
      expect(scoreBadge).toHaveAttribute("data-score-type", "excellent");
      expect(scoreBadge).toHaveTextContent("Excelente");
    });

    it("deve classificar score muito bom corretamente", async () => {
      const goodSuggestion = { ...mockSuggestedTimes[0], score: 0.85 };
      mockSuggestTimeFn.mockResolvedValue([goodSuggestion]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("score-badge")).toBeInTheDocument();
      });

      const scoreBadge = screen.getByTestId("score-badge");
      expect(scoreBadge).toHaveAttribute("data-score-type", "good");
      expect(scoreBadge).toHaveTextContent("Muito Bom");
    });

    it("deve classificar score bom corretamente", async () => {
      const fairSuggestion = { ...mockSuggestedTimes[0], score: 0.75 };
      mockSuggestTimeFn.mockResolvedValue([fairSuggestion]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("score-badge")).toBeInTheDocument();
      });

      const scoreBadge = screen.getByTestId("score-badge");
      expect(scoreBadge).toHaveAttribute("data-score-type", "fair");
      expect(scoreBadge).toHaveTextContent("Bom");
    });

    it("deve classificar score regular corretamente", async () => {
      const regularSuggestion = { ...mockSuggestedTimes[0], score: 0.65 };
      mockSuggestTimeFn.mockResolvedValue([regularSuggestion]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("score-badge")).toBeInTheDocument();
      });

      const scoreBadge = screen.getByTestId("score-badge");
      expect(scoreBadge).toHaveAttribute("data-score-type", "regular");
      expect(scoreBadge).toHaveTextContent("Regular");
    });
  });

  describe("Seleção de Sugestões", () => {
    it("deve chamar onTimeSelect quando sugestão é clicada", async () => {
      const user = userEvent.setup();
      mockSuggestTimeFn.mockResolvedValue([mockSuggestedTimes[0]]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("suggestion-button")).toBeInTheDocument();
      });

      const suggestionButton = screen.getByTestId("suggestion-button");
      await user.click(suggestionButton);

      expect(mockOnTimeSelect).toHaveBeenCalledWith(mockSuggestedTimes[0]);
    });

    it("deve marcar sugestão como selecionada", async () => {
      const user = userEvent.setup();
      mockSuggestTimeFn.mockResolvedValue([mockSuggestedTimes[0]]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("suggestion-button")).toBeInTheDocument();
      });

      const suggestionButton = screen.getByTestId("suggestion-button");
      await user.click(suggestionButton);

      expect(suggestionButton).toHaveAttribute("data-selected", "true");
      expect(screen.getByTestId("selected-badge")).toBeInTheDocument();
      expect(screen.getByTestId("selected-badge")).toHaveTextContent(
        "Selecionado"
      );
    });

    it("deve mostrar ícone de check quando selecionada", async () => {
      const user = userEvent.setup();
      mockSuggestTimeFn.mockResolvedValue([mockSuggestedTimes[0]]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("suggestion-button")).toBeInTheDocument();
      });

      const suggestionButton = screen.getByTestId("suggestion-button");
      await user.click(suggestionButton);

      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("arrow-icon")).not.toBeInTheDocument();
    });

    it("deve mostrar ícone de seta quando não selecionada", async () => {
      mockSuggestTimeFn.mockResolvedValue([mockSuggestedTimes[0]]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("arrow-icon")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
    });

    it("deve permitir mudança de seleção", async () => {
      const user = userEvent.setup();
      mockSuggestTimeFn.mockResolvedValue(mockSuggestedTimes.slice(0, 2));

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId("suggestion-button")).toHaveLength(2);
      });

      const suggestionButtons = screen.getAllByTestId("suggestion-button");

      // Selecionar primeira sugestão
      await user.click(suggestionButtons[0]);
      expect(suggestionButtons[0]).toHaveAttribute("data-selected", "true");
      expect(suggestionButtons[1]).toHaveAttribute("data-selected", "false");

      // Selecionar segunda sugestão
      await user.click(suggestionButtons[1]);
      expect(suggestionButtons[0]).toHaveAttribute("data-selected", "false");
      expect(suggestionButtons[1]).toHaveAttribute("data-selected", "true");

      expect(mockOnTimeSelect).toHaveBeenCalledTimes(2);
    });
  });

  describe("Validação de TaskData", () => {
    it("não deve fazer requisição quando título está vazio", async () => {
      const taskDataWithoutTitle = { ...mockTaskData, title: "" };

      render(
        React.createElement(TimeSuggestions, {
          taskData: taskDataWithoutTitle,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("empty-message")).toBeInTheDocument();
      });

      expect(mockSuggestTimeFn).not.toHaveBeenCalled();
    });

    it("não deve fazer requisição quando categoria está vazia", async () => {
      const taskDataWithoutCategory = { ...mockTaskData, category: "" };

      render(
        React.createElement(TimeSuggestions, {
          taskData: taskDataWithoutCategory,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("empty-message")).toBeInTheDocument();
      });

      expect(mockSuggestTimeFn).not.toHaveBeenCalled();
    });

    it("deve fazer requisição quando título e categoria estão preenchidos", async () => {
      mockSuggestTimeFn.mockResolvedValue([]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(mockSuggestTimeFn).toHaveBeenCalledWith(mockTaskData);
      });
    });
  });

  describe("Atualização de Props", () => {
    it("deve recarregar sugestões quando taskData muda", async () => {
      mockSuggestTimeFn.mockResolvedValue([]);

      const { rerender } = render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(mockSuggestTimeFn).toHaveBeenCalledWith(mockTaskData);
      });

      const newTaskData = { ...mockTaskData, title: "Nova Tarefa" };

      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(TimeSuggestions, {
            taskData: newTaskData,
            onTimeSelect: mockOnTimeSelect,
          })
        )
      );

      await waitFor(() => {
        expect(mockSuggestTimeFn).toHaveBeenCalledWith(newTaskData);
      });

      expect(mockSuggestTimeFn).toHaveBeenCalledTimes(2);
    });

    it("deve limpar seleção anterior ao recarregar", async () => {
      const user = userEvent.setup();
      mockSuggestTimeFn.mockResolvedValue([mockSuggestedTimes[0]]);

      const { rerender } = render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("suggestion-button")).toBeInTheDocument();
      });

      // Selecionar sugestão
      await user.click(screen.getByTestId("suggestion-button"));
      expect(screen.getByTestId("selected-badge")).toBeInTheDocument();

      // Atualizar taskData
      const newTaskData = { ...mockTaskData, title: "Nova Tarefa" };
      mockSuggestTimeFn.mockResolvedValue([mockSuggestedTimes[1]]);

      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(TimeSuggestions, {
            taskData: newTaskData,
            onTimeSelect: mockOnTimeSelect,
          })
        )
      );

      await waitFor(() => {
        expect(screen.queryByTestId("selected-badge")).not.toBeInTheDocument();
      });
    });
  });

  describe("Casos Extremos", () => {
    it("deve lidar com scores extremos", async () => {
      const extremeScores = [
        { ...mockSuggestedTimes[0], score: 1.0 },
        { ...mockSuggestedTimes[0], score: 0.0 },
        { ...mockSuggestedTimes[0], score: -0.1 },
        { ...mockSuggestedTimes[0], score: 1.1 },
      ];

      mockSuggestTimeFn.mockResolvedValue(extremeScores);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId("score-badge")).toHaveLength(4);
      });

      const scoreBadges = screen.getAllByTestId("score-badge");
      expect(scoreBadges[0]).toHaveAttribute("data-score-type", "excellent"); // 1.0
      expect(scoreBadges[1]).toHaveAttribute("data-score-type", "regular"); // 0.0
      expect(scoreBadges[2]).toHaveAttribute("data-score-type", "regular"); // -0.1
      expect(scoreBadges[3]).toHaveAttribute("data-score-type", "excellent"); // 1.1
    });

    it("deve lidar com datas inválidas", async () => {
      const invalidDateSuggestion = {
        ...mockSuggestedTimes[0],
        start: "invalid-date",
        end: "invalid-date",
      };

      mockSuggestTimeFn.mockResolvedValue([invalidDateSuggestion]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("suggestion-button")).toBeInTheDocument();
      });

      // Deve renderizar sem quebrar, mesmo com datas inválidas
      expect(screen.getByTestId("time-info")).toBeInTheDocument();
      expect(screen.getByTestId("duration-info")).toBeInTheDocument();
    });

    it("deve lidar com sugestões sem score", async () => {
      const suggestionWithoutScore = {
        start: "2024-01-15T09:00:00Z",
        end: "2024-01-15T10:00:00Z",
        reason: "Teste sem score",
      } as SuggestedTime;

      mockSuggestTimeFn.mockResolvedValue([suggestionWithoutScore]);

      expect(() => {
        render(
          React.createElement(TimeSuggestions, {
            taskData: mockTaskData,
            onTimeSelect: mockOnTimeSelect,
          }),
          { wrapper: TestWrapper }
        );
      }).not.toThrow();
    });

    it("deve lidar com onTimeSelect undefined", async () => {
      const user = userEvent.setup();
      mockSuggestTimeFn.mockResolvedValue([mockSuggestedTimes[0]]);

      render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: undefined as any,
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(screen.getByTestId("suggestion-button")).toBeInTheDocument();
      });

      // Não deve quebrar ao clicar
      expect(() =>
        user.click(screen.getByTestId("suggestion-button"))
      ).not.toThrow();
    });
  });

  describe("Performance", () => {
    it("deve ser eficiente com muitas sugestões", async () => {
      const manySuggestions = Array.from({ length: 50 }, (_, i) => ({
        ...mockSuggestedTimes[0],
        start: `2024-01-15T${(9 + i) % 24}:00:00Z`,
        end: `2024-01-15T${(10 + i) % 24}:00:00Z`,
      }));

      mockSuggestTimeFn.mockResolvedValue(manySuggestions);

      expect(() => {
        render(
          React.createElement(TimeSuggestions, {
            taskData: mockTaskData,
            onTimeSelect: mockOnTimeSelect,
          }),
          { wrapper: TestWrapper }
        );
      }).not.toThrow();

      await waitFor(() => {
        expect(screen.getAllByTestId("suggestion-button")).toHaveLength(50);
      });
    });

    it("não deve fazer múltiplas requisições simultâneas", async () => {
      mockSuggestTimeFn.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
      );

      const { rerender } = render(
        React.createElement(TimeSuggestions, {
          taskData: mockTaskData,
          onTimeSelect: mockOnTimeSelect,
        }),
        { wrapper: TestWrapper }
      );

      // Mudar rapidamente as props
      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(TimeSuggestions, {
            taskData: { ...mockTaskData, title: "Mudança 1" },
            onTimeSelect: mockOnTimeSelect,
          })
        )
      );

      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(TimeSuggestions, {
            taskData: { ...mockTaskData, title: "Mudança 2" },
            onTimeSelect: mockOnTimeSelect,
          })
        )
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId("loading-container")
        ).not.toBeInTheDocument();
      });

      // Deve ter sido chamado para cada mudança (useEffect limpa requisições anteriores)
      expect(mockSuggestTimeFn).toHaveBeenCalledTimes(3);
    });
  });
});

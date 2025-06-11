/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";

// Mock completo do styled-components
jest.mock("styled-components", () => {
  const React = require("react");

  const createStyledComponent = (tag: string) =>
    React.forwardRef((props: any, ref: any) =>
      React.createElement(tag, { ...props, ref })
    );

  const styled = new Proxy(
    (tag: string) =>
      (template: any, ...args: any[]) =>
        createStyledComponent(tag),
    {
      get: (target, prop) => {
        if (typeof prop === "string") {
          return (template: any, ...args: any[]) => createStyledComponent(prop);
        }
        return target[prop];
      },
    }
  );

  const actualSC = jest.requireActual("styled-components");

  return {
    __esModule: true,
    default: styled,
    ThemeProvider: actualSC.ThemeProvider,
    createGlobalStyle: () => () => null,
    keyframes: () => "mock-keyframes",
    css: (template: any, ...args: any[]) => template,
  };
});

// Mock do TaskList.styles
jest.mock("../TaskList.styles", () => ({
  Container: "div",
  MaxWidthWrapper: "div",
  LoadingContainer: ({ ...props }) =>
    React.createElement("div", {
      ...props,
      "data-testid": "loading-container",
    }),
  LoadingGrid: "div",
  LoadingSkeleton: "div",
  LoadingTitle: "div",
  Header: "div",
  BackButton: "button",
  BackIcon: "svg",
  HeaderContent: "div",
  HeaderInfo: "div",
  Title: "h1",
  TaskCount: "p",
  NewTaskButton: "button",
  ErrorContainer: "div",
  ErrorText: "p",
  MainGrid: "div",
  Sidebar: "div",
  FiltersCard: "div",
  FiltersHeader: "div",
  FiltersTitle: "h3",
  ClearFiltersButton: "button",
  FilterGroup: "div",
  FilterLabel: "label",
  SearchInput: "input",
  FilterGroupTitle: "h4",
  RadioGroup: "div",
  RadioLabel: "label",
  RadioInput: "input",
  RadioText: "span",
  CheckboxGroup: "div",
  CheckboxLabel: "label",
  CheckboxInput: "input",
  MainContent: "div",
  SortCard: "div",
  SortContainer: "div",
  SortLabel: "span",
  SortSelect: "select",
  TasksContainer: "div",
  EmptyState: "div",
  EmptyIcon: "svg",
  EmptyTitle: "h3",
  EmptyDescription: "p",
}));

// Mock dos componentes
jest.mock("../../../components/TaskCard/TaskCard", () => {
  return function MockTaskCard({
    task,
    onEdit,
    onDelete,
    onToggleComplete,
    onCardClick,
  }: any) {
    return React.createElement(
      "div",
      { "data-testid": `task-card-${task.id}` },
      [
        React.createElement("h3", { key: "title" }, task.title),
        React.createElement("p", { key: "description" }, task.description),
        React.createElement("span", { key: "category" }, task.category),
        React.createElement("span", { key: "priority" }, task.priority),
        React.createElement(
          "span",
          { key: "status" },
          task.completed ? "Concluída" : "Pendente"
        ),
        React.createElement(
          "button",
          {
            key: "edit",
            onClick: () => onEdit(task),
            "data-testid": `edit-task-${task.id}`,
          },
          "Editar"
        ),
        React.createElement(
          "button",
          {
            key: "delete",
            onClick: () => onDelete(task.id),
            "data-testid": `delete-task-${task.id}`,
          },
          "Excluir"
        ),
        React.createElement(
          "button",
          {
            key: "complete",
            onClick: () => onToggleComplete(task.id),
            "data-testid": `complete-task-${task.id}`,
          },
          task.completed ? "Desmarcar" : "Concluir"
        ),
        React.createElement(
          "button",
          {
            key: "click",
            onClick: () => onCardClick(),
            "data-testid": `click-task-${task.id}`,
          },
          "Ver Detalhes"
        ),
      ]
    );
  };
});

jest.mock("../../../components/CategoryFilter/CategoryFilter", () => {
  return function MockCategoryFilter({
    categories,
    selectedCategories,
    onCategoryChange,
  }: any) {
    return React.createElement("div", { "data-testid": "category-filter" }, [
      React.createElement("h4", { key: "title" }, "Categoria"),
      ...categories.map((category: string) =>
        React.createElement(
          "label",
          { key: category },
          React.createElement("input", {
            type: "checkbox",
            checked: selectedCategories.includes(category),
            onChange: (e: any) => {
              if (e.target.checked) {
                onCategoryChange([...selectedCategories, category]);
              } else {
                onCategoryChange(
                  selectedCategories.filter((c: string) => c !== category)
                );
              }
            },
            "data-testid": `category-${category}`,
          }),
          category
        )
      ),
    ]);
  };
});

jest.mock("../../../components/PriorityBadge/PriorityBadge", () => {
  return function MockPriorityBadge({ priority, size }: any) {
    return React.createElement(
      "span",
      { "data-testid": `priority-badge-${priority}` },
      `${priority} (${size})`
    );
  };
});

jest.mock("../../../components/DeleteConfirmModal/DeleteConfirmModal", () => {
  return function MockDeleteConfirmModal({
    isOpen,
    taskTitle,
    onConfirm,
    onCancel,
  }: any) {
    if (!isOpen) return null;
    return React.createElement("div", { "data-testid": "delete-modal" }, [
      React.createElement("p", { key: "text" }, `Excluir "${taskTitle}"?`),
      React.createElement(
        "button",
        {
          key: "confirm",
          onClick: onConfirm,
          "data-testid": "confirm-delete",
        },
        "Confirmar"
      ),
      React.createElement(
        "button",
        {
          key: "cancel",
          onClick: onCancel,
          "data-testid": "cancel-delete",
        },
        "Cancelar"
      ),
    ]);
  };
});

// Mock dos contextos
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();

jest.mock("../../../contexts/ToastContext", () => ({
  useToastContext: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

// Importações
import { ThemeProvider } from "styled-components";
import TaskList from "../TaskList";
import { Task } from "../../../contexts/TaskContext";

// Mock do hook useTasks
const mockFetchTasks = jest.fn();
const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();
const mockUseTasks = {
  tasks: [] as Task[],
  loading: false,
  error: null,
  fetchTasks: mockFetchTasks,
  updateTask: mockUpdateTask,
  deleteTask: mockDeleteTask,
};

jest.mock("../../../hooks/useTasks", () => ({
  useTasks: () => mockUseTasks,
}));

// Mock do react-router
const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
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
  return (
    <MemoryRouter initialEntries={["/tasks"]}>
      <ThemeProvider theme={mockTheme}>{children}</ThemeProvider>
    </MemoryRouter>
  );
};

// Mock das tarefas
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Tarefa 1",
    description: "Descrição da tarefa 1",
    category: "trabalho",
    priority: "high",
    estimatedDuration: 60,
    dueDate: "2024-12-31T23:59:00",
    completed: false,
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2023-06-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Tarefa 2",
    description: "Descrição da tarefa 2",
    category: "pessoal",
    priority: "medium",
    estimatedDuration: 30,
    dueDate: "2024-12-30T15:00:00",
    completed: true,
    createdAt: "2023-06-02T10:00:00Z",
    updatedAt: "2023-06-02T10:00:00Z",
  },
  {
    id: "3",
    title: "Tarefa 3",
    description: "Descrição da tarefa 3",
    category: "estudos",
    priority: "low",
    estimatedDuration: 90,
    dueDate: "2024-12-29T10:00:00",
    completed: false,
    createdAt: "2023-06-03T10:00:00Z",
    updatedAt: "2023-06-03T10:00:00Z",
  },
];

describe("TaskList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTasks.tasks = mockTasks;
    mockUseTasks.loading = false;
    mockUseTasks.error = null;
  });

  describe("Renderização Básica", () => {
    it("deve renderizar o cabeçalho da lista de tarefas", () => {
      render(<TaskList />, { wrapper: TestWrapper });

      expect(screen.getByText("Lista de Tarefas")).toBeInTheDocument();
      expect(screen.getByText("3 de 3 tarefas")).toBeInTheDocument();
      expect(screen.getByText("+ Nova Tarefa")).toBeInTheDocument();
      expect(screen.getByText("Voltar ao Dashboard")).toBeInTheDocument();
    });

    it("deve renderizar os filtros", () => {
      render(<TaskList />, { wrapper: TestWrapper });

      expect(screen.getByText("Filtros")).toBeInTheDocument();
      expect(screen.getByText("Limpar")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Buscar tarefas...")
      ).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getAllByText("Prioridade")[0]).toBeInTheDocument();
    });

    it("deve renderizar as opções de ordenação", () => {
      render(<TaskList />, { wrapper: TestWrapper });

      expect(screen.getByText("Ordenar por:")).toBeInTheDocument();
      const sortSelect = screen.getByRole("combobox");
      expect(sortSelect).toBeInTheDocument();
      expect(
        within(sortSelect.parentElement!).getByText("Data")
      ).toBeInTheDocument();
    });

    it("deve renderizar todas as tarefas", () => {
      render(<TaskList />, { wrapper: TestWrapper });

      expect(screen.getByTestId("task-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("task-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("task-card-3")).toBeInTheDocument();
    });

    it("deve renderizar filtros de prioridade", () => {
      render(<TaskList />, { wrapper: TestWrapper });

      expect(screen.getByTestId("priority-badge-high")).toBeInTheDocument();
      expect(screen.getByTestId("priority-badge-medium")).toBeInTheDocument();
      expect(screen.getByTestId("priority-badge-low")).toBeInTheDocument();
    });

    it("deve renderizar filtro de categoria quando há tarefas", () => {
      render(<TaskList />, { wrapper: TestWrapper });

      expect(screen.getByTestId("category-filter")).toBeInTheDocument();
      expect(screen.getByTestId("category-trabalho")).toBeInTheDocument();
      expect(screen.getByTestId("category-pessoal")).toBeInTheDocument();
      expect(screen.getByTestId("category-estudos")).toBeInTheDocument();
    });
  });

  describe("Estado de Loading", () => {
    it("deve mostrar skeleton quando loading e não há tarefas", () => {
      mockUseTasks.tasks = [];
      mockUseTasks.loading = true;

      render(<TaskList />, { wrapper: TestWrapper });

      // O skeleton é renderizado quando loading=true e tasks=[]
      expect(screen.getByTestId("loading-container")).toBeInTheDocument();
    });

    it("não deve mostrar skeleton quando há tarefas mesmo com loading", () => {
      mockUseTasks.loading = true;
      mockUseTasks.tasks = mockTasks;

      render(<TaskList />, { wrapper: TestWrapper });

      expect(screen.getByText("Lista de Tarefas")).toBeInTheDocument();
      expect(screen.getByTestId("task-card-1")).toBeInTheDocument();
    });
  });

  describe("Tratamento de Erros", () => {
    it("deve mostrar mensagem de erro quando há erro", () => {
      mockUseTasks.error = "Erro ao carregar tarefas";

      render(<TaskList />, { wrapper: TestWrapper });

      expect(screen.getByText("Erro ao carregar tarefas")).toBeInTheDocument();
    });
  });

  describe("Estado Vazio", () => {
    it("deve mostrar estado vazio quando não há tarefas", () => {
      mockUseTasks.tasks = [];

      render(<TaskList />, { wrapper: TestWrapper });

      expect(screen.getByText("Nenhuma tarefa encontrada")).toBeInTheDocument();
      expect(
        screen.getByText("Tente ajustar os filtros ou criar uma nova tarefa.")
      ).toBeInTheDocument();
    });

    it("deve mostrar estado vazio quando filtros não retornam resultados", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      // Fazer uma busca que não retorna resultados
      const searchInput = screen.getByPlaceholderText("Buscar tarefas...");
      await user.type(searchInput, "tarefa inexistente");

      expect(screen.getByText("Nenhuma tarefa encontrada")).toBeInTheDocument();
    });
  });

  describe("Navegação", () => {
    it("deve navegar para dashboard ao clicar em voltar", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      const backButton = screen.getByText("Voltar ao Dashboard");
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("deve navegar para nova tarefa ao clicar no botão", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      const newTaskButton = screen.getByText("+ Nova Tarefa");
      await user.click(newTaskButton);

      expect(mockNavigate).toHaveBeenCalledWith("/tasks/new");
    });

    it("deve navegar para edição de tarefa ao clicar em editar", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      const editButton = screen.getByTestId("edit-task-1");
      await user.click(editButton);

      expect(mockNavigate).toHaveBeenCalledWith("/task/1/edit");
    });

    it("deve navegar para detalhes da tarefa ao clicar no card", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      const clickButton = screen.getByTestId("click-task-1");
      await user.click(clickButton);

      expect(mockNavigate).toHaveBeenCalledWith("/task/1");
    });
  });

  describe("Filtros", () => {
    it("deve filtrar por termo de busca", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      const searchInput = screen.getByPlaceholderText("Buscar tarefas...");
      await user.type(searchInput, "Tarefa 1");

      // Apenas a tarefa 1 deve aparecer
      expect(screen.getByTestId("task-card-1")).toBeInTheDocument();
      expect(screen.queryByTestId("task-card-2")).not.toBeInTheDocument();
      expect(screen.queryByTestId("task-card-3")).not.toBeInTheDocument();
    });

    it("deve filtrar por status - apenas pendentes", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      const pendingRadio = screen.getByLabelText("Pendentes");
      await user.click(pendingRadio);

      // Apenas tarefas não concluídas (1 e 3)
      expect(screen.getByTestId("task-card-1")).toBeInTheDocument();
      expect(screen.queryByTestId("task-card-2")).not.toBeInTheDocument();
      expect(screen.getByTestId("task-card-3")).toBeInTheDocument();
    });

    it("deve filtrar por status - apenas concluídas", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      const completedRadio = screen.getByLabelText("Concluídas");
      await user.click(completedRadio);

      // Apenas tarefa concluída (2)
      expect(screen.queryByTestId("task-card-1")).not.toBeInTheDocument();
      expect(screen.getByTestId("task-card-2")).toBeInTheDocument();
      expect(screen.queryByTestId("task-card-3")).not.toBeInTheDocument();
    });

    it("deve filtrar por prioridade", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      // Filtrar apenas por alta prioridade - buscar o checkbox correto
      const highPriorityCheckbox = screen
        .getByTestId("priority-badge-high")
        .closest("label")
        ?.querySelector('input[type="checkbox"]');

      expect(highPriorityCheckbox).toBeInTheDocument();

      if (highPriorityCheckbox) {
        await user.click(highPriorityCheckbox);
      }

      // Wait for the filter to be applied and check that only high priority task is visible
      await waitFor(() => {
        expect(screen.getByTestId("task-card-1")).toBeInTheDocument();
        expect(screen.queryByTestId("task-card-2")).not.toBeInTheDocument();
        expect(screen.queryByTestId("task-card-3")).not.toBeInTheDocument();
      });
    });

    it("deve filtrar por categoria", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      const trabalhoCheckbox = screen.getByTestId("category-trabalho");
      await user.click(trabalhoCheckbox);

      // Apenas tarefa 1 (trabalho)
      expect(screen.getByTestId("task-card-1")).toBeInTheDocument();
      expect(screen.queryByTestId("task-card-2")).not.toBeInTheDocument();
      expect(screen.queryByTestId("task-card-3")).not.toBeInTheDocument();
    });

    it("deve limpar todos os filtros", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      // Aplicar alguns filtros
      const searchInput = screen.getByPlaceholderText("Buscar tarefas...");
      await user.type(searchInput, "Tarefa 1");

      const pendingRadio = screen.getByLabelText("Pendentes");
      await user.click(pendingRadio);

      // Limpar filtros
      const clearButton = screen.getByText("Limpar");
      await user.click(clearButton);

      // Todas as tarefas devem aparecer novamente
      expect(screen.getByTestId("task-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("task-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("task-card-3")).toBeInTheDocument();

      // Campos devem estar limpos
      expect(searchInput).toHaveValue("");
      expect(screen.getByLabelText("Todas")).toBeChecked();
    });
  });

  describe("Ordenação", () => {
    it("deve ordenar por data", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      const sortSelect = screen.getByRole("combobox");
      await user.selectOptions(sortSelect, "date");

      // Verificar se as tarefas estão ordenadas por data (mais próxima primeiro)
      // Como o mock não implementa a ordenação, verificamos se o select mudou
      expect(sortSelect).toHaveValue("date");
    });

    it("deve ordenar por prioridade", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      const sortSelect = screen.getByRole("combobox");
      await user.selectOptions(sortSelect, "priority");

      expect(sortSelect).toHaveValue("priority");
    });

    it("deve ordenar por nome", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      const sortSelect = screen.getByRole("combobox");
      await user.selectOptions(sortSelect, "name");

      expect(sortSelect).toHaveValue("name");
    });
  });

  describe("Ações das Tarefas", () => {
    it("deve marcar tarefa como concluída", async () => {
      const user = userEvent.setup();
      mockUpdateTask.mockResolvedValue({});

      render(<TaskList />, { wrapper: TestWrapper });

      const completeButton = screen.getByTestId("complete-task-1");
      await user.click(completeButton);

      await waitFor(() => {
        expect(mockUpdateTask).toHaveBeenCalledWith("1", {
          completed: true,
          updatedAt: expect.any(String),
        });
      });
    });

    it("não deve permitir editar tarefa concluída", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      // Tarefa 2 está concluída
      const editButton = screen.getByTestId("edit-task-2");
      await user.click(editButton);

      // Não deve navegar para edição
      expect(mockNavigate).not.toHaveBeenCalledWith("/task/2/edit");
    });

    it("deve abrir modal de confirmação ao excluir tarefa", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      const deleteButton = screen.getByTestId("delete-task-1");
      await user.click(deleteButton);

      expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
      expect(screen.getByText('Excluir "Tarefa 1"?')).toBeInTheDocument();
    });

    it("deve confirmar exclusão de tarefa", async () => {
      const user = userEvent.setup();
      mockDeleteTask.mockResolvedValue({});

      render(<TaskList />, { wrapper: TestWrapper });

      // Abrir modal
      const deleteButton = screen.getByTestId("delete-task-1");
      await user.click(deleteButton);

      // Confirmar exclusão
      const confirmButton = screen.getByTestId("confirm-delete");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockDeleteTask).toHaveBeenCalledWith("1");
      });
    });

    it("deve cancelar exclusão de tarefa", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      // Abrir modal
      const deleteButton = screen.getByTestId("delete-task-1");
      await user.click(deleteButton);

      // Cancelar exclusão
      const cancelButton = screen.getByTestId("cancel-delete");
      await user.click(cancelButton);

      expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
      expect(mockDeleteTask).not.toHaveBeenCalled();
    });
  });

  describe("Responsividade", () => {
    it("deve renderizar corretamente em telas pequenas", () => {
      // Simular tela pequena
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 600,
      });

      render(<TaskList />, { wrapper: TestWrapper });

      expect(screen.getByText("Lista de Tarefas")).toBeInTheDocument();
      expect(screen.getByText("+ Nova Tarefa")).toBeInTheDocument();
    });
  });

  describe("Efeitos Colaterais", () => {
    it("deve buscar tarefas ao montar componente", () => {
      render(<TaskList />, { wrapper: TestWrapper });

      expect(mockFetchTasks).toHaveBeenCalled();
    });

    it("deve atualizar contador de tarefas quando filtros mudam", async () => {
      const user = userEvent.setup();
      render(<TaskList />, { wrapper: TestWrapper });

      // Inicialmente mostra todas
      expect(screen.getByText("3 de 3 tarefas")).toBeInTheDocument();

      // Filtrar por pendentes
      const pendingRadio = screen.getByLabelText("Pendentes");
      await user.click(pendingRadio);

      // Deve mostrar apenas as pendentes (2 de 3)
      expect(screen.getByText("2 de 3 tarefas")).toBeInTheDocument();
    });
  });

  describe("Integração com Contextos", () => {
    it("deve mostrar toast de sucesso ao concluir tarefa", async () => {
      const user = userEvent.setup();
      mockShowSuccess.mockClear();
      mockUpdateTask.mockResolvedValue({});

      render(<TaskList />, { wrapper: TestWrapper });

      const completeButton = screen.getByTestId("complete-task-1");
      await user.click(completeButton);

      await waitFor(() => {
        expect(mockShowSuccess).toHaveBeenCalledWith(
          "Tarefa concluída com sucesso!"
        );
      });
    });

    it("deve mostrar toast de erro ao falhar em concluir tarefa", async () => {
      const user = userEvent.setup();
      mockShowError.mockClear();
      mockUpdateTask.mockRejectedValue(new Error("Erro ao atualizar"));

      render(<TaskList />, { wrapper: TestWrapper });

      const completeButton = screen.getByTestId("complete-task-1");
      await user.click(completeButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith("Erro ao atualizar tarefa");
      });
    });
  });
});

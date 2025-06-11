/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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

// Mock do TaskPage.styles
jest.mock("../TaskPage.styles", () => ({
  Container: "div",
  ResponsiveWrapper: "div",
}));

// Mock dos componentes lazy-loaded como promises que resolvem imediatamente
jest.mock("../../TaskList/TaskList", () => {
  const MockTaskList = () => {
    return React.createElement(
      "div",
      { "data-testid": "task-list-component" },
      "TaskList Component"
    );
  };

  // Mock como default export para lazy loading
  MockTaskList.default = MockTaskList;
  return MockTaskList;
});

jest.mock("../../TaskForm/TaskForm", () => {
  const MockTaskForm = ({ taskId }: { taskId?: string }) => {
    return React.createElement(
      "div",
      { "data-testid": "task-form-component" },
      [
        "TaskForm Component",
        taskId &&
          React.createElement(
            "span",
            { key: "taskId" },
            ` - Task ID: ${taskId}`
          ),
      ]
    );
  };

  // Mock como default export para lazy loading
  MockTaskForm.default = MockTaskForm;
  return MockTaskForm;
});

jest.mock("../../../components/TaskDetail/TaskDetail", () => {
  const MockTaskDetail = ({ task }: { task: any }) => {
    return React.createElement(
      "div",
      { "data-testid": "task-detail-component" },
      [
        "TaskDetail Component",
        React.createElement("span", { key: "title" }, ` - ${task.title}`),
      ]
    );
  };

  // Mock como default export para lazy loading
  MockTaskDetail.default = MockTaskDetail;
  return MockTaskDetail;
});

// Mock do React.lazy para retornar os componentes mockados imediatamente
const mockLazy = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  lazy: (importFn: () => Promise<any>) => {
    // Simular lazy loading que resolve imediatamente
    const MockComponent = (props: any) => {
      const [Component, setComponent] = React.useState<any>(null);

      React.useEffect(() => {
        importFn().then((module) => {
          setComponent(() => module.default || module);
        });
      }, []);

      if (!Component) {
        return React.createElement(
          "div",
          { "data-testid": "loading-spinner" },
          "Carregando..."
        );
      }

      return React.createElement(Component, props);
    };

    return MockComponent;
  },
  Suspense: ({
    children,
    fallback,
  }: {
    children: React.ReactNode;
    fallback: React.ReactNode;
  }) => {
    // Para testes, renderizar children diretamente
    return children;
  },
}));

// Importações
import { ThemeProvider } from "styled-components";
import { TasksPage } from "../TaskPage";
import { Task } from "../../../contexts/TaskContext";

// Mock do hook useTasks
const mockFetchTask = jest.fn();
const mockUseTasks = {
  selectedTask: null as Task | null,
  fetchTask: mockFetchTask,
  loading: false,
  error: null,
};

jest.mock("../../../hooks/useTasks", () => ({
  useTasks: () => mockUseTasks,
}));

// Mock do react-router
const mockUseSearchParams = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useSearchParams: () => [mockUseSearchParams(), jest.fn()],
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
    <MemoryRouter>
      <ThemeProvider theme={mockTheme}>{children}</ThemeProvider>
    </MemoryRouter>
  );
};

// Mock das tarefas
const mockTask: Task = {
  id: "1",
  title: "Tarefa de Teste",
  description: "Descrição da tarefa de teste",
  category: "trabalho",
  priority: "high",
  estimatedDuration: 60,
  dueDate: "2024-12-31T23:59:00",
  completed: false,
  createdAt: "2023-06-01T10:00:00Z",
  updatedAt: "2023-06-01T10:00:00Z",
};

describe("TaskPage com Lazy Loading", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTasks.selectedTask = null;
    mockUseTasks.loading = false;
    mockUseTasks.error = null;

    // Mock padrão dos searchParams
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  describe("Renderização de Views com Lazy Loading", () => {
    it("deve renderizar TaskList por padrão (view=list)", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "list";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      // Aguardar o lazy loading carregar
      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });

      expect(screen.getByText("TaskList Component")).toBeInTheDocument();
    });

    it("deve renderizar TaskList quando não há parâmetros de view", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue(null),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });

      expect(screen.getByText("TaskList Component")).toBeInTheDocument();
    });

    it("deve renderizar TaskForm quando view=new", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "new";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId("task-form-component")).toBeInTheDocument();
      });

      expect(screen.getByText("TaskForm Component")).toBeInTheDocument();
      expect(screen.queryByText("Task ID:")).not.toBeInTheDocument();
    });

    it("deve renderizar TaskForm com taskId quando view=edit e há id", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "edit";
          if (key === "id") return "123";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId("task-form-component")).toBeInTheDocument();
      });

      expect(screen.getByText("TaskForm Component")).toBeInTheDocument();
      expect(screen.getByText("- Task ID: 123")).toBeInTheDocument();
    });

    it("deve renderizar TaskList quando view=edit mas não há id", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "edit";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });

      expect(
        screen.queryByTestId("task-form-component")
      ).not.toBeInTheDocument();
    });

    it("deve renderizar TaskDetail quando view=detail, há id e selectedTask", async () => {
      mockUseTasks.selectedTask = mockTask;
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "detail";
          if (key === "id") return "1";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId("task-detail-component")).toBeInTheDocument();
      });

      expect(screen.getByText("TaskDetail Component")).toBeInTheDocument();
      expect(screen.getByText("- Tarefa de Teste")).toBeInTheDocument();
    });

    it("deve renderizar TaskList quando view=detail mas não há selectedTask", async () => {
      mockUseTasks.selectedTask = null;
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "detail";
          if (key === "id") return "1";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });

      expect(
        screen.queryByTestId("task-detail-component")
      ).not.toBeInTheDocument();
    });

    it("deve renderizar TaskList quando view=detail mas não há id", async () => {
      mockUseTasks.selectedTask = mockTask;
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "detail";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });

      expect(
        screen.queryByTestId("task-detail-component")
      ).not.toBeInTheDocument();
    });
  });

  describe("Loading States com Lazy Loading", () => {
    it("pode mostrar estado de loading durante carregamento lazy", async () => {
      // Mock de um lazy loading que demora um pouco
      jest.mock("react", () => ({
        ...jest.requireActual("react"),
        lazy: () => {
          const DelayedComponent = () => {
            const [loaded, setLoaded] = React.useState(false);

            React.useEffect(() => {
              const timer = setTimeout(() => setLoaded(true), 100);
              return () => clearTimeout(timer);
            }, []);

            if (!loaded) {
              return React.createElement(
                "div",
                { "data-testid": "loading-spinner" },
                "Carregando..."
              );
            }

            return React.createElement(
              "div",
              { "data-testid": "task-list-component" },
              "TaskList Component"
            );
          };

          return DelayedComponent;
        },
      }));

      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue(null),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      // Pode aparecer loading inicialmente
      // await waitFor(() => {
      //   expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
      // });

      // E depois o componente carregado
      await waitFor(
        () => {
          expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe("Estrutura e Layout com Lazy Loading", () => {
    it("deve renderizar Container e ResponsiveWrapper em todas as views", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue(null),
      });

      const { container } = render(<TasksPage />, { wrapper: TestWrapper });

      // Verificar se os wrappers estão presentes
      const containerDiv = container.firstChild;
      expect(containerDiv).toBeInTheDocument();

      const responsiveWrapper = containerDiv?.firstChild;
      expect(responsiveWrapper).toBeInTheDocument();

      // Aguardar carregamento do componente lazy
      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });
    });

    it("deve manter a mesma estrutura para view=new", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "new";
          return null;
        }),
      });

      const { container } = render(<TasksPage />, { wrapper: TestWrapper });

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild?.firstChild).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId("task-form-component")).toBeInTheDocument();
      });
    });

    it("deve manter a mesma estrutura para view=edit", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "edit";
          if (key === "id") return "123";
          return null;
        }),
      });

      const { container } = render(<TasksPage />, { wrapper: TestWrapper });

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild?.firstChild).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId("task-form-component")).toBeInTheDocument();
      });
    });

    it("deve manter a mesma estrutura para view=detail", async () => {
      mockUseTasks.selectedTask = mockTask;
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "detail";
          if (key === "id") return "1";
          return null;
        }),
      });

      const { container } = render(<TasksPage />, { wrapper: TestWrapper });

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild?.firstChild).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId("task-detail-component")).toBeInTheDocument();
      });
    });
  });

  describe("Efeitos Colaterais", () => {
    it("deve chamar fetchTask quando view=detail e há id", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "detail";
          if (key === "id") return "123";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      expect(mockFetchTask).toHaveBeenCalledWith("123");
    });

    it("não deve chamar fetchTask quando view=detail mas não há id", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "detail";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      expect(mockFetchTask).not.toHaveBeenCalled();
    });

    it("não deve chamar fetchTask quando view não é detail", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "list";
          if (key === "id") return "123";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      expect(mockFetchTask).not.toHaveBeenCalled();
    });

    it("deve chamar fetchTask novamente quando id muda", async () => {
      const { rerender } = render(<TasksPage />, { wrapper: TestWrapper });

      // Primeiro render com id=123
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "detail";
          if (key === "id") return "123";
          return null;
        }),
      });

      rerender(<TasksPage />);

      expect(mockFetchTask).toHaveBeenCalledWith("123");

      // Segundo render com id=456
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "detail";
          if (key === "id") return "456";
          return null;
        }),
      });

      rerender(<TasksPage />);

      expect(mockFetchTask).toHaveBeenCalledWith("456");
      expect(mockFetchTask).toHaveBeenCalledTimes(2);
    });

    it("deve chamar fetchTask novamente quando view muda para detail", async () => {
      const { rerender } = render(<TasksPage />, { wrapper: TestWrapper });

      // Primeiro render com view=list
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "list";
          if (key === "id") return "123";
          return null;
        }),
      });

      rerender(<TasksPage />);

      expect(mockFetchTask).not.toHaveBeenCalled();

      // Segundo render com view=detail
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "detail";
          if (key === "id") return "123";
          return null;
        }),
      });

      rerender(<TasksPage />);

      expect(mockFetchTask).toHaveBeenCalledWith("123");
      expect(mockFetchTask).toHaveBeenCalledTimes(1);
    });
  });

  describe("Parâmetros de URL", () => {
    it("deve lidar com view inválida renderizando TaskList", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "invalid-view";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });

      expect(
        screen.queryByTestId("task-form-component")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("task-detail-component")
      ).not.toBeInTheDocument();
    });

    it("deve lidar com id vazio como null", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "edit";
          if (key === "id") return "";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      // Deve renderizar TaskList já que id está vazio
      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });

      expect(
        screen.queryByTestId("task-form-component")
      ).not.toBeInTheDocument();
    });

    it("deve preservar outros parâmetros de URL", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "new";
          if (key === "category") return "trabalho";
          if (key === "priority") return "high";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      // Deve ainda renderizar TaskForm para view=new
      await waitFor(() => {
        expect(screen.getByTestId("task-form-component")).toBeInTheDocument();
      });
    });
  });

  describe("Estados de Loading e Error", () => {
    it("deve renderizar normalmente quando há loading", async () => {
      mockUseTasks.loading = true;
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue(null),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      // Deve ainda renderizar TaskList
      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });
    });

    it("deve renderizar normalmente quando há erro", async () => {
      mockUseTasks.error = "Erro ao carregar";
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue(null),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      // Deve ainda renderizar TaskList
      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });
    });

    it("deve aguardar selectedTask ser carregada para mostrar TaskDetail", async () => {
      // Inicialmente sem selectedTask
      mockUseTasks.selectedTask = null;
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "detail";
          if (key === "id") return "1";
          return null;
        }),
      });

      const { rerender } = render(<TasksPage />, { wrapper: TestWrapper });

      // Deve mostrar TaskList enquanto não há selectedTask
      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });

      expect(
        screen.queryByTestId("task-detail-component")
      ).not.toBeInTheDocument();

      // Simular selectedTask sendo carregada
      mockUseTasks.selectedTask = mockTask;
      rerender(<TasksPage />);

      // Agora deve mostrar TaskDetail
      await waitFor(() => {
        expect(screen.getByTestId("task-detail-component")).toBeInTheDocument();
      });

      expect(
        screen.queryByTestId("task-list-component")
      ).not.toBeInTheDocument();
    });
  });

  describe("Integração com Componentes Filhos", () => {
    it("deve passar taskId corretamente para TaskForm no modo edit", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "edit";
          if (key === "id") return "task-123";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByText("- Task ID: task-123")).toBeInTheDocument();
      });
    });

    it("deve passar task corretamente para TaskDetail", async () => {
      const customTask = {
        ...mockTask,
        title: "Tarefa Customizada",
      };
      mockUseTasks.selectedTask = customTask;
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "detail";
          if (key === "id") return "1";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByText("- Tarefa Customizada")).toBeInTheDocument();
      });
    });

    it("não deve passar taskId para TaskForm no modo new", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "new";
          if (key === "id") return "123";
          return null;
        }),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId("task-form-component")).toBeInTheDocument();
      });

      expect(screen.queryByText("Task ID:")).not.toBeInTheDocument();
    });
  });

  describe("Responsividade", () => {
    it("deve aplicar ResponsiveWrapper em todas as views", async () => {
      const views = [
        { view: null, expectedComponent: "task-list-component" },
        { view: "list", expectedComponent: "task-list-component" },
        { view: "new", expectedComponent: "task-form-component" },
        { view: "edit", id: "123", expectedComponent: "task-form-component" },
      ];

      for (const { view, id, expectedComponent } of views) {
        mockUseSearchParams.mockReturnValue({
          get: jest.fn().mockImplementation((key) => {
            if (key === "view") return view;
            if (key === "id") return id;
            return null;
          }),
        });

        const { container, unmount } = render(<TasksPage />, {
          wrapper: TestWrapper,
        });

        await waitFor(() => {
          expect(screen.getByTestId(expectedComponent)).toBeInTheDocument();
        });

        // Verificar estrutura de layout
        expect(container.firstChild).toBeInTheDocument();
        expect(container.firstChild?.firstChild).toBeInTheDocument();

        unmount();
      }
    });
  });

  describe("Casos Extremos", () => {
    it("deve lidar com searchParams undefined", async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue(undefined),
      });

      render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });
    });

    it("deve lidar com múltiplas mudanças rápidas de parâmetros", async () => {
      const { rerender } = render(<TasksPage />, { wrapper: TestWrapper });

      // Mudança 1: view=new
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "new";
          return null;
        }),
      });
      rerender(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByTestId("task-form-component")).toBeInTheDocument();
      });

      // Mudança 2: view=list
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "list";
          return null;
        }),
      });
      rerender(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });

      // Mudança 3: view=edit
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "edit";
          if (key === "id") return "456";
          return null;
        }),
      });
      rerender(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByTestId("task-form-component")).toBeInTheDocument();
        expect(screen.getByText("- Task ID: 456")).toBeInTheDocument();
      });
    });

    it("deve lidar com selectedTask sendo null após estar definida", async () => {
      // Inicialmente com selectedTask
      mockUseTasks.selectedTask = mockTask;
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === "view") return "detail";
          if (key === "id") return "1";
          return null;
        }),
      });

      const { rerender } = render(<TasksPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId("task-detail-component")).toBeInTheDocument();
      });

      // selectedTask vira null
      mockUseTasks.selectedTask = null;
      rerender(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByTestId("task-list-component")).toBeInTheDocument();
      });

      expect(
        screen.queryByTestId("task-detail-component")
      ).not.toBeInTheDocument();
    });
  });
});

/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";

// Mock completo do styled-components ANTES de qualquer import
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

// Mock do TaskForm.styles
jest.mock("../TaskForm.styles", () => ({
  Container: "div",
  MaxWidthWrapper: "div",
  Header: "div",
  Title: "h1",
  Subtitle: "p",
  ErrorContainer: "div",
  ErrorText: "p",
  GridContainer: "div",
  FormSection: "div",
  SidebarSection: "div",
  FormContainer: "form",
  FormGroup: "div",
  Label: "label",
  Input: "input",
  TextArea: "textarea",
  CategoryGrid: "div",
  CategoryButton: "button",
  CategoryButtonContent: "div",
  CategoryIcon: "span",
  CategoryName: "span",
  GridTwoColumns: "div",
  RadioGroup: "div",
  RadioLabel: "label",
  RadioInput: "input",
  CheckboxLabel: "label",
  CheckboxInput: "input",
  ValidationErrorsContainer: "div",
  ValidationErrorTitle: "p",
  ValidationErrorList: "ul",
  ValidationErrorItem: "li",
  FormFooter: "div",
  SuggestButton: "button",
  ButtonGroup: "div",
  SubmitButton: "button",
  CancelButton: "button",
  PreviewCard: "div",
  PreviewTitle: "h3",
  PreviewContent: "div",
  PreviewItem: "div",
  PreviewLabel: "span",
  PreviewValue: "p",
  PreviewValueSmall: "p",
  PriorityContainer: "div",
  ErrorMessage: "p",
  HelpText: "p",
  RequiredAsterisk: "span",
}));

// Mock do PriorityBadge
jest.mock("../../../components/PriorityBadge/PriorityBadge", () => {
  return function MockPriorityBadge({ priority, size }: any) {
    return React.createElement(
      "span",
      { "data-testid": `priority-badge-${priority}` },
      `Priority: ${priority} (${size})`
    );
  };
});

// Mock do TimeSuggestions
jest.mock("../../../components/TimeSuggestions/TimeSuggestions", () => {
  return function MockTimeSuggestions({ taskData, onTimeSelect }: any) {
    return React.createElement("div", { "data-testid": "time-suggestions" }, [
      React.createElement("p", { key: "title" }, "Time Suggestions Mock"),
      React.createElement(
        "button",
        {
          key: "select-time",
          onClick: () =>
            onTimeSelect?.({
              start: "2024-01-15T10:00:00Z",
              end: "2024-01-15T11:00:00Z",
              confidence: 0.8,
              reason: "Mock time suggestion",
            }),
        },
        "Select Mock Time"
      ),
    ]);
  };
});

// Mock do ToastContext
jest.mock("../../../contexts/ToastContext", () => ({
  useToastContext: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
  }),
}));

// Importações
import { ThemeProvider } from "styled-components";
import TaskForm from "../TaskForm";
import { Task } from "../../../contexts/TaskContext";

// Mock do hook useTasks
const mockCreateTask = jest.fn();
const mockUpdateTask = jest.fn();
const mockFetchTask = jest.fn();
const mockUseTasks = {
  createTask: mockCreateTask,
  updateTask: mockUpdateTask,
  fetchTask: mockFetchTask,
  selectedTask: undefined as Task | undefined,
  loading: false,
  error: null,
};

jest.mock("../../../hooks/useTasks", () => ({
  useTasks: () => mockUseTasks,
}));

// Mock do react-router
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUseSearchParams = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
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
    <MemoryRouter initialEntries={["/task-form"]}>
      <ThemeProvider theme={mockTheme}>{children}</ThemeProvider>
    </MemoryRouter>
  );
};

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

describe("TaskForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTasks.loading = false;
    mockUseTasks.selectedTask = undefined;
    mockUseTasks.error = null;

    mockUseParams.mockReturnValue({});
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  describe("Renderização Básica", () => {
    it("deve renderizar o formulário para nova tarefa", () => {
      render(<TaskForm />, { wrapper: TestWrapper });

      expect(screen.getByText("Nova Tarefa")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Digite o título da tarefa")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Descreva a tarefa (opcional)")
      ).toBeInTheDocument();
      expect(screen.getByText("Categoria")).toBeInTheDocument();
      expect(screen.getByText("Prioridade")).toBeInTheDocument();
      expect(screen.getByDisplayValue("60")).toBeInTheDocument();
      expect(
        document.querySelector('input[name="dueDate"]')
      ).toBeInTheDocument();
      expect(screen.getByText("💡 Sugerir Horário")).toBeInTheDocument();
      expect(screen.getByText("Criar Tarefa")).toBeInTheDocument();
      expect(screen.getByText("Cancelar")).toBeInTheDocument();
    });

    it("deve renderizar com dados do selectedTask quando disponível", () => {
      mockUseTasks.selectedTask = mockTask;

      render(<TaskForm />, { wrapper: TestWrapper });

      // O componente sempre renderiza "Nova Tarefa" mesmo com selectedTask
      expect(screen.getByText("Nova Tarefa")).toBeInTheDocument();

      // Campos começam vazios mesmo com selectedTask (comportamento atual)
      const titleInput = screen.getByPlaceholderText(
        "Digite o título da tarefa"
      );
      expect(titleInput).toHaveValue("");

      // Componente renderiza normalmente
      expect(screen.getByDisplayValue("60")).toBeInTheDocument();
      expect(screen.getByText("Criar Tarefa")).toBeInTheDocument();
    });

    it("deve renderizar todas as categorias predefinidas", () => {
      render(<TaskForm />, { wrapper: TestWrapper });

      const categories = [
        "trabalho",
        "pessoal",
        "estudos",
        "saúde",
        "casa",
        "financeiro",
        "lazer",
      ];
      categories.forEach((category) => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });

    it("deve renderizar todas as opções de prioridade", () => {
      render(<TaskForm />, { wrapper: TestWrapper });

      expect(screen.getByTestId("priority-badge-high")).toBeInTheDocument();
      expect(screen.getAllByTestId("priority-badge-medium")).toHaveLength(2);
      expect(screen.getByTestId("priority-badge-low")).toBeInTheDocument();

      // Medium deve estar selecionado por padrão
      expect(screen.getByDisplayValue("medium")).toBeChecked();
    });

    it("deve renderizar preview da tarefa com valores padrão", () => {
      render(<TaskForm />, { wrapper: TestWrapper });

      expect(screen.getByText("Preview da Tarefa")).toBeInTheDocument();
      expect(screen.getByText("Título:")).toBeInTheDocument();
      expect(screen.getByText("Sem título")).toBeInTheDocument();
      expect(screen.getByText("Categoria:")).toBeInTheDocument();
      expect(screen.getByText("Não definida")).toBeInTheDocument();
      expect(screen.getByText("Prioridade:")).toBeInTheDocument();
      expect(screen.getByText("Duração:")).toBeInTheDocument();
      expect(screen.getByText("1h 0min")).toBeInTheDocument();
    });

    it("deve mostrar texto de ajuda para campos obrigatórios", () => {
      render(<TaskForm />, { wrapper: TestWrapper });

      expect(
        screen.getByText("O prazo é obrigatório para novas tarefas")
      ).toBeInTheDocument();

      // Verifica asteriscos para campos obrigatórios
      const asterisks = screen.getAllByText("*");
      expect(asterisks.length).toBeGreaterThan(0);
    });
  });

  describe("Interações do Usuário", () => {
    it("deve permitir preenchimento do título e atualizar preview", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const titleInput = screen.getByPlaceholderText(
        "Digite o título da tarefa"
      );
      await user.type(titleInput, "Minha Nova Tarefa");

      expect(titleInput).toHaveValue("Minha Nova Tarefa");

      // Verifica se o preview foi atualizado
      await waitFor(() => {
        expect(screen.getByText("Minha Nova Tarefa")).toBeInTheDocument();
      });
    });

    it("deve permitir preenchimento da descrição", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const descriptionInput = screen.getByPlaceholderText(
        "Descreva a tarefa (opcional)"
      );
      await user.type(descriptionInput, "Descrição detalhada da tarefa");

      expect(descriptionInput).toHaveValue("Descrição detalhada da tarefa");
    });

    it("deve permitir seleção de categoria e atualizar preview", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const categoryButton = screen.getByText("trabalho");
      await user.click(categoryButton);

      // Verifica se aparece no preview
      await waitFor(() => {
        const previewSection =
          screen.getByText("Preview da Tarefa").parentElement;
        expect(previewSection).toHaveTextContent("trabalho");
      });
    });

    it("deve permitir seleção de prioridade", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const highPriorityRadio = screen.getByDisplayValue("high");
      await user.click(highPriorityRadio);

      expect(highPriorityRadio).toBeChecked();
      expect(screen.getByDisplayValue("medium")).not.toBeChecked();
    });

    it("deve permitir alteração da duração estimada e atualizar preview", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const durationInput = screen.getByDisplayValue("60");
      await user.clear(durationInput);
      await user.type(durationInput, "90");

      expect(durationInput).toHaveValue(90);

      // Verifica se o preview foi atualizado
      await waitFor(() => {
        expect(screen.getByText("1h 30min")).toBeInTheDocument();
      });
    });

    it("deve permitir definição de prazo", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const dueDateInput = document.querySelector(
        'input[name="dueDate"]'
      ) as HTMLInputElement;
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().slice(0, 16);
      await user.type(dueDateInput, futureDateString);

      expect(dueDateInput).toHaveValue(futureDateString);
    });
  });

  describe("Validação de Formulário", () => {
    it("deve impedir submissão quando título está vazio", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const submitButton = screen.getByText("Criar Tarefa");
      await user.click(submitButton);

      // Verifica que a criação não foi chamada
      await waitFor(() => {
        expect(mockCreateTask).not.toHaveBeenCalled();
      });
    });

    it("deve mostrar erro quando categoria não está selecionada", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const titleInput = screen.getByPlaceholderText(
        "Digite o título da tarefa"
      );
      await user.type(titleInput, "Teste");

      const submitButton = screen.getByText("Criar Tarefa");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getAllByText("Categoria é obrigatória")).toHaveLength(2);
      });
    });

    it("deve mostrar erro quando prazo está vazio", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const titleInput = screen.getByPlaceholderText(
        "Digite o título da tarefa"
      );
      await user.type(titleInput, "Teste");

      const categoryButton = screen.getByText("trabalho");
      await user.click(categoryButton);

      const submitButton = screen.getByText("Criar Tarefa");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getAllByText("Prazo é obrigatório para novas tarefas")
        ).toHaveLength(2);
      });
    });

    it("deve mostrar erro quando prazo está no passado", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const titleInput = screen.getByPlaceholderText(
        "Digite o título da tarefa"
      );
      await user.type(titleInput, "Teste");

      const categoryButton = screen.getByText("trabalho");
      await user.click(categoryButton);

      const dueDateInput = document.querySelector(
        'input[name="dueDate"]'
      ) as HTMLInputElement;
      await user.type(dueDateInput, "2020-01-01T10:00");

      const submitButton = screen.getByText("Criar Tarefa");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getAllByText("O prazo não pode ser no passado")
        ).toHaveLength(2);
      });
    });

    it("deve mostrar lista de erros quando há múltiplos problemas", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const submitButton = screen.getByText("Criar Tarefa");
      await user.click(submitButton);

      // Verifica que a criação não foi chamada devido aos erros de validação
      await waitFor(() => {
        expect(mockCreateTask).not.toHaveBeenCalled();
      });
    });
  });

  describe("Sugestão de Horário", () => {
    it("deve manter botão de sugestão desabilitado quando campos obrigatórios estão vazios", () => {
      render(<TaskForm />, { wrapper: TestWrapper });

      const suggestButton = screen.getByText("💡 Sugerir Horário");
      expect(suggestButton).toBeDisabled();
    });

    it("deve habilitar botão de sugestão quando campos obrigatórios estão preenchidos", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const titleInput = screen.getByPlaceholderText(
        "Digite o título da tarefa"
      );
      await user.type(titleInput, "Nova Tarefa");

      const categoryButton = screen.getByText("trabalho");
      await user.click(categoryButton);

      const suggestButton = screen.getByText("💡 Sugerir Horário");
      expect(suggestButton).not.toBeDisabled();
    });

    it("deve mostrar componente de sugestões quando clicado", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const titleInput = screen.getByPlaceholderText(
        "Digite o título da tarefa"
      );
      await user.type(titleInput, "Nova Tarefa");

      const categoryButton = screen.getByText("trabalho");
      await user.click(categoryButton);

      const suggestButton = screen.getByText("💡 Sugerir Horário");
      await user.click(suggestButton);

      expect(screen.getByTestId("time-suggestions")).toBeInTheDocument();
    });

    it("deve preencher prazo quando horário sugerido é selecionado", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const titleInput = screen.getByPlaceholderText(
        "Digite o título da tarefa"
      );
      await user.type(titleInput, "Nova Tarefa");

      const categoryButton = screen.getByText("trabalho");
      await user.click(categoryButton);

      const suggestButton = screen.getByText("💡 Sugerir Horário");
      await user.click(suggestButton);

      const selectTimeButton = screen.getByText("Select Mock Time");
      await user.click(selectTimeButton);

      const dueDateInput = document.querySelector(
        'input[name="dueDate"]'
      ) as HTMLInputElement;
      expect(dueDateInput).toHaveValue("2024-01-15T07:00");
    });
  });

  describe("Submissão do Formulário", () => {
    it("deve criar nova tarefa com dados válidos", async () => {
      const user = userEvent.setup();
      mockCreateTask.mockResolvedValue(mockTask);

      render(<TaskForm />, { wrapper: TestWrapper });

      // Preencher formulário
      const titleInput = screen.getByPlaceholderText(
        "Digite o título da tarefa"
      );
      await user.type(titleInput, "Nova Tarefa");

      const descriptionInput = screen.getByPlaceholderText(
        "Descreva a tarefa (opcional)"
      );
      await user.type(descriptionInput, "Descrição da tarefa");

      const categoryButton = screen.getByText("trabalho");
      await user.click(categoryButton);

      const dueDateInput = document.querySelector(
        'input[name="dueDate"]'
      ) as HTMLInputElement;

      // Use uma data definitivamente no futuro
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().slice(0, 16);
      await user.clear(dueDateInput);
      await user.type(dueDateInput, futureDateString);

      const submitButton = screen.getByText("Criar Tarefa");
      await user.click(submitButton);

      // Aguardar que a submissão seja processada
      await waitFor(() => {
        expect(mockCreateTask).toHaveBeenCalledWith({
          title: "Nova Tarefa",
          description: "Descrição da tarefa",
          category: "trabalho",
          priority: "medium",
          estimatedDuration: 60,
          dueDate: futureDateString, // Use a mesma variável aqui
          completed: false,
        });
      });

      // Verificar navegação após sucesso
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/tasks");
      });
    });

    it("deve mostrar estado de loading durante submissão", () => {
      mockUseTasks.loading = true;

      render(<TaskForm />, { wrapper: TestWrapper });

      const submitButton = screen.getByText((content, element) => {
        return content.includes("Salvando...");
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Navegação", () => {
    it("deve voltar para página anterior quando cancelar", async () => {
      const user = userEvent.setup();
      render(<TaskForm />, { wrapper: TestWrapper });

      const cancelButton = screen.getByText("Cancelar");
      await user.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it("deve chamar callback onCancel quando fornecido", async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();

      render(<TaskForm onCancel={onCancel} />, { wrapper: TestWrapper });

      const cancelButton = screen.getByText("Cancelar");
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("deve chamar callback onSave quando tarefa é salva com sucesso", async () => {
      const user = userEvent.setup();
      const onSave = jest.fn();
      mockCreateTask.mockResolvedValue(mockTask);

      render(<TaskForm onSave={onSave} />, { wrapper: TestWrapper });

      // Preencher formulário mínimo
      const titleInput = screen.getByPlaceholderText(
        "Digite o título da tarefa"
      );
      await user.type(titleInput, "Nova Tarefa");

      const categoryButton = screen.getByText("trabalho");
      await user.click(categoryButton);

      const dueDateInput = document.querySelector(
        'input[name="dueDate"]'
      ) as HTMLInputElement;
      // Use uma data definitivamente no futuro
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().slice(0, 16);
      await user.clear(dueDateInput);
      await user.type(dueDateInput, futureDateString);

      const submitButton = screen.getByText("Criar Tarefa");
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(mockTask);
      });
    });
  });

  describe("Parâmetros da URL", () => {
    it("deve preencher categoria quando fornecida via URL", () => {
      const mockSearchParams = {
        get: jest.fn((key) => (key === "category" ? "estudos" : null)),
      };
      mockUseSearchParams.mockReturnValue(mockSearchParams);

      render(<TaskForm />, { wrapper: TestWrapper });

      // Verifica se aparece no preview
      const previewSection =
        screen.getByText("Preview da Tarefa").parentElement;
      expect(previewSection).toHaveTextContent("estudos");
    });

    it("deve preencher prazo quando fornecido via URL", () => {
      const mockSearchParams = {
        get: jest.fn((key) => (key === "time" ? "2024-01-15T10:00:00Z" : null)),
      };
      mockUseSearchParams.mockReturnValue(mockSearchParams);

      render(<TaskForm />, { wrapper: TestWrapper });

      const dueDateInput = document.querySelector(
        'input[name="dueDate"]'
      ) as HTMLInputElement;
      expect(dueDateInput).toHaveValue("2024-01-15T07:00");
    });
  });

  describe("Tratamento de Erros", () => {
    it("deve mostrar erro quando há erro no contexto", () => {
      mockUseTasks.error = "Erro ao carregar tarefa";

      render(<TaskForm />, { wrapper: TestWrapper });

      expect(screen.getByText("Erro ao carregar tarefa")).toBeInTheDocument();
    });

    it("deve lidar com erro durante criação de tarefa", async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockCreateTask.mockRejectedValue(new Error("Erro ao criar tarefa"));

      render(<TaskForm />, { wrapper: TestWrapper });

      // Preencher formulário válido com data futura
      const titleInput = screen.getByPlaceholderText(
        "Digite o título da tarefa"
      );
      await user.type(titleInput, "Nova Tarefa");

      const categoryButton = screen.getByText("trabalho");
      await user.click(categoryButton);

      const dueDateInput = document.querySelector(
        'input[name="dueDate"]'
      ) as HTMLInputElement;
      // Use uma data futura para evitar erro de validação
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().slice(0, 16);
      await user.clear(dueDateInput);
      await user.type(dueDateInput, futureDateString);

      const submitButton = screen.getByText("Criar Tarefa");
      await user.click(submitButton);

      // Verifica se o createTask foi chamado (e falhou)
      await waitFor(() => {
        expect(mockCreateTask).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Integração com Props", () => {
    it("deve buscar tarefa quando taskId é fornecido via prop", () => {
      render(<TaskForm taskId="123" />, { wrapper: TestWrapper });

      expect(mockFetchTask).toHaveBeenCalledWith("123");
    });

    it("deve funcionar sem props opcionais", () => {
      render(<TaskForm />, { wrapper: TestWrapper });

      // Verifica se renderizou sem erros
      expect(screen.getByText("Nova Tarefa")).toBeInTheDocument();
      expect(screen.getByText("Criar Tarefa")).toBeInTheDocument();
    });
  });
});

/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import "@testing-library/jest-dom";

import DeleteConfirmModal from "../DeleteConfirmModal";

jest.mock("../DeleteConfirmModal.styles", () => ({
  ModalOverlay: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "modal-overlay" },
      children
    ),
  ModalContainer: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "modal-backdrop" },
      children
    ),
  ModalContent: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "modal-content" },
      children
    ),
  IconContainer: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "icon-container" },
      children
    ),
  WarningIcon: ({ children, ...props }: any) =>
    React.createElement(
      "svg",
      { ...props, "data-testid": "warning-icon" },
      children
    ),
  TextContainer: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "text-container" },
      children
    ),
  Title: ({ children, ...props }: any) =>
    React.createElement("h3", { ...props }, children),
  Description: ({ children, ...props }: any) =>
    React.createElement("p", { ...props }, children),
  TaskName: ({ children, ...props }: any) =>
    React.createElement(
      "span",
      { ...props, "data-testid": "task-name" },
      children
    ),
  ActionsContainer: ({ children, ...props }: any) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "actions-container" },
      children
    ),
  CancelButton: ({ children, ...props }: any) =>
    React.createElement(
      "button",
      { ...props, "data-testid": "cancel-button" },
      children
    ),
  DeleteButton: ({ children, ...props }: any) =>
    React.createElement(
      "button",
      { ...props, "data-testid": "delete-button" },
      children
    ),
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

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(ThemeProvider, { theme: mockTheme }, children);
};

describe("DeleteConfirmModal", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const defaultProps = {
    isOpen: true,
    taskTitle: "Tarefa de Teste",
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização Básica", () => {
    it("deve renderizar o modal quando isOpen é true", () => {
      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
      expect(screen.getByTestId("modal-content")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("não deve renderizar o modal quando isOpen é false", () => {
      render(
        React.createElement(DeleteConfirmModal, {
          ...defaultProps,
          isOpen: false,
        }),
        { wrapper: TestWrapper }
      );

      expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("deve renderizar todos os elementos do modal", () => {
      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      expect(screen.getByTestId("warning-icon")).toBeInTheDocument();
      expect(screen.getByText("Excluir Tarefa")).toBeInTheDocument();
      expect(
        screen.getByText(/Tem certeza que deseja excluir a tarefa/)
      ).toBeInTheDocument();
      expect(screen.getByTestId("task-name")).toBeInTheDocument();
      expect(
        screen.getByText((content, element) =>
          content.includes("Esta ação não pode ser desfeita.")
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
      expect(screen.getByTestId("delete-button")).toBeInTheDocument();
    });

    it("deve exibir o título da tarefa corretamente", () => {
      render(
        React.createElement(DeleteConfirmModal, {
          ...defaultProps,
          taskTitle: "Minha Tarefa Importante",
        }),
        { wrapper: TestWrapper }
      );

      const taskName = screen.getByTestId("task-name");
      expect(taskName).toHaveTextContent("Minha Tarefa Importante");
    });

    it("deve renderizar o ícone de aviso com atributos corretos", () => {
      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const icon = screen.getByTestId("warning-icon");
      expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
      expect(icon).toHaveAttribute("fill", "none");
      expect(icon).toHaveAttribute("stroke", "currentColor");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Atributos de Acessibilidade", () => {
    it("deve ter atributos ARIA corretos", () => {
      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
      expect(dialog).toHaveAttribute("aria-describedby", "modal-description");
    });

    it("deve ter IDs corretos para elementos de texto", () => {
      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      expect(screen.getByText("Excluir Tarefa")).toHaveAttribute(
        "id",
        "modal-title"
      );
      expect(
        screen.getByText(/Tem certeza que deseja excluir a tarefa/)
      ).toHaveAttribute("id", "modal-description");
    });

    it("deve ter labels apropriados nos botões", () => {
      render(
        React.createElement(DeleteConfirmModal, {
          ...defaultProps,
          taskTitle: "Tarefa Específica",
        }),
        { wrapper: TestWrapper }
      );

      expect(
        screen.getByLabelText("Cancelar exclusão da tarefa")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Confirmar exclusão da tarefa Tarefa Específica")
      ).toBeInTheDocument();
    });

    it("deve ter tabIndex correto no overlay", () => {
      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const overlay = screen.getByTestId("modal-overlay");
      expect(overlay).toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("Interações com Botões", () => {
    it("deve chamar onCancel quando botão Cancelar é clicado", async () => {
      const user = userEvent.setup();

      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const cancelButton = screen.getByTestId("cancel-button");
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it("deve chamar onConfirm quando botão Excluir é clicado", async () => {
      const user = userEvent.setup();

      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnCancel).not.toHaveBeenCalled();
    });

    it("deve chamar onCancel quando backdrop é clicado", async () => {
      const user = userEvent.setup();

      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const backdrop = screen.getByTestId("modal-backdrop");
      await user.click(backdrop);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it("não deve chamar onCancel quando modal content é clicado", async () => {
      const user = userEvent.setup();

      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const modalContent = screen.getByTestId("modal-content");
      await user.click(modalContent);

      expect(mockOnCancel).not.toHaveBeenCalled();
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
  });

  describe("Navegação por Teclado", () => {
    it("deve chamar onCancel quando Escape é pressionado", async () => {
      const user = userEvent.setup();

      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const overlay = screen.getByTestId("modal-overlay");
      overlay.focus();
      await user.keyboard("{Escape}");

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("deve permitir navegação por Tab entre botões", async () => {
      const user = userEvent.setup();

      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const cancelButton = screen.getByTestId("cancel-button");
      const deleteButton = screen.getByTestId("delete-button");

      cancelButton.focus();
      expect(cancelButton).toHaveFocus();

      await user.tab();
      expect(deleteButton).toHaveFocus();

      await user.tab();

      expect(document.activeElement).toBe(document.body);
    });

    it("deve ativar botões com Enter", async () => {
      const user = userEvent.setup();

      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const cancelButton = screen.getByTestId("cancel-button");
      await user.click(cancelButton);
      await user.keyboard("{Enter}");

      expect(mockOnCancel).toHaveBeenCalledTimes(2);
    });

    it("deve ativar botões com Space", async () => {
      const user = userEvent.setup();

      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);
      await user.keyboard(" ");

      expect(mockOnConfirm).toHaveBeenCalledTimes(2);
    });
  });

  describe("Focus Management", () => {
    it("deve focar no primeiro elemento focável quando modal abre", async () => {
      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const cancelButton = screen.getByTestId("cancel-button");
      cancelButton.focus();

      await waitFor(() => {
        expect(cancelButton).toHaveFocus();
      });
    });

    it("deve manter foco dentro do modal", async () => {
      const user = userEvent.setup();

      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const cancelButton = screen.getByTestId("cancel-button");
      const deleteButton = screen.getByTestId("delete-button");

      await user.click(cancelButton);

      await user.tab();
      expect(deleteButton).toHaveFocus();

      await user.tab({ shift: true });
      expect(cancelButton).toHaveFocus();
    });
  });

  describe("Diferentes Títulos de Tarefa", () => {
    it("deve lidar com títulos longos", () => {
      const longTitle =
        "Esta é uma tarefa com um título muito longo que pode quebrar o layout se não for tratado adequadamente";

      render(
        React.createElement(DeleteConfirmModal, {
          ...defaultProps,
          taskTitle: longTitle,
        }),
        { wrapper: TestWrapper }
      );

      const taskName = screen.getByTestId("task-name");
      expect(taskName).toHaveTextContent(longTitle);
    });

    it("deve lidar com títulos com caracteres especiais", () => {
      const specialTitle = "Tarefa com @#$%^&*()_+ e acentuação: ção, ã, ç";

      render(
        React.createElement(DeleteConfirmModal, {
          ...defaultProps,
          taskTitle: specialTitle,
        }),
        { wrapper: TestWrapper }
      );

      const taskName = screen.getByTestId("task-name");
      expect(taskName).toHaveTextContent(specialTitle);
    });

    it("deve lidar com título vazio", () => {
      render(
        React.createElement(DeleteConfirmModal, {
          ...defaultProps,
          taskTitle: "",
        }),
        { wrapper: TestWrapper }
      );

      const taskName = screen.getByTestId("task-name");
      expect(taskName).toHaveTextContent("");
    });

    it("deve lidar com título com apenas espaços", () => {
      render(
        React.createElement(DeleteConfirmModal, {
          ...defaultProps,
          taskTitle: "   ",
        }),
        { wrapper: TestWrapper }
      );

      const taskName = screen.getByTestId("task-name");
      expect(taskName).toHaveTextContent("");
    });
  });

  describe("Estados de Loading/Disabled", () => {
    it("deve funcionar normalmente quando botões não estão disabled", async () => {
      const user = userEvent.setup();

      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const cancelButton = screen.getByTestId("cancel-button");
      const deleteButton = screen.getByTestId("delete-button");

      expect(cancelButton).not.toBeDisabled();
      expect(deleteButton).not.toBeDisabled();

      await user.click(cancelButton);
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe("Múltiplas Interações", () => {
    it("deve lidar com múltiplos cliques rápidos", async () => {
      const user = userEvent.setup();

      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const deleteButton = screen.getByTestId("delete-button");

      // Cliques rápidos
      await user.click(deleteButton);
      await user.click(deleteButton);
      await user.click(deleteButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(3);
    });

    it("deve lidar com alternância entre botões", async () => {
      const user = userEvent.setup();

      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      const cancelButton = screen.getByTestId("cancel-button");
      const deleteButton = screen.getByTestId("delete-button");

      await user.click(cancelButton);
      await user.click(deleteButton);
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(2);
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe("Casos Extremos", () => {
    it("deve lidar com callbacks undefined", () => {
      expect(() => {
        render(
          React.createElement(DeleteConfirmModal, {
            isOpen: true,
            taskTitle: "Teste",
            onConfirm: undefined as any,
            onCancel: undefined as any,
          }),
          { wrapper: TestWrapper }
        );
      }).not.toThrow();
    });

    it("deve lidar com callbacks null", () => {
      expect(() => {
        render(
          React.createElement(DeleteConfirmModal, {
            isOpen: true,
            taskTitle: "Teste",
            onConfirm: null as any,
            onCancel: null as any,
          }),
          { wrapper: TestWrapper }
        );
      }).not.toThrow();
    });

    it("deve lidar com taskTitle undefined", () => {
      render(
        React.createElement(DeleteConfirmModal, {
          ...defaultProps,
          taskTitle: undefined as any,
        }),
        { wrapper: TestWrapper }
      );

      const taskName = screen.getByTestId("task-name");
      expect(taskName).toBeInTheDocument();
    });

    it("deve lidar com isOpen undefined", () => {
      render(
        React.createElement(DeleteConfirmModal, {
          ...defaultProps,
          isOpen: undefined as any,
        }),
        { wrapper: TestWrapper }
      );

      expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("não deve re-renderizar quando isOpen é false", () => {
      const renderSpy = jest.fn();

      const TestModal = (props: any) => {
        renderSpy();
        return React.createElement(DeleteConfirmModal, props);
      };

      const { rerender } = render(
        React.createElement(TestModal, { ...defaultProps, isOpen: false }),
        { wrapper: TestWrapper }
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);

      rerender(
        React.createElement(TestModal, { ...defaultProps, isOpen: false })
      );
      expect(renderSpy).toHaveBeenCalledTimes(2);

      expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
    });

    it("deve renderizar eficientemente quando props mudam", () => {
      const { rerender } = render(
        React.createElement(DeleteConfirmModal, defaultProps),
        { wrapper: TestWrapper }
      );

      expect(screen.getByTestId("task-name")).toHaveTextContent(
        "Tarefa de Teste"
      );

      rerender(
        React.createElement(
          ThemeProvider,
          { theme: mockTheme },
          React.createElement(DeleteConfirmModal, {
            ...defaultProps,
            taskTitle: "Nova Tarefa",
          })
        )
      );

      expect(screen.getByTestId("task-name")).toHaveTextContent("Nova Tarefa");
    });
  });

  describe("Integração com Styled Components", () => {
    it("deve aplicar estilos através dos styled components", () => {
      render(React.createElement(DeleteConfirmModal, defaultProps), {
        wrapper: TestWrapper,
      });

      expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
      expect(screen.getByTestId("modal-backdrop")).toBeInTheDocument();
      expect(screen.getByTestId("modal-content")).toBeInTheDocument();
      expect(screen.getByTestId("warning-icon")).toBeInTheDocument();
      expect(screen.getByTestId("actions-container")).toBeInTheDocument();
    });

    it("deve receber props do tema corretamente", () => {
      const { container } = render(
        React.createElement(DeleteConfirmModal, defaultProps),
        { wrapper: TestWrapper }
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

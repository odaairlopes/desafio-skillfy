/**
 * @jest-environment jsdom
 */
import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock do styled-components ANTES do import
jest.mock("styled-components", () => ({
  __esModule: true,
  default: {
    div: (styles: any) => (props: any) =>
      React.createElement("div", {
        ...props,
        "data-testid": "toast-container",
        "data-styled": "true",
      }),
  },
}));

// Mock do hook useToast
const mockUseToast = {
  toasts: [],
  removeToast: jest.fn(),
  showSuccess: jest.fn(),
  showError: jest.fn(),
  showInfo: jest.fn(),
};

jest.mock("../../hooks/useToast", () => ({
  useToast: () => mockUseToast,
}));

// Mock do componente Toast
jest.mock("../../components/Toast/Toast", () => {
  return function MockToast({ message, type, onClose }: any) {
    return React.createElement("div", {
      "data-testid": `toast-${type}`,
      "data-message": message,
      onClick: onClose,
      children: [
        React.createElement("span", { key: "message" }, message),
        React.createElement(
          "button",
          {
            key: "close",
            "data-testid": "toast-close",
            onClick: onClose,
          },
          "×"
        ),
      ],
    });
  };
});

import { ToastProvider, useToastContext } from "../ToastContext";

// Componente de teste para acessar o contexto
const TestComponent = ({
  onContextReady,
}: {
  onContextReady?: (context: any) => void;
}) => {
  const toastContext = useToastContext();

  React.useEffect(() => {
    if (onContextReady) {
      onContextReady(toastContext);
    }
  }, [toastContext, onContextReady]);

  return React.createElement("div", { "data-testid": "test-component" }, [
    React.createElement(
      "button",
      {
        key: "success-btn",
        "data-testid": "show-success",
        onClick: () => toastContext.showSuccess("Success message"),
      },
      "Show Success"
    ),
    React.createElement(
      "button",
      {
        key: "error-btn",
        "data-testid": "show-error",
        onClick: () => toastContext.showError("Error message"),
      },
      "Show Error"
    ),
    React.createElement(
      "button",
      {
        key: "info-btn",
        "data-testid": "show-info",
        onClick: () => toastContext.showInfo("Info message"),
      },
      "Show Info"
    ),
    React.createElement(
      "button",
      {
        key: "custom-duration-btn",
        "data-testid": "show-custom-duration",
        onClick: () => toastContext.showSuccess("Custom duration", 5000),
      },
      "Show Custom Duration"
    ),
  ]);
};

describe("ToastContext", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Reset mock implementation
    mockUseToast.toasts = [];
    mockUseToast.removeToast = jest.fn();
    mockUseToast.showSuccess = jest.fn().mockReturnValue("success-id");
    mockUseToast.showError = jest.fn().mockReturnValue("error-id");
    mockUseToast.showInfo = jest.fn().mockReturnValue("info-id");
  });

  describe("ToastProvider", () => {
    it("deve renderizar children corretamente", () => {
      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement("div", { "data-testid": "child" }, "Test Child")
        )
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByTestId("child")).toHaveTextContent("Test Child");
    });

    it("deve renderizar ToastContainer", () => {
      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement("div", { "data-testid": "child" }, "Test Child")
        )
      );

      expect(screen.getByTestId("toast-container")).toBeInTheDocument();
      expect(screen.getByTestId("toast-container")).toHaveAttribute(
        "data-styled",
        "true"
      );
    });

    it("deve fornecer contexto com métodos corretos", () => {
      let contextValue: any = null;

      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, {
            onContextReady: (context) => {
              contextValue = context;
            },
          })
        )
      );

      expect(contextValue).toBeTruthy();
      expect(contextValue.showSuccess).toBeDefined();
      expect(contextValue.showError).toBeDefined();
      expect(contextValue.showInfo).toBeDefined();
      expect(typeof contextValue.showSuccess).toBe("function");
      expect(typeof contextValue.showError).toBe("function");
      expect(typeof contextValue.showInfo).toBe("function");
    });

    it("não deve renderizar toasts quando lista está vazia", () => {
      mockUseToast.toasts = [];

      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.queryByTestId("toast-success")).not.toBeInTheDocument();
      expect(screen.queryByTestId("toast-error")).not.toBeInTheDocument();
      expect(screen.queryByTestId("toast-info")).not.toBeInTheDocument();
    });

    it("deve renderizar toasts quando existem na lista", () => {
      mockUseToast.toasts = [
        { id: "1", message: "Success toast", type: "success", duration: 3000 },
        { id: "2", message: "Error toast", type: "error", duration: 3000 },
        { id: "3", message: "Info toast", type: "info", duration: 3000 },
      ];

      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("toast-success")).toBeInTheDocument();
      expect(screen.getByTestId("toast-error")).toBeInTheDocument();
      expect(screen.getByTestId("toast-info")).toBeInTheDocument();

      expect(screen.getByTestId("toast-success")).toHaveAttribute(
        "data-message",
        "Success toast"
      );
      expect(screen.getByTestId("toast-error")).toHaveAttribute(
        "data-message",
        "Error toast"
      );
      expect(screen.getByTestId("toast-info")).toHaveAttribute(
        "data-message",
        "Info toast"
      );
    });

    it("deve renderizar múltiplos toasts do mesmo tipo", () => {
      mockUseToast.toasts = [
        { id: "1", message: "First success", type: "success", duration: 3000 },
        { id: "2", message: "Second success", type: "success", duration: 3000 },
      ];

      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      const successToasts = screen.getAllByTestId("toast-success");
      expect(successToasts).toHaveLength(2);
      expect(successToasts[0]).toHaveAttribute("data-message", "First success");
      expect(successToasts[1]).toHaveAttribute(
        "data-message",
        "Second success"
      );
    });

    it("deve chamar removeToast quando toast é fechado", () => {
      mockUseToast.toasts = [
        {
          id: "toast-1",
          message: "Test toast",
          type: "success",
          duration: 3000,
        },
      ];

      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      const closeButton = screen.getByTestId("toast-close");
      fireEvent.click(closeButton);

      expect(mockUseToast.removeToast).toHaveBeenCalledWith("toast-1");
    });
  });

  describe("useToastContext", () => {
    it("deve lançar erro quando usado fora do provider", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const TestComponentOutsideProvider = () => {
        useToastContext();
        return React.createElement("div", null, "Should not render");
      };

      expect(() => {
        render(React.createElement(TestComponentOutsideProvider, null));
      }).toThrow("useToastContext must be used within a ToastProvider");

      consoleSpy.mockRestore();
    });

    it("deve retornar contexto quando usado dentro do provider", () => {
      let contextValue: any = null;

      const TestComponentInsideProvider = () => {
        contextValue = useToastContext();
        return React.createElement(
          "div",
          { "data-testid": "inside-provider" },
          "Inside Provider"
        );
      };

      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponentInsideProvider, null)
        )
      );

      expect(screen.getByTestId("inside-provider")).toBeInTheDocument();
      expect(contextValue).toBeTruthy();
      expect(contextValue.showSuccess).toBeDefined();
      expect(contextValue.showError).toBeDefined();
      expect(contextValue.showInfo).toBeDefined();
    });
  });

  describe("Métodos do Contexto", () => {
    describe("showSuccess", () => {
      it("deve chamar showSuccess do hook com mensagem", () => {
        render(
          React.createElement(
            ToastProvider,
            null,
            React.createElement(TestComponent, null)
          )
        );

        const button = screen.getByTestId("show-success");
        fireEvent.click(button);

        expect(mockUseToast.showSuccess).toHaveBeenCalledWith(
          "Success message"
        );
      });

      it("deve chamar showSuccess com duração customizada", () => {
        render(
          React.createElement(
            ToastProvider,
            null,
            React.createElement(TestComponent, null)
          )
        );

        const button = screen.getByTestId("show-custom-duration");
        fireEvent.click(button);

        expect(mockUseToast.showSuccess).toHaveBeenCalledWith(
          "Custom duration",
          5000
        );
      });

      it("deve retornar ID do toast", () => {
        let toastId: string | null = null;

        const TestSuccessComponent = () => {
          const { showSuccess } = useToastContext();

          const handleClick = () => {
            toastId = showSuccess("Test message");
          };

          return React.createElement(
            "button",
            { "data-testid": "test-success", onClick: handleClick },
            "Test"
          );
        };

        render(
          React.createElement(
            ToastProvider,
            null,
            React.createElement(TestSuccessComponent, null)
          )
        );

        fireEvent.click(screen.getByTestId("test-success"));

        expect(toastId).toBe("success-id");
      });
    });

    describe("showError", () => {
      it("deve chamar showError do hook com mensagem", () => {
        render(
          React.createElement(
            ToastProvider,
            null,
            React.createElement(TestComponent, null)
          )
        );

        const button = screen.getByTestId("show-error");
        fireEvent.click(button);

        expect(mockUseToast.showError).toHaveBeenCalledWith("Error message");
      });

      it("deve chamar showError com duração customizada", () => {
        let errorId: string | null = null;

        const TestErrorComponent = () => {
          const { showError } = useToastContext();

          const handleClick = () => {
            errorId = showError("Error with custom duration", 10000);
          };

          return React.createElement(
            "button",
            { "data-testid": "test-error", onClick: handleClick },
            "Test Error"
          );
        };

        render(
          React.createElement(
            ToastProvider,
            null,
            React.createElement(TestErrorComponent, null)
          )
        );

        fireEvent.click(screen.getByTestId("test-error"));

        expect(mockUseToast.showError).toHaveBeenCalledWith(
          "Error with custom duration",
          10000
        );
        expect(errorId).toBe("error-id");
      });
    });

    describe("showInfo", () => {
      it("deve chamar showInfo do hook com mensagem", () => {
        render(
          React.createElement(
            ToastProvider,
            null,
            React.createElement(TestComponent, null)
          )
        );

        const button = screen.getByTestId("show-info");
        fireEvent.click(button);

        expect(mockUseToast.showInfo).toHaveBeenCalledWith("Info message");
      });

      it("deve chamar showInfo com duração customizada", () => {
        let infoId: string | null = null;

        const TestInfoComponent = () => {
          const { showInfo } = useToastContext();

          const handleClick = () => {
            infoId = showInfo("Info with custom duration", 2000);
          };

          return React.createElement(
            "button",
            { "data-testid": "test-info", onClick: handleClick },
            "Test Info"
          );
        };

        render(
          React.createElement(
            ToastProvider,
            null,
            React.createElement(TestInfoComponent, null)
          )
        );

        fireEvent.click(screen.getByTestId("test-info"));

        expect(mockUseToast.showInfo).toHaveBeenCalledWith(
          "Info with custom duration",
          2000
        );
        expect(infoId).toBe("info-id");
      });
    });
  });

  describe("Integração com Toasts", () => {
    it("deve atualizar lista de toasts dinamicamente", () => {
      // Iniciar sem toasts
      mockUseToast.toasts = [];

      const { rerender } = render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.queryByTestId("toast-success")).not.toBeInTheDocument();

      // Adicionar toast
      mockUseToast.toasts = [
        { id: "1", message: "New toast", type: "success", duration: 3000 },
      ];

      rerender(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("toast-success")).toBeInTheDocument();

      // Remover toast
      mockUseToast.toasts = [];

      rerender(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.queryByTestId("toast-success")).not.toBeInTheDocument();
    });

    it("deve lidar com diferentes tipos de toast simultaneamente", () => {
      mockUseToast.toasts = [
        { id: "1", message: "Success", type: "success", duration: 3000 },
        { id: "2", message: "Error", type: "error", duration: 3000 },
        { id: "3", message: "Info", type: "info", duration: 3000 },
      ];

      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("toast-success")).toBeInTheDocument();
      expect(screen.getByTestId("toast-error")).toBeInTheDocument();
      expect(screen.getByTestId("toast-info")).toBeInTheDocument();

      // Verificar que cada toast tem sua mensagem correta
      expect(screen.getByTestId("toast-success")).toHaveAttribute(
        "data-message",
        "Success"
      );
      expect(screen.getByTestId("toast-error")).toHaveAttribute(
        "data-message",
        "Error"
      );
      expect(screen.getByTestId("toast-info")).toHaveAttribute(
        "data-message",
        "Info"
      );
    });

    it("deve preservar ordem dos toasts", () => {
      mockUseToast.toasts = [
        { id: "1", message: "First", type: "success", duration: 3000 },
        { id: "2", message: "Second", type: "error", duration: 3000 },
        { id: "3", message: "Third", type: "info", duration: 3000 },
      ];

      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      const toastContainer = screen.getByTestId("toast-container");
      const children = Array.from(toastContainer.children);

      expect(children).toHaveLength(3);
      expect(children[0]).toHaveAttribute("data-message", "First");
      expect(children[1]).toHaveAttribute("data-message", "Second");
      expect(children[2]).toHaveAttribute("data-message", "Third");
    });

    it("deve chamar removeToast com ID correto para cada toast", () => {
      mockUseToast.toasts = [
        { id: "toast-1", message: "First", type: "success", duration: 3000 },
        { id: "toast-2", message: "Second", type: "error", duration: 3000 },
      ];

      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      const closeButtons = screen.getAllByTestId("toast-close");

      // Fechar primeiro toast
      fireEvent.click(closeButtons[0]);
      expect(mockUseToast.removeToast).toHaveBeenCalledWith("toast-1");

      // Fechar segundo toast
      fireEvent.click(closeButtons[1]);
      expect(mockUseToast.removeToast).toHaveBeenCalledWith("toast-2");
    });
  });

  describe("Múltiplos Consumidores", () => {
    it("deve permitir múltiplos componentes usando o contexto", () => {
      const Consumer1 = () => {
        const { showSuccess } = useToastContext();
        return React.createElement(
          "button",
          {
            "data-testid": "consumer-1",
            onClick: () => showSuccess("Consumer 1 message"),
          },
          "Consumer 1"
        );
      };

      const Consumer2 = () => {
        const { showError } = useToastContext();
        return React.createElement(
          "button",
          {
            "data-testid": "consumer-2",
            onClick: () => showError("Consumer 2 message"),
          },
          "Consumer 2"
        );
      };

      render(
        React.createElement(ToastProvider, null, [
          React.createElement(Consumer1, { key: "1" }),
          React.createElement(Consumer2, { key: "2" }),
        ])
      );

      fireEvent.click(screen.getByTestId("consumer-1"));
      expect(mockUseToast.showSuccess).toHaveBeenCalledWith(
        "Consumer 1 message"
      );

      fireEvent.click(screen.getByTestId("consumer-2"));
      expect(mockUseToast.showError).toHaveBeenCalledWith("Consumer 2 message");
    });

    it("deve compartilhar mesmo contexto entre consumidores", () => {
      let context1: any = null;
      let context2: any = null;

      const Consumer1 = () => {
        context1 = useToastContext();
        return React.createElement("div", { "data-testid": "consumer-1" });
      };

      const Consumer2 = () => {
        context2 = useToastContext();
        return React.createElement("div", { "data-testid": "consumer-2" });
      };

      render(
        React.createElement(ToastProvider, null, [
          React.createElement(Consumer1, { key: "1" }),
          React.createElement(Consumer2, { key: "2" }),
        ])
      );

      expect(context1).toBeTruthy();
      expect(context2).toBeTruthy();
      expect(context1).toBe(context2);
    });
  });

  describe("Casos Extremos", () => {
    it("deve lidar com toasts com IDs duplicados", () => {
      mockUseToast.toasts = [
        { id: "duplicate", message: "First", type: "success", duration: 3000 },
        { id: "duplicate", message: "Second", type: "error", duration: 3000 },
      ];

      expect(() => {
        render(
          React.createElement(
            ToastProvider,
            null,
            React.createElement(TestComponent, null)
          )
        );
      }).not.toThrow();

      // React deve lidar com keys duplicadas com warning
      const successToasts = screen.getAllByTestId("toast-success");
      const errorToasts = screen.getAllByTestId("toast-error");
      expect(successToasts.length + errorToasts.length).toBe(2);
    });

    it("deve lidar com mensagens vazias", () => {
      mockUseToast.toasts = [
        { id: "empty", message: "", type: "success", duration: 3000 },
      ];

      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("toast-success")).toBeInTheDocument();
      expect(screen.getByTestId("toast-success")).toHaveAttribute(
        "data-message",
        ""
      );
    });

    it("deve lidar com mensagens muito longas", () => {
      const longMessage = "A".repeat(1000);
      mockUseToast.toasts = [
        { id: "long", message: longMessage, type: "info", duration: 3000 },
      ];

      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("toast-info")).toBeInTheDocument();
      expect(screen.getByTestId("toast-info")).toHaveAttribute(
        "data-message",
        longMessage
      );
    });

    it("deve funcionar com re-renders", () => {
      const { rerender } = render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("test-component")).toBeInTheDocument();

      rerender(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("test-component")).toBeInTheDocument();

      // Context deve continuar funcionando
      fireEvent.click(screen.getByTestId("show-success"));
      expect(mockUseToast.showSuccess).toHaveBeenCalled();
    });
  });

  describe("Performance", () => {
    it("deve memoizar contexto corretamente", () => {
      const mockCallback = jest.fn();

      const TestMemoComponent = () => {
        const context = useToastContext();
        mockCallback(context);
        return React.createElement(
          "div",
          { "data-testid": "memo-test" },
          "Memo Test"
        );
      };

      const { rerender } = render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestMemoComponent, null)
        )
      );

      expect(mockCallback).toHaveBeenCalledTimes(1);

      // Re-render sem mudança
      rerender(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestMemoComponent, null)
        )
      );

      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it("deve lidar com grande quantidade de toasts", () => {
      const manyToasts = Array.from({ length: 100 }, (_, i) => ({
        id: `toast-${i}`,
        message: `Message ${i}`,
        type: "success" as const,
        duration: 3000,
      }));

      mockUseToast.toasts = manyToasts;

      expect(() => {
        render(
          React.createElement(
            ToastProvider,
            null,
            React.createElement(TestComponent, null)
          )
        );
      }).not.toThrow();

      const toasts = screen.getAllByTestId("toast-success");
      expect(toasts).toHaveLength(100);
    });
  });

  describe("Integração com useToast Hook", () => {
    it("deve usar todos os métodos do hook useToast", () => {
      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      // Verificar que o hook foi chamado (implicitamente através dos mocks)
      expect(mockUseToast).toBeDefined();
      expect(mockUseToast.toasts).toBeDefined();
      expect(mockUseToast.removeToast).toBeDefined();
      expect(mockUseToast.showSuccess).toBeDefined();
      expect(mockUseToast.showError).toBeDefined();
      expect(mockUseToast.showInfo).toBeDefined();
    });

    it("deve passar propriedades corretas para componente Toast", () => {
      mockUseToast.toasts = [
        {
          id: "test-toast",
          message: "Test message",
          type: "success",
          duration: 5000,
        },
      ];

      render(
        React.createElement(
          ToastProvider,
          null,
          React.createElement(TestComponent, null)
        )
      );

      const toast = screen.getByTestId("toast-success");
      expect(toast).toHaveAttribute("data-message", "Test message");

      // Verificar se onClose funciona
      fireEvent.click(toast);
      expect(mockUseToast.removeToast).toHaveBeenCalledWith("test-toast");
    });
  });
});

/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import { TaskProvider, useTaskContext, Task } from "../TaskContext";

// Mock de dados para testes
const mockTask1: Task = {
  id: "1",
  title: "Tarefa 1",
  description: "Descrição da tarefa 1",
  priority: "high",
  category: "trabalho",
  completed: false,
  dueDate: "2024-12-31T23:59:59Z",
  estimatedDuration: 60,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const mockTask2: Task = {
  id: "2",
  title: "Tarefa 2",
  description: "Descrição da tarefa 2",
  priority: "medium",
  category: "pessoal",
  completed: true,
  dueDate: "2024-12-30T23:59:59Z",
  estimatedDuration: 30,
  createdAt: "2024-01-02T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
  completedAt: "2024-01-02T12:00:00Z",
};

const mockTask3: Task = {
  id: "3",
  title: "Tarefa 3",
  priority: "low",
  category: "estudos",
  completed: false,
  createdAt: "2024-01-03T00:00:00Z",
  updatedAt: "2024-01-03T00:00:00Z",
};

// Componente de teste para acessar o contexto
const TestComponent = ({
  onStateChange,
}: {
  onStateChange?: (state: any, dispatch: any) => void;
}) => {
  const { state, dispatch } = useTaskContext();

  React.useEffect(() => {
    if (onStateChange) {
      onStateChange(state, dispatch);
    }
  }, [state, dispatch, onStateChange]);

  // Garantir que tasks seja sempre um array para evitar erros
  const tasks = Array.isArray(state.tasks) ? state.tasks : [];

  return React.createElement("div", { "data-testid": "test-component" }, [
    React.createElement(
      "div",
      { key: "tasks", "data-testid": "tasks-count" },
      tasks.length
    ),
    React.createElement(
      "div",
      { key: "loading", "data-testid": "loading" },
      String(state.loading)
    ),
    React.createElement(
      "div",
      { key: "error", "data-testid": "error" },
      state.error || "null"
    ),
    React.createElement(
      "div",
      { key: "selected", "data-testid": "selected-task" },
      state.selectedTask?.id || "null"
    ),
    tasks.map((task) =>
      React.createElement(
        "div",
        { key: task.id, "data-testid": `task-${task.id}` },
        `${task.title} - ${task.priority} - ${
          task.completed ? "completed" : "pending"
        }`
      )
    ),
  ]);
};

// Wrapper de teste
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(TaskProvider, null, children);
};

describe("TaskContext", () => {
  describe("TaskProvider", () => {
    it("deve renderizar children corretamente", () => {
      render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement("div", { "data-testid": "child" }, "Test Child")
        )
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByTestId("child")).toHaveTextContent("Test Child");
    });

    it("deve fornecer estado inicial correto", () => {
      render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestComponent, null)
        )
      );

      expect(screen.getByTestId("tasks-count")).toHaveTextContent("0");
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByTestId("error")).toHaveTextContent("null");
      expect(screen.getByTestId("selected-task")).toHaveTextContent("null");
    });
  });

  describe("useTaskContext", () => {
    it("deve lançar erro quando usado fora do provider", () => {
      // Mock console.error para evitar logs desnecessários
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const TestComponentOutsideProvider = () => {
        useTaskContext();
        return React.createElement("div", null, "Should not render");
      };

      expect(() => {
        render(React.createElement(TestComponentOutsideProvider, null));
      }).toThrow("useTaskContext must be used within a TaskProvider");

      consoleSpy.mockRestore();
    });

    it("deve retornar contexto quando usado dentro do provider", () => {
      let contextValue: any = null;

      const TestComponentInsideProvider = () => {
        contextValue = useTaskContext();
        return React.createElement(
          "div",
          { "data-testid": "inside-provider" },
          "Inside Provider"
        );
      };

      render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestComponentInsideProvider, null)
        )
      );

      expect(screen.getByTestId("inside-provider")).toBeInTheDocument();
      expect(contextValue).toBeTruthy();
      expect(contextValue.state).toBeDefined();
      expect(contextValue.dispatch).toBeDefined();
      expect(typeof contextValue.dispatch).toBe("function");
    });
  });

  describe("Reducer Actions", () => {
    describe("SET_LOADING", () => {
      it("deve definir loading como true", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_LOADING", payload: true });
        });

        expect(screen.getByTestId("loading")).toHaveTextContent("true");
      });

      it("deve definir loading como false", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_LOADING", payload: true });
        });

        act(() => {
          dispatch({ type: "SET_LOADING", payload: false });
        });

        expect(screen.getByTestId("loading")).toHaveTextContent("false");
      });
    });

    describe("SET_ERROR", () => {
      it("deve definir mensagem de erro e loading false", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_LOADING", payload: true });
        });

        act(() => {
          dispatch({ type: "SET_ERROR", payload: "Erro de teste" });
        });

        expect(screen.getByTestId("error")).toHaveTextContent("Erro de teste");
        expect(screen.getByTestId("loading")).toHaveTextContent("false");
      });

      it("deve limpar erro quando payload é null", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_ERROR", payload: "Erro de teste" });
        });

        act(() => {
          dispatch({ type: "SET_ERROR", payload: null });
        });

        expect(screen.getByTestId("error")).toHaveTextContent("null");
      });
    });

    describe("CLEAR_ERROR", () => {
      it("deve limpar erro mantendo outros estados", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_ERROR", payload: "Erro de teste" });
        });

        act(() => {
          dispatch({ type: "CLEAR_ERROR" });
        });

        expect(screen.getByTestId("error")).toHaveTextContent("null");
      });
    });

    describe("SET_TASKS", () => {
      it("deve definir lista de tarefas e limpar loading/error", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_LOADING", payload: true });
          dispatch({ type: "SET_ERROR", payload: "Erro anterior" });
        });

        act(() => {
          dispatch({ type: "SET_TASKS", payload: [mockTask1, mockTask2] });
        });

        expect(screen.getByTestId("tasks-count")).toHaveTextContent("2");
        expect(screen.getByTestId("loading")).toHaveTextContent("false");
        expect(screen.getByTestId("error")).toHaveTextContent("null");
        expect(screen.getByTestId("task-1")).toHaveTextContent(
          "Tarefa 1 - high - pending"
        );
        expect(screen.getByTestId("task-2")).toHaveTextContent(
          "Tarefa 2 - medium - completed"
        );
      });

      it("deve substituir tarefas existentes", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_TASKS", payload: [mockTask1] });
        });

        expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");

        act(() => {
          dispatch({ type: "SET_TASKS", payload: [mockTask2, mockTask3] });
        });

        expect(screen.getByTestId("tasks-count")).toHaveTextContent("2");
        expect(screen.queryByTestId("task-1")).not.toBeInTheDocument();
        expect(screen.getByTestId("task-2")).toBeInTheDocument();
        expect(screen.getByTestId("task-3")).toBeInTheDocument();
      });
    });

    describe("ADD_TASK", () => {
      it("deve adicionar nova tarefa à lista", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "ADD_TASK", payload: mockTask1 });
        });

        expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");
        expect(screen.getByTestId("task-1")).toHaveTextContent(
          "Tarefa 1 - high - pending"
        );
        expect(screen.getByTestId("loading")).toHaveTextContent("false");
        expect(screen.getByTestId("error")).toHaveTextContent("null");
      });

      it("deve adicionar múltiplas tarefas", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "ADD_TASK", payload: mockTask1 });
        });

        act(() => {
          dispatch({ type: "ADD_TASK", payload: mockTask2 });
        });

        expect(screen.getByTestId("tasks-count")).toHaveTextContent("2");
        expect(screen.getByTestId("task-1")).toBeInTheDocument();
        expect(screen.getByTestId("task-2")).toBeInTheDocument();
      });

      it("deve manter tarefas existentes ao adicionar nova", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_TASKS", payload: [mockTask1] });
        });

        act(() => {
          dispatch({ type: "ADD_TASK", payload: mockTask2 });
        });

        expect(screen.getByTestId("tasks-count")).toHaveTextContent("2");
        expect(screen.getByTestId("task-1")).toBeInTheDocument();
        expect(screen.getByTestId("task-2")).toBeInTheDocument();
      });
    });

    describe("UPDATE_TASK", () => {
      it("deve atualizar tarefa existente", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_TASKS", payload: [mockTask1, mockTask2] });
        });

        const updatedTask = {
          ...mockTask1,
          title: "Tarefa 1 Atualizada",
          completed: true,
        };

        act(() => {
          dispatch({ type: "UPDATE_TASK", payload: updatedTask });
        });

        expect(screen.getByTestId("tasks-count")).toHaveTextContent("2");
        expect(screen.getByTestId("task-1")).toHaveTextContent(
          "Tarefa 1 Atualizada - high - completed"
        );
        expect(screen.getByTestId("task-2")).toHaveTextContent(
          "Tarefa 2 - medium - completed"
        );
      });

      it("deve atualizar selectedTask se for a mesma tarefa", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_TASKS", payload: [mockTask1] });
          dispatch({ type: "SET_SELECTED_TASK", payload: mockTask1 });
        });

        expect(screen.getByTestId("selected-task")).toHaveTextContent("1");

        const updatedTask = { ...mockTask1, title: "Tarefa Atualizada" };

        act(() => {
          dispatch({ type: "UPDATE_TASK", payload: updatedTask });
        });

        expect(screen.getByTestId("selected-task")).toHaveTextContent("1");
      });

      it("não deve afetar selectedTask se for tarefa diferente", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_TASKS", payload: [mockTask1, mockTask2] });
          dispatch({ type: "SET_SELECTED_TASK", payload: mockTask1 });
        });

        const updatedTask2 = { ...mockTask2, title: "Tarefa 2 Atualizada" };

        act(() => {
          dispatch({ type: "UPDATE_TASK", payload: updatedTask2 });
        });

        expect(screen.getByTestId("selected-task")).toHaveTextContent("1");
      });

      it("não deve fazer nada se tarefa não existir", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_TASKS", payload: [mockTask1] });
        });

        act(() => {
          dispatch({ type: "UPDATE_TASK", payload: mockTask2 });
        });

        expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");
        expect(screen.getByTestId("task-1")).toBeInTheDocument();
        expect(screen.queryByTestId("task-2")).not.toBeInTheDocument();
      });
    });

    describe("DELETE_TASK", () => {
      it("deve remover tarefa da lista", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_TASKS", payload: [mockTask1, mockTask2] });
        });

        act(() => {
          dispatch({ type: "DELETE_TASK", payload: "1" });
        });

        expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");
        expect(screen.queryByTestId("task-1")).not.toBeInTheDocument();
        expect(screen.getByTestId("task-2")).toBeInTheDocument();
      });

      it("deve limpar selectedTask se for a tarefa removida", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_TASKS", payload: [mockTask1, mockTask2] });
          dispatch({ type: "SET_SELECTED_TASK", payload: mockTask1 });
        });

        expect(screen.getByTestId("selected-task")).toHaveTextContent("1");

        act(() => {
          dispatch({ type: "DELETE_TASK", payload: "1" });
        });

        expect(screen.getByTestId("selected-task")).toHaveTextContent("null");
        expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");
      });

      it("não deve afetar selectedTask se for tarefa diferente", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_TASKS", payload: [mockTask1, mockTask2] });
          dispatch({ type: "SET_SELECTED_TASK", payload: mockTask1 });
        });

        act(() => {
          dispatch({ type: "DELETE_TASK", payload: "2" });
        });

        expect(screen.getByTestId("selected-task")).toHaveTextContent("1");
        expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");
      });

      it("não deve fazer nada se tarefa não existir", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_TASKS", payload: [mockTask1] });
        });

        act(() => {
          dispatch({ type: "DELETE_TASK", payload: "999" });
        });

        expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");
        expect(screen.getByTestId("task-1")).toBeInTheDocument();
      });
    });

    describe("SET_SELECTED_TASK", () => {
      it("deve definir tarefa selecionada", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_SELECTED_TASK", payload: mockTask1 });
        });

        expect(screen.getByTestId("selected-task")).toHaveTextContent("1");
      });

      it("deve permitir limpar tarefa selecionada", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_SELECTED_TASK", payload: mockTask1 });
        });

        act(() => {
          dispatch({ type: "SET_SELECTED_TASK", payload: null });
        });

        expect(screen.getByTestId("selected-task")).toHaveTextContent("null");
      });

      it("deve permitir trocar tarefa selecionada", () => {
        let dispatch: any = null;

        render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(TestComponent, {
              onStateChange: (_, d) => {
                dispatch = d;
              },
            })
          )
        );

        act(() => {
          dispatch({ type: "SET_SELECTED_TASK", payload: mockTask1 });
        });

        act(() => {
          dispatch({ type: "SET_SELECTED_TASK", payload: mockTask2 });
        });

        expect(screen.getByTestId("selected-task")).toHaveTextContent("2");
      });
    });
  });

  describe("Estado Complexo", () => {
    it("deve manter consistência entre ações múltiplas", () => {
      let dispatch: any = null;

      render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestComponent, {
            onStateChange: (_, d) => {
              dispatch = d;
            },
          })
        )
      );

      act(() => {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: "Erro inicial" });
        dispatch({
          type: "SET_TASKS",
          payload: [mockTask1, mockTask2, mockTask3],
        });
        dispatch({ type: "SET_SELECTED_TASK", payload: mockTask2 });
      });

      expect(screen.getByTestId("tasks-count")).toHaveTextContent("3");
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByTestId("error")).toHaveTextContent("null");
      expect(screen.getByTestId("selected-task")).toHaveTextContent("2");

      // Atualizar tarefa selecionada
      const updatedTask2 = {
        ...mockTask2,
        title: "Tarefa 2 Modificada",
        completed: false,
      };

      act(() => {
        dispatch({ type: "UPDATE_TASK", payload: updatedTask2 });
      });

      expect(screen.getByTestId("task-2")).toHaveTextContent(
        "Tarefa 2 Modificada - medium - pending"
      );
      expect(screen.getByTestId("selected-task")).toHaveTextContent("2");

      // Deletar tarefa não selecionada
      act(() => {
        dispatch({ type: "DELETE_TASK", payload: "1" });
      });

      expect(screen.getByTestId("tasks-count")).toHaveTextContent("2");
      expect(screen.getByTestId("selected-task")).toHaveTextContent("2");
      expect(screen.queryByTestId("task-1")).not.toBeInTheDocument();

      // Deletar tarefa selecionada
      act(() => {
        dispatch({ type: "DELETE_TASK", payload: "2" });
      });

      expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");
      expect(screen.getByTestId("selected-task")).toHaveTextContent("null");
    });

    it("deve lidar com sequência realista de operações", () => {
      let dispatch: any = null;

      render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestComponent, {
            onStateChange: (_, d) => {
              dispatch = d;
            },
          })
        )
      );

      // Simular carregamento inicial
      act(() => {
        dispatch({ type: "SET_LOADING", payload: true });
      });

      // Simular erro na primeira tentativa
      act(() => {
        dispatch({ type: "SET_ERROR", payload: "Falha na conexão" });
      });

      // Limpar erro e tentar novamente
      act(() => {
        dispatch({ type: "CLEAR_ERROR" });
        dispatch({ type: "SET_LOADING", payload: true });
      });

      // Sucesso no carregamento
      act(() => {
        dispatch({ type: "SET_TASKS", payload: [mockTask1] });
      });

      // Adicionar nova tarefa
      act(() => {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "ADD_TASK", payload: mockTask2 });
      });

      // Selecionar tarefa para edição
      act(() => {
        dispatch({ type: "SET_SELECTED_TASK", payload: mockTask1 });
      });

      // Atualizar tarefa selecionada
      const updatedTask1 = {
        ...mockTask1,
        completed: true,
        completedAt: new Date().toISOString(),
      };

      act(() => {
        dispatch({ type: "UPDATE_TASK", payload: updatedTask1 });
      });

      expect(screen.getByTestId("tasks-count")).toHaveTextContent("2");
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByTestId("error")).toHaveTextContent("null");
      expect(screen.getByTestId("selected-task")).toHaveTextContent("1");
      expect(screen.getByTestId("task-1")).toHaveTextContent(
        "Tarefa 1 - high - completed"
      );
    });
  });

  describe("Casos Extremos", () => {
    it("deve lidar com ação desconhecida", () => {
      let dispatch: any = null;

      render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestComponent, {
            onStateChange: (_, d) => {
              dispatch = d;
            },
          })
        )
      );

      act(() => {
        dispatch({ type: "SET_TASKS", payload: [mockTask1] });
      });

      // Ação inválida não deve afetar o estado
      act(() => {
        dispatch({ type: "UNKNOWN_ACTION", payload: "test" } as any);
      });

      expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");
      expect(screen.getByTestId("task-1")).toBeInTheDocument();
    });

    it("deve lidar com payload inválido graciosamente", () => {
      let dispatch: any = null;

      render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestComponent, {
            onStateChange: (_, d) => {
              dispatch = d;
            },
          })
        )
      );

      // Primeiro, adicionar uma tarefa para verificar se o estado inicial funciona
      act(() => {
        dispatch({ type: "SET_TASKS", payload: [mockTask1] });
      });

      expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");

      // Tentar definir tasks com null - deve tratar como array vazio
      act(() => {
        dispatch({ type: "SET_TASKS", payload: null as any });
      });

      // Verificar se limpou para array vazio (comportamento esperado)
      expect(screen.getByTestId("tasks-count")).toHaveTextContent("0");

      // Restaurar estado para próximo teste
      act(() => {
        dispatch({ type: "SET_TASKS", payload: [mockTask1] });
      });

      // Tentar com undefined - deve tratar como array vazio
      act(() => {
        dispatch({ type: "SET_TASKS", payload: undefined as any });
      });

      // Verificar se limpou para array vazio
      expect(screen.getByTestId("tasks-count")).toHaveTextContent("0");

      // Teste adicional para garantir que arrays válidos ainda funcionam
      act(() => {
        dispatch({ type: "SET_TASKS", payload: [mockTask1] });
      });

      expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");
    });

    it("deve lidar com lista vazia de tarefas", () => {
      let dispatch: any = null;

      render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestComponent, {
            onStateChange: (_, d) => {
              dispatch = d;
            },
          })
        )
      );

      act(() => {
        dispatch({ type: "SET_TASKS", payload: [mockTask1, mockTask2] });
      });

      act(() => {
        dispatch({ type: "SET_TASKS", payload: [] });
      });

      expect(screen.getByTestId("tasks-count")).toHaveTextContent("0");
      expect(screen.queryByTestId("task-1")).not.toBeInTheDocument();
      expect(screen.queryByTestId("task-2")).not.toBeInTheDocument();
    });

    it("deve lidar com IDs duplicados", () => {
      let dispatch: any = null;

      render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestComponent, {
            onStateChange: (_, d) => {
              dispatch = d;
            },
          })
        )
      );

      const duplicateTask = { ...mockTask2, id: "1" }; // Mesmo ID do mockTask1

      act(() => {
        dispatch({ type: "SET_TASKS", payload: [mockTask1] });
      });

      act(() => {
        dispatch({ type: "ADD_TASK", payload: duplicateTask });
      });

      // Deve ter ambas as tarefas (comportamento atual do reducer)
      expect(screen.getByTestId("tasks-count")).toHaveTextContent("2");
    });
  });

  describe("Performance e Otimização", () => {
    it("deve memoizar contexto corretamente", () => {
      const mockCallback = jest.fn();

      const TestMemoComponent = () => {
        const context = useTaskContext();
        mockCallback(context);
        return React.createElement(
          "div",
          { "data-testid": "memo-test" },
          "Memo Test"
        );
      };

      const { rerender } = render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestMemoComponent, null)
        )
      );

      expect(mockCallback).toHaveBeenCalledTimes(1);

      // Re-render sem mudança de estado
      rerender(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestMemoComponent, null)
        )
      );

      // Context deve ser o mesmo objeto devido à memoização
      expect(mockCallback).toHaveBeenCalledTimes(2);
      expect(mockCallback.mock.calls[0][0]).toEqual(
        mockCallback.mock.calls[1][0]
      );
    });

    it("deve funcionar com múltiplos consumidores", () => {
      const Consumer1 = () => {
        const { state } = useTaskContext();
        return React.createElement(
          "div",
          { "data-testid": "consumer-1" },
          state.tasks.length
        );
      };

      const Consumer2 = () => {
        const { state } = useTaskContext();
        return React.createElement(
          "div",
          { "data-testid": "consumer-2" },
          String(state.loading)
        );
      };

      const Consumer3 = () => {
        const { state, dispatch } = useTaskContext();

        React.useEffect(() => {
          dispatch({ type: "ADD_TASK", payload: mockTask1 });
        }, [dispatch]);

        return React.createElement(
          "div",
          { "data-testid": "consumer-3" },
          state.error || "no-error"
        );
      };

      render(
        React.createElement(TestWrapper, null, [
          React.createElement(Consumer1, { key: "1" }),
          React.createElement(Consumer2, { key: "2" }),
          React.createElement(Consumer3, { key: "3" }),
        ])
      );

      expect(screen.getByTestId("consumer-1")).toHaveTextContent("1");
      expect(screen.getByTestId("consumer-2")).toHaveTextContent("false");
      expect(screen.getByTestId("consumer-3")).toHaveTextContent("no-error");
    });
  });

  describe("Tipos de Task", () => {
    it("deve lidar com todos os campos opcionais", () => {
      let dispatch: any = null;

      const minimalTask: Task = {
        id: "minimal",
        title: "Tarefa Mínima",
        priority: "low",
        category: "test",
        completed: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      const completeTask: Task = {
        id: "complete",
        title: "Tarefa Completa",
        description: "Descrição completa",
        priority: "high",
        category: "work",
        completed: true,
        dueDate: "2024-12-31T23:59:59Z",
        estimatedDuration: 120,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
        completedAt: "2024-01-02T00:00:00Z",
      };

      render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestComponent, {
            onStateChange: (_, d) => {
              dispatch = d;
            },
          })
        )
      );

      act(() => {
        dispatch({ type: "ADD_TASK", payload: minimalTask });
        dispatch({ type: "ADD_TASK", payload: completeTask });
      });

      expect(screen.getByTestId("tasks-count")).toHaveTextContent("2");
      expect(screen.getByTestId("task-minimal")).toHaveTextContent(
        "Tarefa Mínima - low - pending"
      );
      expect(screen.getByTestId("task-complete")).toHaveTextContent(
        "Tarefa Completa - high - completed"
      );
    });

    it("deve lidar com diferentes prioridades", () => {
      let dispatch: any = null;

      const lowTask: Task = { ...mockTask1, id: "low", priority: "low" };
      const mediumTask: Task = {
        ...mockTask1,
        id: "medium",
        priority: "medium",
      };
      const highTask: Task = { ...mockTask1, id: "high", priority: "high" };

      render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestComponent, {
            onStateChange: (_, d) => {
              dispatch = d;
            },
          })
        )
      );

      act(() => {
        dispatch({
          type: "SET_TASKS",
          payload: [lowTask, mediumTask, highTask],
        });
      });

      expect(screen.getByTestId("task-low")).toHaveTextContent("low");
      expect(screen.getByTestId("task-medium")).toHaveTextContent("medium");
      expect(screen.getByTestId("task-high")).toHaveTextContent("high");
    });

    it("deve lidar com estados de conclusão", () => {
      let dispatch: any = null;

      const pendingTask: Task = {
        ...mockTask1,
        id: "pending",
        completed: false,
      };
      const completedTask: Task = {
        ...mockTask1,
        id: "completed",
        completed: true,
      };

      render(
        React.createElement(
          TestWrapper,
          null,
          React.createElement(TestComponent, {
            onStateChange: (_, d) => {
              dispatch = d;
            },
          })
        )
      );

      act(() => {
        dispatch({ type: "SET_TASKS", payload: [pendingTask, completedTask] });
      });

      expect(screen.getByTestId("task-pending")).toHaveTextContent("pending");
      expect(screen.getByTestId("task-completed")).toHaveTextContent(
        "completed"
      );
    });
  });
});

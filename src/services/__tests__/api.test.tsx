/**
 * @jest-environment jsdom
 */

import axios from "axios";
import type { Task } from "../../contexts/TaskContext";

const mockAxiosInstance = {
  request: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => mockAxiosInstance),
    isAxiosError: jest.fn(),
  },
  isAxiosError: jest.fn(),
}));

jest.mock("../cache", () => ({
  cacheManager: {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
  },
}));

import { taskApi, suggestTime } from "../api";
import { cacheManager } from "../cache";

const mockJsonServerTask = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  priority: "medium" as const,
  category: "work",
  estimated_duration: 60,
  deadline: "2024-12-25T10:00:00.000Z",
  status: "pending" as const,
  completed_at: null,
};

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  priority: "medium",
  category: "work",
  completed: false,
  dueDate: "2024-12-25T10:00:00.000Z",
  estimatedDuration: 60,
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  completedAt: null,
};

const mockedAxios = axios as jest.Mocked<typeof axios>;

const consoleSpy = {
  log: jest.spyOn(console, "log").mockImplementation(() => {}),
  error: jest.spyOn(console, "error").mockImplementation(() => {}),
  warn: jest.spyOn(console, "warn").mockImplementation(() => {}),
};

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (
      mockedAxios.isAxiosError as jest.MockedFunction<typeof axios.isAxiosError>
    ).mockReturnValue(false);

    jest
      .spyOn(Date.prototype, "toISOString")
      .mockReturnValue("2024-01-01T12:00:00.000Z");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("taskApi.getTasks", () => {
    it("deve buscar tasks da API quando cache não existe", async () => {
      mockAxiosInstance.request.mockResolvedValue({
        data: [mockJsonServerTask],
      });

      const result = await taskApi.getTasks();

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: "/tasks",
        method: "GET",
        data: undefined,
      });

      // API atual armazena cache stale
      expect(cacheManager.set).toHaveBeenCalledWith(
        "tasks-list-stale",
        expect.any(Array),
        24 * 60 * 60 * 1000 // 24h para stale cache
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "1",
        title: "Test Task",
        description: "Test Description",
        priority: "medium",
        category: "work",
        completed: false,
      });
    });

    it("deve converter tasks do JSON Server corretamente", async () => {
      const jsonTasks = [
        {
          ...mockJsonServerTask,
          status: "completed" as const,
          completed_at: "2024-01-01T12:00:00.000Z",
        },
        {
          ...mockJsonServerTask,
          id: "2",
          title: "Second Task",
          status: "pending" as const,
        },
      ];

      mockAxiosInstance.request.mockResolvedValue({ data: jsonTasks });

      const result = await taskApi.getTasks();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: "1",
        completed: true,
        completedAt: "2024-01-01T12:00:00.000Z",
      });
      expect(result[1]).toMatchObject({
        id: "2",
        title: "Second Task",
        completed: false,
      });
    });

    it("deve lidar com tasks com dados faltantes", async () => {
      const incompleteTask = {
        id: "1",
        description: "Test",
        status: "pending" as const,
      };

      mockAxiosInstance.request.mockResolvedValue({ data: [incompleteTask] });

      const result = await taskApi.getTasks();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "1",
        title: "Tarefa sem título",
        priority: "medium",
        category: "geral",
        estimatedDuration: 60,
      });
    });

    it("deve lançar erro quando requisição falha", async () => {
      mockAxiosInstance.request.mockRejectedValue(new Error("Network error"));

      await expect(taskApi.getTasks()).rejects.toThrow("Network error");
    });
  });

  describe("taskApi.getTask", () => {
    it("deve buscar task da API", async () => {
      mockAxiosInstance.request.mockResolvedValue({ data: mockJsonServerTask });

      const result = await taskApi.getTask("1");

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: "/tasks/1",
        method: "GET",
        data: undefined,
      });

      // API atual armazena cache stale
      expect(cacheManager.set).toHaveBeenCalledWith(
        "task-1-stale",
        expect.any(Object),
        24 * 60 * 60 * 1000 // 24h para stale cache
      );

      expect(result).toMatchObject({
        id: "1",
        title: "Test Task",
        description: "Test Description",
        priority: "medium",
        category: "work",
        completed: false,
      });
    });

    it("deve tratar erro na busca de task", async () => {
      const error = new Error("Task not found");
      mockAxiosInstance.request.mockRejectedValue(error);

      await expect(taskApi.getTask("999")).rejects.toThrow("Task not found");
    });
  });

  describe("taskApi.createTask", () => {
    const newTaskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      title: "New Task",
      description: "New Description",
      priority: "high",
      category: "personal",
      completed: false,
      dueDate: "2025-12-31T10:00:00.000Z",
      estimatedDuration: 90,
    };

    beforeEach(() => {
      mockAxiosInstance.request
        .mockResolvedValueOnce({ data: [{ id: "1" }, { id: "2" }] })
        .mockResolvedValueOnce({
          data: {
            ...mockJsonServerTask,
            id: "3",
            title: newTaskData.title,
            description: newTaskData.description,
            priority: newTaskData.priority,
            category: newTaskData.category,
          },
        });
    });

    it("deve criar nova task com sucesso", async () => {
      const result = await taskApi.createTask(newTaskData);

      expect(mockAxiosInstance.request).toHaveBeenCalledTimes(2);

      expect(mockAxiosInstance.request).toHaveBeenNthCalledWith(1, {
        url: "/tasks",
        method: "GET",
        data: undefined,
      });

      expect(mockAxiosInstance.request).toHaveBeenNthCalledWith(2, {
        url: "/tasks",
        method: "POST",
        data: expect.objectContaining({
          id: "3",
          title: newTaskData.title,
          description: newTaskData.description,
          priority: newTaskData.priority,
          category: newTaskData.category,
          estimated_duration: newTaskData.estimatedDuration,
          deadline: newTaskData.dueDate,
          status: "pending",
        }),
      });

      expect(result).toMatchObject({
        id: "3",
        title: newTaskData.title,
        description: newTaskData.description,
        priority: newTaskData.priority,
        category: newTaskData.category,
      });
    });

    it("deve validar campos obrigatórios", async () => {
      await expect(
        taskApi.createTask({
          ...newTaskData,
          title: "",
        })
      ).rejects.toThrow("Título é obrigatório");

      await expect(
        taskApi.createTask({
          ...newTaskData,
          category: "",
        })
      ).rejects.toThrow("Categoria é obrigatória");

      await expect(
        taskApi.createTask({
          ...newTaskData,
          dueDate: undefined,
        })
      ).rejects.toThrow("Prazo é obrigatório para novas tarefas");
    });

    it("deve validar que prazo não seja no passado", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      await expect(
        taskApi.createTask({
          ...newTaskData,
          dueDate: pastDate.toISOString(),
        })
      ).rejects.toThrow("O prazo não pode ser no passado");
    });

    it("deve calcular próximo ID corretamente", async () => {
      jest.clearAllMocks();

      mockAxiosInstance.request
        .mockResolvedValueOnce({
          data: [{ id: "1" }, { id: "5" }, { id: "3" }],
        })
        .mockResolvedValueOnce({ data: { ...mockJsonServerTask, id: "6" } });

      await taskApi.createTask(newTaskData);

      expect(mockAxiosInstance.request).toHaveBeenNthCalledWith(2, {
        url: "/tasks",
        method: "POST",
        data: expect.objectContaining({
          id: expect.any(String),
          title: newTaskData.title,
          description: newTaskData.description,
          priority: newTaskData.priority,
          category: newTaskData.category,
        }),
      });
    });

    it("deve tratar erro na criação", async () => {
      jest.clearAllMocks();

      mockAxiosInstance.request.mockReset();

      mockAxiosInstance.request
        .mockResolvedValueOnce({ data: [{ id: "1" }, { id: "2" }] })
        .mockRejectedValueOnce(new Error("Create failed"));

      await expect(taskApi.createTask(newTaskData)).rejects.toThrow(
        "Create failed"
      );
    });
  });

  describe("taskApi.updateTask", () => {
    beforeEach(() => {
      mockAxiosInstance.request
        .mockResolvedValueOnce({ data: mockJsonServerTask })
        .mockResolvedValueOnce({
          data: {
            ...mockJsonServerTask,
            title: "Updated Task",
          },
        });
    });

    it("deve atualizar task com sucesso", async () => {
      const updateData = { title: "Updated Task" };

      const result = await taskApi.updateTask("1", updateData);

      expect(mockAxiosInstance.request).toHaveBeenCalledTimes(2);

      expect(mockAxiosInstance.request).toHaveBeenNthCalledWith(1, {
        url: "/tasks/1",
        method: "GET",
        data: undefined,
      });

      expect(mockAxiosInstance.request).toHaveBeenNthCalledWith(2, {
        url: "/tasks/1",
        method: "PUT",
        data: expect.objectContaining({
          ...mockJsonServerTask,
          title: "Updated Task",
        }),
      });

      expect(result.title).toBe("Updated Task");
    });

    it("deve definir completedAt quando task é marcada como completa", async () => {
      await taskApi.updateTask("1", { completed: true });

      expect(mockAxiosInstance.request).toHaveBeenNthCalledWith(2, {
        url: "/tasks/1",
        method: "PUT",
        data: expect.objectContaining({
          status: "completed",
          completed_at: "2024-01-01T12:00:00.000Z",
        }),
      });
    });

    it("deve impedir reabertura de task completa", async () => {
      const completedTask = {
        ...mockJsonServerTask,
        status: "completed" as const,
        completed_at: "2024-01-01T10:00:00.000Z",
      };

      mockAxiosInstance.request.mockReset();
      mockAxiosInstance.request.mockResolvedValueOnce({ data: completedTask });

      await expect(
        taskApi.updateTask("1", { completed: false })
      ).rejects.toThrow("Tarefas concluídas não podem ser reabertas");
    });

    it("deve preservar completedAt existente", async () => {
      const completedTask = {
        ...mockJsonServerTask,
        status: "completed" as const,
        completed_at: "2024-01-01T10:00:00.000Z",
      };

      mockAxiosInstance.request.mockReset();
      mockAxiosInstance.request
        .mockResolvedValueOnce({ data: completedTask })
        .mockResolvedValueOnce({
          data: { ...completedTask, title: "Updated" },
        });

      await taskApi.updateTask("1", { title: "Updated" });

      expect(mockAxiosInstance.request).toHaveBeenNthCalledWith(2, {
        url: "/tasks/1",
        method: "PUT",
        data: expect.objectContaining({
          completed_at: "2024-01-01T10:00:00.000Z",
        }),
      });
    });
  });

  describe("taskApi.deleteTask", () => {
    it("deve deletar task com sucesso", async () => {
      mockAxiosInstance.request.mockResolvedValue({ data: undefined });

      await taskApi.deleteTask("1");

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: "/tasks/1",
        method: "DELETE",
        data: undefined,
      });
    });

    it("deve tratar erro na deleção", async () => {
      const error = new Error("Delete failed");
      mockAxiosInstance.request.mockReset();
      mockAxiosInstance.request.mockRejectedValue(error);

      await expect(taskApi.deleteTask("1")).rejects.toThrow("Delete failed");
    });
  });

  describe("suggestTime", () => {
    const mockTaskData = {
      title: "Test Task",
      category: "work",
      priority: "high" as const,
      estimated_duration: 60,
    };

    const mockSuggestions = [
      {
        category: "work",
        suggested_times: [
          {
            start: "2024-01-02T09:00:00.000Z",
            end: "2024-01-02T10:00:00.000Z",
            score: 0.9,
            reason: "Manhã produtiva",
          },
        ],
      },
    ];

    it("deve buscar sugestões da API", async () => {
      (cacheManager.get as jest.Mock).mockReturnValue(null);
      mockAxiosInstance.get.mockResolvedValue({ data: mockSuggestions });

      const result = await suggestTime(mockTaskData);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/suggestions");
      expect(cacheManager.set).toHaveBeenCalledWith(
        "suggestions-work-high-60", // API usa categoria-prioridade-duração
        expect.any(Array),
        10 * 60 * 1000
      );
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0]).toMatchObject({
        start: "2024-01-02T09:00:00.000Z",
        end: "2024-01-02T10:00:00.000Z",
        score: 0.9,
        reason: "Manhã produtiva",
      });
    });

    it("deve gerar sugestões dinâmicas quando API falha", async () => {
      (cacheManager.get as jest.Mock).mockReturnValue(null);
      mockAxiosInstance.get.mockRejectedValue(new Error("API Error"));

      const result = await suggestTime(mockTaskData);

      expect(result).toHaveLength(6);
      expect(result[0]).toHaveProperty("start");
      expect(result[0]).toHaveProperty("end");
      expect(result[0]).toHaveProperty("score");
      expect(result[0]).toHaveProperty("reason");
    });

    it("deve combinar sugestões de categoria e prioridade", async () => {
      const combinedSuggestions = [
        {
          category: "work",
          suggested_times: [
            {
              start: "2024-01-02T09:00:00.000Z",
              end: "2024-01-02T10:00:00.000Z",
              score: 0.9,
              reason: "Category suggestion",
            },
          ],
        },
        {
          priority: "high",
          suggested_times: [
            {
              start: "2024-01-02T14:00:00.000Z",
              end: "2024-01-02T15:00:00.000Z",
              score: 0.8,
              reason: "Priority suggestion",
            },
          ],
        },
      ];

      (cacheManager.get as jest.Mock).mockReturnValue(null);
      mockAxiosInstance.get.mockResolvedValue({ data: combinedSuggestions });

      const result = await suggestTime(mockTaskData);

      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            reason: "Category suggestion",
            score: 0.9,
          }),
          expect.objectContaining({
            reason: "Priority suggestion",
            score: 0.8,
          }),
        ])
      );
    });

    it("deve limitar sugestões a 6 máximo", async () => {
      const manySuggestions = Array.from({ length: 10 }, (_, i) => ({
        category: "work",
        suggested_times: [
          {
            start: `2024-01-0${(i % 9) + 1}T09:00:00.000Z`,
            end: `2024-01-0${(i % 9) + 1}T10:00:00.000Z`,
            score: 0.9 - i * 0.01,
            reason: `Suggestion ${i + 1}`,
          },
        ],
      }));

      (cacheManager.get as jest.Mock).mockReturnValue(null);
      mockAxiosInstance.get.mockResolvedValue({ data: manySuggestions });

      const result = await suggestTime(mockTaskData);

      expect(result.length).toBeLessThanOrEqual(6);
    });
  });

  describe("Error Handling", () => {
    it("deve criar ApiError para erros do axios", async () => {
      const axiosError = {
        response: {
          status: 404,
          data: { message: "Not found" },
        },
        message: "Request failed",
        isAxiosError: true,
      };

      (
        mockedAxios.isAxiosError as jest.MockedFunction<
          typeof axios.isAxiosError
        >
      ).mockReturnValue(true);
      mockAxiosInstance.request.mockRejectedValue(axiosError);

      try {
        await taskApi.getTask("999");
      } catch (error: any) {
        expect(error.name).toBe("ApiError");
        expect(error.status).toBe(404);
        expect(error.message).toBe("Not found");
      }
    });

    it("deve re-lançar erros não-axios", async () => {
      const customError = new Error("Custom error");
      mockAxiosInstance.request.mockRejectedValue(customError);

      await expect(taskApi.getTask("1")).rejects.toThrow("Custom error");
    });

    it("deve usar status 500 para erros sem response", async () => {
      const axiosError = {
        message: "Network error",
        isAxiosError: true,
      };

      (
        mockedAxios.isAxiosError as jest.MockedFunction<
          typeof axios.isAxiosError
        >
      ).mockReturnValue(true);
      mockAxiosInstance.request.mockRejectedValue(axiosError);

      try {
        await taskApi.getTask("1");
      } catch (error: any) {
        expect(error.status).toBe(500);
        expect(error.message).toBe("Network error");
      }
    });
  });

  describe("Data Conversion", () => {
    it("deve converter Task para formato JSON Server", async () => {
      const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
        title: "Test Task",
        description: "Test Description",
        priority: "high",
        category: "work",
        completed: true,
        dueDate: "2025-12-25T10:00:00.000Z",
        estimatedDuration: 90,
        completedAt: "2024-01-01T12:00:00.000Z",
      };

      mockAxiosInstance.request
        .mockResolvedValueOnce({ data: [] })
        .mockResolvedValueOnce({ data: { id: "1", ...taskData } });

      await expect(taskApi.createTask(taskData)).resolves.not.toThrow();
    });

    it("deve converter JSON Server Task para formato interno", async () => {
      const jsonTask = {
        id: "1",
        title: "JSON Task",
        description: "JSON Description",
        priority: "low" as const,
        category: "personal",
        estimated_duration: 120,
        deadline: "2024-12-25T10:00:00.000Z",
        status: "completed" as const,
        completed_at: "2024-01-01T12:00:00.000Z",
      };

      mockAxiosInstance.request.mockResolvedValue({ data: jsonTask });

      const result = await taskApi.getTask("1");

      expect(result).toMatchObject({
        id: "1",
        title: "JSON Task",
        description: "JSON Description",
        priority: "low",
        category: "personal",
        completed: true,
        dueDate: "2024-12-25T10:00:00.000Z",
        estimatedDuration: 120,
        completedAt: "2024-01-01T12:00:00.000Z",
      });
    });
  });
});

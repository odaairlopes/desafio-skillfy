import { type Task } from "../contexts/TaskContext";
import axios, { type AxiosResponse, AxiosRequestConfig } from "axios";
import { cacheManager } from "./cache";
import {
  JsonServerTask,
  SuggestedTime,
  TaskData,
  TimeSuggestion,
} from "../types/index";

const API_BASE_URL = "http://localhost:3001";

const CACHE_CONFIG = {
  tasks: { ttl: 2 * 60 * 1000, key: "tasks-list" },
  task: { ttl: 5 * 60 * 1000, keyPrefix: "task-" },
  suggestions: { ttl: 10 * 60 * 1000, keyPrefix: "suggestions-" },
  timeSuggestions: { ttl: 15 * 60 * 1000, key: "time-suggestions" },
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const cacheKey = generateCacheKey(config);
    const cached = cacheManager.get(cacheKey);

    if (cached && config.method?.toLowerCase() === "get") {
      console.log(
        `Cache hit for: ${config.method?.toUpperCase()} ${config.url}`
      );
      return Promise.resolve({
        ...config,
        adapter: () =>
          Promise.resolve({
            data: cached,
            status: 200,
            statusText: "OK (from cache)",
            headers: {},
            config,
          }),
      });
    }

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    const cacheKey = generateCacheKey(response.config);
    const method = response.config.method?.toLowerCase();

    if (method === "get" && response.status === 200) {
      const ttl = getCacheTTL(response.config);
      if (ttl > 0) {
        cacheManager.set(cacheKey, response.data, ttl);
        console.log(
          `Cached response for: ${response.config.url} (TTL: ${ttl}ms)`
        );
      }
    }

    if (["post", "put", "delete"].includes(method || "")) {
      invalidateRelatedCache(response.config);
    }

    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Response Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    if (error.config?.method?.toLowerCase() === "get") {
      const staleCacheKey = `${generateCacheKey(error.config)}-stale`;
      const staleData = cacheManager.get(staleCacheKey);

      if (staleData) {
        console.log(`Returning stale cache for: ${error.config.url}`);
        return Promise.resolve({
          data: staleData,
          status: 200,
          statusText: "OK (from stale cache)",
          headers: {},
          config: error.config,
        });
      }
    }

    return Promise.reject(error);
  }
);

function generateCacheKey(config: AxiosRequestConfig): string {
  const url = config.url || "";
  const params = config.params ? JSON.stringify(config.params) : "";
  const data = config.data ? JSON.stringify(config.data) : "";
  return `api-${url}-${params}-${data}`.replace(/[^a-zA-Z0-9-_]/g, "-");
}

function getCacheTTL(config: AxiosRequestConfig): number {
  const url = config.url || "";

  if (url.includes("/tasks/") && url.match(/\/tasks\/\d+$/)) {
    return CACHE_CONFIG.task.ttl;
  }
  if (url.includes("/tasks")) {
    return CACHE_CONFIG.tasks.ttl;
  }
  if (url.includes("/suggestions")) {
    return CACHE_CONFIG.suggestions.ttl;
  }

  return 5 * 60 * 1000;
}

function invalidateRelatedCache(config: AxiosRequestConfig): void {
  const url = config.url || "";

  if (url.includes("/tasks")) {
    cacheManager.delete(CACHE_CONFIG.tasks.key);

    const taskIdMatch = url.match(/\/tasks\/(\d+)/);
    if (taskIdMatch) {
      const taskId = taskIdMatch[1];
      cacheManager.delete(`${CACHE_CONFIG.task.keyPrefix}${taskId}`);
    }
  }
}

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

const apiRequest = async <T, D = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: D
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.request({
      url: endpoint,
      method,
      data,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.message || error.message
      );
    }
    throw error;
  }
};

const convertToTask = (jsonTask: JsonServerTask): Task => {
  // Validate required fields with better defaults
  if (!jsonTask.title) {
    console.warn("Task missing title:", jsonTask);
  }
  if (!jsonTask.priority) {
    console.warn("Task missing priority, defaulting to medium:", jsonTask);
  }
  if (!jsonTask.category) {
    console.warn('Task missing category, defaulting to "geral":', jsonTask);
  }

  return {
    id: jsonTask.id.toString(),
    title: jsonTask.title || "Tarefa sem título",
    description: jsonTask.description,
    priority: jsonTask.priority || "medium",
    category: jsonTask.category || "geral",
    completed: jsonTask.status === "completed",
    dueDate: jsonTask.deadline,
    estimatedDuration: jsonTask.estimated_duration || 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: jsonTask.completed_at,
  };
};

const convertFromTask = (
  task: Omit<Task, "id" | "createdAt" | "updatedAt">
): Omit<JsonServerTask, "id"> => ({
  title: task.title,
  description: task.description,
  priority: task.priority,
  category: task.category,
  estimated_duration: task.estimatedDuration || 60,
  deadline: task.dueDate,
  status: task.completed ? "completed" : "pending",
  completed_at: task.completedAt,
});

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const jsonTasks = await apiRequest<JsonServerTask[]>("/tasks");
      const tasks = jsonTasks.map(convertToTask);

      cacheManager.set(
        `${CACHE_CONFIG.tasks.key}-stale`,
        tasks,
        24 * 60 * 60 * 1000
      );

      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  getTask: async (id: string): Promise<Task> => {
    try {
      console.log(`Fetching task with ID: ${id}`);
      const jsonTask = await apiRequest<JsonServerTask>(`/tasks/${id}`);
      const task = convertToTask(jsonTask);

      cacheManager.set(`task-${id}-stale`, task, 24 * 60 * 60 * 1000); // 24h

      return task;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },

  createTask: async (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> => {
    try {
      if (!task.title?.trim()) {
        throw new Error("Título é obrigatório");
      }

      if (!task.category?.trim()) {
        throw new Error("Categoria é obrigatória");
      }

      if (!task.dueDate) {
        throw new Error("Prazo é obrigatório para novas tarefas");
      }

      const dueDate = new Date(task.dueDate);
      const now = new Date();
      if (dueDate < now) {
        throw new Error("O prazo não pode ser no passado");
      }

      const existingTasks = await apiRequest<JsonServerTask[]>("/tasks");
      const maxId = existingTasks.reduce((max, task) => {
        const numericId = parseInt(task.id.toString(), 10);
        return !isNaN(numericId) && numericId > max ? numericId : max;
      }, 0);

      const nextId = maxId + 1;

      const jsonTaskData = {
        ...convertFromTask(task),
        id: nextId.toString(),
      };

      const jsonTask = await apiRequest<JsonServerTask>(
        "/tasks",
        "POST",
        jsonTaskData
      );

      const newTask = convertToTask(jsonTask);
      console.log("Task created successfully:", newTask.id);

      return newTask;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  updateTask: async (id: string, task: Partial<Task>): Promise<Task> => {
    try {
      const currentTask = await apiRequest<JsonServerTask>(`/tasks/${id}`);

      if (currentTask.status === "completed" && task.completed === false) {
        throw new Error("Tarefas concluídas não podem ser reabertas");
      }

      let completedAt = currentTask.completed_at;
      if (task.completed !== undefined) {
        if (task.completed && !currentTask.completed_at) {
          completedAt = new Date().toISOString();
        }
      }

      const updateData = {
        ...currentTask,
        ...task,
        status:
          task.completed !== undefined
            ? task.completed
              ? "completed"
              : currentTask.status
            : currentTask.status,
        completed_at: completedAt,
        title: task.title || currentTask.title,
        description:
          task.description !== undefined
            ? task.description
            : currentTask.description,
        priority: task.priority || currentTask.priority,
        category: task.category || currentTask.category,
        estimated_duration:
          task.estimatedDuration !== undefined
            ? task.estimatedDuration
            : currentTask.estimated_duration,
        deadline:
          task.dueDate !== undefined ? task.dueDate : currentTask.deadline,
      };

      const jsonTask = await apiRequest<JsonServerTask>(
        `/tasks/${id}`,
        "PUT",
        updateData
      );

      const updatedTask = convertToTask(jsonTask);
      console.log("Task updated successfully:", updatedTask.id);

      return updatedTask;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      await apiRequest<void>(`/tasks/${id}`, "DELETE");
      console.log("Task deleted successfully:", id);
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },
};

export const suggestTime = async (
  taskData: TaskData
): Promise<SuggestedTime[]> => {
  const cacheKey = `suggestions-${taskData.category}-${taskData.priority}-${taskData.estimated_duration}`;

  try {
    // Check cache first
    const cached = cacheManager.get<SuggestedTime[]>(cacheKey);
    if (cached) {
      console.log("Returning cached time suggestions");
      return cached;
    }

    const response = await apiClient.get("/suggestions");
    const allSuggestions: TimeSuggestion[] = response.data;

    const categorySuggestions = allSuggestions.find(
      (s) => s.category === taskData.category
    );

    const prioritySuggestions = allSuggestions.find(
      (s) => s.priority === taskData.priority
    );

    const suggestions: SuggestedTime[] = [];

    if (categorySuggestions) {
      suggestions.push(...categorySuggestions.suggested_times);
    }

    if (prioritySuggestions && suggestions.length < 4) {
      const priorityTimes = prioritySuggestions.suggested_times.filter(
        (pTime) =>
          !suggestions.some(
            (sTime) => sTime.start === pTime.start && sTime.end === pTime.end
          )
      );
      suggestions.push(...priorityTimes);
    }

    if (suggestions.length < 4) {
      const dynamicSuggestions = generateDynamicSuggestions(taskData);
      suggestions.push(...dynamicSuggestions);
    }

    suggestions.sort((a, b) => b.score - a.score);
    const topSuggestions = suggestions.slice(0, 6);

    cacheManager.set(cacheKey, topSuggestions, CACHE_CONFIG.suggestions.ttl);

    console.log(`Generated ${topSuggestions.length} time suggestions`);
    return topSuggestions;
  } catch (error) {
    console.error("Error fetching time suggestions:", error);

    const fallbackSuggestions = generateDynamicSuggestions(taskData);
    console.log("Using fallback dynamic suggestions");

    return fallbackSuggestions;
  }
};

const generateDynamicSuggestions = (taskData: TaskData): SuggestedTime[] => {
  const now = new Date();
  const suggestions: SuggestedTime[] = [];
  const duration = taskData.estimated_duration || 60;

  const timeSlots = {
    high: [9, 14, 10],
    medium: [14, 16, 19],
    low: [19, 21, 16],
  };

  const slots =
    timeSlots[taskData.priority as keyof typeof timeSlots] || timeSlots.medium;

  for (
    let dayOffset = 1;
    dayOffset <= 21 && suggestions.length < 6;
    dayOffset += 3
  ) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + dayOffset);

    if (targetDate.getMonth() === 5 && targetDate.getDate() <= 30) {
      slots.forEach((hour, index) => {
        if (suggestions.length >= 6) return;

        const slotTime = new Date(targetDate);
        slotTime.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotTime);
        slotEnd.setMinutes(slotEnd.getMinutes() + duration);

        const timeOfDay = hour < 12 ? "Manhã" : hour < 18 ? "Tarde" : "Noite";
        const score = 0.9 - dayOffset * 0.005 - index * 0.1;

        suggestions.push({
          start: slotTime.toISOString(),
          end: slotEnd.toISOString(),
          score: Math.max(score, 0.1),
          reason: `${timeOfDay} ${getProductivityReason(
            taskData.priority,
            hour
          )} - ${slotTime.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
          })}`,
        });
      });
    }
  }

  return suggestions.slice(0, 6);
};

function getProductivityReason(priority: string, hour: number): string {
  const reasons = {
    high: {
      morning: "produtiva (foco máximo)",
      afternoon: "concentrada (energia alta)",
      evening: "dedicada (sem interrupções)",
    },
    medium: {
      morning: "eficiente",
      afternoon: "equilibrada",
      evening: "tranquila",
    },
    low: {
      morning: "leve",
      afternoon: "descontraída",
      evening: "relaxada",
    },
  };

  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const priorityReasons =
    reasons[priority as keyof typeof reasons] || reasons.medium;

  return priorityReasons[timeOfDay as keyof typeof priorityReasons];
}

export { cacheManager, ApiError };
export type { SuggestedTime, TaskData, TimeSuggestion };

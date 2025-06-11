import { useCallback } from "react";
import { taskApi } from "../services/api";
import { useTaskContext, type Task } from "../contexts/TaskContext";

export const useTasks = () => {
  const { state, dispatch } = useTaskContext();
  const { tasks, loading, error, selectedTask } = state;

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, [dispatch]);

  const setSelectedTask = useCallback(
    (task: Task | null) => {
      dispatch({ type: "SET_SELECTED_TASK", payload: task });
    },
    [dispatch]
  );

  const fetchTasks = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });
      const tasksData = await taskApi.getTasks();
      dispatch({ type: "SET_TASKS", payload: tasksData });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch tasks";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  }, [dispatch]);

  const fetchTask = useCallback(
    async (id: string) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "CLEAR_ERROR" });
        const task = await taskApi.getTask(id);
        dispatch({ type: "SET_SELECTED_TASK", payload: task });
        return task;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch task";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [dispatch]
  );

  const createTask = useCallback(
    async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "CLEAR_ERROR" });

        // The API will now handle sequential ID generation
        const newTask = await taskApi.createTask(taskData);
        dispatch({ type: "ADD_TASK", payload: newTask });
        return newTask;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create task";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      }
    },
    [dispatch]
  );

  const updateTask = useCallback(
    async (id: string, taskData: Partial<Task>) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "CLEAR_ERROR" });

        // Find the current task to preserve existing data
        const currentTask = tasks.find((task) => task.id === id);
        if (!currentTask) {
          throw new Error(`Task with id ${id} not found`);
        }

        // Prevent reopening completed tasks
        if (currentTask.completed && taskData.completed === false) {
          throw new Error("Tarefas concluídas não podem ser reabertas");
        }

        // Handle completion timestamp
        const updatedTaskData = { ...taskData };
        if (taskData.completed !== undefined) {
          if (taskData.completed && !currentTask.completed) {
            // Task is being marked as completed for the first time
            updatedTaskData.completedAt = new Date().toISOString();
          }
          // Remove the else if block that would clear completedAt
        }

        // Merge updates with existing task data
        const mergedTaskData = {
          ...currentTask,
          ...updatedTaskData,
          updatedAt: new Date().toISOString(),
        };

        const updatedTask = await taskApi.updateTask(id, mergedTaskData);
        dispatch({ type: "UPDATE_TASK", payload: updatedTask });
        return updatedTask;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update task";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      }
    },
    [dispatch, tasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "CLEAR_ERROR" });
        await taskApi.deleteTask(id);
        dispatch({ type: "DELETE_TASK", payload: id });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete task";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      }
    },
    [dispatch]
  );

  return {
    // State
    tasks,
    loading,
    error,
    selectedTask,

    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    setSelectedTask,
    clearError,
  };
};

import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  category: string;
  completed: boolean;
  dueDate?: string;
  estimatedDuration?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string; // New field to track when task was completed
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
}

type TaskAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_SELECTED_TASK"; payload: Task | null }
  | { type: "CLEAR_ERROR" };

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_TASKS":
      return { ...state, tasks: action.payload, loading: false, error: null };
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        loading: false,
        error: null,
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        selectedTask:
          state.selectedTask?.id === action.payload.id
            ? action.payload
            : state.selectedTask,
        loading: false,
        error: null,
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        selectedTask:
          state.selectedTask?.id === action.payload ? null : state.selectedTask,
        loading: false,
        error: null,
      };
    case "SET_SELECTED_TASK":
      return { ...state, selectedTask: action.payload };
    default:
      return state;
  }
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const contextValue = React.useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

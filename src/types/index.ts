export interface JsonServerTask {
  id: number | string; // Allow both number and string IDs
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  category: string;
  estimated_duration: number;
  deadline?: string;
  status: "pending" | "completed";
  completed_at?: string;
}

// Enhanced time suggestion interfaces
export interface SuggestedTime {
  start: string;
  end: string;
  score: number;
  reason?: string;
}

export interface TimeSuggestion {
  task_id?: number;
  category?: string;
  priority?: string;
  suggested_times: SuggestedTime[];
  id: string;
}

export interface TaskData {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  category: string;
  estimated_duration: number;
  deadline?: string;
}

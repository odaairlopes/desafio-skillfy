import { useTheme } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GlobalStyles } from "./styles/globalStyles";
import { HTMLProps } from "react";
import Dashboard from "./screens/Dashboard/Dashboard";
import { TaskProvider } from "./contexts/TaskContext";
import Layout from "./components/Layout/Layout";
import TaskForm from "./screens/TaskForm/TaskForm";
import TaskList from "./screens/TaskList/TaskList";
import { ToastProvider } from "./contexts/ToastContext";
import { TasksPage } from "./screens/TaskPage/TaskPage";
import TaskDetailPage from "./screens/TaskDetailPage/TaskDetailPage";

function AppContent() {
  const theme = useTheme();
  return (
    <div {...({} as HTMLProps<HTMLDivElement>)}>
      <GlobalStyles theme={theme} />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/new" element={<TaskForm />} />
            <Route path="/tasks/:id/edit" element={<TaskForm />} />
            <Route path="/task/:id" element={<TaskDetailPage />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;

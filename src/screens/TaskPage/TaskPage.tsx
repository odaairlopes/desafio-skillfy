import React, { Suspense, lazy } from "react";
import { useSearchParams } from "react-router";
import { Container, ResponsiveWrapper } from "./TaskPage.styles";
import { useTasks } from "../../hooks/useTasks";

const TaskList = lazy(() => import("../TaskList/TaskList"));
const TaskForm = lazy(() => import("../TaskForm/TaskForm"));
const TaskDetail = lazy(() => import("../../components/TaskDetail/TaskDetail"));

const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "200px",
      fontSize: "16px",
      color: "#666",
    }}
  >
    <div>
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid #f3f3f3",
          borderTop: "3px solid #007bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 10px",
        }}
      />
      Carregando...
    </div>
  </div>
);

export const TasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { selectedTask, fetchTask } = useTasks();

  const view = searchParams.get("view");
  const id = searchParams.get("id");

  React.useEffect(() => {
    if (view === "detail" && id) {
      fetchTask(id);
    }
  }, [view, id, fetchTask]);

  const renderContent = () => {
    switch (view) {
      case "new":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TaskForm />
          </Suspense>
        );
      case "edit":
        if (!id)
          return (
            <Suspense fallback={<LoadingSpinner />}>
              <TaskList />
            </Suspense>
          );
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TaskForm taskId={id} />
          </Suspense>
        );
      case "detail":
        if (!id || !selectedTask)
          return (
            <Suspense fallback={<LoadingSpinner />}>
              <TaskList />
            </Suspense>
          );
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TaskDetail task={selectedTask} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TaskList />
          </Suspense>
        );
    }
  };

  return (
    <Container>
      <ResponsiveWrapper>{renderContent()}</ResponsiveWrapper>
    </Container>
  );
};

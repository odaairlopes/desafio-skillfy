"use client";

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTasks } from "../../hooks/useTasks";
import TaskDetail from "../../components/TaskDetail/TaskDetail";
import {
  Container,
  MaxWidthWrapper,
  BackButton,
  BackIcon,
  LoadingContainer,
  LoadingSkeleton,
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
  NotFoundContainer,
  NotFoundTitle,
  NotFoundMessage,
} from "./TaskDetailPage.styles";

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedTask, loading, error, fetchTask } = useTasks();

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id, fetchTask]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container>
        <MaxWidthWrapper>
          <LoadingContainer>
            <LoadingSkeleton
              style={{ width: "8rem", height: "2rem", marginBottom: "1.5rem" }}
            />
            <LoadingSkeleton style={{ height: "16rem" }} />
          </LoadingContainer>
        </MaxWidthWrapper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <MaxWidthWrapper>
          <BackButton onClick={handleBack}>
            <BackIcon viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </BackIcon>
            Voltar
          </BackButton>
          <ErrorContainer>
            <ErrorTitle>Erro ao carregar tarefa</ErrorTitle>
          </ErrorContainer>
        </MaxWidthWrapper>
      </Container>
    );
  }

  if (!selectedTask) {
    return (
      <Container>
        <MaxWidthWrapper>
          <BackButton onClick={handleBack}>
            <BackIcon viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </BackIcon>
            Voltar
          </BackButton>
          <NotFoundContainer>
            <NotFoundTitle>Tarefa não encontrada</NotFoundTitle>
            <NotFoundMessage>
              A tarefa solicitada não existe ou foi removida.
            </NotFoundMessage>
          </NotFoundContainer>
        </MaxWidthWrapper>
      </Container>
    );
  }

  return <TaskDetail task={selectedTask} />;
};

export default TaskDetailPage;

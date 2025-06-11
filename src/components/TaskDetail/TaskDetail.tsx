"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Task } from "../../contexts/TaskContext";
import { useTasks } from "../../hooks/useTasks";
import PriorityBadge from "../PriorityBadge/PriorityBadge";
import TimeSuggestions from "../TimeSuggestions/TimeSuggestions";
import DeleteConfirmModal from "../DeleteConfirmModal/DeleteConfirmModal";
import { SuggestedTime, TaskData } from "../../types/index";
import { useToastContext } from "../../contexts/ToastContext";
import {
  Container,
  ContentWrapper,
  BackButton,
  BackIcon,
  HeaderCard,
  HeaderContent,
  Title,
  BadgeContainer,
  CategoryBadge,
  CompletedBadge,
  OverdueBadge,
  ActionsContainer,
  ActionButton,
  CompletedIndicator,
  MainGrid,
  MainContent,
  Sidebar,
  DescriptionCard,
  SectionTitle,
  Description,
  InfoCard,
  InfoItem,
  InfoLabel,
  InfoValue,
  ProgressCard,
  ProgressHeader,
  ProgressBar,
  ProgressFill,
  ProgressText,
  OfflineAlert,
  OfflineTitle,
  OfflineDescription,
  OfflineList,
  OfflineListItem,
  RetryButton,
} from "./TaskDetail.styles";

interface TaskDetailProps {
  task: Task;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  const navigate = useNavigate();
  const { updateTask, deleteTask, loading } = useTasks();
  const { showSuccess, showError } = useToastContext();
  const [showTimeSuggestions, setShowTimeSuggestions] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch("http://localhost:3001/tasks");
        if (response.ok) {
          setApiStatus("online");
        } else {
          setApiStatus("offline");
        }
      } catch (error) {
        console.error("API Health Check Failed:", error);
        setApiStatus("offline");
      }
    };

    checkApiHealth();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não definido";
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "Não definido";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const handleToggleComplete = async () => {
    try {
      await updateTask(task.id, {
        completed: !task.completed,
        updatedAt: new Date().toISOString(),
      });

      const action = !task.completed ? "concluída" : "reaberta";
      showSuccess(`Tarefa ${action} com sucesso!`);
    } catch (error) {
      console.error("Error updating task:", error);
      showError("Erro ao atualizar tarefa");
    }
  };

  const handleEdit = () => {
    navigate(`/tasks?view=edit&id=${task.id}`);
  };

  const handleDelete = async () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(task.id);
      showSuccess("Tarefa excluída com sucesso!");
      navigate("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      showError("Erro ao excluir tarefa");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const handleBack = () => {
    navigate("/tasks");
  };

  const taskDataForSuggestions: TaskData = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    category: task.category,
    estimated_duration: task.estimatedDuration || 60,
    deadline: task.dueDate,
  };

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  if (apiStatus === "offline") {
    return (
      <Container>
        <ContentWrapper>
          <OfflineAlert>
            <OfflineTitle>Servidor API Offline</OfflineTitle>
            <OfflineDescription>
              O servidor JSON está offline ou não está respondendo. Verifique
              se:
            </OfflineDescription>
            <OfflineList>
              <OfflineListItem>
                O JSON Server está rodando na porta 3001
              </OfflineListItem>
              <OfflineListItem>
                Execute: <code>npm run json-server</code>
              </OfflineListItem>
              <OfflineListItem>
                Verifique se o arquivo db.json existe na raiz do projeto
              </OfflineListItem>
            </OfflineList>
            <RetryButton onClick={() => window.location.reload()}>
              Tentar Novamente
            </RetryButton>
          </OfflineAlert>
        </ContentWrapper>
      </Container>
    );
  }

  const handleTimeSelect = (time: SuggestedTime) => {
    const startTime = new Date(time.start);
    const endTime = new Date(time.end);

    const formattedTime = startTime.toLocaleString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const duration = Math.round(
      (endTime.getTime() - startTime.getTime()) / (1000 * 60)
    );

    const confirmed = window.confirm(
      `Deseja agendar esta tarefa para:\n\n` +
        `📅 ${formattedTime}\n` +
        `⏱️ Duração: ${duration} minutos\n\n` +
        `Isso atualizará o prazo da tarefa.`
    );

    if (confirmed) {
      const localDate = new Date(
        startTime.getTime() - startTime.getTimezoneOffset() * 60000
      );
      const formattedDateTime = localDate.toISOString().slice(0, 16);
      const taskId = task.id.toString();

      updateTask(taskId, {
        dueDate: formattedDateTime,
        updatedAt: new Date().toISOString(),
      })
        .then(() => {
          showSuccess(`Tarefa reagendada para ${formattedTime}`);
        })
        .catch((error) => {
          console.error("Error updating task:", error);
          showError("Erro ao reagendar tarefa");
        });
    }
  };

  return (
    <Container>
      <ContentWrapper>
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

        <div>
          {/* Header */}
          <HeaderCard>
            <HeaderContent>
              <div>
                <Title $completed={task.completed}>{task.title}</Title>
                <BadgeContainer>
                  <PriorityBadge priority={task.priority} />
                  <CategoryBadge>{task.category}</CategoryBadge>
                  {task.completed && (
                    <CompletedBadge>✓ Concluída</CompletedBadge>
                  )}
                  {isOverdue && <OverdueBadge>⚠️ Atrasada</OverdueBadge>}
                </BadgeContainer>
              </div>
            </HeaderContent>

            {/* Action Buttons */}
            <ActionsContainer>
              {!task.completed && (
                <ActionButton
                  $variant="success"
                  onClick={handleToggleComplete}
                  disabled={loading}
                >
                  Marcar como Concluída
                </ActionButton>
              )}

              {!task.completed && (
                <ActionButton
                  $variant="primary"
                  onClick={handleEdit}
                  disabled={loading}
                >
                  Editar
                </ActionButton>
              )}

              <ActionButton
                $variant="danger"
                onClick={handleDelete}
                disabled={loading}
              >
                Excluir
              </ActionButton>

              {!task.completed && (
                <ActionButton
                  $variant="secondary"
                  onClick={() => setShowTimeSuggestions(!showTimeSuggestions)}
                  disabled={loading}
                >
                  💡 Sugestões de Horário
                </ActionButton>
              )}

              {task.completed && (
                <CompletedIndicator>
                  <span>🎉</span>
                  <span>Tarefa Concluída!</span>
                </CompletedIndicator>
              )}
            </ActionsContainer>
          </HeaderCard>

          <MainGrid>
            {/* Main Content */}
            <MainContent>
              {/* Description */}
              <DescriptionCard>
                <SectionTitle>Descrição</SectionTitle>
                {task.description ? (
                  <Description>{task.description}</Description>
                ) : (
                  <Description $empty>Nenhuma descrição fornecida</Description>
                )}
              </DescriptionCard>

              {/* Time Suggestions */}
              {showTimeSuggestions && !task.completed && (
                <InfoCard>
                  <TimeSuggestions
                    taskData={taskDataForSuggestions}
                    onTimeSelect={handleTimeSelect}
                  />
                </InfoCard>
              )}
            </MainContent>

            {/* Sidebar */}
            <Sidebar>
              {/* Task Info */}
              <InfoCard>
                <SectionTitle>Informações da Tarefa</SectionTitle>
                <div>
                  <InfoItem>
                    <InfoLabel>Status</InfoLabel>
                    <InfoValue>
                      {task.completed ? "Concluída" : "Pendente"}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Prioridade</InfoLabel>
                    <div>
                      <PriorityBadge priority={task.priority} size="sm" />
                    </div>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Categoria</InfoLabel>
                    <InfoValue>{task.category}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Duração Estimada</InfoLabel>
                    <InfoValue>
                      {formatDuration(task.estimatedDuration)}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Prazo</InfoLabel>
                    <InfoValue $isOverdue={!!isOverdue}>
                      {formatDate(task.dueDate)}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Criada em</InfoLabel>
                    <InfoValue>{formatDate(task.createdAt)}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Última atualização</InfoLabel>
                    <InfoValue>{formatDate(task.updatedAt)}</InfoValue>
                  </InfoItem>

                  {task.completedAt && (
                    <InfoItem>
                      <InfoLabel>Concluída em</InfoLabel>
                      <InfoValue $completed>
                        {formatDate(task.completedAt)}
                      </InfoValue>
                    </InfoItem>
                  )}
                </div>
              </InfoCard>

              {/* Progress */}
              {task.estimatedDuration && (
                <ProgressCard>
                  <SectionTitle>Progresso</SectionTitle>
                  <div>
                    <ProgressHeader>
                      <span>Status</span>
                      <span>{task.completed ? "100%" : "0%"}</span>
                    </ProgressHeader>
                    <ProgressBar>
                      <ProgressFill $completed={task.completed} />
                    </ProgressBar>
                    <ProgressText>
                      Tempo estimado: {formatDuration(task.estimatedDuration)}
                    </ProgressText>
                  </div>
                </ProgressCard>
              )}
            </Sidebar>
          </MainGrid>
        </div>
      </ContentWrapper>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        taskTitle={task.title}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Container>
  );
};

export default TaskDetail;

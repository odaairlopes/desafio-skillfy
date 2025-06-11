"use client";

import React from "react";
import { Task } from "../../contexts/TaskContext";
import PriorityBadge from "../PriorityBadge/PriorityBadge";
import {
  CardContainer,
  CardContent,
  Header,
  HeaderContent,
  Title,
  Description,
  InfoSection,
  CategoryIcon,
  CategoryBadge,
  CompletedBadge,
  DetailsSection,
  DetailRow,
  DateSpan,
  SuggestedTime,
  ActionsSection,
  ActionButton,
  ScreenReaderOnly,
} from "./TaskCard.styles";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
  onCardClick?: (taskId: string) => void;
  showActions?: boolean;
  suggestedTime?: string;
  clickable?: boolean;
  enableHoverScale?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  onCardClick,
  showActions = true,
  suggestedTime,
  clickable = true,
  enableHoverScale = true,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      trabalho: "💼",
      estudos: "📚",
      saúde: "🏥",
      pessoal: "👤",
      casa: "🏠",
      lazer: "🎮",
      financeiro: "💰",
    };
    return icons[category] || "📋";
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <CardContainer
      $clickable={clickable}
      $enableHoverScale={enableHoverScale}
      $completed={task.completed}
      onClick={clickable ? () => onCardClick?.(task.id) : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={
        clickable
          ? `Ver detalhes da tarefa: ${task.title}. Prioridade ${
              task.priority
            }, categoria ${task.category}${
              task.completed ? ", concluída" : ", pendente"
            }`
          : undefined
      }
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCardClick?.(task.id);
              }
            }
          : undefined
      }
    >
      <CardContent>
        {/* Header */}
        <Header>
          <HeaderContent>
            <Title $completed={task.completed}>{task.title}</Title>
            {task.description && <Description>{task.description}</Description>}
          </HeaderContent>
          <div aria-label={`Prioridade ${task.priority}`}>
            <PriorityBadge priority={task.priority} size="sm" />
          </div>
        </Header>

        {/* Category and Status */}
        <InfoSection role="group" aria-label="Informações da tarefa">
          <CategoryIcon aria-hidden="true">
            {getCategoryIcon(task.category)}
          </CategoryIcon>
          <CategoryBadge
            $category={task.category}
            aria-label={`Categoria: ${task.category}`}
          >
            {task.category}
          </CategoryBadge>
          {task.completed && (
            <CompletedBadge aria-label="Status: concluída">
              ✓ Concluída
            </CompletedBadge>
          )}
        </InfoSection>

        {/* Details */}
        <DetailsSection>
          <DetailRow>
            {task.estimatedDuration && (
              <span
                aria-label={`Duração estimada: ${formatDuration(
                  task.estimatedDuration
                )}`}
              >
                ⏱️ {formatDuration(task.estimatedDuration)}
              </span>
            )}
            {task.dueDate && (
              <DateSpan
                $isOverdue={!!isOverdue}
                aria-label={`Prazo: ${formatDate(task.dueDate)}${
                  isOverdue ? " - Atrasada" : ""
                }`}
              >
                📅 {formatDate(task.dueDate)}
                {isOverdue && <ScreenReaderOnly> (Atrasada)</ScreenReaderOnly>}
              </DateSpan>
            )}
          </DetailRow>

          {suggestedTime && (
            <SuggestedTime
              role="note"
              aria-label={`Horário sugerido: ${suggestedTime}`}
            >
              💡 Horário sugerido: {suggestedTime}
            </SuggestedTime>
          )}
        </DetailsSection>

        {/* Actions */}
        {showActions && (
          <ActionsSection>
            {!task.completed && (
              <ActionButton
                $variant="complete"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete?.(task.id);
                }}
                title="Marcar como concluída"
              >
                ✓ Concluir
              </ActionButton>
            )}

            {!task.completed && (
              <ActionButton
                $variant="edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(task);
                }}
                title="Editar tarefa"
              >
                ✏️ Editar
              </ActionButton>
            )}

            <ActionButton
              $variant="delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(task.id);
              }}
              title="Excluir tarefa"
            >
              🗑️ Excluir
            </ActionButton>
          </ActionsSection>
        )}
      </CardContent>
    </CardContainer>
  );
};

export default TaskCard;

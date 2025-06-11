"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useTasks } from "../../hooks/useTasks";
import TaskCard from "../../components/TaskCard/TaskCard";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import PriorityBadge from "../../components/PriorityBadge/PriorityBadge";
import DeleteConfirmModal from "../../components/DeleteConfirmModal/DeleteConfirmModal";
import { Task } from "../../contexts/TaskContext";
import { useToastContext } from "../../contexts/ToastContext";
import {
  Container,
  MaxWidthWrapper,
  LoadingContainer,
  LoadingGrid,
  LoadingSkeleton,
  LoadingTitle,
  Header,
  BackButton,
  BackIcon,
  HeaderContent,
  HeaderInfo,
  Title,
  TaskCount,
  NewTaskButton,
  ErrorContainer,
  ErrorText,
  MainGrid,
  Sidebar,
  FiltersCard,
  FiltersHeader,
  FiltersTitle,
  ClearFiltersButton,
  FilterGroup,
  FilterLabel,
  SearchInput,
  FilterGroupTitle,
  RadioGroup,
  RadioLabel,
  RadioInput,
  RadioText,
  CheckboxGroup,
  CheckboxLabel,
  CheckboxInput,
  MainContent,
  SortCard,
  SortContainer,
  SortLabel,
  SortSelect,
  TasksContainer,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from "./TaskList.styles";

type SortOption = "date" | "priority" | "name";
type FilterStatus = "all" | "pending" | "completed";

export const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, loading, error, fetchTasks, updateTask, deleteTask } =
    useTasks();
  const { showSuccess, showError } = useToastContext();
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const categories = useMemo(() => {
    return Array.from(new Set(tasks.map((task) => task.category)));
  }, [tasks]);

  const priorities = ["high", "medium", "low"];

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (filterStatus === "pending" && task.completed) return false;
      if (filterStatus === "completed" && !task.completed) return false;

      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(task.category)
      ) {
        return false;
      }

      if (
        selectedPriorities.length > 0 &&
        !selectedPriorities.includes(task.priority)
      ) {
        return false;
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.category.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];

        case "name":
          return a.title.localeCompare(b.title);

        default:
          return 0;
      }
    });

    return filtered;
  }, [
    tasks,
    sortBy,
    filterStatus,
    selectedCategories,
    selectedPriorities,
    searchTerm,
  ]);

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id.toString() === taskId.toString());
    if (task && !task.completed) {
      try {
        await updateTask(task.id.toString(), {
          completed: true,
          updatedAt: new Date().toISOString(),
        });

        showSuccess("Tarefa concluída com sucesso!");
      } catch (error) {
        console.error("Error updating task:", error);
        showError("Erro ao atualizar tarefa");
      }
    }
  };

  const handleEdit = (task: Task) => {
    if (!task.completed) {
      navigate(`/task/${task.id}/edit`);
    }
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  const handleDelete = async (taskId: string) => {
    const task = tasks.find((t) => t.id.toString() === taskId.toString());
    if (task) {
      setTaskToDelete(task);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete.id.toString());
        showSuccess("Tarefa excluída com sucesso!");
      } catch (error) {
        console.error("Error deleting task:", error);
        showError("Erro ao excluir tarefa");
      } finally {
        setDeleteModalOpen(false);
        setTaskToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriorities([]);
    setFilterStatus("all");
    setSearchTerm("");
  };

  if (loading && tasks.length === 0) {
    return (
      <LoadingContainer>
        <MaxWidthWrapper>
          <LoadingTitle />
          <LoadingGrid>
            <LoadingSkeleton />
            <div>
              {[1, 2, 3, 4].map((i) => (
                <LoadingSkeleton key={i} style={{ marginBottom: "1rem" }} />
              ))}
            </div>
          </LoadingGrid>
        </MaxWidthWrapper>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <MaxWidthWrapper>
        <Header>
          <BackButton onClick={() => navigate("/")}>
            <BackIcon viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </BackIcon>
            Voltar ao Dashboard
          </BackButton>

          <HeaderContent>
            <HeaderInfo>
              <Title>Lista de Tarefas</Title>
              <TaskCount>
                {filteredAndSortedTasks.length} de {tasks.length} tarefas
              </TaskCount>
            </HeaderInfo>

            <NewTaskButton onClick={() => navigate("/tasks/new")}>
              + Nova Tarefa
            </NewTaskButton>
          </HeaderContent>
        </Header>

        {error && (
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        )}

        <MainGrid>
          <Sidebar>
            <FiltersCard>
              <FiltersHeader>
                <FiltersTitle>Filtros</FiltersTitle>
                <ClearFiltersButton onClick={clearAllFilters}>
                  Limpar
                </ClearFiltersButton>
              </FiltersHeader>

              <FilterGroup>
                <FilterLabel>Buscar</FilterLabel>
                <SearchInput
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar tarefas..."
                />
              </FilterGroup>

              <FilterGroup>
                <FilterGroupTitle>Status</FilterGroupTitle>
                <RadioGroup>
                  {[
                    { value: "all", label: "Todas" },
                    { value: "pending", label: "Pendentes" },
                    { value: "completed", label: "Concluídas" },
                  ].map((option) => (
                    <RadioLabel key={option.value}>
                      <RadioInput
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={filterStatus === option.value}
                        onChange={(e) =>
                          setFilterStatus(e.target.value as FilterStatus)
                        }
                      />
                      <RadioText>{option.label}</RadioText>
                    </RadioLabel>
                  ))}
                </RadioGroup>
              </FilterGroup>

              <FilterGroup>
                <FilterGroupTitle>Prioridade</FilterGroupTitle>
                <CheckboxGroup>
                  {priorities.map((priority) => (
                    <CheckboxLabel key={priority}>
                      <CheckboxInput
                        type="checkbox"
                        checked={selectedPriorities.includes(priority)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPriorities([
                              ...selectedPriorities,
                              priority,
                            ]);
                          } else {
                            setSelectedPriorities(
                              selectedPriorities.filter((p) => p !== priority)
                            );
                          }
                        }}
                      />
                      <span>
                        <PriorityBadge
                          priority={priority as Task["priority"]}
                          size="sm"
                        />
                      </span>
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FilterGroup>

              {categories.length > 0 && (
                <FilterGroup>
                  <CategoryFilter
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={setSelectedCategories}
                  />
                </FilterGroup>
              )}
            </FiltersCard>
          </Sidebar>

          <MainContent>
            <SortCard>
              <SortContainer>
                <SortLabel>Ordenar por:</SortLabel>
                <SortSelect
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <option value="date">Data</option>
                  <option value="priority">Prioridade</option>
                  <option value="name">Nome</option>
                </SortSelect>
              </SortContainer>
            </SortCard>

            {filteredAndSortedTasks.length > 0 ? (
              <TasksContainer>
                {filteredAndSortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                    onCardClick={() => handleTaskClick(task.id)}
                  />
                ))}
              </TasksContainer>
            ) : (
              <EmptyState>
                <EmptyIcon
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </EmptyIcon>
                <EmptyTitle>Nenhuma tarefa encontrada</EmptyTitle>
                <EmptyDescription>
                  Tente ajustar os filtros ou criar uma nova tarefa.
                </EmptyDescription>
              </EmptyState>
            )}
          </MainContent>
        </MainGrid>

        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          taskTitle={taskToDelete?.title || ""}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </MaxWidthWrapper>
    </Container>
  );
};

export default TaskList;

"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useTasks } from "../../hooks/useTasks";
import { Task } from "../../contexts/TaskContext";
import { useToastContext } from "../../contexts/ToastContext";
import PriorityBadge from "../../components/PriorityBadge/PriorityBadge";
import TimeSuggestions from "../../components/TimeSuggestions/TimeSuggestions";
import {
  Container,
  MaxWidthWrapper,
  Header,
  Title,
  Subtitle,
  ErrorContainer,
  ErrorText,
  GridContainer,
  FormSection,
  SidebarSection,
  FormContainer,
  FormGroup,
  Label,
  Input,
  TextArea,
  CategoryGrid,
  CategoryButton,
  CategoryButtonContent,
  CategoryIcon,
  CategoryName,
  GridTwoColumns,
  RadioGroup,
  RadioLabel,
  RadioInput,
  CheckboxLabel,
  CheckboxInput,
  ValidationErrorsContainer,
  ValidationErrorTitle,
  ValidationErrorList,
  ValidationErrorItem,
  FormFooter,
  SuggestButton,
  ButtonGroup,
  SubmitButton,
  CancelButton,
  PreviewCard,
  PreviewTitle,
  PreviewContent,
  PreviewItem,
  PreviewLabel,
  PreviewValue,
  PreviewValueSmall,
  PriorityContainer,
  ErrorMessage,
  HelpText,
  RequiredAsterisk,
} from "./TaskForm.styles";
import { SuggestedTime, TaskData } from "../../types/index";

interface TaskFormProps {
  taskId?: string;
  onSave?: (task: Task) => void;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  taskId,
  onSave,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createTask, updateTask, fetchTask, selectedTask, loading, error } =
    useTasks();
  const { showSuccess, showError } = useToastContext();
  const { id } = useParams<{ id: string }>();
  const actualTaskId = taskId || id;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as Task["priority"],
    estimatedDuration: 60,
    dueDate: "",
    completed: false,
  });

  const [showTimeSuggestions, setShowTimeSuggestions] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const predefinedCategories = [
    "trabalho",
    "pessoal",
    "estudos",
    "saúde",
    "casa",
    "financeiro",
    "lazer",
  ];

  useEffect(() => {
    if (taskId) {
      fetchTask(taskId);
    } else {
      const category = searchParams.get("category");
      const time = searchParams.get("time");

      if (category) {
        setFormData((prev) => ({ ...prev, category }));
      }

      if (time) {
        try {
          const date = new Date(time);
          const localDate = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
          );
          const formattedDateTime = localDate.toISOString().slice(0, 16);
          setFormData((prev) => ({ ...prev, dueDate: formattedDateTime }));
        } catch (error) {
          console.error("Error parsing time from URL:", error);
        }
      }
    }
  }, [taskId, fetchTask, searchParams]);

  useEffect(() => {
    if (selectedTask && taskId) {
      setFormData({
        title: selectedTask.title,
        description: selectedTask.description || "",
        category: selectedTask.category,
        priority: selectedTask.priority,
        estimatedDuration: selectedTask.estimatedDuration || 60,
        dueDate: selectedTask.dueDate || "",
        completed: selectedTask.completed,
      });
    }
  }, [selectedTask, taskId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      errors.title = "Título é obrigatório";
    }

    if (!formData.category.trim()) {
      errors.category = "Categoria é obrigatória";
    }

    if (!taskId && !formData.dueDate) {
      errors.dueDate = "Prazo é obrigatório para novas tarefas";
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const now = new Date();
      if (selectedDate < now && !taskId) {
        errors.dueDate = "O prazo não pode ser no passado";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationErrors({});

    if (!validateForm()) {
      showError("Por favor, corrija os erros no formulário");
      return;
    }

    try {
      const taskData = {
        ...formData,
      };

      let savedTask: Task;
      if (actualTaskId) {
        savedTask = await updateTask(actualTaskId, taskData);
        showSuccess("Tarefa atualizada com sucesso!");
        navigate(`/task/${actualTaskId}`);
      } else {
        savedTask = await createTask(taskData);
        showSuccess("Tarefa criada com sucesso!");
        navigate("/tasks");
      }

      onSave?.(savedTask);
    } catch (err) {
      console.error("Error saving task:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao salvar tarefa";
      showError(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  const handleGetTimeSuggestions = () => {
    if (formData.title && formData.category && formData.estimatedDuration) {
      setShowTimeSuggestions(true);
    }
  };

  const handleTimeSelect = (time: SuggestedTime) => {
    const startDate = new Date(time.start);

    const localDate = new Date(
      startDate.getTime() - startDate.getTimezoneOffset() * 60000
    );

    const formattedDateTime = localDate.toISOString().slice(0, 16);

    setFormData((prev) => ({
      ...prev,
      dueDate: formattedDateTime,
    }));

    const formattedDisplayTime = startDate.toLocaleString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    showSuccess(`Horário selecionado: ${formattedDisplayTime}`);
  };

  const taskDataForSuggestions: TaskData = {
    title: formData.title,
    description: formData.description,
    priority: formData.priority,
    category: formData.category,
    estimated_duration: formData.estimatedDuration,
    deadline: formData.dueDate,
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

  return (
    <Container>
      <MaxWidthWrapper>
        <Header>
          <Title>{taskId ? "Editar Tarefa" : "Nova Tarefa"}</Title>
          <Subtitle>
            Preencha os campos abaixo para {taskId ? "atualizar" : "criar"} uma
            tarefa.
          </Subtitle>
        </Header>

        {error && (
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        )}

        <GridContainer>
          <FormSection>
            <FormContainer onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  Título <RequiredAsterisk>*</RequiredAsterisk>
                </Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  $hasError={!!validationErrors.title}
                  placeholder="Digite o título da tarefa"
                />
                {validationErrors.title && (
                  <ErrorMessage>{validationErrors.title}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Descrição</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Descreva a tarefa (opcional)"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  Categoria <RequiredAsterisk>*</RequiredAsterisk>
                </Label>
                <CategoryGrid>
                  {predefinedCategories.map((category) => (
                    <CategoryButton
                      key={category}
                      type="button"
                      onClick={() => setFormData({ ...formData, category })}
                      $isSelected={formData.category === category}
                      $category={category}
                    >
                      <CategoryButtonContent>
                        <CategoryIcon>{getCategoryIcon(category)}</CategoryIcon>
                        <CategoryName>{category}</CategoryName>
                      </CategoryButtonContent>
                    </CategoryButton>
                  ))}
                </CategoryGrid>
                {validationErrors.category && (
                  <ErrorMessage>{validationErrors.category}</ErrorMessage>
                )}
              </FormGroup>

              <GridTwoColumns>
                <FormGroup>
                  <Label>
                    Prioridade <RequiredAsterisk>*</RequiredAsterisk>
                  </Label>
                  <RadioGroup>
                    {(["high", "medium", "low"] as const).map((priority) => (
                      <RadioLabel key={priority}>
                        <RadioInput
                          type="radio"
                          name="priority"
                          value={priority}
                          checked={formData.priority === priority}
                          onChange={handleInputChange}
                        />
                        <PriorityBadge priority={priority} size="sm" />
                      </RadioLabel>
                    ))}
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label>
                    Duração Estimada (minutos){" "}
                    <RequiredAsterisk>*</RequiredAsterisk>
                  </Label>
                  <Input
                    type="number"
                    name="estimatedDuration"
                    value={formData.estimatedDuration}
                    onChange={handleInputChange}
                    min="5"
                    max="480"
                    step="5"
                  />
                </FormGroup>
              </GridTwoColumns>

              <FormGroup>
                <Label>
                  Prazo {!taskId && <RequiredAsterisk>*</RequiredAsterisk>}
                </Label>
                <Input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  $hasError={!!validationErrors.dueDate}
                />
                {validationErrors.dueDate && (
                  <ErrorMessage>{validationErrors.dueDate}</ErrorMessage>
                )}
                {!taskId && (
                  <HelpText>O prazo é obrigatório para novas tarefas</HelpText>
                )}
              </FormGroup>

              {taskId && (
                <FormGroup>
                  <CheckboxLabel>
                    <CheckboxInput
                      type="checkbox"
                      name="completed"
                      checked={formData.completed}
                      onChange={handleInputChange}
                    />
                    Tarefa concluída
                  </CheckboxLabel>
                </FormGroup>
              )}

              {Object.keys(validationErrors).length > 0 && (
                <ValidationErrorsContainer>
                  <ValidationErrorTitle>
                    Por favor, corrija os seguintes erros:
                  </ValidationErrorTitle>
                  <ValidationErrorList>
                    {Object.values(validationErrors).map((error, index) => (
                      <ValidationErrorItem key={index}>
                        {error}
                      </ValidationErrorItem>
                    ))}
                  </ValidationErrorList>
                </ValidationErrorsContainer>
              )}

              <FormFooter>
                <SuggestButton
                  type="button"
                  onClick={handleGetTimeSuggestions}
                  disabled={!formData.title || !formData.category}
                >
                  💡 Sugerir Horário
                </SuggestButton>

                <ButtonGroup>
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? "Salvando..." : taskId ? "Atualizar" : "Criar"}{" "}
                    Tarefa
                  </SubmitButton>

                  <CancelButton type="button" onClick={handleCancel}>
                    Cancelar
                  </CancelButton>
                </ButtonGroup>
              </FormFooter>
            </FormContainer>
          </FormSection>

          <SidebarSection>
            <PreviewCard>
              <PreviewTitle>Preview da Tarefa</PreviewTitle>

              <PreviewContent>
                <PreviewItem>
                  <PreviewLabel>Título:</PreviewLabel>
                  <PreviewValue>{formData.title || "Sem título"}</PreviewValue>
                </PreviewItem>

                {formData.description && (
                  <PreviewItem>
                    <PreviewLabel>Descrição:</PreviewLabel>
                    <PreviewValueSmall>
                      {formData.description}
                    </PreviewValueSmall>
                  </PreviewItem>
                )}

                <PreviewItem>
                  <PreviewLabel>Categoria:</PreviewLabel>
                  <PreviewValue style={{ textTransform: "capitalize" }}>
                    {formData.category || "Não definida"}
                  </PreviewValue>
                </PreviewItem>

                <PreviewItem>
                  <PreviewLabel>Prioridade:</PreviewLabel>
                  <PriorityContainer>
                    <PriorityBadge priority={formData.priority} size="sm" />
                  </PriorityContainer>
                </PreviewItem>

                <PreviewItem>
                  <PreviewLabel>Duração:</PreviewLabel>
                  <PreviewValue>
                    {Math.floor(formData.estimatedDuration / 60)}h{" "}
                    {formData.estimatedDuration % 60}min
                  </PreviewValue>
                </PreviewItem>

                {formData.dueDate && (
                  <PreviewItem>
                    <PreviewLabel>Prazo:</PreviewLabel>
                    <PreviewValue>
                      {new Date(formData.dueDate).toLocaleString("pt-BR")}
                    </PreviewValue>
                  </PreviewItem>
                )}
              </PreviewContent>
            </PreviewCard>

            {showTimeSuggestions && formData.title && formData.category && (
              <PreviewCard>
                <TimeSuggestions
                  taskData={taskDataForSuggestions}
                  onTimeSelect={handleTimeSelect}
                />
              </PreviewCard>
            )}
          </SidebarSection>
        </GridContainer>
      </MaxWidthWrapper>
    </Container>
  );
};

export default TaskForm;

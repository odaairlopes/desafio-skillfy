import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import TaskCard from "../../components/TaskCard/TaskCard";
import { useTasks } from "../../hooks/useTasks";
import { Task } from "../../contexts/TaskContext";
import { suggestTime } from "../../services/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CategoryBadge,
  CategoryHeader,
  CategoryIcon,
  ChartContainer,
  CircularProgress,
  Container,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  EmptyStateTitle,
  Header,
  HeaderActions,
  HeaderContent,
  LeftColumn,
  LoadingCard,
  LoadingContainer,
  LoadingContent,
  LoadingGrid,
  LoadingTitle,
  MainGrid,
  MaxWidthWrapper,
  NewTaskButton,
  ProductivityChart,
  ProgressBackground,
  ProgressBarContainer,
  ProgressBarFill,
  ProgressBarHeader,
  ProgressBarTrack,
  ProgressCenter,
  ProgressForeground,
  ProgressLabel,
  ProgressPercentage,
  ProgressSvg,
  ProgressValue,
  QuickActionButton,
  QuickActionContent,
  QuickActionDescription,
  QuickActionIcon,
  QuickActionsContainer,
  QuickActionText,
  QuickActionTitle,
  RightColumn,
  ScoreIndicator,
  SectionHeader,
  SectionIcon,
  SmallStatCard,
  SmallStatLabel,
  SmallStatValue,
  StatCard,
  StatContent,
  StatIcon,
  StatIconWrapper,
  StatLabel,
  StatRow,
  StatsGrid,
  StatsSmallGrid,
  StatValue,
  Subtitle,
  SuggestionActions,
  SuggestionCard,
  SuggestionContent,
  SuggestionItem,
  SuggestionReason,
  SuggestionsGrid,
  SuggestionsList,
  SuggestionTime,
  TasksContainer,
  TipCard,
  TipContent,
  TipIcon,
  TipText,
  Title,
  ViewAllButton,
} from "./Dashboard.styles";
import { SuggestedTime } from "../../types/index";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, loading, fetchTasks } = useTasks();
  const [highPriorityTasks, setHighPriorityTasks] = useState<Task[]>([]);
  const [timeSuggestions, setTimeSuggestions] = useState<{
    [category: string]: SuggestedTime[];
  }>({});

  useEffect(() => {
    fetchTasks();
    loadTimeSuggestions();
  }, [fetchTasks]);

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      return task.priority === "high" && !task.completed;
    });
    setHighPriorityTasks(filtered);
  }, [tasks]);

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const tasksCompletedToday = tasks.filter(
    (task) => task.completed && task.completedAt && isToday(task.completedAt)
  ).length;

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    highPriority: tasks.filter((t) => t.priority === "high" && !t.completed)
      .length,
    todayTasks: highPriorityTasks.length,
    completedToday: tasksCompletedToday,
  };

  const completionRate =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const loadTimeSuggestions = async () => {
    const categories = [
      "trabalho",
      "estudos",
      "saúde",
      "pessoal",
      "casa",
      "lazer",
    ];
    const suggestions: { [category: string]: SuggestedTime[] } = {};

    for (const category of categories) {
      try {
        const taskData = {
          title: `Tarefa de ${category}`,
          category,
          priority: "medium" as const,
          estimated_duration: 60,
        };
        const categorySuggestions = await suggestTime(taskData);
        suggestions[category] = categorySuggestions.slice(0, 2);
      } catch (error) {
        console.error(`Error loading suggestions for ${category}:`, error);
        suggestions[category] = [];
      }
    }

    setTimeSuggestions(suggestions);
  };

  const formatSuggestionTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      trabalho: "💼",
      estudos: "📚",
      saúde: "🏥",
      pessoal: "👤",
      casa: "🏠",
      lazer: "🎮",
    };
    return icons[category] || "📋";
  };

  const getCategoryColors = (category: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      trabalho: { bg: "#dbeafe", text: "#1d4ed8" },
      estudos: { bg: "#f3e8ff", text: "#7c3aed" },
      saúde: { bg: "#dcfce7", text: "#16a34a" },
      pessoal: { bg: "#fef3c7", text: "#d97706" },
      casa: { bg: "#fed7aa", text: "#ea580c" },
      lazer: { bg: "#fce7f3", text: "#db2777" },
    };
    return colors[category] || { bg: "#f3f4f6", text: "#374151" };
  };

  if (loading && tasks.length === 0) {
    return (
      <LoadingContainer data-testid="loading-container">
        <LoadingContent>
          <LoadingTitle />
          <LoadingGrid>
            {[1, 2, 3, 4].map((i) => (
              <LoadingCard key={i} />
            ))}
          </LoadingGrid>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  return (
    <Container data-testid="dashboard-container">
      <MaxWidthWrapper>
        <Header>
          <HeaderContent>
            <Title>Dashboard</Title>
            <Subtitle>Bem-vindo ao seu gerenciador de tarefas</Subtitle>
          </HeaderContent>

          <HeaderActions>
            <NewTaskButton onClick={() => navigate("/tasks/new")}>
              + Nova Tarefa
            </NewTaskButton>
          </HeaderActions>
        </Header>

        <MainGrid>
          <LeftColumn>
            {/* Stats Grid - Sempre primeiro */}
            <StatsGrid>
              <StatCard>
                <StatRow>
                  <StatIconWrapper $bgColor="#dbeafe">
                    <StatIcon
                      $color="#2563eb"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </StatIcon>
                  </StatIconWrapper>
                  <StatContent>
                    <StatLabel>Total de Tarefas</StatLabel>
                    <StatValue>{stats.total}</StatValue>
                  </StatContent>
                </StatRow>
              </StatCard>

              <StatCard>
                <StatRow>
                  <StatIconWrapper $bgColor="#dcfce7">
                    <StatIcon
                      $color="#16a34a"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </StatIcon>
                  </StatIconWrapper>
                  <StatContent>
                    <StatLabel>Concluídas</StatLabel>
                    <StatValue>{stats.completed}</StatValue>
                  </StatContent>
                </StatRow>
              </StatCard>

              <StatCard>
                <StatRow>
                  <StatIconWrapper $bgColor="#fef3c7">
                    <StatIcon
                      $color="#d97706"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </StatIcon>
                  </StatIconWrapper>
                  <StatContent>
                    <StatLabel>Pendentes</StatLabel>
                    <StatValue>{stats.pending}</StatValue>
                  </StatContent>
                </StatRow>
              </StatCard>

              <StatCard>
                <StatRow>
                  <StatIconWrapper $bgColor="#fee2e2">
                    <StatIcon
                      $color="#dc2626"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </StatIcon>
                  </StatIconWrapper>
                  <StatContent>
                    <StatLabel>Alta Prioridade</StatLabel>
                    <StatValue>{stats.highPriority}</StatValue>
                  </StatContent>
                </StatRow>
              </StatCard>
            </StatsGrid>

            {/* High Priority Tasks - Segundo em mobile */}
            <Card>
              <CardHeader>
                <CardTitle>Tarefas de Alta Prioridade</CardTitle>
                <ViewAllButton onClick={() => navigate("/tasks")}>
                  Ver todas →
                </ViewAllButton>
              </CardHeader>

              {highPriorityTasks.length > 0 ? (
                <TasksContainer>
                  {highPriorityTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      showActions={false}
                      clickable={true}
                      enableHoverScale={false}
                      onCardClick={() => navigate(`/task/${task.id}`)}
                    />
                  ))}
                </TasksContainer>
              ) : (
                <EmptyState>
                  <EmptyStateIcon
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </EmptyStateIcon>
                  <EmptyStateTitle>Parabéns! 🎉</EmptyStateTitle>
                  <EmptyStateText>
                    Você não tem tarefas de alta prioridade pendentes.
                  </EmptyStateText>
                  <EmptyStateText>
                    Continue assim e mantenha sua produtividade em alta!
                  </EmptyStateText>
                </EmptyState>
              )}
            </Card>

            {/* Completion Rate Chart - Terceiro em mobile - Movido para LeftColumn */}
            <Card className="mobile-only">
              <SectionHeader>
                <SectionIcon>📊</SectionIcon>
                <CardTitle>Produtividade</CardTitle>
              </SectionHeader>

              <ProductivityChart>
                <ChartContainer>
                  <CircularProgress>
                    <ProgressSvg viewBox="0 0 36 36">
                      <ProgressBackground d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <ProgressForeground
                        $dashArray={`${completionRate}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </ProgressSvg>

                    <ProgressCenter>
                      <ProgressValue>
                        <ProgressPercentage>
                          {Math.round(completionRate)}%
                        </ProgressPercentage>
                        <ProgressLabel>Completas</ProgressLabel>
                      </ProgressValue>
                    </ProgressCenter>
                  </CircularProgress>
                </ChartContainer>

                <StatsSmallGrid>
                  <SmallStatCard $bgColor="#dcfce7">
                    <SmallStatValue $color="#16a34a">
                      {stats.completed}
                    </SmallStatValue>
                    <SmallStatLabel $color="#15803d">Concluídas</SmallStatLabel>
                  </SmallStatCard>
                  <SmallStatCard $bgColor="#f3f4f6">
                    <SmallStatValue $color="#6b7280">
                      {stats.pending}
                    </SmallStatValue>
                    <SmallStatLabel $color="#6b7280">Pendentes</SmallStatLabel>
                  </SmallStatCard>
                </StatsSmallGrid>

                <ProgressBarContainer>
                  <ProgressBarHeader>
                    <span style={{ color: "#6b7280" }}>Progresso Geral</span>
                    <span style={{ fontWeight: "500", color: "#1f2937" }}>
                      {stats.completed} de {stats.total}
                    </span>
                  </ProgressBarHeader>
                  <ProgressBarTrack>
                    <ProgressBarFill $width={completionRate} />
                  </ProgressBarTrack>
                </ProgressBarContainer>
              </ProductivityChart>
            </Card>

            {/* Time Suggestions - Quarto em mobile */}
            <Card>
              <SectionHeader>
                <SectionIcon>💡</SectionIcon>
                <CardTitle>Sugestões de Horários</CardTitle>
              </SectionHeader>

              <SuggestionsGrid>
                {Object.entries(timeSuggestions).map(
                  ([category, suggestions]) => {
                    if (suggestions.length === 0) return null;

                    const colors = getCategoryColors(category);

                    return (
                      <SuggestionCard key={category}>
                        <CategoryHeader>
                          <CategoryIcon>
                            {getCategoryIcon(category)}
                          </CategoryIcon>
                          <CategoryBadge
                            $bgColor={colors.bg}
                            $textColor={colors.text}
                          >
                            {category}
                          </CategoryBadge>
                        </CategoryHeader>

                        <SuggestionsList>
                          {suggestions.map((suggestion, index) => (
                            <SuggestionItem
                              key={index}
                              onClick={() =>
                                navigate(
                                  `/tasks?view=new&category=${category}&time=${suggestion.start}`
                                )
                              }
                            >
                              <SuggestionContent>
                                <SuggestionTime>
                                  {formatSuggestionTime(suggestion.start)}
                                </SuggestionTime>
                                {suggestion.reason && (
                                  <SuggestionReason>
                                    {suggestion.reason}
                                  </SuggestionReason>
                                )}
                              </SuggestionContent>

                              <SuggestionActions>
                                <ScoreIndicator $score={suggestion.score} />
                                <svg
                                  style={{
                                    width: "0.75rem",
                                    height: "0.75rem",
                                    color: "#9ca3af",
                                  }}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </SuggestionActions>
                            </SuggestionItem>
                          ))}
                        </SuggestionsList>
                      </SuggestionCard>
                    );
                  }
                )}
              </SuggestionsGrid>

              <TipCard>
                <TipContent>
                  <TipIcon>💡</TipIcon>
                  <TipText>
                    <strong>Dica:</strong> Clique em um horário para criar uma
                    nova tarefa com esse prazo pré-definido.
                  </TipText>
                </TipContent>
              </TipCard>
            </Card>

            {/* Quick Actions - Quinto em mobile - Movido para LeftColumn */}
            <Card className="mobile-only">
              <SectionHeader>
                <SectionIcon>⚡</SectionIcon>
                <CardTitle>Ações Rápidas</CardTitle>
              </SectionHeader>

              <QuickActionsContainer>
                <QuickActionButton onClick={() => navigate("/tasks")}>
                  <QuickActionContent>
                    <QuickActionIcon>📋</QuickActionIcon>
                    <QuickActionText>
                      <QuickActionTitle>Ver Todas as Tarefas</QuickActionTitle>
                      <QuickActionDescription>
                        Gerenciar sua lista completa
                      </QuickActionDescription>
                    </QuickActionText>
                  </QuickActionContent>
                </QuickActionButton>

                <QuickActionButton onClick={() => navigate("/tasks/new")}>
                  <QuickActionContent>
                    <QuickActionIcon>➕</QuickActionIcon>
                    <QuickActionText>
                      <QuickActionTitle>Nova Tarefa</QuickActionTitle>
                      <QuickActionDescription>
                        Adicionar uma nova atividade
                      </QuickActionDescription>
                    </QuickActionText>
                  </QuickActionContent>
                </QuickActionButton>
              </QuickActionsContainer>
            </Card>
          </LeftColumn>

          {/* Sidebar - Visível apenas em desktop */}
          <RightColumn>
            {/* Completion Rate Chart - Visível apenas em desktop */}
            <Card className="desktop-only">
              <SectionHeader>
                <SectionIcon>📊</SectionIcon>
                <CardTitle>Produtividade</CardTitle>
              </SectionHeader>

              <ProductivityChart>
                <ChartContainer>
                  <CircularProgress>
                    <ProgressSvg viewBox="0 0 36 36">
                      <ProgressBackground d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <ProgressForeground
                        $dashArray={`${completionRate}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </ProgressSvg>

                    <ProgressCenter>
                      <ProgressValue>
                        <ProgressPercentage>
                          {Math.round(completionRate)}%
                        </ProgressPercentage>
                        <ProgressLabel>Completas</ProgressLabel>
                      </ProgressValue>
                    </ProgressCenter>
                  </CircularProgress>
                </ChartContainer>

                <StatsSmallGrid>
                  <SmallStatCard $bgColor="#dcfce7">
                    <SmallStatValue $color="#16a34a">
                      {stats.completed}
                    </SmallStatValue>
                    <SmallStatLabel $color="#15803d">Concluídas</SmallStatLabel>
                  </SmallStatCard>
                  <SmallStatCard $bgColor="#f3f4f6">
                    <SmallStatValue $color="#6b7280">
                      {stats.pending}
                    </SmallStatValue>
                    <SmallStatLabel $color="#6b7280">Pendentes</SmallStatLabel>
                  </SmallStatCard>
                </StatsSmallGrid>

                <ProgressBarContainer>
                  <ProgressBarHeader>
                    <span style={{ color: "#6b7280" }}>Progresso Geral</span>
                    <span style={{ fontWeight: "500", color: "#1f2937" }}>
                      {stats.completed} de {stats.total}
                    </span>
                  </ProgressBarHeader>
                  <ProgressBarTrack>
                    <ProgressBarFill $width={completionRate} />
                  </ProgressBarTrack>
                </ProgressBarContainer>
              </ProductivityChart>
            </Card>

            {/* Quick Actions - Visível apenas em desktop */}
            <Card className="desktop-only">
              <SectionHeader>
                <SectionIcon>⚡</SectionIcon>
                <CardTitle>Ações Rápidas</CardTitle>
              </SectionHeader>

              <QuickActionsContainer>
                <QuickActionButton onClick={() => navigate("/tasks")}>
                  <QuickActionContent>
                    <QuickActionIcon>📋</QuickActionIcon>
                    <QuickActionText>
                      <QuickActionTitle>Ver Todas as Tarefas</QuickActionTitle>
                      <QuickActionDescription>
                        Gerenciar sua lista completa
                      </QuickActionDescription>
                    </QuickActionText>
                  </QuickActionContent>
                </QuickActionButton>

                <QuickActionButton onClick={() => navigate("/tasks/new")}>
                  <QuickActionContent>
                    <QuickActionIcon>➕</QuickActionIcon>
                    <QuickActionText>
                      <QuickActionTitle>Nova Tarefa</QuickActionTitle>
                      <QuickActionDescription>
                        Adicionar uma nova atividade
                      </QuickActionDescription>
                    </QuickActionText>
                  </QuickActionContent>
                </QuickActionButton>
              </QuickActionsContainer>
            </Card>
          </RightColumn>
        </MainGrid>
      </MaxWidthWrapper>
    </Container>
  );
};

export default Dashboard;

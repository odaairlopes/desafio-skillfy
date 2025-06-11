"use client";

import React, { useState, useEffect } from "react";
import { suggestTime } from "../../services/api";
import {
  Container,
  Title,
  LoadingContainer,
  LoadingSkeleton,
  ErrorMessage,
  EmptyMessage,
  SuggestionsContainer,
  SuggestionButton,
  SuggestionContent,
  SuggestionHeader,
  TimeInfo,
  ScoreBadge,
  SelectedBadge,
  DurationInfo,
  ReasonText,
  IconContainer,
  CheckIcon,
  ArrowIcon,
  TipBox,
  TipText,
} from "./TimeSuggestions.styles";
import { SuggestedTime, TaskData } from "../../types/index";

interface TimeSuggestionsProps {
  taskData: TaskData;
  onTimeSelect: (time: SuggestedTime) => void;
}

export const TimeSuggestions: React.FC<TimeSuggestionsProps> = ({
  taskData,
  onTimeSelect,
}) => {
  const [suggestions, setSuggestions] = useState<SuggestedTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<SuggestedTime | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!taskData.title || !taskData.category) return;

      setLoading(true);
      setError(null);

      try {
        const suggestedTimes = await suggestTime(taskData);
        setSuggestions(suggestedTimes);
      } catch (err) {
        console.error("Error fetching time suggestions:", err);
        setError("Erro ao carregar sugestões de horário");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [taskData]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
  };

  const getScoreType = (
    score: number
  ): "excellent" | "good" | "fair" | "regular" => {
    if (score >= 0.9) return "excellent";
    if (score >= 0.8) return "good";
    if (score >= 0.7) return "fair";
    return "regular";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return "Excelente";
    if (score >= 0.8) return "Muito Bom";
    if (score >= 0.7) return "Bom";
    return "Regular";
  };

  const handleSuggestionClick = (suggestion: SuggestedTime) => {
    setSelectedSuggestion(suggestion);
    onTimeSelect(suggestion);
  };

  if (loading) {
    return (
      <Container>
        <Title>💡 Sugestões de Horário</Title>
        <LoadingContainer>
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} />
          ))}
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>💡 Sugestões de Horário</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>💡 Sugestões de Horário</Title>

      {suggestions.length === 0 ? (
        <EmptyMessage>
          Nenhuma sugestão disponível para esta tarefa.
        </EmptyMessage>
      ) : (
        <SuggestionsContainer>
          {suggestions.map((suggestion, index) => (
            <SuggestionButton
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              $isSelected={selectedSuggestion === suggestion}
            >
              <SuggestionContent>
                <div>
                  <SuggestionHeader>
                    <TimeInfo>📅 {formatTime(suggestion.start)}</TimeInfo>
                    <ScoreBadge $scoreType={getScoreType(suggestion.score)}>
                      {getScoreLabel(suggestion.score)}
                    </ScoreBadge>
                    {selectedSuggestion === suggestion && (
                      <SelectedBadge>Selecionado</SelectedBadge>
                    )}
                  </SuggestionHeader>

                  <DurationInfo>
                    ⏱️ Duração:{" "}
                    {Math.round(
                      (new Date(suggestion.end).getTime() -
                        new Date(suggestion.start).getTime()) /
                        (1000 * 60)
                    )}{" "}
                    min
                  </DurationInfo>

                  {suggestion.reason && (
                    <ReasonText>💡 {suggestion.reason}</ReasonText>
                  )}
                </div>

                <IconContainer $isSelected={selectedSuggestion === suggestion}>
                  {selectedSuggestion === suggestion ? (
                    <CheckIcon
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </CheckIcon>
                  ) : (
                    <ArrowIcon
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </ArrowIcon>
                  )}
                </IconContainer>
              </SuggestionContent>
            </SuggestionButton>
          ))}
        </SuggestionsContainer>
      )}

      <TipBox>
        <TipText>
          💡 <strong>Dica:</strong> Clique em uma sugestão para preencher
          automaticamente o prazo da tarefa.
        </TipText>
      </TipBox>
    </Container>
  );
};

export default TimeSuggestions;

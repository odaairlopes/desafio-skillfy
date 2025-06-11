import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h4`
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.fonts.sizes.md};
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const LoadingSkeleton = styled.div`
  height: 4rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

export const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
`;

export const EmptyMessage = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

export const SuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 20rem;
  overflow-y: auto;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const SuggestionButton = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? `${theme.colors.primary}10` : theme.colors.surface};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  text-align: left;

  &:hover {
    background-color: ${({ theme, $isSelected }) =>
      $isSelected ? `${theme.colors.primary}15` : theme.colors.background};
    border-color: ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary : theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }
`;

export const SuggestionContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const SuggestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

export const TimeInfo = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

export const ScoreBadge = styled.span<{
  $scoreType: "excellent" | "good" | "fair" | "regular";
}>`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  padding: 2px ${({ theme }) => theme.spacing.xs};
  border-radius: 9999px;
  font-weight: ${({ theme }) => theme.fonts.weights.medium};

  ${({ theme, $scoreType }) => {
    switch ($scoreType) {
      case "excellent":
        return `
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case "good":
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case "fair":
        return `
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      case "regular":
        return `
          background-color: ${theme.colors.textSecondary}20;
          color: ${theme.colors.textSecondary};
        `;
      default:
        return `
          background-color: ${theme.colors.textSecondary}20;
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;

export const SelectedBadge = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  padding: 2px ${({ theme }) => theme.spacing.xs};
  border-radius: 9999px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
`;

export const DurationInfo = styled.div`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const ReasonText = styled.div`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  line-height: 1.4;
`;

export const IconContainer = styled.div<{ $isSelected: boolean }>`
  margin-left: ${({ theme }) => theme.spacing.sm};
  transition: ${({ theme }) => theme.transitions.default};
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary : theme.colors.textSecondary};
  flex-shrink: 0;
`;

export const CheckIcon = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
`;

export const ArrowIcon = styled.svg`
  width: 1rem;
  height: 1rem;
`;

export const TipBox = styled.div`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primary}10;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
`;

export const TipText = styled.span`
  line-height: 1.4;

  strong {
    font-weight: ${({ theme }) => theme.fonts.weights.medium};
    color: ${({ theme }) => theme.colors.text};
  }
`;

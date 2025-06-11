import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.sm};
  transition: colors 0.3s;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xs};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const MaxWidthWrapper = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    gap: 0;
  }
`;

export const HeaderContent = styled.div`
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: auto;
  }
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fonts.sizes.lg};
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  justify-content: space-between;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: auto;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const NewTaskButton = styled.button`
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  flex: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: none;
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }

  &:hover {
    transform: scale(1.05);
  }
`;

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  order: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 1;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

export const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const StatRow = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    text-align: left;
    gap: 0;
  }
`;

export const StatIconWrapper = styled.div<{ $bgColor: string }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ $bgColor }) => $bgColor};
  width: fit-content;
  margin: 0 auto;
  display: flex;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0;
  }
`;

export const StatIcon = styled.svg<{ $color: string }>`
  width: 1.25rem;
  height: 1.25rem;
  color: ${({ $color }) => $color};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const StatContent = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-left: ${({ theme }) => theme.spacing.md};
  }
`;

export const StatLabel = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
  }
`;

export const StatValue = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.lg};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    gap: 0;
  }
`;

export const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.sizes.md};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
  }
`;

export const ViewAllButton = styled.button`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
  }

  &:hover {
    text-decoration: underline;
  }
`;

export const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 20rem;
  overflow-y: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.md};
    max-height: 24rem;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} 0;
  }
`;

export const EmptyStateIcon = styled.svg`
  width: 2.5rem;
  height: 2.5rem;
  color: ${({ theme }) => theme.colors.success};
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  display: block;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 3rem;
    height: 3rem;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.sizes.md};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }
`;

export const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const SuggestionCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.surface};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

export const CategoryIcon = styled.span`
  font-size: 1.125rem;
`;

export const CategoryBadge = styled.span<{
  $bgColor: string;
  $textColor: string;
}>`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};
`;

export const SuggestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background || "#DBDDDF"};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
    padding: ${({ theme }) => theme.spacing.sm};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
    transform: scale(1.02);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const SuggestionContent = styled.div`
  flex: 1;
`;

export const SuggestionTime = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export const SuggestionReason = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SuggestionActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
`;

export const ScoreIndicator = styled.div<{ $score: number }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${({ $score }) =>
    $score >= 0.9
      ? "#10b981"
      : $score >= 0.8
      ? "#3b82f6"
      : $score >= 0.7
      ? "#f59e0b"
      : "#9ca3af"};
`;

export const TipCard = styled.div`
  margin-top: 1.5rem;
  padding: 0.75rem;
  background-color: #eff6ff;
  border-radius: 0.5rem;
`;

export const TipContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const TipIcon = styled.span`
  color: #3b82f6;
  font-size: 0.875rem;
`;

export const TipText = styled.div`
  font-size: 0.75rem;
  color: #1d4ed8;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  order: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 2;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

export const ProductivityChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

export const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CircularProgress = styled.div`
  position: relative;
  width: 6rem;
  height: 6rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 8rem;
    height: 8rem;
  }
`;

export const ProgressSvg = styled.svg`
  width: 6rem;
  height: 6rem;
  transform: rotate(-90deg);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 8rem;
    height: 8rem;
  }
`;

export const ProgressBackground = styled.path`
  stroke: #e5e7eb;
  stroke-width: 3;
  fill: none;
`;

export const ProgressForeground = styled.path<{ $dashArray: string }>`
  stroke: #10b981;
  stroke-width: 3;
  stroke-dasharray: ${({ $dashArray }) => $dashArray};
  stroke-linecap: round;
  fill: none;
`;

export const ProgressCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProgressValue = styled.div`
  text-align: center;
`;

export const ProgressPercentage = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #10b981;
`;

export const ProgressLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

export const StatsSmallGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const SmallStatCard = styled.div<{ $bgColor: string }>`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const SmallStatValue = styled.p<{ $color: string }>`
  font-size: ${({ theme }) => theme.fonts.sizes.md};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ $color }) => $color};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
  }
`;

export const SmallStatLabel = styled.p<{ $color: string }>`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ $color }) => $color};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
  }
`;

export const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ProgressBarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
`;

export const ProgressBarTrack = styled.div`
  width: 100%;
  background-color: #e5e7eb;
  border-radius: 9999px;
  height: 0.75rem;
`;

export const ProgressBarFill = styled.div<{ $width: number }>`
  background-color: #10b981;
  height: 0.75rem;
  border-radius: 9999px;
  transition: all 0.5s;
  width: ${({ $width }) => $width}%;
`;

export const QuickActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const QuickActionButton = styled.button`
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
    transform: scale(1.02);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const QuickActionContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const QuickActionIcon = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
  }
`;

export const QuickActionText = styled.div``;

export const QuickActionTitle = styled.div`
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }
`;

export const QuickActionDescription = styled.div`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
  }
`;

export const LoadingContainer = styled.div`
  min-height: 100vh;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LoadingContent = styled.div`
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

export const LoadingTitle = styled.div`
  height: 2rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  margin-bottom: 1.5rem;
  width: 16rem;
`;

export const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
    gap: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

export const LoadingCard = styled.div`
  height: 6rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const SectionIcon = styled.span`
  font-size: 1.5rem;
`;

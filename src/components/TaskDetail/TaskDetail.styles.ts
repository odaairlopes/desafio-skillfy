import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const ContentWrapper = styled.div`
  max-width: 112rem;
  margin: 0 auto;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }

  &:hover {
    text-decoration: underline;
  }
`;

export const BackIcon = styled.svg`
  width: 0.875rem;
  height: 0.875rem;
  margin-right: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 1rem;
    height: 1rem;
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`;

export const HeaderCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => theme.spacing.xl};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    gap: 0;
  }
`;

export const Title = styled.h1<{ $completed: boolean }>`
  font-size: ${({ theme }) => theme.fonts.sizes.lg};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme, $completed }) =>
    $completed ? theme.colors.textSecondary : theme.colors.text};
  text-decoration: ${({ $completed }) =>
    $completed ? "line-through" : "none"};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

export const CategoryBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  text-transform: capitalize;
`;

export const CompletedBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.success}20;
  color: ${({ theme }) => theme.colors.success};
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
`;

export const OverdueBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.error}20;
  color: ${({ theme }) => theme.colors.error};
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const ActionButton = styled.button<{
  $variant: "primary" | "success" | "danger" | "secondary";
}>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  border: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: auto;
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
  }

  ${({ theme, $variant }) => {
    switch ($variant) {
      case "primary":
        return `
          background-color: ${theme.colors.primary};
          color: white;
          &:hover { opacity: 0.9; transform: translateY(-1px); }
        `;
      case "success":
        return `
          background-color: ${theme.colors.success};
          color: white;
          &:hover { opacity: 0.9; transform: translateY(-1px); }
        `;
      case "danger":
        return `
          background-color: ${theme.colors.error};
          color: white;
          &:hover { opacity: 0.9; transform: translateY(-1px); }
        `;
      case "secondary":
        return `
          background-color: ${theme.colors.secondary};
          color: white;
          &:hover { opacity: 0.9; transform: translateY(-1px); }
        `;
      default:
        return `
          background-color: ${theme.colors.primary};
          color: white;
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
`;

export const CompletedIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.success}20;
  color: ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  order: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 1;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  order: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 2;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

export const DescriptionCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const InfoCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.sizes.md};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

export const Description = styled.p<{ $empty?: boolean }>`
  color: ${({ theme, $empty }) =>
    $empty ? theme.colors.textSecondary : theme.colors.text};
  white-space: pre-wrap;
  line-height: 1.6;
  margin: 0;
  font-style: ${({ $empty }) => ($empty ? "italic" : "normal")};
`;

export const InfoItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const InfoLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const InfoValue = styled.p<{
  $isOverdue?: boolean;
  $completed?: boolean;
}>`
  color: ${({ theme, $isOverdue, $completed }) => {
    if ($completed) return theme.colors.success;
    if ($isOverdue) return theme.colors.error;
    return theme.colors.text;
  }};
  font-weight: ${({ theme, $isOverdue, $completed }) =>
    $isOverdue || $completed
      ? theme.fonts.weights.medium
      : theme.fonts.weights.regular};
  text-transform: capitalize;
  margin: 0;
`;

export const ProgressCard = styled(InfoCard)``;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  span:first-child {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  span:last-child {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 9999px;
  height: 0.5rem;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $completed: boolean }>`
  height: 100%;
  border-radius: 9999px;
  transition: all 0.5s ease;
  width: ${({ $completed }) => ($completed ? "100%" : "0%")};
  background-color: ${({ theme, $completed }) =>
    $completed ? theme.colors.success : theme.colors.background};
`;

export const ProgressText = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

// Offline Alert Styles
export const OfflineAlert = styled.div`
  background-color: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const OfflineTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.sizes.lg};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

export const OfflineDescription = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

export const OfflineList = styled.ul`
  list-style-type: disc;
  list-style-position: inside;
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 0;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

export const OfflineListItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  code {
    background-color: ${({ theme }) => theme.colors.error}20;
    padding: ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

export const RetryButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    opacity: 0.9;
  }
`;

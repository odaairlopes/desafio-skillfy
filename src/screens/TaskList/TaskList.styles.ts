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

export const MaxWidthWrapper = styled.div`
  max-width: 112rem;
  margin: 0 auto;
`;

export const LoadingContainer = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 3fr;
  }
`;

export const LoadingSkeleton = styled.div`
  height: 8rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const LoadingTitle = styled.div`
  height: 2rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  width: 16rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: ${({ theme }) => theme.transitions.default};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  &:hover {
    text-decoration: underline;
  }
`;

export const BackIcon = styled.svg`
  width: 1rem;
  height: 1rem;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const HeaderInfo = styled.div`
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: auto;
  }
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fonts.sizes.lg};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const TaskCount = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }
`;

export const NewTaskButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  border: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  width: 100%;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: auto;
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }

  &:hover {
    transform: scale(1.05);
  }
`;

export const ErrorContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
`;

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 300px 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: 350px 1fr;
  }
`;

export const Sidebar = styled.div`
  grid-column: span 1;
  order: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 1;
  }
`;

export const FiltersCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.xl};
    position: sticky;
    top: ${({ theme }) => theme.spacing.xl};
    margin-bottom: 0;
  }
`;

export const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const FiltersTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.sizes.lg};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const ClearFiltersButton = styled.button`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: none;
  border: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const FilterGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FilterLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transitions.default};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const FilterGroupTitle = styled.h4`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const RadioInput = styled.input`
  accent-color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing.sm};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const RadioText = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  color: ${({ theme }) => theme.colors.text};
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const CheckboxInput = styled.input`
  accent-color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing.sm};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const MainContent = styled.div`
  grid-column: span 1;
  order: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 2;
  }
`;

export const SortCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

export const SortContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    gap: 0;
  }
`;

export const SortLabel = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

export const SortSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: auto;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

export const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const EmptyState = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

export const EmptyIcon = styled.svg`
  width: 4rem;
  height: 4rem;
  color: ${({ theme }) => theme.colors.border};
  margin: 0 auto ${({ theme }) => theme.spacing.md};
`;

export const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.sizes.lg};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

export const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

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

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

export const LoadingSkeleton = styled.div`
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

export const ErrorContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.fonts.sizes.md};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }
`;

export const NotFoundContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.textSecondary}10;
  border: 1px solid ${({ theme }) => theme.colors.textSecondary}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const NotFoundTitle = styled.h1`
  font-size: ${({ theme }) => theme.fonts.sizes.md};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const NotFoundMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }
`;

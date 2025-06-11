import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const ModalContainer = styled.div`
  position: fixed;
  inset: 0;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.3);
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
`;

export const ModalContent = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 28rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 51;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const WarningIcon = styled.svg`
  width: 3rem;
  height: 3rem;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.error}20;
  color: ${({ theme }) => theme.colors.error};
  border-radius: 50%;
`;

export const TextContainer = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Title = styled.h3`
  font-size: ${({ theme }) => theme.fonts.sizes.lg};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

export const Description = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin: 0;
`;

export const TaskName = styled.span`
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CancelButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const DeleteButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.error}dd;
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.error};
  }
  &:active {
    transform: translateY(1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

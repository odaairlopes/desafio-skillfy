import styled, { css, keyframes } from "styled-components";

export const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

export const ToastContainer = styled.div<{
  $isVisible: boolean;
  $type: string;
}>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: ${(props) => (props.$isVisible ? slideIn : slideOut)} 0.3s
    ease-in-out forwards;

  ${(props) => {
    switch (props.$type) {
      case "success":
        return css`
          background-color: #10b981;
          color: white;
        `;
      case "error":
        return css`
          background-color: #ef4444;
          color: white;
        `;
      case "info":
        return css`
          background-color: #3b82f6;
          color: white;
        `;
      default:
        return css`
          background-color: #6b7280;
          color: white;
        `;
    }
  }}
`;

export const ToastMessage = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

export const CloseButton = styled.button`
  margin-left: 0.5rem;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;

  &:hover {
    opacity: 0.75;
  }
`;

export const IconContainer = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
`;

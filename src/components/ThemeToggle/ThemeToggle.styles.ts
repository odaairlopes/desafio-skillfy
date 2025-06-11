import styled from "styled-components";

interface StyledButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const StyledButton = styled.button<StyledButtonProps>`
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  overflow: hidden;
  padding: 0.5rem;
  position: relative;
  width: 70px;
  height: 34px;
  transition: all ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledSpan = styled.span<{
  $isActive: boolean;
  children?: React.ReactNode;
}>`
  position: absolute;
  top: 1px;
  left: ${({ $isActive }) => ($isActive ? "37px" : "1px")};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  transition: all ${({ theme }) => theme.transitions.default};

  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`;

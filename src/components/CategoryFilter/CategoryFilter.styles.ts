import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h3`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const SelectAllButton = styled.button`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

export const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CategoryItem = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    opacity: 0.8;
  }
`;

export const CategoryCheckbox = styled.input`
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  margin-right: ${({ theme }) => theme.spacing.sm};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const CategoryLabel = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CategoryIcon = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.md};
`;

export const CategoryName = styled.span`
  text-transform: capitalize;
`;

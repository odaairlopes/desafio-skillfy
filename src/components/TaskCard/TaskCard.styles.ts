import styled, { css } from "styled-components";

interface CardContainerProps {
  $clickable?: boolean;
  $enableHoverScale?: boolean;
  $completed?: boolean;
}

interface CategoryBadgeProps {
  $category: string;
}

interface TitleProps {
  $completed?: boolean;
}

interface DateProps {
  $isOverdue?: boolean;
}

export const CardContainer = styled.div<CardContainerProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm};
  opacity: ${(props) => (props.$completed ? 0.75 : 1)};
  transition: ${({ theme }) => theme.transitions.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  ${(props) =>
    props.$clickable &&
    css`
      cursor: pointer;

      &:focus {
        outline: 2px solid ${({ theme }) => theme.colors.primary};
        outline-offset: 2px;
      }

      ${props.$enableHoverScale
        ? css`
            &:hover {
              transform: scale(1.02);
              box-shadow: ${({ theme }) => theme.shadows.lg};
            }

            @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
              &:hover {
                transform: none;
                box-shadow: ${({ theme }) => theme.shadows.md};
              }
            }
          `
        : css`
            &:hover {
              box-shadow: ${({ theme }) => theme.shadows.md};
            }
          `}

      &:active {
        transform: scale(0.98);
      }
    `}
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

export const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: auto;
  }
`;

export const Title = styled.h3<TitleProps>`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  color: ${({ theme, $completed }) =>
    $completed ? theme.colors.textSecondary : theme.colors.text};
  text-decoration: ${(props) => (props.$completed ? "line-through" : "none")};
  line-height: 1.4;
  word-wrap: break-word;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.md};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const Description = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
    -webkit-line-clamp: 3;
  }
`;

export const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const CategoryIcon = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  line-height: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }
`;

export const CategoryBadge = styled.span<CategoryBadgeProps>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  text-transform: capitalize;
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
  }

  ${({ theme, $category }) => {
    const categoryColors = {
      trabalho: `
        background-color: ${theme.colors.primary}20;
        color: ${theme.colors.primary};
      `,
      estudos: `
        background-color: ${theme.colors.secondary}20;
        color: ${theme.colors.secondary};
      `,
      saúde: `
        background-color: ${theme.colors.success}20;
        color: ${theme.colors.success};
      `,
      pessoal: `
        background-color: ${theme.colors.warning}20;
        color: ${theme.colors.warning};
      `,
      casa: `
        background-color: ${theme.colors.warning}20;
        color: ${theme.colors.warning};
      `,
      lazer: `
        background-color: ${theme.colors.error}20;
        color: ${theme.colors.error};
      `,
      financeiro: `
        background-color: ${theme.colors.textSecondary}20;
        color: ${theme.colors.textSecondary};
      `,
    };
    return (
      categoryColors[$category as keyof typeof categoryColors] ||
      `background-color: ${theme.colors.textSecondary}20; color: ${theme.colors.textSecondary};`
    );
  }}
`;

export const CompletedBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.success}20;
  color: ${({ theme }) => theme.colors.success};
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
  }
`;

export const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-wrap: wrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
    gap: ${({ theme }) => theme.spacing.md};
  }

  > span {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    white-space: nowrap;
  }
`;

export const DateSpan = styled.span<DateProps>`
  color: ${({ theme, $isOverdue }) =>
    $isOverdue ? theme.colors.error : theme.colors.textSecondary};
  font-weight: ${({ theme, $isOverdue }) =>
    $isOverdue ? theme.fonts.weights.medium : theme.fonts.weights.regular};
`;

export const SuggestedTime = styled.div`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.primary}10;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary}20;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

export const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.sm};
    flex-wrap: nowrap;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: ${({ theme }) => theme.spacing.md};
  }
`;

export const ActionButton = styled.button<{
  $variant: "complete" | "edit" | "delete";
}>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  color: white;
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  flex: 1;
  min-width: fit-content;
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: none;
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
    padding: ${({ theme }) => theme.spacing.sm};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.surface};
    outline-offset: 2px;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:active {
    transform: translateY(0);
  }

  ${({ theme, $variant }) => {
    switch ($variant) {
      case "complete":
        return css`
          background-color: ${theme.colors.success};
          &:hover {
            background-color: ${theme.colors.success}dd;
          }
        `;
      case "edit":
        return css`
          background-color: ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary}dd;
          }
        `;
      case "delete":
        return css`
          background-color: ${theme.colors.error};
          &:hover {
            background-color: ${theme.colors.error}dd;
          }
        `;
      default:
        return "";
    }
  }}
`;

export const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

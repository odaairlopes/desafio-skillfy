import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const MaxWidthWrapper = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fonts.sizes.xl};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

export const ErrorContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

export const FormSection = styled.div`
  grid-column: span 1;
  order: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 1;
  }
`;

export const SidebarSection = styled.div`
  grid-column: span 1;
  order: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 2;
  }
`;

export const FormContainer = styled.form`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transitions.default};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${({ theme, $hasError }) =>
        $hasError ? `${theme.colors.error}20` : `${theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transitions.default};
  resize: vertical;
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

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const CategoryButton = styled.button<{
  $isSelected: boolean;
  $category: string;
}>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  background: none;

  ${({ theme, $isSelected, $category }) => {
    if ($isSelected) {
      const categoryColors = {
        trabalho: `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
        `,
        estudos: `
          background-color: ${theme.colors.secondary}20;
          color: ${theme.colors.secondary};
          border-color: ${theme.colors.secondary};
        `,
        saúde: `
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
          border-color: ${theme.colors.success};
        `,
        pessoal: `
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
          border-color: ${theme.colors.warning};
        `,
        casa: `
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
          border-color: ${theme.colors.warning};
        `,
        lazer: `
          background-color: ${theme.colors.error}20;
          color: ${theme.colors.error};
          border-color: ${theme.colors.error};
        `,
        financeiro: `
          background-color: ${theme.colors.textSecondary}20;
          color: ${theme.colors.textSecondary};
          border-color: ${theme.colors.textSecondary};
        `,
      };
      return (
        categoryColors[$category as keyof typeof categoryColors] ||
        categoryColors.financeiro
      );
    } else {
      return `
        background-color: ${theme.colors.surface};
        border-color: ${theme.colors.border};
        color: ${theme.colors.text};
        
        &:hover {
          background-color: ${theme.colors.background};
        }
      `;
    }
  }}

  &:hover {
    transform: scale(1.02);
  }
`;

export const CategoryButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CategoryIcon = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.md};
`;

export const CategoryName = styled.span`
  text-transform: capitalize;
`;

export const GridTwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }
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

export const ValidationErrorsContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const ValidationErrorTitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

export const ValidationErrorList = styled.ul`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  color: ${({ theme }) => theme.colors.error};
  list-style-type: disc;
  list-style-position: inside;
  margin: 0;
  padding: 0;
`;

export const ValidationErrorItem = styled.li``;

export const FormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

export const SuggestButton = styled.button`
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
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

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    width: auto;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  border: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  flex: 1;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: none;
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  flex: 1;
  font-size: ${({ theme }) => theme.fonts.sizes.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: none;
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    transform: scale(1.05);
  }
`;

export const PreviewCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.xl};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

export const PreviewTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.sizes.md};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

export const PreviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const PreviewItem = styled.div``;

export const PreviewLabel = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const PreviewValue = styled.p`
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

export const PreviewValueSmall = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

export const PriorityContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const ErrorMessage = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 0;
`;

export const HelpText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0;
`;

export const RequiredAsterisk = styled.span`
  color: ${({ theme }) => theme.colors.error};
`;

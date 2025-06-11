import styled from "styled-components";

export const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 40;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
    flex-wrap: nowrap;
    gap: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const Main = styled.main`
  flex: 1;
  padding: 0;
  min-height: calc(100vh - 70px);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: calc(100vh - 80px);
  }
`;

export const ThemeToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  order: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    order: 0;
  }
`;

export const NavigationWrapper = styled.div`
  flex: 1;
  order: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: none;
    order: 0;
  }
`;

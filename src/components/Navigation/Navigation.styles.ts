import styled from "styled-components";

export const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.xl};
    width: auto;
  }
`;

export const Logo = styled.div`
  font-size: ${({ theme }) => theme.fonts.sizes.md};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  user-select: none;
  transition: ${({ theme }) => theme.transitions.default};
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
  }

  &:hover {
    opacity: 0.8;
  }
`;

export const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.md};
    overflow-x: visible;
  }
`;

export const NavItem = styled.li`
  display: flex;
  flex-shrink: 0;
`;

export const NavLink = styled.a<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.text};
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary + "15" : "transparent"};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme, $isActive }) =>
    $isActive ? theme.fonts.weights.medium : theme.fonts.weights.regular};
  transition: ${({ theme }) => theme.transitions.default};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fonts.sizes.md};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary + "20"};
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    text-decoration: none;
  }

  &:visited {
    text-decoration: none;
  }

  span {
    font-size: inherit;
  }

  /* Hide text on very small screens, keep only icons */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    span:not(.icon) {
      display: none;
    }
  }
`;

export const NavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  font-size: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 1.125rem;
  }
`;

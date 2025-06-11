import React, { ReactNode } from "react";
import { useLocation } from "react-router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Navigation from "../Navigation/Navigation";
import {
  LayoutContainer,
  Header,
  Main,
  ThemeToggleWrapper,
  NavigationWrapper,
} from "./Layout.styles";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <LayoutContainer>
      <Header>
        <NavigationWrapper>
          <Navigation currentPath={location.pathname} />
        </NavigationWrapper>
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      </Header>
      <Main>{children}</Main>
    </LayoutContainer>
  );
};

export default Layout;

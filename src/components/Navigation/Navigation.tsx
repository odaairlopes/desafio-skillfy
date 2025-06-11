import React from "react";
import { useNavigate } from "react-router";
import {
  NavContainer,
  Logo,
  NavList,
  NavItem,
  NavLink,
  NavIcon,
} from "./Navigation.styles";

interface NavigationProps {
  currentPath: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPath }) => {
  const navigate = useNavigate();

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: "📊",
    },
    {
      path: "/tasks",
      label: "Tarefas",
      icon: "📋",
    },
  ];

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <NavContainer>
      <Logo onClick={handleLogoClick} role="button" tabIndex={0}>
        TaskManager
      </Logo>

      <NavList>
        {navItems.map((item) => (
          <NavItem key={item.path}>
            <NavLink
              href={item.path}
              $isActive={currentPath === item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              role="navigation"
              aria-label={`Navegar para ${item.label}`}
            >
              <NavIcon className="icon" aria-hidden="true">
                {item.icon}
              </NavIcon>
              <span>{item.label}</span>
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

export default Navigation;

import React from "react";
import { StyledButton, StyledSpan } from "./ThemeToggle.styles";
import { LuSun } from "react-icons/lu";
import { LuMoon } from "react-icons/lu";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === "dark";
  const Icon = isDark ? LuMoon : LuSun;

  return (
    <StyledButton
      className={className}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      data-testid="theme-toggle"
    >
      <StyledSpan $isActive={isDark}>
        <Icon data-testid={`${isDark ? "moon" : "sun"}-icon`} />
      </StyledSpan>
    </StyledButton>
  );
};

export default ThemeToggle;

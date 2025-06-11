import styled from "styled-components";

interface BadgeStyleProps {
  $priority: "low" | "medium" | "high";
  $size: "sm" | "md" | "lg";
}

export const Badge = styled.span<BadgeStyleProps>`
  display: inline-flex;
  align-items: center;
  font-weight: ${({ theme }) => (theme as any).fonts?.weights?.medium || 500};
  border-radius: 9999px;
  transition: ${({ theme }) =>
    (theme as any).transitions?.default || "all 0.2s ease-in-out"};

  ${({ $size, theme }) => {
    const themeTyped = theme as any;
    switch ($size) {
      case "sm":
        return `
          padding: 4px 8px;
          font-size: ${themeTyped.fonts?.sizes?.xs || "0.75rem"};
        `;
      case "md":
        return `
          padding: 4px 12px;
          font-size: ${themeTyped.fonts?.sizes?.sm || "0.875rem"};
        `;
      case "lg":
        return `
          padding: 8px 16px;
          font-size: ${themeTyped.fonts?.sizes?.md || "1rem"};
        `;
      default:
        return `
          padding: 4px 12px;
          font-size: ${themeTyped.fonts?.sizes?.sm || "0.875rem"};
        `;
    }
  }}

  ${({ $priority, theme }) => {
    const themeTyped = theme as any;
    switch ($priority) {
      case "high":
        return `
          background-color: ${themeTyped.colors?.error || "#dc3545"}20;
          color: ${themeTyped.colors?.error || "#dc3545"};
          border: 1px solid ${themeTyped.colors?.error || "#dc3545"}40;
        `;
      case "medium":
        return `
          background-color: ${themeTyped.colors?.warning || "#ffc107"}20;
          color: ${themeTyped.colors?.warning || "#ffc107"};
          border: 1px solid ${themeTyped.colors?.warning || "#ffc107"}40;
        `;
      case "low":
        return `
          background-color: ${themeTyped.colors?.success || "#28a745"}20;
          color: ${themeTyped.colors?.success || "#28a745"};
          border: 1px solid ${themeTyped.colors?.success || "#28a745"}40;
        `;
      default:
        return `
          background-color: ${themeTyped.colors?.warning || "#ffc107"}20;
          color: ${themeTyped.colors?.warning || "#ffc107"};
          border: 1px solid ${themeTyped.colors?.warning || "#ffc107"}40;
        `;
    }
  }}

  &:hover {
    opacity: 0.8;
  }
`;

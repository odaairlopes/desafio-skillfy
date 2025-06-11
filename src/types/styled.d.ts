import "styled-components";
import { lightTheme } from "../styles/theme";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: typeof lightTheme.colors;
    spacing: typeof lightTheme.spacing;
    fonts: typeof lightTheme.fonts;
    fontSizes: typeof lightTheme.fontSizes;
    fontWeights: typeof lightTheme.fontWeights;
    lineHeights: typeof lightTheme.lineHeights;
    borderRadius: typeof lightTheme.borderRadius;
    shadows: typeof lightTheme.shadows;
    transitions: typeof lightTheme.transitions;
    breakpoints: typeof lightTheme.breakpoints;
    zIndex: typeof lightTheme.zIndex;
  }
}

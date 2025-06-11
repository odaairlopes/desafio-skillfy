import { createGlobalStyle } from "styled-components";
import type { DefaultTheme } from "styled-components";

export const GlobalStyles = createGlobalStyle<{ theme: DefaultTheme }>`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.fonts.family};
    font-size: ${({ theme }) => theme.fonts.sizes.md};
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    transition: background-color ${({ theme }) => theme.transitions.default}, 
                color ${({ theme }) => theme.transitions.default};
    overflow-x: hidden;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    font-weight: ${({ theme }) => theme.fonts.weights.bold};
    color: ${({ theme }) => theme.colors.text};
  }
  
  h1 {
    font-size: ${({ theme }) => theme.fonts.sizes.xl};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.fonts.sizes.lg};
    }
  }
  
  button, input, select, textarea {
    font-family: inherit;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  /* Responsive utilities */
  .mobile-only {
    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      display: none !important;
    }
  }

  .desktop-only {
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      display: none !important;
    }
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      padding: 0 ${({ theme }) => theme.spacing.sm};
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Lazy loading skeleton styles */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease-in-out infinite;
  }

  @keyframes skeleton-loading {
    0% { background-position: 100% 50%; }
    100% { background-position: 0 50%; }
  }
  
`;

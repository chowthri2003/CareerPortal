export type ThemeName = "light" | "dark"| "Pink"| "Blue"| "Green"| "Slate";

export type ThemeColors = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  primaryHover: string;
  primaryBorder: string;
  primaryLight: string;
  primaryDark: string;
  primaryDisabled: string;
  primaryDisabledText: string;
};

export type Theme = {
  name: string;
  colors: ThemeColors;
};

export const themes: Theme[] = [
  {
    name: 'light',
    colors: {
      background: '#ffffff',
      text: '#0f172a',
      primary: '#f1f5f9',
      secondary: '#e2e8f0',
      accent: '#2563eb',
      primaryHover: '#cbd5e1',
      primaryBorder: '#94a3b8',
      primaryLight: '#f8fafc',
      primaryDark: '#0f172a',
      primaryDisabled: '#e2e8f0',
      primaryDisabledText: '#0f172a',
    },
  },
  {
    name: 'dark',
    colors: {
      background: '#1a1a1a',
      text: '#ffffff',
      primary: '#1e293b',
      secondary: '#0f172a',
      accent: '#6366f1',
      primaryHover: '#334155',
      primaryBorder: '#334155',
      primaryLight: '#475569',
      primaryDark: '#0f172a',
      primaryDisabled: '#1e293b',
      primaryDisabledText: '#ffffff',
    },
  },
  {
    name: 'Blue',
    colors: {
      background: '#f0f9ff',
      text: '#0c4a6e',
      primary: '#e0f2fe',
      secondary: '#bae6fd',
      accent: '#0284c7',
      primaryHover: '#7dd3fc',
      primaryBorder: '#38bdf8',
      primaryLight: '#f0f9ff',
      primaryDark: '#0c4a6e',
      primaryDisabled: '#e0f2fe',
      primaryDisabledText: '#0c4a6e',
    },
  },
  {
    name: 'Slate',
    colors: {
      background: '#f8fafc',
      text: '#0f172a',
      primary: '#f1f5f9',
      secondary: '#e2e8f0',
      accent: '#475569',
      primaryHover: '#cbd5e1',
      primaryBorder: '#94a3b8',
      primaryLight: '#f8fafc',
      primaryDark: '#0f172a',
      primaryDisabled: '#f1f5f9',
      primaryDisabledText: '#0f172a',
    },
  },
];

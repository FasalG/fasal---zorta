export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface Theme {
  name: string;
  mode: ThemeMode;
  colors: ThemeColors;
}

export interface ThemeConfig {
  defaultTheme: ThemeMode;
  themes: {
    light: Theme;
    dark: Theme;
  };
}

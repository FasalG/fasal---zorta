







import { Injectable, signal, effect, inject, PLATFORM_ID, Inject, DOCUMENT } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Theme, ThemeMode, ThemeConfig } from '../modals/theme.model';

const DEFAULT_THEME_CONFIG: ThemeConfig = {
  defaultTheme: 'light',
  themes: {
    light: {
      name: 'Light',
      mode: 'light',
      colors: {
        primary: '#3f51b5',
        secondary: '#ff4081',
        accent: '#82b1ff',
        background: '#ffffff',
        surface: '#f5f5f5',
        text: '#212121',
        error: '#f44336',
        warning: '#ff9800',
        success: '#4caf50',
        info: '#2196f3'
      }
    },
    dark: {
      name: 'Dark',
      mode: 'dark',
      colors: {
        primary: '#bb86fc',
        secondary: '#03dac6',
        accent: '#3700b3',
        background: '#121212',
        surface: '#1e1e1e',
        text: '#e1e1e1',
        error: '#cf6679',
        warning: '#ffb74d',
        success: '#81c784',
        info: '#64b5f6'
      }
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = signal<Theme>(DEFAULT_THEME_CONFIG.themes.light);
  private themeMode = signal<ThemeMode>('light');
  private platformId = inject(PLATFORM_ID);

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initializeTheme();

    // Auto-apply theme changes to DOM
    effect(() => {
      this.applyThemeToDOM(this.currentTheme());
    });
  }

  private initializeTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme-mode') as ThemeMode | null;
      const preferredTheme = savedTheme || this.getSystemPreference();
      this.setTheme(preferredTheme);
    }
  }

  private getSystemPreference(): ThemeMode {
    if (isPlatformBrowser(this.platformId)) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  }

  setTheme(mode: ThemeMode): void {
    if (mode === 'auto') {
      mode = this.getSystemPreference();
    }
    this.themeMode.set(mode);
    const theme = DEFAULT_THEME_CONFIG.themes[mode as 'light' | 'dark'];
    this.currentTheme.set(theme);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme-mode', mode);
    }
  }

  toggleTheme(): void {
    const newMode = this.themeMode() === 'light' ? 'dark' : 'light';
    this.setTheme(newMode);
  }

  getTheme(): Theme {
    return this.currentTheme();
  }

  getThemeMode(): ThemeMode {
    return this.themeMode();
  }

  private applyThemeToDOM(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${this.camelToKebab(key)}`, value);
      });
      root.setAttribute('data-theme', theme.mode);
    }
  }


  private camelToKebab(str: string): string {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  }

  getCustomTheme(colors: Partial<typeof DEFAULT_THEME_CONFIG.themes.light.colors>): Theme {
    return {
      name: 'Custom',
      mode: this.themeMode(),
      colors: {
        ...this.currentTheme().colors,
        ...colors
      }
    };
  }






    setDensity(mode: 'comfortable' | 'compact') {
    if (mode === 'compact') {
      this.document.body.classList.add('compact-mode');
    } else {
      this.document.body.classList.remove('compact-mode');
    }
  }

  setPrimaryColor(color: string) {
    // Dynamically update the primary color for the whole app
    this.document.documentElement.style.setProperty('--primary', color);
  }
}

import { darkTheme, lightTheme, type ThemeColors } from './themes';

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: 'light' | 'dark' = 'light';
  private themes: Record<string, ThemeColors> = {
    light: lightTheme,
    dark: darkTheme
  };

  private constructor() {}

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  setTheme(isDark: boolean) {
    this.currentTheme = isDark ? 'dark' : 'light';
    const theme = this.themes[this.currentTheme];
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  // 添加自定义主题
  addTheme(name: string, theme: ThemeColors) {
    this.themes[name] = theme;
  }
} 
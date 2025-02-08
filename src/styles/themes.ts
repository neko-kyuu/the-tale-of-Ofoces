export interface ThemeColors {
  [key: string]: string;
}

export const darkTheme: ThemeColors = {
  // 背景色
  '--color-background': '#1a1a1a',
  '--color-background-light': '#242424',
  '--color-background-lighter': '#2a2a2a',
  '--color-background-soft': '#242424',
  '--color-background-soft-rgb': '36, 36, 36',
  '--color-background-mute': '#2f2f2f',
  '--color-background-dark': '#2f2f2f',
  
  // 强调色
  '--color-background-highlight': '#de6193',
  '--color-background-highlight-soft': '#cc5483',
  '--color-background-highlight-rgb': '222, 97, 147',
  '--color-accent-1': '#bd93f6',
  '--color-accent-2': '#ff79c6',
  '--color-accent-3': '#8be9fd',
  
  // 边框和分割线
  '--color-border': '#3f3f3f',
  '--color-border-light': '#4a4a4a',
  '--color-border-dark': '#333333',
  
  // 文字
  '--color-text': '#ffffff',
  '--color-text-soft': '#ffffffb3',
  '--color-text-muted': '#999999',
  '--color-text-light': '#cccccc'
};

export const lightTheme: ThemeColors = {
  // 背景色
  '--color-background': '#fffdf6',
  '--color-background-light': '#f8f8f8',
  '--color-background-lighter': '#ffffff',
  '--color-background-soft': '#F8F5F1',
  '--color-background-soft-rgb': '248, 245, 241',
  '--color-background-mute': '#C2C1C0',
  '--color-background-dark': '#EEE7DD',
  
  // 强调色
  '--color-background-highlight': '#bd93f6',
  '--color-background-highlight-soft': '#d3b4f7',
  '--color-background-highlight-rgb': '189, 147, 246',
  '--color-accent-1': '#9d7cd8',
  '--color-accent-2': '#ff85a1',
  '--color-accent-3': '#7dcfff',
  
  // 边框和分割线
  '--color-border': '#CEC8BF',
  '--color-border-light': '#E5E0D8',
  '--color-border-dark': '#B8B2A9',
  
  // 文字
  '--color-text': '#213547',
  '--color-text-soft': '#213547bf',
  '--color-text-muted': '#666666',
  '--color-text-light': '#444444'
};

export const applyTheme = (isDark: boolean) => {
  const theme = isDark ? darkTheme : lightTheme;
  const root = document.documentElement;
  
  Object.entries(theme).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}; 
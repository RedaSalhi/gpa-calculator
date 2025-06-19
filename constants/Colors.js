/**
 * Comprehensive theme system for the GPA Calculator app
 * Includes multiple themes with interactive theme switching
 */

export const Themes = {
  forest: {
    name: 'forest',
    displayName: 'Forest Green',
    colors: {
      primary: '#2E7D32',
      secondary: '#388E3C',
      accent: '#66BB6A',
      background: '#E8F5E8',
      surface: '#FFFFFF',
      text: '#1B5E20',
      textSecondary: '#2E7D32',
      border: '#A5D6A7',
      success: '#2E7D32',
      warning: '#F57C00',
      error: '#D32F2F',
      info: '#1976D2',
      card: '#FFFFFF',
      cardBorder: '#A5D6A7',
      input: '#FFFFFF',
      inputBorder: '#A5D6A7',
      button: '#2E7D32',
      buttonText: '#FFFFFF',
      tabActive: '#2E7D32',
      tabInactive: '#81C784',
    },
  },
};

// Legacy support for existing code
export const Colors = {
  light: Themes.forest.colors,
  dark: Themes.forest.colors,
}; 
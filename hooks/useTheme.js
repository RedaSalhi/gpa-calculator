import { createContext, useContext } from 'react';
import { Themes } from '../constants/Colors.js';

const ThemeContext = createContext({
  currentTheme: 'forest',
  theme: Themes.forest,
});

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={{ currentTheme: 'forest', theme: Themes.forest }}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Themes } from '../constants/Colors.js';

const THEME_STORAGE_KEY = 'selected_theme';

const ThemeContext = createContext({
  currentTheme: 'default',
  theme: Themes.default,
  isLoading: true,
  changeTheme: (_name) => {},
  getAllThemes: () => Object.values(Themes),
});

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && Themes[savedTheme]) {
          setCurrentTheme(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedTheme();
  }, []);

  const changeTheme = useCallback(async (themeName) => {
    console.log('useTheme: changeTheme called with:', themeName);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeName);
      console.log('useTheme: Theme saved to storage');
      setCurrentTheme(themeName);
      console.log('useTheme: currentTheme state updated to:', themeName);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  // Memoize the theme object to ensure proper re-renders
  const theme = useMemo(() => {
    console.log('useTheme: Creating theme object for:', currentTheme);
    return Themes[currentTheme];
  }, [currentTheme]);

  const getAllThemes = useCallback(() => {
    return Object.values(Themes);
  }, []);

  const value = useMemo(
    () => ({ currentTheme, theme, isLoading, changeTheme, getAllThemes }),
    [currentTheme, theme, isLoading, changeTheme, getAllThemes]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

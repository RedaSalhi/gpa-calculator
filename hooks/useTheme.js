import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Themes } from '../constants/Colors.js';

const THEME_STORAGE_KEY = 'selected_theme';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Load saved theme on app start
  useEffect(() => {
    loadSavedTheme();
  }, []);

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

  const changeTheme = useCallback(async (themeName) => {
    console.log('useTheme: changeTheme called with:', themeName);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeName);
      console.log('useTheme: Theme saved to storage');
      setCurrentTheme(themeName);
      setForceUpdate(prev => prev + 1); // Force re-render
      console.log('useTheme: currentTheme state updated to:', themeName);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  // Memoize the theme object to ensure proper re-renders
  const theme = useMemo(() => {
    console.log('useTheme: Creating theme object for:', currentTheme);
    return Themes[currentTheme];
  }, [currentTheme, forceUpdate]);

  const getAllThemes = useCallback(() => {
    return Object.values(Themes);
  }, []);

  return {
    currentTheme,
    theme,
    isLoading,
    changeTheme,
    getAllThemes,
  };
}; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subText: string;
  border: string;
  primary: string;
  primaryLight: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  inputBg: string;
}

const lightColors: ThemeColors = {
  background: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  subText: '#64748b',
  border: '#e2e8f0',
  primary: '#0891b2', // cyan-600
  primaryLight: '#ecfeff', // cyan-50
  accent: '#2563eb', // blue-600
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // rose-500
  inputBg: '#ffffff',
};

const darkColors: ThemeColors = {
  background: '#090d16',
  card: '#131b2e',
  text: '#f8fafc',
  subText: '#94a3b8',
  border: '#1e293b',
  primary: '#06b6d4', // cyan-500
  primaryLight: '#083344', // cyan-950
  accent: '#3b82f6', // blue-500
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  inputBg: '#1e293b',
};

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem('califnco_theme_mode').then((val) => {
      if (val !== null) {
        setIsDark(val === 'dark');
      }
    });
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem('califnco_theme_mode', next ? 'dark' : 'light');
      return next;
    });
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

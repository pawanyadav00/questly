import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => ({ theme: 'dark', toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('lifequest_theme', 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

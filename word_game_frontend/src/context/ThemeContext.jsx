import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  // eslint-disable-next-line no-unused-vars
  setTheme: (_t) => {},
  // PUBLIC_INTERFACE
  toggle: () => {},
});

/**
 * PUBLIC_INTERFACE
 * ThemeProvider supplies light/dark theme and persists preference in localStorage.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null;
    return saved || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useTheme hook to access theme context.
 */
export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;

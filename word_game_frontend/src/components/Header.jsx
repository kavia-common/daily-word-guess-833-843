import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * PUBLIC_INTERFACE
 * Header with app title and dark mode toggle button.
 */
function Header() {
  const { theme, toggle } = useTheme();
  const next = theme === 'light' ? 'dark' : 'light';

  return (
    <header className="app-header" role="banner" aria-label="Daily Word Game Header">
      <div className="app-title" aria-label="Ocean Word Splash Title">Ocean Word Splash</div>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggle}
        aria-pressed={theme === 'dark'}
        aria-label={`Switch to ${next} mode`}
        title={`Switch to ${next} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </header>
  );
}

export default Header;

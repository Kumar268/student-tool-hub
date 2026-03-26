/**
 * ThemeToggle.jsx - Dark/Light mode toggle button
 * 
 * Uses ThemeContext to manage theme state
 * Displays Sun/Moon icon based on current theme
 */

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2.5 rounded-lg transition-all duration-200 
                 hover:bg-gray-100 dark:hover:bg-gray-800
                 text-gray-600 dark:text-gray-300"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
    >
      {isDarkMode ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;

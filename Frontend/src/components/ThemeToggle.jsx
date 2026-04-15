import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ variant = 'default' }) {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleTheme}
        className="w-9 h-9 flex items-center justify-center self-center mx-2
                   border-2 border-black dark:border-white
                   bg-white dark:bg-black
                   text-black dark:text-white
                   hover:bg-black hover:text-white
                   dark:hover:bg-white dark:hover:text-black
                   transition-colors duration-150 flex-shrink-0"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Moon size={16} strokeWidth={2.5} />
        ) : (
          <Sun size={16} strokeWidth={2.5} />
        )}
      </button>
    );
  }

  // default — full-height bar button with left border, fits h-14 navbars
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-5 h-full
                 border-l-2 border-black dark:border-white
                 bg-white dark:bg-black
                 text-black dark:text-white
                 hover:bg-black hover:text-white
                 dark:hover:bg-white dark:hover:text-black
                 transition-colors duration-150 flex-shrink-0"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <Moon size={15} strokeWidth={2.5} />
          <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">
            Dark
          </span>
        </>
      ) : (
        <>
          <Sun size={15} strokeWidth={2.5} />
          <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">
            Light
          </span>
        </>
      )}
    </button>
  );
}

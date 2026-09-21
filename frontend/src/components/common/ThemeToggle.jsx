import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer select-none group ${
        isDark
          ? 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500 shadow-sm'
          : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm hover:shadow'
      } ${className}`}
    >
      <div className={`flex items-center justify-center w-5 h-5 rounded-full transition-transform duration-300 ${
        isDark ? 'bg-amber-400/10 text-amber-400 group-hover:scale-110' : 'bg-indigo-600/10 text-indigo-600 group-hover:scale-110'
      }`}>
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
        )}
      </div>
      <span className={`text-[11px] font-bold tracking-tight pr-0.5 ${
        isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
      }`}>
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};

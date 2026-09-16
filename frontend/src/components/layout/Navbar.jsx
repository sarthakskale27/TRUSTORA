import React from 'react';
import { Menu, Bell, LogOut, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = ({ onMenuOpen }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`h-16 flex items-center justify-between px-4 sm:px-6 border-b flex-shrink-0 ${
      isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className={`lg:hidden p-2 rounded-lg transition ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden lg:block">
          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            Welcome back, <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name?.split(' ')[0]}</span> 👋
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Morning mode' : 'Night mode'}
          className={`p-2 rounded-xl border transition-all hover:scale-110 ${
            isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700' : 'border-gray-200 text-gray-500 hover:text-gray-900'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        <button className={`relative p-2 rounded-xl border transition ${
          isDark ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-gray-200 text-gray-500 hover:text-gray-900'
        }`}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        <div className={`flex items-center gap-2 pl-2 border-l ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || 'H'}
          </div>
          <div className="hidden sm:block">
            <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{user?.role === 'host' ? 'Property Host' : 'Guest'}</p>
          </div>
          <button onClick={logout} className={`p-1.5 rounded-lg transition ${isDark ? 'text-slate-500 hover:text-rose-400' : 'text-gray-400 hover:text-rose-500'}`} title="Logout">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

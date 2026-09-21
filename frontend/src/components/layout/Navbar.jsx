import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { NotificationDropdown } from '../common/NotificationDropdown';

export const Navbar = ({ onMenuOpen, onNavigateTab }) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  return (
    <header className={`h-16 flex items-center justify-between px-4 sm:px-6 border-b flex-shrink-0 transition-colors duration-200 ${
      isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className={`lg:hidden p-2 rounded-xl transition ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden lg:block">
          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Welcome back, <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.name?.split(' ')[0]}</span> 👋
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Polished Theme Toggle */}
        <ThemeToggle />

        {/* Dynamic Host Notifications */}
        <NotificationDropdown onNavigateTab={onNavigateTab} roleOverride="host" />

        {/* User Card */}
        <div className={`flex items-center gap-2 pl-2 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {user?.name?.[0]?.toUpperCase() || 'H'}
          </div>
          <div className="hidden sm:block">
            <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.name}</p>
            <p className={`text-[10px] font-semibold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Verified Host</p>
          </div>
          <button
            onClick={logout}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-slate-500 hover:text-rose-400' : 'text-slate-400 hover:text-rose-500'}`}
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

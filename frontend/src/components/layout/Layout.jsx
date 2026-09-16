import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar }  from './Navbar';
import { useTheme } from '../../context/ThemeContext';

export const Layout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar onMenuOpen={() => setSidebarOpen(true)} />
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

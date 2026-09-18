import React, { useState } from 'react';
import {
  Compass, MapPin, Heart, BookOpen, Star, MessageSquare,
  User, ShieldCheck, Scale, X, LogOut, Sun, Moon, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const GuestLayout = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'guest-home', label: 'Explore Verified Stays', icon: Compass },
    { id: 'plan-trip', label: 'Plan a Safe Trip', icon: Search },
    { id: 'compare', label: 'Compare Stays', icon: Scale },
    { id: 'near-me', label: 'Properties Near Me', icon: MapPin },
    { id: 'my-bookings', label: 'My Bookings', icon: BookOpen },
    { id: 'wishlist', label: 'Saved Wishlist', icon: Heart },
    { id: 'my-reviews', label: 'My Reviews', icon: Star },
    { id: 'concierge-guest', label: 'WhatsApp Concierge', icon: MessageSquare },
    { id: 'guest-profile', label: 'Traveller Identity', icon: User },
  ];

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" />
      )}

      {/* Guest Sidebar */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-slate-950 border-r border-slate-800/80 z-50 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-white">Trustora</span>
              <span className="ml-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Guest
              </span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Trustora Discovery
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Card */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                {user?.name?.[0] || 'G'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Guest'}</p>
                <p className="text-[10px] text-emerald-400">Verified Traveller</p>
              </div>
            </div>
            <button onClick={logout} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between bg-slate-950/80 backdrop-blur-md shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800">
            ☰
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400">Tagline:</span>
            <span className="text-xs text-emerald-400 font-bold italic">
              "Don't just book what looks good. Book what you can trust."
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold">
              🛡️ Trust Protected
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  LayoutDashboard, MapPin, Search, Heart, Star,
  CalendarCheck, MessageSquare, User, ShieldCheck,
  LogOut, Menu, X, Sparkles, Bell, Sun, Moon, Scale
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { id: 'guest-home',      label: 'Home & Explore',    icon: LayoutDashboard },
  { id: 'plan-trip',       label: 'Plan Safe Trip',    icon: Search,         badge: 'Trustora' },
  { id: 'compare',         label: 'Compare Stays',     icon: Scale,          badge: 'New' },
  { id: 'near-me',         label: 'Near Me Search',    icon: MapPin,         badge: 'GPS' },
  { id: 'my-bookings',     label: 'My Bookings',       icon: CalendarCheck },
  { id: 'wishlist',        label: 'Saved Wishlist',    icon: Heart },
  { id: 'my-reviews',      label: 'My Reviews',        icon: Star },
  { id: 'concierge-guest', label: 'Travel Concierge',  icon: MessageSquare,  badge: 'Live' },
  { id: 'guest-profile',   label: 'My Profile',        icon: User },
  { id: 'guest-trust',     label: 'Traveller Badge',   icon: ShieldCheck },
];

export const GuestLayout = ({ activeTab, setActiveTab, children }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarBg = isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-gray-200';
  const headerBg  = isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-gray-200';
  const mainBg    = isDark ? 'bg-slate-950' : 'bg-gray-50';
  const textMain  = isDark ? 'text-white' : 'text-gray-900';
  const textSub   = isDark ? 'text-slate-400' : 'text-gray-500';
  const navActive = 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20';
  const navIdle   = isDark
    ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
  const badgeActive = 'bg-white/20 text-white';
  const badgeIdle   = isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-gray-100 text-gray-500 border border-gray-200';

  return (
    <div className={`min-h-screen ${mainBg} flex`}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 w-64 border-r z-50 flex flex-col transition-transform duration-300 ${sidebarBg} ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className={`h-16 px-6 border-b ${isDark ? 'border-slate-800/80' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className={`font-black text-base tracking-tight ${textMain}`}>Trustora</span>
              <span className={`ml-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
              }`}>Guest</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className={`lg:hidden p-1.5 rounded-lg ${textSub}`}><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className={`px-3 text-[10px] font-bold uppercase tracking-wider mb-2 ${textSub}`}>Traveller Portal</p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${isActive ? navActive : navIdle}`}>
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isDark ? 'text-slate-400 group-hover:text-emerald-400' : 'text-gray-400 group-hover:text-emerald-500'} transition-colors`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${isActive ? badgeActive : badgeIdle}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className={`p-4 border-t ${isDark ? 'border-slate-800/80' : 'border-gray-200'}`}>
          <div className={`flex items-center gap-3 p-2.5 rounded-xl mb-2 ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'G'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${textMain}`}>{user?.name || 'Guest'}</p>
              <p className={`text-[10px] truncate ${textSub}`}>{user?.email}</p>
            </div>
          </div>
          <button onClick={logout}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${textSub} hover:text-rose-400 hover:bg-rose-900/10`}>
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className={`h-16 border-b flex items-center justify-between px-6 flex-shrink-0 ${headerBg}`}>
          <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-2 rounded-lg ${textSub}`}><Menu className="w-5 h-5" /></button>
          <div className="hidden lg:block">
            <span className={`text-sm ${textSub}`}>
              Welcome to Trustora, <span className={`font-semibold ${textMain}`}>{user?.name?.split(' ')[0]}</span> 👋
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all hover:scale-110 cursor-pointer ${isDark ? 'border-slate-800 text-slate-400' : 'border-gray-200 text-gray-500'}`}
              title={isDark ? 'Morning mode' : 'Night mode'}>
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
            </button>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
              isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
            }`}>🛡️ Trustora Protected</span>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto p-6 ${isDark ? '' : 'bg-gray-50'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

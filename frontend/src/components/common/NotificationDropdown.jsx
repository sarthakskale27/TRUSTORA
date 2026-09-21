import React, { useState, useEffect, useRef } from 'react';
import {
  Bell, CheckCircle2, ShieldCheck, DollarSign, Calendar,
  Star, MessageSquare, AlertCircle, Sparkles, X, Check, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

export const NotificationDropdown = ({ onNavigateTab, roleOverride }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);

  const role = roleOverride || user?.role || 'guest';
  const isHost = role === 'host';

  // Initial / dynamic state for notifications
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = () => {
      if (isHost) {
        // Host notifications
        api.get('/bookings')
          .then(res => {
            const bookings = res.data.bookings || [];
            if (bookings.length > 0) {
              const bookingNotifs = bookings.slice(0, 5).map((b, idx) => ({
                id: `host-b-${b.id || idx}`,
                type: 'booking',
                title: 'New Reservation Confirmed',
                message: `${b.guest_name || b.guest?.name || 'Guest'} booked ${b.property_name || 'your property'} (₹${(b.total_amount || 18000).toLocaleString()})`,
                time: idx === 0 ? 'Just now' : `${idx * 2 + 1} hours ago`,
                read: idx > 0,
                icon: Calendar,
                color: 'emerald',
                link: 'bookings'
              }));
              setNotifications(bookingNotifs);
            } else {
              setNotifications([]);
            }
          })
          .catch(() => setNotifications([]));
      } else {
        // Guest notifications
        api.get('/bookings/my-bookings')
          .then(res => {
            const myBks = res.data.bookings || [];
            if (myBks.length > 0) {
              const dynamicGuest = myBks.slice(0, 5).map((b, idx) => ({
                id: `guest-b-${b.id || idx}`,
                type: 'booking',
                title: b.status === 'cancelled' ? 'Booking Cancelled & Refund Initiated' : 'Booking Confirmed & Guaranteed',
                message: b.status === 'cancelled'
                  ? `100% refund of ₹${(b.total_amount || 15000).toLocaleString()} processed for ${b.property_name || 'your stay'}.`
                  : `Your reservation at ${b.property_name || 'Verified Stay'} is confirmed with Trustora protection.`,
                time: idx === 0 ? 'Just now' : `${idx * 2 + 1} hours ago`,
                read: idx > 0,
                icon: b.status === 'cancelled' ? AlertCircle : CheckCircle2,
                color: b.status === 'cancelled' ? 'rose' : 'emerald',
                link: 'my-bookings'
              }));
              setNotifications(dynamicGuest);
            } else {
              setNotifications([]);
            }
          })
          .catch(() => setNotifications([]));
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [isHost]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filteredNotifs = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        type="button"
        title="Notifications"
        aria-label="View notifications"
        className={`relative p-2 rounded-full border transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500 shadow-sm'
            : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm hover:shadow'
        }`}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl border shadow-2xl z-50 overflow-hidden animate-fadeIn ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/80'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}>
          {/* Header */}
          <div className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                isHost ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider">
                  {isHost ? 'Host Activity Alerts' : 'Trip & Stay Alerts'}
                </h3>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    isDark ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-lg transition-colors ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className={`px-4 py-2 border-b flex items-center gap-2 text-[11px] font-bold ${
            isDark ? 'border-slate-800/80 bg-slate-950/30' : 'border-slate-100 bg-white'
          }`}>
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                filter === 'all'
                  ? isHost
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-emerald-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                filter === 'unread'
                  ? isHost
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-emerald-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification Items List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/40">
            {filteredNotifs.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className={`w-8 h-8 mx-auto opacity-40 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <p className="text-xs font-bold">All caught up!</p>
                <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No {filter === 'unread' ? 'unread' : ''} notifications right now.
                </p>
              </div>
            ) : (
              filteredNotifs.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      markAsRead(n.id);
                      if (n.link && onNavigateTab) {
                        onNavigateTab(n.link);
                        setIsOpen(false);
                      }
                    }}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                      !n.read
                        ? isDark
                          ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                          : 'bg-emerald-50/50 hover:bg-emerald-50/80'
                        : isDark
                        ? 'hover:bg-slate-800/60'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      n.color === 'emerald'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : n.color === 'teal'
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : n.color === 'rose'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : n.color === 'amber'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className={`text-xs font-bold truncate ${
                          !n.read ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-300' : 'text-slate-700')
                        }`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between mt-1.5 pt-1">
                        <span className={`text-[9px] font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {n.time}
                        </span>
                        {n.link && (
                          <span className={`text-[10px] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform ${
                            isHost ? 'text-indigo-400' : 'text-emerald-400'
                          }`}>
                            Open <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

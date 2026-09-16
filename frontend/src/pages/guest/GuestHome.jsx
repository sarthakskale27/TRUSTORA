import React, { useEffect, useState } from 'react';
import { Search, MapPin, Star, Heart, Sparkles, TrendingUp, Shield, Calendar, MessageSquare } from 'lucide-react';
import api from '../../services/api';

const QuickActionCard = ({ icon: Icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-${color}-500/50 hover:bg-${color}-900/10 transition-all group`}
  >
    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${color}-600 to-${color}-700 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <span className="text-xs font-semibold text-slate-300">{label}</span>
  </button>
);

export const GuestHome = ({ onNavigate }) => {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch]             = useState('');

  useEffect(() => {
    api.get('/guest/destinations').then(r => setDestinations(r.data.destinations)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onNavigate('browse');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero search */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900/40 via-slate-900 to-teal-900/20 border border-slate-800 p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 pointer-events-none" />
        <h1 className="text-2xl font-extrabold text-white mb-1">Find your perfect stay ✈️</h1>
        <p className="text-slate-400 text-sm mb-6">Discover handpicked stays powered by Trustora Intelligence</p>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search city, destination, or property name..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-emerald-600/20"
          >
            Search
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-bold text-base mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickActionCard icon={Search}       label="Plan a Trip"       color="emerald"  onClick={() => onNavigate('plan-trip')} />
          <QuickActionCard icon={MapPin}       label="Near Me"           color="teal"     onClick={() => onNavigate('near-me')} />
          <QuickActionCard icon={Calendar}     label="My Bookings"       color="indigo"   onClick={() => onNavigate('my-bookings')} />
          <QuickActionCard icon={Heart}        label="Wishlist"          color="rose"     onClick={() => onNavigate('wishlist')} />
        </div>
      </div>

      {/* Explore Destinations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-base">Explore Destinations</h2>
          <button onClick={() => onNavigate('browse')} className="text-emerald-400 text-xs font-semibold hover:text-emerald-300">View all →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {destinations.slice(0, 8).map(d => (
            <button
              key={d.city}
              onClick={() => onNavigate('browse')}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all"
            >
              <img
                src={d.image}
                alt={d.city}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <p className="text-white font-bold text-xs">{d.emoji} {d.city}</p>
                <p className="text-slate-300 text-[10px]">{d.tag}</p>
                {d.property_count > 0 && (
                  <p className="text-emerald-400 text-[10px] font-semibold">{d.property_count} {d.property_count === 1 ? 'property' : 'properties'}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trust Banner */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <Shield className="w-8 h-8 text-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-white font-bold text-sm">Trustora Guest Protection</p>
          <p className="text-slate-400 text-xs mt-0.5">Every booking is backed by Trustora's AI fraud detection, verified host badges & secure payments.</p>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Search, MapPin, Star, Heart, Sparkles, TrendingUp, Shield, Calendar, MessageSquare } from 'lucide-react';
import api from '../../services/api';

const DEFAULT_DEST_IMAGES = {
  'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
  'Manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  'Jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
  'Kerala': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800',
  'Bangalore': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800',
  'Mumbai': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800',
  'Udaipur': 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800',
  'Rishikesh': 'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=800',
};

const QuickActionCard = ({ icon: Icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-${color}-500/50 hover:bg-${color}-900/10 transition-all group cursor-pointer`}
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
    api.get('/guest/destinations')
      .then(r => {
        const dests = (r.data.destinations || []).map(d => ({
          ...d,
          image: DEFAULT_DEST_IMAGES[d.city] || d.image
        }));
        setDestinations(dests);
      })
      .catch(() => {
        setDestinations(Object.entries(DEFAULT_DEST_IMAGES).map(([city, img]) => ({
          city, state: '', tag: 'Verified Destination', emoji: '📍', image: img, property_count: 3
        })));
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onNavigate('plan-trip');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Hero search */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900/40 via-slate-900 to-teal-900/20 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 pointer-events-none" />
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
          TRUSTORA DISCOVERY LAYER
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Explore Verified Stays Across India ✈️</h1>
        <p className="text-slate-400 text-xs sm:text-sm mb-6">"Don't just book what looks good. Book what you can trust."</p>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destination (Goa, Manali, Jaipur, Udaipur, Kerala, Pune...)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold text-xs sm:text-sm hover:opacity-90 transition shadow-lg shadow-emerald-600/20 cursor-pointer shrink-0"
          >
            Find Stays
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-bold text-sm mb-3">Quick Discovery</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickActionCard icon={Search}       label="Plan a Safe Trip"       color="emerald"  onClick={() => onNavigate('plan-trip')} />
          <QuickActionCard icon={MapPin}       label="Properties Near Me"     color="teal"     onClick={() => onNavigate('near-me')} />
          <QuickActionCard icon={Calendar}     label="My Bookings"            color="indigo"   onClick={() => onNavigate('my-bookings')} />
          <QuickActionCard icon={Heart}        label="Saved Wishlist"         color="rose"     onClick={() => onNavigate('wishlist')} />
        </div>
      </div>

      {/* Explore Destinations (with 100% verified Udaipur & Kerala images) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-sm">Featured Trustora Verified Destinations</h2>
          <button onClick={() => onNavigate('plan-trip')} className="text-emerald-400 text-xs font-semibold hover:text-emerald-300 cursor-pointer">
            View all destinations →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {destinations.slice(0, 8).map(d => (
            <button
              key={d.city}
              onClick={() => onNavigate('plan-trip')}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all text-left shadow-lg cursor-pointer"
            >
              <img
                src={d.image || DEFAULT_DEST_IMAGES[d.city]}
                alt={d.city}
                onError={e => { e.target.onerror = null; e.target.src = DEFAULT_DEST_IMAGES[d.city] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'; }}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 space-y-0.5">
                <p className="text-white font-bold text-xs">{d.emoji} {d.city}</p>
                <p className="text-slate-300 text-[10px]">{d.tag}</p>
                {d.property_count > 0 && (
                  <p className="text-emerald-400 text-[10px] font-bold">{d.property_count} verified stays</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

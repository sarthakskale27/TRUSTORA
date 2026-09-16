import React, { useState } from 'react';
import { Search, MapPin, Users, Calendar, SlidersHorizontal, Sparkles, Loader2, Star, Heart } from 'lucide-react';
import api from '../../services/api';

const PropertyCard = ({ prop, onWishlist, wishlisted }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all group">
    <div className="relative aspect-[4/3] bg-slate-800">
      <img
        src={prop.photos?.[0]?.url || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400'}
        alt={prop.title || prop.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <button
        onClick={() => onWishlist(prop.id)}
        className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur bg-black/40 transition-colors ${wishlisted ? 'text-rose-400' : 'text-white hover:text-rose-400'}`}
      >
        <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
      </button>
      <div className="absolute bottom-2 left-2">
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/60 text-white font-semibold capitalize">{prop.property_type}</span>
      </div>
    </div>
    <div className="p-3">
      <p className="text-white font-bold text-sm truncate">{prop.title || prop.name}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <MapPin className="w-3 h-3 text-slate-500" />
        <span className="text-slate-400 text-xs">{prop.city}, {prop.state}</span>
        {prop.distance_km != null && (
          <span className="ml-auto text-emerald-400 text-[10px] font-semibold">{prop.distance_km} km away</span>
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-white text-xs font-semibold">{prop.avg_rating || '4.8'}</span>
          <span className="text-slate-500 text-[10px]">({prop.review_count || 0})</span>
        </div>
        <p className="text-white font-extrabold text-sm">
          ₹{(prop.base_price || 5000).toLocaleString()}
          <span className="text-slate-400 font-normal text-[10px]">/night</span>
        </p>
      </div>
    </div>
  </div>
);

export const PlanTrip = () => {
  const [city, setCity]         = useState('');
  const [guests, setGuests]     = useState(2);
  const [minP, setMinP]         = useState('');
  const [maxP, setMaxP]         = useState('');
  const [ptype, setPtype]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (city)   params.append('city', city);
      if (guests) params.append('guests', guests);
      if (minP)   params.append('min_price', minP);
      if (maxP)   params.append('max_price', maxP);
      if (ptype)  params.append('type', ptype);
      const res = await api.get(`/guest/properties/search?${params}`);
      setResults(res.data.properties || []);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" /> Plan a Trip
        </h1>
        <p className="text-slate-400 text-sm mt-1">Search thousands of verified stays across India</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Goa, Manali, Jaipur..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={e => setGuests(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Property Type</label>
            <select
              value={ptype}
              onChange={e => setPtype(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="">Any type</option>
              {['villa','hotel','homestay','apartment','hostel','cottage','resort'].map(t => (
                <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Min Price / night (₹)</label>
            <input
              type="number"
              value={minP}
              onChange={e => setMinP(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Max Price / night (₹)</label>
            <input
              type="number"
              value={maxP}
              onChange={e => setMaxP(e.target.value)}
              placeholder="50000"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold text-sm hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Searching...' : 'Find Stays'}
        </button>
      </form>

      {/* Results */}
      {searched && !loading && (
        <div>
          <p className="text-slate-400 text-sm mb-4">
            {results.length > 0
              ? <><span className="text-white font-bold">{results.length}</span> properties found</>
              : 'No properties found. Try a different search.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(prop => (
              <PropertyCard
                key={prop.id}
                prop={prop}
                wishlisted={wishlist.has(prop.id)}
                onWishlist={toggleWishlist}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

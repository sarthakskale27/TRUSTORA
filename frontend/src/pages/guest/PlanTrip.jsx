import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Users, Calendar, SlidersHorizontal, Sparkles,
  Loader2, Star, Heart, ShieldCheck, Scale, ArrowRight, Check
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const PlanTrip = ({ onSelectProperty, onCompare }) => {
  const { showToast } = useToast();
  const [city, setCity]         = useState('');
  const [guests, setGuests]     = useState(2);
  const [minP, setMinP]         = useState('');
  const [maxP, setMaxP]         = useState('');
  const [ptype, setPtype]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await api.get('/guest/properties/search');
        setResults(res.data.properties || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (city)   params.append('city', city);
      if (guests) params.append('guests', guests);
      if (minP)   params.append('min_price', minP);
      if (maxP)   params.append('max_price', maxP);
      if (ptype)  params.append('type', ptype);
      const res = await api.get('/guest/properties/search?' + params.toString());
      setResults(res.data.properties || []);
    } catch {
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

  const toggleCompare = (prop, e) => {
    e.stopPropagation();
    if (selectedForCompare.some(p => p.id === prop.id)) {
      setSelectedForCompare(selectedForCompare.filter(p => p.id !== prop.id));
    } else {
      if (selectedForCompare.length >= 3) {
        showToast('Maximum 3 properties can be compared.', 'error');
        return;
      }
      setSelectedForCompare([...selectedForCompare, prop]);
      showToast('Added to compare list (' + (selectedForCompare.length + 1) + '/3)', 'success');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Plan a Safe Trip
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Search 400+ Trustora-verified properties with biometric host checks and neighborhood vibes.
          </p>
        </div>

        {selectedForCompare.length > 0 && (
          <button
            onClick={() => onCompare && onCompare(selectedForCompare.map(p => p.id))}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer hover:opacity-90"
          >
            <Scale className="w-4 h-4" /> Compare Selected ({selectedForCompare.length})
          </button>
        )}
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Destination City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Goa, Manali, Jaipur..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Property Type</label>
            <select
              value={ptype}
              onChange={e => setPtype(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="">All Accommodation Types</option>
              <option value="villa">Villa</option>
              <option value="homestay">Homestay</option>
              <option value="hotel">Boutique Hotel</option>
              <option value="resort">Resort</option>
              <option value="cottage">Cottage</option>
              <option value="apartment">Apartment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                min="1"
                max="20"
                value={guests}
                onChange={e => setGuests(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="number"
              placeholder="Min ₹"
              value={minP}
              onChange={e => setMinP(e.target.value)}
              className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white placeholder-slate-600"
            />
            <span className="text-slate-600">-</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxP}
              onChange={e => setMaxP(e.target.value)}
              className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white placeholder-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Find Verified Stays
          </button>
        </div>
      </form>

      {/* Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-sm">
            {results.length} Trustora Verified Properties
          </h2>
        </div>

        {results.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
            No properties matched your search. Try changing filters or destination city.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((prop) => {
              const trustScore = prop.trust_score || 95;
              const isComparing = selectedForCompare.some(p => p.id === prop.id);
              const isWish = wishlist.has(prop.id);
              return (
                <div
                  key={prop.id}
                  onClick={() => onSelectProperty && onSelectProperty(prop.id)}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                      <img
                        src={prop.photos?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'}
                        alt={prop.title || prop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600/90 text-white font-black flex items-center gap-1 shadow">
                          <ShieldCheck className="w-3 h-3" /> {trustScore}/100
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-white font-semibold capitalize">
                          {prop.property_type || 'Stay'}
                        </span>
                      </div>

                      {/* Wishlist & Compare Buttons */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <button
                          onClick={(e) => toggleCompare(prop, e)}
                          className={`p-1.5 rounded-full backdrop-blur transition-all cursor-pointer ${
                            isComparing ? 'bg-emerald-600 text-white' : 'bg-black/60 text-slate-300 hover:text-white'
                          }`}
                          title="Compare Property"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(prop.id); }}
                          className={`p-1.5 rounded-full backdrop-blur transition-all cursor-pointer ${
                            isWish ? 'bg-rose-600 text-white' : 'bg-black/60 text-slate-300 hover:text-rose-400'
                          }`}
                        >
                          <Heart className="w-3.5 h-3.5" fill={isWish ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      {/* Vibe Snippet */}
                      <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-xl bg-black/75 backdrop-blur text-[10px] text-emerald-300 truncate">
                        📍 {prop.neighborhood_vibe || 'Quiet area, 5 min to beach, family-friendly.'}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-white font-bold text-sm truncate">{prop.title || prop.name}</p>
                      <p className="text-slate-400 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" /> {prop.city}, {prop.state}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-white font-bold">{prop.avg_rating || '4.9'}</span>
                          <span className="text-slate-500 text-[10px]">({prop.review_count || 12})</span>
                        </div>
                        <p className="text-emerald-400 font-extrabold text-sm">
                          ₹{(prop.base_price || 5000).toLocaleString()}
                          <span className="text-slate-500 font-normal text-[10px]">/night</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <button className="w-full py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold transition-all">
                      View Trustora Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

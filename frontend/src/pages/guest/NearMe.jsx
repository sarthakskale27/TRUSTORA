import React, { useState } from 'react';
import {
  MapPin, Loader2, Star, Heart, Navigation, Wifi, AlertCircle,
  Shield, SlidersHorizontal, ExternalLink, Bed, Users, ChevronDown
} from 'lucide-react';
import api from '../../services/api';

const TYPE_FILTERS = ['All', 'Villa', 'Homestay', 'Resort', 'Cottage', 'Apartment'];
const SORT_OPTIONS = [
  { value: 'distance', label: 'Nearest First' },
  { value: 'price_asc', label: 'Lowest Price' },
  { value: 'price_desc', label: 'Highest Price' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'trust', label: 'Trust Score' },
];

const CITY_IMAGES = {
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400',
  manali: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400',
  kerala: 'https://images.unsplash.com/photo-1601001435957-74f9e52d4e3b?w=400',
  udaipur: 'https://images.unsplash.com/photo-1557174949-3de3d4f1da33?w=400',
  mumbai: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400',
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400',
  rishikesh: 'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=400',
};

function getPropertyImage(prop) {
  if (prop.photos?.length > 0 && prop.photos[0]?.url) return prop.photos[0].url;
  if (prop.primary_image) return prop.primary_image;
  const cityKey = (prop.city || '').toLowerCase().split(' ')[0];
  return CITY_IMAGES[cityKey] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';
}

function TrustBadge({ score }) {
  const color = score >= 90 ? 'emerald' : score >= 75 ? 'amber' : 'rose';
  const bg = { emerald: 'bg-emerald-900/30 border-emerald-500/40 text-emerald-400', amber: 'bg-amber-900/30 border-amber-500/40 text-amber-400', rose: 'bg-rose-900/30 border-rose-500/40 text-rose-400' }[color];
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${bg}`}>
      <Shield className="w-2.5 h-2.5" /> {score}
    </div>
  );
}

export const NearMe = ({ onPropertySelect }) => {
  const [loading, setLoading]     = useState(false);
  const [results, setResults]     = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [error, setError]         = useState('');
  const [location, setLocation]   = useState(null);
  const [radius, setRadius]       = useState(100);
  const [wishlist, setWishlist]   = useState(new Set());
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy]       = useState('distance');
  const [showFilters, setShowFilters] = useState(false);

  const applyFiltersAndSort = (data, type, sort) => {
    let arr = [...data];
    if (type !== 'All') arr = arr.filter(p => (p.property_type || '').toLowerCase().includes(type.toLowerCase()));
    if (sort === 'price_asc')  arr.sort((a, b) => (a.base_price || 0) - (b.base_price || 0));
    if (sort === 'price_desc') arr.sort((a, b) => (b.base_price || 0) - (a.base_price || 0));
    if (sort === 'rating')     arr.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    if (sort === 'trust')      arr.sort((a, b) => (b.trust_score || 0) - (a.trust_score || 0));
    if (sort === 'distance')   arr.sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
    setFiltered(arr);
  };

  const findNear = () => {
    setError('');
    if (!navigator.geolocation) { setError('Geolocation is not supported by your browser.'); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        try {
          const res = await api.get(`/guest/properties/near-me?lat=${lat}&lng=${lng}&radius_km=${radius}`);
          const data = res.data.properties || [];
          setResults(data);
          applyFiltersAndSort(data, typeFilter, sortBy);
        } catch {
          setError('Could not fetch nearby properties. Is the backend running?');
        } finally { setLoading(false); }
      },
      () => { setLoading(false); setError('Location access denied. Please allow location access in your browser.'); }
    );
  };

  const handleTypeChange = (t) => { setTypeFilter(t); applyFiltersAndSort(results, t, sortBy); };
  const handleSortChange = (s) => { setSortBy(s); applyFiltersAndSort(results, typeFilter, s); };
  const toggleWishlist = (id) => setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const openGoogleMaps = (prop) => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address || prop.city)}`, '_blank');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" /> Properties Near Me
        </h1>
        <p className="text-slate-400 text-sm mt-1">GPS-powered discovery of Trustora-verified stays near your location</p>
      </div>

      {/* Search controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Search Radius</label>
            <select value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40">
              {[10, 25, 50, 100, 200, 500].map(r => <option key={r} value={r}>{r} km</option>)}
            </select>
          </div>
          <button onClick={() => setShowFilters(v => !v)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white text-sm font-semibold transition">
            <SlidersHorizontal className="w-4 h-4" /> Filters <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={findNear} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold text-sm hover:opacity-90 transition shadow-lg">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            {loading ? 'Locating...' : 'Find Near Me'}
          </button>
        </div>

        {showFilters && results.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">Property Type</p>
              <div className="flex flex-wrap gap-2">
                {TYPE_FILTERS.map(t => (
                  <button key={t} onClick={() => handleTypeChange(t)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${typeFilter === t ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">Sort By</p>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map(s => (
                  <button key={s.value} onClick={() => handleSortChange(s.value)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${sortBy === s.value ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600'}`}>{s.label}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {location && (
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            Location: {location.lat.toFixed(4)}&#xB0;N, {location.lng.toFixed(4)}&#xB0;E
          </p>
        )}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-900/20 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length > 0 && (
        <div>
          <p className="text-slate-400 text-sm mb-4">
            <span className="text-white font-bold">{filtered.length}</span> properties found within {radius} km
            {typeFilter !== 'All' && <span className="text-emerald-400"> &bull; {typeFilter}</span>}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(prop => (
              <div key={prop.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all group flex flex-col">
                {/* Image */}
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <img
                    src={getPropertyImage(prop)}
                    alt={prop.name}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <TrustBadge score={prop.trust_score || 88} />
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 font-semibold capitalize">{prop.property_type || 'Property'}</span>
                  </div>
                  <button onClick={() => toggleWishlist(prop.id)} className={`absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/60 backdrop-blur ${wishlist.has(prop.id) ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'}`}>
                    <Heart className="w-4 h-4" fill={wishlist.has(prop.id) ? 'currentColor' : 'none'} />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-slate-900/80 px-2 py-0.5 rounded-lg text-white font-extrabold text-sm">
                    &#8377;{(prop.base_price || 5000).toLocaleString()}<span className="text-slate-400 text-[10px] font-normal">/night</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <div>
                    <p className="text-white font-bold text-sm line-clamp-1">{prop.title || prop.name}</p>
                    <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {prop.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{prop.total_rooms || 2} rooms</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{prop.max_guests || 4} guests</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{prop.avg_rating || '4.8'}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-800">
                    <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <Navigation className="w-3 h-3" /> {prop.distance_km} km away
                    </span>
                    <div className="flex gap-2 ml-auto">
                      <button onClick={() => openGoogleMaps(prop)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition">
                        <ExternalLink className="w-3 h-3" /> Maps
                      </button>
                      <button onClick={() => onPropertySelect && onPropertySelect(prop.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state before search */}
      {results.length === 0 && !loading && !error && (
        <div className="text-center py-16 text-slate-600">
          <MapPin className="w-14 h-14 mx-auto mb-3 opacity-20" />
          <p className="text-slate-400 font-semibold">Click "Find Near Me" to discover properties</p>
          <p className="text-sm mt-1 text-slate-600">We'll use your GPS to find Trustora-verified stays near you</p>
        </div>
      )}
    </div>
  );
};

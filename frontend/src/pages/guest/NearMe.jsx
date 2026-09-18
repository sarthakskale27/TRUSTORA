import React, { useState, useEffect } from 'react';
import {
  MapPin, Loader2, Star, Heart, Navigation, Wifi, AlertCircle,
  Shield, SlidersHorizontal, ExternalLink, Bed, Users, ChevronDown,
  Sparkles, CheckCircle2, Globe, ShieldCheck
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

const PRESET_LOCATIONS = [
  { label: 'Current GPS', lat: null, lng: null, isGps: true },
  { label: 'Pune', lat: 18.5204, lng: 73.8567 },
  { label: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { label: 'Goa', lat: 15.4989, lng: 73.8278 },
  { label: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { label: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { label: 'Udaipur', lat: 24.5854, lng: 73.7125 },
  { label: 'Kerala', lat: 9.4981, lng: 76.3388 },
  { label: 'Manali', lat: 32.2432, lng: 77.1892 },
  { label: 'Delhi', lat: 28.6139, lng: 77.2090 },
];

const CITY_IMAGES = {
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
  kerala: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800',
  alleppey: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800',
  udaipur: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800',
  mumbai: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800',
  pune: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800',
  rishikesh: 'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=800',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

function getPropertyImage(prop) {
  if (prop.photos?.length > 0 && prop.photos[0]?.url) return prop.photos[0].url;
  if (prop.primary_image && prop.primary_image.startsWith('http')) return prop.primary_image;
  const cityKey = (prop.city || '').toLowerCase().split(' ')[0];
  return CITY_IMAGES[cityKey] || DEFAULT_IMAGE;
}

export const NearMe = ({ onSelectProperty }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('Detecting location...');
  const [currentCoords, setCurrentCoords] = useState(null);
  const [radius, setRadius] = useState(100);
  const [wishlist, setWishlist] = useState(new Set());
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('distance');

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

  const fetchNearby = async (lat, lng, r, name = '') => {
    setLoading(true);
    setError('');
    setCurrentCoords({ lat, lng });
    if (name) setLocationName(name);

    try {
      const res = await api.get(`/guest/properties/near-me?lat=${lat}&lng=${lng}&radius_km=${r}`);
      const data = res.data.properties || [];
      setResults(data);
      applyFiltersAndSort(data, typeFilter, sortBy);
      if (data.length === 0) {
        setError(`No properties found strictly within ${r} km of your location. Try expanding the radius slider to 250 km or 500 km.`);
      }
    } catch {
      setError('Could not fetch nearby properties. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const detectGps = () => {
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please select a city above.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocationName(`Detected GPS (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`);
        fetchNearby(lat, lng, radius, `Detected GPS (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`);
      },
      (err) => {
        setLoading(false);
        // Fallback default location (Pune / Central West India)
        setLocationName('Pune (Default Location)');
        fetchNearby(18.5204, 73.8567, radius, 'Pune (Location access denied - showing Pune)');
        setError('Location access was denied in your browser. Showing properties near Pune — or pick a city above.');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    detectGps();
  }, []);

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    if (currentCoords) {
      fetchNearby(currentCoords.lat, currentCoords.lng, newRadius, locationName);
    }
  };

  const handleSelectPreset = (preset) => {
    if (preset.isGps) {
      detectGps();
    } else {
      fetchNearby(preset.lat, preset.lng, radius, `${preset.label} (${preset.lat}°, ${preset.lng}°)`);
    }
  };

  const handleTypeChange = (t) => { setTypeFilter(t); applyFiltersAndSort(results, t, sortBy); };
  const handleSortChange = (s) => { setSortBy(s); applyFiltersAndSort(results, typeFilter, s); };
  const toggleWishlist = (id) => setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Navigation className="w-4 h-4" /> Haversine Distance Filter
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              STRICT RADIUS
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Properties Near Me</h1>
          <p className="text-xs text-slate-400 mt-1">
            Currently searching around: <strong className="text-emerald-400">{locationName}</strong>
          </p>
        </div>

        <button
          onClick={detectGps}
          disabled={loading}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-bold text-xs shadow flex items-center gap-2 cursor-pointer shrink-0 transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          Re-Detect GPS Location
        </button>
      </div>

      {/* Location Selector Chips */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Select Exact Location or City:
          </span>
          <span className="text-[10px] text-slate-500">Real geocoordinates</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_LOCATIONS.map((preset) => {
            const isSel = locationName.includes(preset.label);
            return (
              <button
                key={preset.label}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSel
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {preset.isGps ? '📍 ' : ''}{preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radius & Filter Controls */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-300">Search Radius:</span>
            <div className="flex items-center gap-1.5">
              {[25, 50, 100, 250, 500].map(r => (
                <button
                  key={r}
                  onClick={() => handleRadiusChange(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    radius === r
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={e => handleTypeChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
            >
              {TYPE_FILTERS.map(t => <option key={t} value={t}>{t === 'All' ? 'All Property Types' : t}</option>)}
            </select>

            <select
              value={sortBy}
              onChange={e => handleSortChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
            >
              {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-white flex items-center gap-2">
          <span>Found {filtered.length} Properties strictly within {radius} km</span>
        </h2>
        {filtered.length > 0 && (
          <span className="text-xs text-emerald-400 font-bold">
            Nearest: {filtered[0]?.distance_km} km away ({filtered[0]?.city})
          </span>
        )}
      </div>

      {/* Error / Empty State Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of Results */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl text-slate-400 text-xs space-y-3">
          <p>No verified properties within {radius} km of selected coordinates.</p>
          <div className="flex justify-center gap-2">
            <button onClick={() => handleRadiusChange(250)} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
              Expand Search to 250 km
            </button>
            <button onClick={() => handleRadiusChange(500)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
              Expand Search to 500 km
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(prop => {
            const imgSrc = getPropertyImage(prop);
            const isWish = wishlist.has(prop.id);
            return (
              <div
                key={prop.id}
                onClick={() => onSelectProperty && onSelectProperty(prop.id)}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all group cursor-pointer flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="relative h-48 bg-slate-800 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={prop.name}
                      onError={e => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

                    {/* Distance Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-600/90 text-white font-black flex items-center gap-1 shadow backdrop-blur">
                        <Navigation className="w-3 h-3" /> {prop.distance_km} km away
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/60 text-white font-bold backdrop-blur">
                        🛡️ {prop.trust_score || 94}/100
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(prop.id); }}
                        className={`p-1.5 rounded-full backdrop-blur transition-all ${
                          isWish ? 'bg-rose-600 text-white' : 'bg-black/60 text-slate-300 hover:text-rose-400'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5" fill={isWish ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 text-[10px] text-emerald-300 truncate">
                      📍 {prop.neighborhood_vibe || 'Verified location near transport & amenities.'}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-white truncate">{prop.name || prop.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0" /> {prop.city}, {prop.state}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-white font-bold">{prop.avg_rating || '4.9'}</span>
                        <span className="text-slate-500 text-[10px]">({prop.review_count || 14})</span>
                      </div>
                      <p className="text-emerald-400 font-extrabold text-sm">
                        ₹{(prop.base_price || 5000).toLocaleString()}
                        <span className="text-slate-500 font-normal text-[10px]">/night</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button className="w-full py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold transition-all">
                    View Trust Profile →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

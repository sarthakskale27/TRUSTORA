import React, { useState } from 'react';
import { MapPin, Loader2, Star, Heart, Navigation, Wifi, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export const NearMe = () => {
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState([]);
  const [error, setError]       = useState('');
  const [location, setLocation] = useState(null);
  const [radius, setRadius]     = useState(100);
  const [wishlist, setWishlist] = useState(new Set());

  const findNear = () => {
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        try {
          const res = await api.get(`/guest/properties/near-me?lat=${lat}&lng=${lng}&radius_km=${radius}`);
          setResults(res.data.properties || []);
        } catch (e) {
          setError('Could not fetch nearby properties. Is the backend running?');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError('Location access denied. Please allow location access in your browser.');
      }
    );
  };

  const toggleWishlist = (id) => setWishlist(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" /> Properties Near Me
        </h1>
        <p className="text-slate-400 text-sm mt-1">Using GPS to find verified stays close to your current location</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Search Radius</label>
            <select
              value={radius}
              onChange={e => setRadius(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              {[10, 25, 50, 100, 200, 500].map(r => (
                <option key={r} value={r}>{r} km</option>
              ))}
            </select>
          </div>
          <button
            onClick={findNear}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold text-sm hover:opacity-90 transition shadow-lg"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            {loading ? 'Locating...' : 'Find Near Me'}
          </button>
        </div>

        {location && (
          <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            Location detected: {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
          </p>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-rose-900/20 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div>
          <p className="text-slate-400 text-sm mb-4">
            <span className="text-white font-bold">{results.length}</span> properties found within {radius} km
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map(prop => (
              <div key={prop.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all group flex gap-3 p-3">
                <img
                  src={prop.photos?.[0]?.url || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200'}
                  alt={prop.name}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white font-bold text-sm truncate">{prop.title || prop.name}</p>
                    <button onClick={() => toggleWishlist(prop.id)} className={`${wishlist.has(prop.id) ? 'text-rose-400' : 'text-slate-500 hover:text-rose-400'} flex-shrink-0`}>
                      <Heart className="w-4 h-4" fill={wishlist.has(prop.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {prop.city}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-white text-xs font-semibold">{prop.avg_rating || '4.8'}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-emerald-400 text-xs font-bold">{prop.distance_km} km away</span>
                    <span className="text-white font-extrabold text-sm">₹{(prop.base_price || 5000).toLocaleString()}<span className="text-slate-400 text-[10px] font-normal">/night</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

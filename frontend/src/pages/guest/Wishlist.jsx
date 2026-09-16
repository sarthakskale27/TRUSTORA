import React, { useEffect, useState } from 'react';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import api from '../../services/api';

export const Wishlist = () => {
  const [properties, setProperties] = useState([]);
  const [wishlist, setWishlist]     = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('hb_wishlist') || '[]')); }
    catch { return new Set(); }
  });

  useEffect(() => {
    // Load all properties and filter by wishlist
    api.get('/guest/properties/search').then(r => {
      const props = r.data.properties || [];
      setProperties(props.filter(p => wishlist.has(p.id)));
    }).catch(() => {});
  }, []);

  const remove = (id) => {
    const n = new Set(wishlist);
    n.delete(id);
    setWishlist(n);
    localStorage.setItem('hb_wishlist', JSON.stringify([...n]));
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-400" fill="currentColor" /> Saved Wishlist
        </h1>
        <p className="text-slate-400 text-sm mt-1">Properties you've saved for later</p>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-semibold">Your wishlist is empty</p>
          <p className="text-xs mt-1">Search properties and tap the ♡ to save them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map(prop => (
            <div key={prop.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="relative aspect-[4/3]">
                <img
                  src={prop.photos?.[0]?.url || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400'}
                  alt={prop.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => remove(prop.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-rose-400 hover:bg-rose-900/60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-white font-bold text-sm">{prop.title || prop.name}</p>
                <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {prop.city}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-white text-xs font-semibold">{prop.avg_rating || '4.8'}</span>
                  </div>
                  <p className="text-white font-extrabold text-sm">
                    ₹{(prop.base_price || 5000).toLocaleString()}<span className="text-slate-400 text-[10px] font-normal">/night</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

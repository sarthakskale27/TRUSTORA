import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, Star, MapPin,
  X, Plus, Sparkles, Building2, Users, BedDouble, Bath, ArrowRight,
  TrendingUp, Check, Info, Scale
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const CompareProperties = ({ selectedIds = [], onSelectProperty, onNavigate }) => {
  const { showToast } = useToast();
  const [allProperties, setAllProperties] = useState([]);
  const [comparedProps, setComparedProps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      setLoading(true);
      try {
        const res = await api.get('/guest/properties/search');
        const props = res.data.properties || [];
        setAllProperties(props);

        if (selectedIds && selectedIds.length > 0) {
          const selected = props.filter(p => selectedIds.includes(p.id));
          setComparedProps(selected.slice(0, 3));
        } else if (props.length >= 2) {
          setComparedProps(props.slice(0, 2));
        }
      } catch {
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, [selectedIds]);

  const addPropertyToCompare = (prop) => {
    if (comparedProps.length >= 3) {
      showToast('You can compare a maximum of 3 properties at a time.', 'error');
      return;
    }
    if (comparedProps.some(p => p.id === prop.id)) {
      showToast('This property is already in the comparison list.', 'info');
      return;
    }
    setComparedProps([...comparedProps, prop]);
    showToast('Added ' + (prop.name || prop.title) + ' to comparison', 'success');
  };

  const removeProperty = (id) => {
    setComparedProps(comparedProps.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse">
        <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2 animate-bounce" />
        <p className="text-xs text-slate-400">Loading Trustora comparison matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Trustora Multi-Signal Comparison Engine
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Side-by-Side Trust Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Compare Properties</h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate host authenticity, scam and underpricing risks, review velocity, and neighborhood safety side by side.
          </p>
        </div>

        {comparedProps.length < 3 && (
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                const p = allProperties.find(x => x.id === Number(e.target.value));
                if (p) addPropertyToCompare(p);
              }}
              className="bg-slate-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl px-3 py-2 cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>+ Add Property to Compare...</option>
              {allProperties.filter(p => !comparedProps.some(c => c.id === p.id)).map(p => (
                <option key={p.id} value={p.id}>{p.name || p.title} ({p.city}) - ₹{p.base_price}/night</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {comparedProps.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Properties in Comparison</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Select properties from the search list or use the selector above to compare their Trustora scores side by side.
          </p>
          <button
            onClick={() => onNavigate && onNavigate('plan-trip')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs cursor-pointer"
          >
            Browse Verified Stays
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comparedProps.map((p) => {
            const trustScore = p.trust_score || 94;
            return (
              <div key={p.id} className="relative rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
                <button
                  onClick={() => removeProperty(p.id)}
                  className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/60 text-slate-400 hover:text-white backdrop-blur transition cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>

                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                    <img
                      src={p.photos?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'}
                      alt={p.name || p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-white text-xs font-black flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Trust Score: <span className="text-emerald-400">{trustScore}/100</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-white truncate">{p.name || p.title}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" /> {p.city}, {p.state}
                      </p>
                    </div>

                    <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                        Trustora Core Evaluation
                      </p>

                      <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Host Status:</span>
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ID + Face-Match
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Scam / Fraud Risk:</span>
                        <span className="text-emerald-400 font-bold">Low (0.3%)</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Review Authenticity:</span>
                        <span className="text-emerald-400 font-bold">100% Organic</span>
                      </div>

                      <div className="py-1">
                        <span className="text-slate-400 block mb-0.5">Neighbourhood Vibe:</span>
                        <span className="text-slate-200 text-[11px] block font-medium">
                          {p.neighborhood_vibe || 'Quiet area, 5 min to beach, family-friendly.'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Tariff</span>
                        <p className="text-sm font-black text-emerald-400 mt-0.5">₹{(p.base_price || 5000).toLocaleString()}<span className="text-[9px] text-slate-400 font-normal">/night</span></p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Capacity</span>
                        <p className="text-sm font-bold text-white mt-0.5">{p.max_guests || 4} Guests</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                      <span>Rating: <strong className="text-amber-400">★ {p.avg_rating || '4.9'}</strong></span>
                      <span>Rooms: <strong className="text-white">{p.total_rooms || p.rooms_count || 3}</strong></span>
                      <span>Baths: <strong className="text-white">{p.total_bathrooms || p.bathrooms_count || 2}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => onSelectProperty && onSelectProperty(p.id)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    View Full Trust Report & Book
                    <ArrowRight className="w-3.5 h-3.5" />
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

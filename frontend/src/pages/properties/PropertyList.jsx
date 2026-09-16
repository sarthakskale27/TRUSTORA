import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Star,
  MapPin,
  BedDouble,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const PropertyList = ({ onSelectProperty, onAddNew }) => {
  const { success, error } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/properties');
      setProperties(res.data.properties || []);
    } catch (e) {
      error('Failed to load properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete ${title}?`)) return;
    try {
      await api.delete(`/properties/${id}`);
      success('Property removed from portfolio.');
      fetchProperties();
    } catch (e) {
      error('Failed to delete property.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">My Properties</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your accommodations, rates, room inventories, and Trustora trust scores.
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Property Wizard
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No properties registered yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Use the 6-step onboarding wizard to publish your first vacation rental or boutique hotel.
          </p>
          <button
            onClick={onAddNew}
            className="mt-5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Launch Wizard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => {
            const heroPhoto = prop.photos?.find((p) => p.is_hero)?.url || prop.photos?.[0]?.url || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80';
            return (
              <div
                key={prop.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col group"
              >
                {/* Photo Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={heroPhoto}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge variant="primary" size="sm">
                      {prop.property_type?.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs text-white font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{prop.trust_score || 94}%</span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-[10px] uppercase font-bold text-indigo-300">Base Rate</p>
                    <p className="text-lg font-black">
                      ₹{prop.base_price?.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-slate-300">/ night</span>
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      {prop.city}, {prop.state}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-center text-xs">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Rooms</p>
                      <p className="font-bold text-white">{prop.rooms_count || 1}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Baths</p>
                      <p className="font-bold text-white">{prop.bathrooms_count || 1}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Max Guests</p>
                      <p className="font-bold text-white">{prop.max_guests || 2}</p>
                    </div>
                  </div>

                  {/* Amenities Preview */}
                  <div className="flex flex-wrap gap-1.5">
                    {prop.amenities?.slice(0, 3).map((a, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400">
                        {a}
                      </span>
                    ))}
                    {(prop.amenities?.length || 0) > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-indigo-400">
                        +{prop.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectProperty(prop.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Manage & Insights
                    </button>
                    <button
                      onClick={() => handleDelete(prop.id, prop.title)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

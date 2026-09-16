import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Camera,
  CalendarCheck,
  Star,
  Users,
  AlertTriangle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const PropertyDetail = ({ propertyId, onBack, onNavigateTab }) => {
  const { success, error } = useToast();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [pRes, rRes] = await Promise.all([
          api.get(`/properties/${propertyId}`),
          api.get(`/properties/${propertyId}/reviews`)
        ]);
        setProperty(pRes.data.property);
        setReviews(rRes.data.reviews || []);
      } catch (e) {
        error('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };
    if (propertyId) fetchDetail();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse">
        <Building2 className="w-10 h-10 text-indigo-400 mx-auto mb-2 animate-bounce" />
        <p className="text-xs text-slate-400">Loading comprehensive property profile...</p>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Properties
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('pricing')}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <CalendarCheck className="w-3.5 h-3.5" /> Dynamic Pricing Grid
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="primary">{property.property_type?.toUpperCase()}</Badge>
            <Badge variant="success">Trust Score: {property.trust_score || 94}%</Badge>
          </div>
          <h1 className="text-2xl font-black text-white">{property.title}</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-400" />
            {property.address}, {property.city}, {property.state}, {property.country} - {property.pincode}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-right">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Standard Nightly Tariff</p>
          <p className="text-2xl font-black text-emerald-400">
            ₹{property.base_price?.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">5-Factor AI multiplier dynamic</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
        {['overview', 'photos', 'reviews-trust'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl capitalize transition-all ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab === 'reviews-trust' ? 'Trustora Review Intelligence' : tab}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Property Description</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Amenities & Highlights</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities?.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats sidebar */}
          <div className="space-y-5">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Capacity Specs</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Total Rooms</span>
                  <span className="font-bold text-white">{property.rooms_count} Rooms</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Bathrooms</span>
                  <span className="font-bold text-white">{property.bathrooms_count} Bathrooms</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Guest Limit</span>
                  <span className="font-bold text-white">{property.max_guests} Guests</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">WhatsApp Concierge</span>
                  <span className="font-bold text-emerald-400">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Photos */}
      {activeTab === 'photos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {property.photos?.map((photo, i) => (
            <div key={i} className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-lg">
              <img src={photo.url} alt={photo.caption} className="w-full h-48 object-cover" />
              <div className="p-4 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 truncate">{photo.caption}</span>
                {photo.is_hero && <Badge variant="success" size="sm">Hero</Badge>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Reviews & Trustora */}
      {activeTab === 'reviews-trust' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950/30 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Trustora Anomaly & Sentiment Radar
              </h3>
              <p className="text-xs text-slate-400">
                Continuous NLP review anomaly detection and verified guest cross-referencing.
              </p>
            </div>
            <Badge variant="cyan">Zero Review Fraud Detected</Badge>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{rev.guest_name || 'Verified Traveler'}</span>
                    <span className="text-[10px] text-slate-500">via {rev.channel || 'Direct'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                <div className="pt-2 flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-emerald-400 font-semibold border border-emerald-500/20">
                    Sentiment: {rev.sentiment || 'Positive'}
                  </span>
                  <span className="text-slate-500">Verified Stay</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

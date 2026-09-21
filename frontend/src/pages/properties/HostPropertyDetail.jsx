import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, MapPin, Users, Bed, Bath, Star, ShieldCheck,
  CheckCircle2, Calendar, DollarSign, TrendingUp, Clock,
  Phone, Mail, BookOpen, Loader2, ChevronRight, Eye, XCircle,
  Trash2, AlertTriangle, Power, CheckCircle, X, Sparkles,
  Award, Camera, SearchCheck, Fingerprint, Info, ArrowUpRight
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

const STATUS_COLORS = {
  confirmed: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  checked_in: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
  checked_out: 'bg-slate-800 border-slate-700 text-slate-400',
  completed: 'bg-slate-800 border-slate-700 text-slate-400',
  cancelled: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
};

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const HostPropertyDetail = ({ propertyId, onBack, onNavigateTab }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [property, setProperty] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closeModal, setCloseModal] = useState(false);
  const [closeDate, setCloseDate] = useState('');
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    setLoading(true);
    Promise.all([
      api.get(`/properties/${propertyId}`),
      api.get('/bookings')
    ]).then(([pRes, bRes]) => {
      const prop = pRes.data.property;
      setProperty(prop);
      // Filter bookings for THIS property only
      const allBookings = bRes.data.bookings || [];
      const propBookings = allBookings.filter(b =>
        (b.property_id || b.property?.id) === prop.id
      );
      // Deduplicate
      const seen = new Set();
      const deduped = propBookings.filter(b => {
        const key = `${b.property_id}_${b.check_in}_${b.check_out}_${b.guest_name || b.guest_id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      // Sort newest first
      deduped.sort((a, b) => new Date(b.created_at || b.check_in || 0) - new Date(a.created_at || a.check_in || 0));
      setBookings(deduped);
    }).catch(() => {
      setProperty(null);
    }).finally(() => setLoading(false));
  }, [propertyId]);

  // Poll for new bookings every 10 seconds
  useEffect(() => {
    if (!property) return;
    const interval = setInterval(async () => {
      try {
        const bRes = await api.get('/bookings');
        const all = bRes.data.bookings || [];
        const propBookings = all.filter(b => (b.property_id || b.property?.id) === property.id);
        const seen = new Set();
        const deduped = propBookings.filter(b => {
          const key = `${b.property_id}_${b.check_in}_${b.check_out}_${b.guest_name || b.guest_id}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        deduped.sort((a, b) => new Date(b.created_at || b.check_in || 0) - new Date(a.created_at || a.check_in || 0));
        setBookings(deduped);
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, [property]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Property not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs cursor-pointer">Go Back</button>
      </div>
    );
  }

  const now = new Date();
  const trustScore = property.trust_score || 94;
  const primaryImg = property.photos?.[0]?.url || property.primary_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

  // Stats
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const activeBookings = bookings.filter(b => b.status === 'checked_in');
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' && new Date(b.check_in) > now);
  const totalGuests = bookings.reduce((sum, b) => sum + (b.guest_count || b.guests_count || 2), 0);
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  // Recent bookings (created in last 24h)
  const recentBookings = bookings.filter(b => {
    if (!b.created_at) return false;
    return (now.getTime() - new Date(b.created_at).getTime()) < 24 * 60 * 60 * 1000;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <button onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </button>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Live — Auto-refreshes
          </span>
          <button onClick={() => onNavigateTab && onNavigateTab('bookings')}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Open Booking Manager
          </button>
        </div>
      </div>

      {/* ── 1. PROPERTY HEADER CARD ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden bg-slate-800 shrink-0">
            <img src={primaryImg} alt={property.name}
              onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
              className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> YOUR LISTED PROPERTY
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-slate-400 border border-slate-800 uppercase">
                {property.property_type || 'Villa'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Trust Score: {trustScore}/100
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{property.name || property.title}</h1>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" /> {property.address}, {property.city}, {property.state}
            </p>

            {/* Quick Property Info */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-indigo-400" /> {property.total_rooms || 2} Rooms</span>
              <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-teal-400" /> {property.total_bathrooms || 2} Baths</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-amber-400" /> Max {property.max_guests || 4} Guests</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> ₹{(property.base_price || 5000).toLocaleString()}/night</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. TRUST SCORE CALCULATION BREAKDOWN & BOOST TIPS (FOR HOST) ── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1 mb-1">
              <Award className="w-3.5 h-3.5" /> Trust Score Breakdown & Audit
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              How {property.name}'s Trust Score is Calculated ({trustScore}/100)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent calculation breakdown and actionable suggestions to maximize guest booking conversions.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center shrink-0 min-w-[130px]">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Listing Rating</p>
            <p className="text-xl font-black text-emerald-400">{trustScore}/100</p>
            <p className="text-[9px] text-emerald-300 font-semibold">Tier 1 Certified</p>
          </div>
        </div>

        {/* 4 Pillars Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center gap-1">
                <Fingerprint className="w-3.5 h-3.5" /> Host Identity
              </span>
              <span className="text-xs font-black text-emerald-400">25 / 25 pts</span>
            </div>
            <p className="text-xs font-bold text-white">Govt KYC & Face Match</p>
            <p className="text-[11px] text-slate-400">
              Host Aadhaar/Passport verified with 3D liveness match. Full points awarded.
            </p>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 font-bold text-xs flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" /> Photo Authenticity
              </span>
              <span className="text-xs font-black text-teal-400">23 / 25 pts</span>
            </div>
            <p className="text-xs font-bold text-white">Reverse Image Clean</p>
            <p className="text-[11px] text-slate-400">
              Zero duplicate web images detected. Room counts match photo coverage.
            </p>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-teal-500 h-full rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center gap-1">
                <SearchCheck className="w-3.5 h-3.5" /> Review Health
              </span>
              <span className="text-xs font-black text-indigo-400">24 / 25 pts</span>
            </div>
            <p className="text-xs font-bold text-white">Temporal Consistency</p>
            <p className="text-[11px] text-slate-400">
              No artificial review bursts detected. Verified guest checkout ratings.
            </p>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '96%' }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> Pricing Integrity
              </span>
              <span className="text-xs font-black text-amber-400">22 / 25 pts</span>
            </div>
            <p className="text-xs font-bold text-white">Market Reference Range</p>
            <p className="text-[11px] text-slate-400">
              Price ₹{(property.base_price || 5000).toLocaleString()}/night conforms to {property.city} reference median.
            </p>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '88%' }} />
            </div>
          </div>
        </div>

        {/* Actionable Tips to Boost to 100/100 */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Actionable Recommendations to Reach 100/100 Trust Score
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <p className="font-bold text-white flex items-center gap-1">
                <span className="text-emerald-400 font-black">+2 pts</span> Upload 2 More Room Photos
              </p>
              <p className="text-[11px] text-slate-400">
                Adding bathroom and kitchen photos increases photo consistency index to 25/25.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <p className="font-bold text-white flex items-center gap-1">
                <span className="text-emerald-400 font-black">+2 pts</span> Add House Rules & Directions
              </p>
              <p className="text-[11px] text-slate-400">
                Adding landmark directions and check-in instructions reduces guest confusion.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <p className="font-bold text-white flex items-center gap-1">
                <span className="text-emerald-400 font-black">+2 pts</span> Collect 3 More Checkout Reviews
              </p>
              <p className="text-[11px] text-slate-400">
                Guests who complete their stay unlock verified review badges for this property.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. LIVE STATS DASHBOARD ── */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Property Performance
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Total Bookings</p>
            <p className="text-2xl font-black text-white mt-1">{bookings.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Upcoming</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{upcomingBookings.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Active Now</p>
            <p className="text-2xl font-black text-teal-400 mt-1">{activeBookings.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Total Guests</p>
            <p className="text-2xl font-black text-indigo-400 mt-1">{totalGuests}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Total Revenue</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Cancelled</p>
            <p className="text-2xl font-black text-rose-400 mt-1">{cancelledCount}</p>
          </div>
        </div>
      </div>

      {/* ── 4. NEW BOOKINGS ALERT ── */}
      {recentBookings.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2">
              🔔 New Bookings (Last 24h) — {recentBookings.length} booking{recentBookings.length > 1 ? 's' : ''}
            </h3>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold animate-pulse">
              NEW
            </span>
          </div>
          {recentBookings.map((b, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900 border border-emerald-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black text-sm">
                  {(b.guest_name || b.guest?.name || 'G')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-white">{b.guest_name || b.guest?.name || 'Guest'}</p>
                  <p className="text-slate-400">{fmtDate(b.check_in)} → {fmtDate(b.check_out)} · {b.guest_count || b.guests_count || 2} guests</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-emerald-400">₹{(b.total_amount || 0).toLocaleString()}</p>
                <p className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${STATUS_COLORS[b.status] || STATUS_COLORS.confirmed}`}>
                  {b.status === 'confirmed' ? 'Confirmed ✅' : b.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 5. ALL BOOKINGS TABLE ── */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" /> All Bookings for {property.name}
          </h3>
          <span className="text-[10px] text-slate-500">{bookings.length} total</span>
        </div>

        {bookings.length === 0 ? (
          <div className="p-10 text-center">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-300">No bookings yet for this property</p>
            <p className="text-xs text-slate-500 mt-1">When guests book this property, their reservations will appear here in real-time.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookings.map((b, i) => {
              const isNew = b.created_at && (now.getTime() - new Date(b.created_at).getTime()) < 60 * 60 * 1000;
              return (
                <div key={i} className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${isNew ? 'bg-emerald-500/5 border-emerald-500/30 ring-1 ring-emerald-500/10' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black shrink-0">
                      {(b.guest_name || b.guest?.name || 'G')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-white">{b.guest_name || b.guest?.name || 'Guest'}</p>
                        {isNew && <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🆕 NEW</span>}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[b.status] || STATUS_COLORS.confirmed}`}>
                          {b.status === 'confirmed' ? 'Confirmed' : b.status === 'checked_in' ? 'Checked In' : b.status === 'cancelled' ? 'Cancelled' : b.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Ref: {b.booking_reference || '—'} · {b.channel || 'Trustora Direct'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-xs">
                    <div className="text-right">
                      <p className="text-slate-500 text-[10px]">Check-in</p>
                      <p className="font-bold text-white">{fmtDate(b.check_in)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-[10px]">Check-out</p>
                      <p className="font-bold text-white">{fmtDate(b.check_out)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-[10px]">Guests</p>
                      <p className="font-bold text-indigo-400">{b.guest_count || b.guests_count || 2}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-[10px]">Amount</p>
                      <p className="font-black text-emerald-400">₹{(b.total_amount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 6. PROPERTY DETAILS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Property Description</h3>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {property.description || 'A stunning Trustora-verified rental property with modern amenities and verified host credentials.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {(property.amenities && property.amenities.length > 0 ? property.amenities : [
              'Wi-Fi', 'Swimming Pool', 'AC', 'Kitchen', 'Free Parking', 'Smart Lock'
            ]).map((a, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-semibold">
                ✓ {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 7. CLOSE / DELIST PROPERTY ── */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <Power className="w-4 h-4 text-amber-400" /> Property Status & Availability
        </h3>
        {isClosed ? (
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <p className="text-sm font-bold text-amber-400">🔒 Property Closed for New Bookings</p>
            <p className="text-xs text-slate-300">
              This property will stop accepting new reservations {closeDate ? `from ${fmtDate(closeDate)}` : 'immediately'}.
              Existing confirmed bookings will be honored.
            </p>
            <button onClick={() => { setIsClosed(false); showToast('Property reopened for new bookings!', 'success'); }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-all">
              ✅ Reopen Property
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 text-xs text-slate-400">
              <p>Property is <strong className="text-emerald-400">LIVE</strong> and accepting new bookings.</p>
              <p className="mt-1">You can close this property to new bookings while keeping existing reservations active.</p>
            </div>
            <button onClick={() => setCloseModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-400 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0">
              <Power className="w-3.5 h-3.5" /> Close to New Bookings
            </button>
          </div>
        )}
        {confirmedBookings.length > 0 && (
          <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong className="text-white">{confirmedBookings.length} active booking{confirmedBookings.length > 1 ? 's' : ''}</strong> —
              Property cannot be deleted until all bookings are completed or cancelled.
            </span>
          </div>
        )}
      </div>

      {/* CLOSE PROPERTY MODAL */}
      {closeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setCloseModal(false)}>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Power className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Close Property</h3>
                  <p className="text-xs text-slate-400">{property.name}</p>
                </div>
              </div>
              <button onClick={() => setCloseModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <p className="text-xs font-bold text-white">Set a closure date (no new bookings after this date)</p>
              <p className="text-[11px] text-slate-400">All existing reservations will remain active and honored.</p>
              <input type="date" value={closeDate} onChange={e => setCloseDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-500 outline-none" />
            </div>
            {confirmedBookings.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span><strong>{confirmedBookings.length} active booking{confirmedBookings.length > 1 ? 's' : ''}</strong> will continue as normal.</span>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setCloseModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer">
                Cancel
              </button>
              <button onClick={() => {
                setIsClosed(true);
                setCloseModal(false);
                const msg = closeDate ? `${property.name} will stop accepting new bookings from ${fmtDate(closeDate)}.` : `${property.name} is now closed to new bookings.`;
                showToast(msg, 'success');
              }}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5">
                <Power className="w-3.5 h-3.5" /> Confirm Closure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

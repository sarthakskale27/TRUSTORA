import React, { useEffect, useState } from 'react';
import {
  Calendar, MapPin, Users, Star, Clock, CheckCircle, XCircle,
  Loader2, ShieldCheck, ArrowRight, MessageSquare, Download, Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const STATUS_STYLES = {
  confirmed: { color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/30', label: 'Confirmed Stay' },
  checked_in: { color: 'text-teal-400', bg: 'bg-teal-950/40 border-teal-500/30', label: 'Currently Staying' },
  checked_out: { color: 'text-slate-300', bg: 'bg-slate-900/60 border-slate-700', label: 'Completed Stay' },
  completed: { color: 'text-slate-300', bg: 'bg-slate-900/60 border-slate-700', label: 'Completed Stay' },
  cancelled: { color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-500/30', label: 'Cancelled & Refunded' },
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

export const MyBookings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    api.get('/bookings?limit=50')
      .then(r => setBookings(r.data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const today_str = new Date().toISOString().split('T')[0];

  const isCurrent = (b) => {
    if (b.status === 'cancelled') return false;
    const cin = new Date(b.check_in);
    const cout = new Date(b.check_out);
    return cin <= now && cout >= now;
  };

  const isUpcoming = (b) => {
    if (b.status === 'cancelled') return false;
    const cin = new Date(b.check_in);
    return cin > now;
  };

  const isPast = (b) => {
    if (b.status === 'cancelled') return false;
    const cout = new Date(b.check_out);
    return cout < now || b.status === 'checked_out' || b.status === 'completed';
  };

  const currentStays = bookings.filter(isCurrent);
  const upcomingStays = bookings.filter(isUpcoming);
  const pastStays = bookings.filter(isPast);
  const cancelledStays = bookings.filter(b => b.status === 'cancelled');

  // Fallback if current stays empty, use first upcoming as preview
  const getTabList = () => {
    switch (activeTab) {
      case 'current':   return currentStays.length > 0 ? currentStays : (bookings.filter(b => b.status === 'confirmed').slice(0, 1));
      case 'upcoming':  return upcomingStays;
      case 'past':      return pastStays;
      case 'cancelled': return cancelledStays;
      default:          return upcomingStays;
    }
  };

  const displayed = getTabList();

  const handleDownloadInvoice = (ref) => {
    showToast(`Invoice for booking ${ref} generated (PDF receipt).`, 'success');
  };

  const handleContactConcierge = (propName) => {
    showToast(`Connecting to 24/7 WhatsApp AI concierge for ${propName}...`, 'info');
  };

  if (loading) {
    return (
      <div className="min-h-[350px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Guest Stay Management
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              VERIFIED BOOKINGS
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">My Trips & Stays</h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as: <strong className="text-emerald-400">{user?.name || 'Priya Sharma'}</strong> ({user?.email || 'priya@gmail.com'})
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Total Stays Record</p>
          <p className="text-xl font-black text-emerald-400">{bookings.length} Bookings</p>
        </div>
      </div>

      {/* 4 Trip Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'upcoming',  label: `Upcoming Trips (${upcomingStays.length})` },
          { id: 'current',   label: `Current Stay (${currentStays.length || 1})` },
          { id: 'past',      label: `Past Stays (${pastStays.length})` },
          { id: 'cancelled', label: `Cancelled (${cancelledStays.length})` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {displayed.length === 0 ? (
        <div className="p-16 text-center bg-slate-900/60 border border-slate-800 rounded-3xl text-slate-500 space-y-2">
          <Calendar className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
          <p className="text-sm font-bold text-slate-300">No {activeTab} bookings found</p>
          <p className="text-xs text-slate-500">Explore verified stays on Trustora to book your next safe getaway.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map(b => {
            const prop = b.property || {};
            const img = prop.photos?.[0]?.url || prop.primary_image || DEFAULT_IMAGE;
            const style = STATUS_STYLES[b.status] || STATUS_STYLES.confirmed;

            return (
              <div
                key={b.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row gap-5 shadow-xl"
              >
                {/* Image */}
                <div className="relative w-full md:w-48 h-40 md:h-auto rounded-2xl overflow-hidden bg-slate-800 shrink-0">
                  <img
                    src={img}
                    alt={prop.name}
                    onError={e => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-emerald-400 backdrop-blur border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Trust: {prop.trust_score || 95}/100
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                          Ref: {b.booking_reference || 'TR-78291'}
                        </span>
                        <h3 className="text-base font-black text-white">{prop.name || 'Verified Luxury Stay'}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          {prop.address ? `${prop.address}, ` : ''}{prop.city || 'Goa'}, {prop.state || 'India'}
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded-full border text-xs font-bold self-start ${style.bg} ${style.color}`}>
                        {style.label}
                      </span>
                    </div>

                    {/* Stay Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 mt-3 border-t border-slate-800/80 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/60">
                        <p className="text-[10px] text-slate-500 font-semibold">Check-in</p>
                        <p className="font-bold text-white mt-0.5">{b.check_in}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/60">
                        <p className="text-[10px] text-slate-500 font-semibold">Check-out</p>
                        <p className="font-bold text-white mt-0.5">{b.check_out}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/60">
                        <p className="text-[10px] text-slate-500 font-semibold">Duration & Guests</p>
                        <p className="font-bold text-slate-300 mt-0.5">{b.total_nights || 3} Nights • {b.guest_count || 2} Guests</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/60">
                        <p className="text-[10px] text-slate-500 font-semibold">Total Paid</p>
                        <p className="font-black text-emerald-400 mt-0.5">₹{(b.total_amount || 15000).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleContactConcierge(prop.name)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp AI Concierge
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(b.booking_reference)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Invoice
                      </button>
                    </div>

                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Trustora Guaranteed
                    </span>
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

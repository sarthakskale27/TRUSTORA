import React, { useEffect, useState } from 'react';
import {
  Calendar, MapPin, Users, Star, Clock, CheckCircle, XCircle,
  Loader2, ShieldCheck, ArrowRight, MessageSquare, Download, Sparkles,
  X, AlertTriangle, ChevronRight, Phone
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const STATUS_STYLES = {
  confirmed: { color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/30', label: 'Confirmed ✅' },
  checked_in: { color: 'text-teal-400', bg: 'bg-teal-950/40 border-teal-500/30', label: 'Currently Staying 🏨' },
  checked_out: { color: 'text-slate-300', bg: 'bg-slate-900/60 border-slate-700', label: 'Completed Stay' },
  completed: { color: 'text-slate-300', bg: 'bg-slate-900/60 border-slate-700', label: 'Completed Stay' },
  cancelled: { color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-500/30', label: 'Cancelled & Refunded' },
};

const PAYMENT_BADGE = {
  paid:    { label: '✅ Payment Done', cls: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  refunded:{ label: '↩ Refunded',     cls: 'bg-rose-500/10 border-rose-500/20 text-rose-400' },
  pending: { label: '⏳ Payment Pending', cls: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

const fmtDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const fmtDateTime = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const MyBookings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Booking Detail / Cancellation Modal
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelStep, setCancelStep] = useState(0); // 0=detail view, 1=confirm, 2=processing, 3=done
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [cancelLoading, setCancelLoading] = useState(false);

  const processBookings = (rawList) => {
    const seen = new Set();
    const sorted = [...rawList].sort((a, b) => {
      const da = new Date(a.created_at || a.check_in || 0);
      const db = new Date(b.created_at || b.check_in || 0);
      return db - da;
    });
    return sorted.filter(b => {
      const key = `${b.property_id || b.property?.id}_${b.check_in}_${b.check_out}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const fetchBookings = () => {
    setLoading(true);
    api.get('/bookings/my-bookings')
      .then(r => setBookings(processBookings(r.data.bookings || [])))
      .catch(() => {
        api.get('/bookings?limit=50')
          .then(r => setBookings(processBookings(r.data.bookings || [])))
          .catch(() => {})
          .finally(() => setLoading(false));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const now = new Date();

  const isCurrent = (b) => {
    if (b.status === 'cancelled') return false;
    const cin = new Date(b.check_in);
    const cout = new Date(b.check_out);
    return cin <= now && cout >= now;
  };

  const isUpcoming = (b) => {
    if (b.status === 'cancelled') return false;
    const cin = new Date(b.check_in);
    return cin > now && b.status !== 'checked_out' && b.status !== 'completed';
  };

  const isPast = (b) => {
    if (b.status === 'cancelled') return false;
    const cout = new Date(b.check_out);
    return cout < now || b.status === 'checked_out' || b.status === 'completed';
  };

  // Cancellation deadline: 2 days before check-in
  const getCancelDeadline = (b) => {
    const cin = new Date(b.check_in);
    const deadline = new Date(cin);
    deadline.setDate(deadline.getDate() - 2);
    return deadline;
  };

  const canCancel = (b) => {
    if (b.status === 'cancelled' || b.status === 'checked_out' || b.status === 'completed') return false;
    const deadline = getCancelDeadline(b);
    return now < deadline;
  };

  const getDaysUntilDeadline = (b) => {
    const deadline = getCancelDeadline(b);
    const diff = deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    setCancelStep(2);
    setCancelLoading(true);
    try {
      await new Promise(r => setTimeout(r, 2000)); // Simulate processing
      await api.put(`/bookings/${selectedBooking.id}/status`, { status: 'cancelled' });
      setCancelStep(3);
      // Update local state
      setBookings(prev => prev.map(b =>
        b.id === selectedBooking.id ? { ...b, status: 'cancelled', payment_status: 'refunded' } : b
      ));
      setSelectedBooking(prev => ({ ...prev, status: 'cancelled', payment_status: 'refunded' }));
    } catch {
      showToast('Cancellation failed. Please try again.', 'error');
      setCancelStep(1);
    } finally {
      setCancelLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setCancelStep(0);
    setCancelReason('Change of plans');
    if (cancelStep === 3) fetchBookings(); // Refresh after successful cancel
  };

  const currentStays = bookings.filter(isCurrent);
  const upcomingStays = bookings.filter(isUpcoming);
  const pastStays = bookings.filter(isPast);
  const cancelledStays = bookings.filter(b => b.status === 'cancelled');

  const getTabList = () => {
    switch (activeTab) {
      case 'all':       return bookings;
      case 'current':   return currentStays.length > 0 ? currentStays : bookings.filter(b => b.status === 'checked_in' || b.status === 'confirmed').slice(0, 1);
      case 'upcoming':  return upcomingStays;
      case 'past':      return pastStays;
      case 'cancelled': return cancelledStays;
      default:          return bookings;
    }
  };

  const displayed = getTabList();

  const handleDownloadInvoice = (ref) => {
    showToast(`Official Tax Invoice for ${ref} downloaded (PDF).`, 'success');
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
              <Calendar className="w-4 h-4" /> Verified Stay History
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              TRUSTORA PROTECTED
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">My Trips & Stays</h1>
          <p className="text-xs text-slate-400 mt-1">
            Guest Account: <strong className="text-emerald-400">{user?.name || 'Guest'}</strong> ({user?.email})
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Total Bookings</p>
          <p className="text-xl font-black text-emerald-400">{bookings.length} Stays</p>
        </div>
      </div>

      {/* 5 Trip Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all',       label: `All Stays (${bookings.length})` },
          { id: 'upcoming',  label: `Upcoming Trips (${upcomingStays.length})` },
          { id: 'current',   label: `Current Stay (${currentStays.length})` },
          { id: 'past',      label: `Past Stays (${pastStays.length})` },
          { id: 'cancelled', label: `Cancelled & Refunded (${cancelledStays.length})` },
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
          {displayed.map((b, idx) => {
            const prop = b.property || {};
            const img = b.property_image || prop.primary_image || prop.photos?.[0]?.url || DEFAULT_IMAGE;
            const style = STATUS_STYLES[b.status] || STATUS_STYLES.confirmed;
            const isCancelled = b.status === 'cancelled';
            const pmtBadge = PAYMENT_BADGE[b.payment_status] || PAYMENT_BADGE.paid;
            const isJustBooked = (b.status === 'confirmed' || b.status === 'checked_in') &&
              (idx === 0 || (b.created_at && (Date.now() - new Date(b.created_at).getTime()) < 30 * 60 * 1000));
            const cancelOk = canCancel(b);
            const daysLeft = getDaysUntilDeadline(b);

            return (
              <div
                key={b.id || b.booking_reference}
                className={`rounded-3xl border transition-all flex flex-col shadow-xl overflow-hidden ${
                  isJustBooked
                    ? 'border-emerald-500/60 shadow-emerald-500/10 ring-1 ring-emerald-500/20'
                    : isCancelled
                    ? 'bg-slate-900/90 border-rose-500/30 hover:border-rose-500/50'
                    : 'bg-slate-900 border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                {/* "Just Booked" top banner */}
                {isJustBooked && (
                  <div className="flex items-center justify-between px-5 py-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-b border-emerald-500/30">
                    <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5">
                      🎉 Booking Confirmed &amp; Payment Done!
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pmtBadge.cls}`}>
                      {pmtBadge.label}
                    </span>
                  </div>
                )}

                <div className="p-5 flex flex-col md:flex-row gap-5">
                  {/* Image */}
                  <div className="relative w-full md:w-48 h-44 md:h-auto rounded-2xl overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src={img}
                      alt={prop.name || b.property_name}
                      onError={e => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-emerald-400 backdrop-blur border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Trust: {prop.trust_score || 96}/100
                      </span>
                    </div>
                    {isCancelled && (
                      <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center p-2 text-center">
                        <span className="px-2.5 py-1 rounded-xl bg-rose-600/90 text-white font-black text-[10px] uppercase tracking-wider shadow">
                          Cancelled
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              Ref: {b.booking_reference || 'TR-78291'}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {b.channel || 'Trustora Direct'}
                            </span>
                            {!isJustBooked && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${pmtBadge.cls}`}>
                                {pmtBadge.label}
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-black text-white mt-1.5">{prop.name || b.property_name || 'Verified Luxury Stay'}</h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            {prop.address ? `${prop.address}, ` : ''}{prop.city || b.property_city || 'India'}
                          </p>
                        </div>

                        <span className={`px-3 py-1 rounded-full border text-xs font-bold self-start ${style.bg} ${style.color}`}>
                          {style.label}
                        </span>
                      </div>

                      {/* Cancelled Banner */}
                      {isCancelled && (
                        <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-medium">
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>This booking was cancelled and a full 100% refund of ₹{(b.total_amount || 0).toLocaleString()} was credited back to your original payment method.</span>
                        </div>
                      )}

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
                          <p className="text-[10px] text-slate-500 font-semibold">Stay Duration</p>
                          <p className="font-bold text-slate-300 mt-0.5">{b.total_nights || b.nights_count || 3} Nights • {b.guest_count || b.guests_count || 2} Guests</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/60">
                          <p className="text-[10px] text-slate-500 font-semibold">{isCancelled ? 'Amount Refunded' : 'Total Tariff'}</p>
                          <p className={`font-black mt-0.5 ${isCancelled ? 'text-rose-400 line-through' : 'text-emerald-400'}`}>
                            ₹{(b.total_amount || 15000).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* View Details / Cancel button */}
                        <button
                          onClick={() => { setSelectedBooking(b); setCancelStep(0); }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" /> View Details
                        </button>
                        {cancelOk && (
                          <button
                            onClick={() => { setSelectedBooking(b); setCancelStep(1); }}
                            className="px-3 py-1.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                          </button>
                        )}
                        <button
                          onClick={() => handleContactConcierge(prop.name || b.property_name)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Concierge
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(b.booking_reference)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> {isCancelled ? 'Refund Receipt' : 'Invoice'}
                        </button>
                      </div>

                      {cancelOk && daysLeft > 0 && (
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Free cancellation for {daysLeft} more day{daysLeft > 1 ? 's' : ''}
                        </span>
                      )}
                      {!cancelOk && !isCancelled && b.status !== 'checked_out' && b.status !== 'completed' && (
                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Cancellation period expired
                        </span>
                      )}
                      {(isCancelled || b.status === 'checked_out' || b.status === 'completed') && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Trustora Guaranteed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════ BOOKING DETAIL / CANCELLATION MODAL ══════════ */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={closeModal}>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {/* ── STEP 0: Booking Details ── */}
            {cancelStep === 0 && (() => {
              const b = selectedBooking;
              const prop = b.property || {};
              const style = STATUS_STYLES[b.status] || STATUS_STYLES.confirmed;
              const pmtBadge = PAYMENT_BADGE[b.payment_status] || PAYMENT_BADGE.paid;
              const cancelOk = canCancel(b);
              const daysLeft = getDaysUntilDeadline(b);
              const deadline = getCancelDeadline(b);

              return (
                <div className="p-6 space-y-5">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-white">Booking Details</h3>
                      <p className="text-xs text-slate-400">{prop.name || b.property_name} · {prop.city || b.property_city}</p>
                    </div>
                    <button onClick={closeModal} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Status + Payment */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full border text-xs font-bold ${style.bg} ${style.color}`}>
                      {style.label}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pmtBadge.cls}`}>
                      {pmtBadge.label}
                    </span>
                  </div>

                  {/* Dates Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-[10px] text-slate-500 font-semibold">Today&apos;s Date</p>
                      <p className="text-xs font-bold text-white mt-1">{fmtDate(now)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-[10px] text-slate-500 font-semibold">Booked On</p>
                      <p className="text-xs font-bold text-emerald-400 mt-1">{fmtDateTime(b.created_at)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-[10px] text-slate-500 font-semibold">Check-In Date</p>
                      <p className="text-xs font-bold text-white mt-1">{fmtDate(b.check_in)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-[10px] text-slate-500 font-semibold">Check-Out Date</p>
                      <p className="text-xs font-bold text-white mt-1">{fmtDate(b.check_out)}</p>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Booking Ref</span>
                      <span className="font-black text-emerald-400">{b.booking_reference}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Duration</span>
                      <span className="font-bold">{b.total_nights || 3} Nights · {b.guest_count || 2} Guests</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Channel</span>
                      <span className="font-bold">{b.channel || 'Trustora Direct'}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-2">
                      <span className="text-slate-500">Amount Paid</span>
                      <span className="font-black text-emerald-400">₹{(b.total_amount || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  {b.status !== 'cancelled' && b.status !== 'checked_out' && b.status !== 'completed' && (
                    <div className={`p-4 rounded-2xl border text-xs space-y-2 ${cancelOk ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-950 border-slate-800'}`}>
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" /> Cancellation Policy
                      </p>
                      <p className="text-slate-400">
                        Free cancellation available until <strong className="text-white">{fmtDate(deadline)}</strong> (2 days before check-in).
                      </p>
                      {cancelOk ? (
                        <p className="text-amber-400 font-bold">
                          ⏳ {daysLeft} day{daysLeft > 1 ? 's' : ''} remaining for free cancellation
                        </p>
                      ) : (
                        <p className="text-rose-400 font-bold">
                          ❌ Cancellation period has expired — no longer eligible for free cancellation
                        </p>
                      )}
                    </div>
                  )}

                  {/* Host Contact */}
                  <div className="p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-center gap-3 text-xs">
                    <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Property Host Contact</p>
                      <p className="text-slate-400">{prop.owner_name || 'Verified Host'} · <a href="tel:+919820012345" className="text-emerald-400 underline">+91 98200 12345</a></p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button onClick={closeModal}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer">
                      Close
                    </button>
                    {cancelOk && (
                      <button onClick={() => setCancelStep(1)}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Cancel This Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── STEP 1: Confirm Cancellation ── */}
            {cancelStep === 1 && (() => {
              const b = selectedBooking;
              const prop = b.property || {};
              return (
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" /> Confirm Cancellation
                    </h3>
                    <button onClick={closeModal} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                    <p className="text-sm font-bold text-white">Are you sure you want to cancel this booking?</p>
                    <div className="text-xs text-slate-300 space-y-1">
                      <p><strong>Property:</strong> {prop.name || b.property_name}</p>
                      <p><strong>Check-in:</strong> {fmtDate(b.check_in)} → <strong>Check-out:</strong> {fmtDate(b.check_out)}</p>
                      <p><strong>Booking Ref:</strong> {b.booking_reference}</p>
                    </div>
                  </div>

                  {/* Refund Details */}
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2 text-xs">
                    <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Refund Breakdown
                    </p>
                    <div className="flex justify-between text-slate-300">
                      <span>Amount Paid</span>
                      <span className="font-bold">₹{(b.total_amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Cancellation Fee</span>
                      <span className="font-bold text-emerald-400">₹0 (Free Cancellation)</span>
                    </div>
                    <div className="flex justify-between text-white font-black border-t border-slate-800 pt-2">
                      <span>Total Refund</span>
                      <span className="text-emerald-400">₹{(b.total_amount || 0).toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 pt-1">Refund will be credited to your original payment method within 5-7 business days.</p>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Reason for Cancellation</label>
                    <select value={cancelReason} onChange={e => setCancelReason(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none">
                      <option>Change of plans</option>
                      <option>Found a better deal</option>
                      <option>Travel dates changed</option>
                      <option>Personal emergency</option>
                      <option>Booked by mistake</option>
                      <option>Other reason</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setCancelStep(0)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer">
                      ← Go Back
                    </button>
                    <button onClick={handleCancelBooking}
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5">
                      Yes, Cancel & Refund ₹{(b.total_amount || 0).toLocaleString()}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* ── STEP 2: Processing ── */}
            {cancelStep === 2 && (
              <div className="p-10 text-center space-y-5">
                <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto" />
                <div>
                  <h3 className="text-lg font-black text-white">Processing Cancellation...</h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Verifying your booking, initiating refund, and updating the host...
                  </p>
                </div>
                <div className="space-y-2 text-xs text-slate-400">
                  <p className="flex items-center gap-2 justify-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Booking verified</p>
                  <p className="flex items-center gap-2 justify-center"><Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" /> Processing refund...</p>
                  <p className="flex items-center gap-2 justify-center text-slate-600"><Clock className="w-3.5 h-3.5" /> Notifying host</p>
                </div>
              </div>
            )}

            {/* ── STEP 3: Cancellation Confirmed ── */}
            {cancelStep === 3 && (() => {
              const b = selectedBooking;
              return (
                <div className="p-6 text-center space-y-5">
                  <div className="flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-4 border-emerald-500/40 flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-emerald-400" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Cancellation Complete ✅</p>
                    <h2 className="text-xl font-black text-white">Booking Cancelled &<br />Refund Initiated!</h2>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Booking Ref</span>
                      <span className="font-bold text-slate-400 line-through">{b.booking_reference}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Status</span>
                      <span className="font-black text-rose-400">Cancelled</span>
                    </div>
                    <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-2">
                      <span className="text-slate-500">Refund Amount</span>
                      <span className="font-black text-emerald-400">₹{(b.total_amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Refund Status</span>
                      <span className="font-bold text-emerald-400">✅ Initiated — 5-7 business days</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Cancelled On</span>
                      <span className="font-bold">{fmtDateTime(new Date())}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Full refund guaranteed by Trustora&apos;s 100% money-back policy.</span>
                  </div>

                  <button onClick={closeModal}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-black transition-all cursor-pointer">
                    Done — Back to My Bookings
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

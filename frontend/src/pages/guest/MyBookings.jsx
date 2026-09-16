import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Star, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const STATUS_STYLES = {
  confirmed: { color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-500/30', icon: CheckCircle },
  pending:   { color: 'text-amber-400',   bg: 'bg-amber-900/20 border-amber-500/30',   icon: Clock },
  cancelled: { color: 'text-rose-400',    bg: 'bg-rose-900/20 border-rose-500/30',     icon: XCircle },
  completed: { color: 'text-slate-400',   bg: 'bg-slate-900/20 border-slate-700',      icon: CheckCircle },
};

export const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]  = useState(true);
  const [tab, setTab]          = useState('upcoming');

  useEffect(() => {
    api.get('/bookings?limit=50')
      .then(r => setBookings(r.data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now       = new Date();
  const upcoming  = bookings.filter(b => new Date(b.check_in) >= now  && b.status !== 'cancelled');
  const past      = bookings.filter(b => new Date(b.check_out) < now  || b.status === 'completed');
  const cancelled = bookings.filter(b => b.status === 'cancelled');

  const displayed = tab === 'upcoming' ? upcoming : tab === 'past' ? past : cancelled;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" /> My Bookings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Track all your stays in one place</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'upcoming',  label: `Upcoming (${upcoming.length})` },
          { id: 'past',      label: `Past (${past.length})` },
          { id: 'cancelled', label: `Cancelled (${cancelled.length})` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === t.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No {tab} bookings</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(b => {
            const style = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
            const Icon  = style.icon;
            return (
              <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4 hover:border-slate-700 transition-all">
                <img
                  src={b.property?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200'}
                  alt={b.property?.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-bold text-sm">{b.property?.name || 'Property'}</p>
                      <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {b.property?.city || '—'}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold capitalize flex items-center gap-1 ${style.bg} ${style.color}`}>
                      <Icon className="w-3 h-3" /> {b.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div>
                      <p className="text-slate-500 text-[10px]">Check-in</p>
                      <p className="text-white text-xs font-semibold">{b.check_in}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px]">Check-out</p>
                      <p className="text-white text-xs font-semibold">{b.check_out}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px]">Guests</p>
                      <p className="text-white text-xs font-semibold">{b.guests_count || b.guests || 1}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px]">Total</p>
                      <p className="text-emerald-400 text-xs font-bold">₹{(b.total_amount || 0).toLocaleString()}</p>
                    </div>
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

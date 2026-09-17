import React, { useState, useEffect } from 'react';
import {
  User, Shield, Phone, Mail, Camera, CheckCircle, Star, MapPin, Award,
  Loader2, TrendingUp, Heart, Globe, Zap, AlertCircle, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const BADGES = [
  { id: 'first_stay',       icon: '🏠', label: 'First Stay',        desc: 'Completed your first verified booking',     earned: false },
  { id: 'trusted',          icon: '🛡️', label: 'Trusted Traveller',  desc: '3+ stays with 5-star host ratings',         earned: false },
  { id: 'review_champ',     icon: '✍️', label: 'Review Champion',    desc: 'Written 5 or more verified reviews',        earned: false },
  { id: 'eco_explorer',     icon: '🌿', label: 'Eco Explorer',       desc: 'Stayed at 2+ eco-certified properties',     earned: false },
  { id: 'solo_wanderer',    icon: '🎒', label: 'Solo Wanderer',      desc: 'Completed a solo verified stay',            earned: false },
  { id: 'weekend_warrior',  icon: '⚡', label: 'Weekend Warrior',    desc: '3+ weekend bookings confirmed',             earned: false },
  { id: 'kyc_verified',     icon: '🪪', label: 'KYC Verified',       desc: 'Government ID verified by Trustora',       earned: false },
  { id: 'photo_verified',   icon: '📸', label: 'Photo Verified',     desc: 'Profile photo verified via face-match',     earned: false },
  { id: 'host_fav',         icon: '⭐', label: '5-Star Host Fav',    desc: 'Rated 5 stars by 3+ different hosts',       earned: false },
];

const VERIFICATIONS = [
  { label: 'Email Verified',  key: 'email',   done: true  },
  { label: 'Phone Verified',  key: 'phone',   done: true  },
  { label: 'ID Verified',     key: 'id',      done: false },
  { label: 'KYC Complete',    key: 'kyc',     done: false },
  { label: 'Face-Match',      key: 'face',    done: false },
  { label: 'Zero Disputes',   key: 'dispute', done: true  },
];

function ScoreRing({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const r = 38; const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="text-center z-10">
        <p className="text-2xl font-black text-white leading-none">{score}</p>
        <p className="text-[9px] text-slate-400 font-semibold">TRUST</p>
      </div>
    </div>
  );
}

export const GuestProfile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ bookings: 0, reviews: 0, cities: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const trust_score = 62;

  useEffect(() => {
    Promise.all([
      api.get('/guest/my-reviews').catch(() => ({ data: { reviews: [] } })),
    ]).then(([revRes]) => {
      const reviews = revRes.data.reviews || [];
      const cities = new Set(reviews.map(r => r.property_city).filter(Boolean));
      setStats({ bookings: 0, reviews: reviews.length, cities: cities.size });
    }).finally(() => setLoadingStats(false));
  }, []);

  const scoreLabel = trust_score >= 80 ? 'Gold Traveller' : trust_score >= 60 ? 'Silver Traveller' : 'New Traveller';
  const scoreColor = trust_score >= 80 ? 'text-amber-400' : trust_score >= 60 ? 'text-slate-300' : 'text-slate-400';

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-400" /> My Profile
        </h1>
        <p className="text-slate-400 text-sm mt-1">Your Trustora traveller identity and trust score</p>
      </div>

      {/* Hero card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-400 flex items-center justify-center text-white text-3xl font-black shadow-xl">
            {user?.name?.[0]?.toUpperCase() || 'G'}
          </div>
          <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-white text-xl font-extrabold">{user?.name || 'Guest Traveller'}</h2>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold">Verified Account</span>
          </div>
        </div>
        <ScoreRing score={trust_score} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Heart, label: 'Stays', value: loadingStats ? '—' : stats.bookings },
          { icon: Star,  label: 'Reviews', value: loadingStats ? '—' : stats.reviews },
          { icon: MapPin,label: 'Cities', value: loadingStats ? '—' : stats.cities },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <Icon className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-white font-extrabold text-lg leading-none">{value}</p>
            <p className="text-slate-500 text-[10px] font-semibold mt-0.5 uppercase">{label}</p>
          </div>
        ))}
      </div>

      {/* Trust score breakdown */}
      <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/10 border border-emerald-500/20 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-white font-bold text-sm">Trustora Identity Score</h3>
              <p className={`text-xs font-semibold ${scoreColor}`}>{scoreLabel}</p>
            </div>
          </div>
          <span className="text-3xl font-black text-white">{trust_score}<span className="text-slate-500 text-sm font-normal">/100</span></span>
        </div>

        {/* Score bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
            style={{ width: `${trust_score}%` }}
          />
        </div>

        {/* What improves your score */}
        <p className="text-xs font-semibold text-slate-400 mb-3">How to improve your score:</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Complete a booking',  pts: '+15 pts', done: stats.bookings > 0 },
            { label: 'Write a review',      pts: '+10 pts', done: stats.reviews > 0  },
            { label: 'Verify your ID',      pts: '+20 pts', done: false },
            { label: 'Add phone number',    pts: '+5 pts',  done: !!user?.phone       },
          ].map(item => (
            <div key={item.label} className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] ${item.done ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/60 border-slate-700 text-slate-400'}`}>
              {item.done ? <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-3 h-3 text-slate-600 flex-shrink-0" />}
              <span className="flex-1">{item.label}</span>
              {!item.done && <span className="text-indigo-400 font-bold">{item.pts}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Traveller Badges */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-bold">Traveller Badges</h3>
          <span className="text-xs text-slate-500 ml-auto">{BADGES.filter(b => b.earned).length}/{BADGES.length} earned</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {BADGES.map(badge => (
            <div key={badge.id} title={badge.desc} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${badge.earned ? 'bg-amber-900/20 border-amber-500/30' : 'bg-slate-950/40 border-slate-800 opacity-40 grayscale'}`}>
              <span className="text-2xl">{badge.icon}</span>
              <p className={`text-[10px] font-bold leading-tight ${badge.earned ? 'text-amber-300' : 'text-slate-500'}`}>{badge.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-3 text-center">Complete stays and write reviews to unlock badges</p>
      </div>

      {/* Verification checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> Verification Status</h3>
        <div className="space-y-2">
          {VERIFICATIONS.map(v => (
            <div key={v.key} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/50">
              <CheckCircle className={`w-4 h-4 flex-shrink-0 ${v.done ? 'text-emerald-400' : 'text-slate-700'}`} />
              <span className={`text-xs font-semibold flex-1 ${v.done ? 'text-white' : 'text-slate-500'}`}>{v.label}</span>
              {v.done
                ? <span className="text-[10px] text-emerald-400 font-bold">Verified</span>
                : <button className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold hover:text-indigo-300">Complete <ChevronRight className="w-3 h-3" /></button>}
            </div>
          ))}
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-white font-bold">Personal Information</h3>
        {[
          { icon: User,  label: 'Full Name', value: user?.name  || '—' },
          { icon: Mail,  label: 'Email',     value: user?.email || '—' },
          { icon: Phone, label: 'Phone',     value: user?.phone || 'Not added' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl">
            <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">{label}</p>
              <p className={`text-sm font-medium ${value === 'Not added' ? 'text-slate-600 italic' : 'text-white'}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={logout} className="w-full py-3 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-900/10 text-sm font-bold transition-all">
        Sign Out
      </button>
    </div>
  );
};

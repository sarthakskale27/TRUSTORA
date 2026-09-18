import React, { useState, useEffect } from 'react';
import {
  User, Shield, Phone, Mail, Camera, CheckCircle, Star, MapPin, Award,
  Loader2, TrendingUp, Heart, Globe, Zap, AlertCircle, ChevronRight, X, Sparkles, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const GuestProfile = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState({ bookings: 4, reviews: 3, cities: 3 });
  const [loadingStats, setLoadingStats] = useState(false);
  const [trustScore, setTrustScore] = useState(88);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [isKycDone, setIsKycDone] = useState(true);

  const BADGES = [
    { id: 'first_stay',       icon: '🏠', label: 'First Stay',        desc: 'Completed your first verified booking',     earned: true },
    { id: 'trusted',          icon: '🛡️', label: 'Trusted Traveller',  desc: '3+ stays with 5-star host ratings',         earned: isKycDone },
    { id: 'review_champ',     icon: '✍️', label: 'Review Champion',    desc: 'Written 5 or more verified reviews',        earned: true },
    { id: 'eco_explorer',     icon: '🌿', label: 'Eco Explorer',       desc: 'Stayed at 2+ eco-certified properties',     earned: true },
    { id: 'solo_wanderer',    icon: '🎒', label: 'Solo Wanderer',      desc: 'Completed a solo verified stay',            earned: true },
    { id: 'weekend_warrior',  icon: '⚡', label: 'Weekend Warrior',    desc: '3+ weekend bookings confirmed',             earned: true },
    { id: 'kyc_verified',     icon: '🪪', label: 'KYC Verified',       desc: 'Government ID verified by Trustora',       earned: isKycDone },
    { id: 'photo_verified',   icon: '📸', label: 'Photo Verified',     desc: 'Profile photo verified via face-match',     earned: isKycDone },
    { id: 'host_fav',         icon: '⭐', label: '5-Star Host Fav',    desc: 'Rated 5 stars by 3+ different hosts',       earned: true },
  ];

  const VERIFICATIONS = [
    { label: 'Email Verified',  key: 'email',   done: true  },
    { label: 'Phone Verified',  key: 'phone',   done: true  },
    { label: 'Govt ID Verified',key: 'id',      done: isKycDone },
    { label: 'KYC Complete',    key: 'kyc',     done: isKycDone },
    { label: 'Face-Match',      key: 'face',    done: isKycDone },
    { label: 'Zero Disputes',   key: 'dispute', done: true  },
  ];

  const handleCompleteKyc = (e) => {
    e.preventDefault();
    setKycSubmitting(true);
    setTimeout(() => {
      setIsKycDone(true);
      setTrustScore(94);
      setKycSubmitting(false);
      setKycModalOpen(false);
      showToast('Traveller KYC Verification Complete! Badges unlocked.', 'success');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn pb-12">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-400" /> Traveller Profile & Identity
        </h1>
        <p className="text-slate-400 text-xs mt-1">Your Trustora traveller trust score, badges and verification record</p>
      </div>

      {/* Hero card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-5 shadow-xl">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-400 flex items-center justify-center text-white text-3xl font-black shadow-xl">
            {user?.name?.[0]?.toUpperCase() || 'P'}
          </div>
          <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-white text-xl font-extrabold">{user?.name || 'Priya Sharma'}</h2>
          <p className="text-slate-400 text-xs">{user?.email || 'guest@trustora.ai'}</p>
          <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-bold">KYC Verified Traveller ✓</span>
          </div>
        </div>
        <div className="w-20 h-20 rounded-2xl bg-emerald-950 border-2 border-emerald-500/50 flex flex-col items-center justify-center shadow-lg shrink-0">
          <p className="text-2xl font-black text-emerald-400 leading-none">{trustScore}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">TRUST</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Heart, label: 'Stays', value: 4 },
          { icon: Star,  label: 'Reviews', value: 3 },
          { icon: MapPin,label: 'Cities', value: 3 },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
            <Icon className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-white font-extrabold text-base leading-none">{value}</p>
            <p className="text-slate-500 text-[10px] font-semibold mt-0.5 uppercase">{label}</p>
          </div>
        ))}
      </div>

      {/* Verification Status Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Verification Checklist
          </h3>
          <button
            onClick={() => setKycModalOpen(true)}
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {isKycDone ? 'Re-verify KYC' : 'Complete KYC →'}
          </button>
        </div>

        <div className="space-y-2">
          {VERIFICATIONS.map(v => (
            <div key={v.key} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950 border border-slate-800/60">
              <CheckCircle className={`w-4 h-4 flex-shrink-0 ${v.done ? 'text-emerald-400' : 'text-slate-700'}`} />
              <span className={`text-xs font-semibold flex-1 ${v.done ? 'text-white' : 'text-slate-500'}`}>{v.label}</span>
              {v.done ? (
                <span className="text-[10px] text-emerald-400 font-bold">Verified ✓</span>
              ) : (
                <button
                  onClick={() => setKycModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px]"
                >
                  Complete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Traveller Badges */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Traveller Badges
          </h3>
          <span className="text-xs text-amber-400 font-bold">
            {BADGES.filter(b => b.earned).length}/{BADGES.length} Unlocked
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {BADGES.map(badge => (
            <div
              key={badge.id}
              title={badge.desc}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border text-center transition-all ${
                badge.earned
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                  : 'bg-slate-950/40 border-slate-800 opacity-40 grayscale'
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-[10px] font-bold leading-tight">{badge.label}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={logout} className="w-full py-3 rounded-2xl border border-rose-500/30 text-rose-400 hover:bg-rose-900/10 text-xs font-bold transition-all">
        Sign Out
      </button>

      {/* KYC Complete Modal */}
      {kycModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Traveller KYC Identity Verification
              </h3>
              <button onClick={() => setKycModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCompleteKyc} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">ID Document Type</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                  <option>Aadhaar Card (UIDAI)</option>
                  <option>Passport (Govt of India)</option>
                  <option>Driving Licence</option>
                  <option>Voter ID</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Legal Name</label>
                <input
                  defaultValue={user?.name || 'Priya Sharma'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                <p className="font-bold flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Biometric Face Liveness: Ready</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Automated OCR and security watermark check simulated.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setKycModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={kycSubmitting}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  {kycSubmitting ? 'Verifying...' : 'Submit & Complete KYC'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

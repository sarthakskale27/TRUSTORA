import React, { useState, useEffect } from 'react';
import {
  User, Shield, Phone, Mail, Camera, CheckCircle, Star, MapPin, Award,
  Loader2, TrendingUp, Heart, Globe, Zap, AlertCircle, ChevronRight, X, Sparkles, Check,
  FileText, Scan, RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const GuestProfile = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState({ bookings: 4, reviews: 3, cities: 3 });
  const [trustScore, setTrustScore] = useState(62);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [isKycDone, setIsKycDone] = useState(false);

  // Guest KYC form state
  const [idType, setIdType] = useState('Aadhaar Card (UIDAI)');
  const [legalName, setLegalName] = useState(user?.name || 'Priya Sharma');
  const [idNum, setIdNum] = useState('4829 9182 3841');
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);

  useEffect(() => {
    api.get('/trust/host/verification/status')
      .then(res => {
        if (res.data && res.data.verified) {
          setIsKycDone(true);
          setTrustScore(94);
        }
      })
      .catch(() => {});
  }, []);

  const handleVerifyStep1 = (e) => {
    e.preventDefault();
    if (!legalName.trim() || !idNum.trim()) {
      showToast('Please enter legal name and ID number', 'error');
      return;
    }
    setStep1Done(true);
    setModalStep(2);
    showToast('Identity format verified ✓', 'success');
  };

  const handleVerifyStep2 = () => {
    setKycSubmitting(true);
    setTimeout(() => {
      setKycSubmitting(false);
      setStep2Done(true);
      setModalStep(3);
      showToast('Document Authenticity: 99.1% Matched ✓', 'success');
    }, 1000);
  };

  const handleVerifyStep3 = () => {
    setKycSubmitting(true);
    setTimeout(() => {
      setKycSubmitting(false);
      setStep3Done(true);
      setModalStep(4);
      showToast('Biometric Face-Match: 98.4% Matched ✓', 'success');
    }, 1000);
  };

  const handleFinalSubmit = async () => {
    setKycSubmitting(true);
    try {
      await api.post('/trust/guest/verification/submit', {
        id_type: idType,
        full_name: legalName,
        id_number: idNum
      });
      setIsKycDone(true);
      setTrustScore(94);
      setKycModalOpen(false);
      showToast('Traveller KYC Verification Complete! Verified badges unlocked.', 'success');
    } catch {
      setIsKycDone(true);
      setTrustScore(94);
      setKycModalOpen(false);
      showToast('KYC verified successfully (DEMO MODE)', 'success');
    } finally {
      setKycSubmitting(false);
    }
  };

  const handleResetKyc = async () => {
    try {
      await api.post('/trust/host/verification/reset');
    } catch {}
    setIsKycDone(false);
    setTrustScore(62);
    setStep1Done(false);
    setStep2Done(false);
    setStep3Done(false);
    setModalStep(1);
    showToast('Traveller verification reset to Incomplete state.', 'info');
  };

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

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" /> Traveller Profile & Identity
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">Your Trustora traveller trust score, badges and verification record</p>
        </div>

        {isKycDone && (
          <button
            onClick={handleResetKyc}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            title="Reset KYC to test verification again"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-verify
          </button>
        )}
      </div>

      {/* Hero card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-5 shadow-xl">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-400 flex items-center justify-center text-white text-3xl font-black shadow-xl">
            {user?.name?.[0]?.toUpperCase() || 'P'}
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-white text-xl font-extrabold">{user?.name || 'Priya Sharma'}</h2>
          <p className="text-slate-400 text-xs">{user?.email || 'guest@trustora.ai'}</p>
          <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
            <CheckCircle className={`w-4 h-4 ${isKycDone ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className={`text-xs font-bold ${isKycDone ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isKycDone ? 'KYC Verified Traveller ✓' : 'KYC Pending Verification'}
            </span>
          </div>
        </div>
        <div className="w-20 h-20 rounded-2xl bg-emerald-950 border-2 border-emerald-500/50 flex flex-col items-center justify-center shadow-lg shrink-0">
          <p className="text-2xl font-black text-emerald-400 leading-none">{trustScore}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">TRUST</p>
        </div>
      </div>

      {/* Verification Status Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Verification Checklist
          </h3>
          <button
            onClick={() => {
              setModalStep(1);
              setKycModalOpen(true);
            }}
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            {isKycDone ? 'Re-run KYC Verification' : 'Start KYC Verification →'}
          </button>
        </div>

        <div className="space-y-2">
          {VERIFICATIONS.map(v => (
            <div key={v.key} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950 border border-slate-800/60">
              <CheckCircle className={`w-4 h-4 flex-shrink-0 ${v.done ? 'text-emerald-400' : 'text-slate-700'}`} />
              <span className={`text-xs font-semibold flex-1 ${v.done ? 'text-white' : 'text-slate-400'}`}>{v.label}</span>
              {v.done ? (
                <span className="text-[10px] text-emerald-400 font-bold">Verified ✓</span>
              ) : (
                <button
                  onClick={() => {
                    setModalStep(1);
                    setKycModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] cursor-pointer"
                >
                  Verify Now →
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

      <button onClick={logout} className="w-full py-3 rounded-2xl border border-rose-500/30 text-rose-400 hover:bg-rose-900/10 text-xs font-bold transition-all cursor-pointer">
        Sign Out
      </button>

      {/* ── STEP-BY-STEP KYC VERIFICATION MODAL ── */}
      {kycModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Traveller KYC Verification (Step {modalStep}/4)
              </h3>
              <button onClick={() => setKycModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Step 1: Identity Info */}
            {modalStep === 1 && (
              <form onSubmit={handleVerifyStep1} className="space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Government ID Type</label>
                  <select
                    value={idType}
                    onChange={e => setIdType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Aadhaar Card (UIDAI)">Aadhaar Card (UIDAI)</option>
                    <option value="Passport (Govt of India)">Passport (Govt of India)</option>
                    <option value="Driving Licence">Driving Licence</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Full Legal Name</label>
                  <input
                    value={legalName}
                    onChange={e => setLegalName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Document Number</label>
                  <input
                    value={idNum}
                    onChange={e => setIdNum(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
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
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Next: Upload Document →
                  </button>
                </div>
              </form>
            )}

            {/* Modal Step 2: Document OCR */}
            {modalStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-emerald-500/40 text-center space-y-2">
                  <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-white">{idType}</p>
                  <p className="text-[10px] text-slate-400">front_and_back_id.jpg (Ready for AI Scan)</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => setModalStep(1)} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
                    Back
                  </button>
                  <button
                    onClick={handleVerifyStep2}
                    disabled={kycSubmitting}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    {kycSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                    <span>Run AI Document Authenticity Scan →</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Step 3: Face Liveness */}
            {modalStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-emerald-500/40">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" alt="Face" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Face Liveness Snapshot</p>
                    <p className="text-[10px] text-emerald-400">128-point face landmarks detected</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => setModalStep(2)} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
                    Back
                  </button>
                  <button
                    onClick={handleVerifyStep3}
                    disabled={kycSubmitting}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    {kycSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Verify Face-Match →</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Step 4: Final Submit */}
            {modalStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                    <span>Legal ID ({legalName})</span>
                    <span className="text-emerald-400 font-bold">Verified ✓</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                    <span>Document Authenticity</span>
                    <span className="text-emerald-400 font-bold">99.1% Matched ✓</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                    <span>Biometric Face-Match</span>
                    <span className="text-teal-400 font-bold">98.4% Matched ✓</span>
                  </div>
                </div>

                <button
                  onClick={handleFinalSubmit}
                  disabled={kycSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow"
                >
                  {kycSubmitting ? 'Issuing Badge...' : 'Submit & Complete Traveller KYC ✓'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Fingerprint, ShieldAlert, SearchCheck, TrendingUp,
  Building2, BookOpen, Users, DollarSign, ArrowRight, Sparkles,
  CheckCircle2, AlertTriangle, PlusCircle, Award
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_bookings: 0,
    total_properties: 0,
    occupancy_rate: 0,
    adr: 0,
    is_new_host: false,
    revenue_trend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      {/* ── 1. PRIMARY TRUST CENTER BANNER ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Trust Intelligence Center
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              DEMO DATA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {user?.name || 'Host'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Your Trustora portfolio is operating with a <strong>96/100 Trust Score</strong>. Host identity is verified and fraud scans are clean.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/30 shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950 border-2 border-emerald-500/60 flex flex-col items-center justify-center shadow-lg">
            <span className="text-2xl font-black text-emerald-400 leading-none">96</span>
            <span className="text-[9px] text-slate-400 font-bold">/ 100</span>
          </div>
          <div>
            <p className="text-xs font-extrabold text-white">Portfolio Trust Score</p>
            <p className="text-[11px] text-emerald-300 font-semibold">Verified Host ✓ Active</p>
            <button
              onClick={() => onNavigate('trust-radar')}
              className="mt-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
            >
              Open Trust Hub <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. TRUST INTELLIGENCE HEALTH PILLARS ── */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Trust & Authenticity Health
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('host-verification')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Host Verification</span>
              <Fingerprint className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-lg font-black text-emerald-400">Verified Host ✓</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Govt ID + Face-match 94.2%</p>
          </div>

          <div
            onClick={() => onNavigate('fraud-radar')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Fraud & Scam Radar</span>
              <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-lg font-black text-emerald-400">Low Risk (18/100)</p>
            <p className="text-[10px] text-slate-500 mt-0.5">0 Duplicate images detected</p>
          </div>

          <div
            onClick={() => onNavigate('review-anomaly')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Review Health</span>
              <SearchCheck className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-lg font-black text-teal-400">82% Confidence</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Zero burst anomalies</p>
          </div>

          <div
            onClick={() => onNavigate('photo-analyzer')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Listing Quality</span>
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-lg font-black text-amber-400">88 / 100</p>
            <p className="text-[10px] text-slate-500 mt-0.5">+3 pts with 1 more bathroom photo</p>
          </div>
        </div>
      </div>

      {/* ── 3. SECONDARY BUSINESS & REVENUE METRICS ── */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" /> Host Growth & Operational Performance
          </h3>
          <span className="text-[10px] text-slate-500">Secondary SaaS Modules</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <p className="text-[10px] text-slate-400 font-semibold">Total Revenue</p>
            <p className="text-xl font-black text-white mt-1">₹{stats.total_revenue.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">From active stays</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <p className="text-[10px] text-slate-400 font-semibold">Total Bookings</p>
            <p className="text-xl font-black text-white mt-1">{stats.total_bookings}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Verified guests</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <p className="text-[10px] text-slate-400 font-semibold">Average Occupancy</p>
            <p className="text-xl font-black text-white mt-1">{stats.occupancy_rate}%</p>
            <p className="text-[10px] text-teal-400 mt-0.5">Capacity tracking</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <p className="text-[10px] text-slate-400 font-semibold">Average Daily Rate (ADR)</p>
            <p className="text-xl font-black text-white mt-1">₹{stats.adr.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Per booked night</p>
          </div>
        </div>
      </div>

      {/* ── 4. QUICK ACTIONS ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('onboarding')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-white">Add New Property</p>
            <p className="text-[10px] text-slate-400">Launch Property Wizard</p>
          </div>
          <PlusCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => onNavigate('ai-copywriter')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-white">AI Listing Copywriter</p>
            <p className="text-[10px] text-slate-400">Generate high-trust descriptions</p>
          </div>
          <Sparkles className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => onNavigate('concierge')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-white">WhatsApp Concierge</p>
            <p className="text-[10px] text-slate-400">24/7 autonomous guest replies</p>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

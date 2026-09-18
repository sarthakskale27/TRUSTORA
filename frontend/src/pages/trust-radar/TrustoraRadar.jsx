import React, { useState } from 'react';
import {
  ShieldCheck, Fingerprint, ShieldAlert, SearchCheck, Compass,
  Award, Sparkles, TrendingUp, ArrowRight, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { HostVerification } from './HostVerification';
import { FraudRadar } from './FraudRadar';
import { ReviewAnomalyRadar } from './ReviewAnomalyRadar';
import { NeighbourhoodVibe } from './NeighbourhoodVibe';

export const TrustoraRadar = () => {
  const [subTab, setSubTab] = useState('hub');

  if (subTab === 'verification') return <HostVerification onBack={() => setSubTab('hub')} />;
  if (subTab === 'fraud') return <FraudRadar onBack={() => setSubTab('hub')} />;
  if (subTab === 'reviews') return <ReviewAnomalyRadar onBack={() => setSubTab('hub')} />;
  if (subTab === 'neighbourhood') return <NeighbourhoodVibe onBack={() => setSubTab('hub')} />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Hero */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 5 Core Trust Pillars
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              DEMO INTELLIGENCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Trustora Intelligence Hub</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            "Don't just book what looks good. Book what you can trust." Complete 5-pillar verification engine for informal rentals.
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 shrink-0">
          <div className="text-center">
            <p className="text-2xl font-black text-emerald-400">96/100</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Host Trust Rating</p>
          </div>
        </div>
      </div>

      {/* 5 Core Feature Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          {
            id: 'verification',
            title: '1. Verified Host',
            icon: Fingerprint,
            badge: 'Govt ID + Face-Match',
            score: '94% Confidence',
            desc: 'Multi-signal identity verification with Aadhaar / Passport validation & liveness face checks.',
            color: 'emerald'
          },
          {
            id: 'fraud',
            title: '2. Scam & Fraud Radar',
            icon: ShieldAlert,
            badge: 'NLP + Price Scan',
            score: 'Low Risk (18/100)',
            desc: 'Detects off-platform payment language, duplicate photos, and suspicious >40% underpricing.',
            color: 'rose'
          },
          {
            id: 'reviews',
            title: '3. Review Anomaly Radar',
            icon: SearchCheck,
            badge: 'Burst & Cluster Scan',
            score: '82% Confidence',
            desc: 'Analyzes reviews for sudden rating spikes, repeated phrasing, and templated positive clusters.',
            color: 'teal'
          },
          {
            id: 'neighbourhood',
            title: '4. Neighbourhood Vibe',
            icon: Compass,
            badge: 'Spatial Context',
            score: '91% Match',
            desc: 'Evaluates noise levels, family suitability, and walking distances to beaches, markets & transport.',
            color: 'amber'
          },
          {
            id: 'verification',
            title: '5. Explainable Trust Score',
            icon: Award,
            badge: 'Auditable Breakdown',
            score: '96/100 Total',
            desc: 'Every score factor explains WHY it was awarded, with supporting positive & risk signals.',
            color: 'indigo'
          }
        ].map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              onClick={() => setSubTab(p.id)}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-bold">
                    {p.badge}
                  </span>
                </div>
                <h3 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <span className="font-extrabold text-emerald-400">{p.score}</span>
                <span className="text-slate-400 group-hover:text-white flex items-center gap-1 text-[11px] font-bold">
                  Open Radar <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  SearchCheck, AlertTriangle, CheckCircle2, MessageSquare,
  Sparkles, Star, TrendingUp, BarChart2, Eye, X
} from 'lucide-react';

export const ReviewAnomalyRadar = () => {
  const [selectedReview, setSelectedReview] = useState(null);

  const sampleReviews = [
    {
      id: 1, guest: 'Kavita M.', rating: 5, date: '14 Sep 2026',
      text: 'Amazing stay! Very clean rooms and great hospitality. Will definitely visit again.',
      anomalyScore: 'Normal', flagged: false
    },
    {
      id: 2, guest: 'Ramesh K.', rating: 5, date: '12 Sep 2026',
      text: 'Best hotel in Goa! Super clean rooms, host was awesome. 10/10 recommended.',
      anomalyScore: 'Normal', flagged: false
    },
    {
      id: 3, guest: 'User9821', rating: 5, date: '11 Sep 2026',
      text: 'Super clean rooms, host was awesome. Best hotel in Goa! 10/10 recommended.',
      anomalyScore: 'Similar Wording (89% phrase overlap)', flagged: true
    },
    {
      id: 4, guest: 'Anita S.', rating: 4, date: '02 Aug 2026',
      text: 'Good location near the beach. Breakfast could be improved but overall a pleasant family trip.',
      anomalyScore: 'Normal (Natural Criticism)', flagged: false
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
              <SearchCheck className="w-4 h-4" /> Review Authenticity Engine
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              NLP ANOMALY RADAR
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Review Anomaly Radar</h1>
          <p className="text-xs text-slate-400 mt-1">
            Detect sudden review burst patterns, repeated phrasing, templated sentiment, and suspicious cluster spikes.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-teal-950/30 border border-teal-500/30 text-center shrink-0">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Review Confidence</p>
          <p className="text-2xl font-black text-teal-400">82 / 100</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-xs font-bold text-slate-400">Sentiment Distribution</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-400">Positive: 72%</span>
              <span className="text-slate-400">Neutral: 20%</span>
              <span className="text-rose-400">Negative: 8%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full flex overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: '72%' }} />
              <div className="bg-slate-500 h-full" style={{ width: '20%' }} />
              <div className="bg-rose-500 h-full" style={{ width: '8%' }} />
            </div>
            <p className="text-[10px] text-slate-500">Natural distribution includes healthy critical reviews.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-xs font-bold text-slate-400">Temporal Burst Analysis</p>
          <p className="text-xl font-black text-white">0 Spikes Detected</p>
          <p className="text-[10px] text-emerald-400">Reviews distributed smoothly over last 180 days.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-xs font-bold text-slate-400">Phrase Similarity Index</p>
          <p className="text-xl font-black text-amber-400">1 Anomaly Signal</p>
          <p className="text-[10px] text-slate-400">1 review contains &gt;80% phrase overlap with another review.</p>
        </div>
      </div>

      {/* Reviews Table with Anomaly Evidence */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-400" /> Review Stream & Anomaly Signals
          </h3>
          <span className="text-[10px] text-slate-400">4 sample reviews analyzed</span>
        </div>

        <div className="space-y-3">
          {sampleReviews.map((r) => (
            <div
              key={r.id}
              className={`p-4 rounded-2xl border transition-all ${
                r.flagged
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{r.guest}</span>
                  <div className="flex items-center text-amber-400 text-xs">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500">{r.date}</span>
                </div>
                {r.flagged ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {r.anomalyScore}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    Authentic Pattern
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Honest Anomaly Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
        <strong className="text-slate-300">Anomaly Signal Disclaimer:</strong> Anomaly indicators denote potentially unusual patterns (e.g. repeated phrasing), <em>not conclusive proof</em> of fraudulent reviews. Additional context may apply.
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, X, AlertTriangle, CheckCircle2, Info, HelpCircle,
  Calendar, Award, Sparkles, ChevronDown, ChevronUp, History,
  Fingerprint, SearchCheck, Compass, Camera, FileText
} from 'lucide-react';
import api from '../../services/api';

export const TrustReportModal = ({ propertyId, isOpen, onClose }) => {
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWhy, setActiveWhy] = useState(null);

  useEffect(() => {
    if (!isOpen || !propertyId) return;
    setLoading(true);
    Promise.all([
      api.get(`/trust/report/${propertyId}`).catch(() => ({ data: null })),
      api.get(`/trust/score-history/${propertyId}`).catch(() => ({ data: { history: [] } })),
      api.get(`/trust/timeline/${propertyId}`).catch(() => ({ data: { timeline: [] } }))
    ]).then(([repRes, histRes, timeRes]) => {
      setReport(repRes.data);
      setHistory(histRes.data?.history || []);
      setTimeline(timeRes.data?.timeline || []);
    }).finally(() => setLoading(false));
  }, [isOpen, propertyId]);

  if (!isOpen) return null;

  const getScoreColor = (pct) => {
    if (pct >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
    if (pct >= 70) return 'text-teal-400 border-teal-500/30 bg-teal-950/20';
    if (pct >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/30 bg-rose-950/20';
  };

  const getFactorIcon = (key) => {
    switch (key) {
      case 'host_verification': return Fingerprint;
      case 'listing_consistency': return FileText;
      case 'review_confidence': return SearchCheck;
      case 'fraud_risk': return ShieldCheck;
      case 'photo_quality': return Camera;
      case 'neighbourhood': return Compass;
      default: return ShieldCheck;
    }
  };

  const factorTitles = {
    host_verification: 'Host Verification',
    listing_consistency: 'Listing Consistency',
    review_confidence: 'Review Confidence',
    fraud_risk: 'Fraud Risk Analysis',
    photo_quality: 'Photo Quality Radar',
    neighbourhood: 'Neighbourhood Context',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">Trustora Intelligence Report</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  DEMO DATA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-signal explainable verification score & audit trail
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Evaluating multi-signal trust pipeline...</p>
            </div>
          ) : !report ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Unable to generate Trust Report. Please try again.
            </div>
          ) : (
            <>
              {/* Top Score Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-950 to-teal-950/60 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5 text-center sm:text-left">
                  <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 flex flex-col items-center justify-center shadow-xl shrink-0">
                    <span className="text-3xl font-black text-emerald-400 leading-none">
                      {report.total_score}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1">
                      / {report.max_score}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Overall Trust Score
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        High Confidence
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white">
                      {report.total_score >= 85 ? 'Verified Authentic Listing' : 'Moderate Trust Rating'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                      Calculated using 6 weighted trust vectors across host identity, listing consistency, reviews, fraud signals, photos, and neighbourhood context.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full md:w-auto shrink-0">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400">Fraud Risk</p>
                    <p className="text-xs font-extrabold text-emerald-400 uppercase">{report.fraud_level || 'LOW'}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400">Review Health</p>
                    <p className="text-xs font-extrabold text-teal-400">{report.review_confidence_score || 85}%</p>
                  </div>
                </div>
              </div>

              {/* 6 Trust Score Factors Breakdown */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Factor-by-Factor Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(report.breakdown || {}).map(([key, factor]) => {
                    const Icon = getFactorIcon(key);
                    const title = factorTitles[key] || key;
                    const isWhyOpen = activeWhy === key;
                    return (
                      <div
                        key={key}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white">{title}</h5>
                              <span className="text-[10px] text-slate-500">Confidence: {factor.signals?.confidence || 80}%</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-emerald-400">{factor.score}</span>
                            <span className="text-[10px] text-slate-500 font-semibold"> / {factor.max}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, factor.pct)}%` }}
                          />
                        </div>

                        {/* Signals */}
                        <div className="space-y-1 text-[11px]">
                          {factor.signals?.positive?.slice(0, 2).map((sig, i) => (
                            <p key={i} className="text-emerald-400/90 flex items-start gap-1.5 leading-tight">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{sig}</span>
                            </p>
                          ))}
                          {factor.signals?.risk?.slice(0, 2).map((sig, i) => (
                            <p key={i} className="text-amber-400/90 flex items-start gap-1.5 leading-tight">
                              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                              <span>{sig}</span>
                            </p>
                          ))}
                        </div>

                        {/* "Why am I seeing this?" collapsible */}
                        <div className="pt-2 border-t border-slate-800/60">
                          <button
                            onClick={() => setActiveWhy(isWhyOpen ? null : key)}
                            className="text-[10px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition-colors"
                          >
                            <HelpCircle className="w-3 h-3" />
                            <span>Why am I seeing this?</span>
                            {isWhyOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                          {isWhyOpen && (
                            <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed animate-fadeIn">
                              <p>{factor.explanation}</p>
                              <div className="mt-2 pt-2 border-t border-slate-800 text-[9px] text-slate-500 flex justify-between">
                                <span>Last evaluated: {new Date(factor.last_updated).toLocaleDateString()}</span>
                                <span>Weight: {factor.max} pts ({Math.round(factor.max / report.max_score * 100)}%)</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trust Score History & Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Score History */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-teal-400" /> Trust Score History
                    </h5>
                    <span className="text-[9px] text-slate-500">Last 6 Months (DEMO)</span>
                  </div>
                  <div className="space-y-2">
                    {history.map((h, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900/60 border border-slate-800/50">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-bold w-8">{h.month}</span>
                          <span className="text-slate-300 text-[11px] truncate max-w-[160px]">{h.event || 'Routine verification scan'}</span>
                        </div>
                        <span className="font-extrabold text-emerald-400">{h.score}/100</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Timeline */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-400" /> Trust Audit Timeline
                    </h5>
                    <span className="text-[9px] text-emerald-400 font-bold">Verified Audit Trail</span>
                  </div>
                  <div className="space-y-2 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 pl-6">
                    {timeline.map((item, i) => (
                      <div key={i} className="relative text-xs">
                        <span className="absolute -left-6 top-1 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-slate-950" />
                        <p className="font-bold text-slate-200 text-[11px]">{item.title}</p>
                        <p className="text-[10px] text-slate-400">{item.detail}</p>
                        <span className="text-[9px] text-slate-500">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-500 leading-relaxed">
                <strong className="text-slate-400">Important Trustora Transparency Notice:</strong> All verification metrics, fraud signals, and scores are generated using deterministic demo heuristics and simulated signals. Trustora uses conservative phrasing such as "Verification confidence" and "Potential risk detected". No guarantee of absolute authenticity is made.
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <span className="text-[11px] text-slate-500">Trustora Trust Intelligence Engine v3.0</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

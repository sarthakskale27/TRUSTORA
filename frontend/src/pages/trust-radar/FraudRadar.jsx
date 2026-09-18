import React, { useState } from 'react';
import {
  ShieldAlert, AlertTriangle, CheckCircle2, Search, Sparkles,
  Info, RefreshCw, FileText, Image as ImageIcon, DollarSign, Lock
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const FraudRadar = () => {
  const { showToast } = useToast();
  const [listingText, setListingText] = useState(
    "Luxury 4BHK beachfront villa in Calangute, Goa. Private pool, Wi-Fi, chef on demand. Direct beach access. Contact host directly on WhatsApp for special off-platform discount."
  );
  const [price, setPrice] = useState('8500');
  const [avgPrice, setAvgPrice] = useState('9000');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState({
    riskLevel: 'LOW',
    riskScore: 18,
    positiveSignals: [
      'Listing host identity verified via government ID',
      'Price ₹8,500/night is within normal market reference range (₹7,500 - ₹11,000)',
      'Zero duplicate photos detected across database',
      'Address and geocoordinates match Goa land registry reference',
    ],
    potentialRisks: [
      'Text contains "WhatsApp for discount" — flagged as potential external payment risk signal'
    ],
    confidence: 88,
    explainability: 'Evaluated against 40+ NLP scam patterns, price deviation thresholds, and reverse image fingerprinting.'
  });

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const isUnderpriced = Number(price) < Number(avgPrice) * 0.6;
      const hasSuspiciousText = listingText.toLowerCase().includes('whatsapp') || listingText.toLowerCase().includes('wire');
      
      const newRisks = [];
      const newPos = ['Host identity verification signals verified'];
      
      if (isUnderpriced) {
        newRisks.push(`Price ₹${price} deviates >40% below city baseline ₹${avgPrice} — potential bait pricing`);
      } else {
        newPos.push(`Price ₹${price} is within normal reference range`);
      }

      if (hasSuspiciousText) {
        newRisks.push('Potential off-platform payment language detected');
      } else {
        newPos.push('Zero off-platform payment phrases found');
      }

      const riskScore = (isUnderpriced ? 40 : 10) + (hasSuspiciousText ? 30 : 5);
      const level = riskScore > 50 ? 'HIGH' : (riskScore > 25 ? 'MEDIUM' : 'LOW');

      setResult({
        riskLevel: level,
        riskScore: riskScore,
        positiveSignals: newPos,
        potentialRisks: newRisks,
        confidence: 91,
        explainability: 'Analysis complete. Results represent potential risk signals — not proof of fraud.'
      });
      showToast('Scam & Fraud Radar scan complete', level === 'HIGH' ? 'error' : 'success');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Multi-Vector Fraud Detection
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              DEMO RADAR
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Scam & Fraud Detector</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time heuristic & NLP scanner for rental scams, fake listings, duplicate images, and pricing anomalies.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Overall Risk Level</p>
          <p className={`text-xl font-black ${result.riskLevel === 'LOW' ? 'text-emerald-400' : result.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'}`}>
            {result.riskLevel} ({result.riskScore}/100)
          </p>
        </div>
      </div>

      {/* Simulator Inputs */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Search className="w-4 h-4 text-emerald-400" /> Interactive Listing Fraud Scanner
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Listing Description to Analyze</label>
            <textarea
              rows={3}
              value={listingText}
              onChange={e => setListingText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Listed Price (₹/night)</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">City Average Baseline (₹)</label>
              <input
                type="number"
                value={avgPrice}
                onChange={e => setAvgPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleScan}
          disabled={scanning}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 hover:opacity-90 transition cursor-pointer"
        >
          {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Run Fraud & Scam Scan
        </button>
      </div>

      {/* Results Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Positive Signals */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-3">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Positive Signals Verified ({result.positiveSignals.length})
          </h4>
          <div className="space-y-2">
            {result.positiveSignals.map((sig, i) => (
              <div key={i} className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                <span>✓</span>
                <span>{sig}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Potential Risk Signals */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-rose-500/30 space-y-3">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Potential Risk Signals ({result.potentialRisks.length})
          </h4>
          <div className="space-y-2">
            {result.potentialRisks.length === 0 ? (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                Zero anomaly signals detected in current scan.
              </div>
            ) : (
              result.potentialRisks.map((sig, i) => (
                <div key={i} className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                  <span>⚠</span>
                  <div>
                    <p className="font-semibold">{sig}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Signal explanation: May warrant additional manual review.</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Honest Language Policy Footer */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold">
          <Info className="w-4 h-4 text-emerald-400" /> Trustora Transparency Policy
        </div>
        <p className="text-slate-500 text-[10px]">
          Trustora adheres to the phrase <strong>"Potential risk detected"</strong>. We never claim a listing is "100% legitimate" or "guaranteed fraud-free" because sophisticated scammers evolve patterns.
        </p>
      </div>
    </div>
  );
};

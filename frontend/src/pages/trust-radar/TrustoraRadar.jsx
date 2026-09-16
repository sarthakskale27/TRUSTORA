import React, { useState } from 'react';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, TrendingUp, Award,
  Lock, Search, MapPin, Sparkles, RefreshCw, Fingerprint,
  FileCheck, Camera, ShieldAlert, Check, XCircle, Info, Upload
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const TrustoraRadar = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const [idType, setIdType] = useState('Aadhaar Card');
  const [idFileUploaded, setIdFileUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState({
    verified: true,
    score: 100,
    faceMatchScore: 98.4,
    idAuthenticity: 99.1,
    badgeIssued: 'Platinum Verified Host'
  });

  const [listingUrl, setListingUrl] = useState('');
  const [listingPrice, setListingPrice] = useState('8500');
  const [marketAvgPrice, setMarketAvgPrice] = useState('9000');
  const [scanningFraud, setScanningFraud] = useState(false);
  const [fraudResult, setFraudResult] = useState({
    scamRisk: 'Low (2%)',
    priceFairness: 'Normal (-5.5% vs market)',
    duplicateImageDetected: false,
    suspiciousKeywords: 'None detected',
    confidenceScore: '98/100'
  });

  const handleRunVerification = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setIdFileUploaded(true);
      setSelfieUploaded(true);
      setVerificationResult({
        verified: true,
        score: 100,
        faceMatchScore: 99.2,
        idAuthenticity: 99.8,
        badgeIssued: 'Trustora Verified Host Badge Active'
      });
      showToast('Govt ID and Biometric Face-Match Verified Successfully!', 'success');
    }, 1500);
  };

  const handleScanFraud = () => {
    setScanningFraud(true);
    setTimeout(() => {
      setScanningFraud(false);
      const priceDev = (Number(listingPrice) - Number(marketAvgPrice)) / Number(marketAvgPrice);
      const isUnderpriced = priceDev < -0.40;
      setFraudResult({
        scamRisk: isUnderpriced ? 'High (84%) - Suspicious Underpricing' : 'Low (1.8%)',
        priceFairness: (priceDev * 100).toFixed(1) + '% vs city average',
        duplicateImageDetected: false,
        suspiciousKeywords: isUnderpriced ? 'Flagged: Price deviates >40% from neighborhood baseline' : 'Zero wire-transfer or scam phrases detected',
        confidenceScore: isUnderpriced ? '42/100 (High Risk)' : '98/100 (Safe)'
      });
      showToast('Trustora Scam and Fraud Scan complete!', isUnderpriced ? 'error' : 'success');
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-teal-950/50 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Trustora Trust Intelligence Layer
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Slide 4 Architecture
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Trustora Intelligence & Fraud Radar</h1>
          <p className="text-xs text-slate-400 mt-1">
            Explainable Trust Scores (0-100), Host ID & Face-Match, Scam Radar, Review Anomaly Detection & Neighborhood Vibe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs">
            Overall Trust Score: 96/100
          </span>
        </div>
      </div>

      {/* 5 Slide 4 Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
        {[
          { id: 'overview', label: '5-Feature Overview' },
          { id: 'host-verify', label: '1) Verified Host (ID + Face Match)' },
          { id: 'fraud-detector', label: '2) Scam & Fraud Detector' },
          { id: 'anomaly-radar', label: '3) Review Anomaly Radar' },
          { id: 'neighbourhood', label: '4) Neighbourhood Vibe' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={'px-4 py-2.5 rounded-xl transition-all cursor-pointer ' + (
              activeTab === t.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 font-black'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & EXPLAINABLE SCORE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Explainable Trust Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-emerald-400">96</span>
                  <span className="text-lg text-slate-500 font-bold">/ 100</span>
                </div>
                <p className="text-xs text-emerald-300 font-semibold mt-1">Tier: Platinum Verified Host</p>
              </div>

              <div className="space-y-2 mt-6 pt-4 border-t border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Host ID Authenticity:</span>
                  <span className="text-white font-bold">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Review Anomaly Risk:</span>
                  <span className="text-emerald-400 font-bold">0% (Clean)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scam & Duplicate Risk:</span>
                  <span className="text-emerald-400 font-bold">Low</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Neighbourhood Safety:</span>
                  <span className="text-white font-bold">94/100</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" /> Reasons Behind The Score (Explainable AI)
              </h3>
              
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-300 font-bold">Verified Host Authenticity (+15 pts)</p>
                    <p className="text-slate-400 text-[11px]">Government Aadhaar & biometric face-matching confirmed 100% match with property owner.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-300 font-bold">Organic Review Velocity (+8 pts)</p>
                    <p className="text-slate-400 text-[11px]">141 reviews distributed evenly across 180 days with zero unnatural burst clusters.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-300 font-bold">Transparent Market Pricing (+8 pts)</p>
                    <p className="text-slate-400 text-[11px]">Nightly tariff closely matches the surrounding neighborhood benchmark.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-200 font-bold">Neighborhood Vibe Verified</p>
                    <p className="text-slate-400 text-[11px]">Consensus summary: "Quiet area, 5 min from the beach, family-friendly."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FEATURE 1 — VERIFIED HOST (ID + FACE MATCH) */}
      {activeTab === 'host-verify' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Slide 4 • Feature 1</span>
            <h2 className="text-xl font-bold text-white mt-1">Verified Host: ID Upload & Face-Match Verification</h2>
            <p className="text-xs text-slate-400">
              Generates an authentic Trustora Verified Host Badge through ID document verification and facial biometric matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Step 1: Government ID Upload</h3>
              </div>
              
              <div>
                <label className="text-xs text-slate-400 block mb-1">Document Type</label>
                <select
                  value={idType}
                  onChange={e => setIdType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option>Aadhaar Card</option>
                  <option>Passport</option>
                  <option>Driving License</option>
                  <option>PAN Card</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center space-y-2">
                <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">{idType} (front & back)</p>
                <p className="text-[10px] text-slate-500">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Step 2: Biometric Face-Match</h3>
              </div>

              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center space-y-2">
                <Fingerprint className="w-8 h-8 text-teal-400 mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">Live Selfie Verification</p>
                <p className="text-[10px] text-slate-500">AI compares facial embeddings against ID photo</p>
              </div>

              <button
                onClick={handleRunVerification}
                disabled={verifying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {verifying ? 'Running Biometric Face-Match...' : 'Run Verification & Issue Badge'}
              </button>
            </div>
          </div>

          {verificationResult.verified && (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-white font-black text-sm">{verificationResult.badgeIssued}</p>
                  <p className="text-xs text-emerald-300">
                    ID Authenticity: {verificationResult.idAuthenticity}% • Face Match: {verificationResult.faceMatchScore}%
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs border border-emerald-500/40">
                100% Authentic
              </span>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FEATURE 2 — SCAM & FRAUD DETECTOR */}
      {activeTab === 'fraud-detector' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div>
            <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">Slide 4 • Feature 2</span>
            <h2 className="text-xl font-bold text-white mt-1">Scam & Fraud Detector</h2>
            <p className="text-xs text-slate-400">
              Analyzes listing text, underpricing anomalies, duplicate photos, and suspicious patterns to flag fake listings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Nightly Price (₹)</label>
              <input
                type="number"
                value={listingPrice}
                onChange={e => setListingPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                placeholder="e.g. 8500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Neighborhood Market Average (₹)</label>
              <input
                type="number"
                value={marketAvgPrice}
                onChange={e => setMarketAvgPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                placeholder="e.g. 9000"
              />
            </div>
          </div>

          <button
            onClick={handleScanFraud}
            disabled={scanningFraud}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-lg hover:opacity-90 transition flex items-center gap-2 cursor-pointer"
          >
            {scanningFraud ? <RefreshCw className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
            {scanningFraud ? 'Scanning Listing & Patterns...' : 'Run Scam & Underpricing Scan'}
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Scam Risk Assessment</p>
              <p className="text-sm font-black text-white mt-1">{fraudResult.scamRisk}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Price Deviation</p>
              <p className="text-sm font-black text-white mt-1">{fraudResult.priceFairness}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Stock Photo / Duplication</p>
              <p className="text-sm font-black text-emerald-400 mt-1">Zero Duplication Detected</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FEATURE 3 — REVIEW ANOMALY RADAR */}
      {activeTab === 'anomaly-radar' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Slide 4 • Feature 3</span>
            <h2 className="text-xl font-bold text-white mt-1">Review Anomaly Radar</h2>
            <p className="text-xs text-slate-400">
              Detects unusual review patterns: repeated wording across accounts, sudden 24h review bursts, and sockpuppet rings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Burst Cluster Velocity</span>
              <p className="text-lg font-black text-emerald-400 mt-1">0 Spikes</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Reviews distributed naturally over months</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Linguistic Similarity Index</span>
              <p className="text-lg font-black text-emerald-400 mt-1">12% (Organic)</p>
              <p className="text-[10px] text-slate-400 mt-0.5">No copy-paste or bot templates detected</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Verified Guest Ratio</span>
              <p className="text-lg font-black text-emerald-400 mt-1">100%</p>
              <p className="text-[10px] text-slate-400 mt-0.5">All 141 reviews backed by actual completed stays</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FEATURE 4 — NEIGHBOURHOOD VIBE */}
      {activeTab === 'neighbourhood' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div>
            <span className="text-xs text-teal-400 font-bold uppercase tracking-wider">Slide 4 • Feature 4</span>
            <h2 className="text-xl font-bold text-white mt-1">Neighbourhood Vibe & Context Intelligence</h2>
            <p className="text-xs text-slate-400">
              Combines reviews with hyper-local data to generate summaries: "Quiet area, 5 min from the beach, family-friendly."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { area: 'North Goa (Calangute / Anjuna)', vibe: 'Quiet area, 5 min from the beach, family-friendly.', safety: 96, walk: 90 },
              { area: 'Old Manali Hills', vibe: 'Peaceful pine forest trails, mountain view, cozy cafes.', safety: 94, walk: 82 },
              { area: 'Amber Quarter, Jaipur', vibe: 'Historic heritage area, 10 min to palaces & artisan bazaars.', safety: 92, walk: 88 },
              { area: 'Alleppey Backwaters, Kerala', vibe: 'Serene lakeside retreat, fresh seafood & tranquil canoe routes.', safety: 98, walk: 75 }
            ].map(v => (
              <div key={v.area} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <p className="text-white font-bold text-sm">{v.area}</p>
                </div>
                <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/20 text-xs text-teal-300">
                  <span className="font-bold">✨ Vibe Summary:</span> "{v.vibe}"
                </div>
                <div className="flex justify-between text-xs text-slate-400 pt-1">
                  <span>Safety Score: <strong className="text-emerald-400">{v.safety}/100</strong></span>
                  <span>Walkability: <strong className="text-white">{v.walk}/100</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Fingerprint, ShieldCheck, Upload, Camera, CheckCircle2, AlertTriangle,
  Loader2, FileText, UserCheck, Lock, Award, RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const HostVerification = () => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [idType, setIdType] = useState('Aadhaar Card (UIDAI)');
  const [fullName, setFullName] = useState('Rohan Mehta');
  const [idNumber, setIdNumber] = useState('XXXX-XXXX-4829');
  const [docFrontUploaded, setDocFrontUploaded] = useState(true);
  const [docBackUploaded, setDocBackUploaded] = useState(true);
  const [selfieUploaded, setSelfieUploaded] = useState(true);
  const [verStatus, setVerStatus] = useState({
    status: 'verified',
    confidence: 94.2,
    faceMatchScore: 98.4,
    idAuthenticity: 99.1,
    badgeIssued: 'Trustora Verified Host ✓'
  });

  useEffect(() => {
    api.get('/trust/host/verification/status')
      .then(res => {
        if (res.data) {
          setVerStatus(prev => ({
            ...prev,
            status: res.data.status || 'verified',
            confidence: res.data.confidence || 94.2,
            faceMatchScore: res.data.face_match_score || 98.4,
            idAuthenticity: res.data.id_authenticity_score || 99.1,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleRunVerification = async () => {
    setLoading(true);
    try {
      const res = await api.post('/trust/host/verification/submit', {
        step: 5,
        id_type: idType,
        full_name: fullName,
        id_number: idNumber
      });
      setVerStatus({
        status: 'verified',
        confidence: res.data.confidence || 94.2,
        faceMatchScore: res.data.face_match_score || 98.1,
        idAuthenticity: res.data.id_authenticity_score || 99.3,
        badgeIssued: 'Trustora Verified Host ✓'
      });
      setStep(6);
      showToast('Host identity verification signals processed successfully!', 'success');
    } catch (e) {
      setStep(6);
      showToast('Verification signals submitted (DEMO MODE).', 'success');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Identity Info' },
    { num: 2, title: 'Document Upload' },
    { num: 3, title: 'Selfie Snapshot' },
    { num: 4, title: 'Document Checks' },
    { num: 5, title: 'Biometric Face-Match' },
    { num: 6, title: 'Verification Result' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4" /> Multi-Signal Host Identity
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              DEMO WORKFLOW
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Host Identity Verification Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete government ID verification and biometric face-match to earn the <strong className="text-emerald-400">Verified Host ✓</strong> badge.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
            ✓
          </div>
          <div>
            <p className="text-xs font-bold text-white">Status: {verStatus.status === 'verified' ? 'Verified Host' : 'In Review'}</p>
            <p className="text-[10px] text-emerald-400">Confidence: {verStatus.confidence}%</p>
          </div>
        </div>
      </div>

      {/* Progress Steps Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
        {steps.map((s) => {
          const isDone = s.num < step || verStatus.status === 'verified';
          const isCurr = s.num === step;
          return (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isCurr
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : isDone
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-950 text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isCurr ? 'bg-white text-emerald-900' : isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {isDone ? '✓' : s.num}
              </span>
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        {step === 1 && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" /> Step 1: Legal Identity Information
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Government ID Type</label>
              <select
                value={idType}
                onChange={e => setIdType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="Aadhaar Card (UIDAI)">Aadhaar Card (UIDAI)</option>
                <option value="Passport (Govt of India)">Passport (Govt of India)</option>
                <option value="Driving Licence">Driving Licence</option>
                <option value="Voter ID (ECI)">Voter ID (ECI)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Legal Name</label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Document Number (Masked for Security)</label>
              <input
                value={idNumber}
                onChange={e => setIdNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-all"
            >
              Continue to Document Upload →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" /> Step 2: Upload Government Document
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-emerald-500/40 text-center space-y-2">
                <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-white">Front Side</p>
                <p className="text-[10px] text-slate-400">aadhaar_front_scan.jpg (Verified)</p>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">Uploaded ✓</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-emerald-500/40 text-center space-y-2">
                <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-white">Back Side</p>
                <p className="text-[10px] text-slate-400">aadhaar_back_scan.jpg (Verified)</p>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">Uploaded ✓</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">Back</button>
              <button onClick={() => setStep(3)} className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">Continue to Selfie →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" /> Step 3: Live Selfie Snapshot
            </h3>
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" alt="Selfie" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">Liveness Check: Passed</p>
                <p className="text-[11px] text-emerald-400 font-semibold">3D Depth & Glare Verification: Normal</p>
                <p className="text-[10px] text-slate-500">Captured: Today at 11:20 AM</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">Back</button>
              <button onClick={() => setStep(4)} className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">Run Verification Checks →</button>
            </div>
          </div>
        )}

        {step >= 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
                <p className="text-[10px] text-slate-400">Document Authenticity</p>
                <p className="text-xl font-black text-emerald-400">{verStatus.idAuthenticity}%</p>
                <p className="text-[10px] text-emerald-300">✓ Security microprint matched</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
                <p className="text-[10px] text-slate-400">Biometric Face-Match</p>
                <p className="text-xl font-black text-teal-400">{verStatus.faceMatchScore}%</p>
                <p className="text-[10px] text-teal-300">✓ 128 Facial landmarks aligned</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
                <p className="text-[10px] text-slate-400">Verification Confidence</p>
                <p className="text-xl font-black text-emerald-400">{verStatus.confidence}%</p>
                <p className="text-[10px] text-emerald-300">✓ Trustora Verified Badge</p>
              </div>
            </div>

            {/* Results Callout */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-teal-950/40 border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-600/30">
                  🛡️
                </div>
                <div>
                  <h4 className="text-base font-black text-white">Trustora Verified Host ✓ Badge Active</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your properties now show the Verified Host trust badge, boosting guest confidence and booking conversion.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRunVerification}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-2 cursor-pointer shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Re-Run Verification Scan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Honest Language Notice */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <AlertTriangle className="w-4 h-4" /> Identity Verification Language Policy
        </div>
        <p className="text-slate-500 text-[10px] leading-relaxed">
          Trustora displays <strong>"Verification confidence"</strong> and <strong>"Verification signals"</strong> rather than guaranteeing 100% identity authenticity. Demo identity data is simulated and prepared for plug-and-play integration with licensed Indian KYC providers (DigiLocker / UIDAI).
        </p>
      </div>
    </div>
  );
};

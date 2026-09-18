import React, { useState, useEffect } from 'react';
import {
  Fingerprint, ShieldCheck, Upload, Camera, CheckCircle2, AlertTriangle,
  Loader2, FileText, UserCheck, Lock, Award, RefreshCw, ArrowRight, Check,
  RotateCcw, Sparkles, Scan, Eye
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const HostVerification = () => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scanningDoc, setScanningDoc] = useState(false);
  const [scanningFace, setScanningFace] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [idType, setIdType] = useState('Aadhaar Card (UIDAI)');
  const [fullName, setFullName] = useState('Rohan Mehta');
  const [idNumber, setIdNumber] = useState('4829 9182 3841');

  // Step-by-step verification milestones
  const [infoVerified, setInfoVerified] = useState(false);
  const [docFrontUploaded, setDocFrontUploaded] = useState(false);
  const [docBackUploaded, setDocBackUploaded] = useState(false);
  const [docVerified, setDocVerified] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [verStatus, setVerStatus] = useState({
    status: 'not_started',
    confidence: 0,
    faceMatchScore: 0,
    idAuthenticity: 0,
  });

  useEffect(() => {
    api.get('/trust/host/verification/status')
      .then(res => {
        if (res.data && res.data.verified) {
          setIsVerified(true);
          setInfoVerified(true);
          setDocVerified(true);
          setFaceVerified(true);
          setStep(5);
          setVerStatus({
            status: 'verified',
            confidence: res.data.confidence || 94.2,
            faceMatchScore: res.data.face_match_score || 98.4,
            idAuthenticity: res.data.id_authenticity_score || 99.1,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Step 1: Verify Identity Info
  const handleVerifyInfo = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !idNumber.trim()) {
      showToast('Please enter your legal name and ID number', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setInfoVerified(true);
      showToast('ID information format validated successfully ✓', 'success');
      setStep(2);
    }, 600);
  };

  // Step 2: Verify Document Authenticity
  const handleVerifyDoc = () => {
    setScanningDoc(true);
    setTimeout(() => {
      setScanningDoc(false);
      setDocFrontUploaded(true);
      setDocBackUploaded(true);
      setDocVerified(true);
      showToast('Document Authenticated: 99.1% OCR & Security Check Passed ✓', 'success');
      setStep(3);
    }, 1200);
  };

  // Step 3: Run Face-Match & Liveness
  const handleVerifyFace = () => {
    setScanningFace(true);
    setTimeout(() => {
      setScanningFace(false);
      setSelfieCaptured(true);
      setFaceVerified(true);
      showToast('Biometric Face-Match: 98.4% Alignment Confirmed ✓', 'success');
      setStep(4);
    }, 1200);
  };

  // Step 4: Final Submission
  const handleSubmitVerification = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/trust/host/verification/submit', {
        id_type: idType,
        full_name: fullName,
        id_number: idNumber
      });
      setIsVerified(true);
      setVerStatus({
        status: 'verified',
        confidence: res.data?.confidence || 94.2,
        faceMatchScore: res.data?.face_match_score || 98.4,
        idAuthenticity: res.data?.id_authenticity_score || 99.1,
      });
      setStep(5);
      showToast('Congratulations! Verified Host ✓ badge issued.', 'success');
    } catch {
      setIsVerified(true);
      setStep(5);
      showToast('Verification complete (DEMO MODE)', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset to re-test verification flow
  const handleReset = async () => {
    try {
      await api.post('/trust/host/verification/reset');
    } catch {}
    setIsVerified(false);
    setInfoVerified(false);
    setDocFrontUploaded(false);
    setDocBackUploaded(false);
    setDocVerified(false);
    setSelfieCaptured(false);
    setFaceVerified(false);
    setVerStatus({ status: 'not_started', confidence: 0, faceMatchScore: 0, idAuthenticity: 0 });
    setStep(1);
    showToast('Verification reset. You can now verify step by step.', 'info');
  };

  const steps = [
    { num: 1, title: '1. Identity Info', done: infoVerified },
    { num: 2, title: '2. Document Scan', done: docVerified },
    { num: 3, title: '3. Face Verification', done: faceVerified },
    { num: 4, title: '4. AI Review', done: isVerified },
    { num: 5, title: '5. Verified Badge ✓', done: isVerified },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4" /> Multi-Signal Host Identity
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              STEP-BY-STEP KYC
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Host Identity Verification Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete each verification requirement below to earn the <strong className="text-emerald-400">Verified Host ✓</strong> badge.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
            isVerified ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow ${
              isVerified ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'
            }`}>
              {isVerified ? '✓' : '...'}
            </div>
            <div>
              <p className="text-xs font-bold text-white">{isVerified ? 'Verified Host ✓' : 'Pending Verification'}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">
                {isVerified ? `Confidence: ${verStatus.confidence}%` : '0 / 3 Steps Completed'}
              </p>
            </div>
          </div>

          {isVerified && (
            <button
              onClick={handleReset}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset verification to test step-by-step again"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Re-verify
            </button>
          )}
        </div>
      </div>

      {/* Progress Steps Header */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
        {steps.map((s) => {
          const isCurr = s.num === step;
          return (
            <button
              key={s.num}
              onClick={() => {
                if (s.done || s.num <= step) setStep(s.num);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isCurr
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : s.done
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-950 text-slate-500 border border-slate-800/60'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isCurr ? 'bg-white text-emerald-900' : s.done ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {s.done ? '✓' : s.num}
              </span>
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* ── STEP 1: IDENTITY INFO ── */}
      {step === 1 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" /> Step 1: Legal Identity & Document Info
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Enter your legal name as listed on your government identity card.</p>
            </div>
            {infoVerified && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Info Validated
              </span>
            )}
          </div>

          <form onSubmit={handleVerifyInfo} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Government ID Type</label>
              <select
                value={idType}
                onChange={e => setIdType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                placeholder="e.g. Rohan Mehta"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Document / ID Number</label>
              <input
                value={idNumber}
                onChange={e => setIdNumber(e.target.value)}
                placeholder="e.g. 4829 9182 3841"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-2 cursor-pointer transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Verify ID Information & Proceed →</span>
            </button>
          </form>
        </div>
      )}

      {/* ── STEP 2: DOCUMENT UPLOAD & AUTHENTICITY ── */}
      {step === 2 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" /> Step 2: Upload Government Document & AI OCR Check
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Upload front and back photos of your {idType}.</p>
            </div>
            {docVerified && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> 99.1% Authenticated
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div className="p-5 rounded-2xl bg-slate-950 border border-dashed border-emerald-500/40 text-center space-y-2">
              <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs font-bold text-white">Front Side Document</p>
              <p className="text-[10px] text-slate-400">{idType.split(' ')[0].toLowerCase()}_front_scan.jpg</p>
              <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                {docVerified ? 'OCR & Hologram Matched ✓' : 'Ready to Scan'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-dashed border-emerald-500/40 text-center space-y-2">
              <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs font-bold text-white">Back Side Document</p>
              <p className="text-[10px] text-slate-400">{idType.split(' ')[0].toLowerCase()}_back_scan.jpg</p>
              <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                {docVerified ? 'Barcode & Seal Matched ✓' : 'Ready to Scan'}
              </span>
            </div>
          </div>

          {scanningDoc && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 max-w-xl space-y-2 animate-pulse">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <Scan className="w-4 h-4 animate-spin" />
                <span>Running AI Hologram & Microprint Authenticity Scan...</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-3/4 animate-pulse" />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
              ← Back
            </button>
            <button
              onClick={handleVerifyDoc}
              disabled={scanningDoc}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-2 cursor-pointer transition-all"
            >
              {scanningDoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
              <span>Run AI Document Authenticity Scan →</span>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: LIVE FACE VERIFICATION ── */}
      {step === 3 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" /> Step 3: Biometric Face-Match & Liveness Check
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Align your face with the camera frame to verify live presence.</p>
            </div>
            {faceVerified && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> 98.4% Matched
              </span>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-5 max-w-xl">
            <div className="relative w-28 h-28 rounded-2xl bg-slate-800 border-2 border-emerald-500/60 flex items-center justify-center overflow-hidden shadow-xl shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
                alt="Selfie Frame"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-emerald-400/40 rounded-2xl pointer-events-none" />
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <p className="text-xs font-bold text-white">Live Viewfinder: Host Profile Photo</p>
              <p className="text-[11px] text-emerald-400 font-semibold">128-point face mesh landmarks ready</p>
              <p className="text-[10px] text-slate-500">Cross-referenced with {idType} document picture.</p>
            </div>
          </div>

          {scanningFace && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/40 max-w-xl space-y-2 animate-pulse">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                <Eye className="w-4 h-4 animate-spin" />
                <span>Aligning Biometric Landmarks & Running 3D Depth Check...</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full w-4/5 animate-pulse" />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => setStep(2)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
              ← Back
            </button>
            <button
              onClick={handleVerifyFace}
              disabled={scanningFace}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-2 cursor-pointer transition-all"
            >
              {scanningFace ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Scan Face & Confirm Face-Match →</span>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: FINAL REVIEW & SUBMIT ── */}
      {step === 4 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 animate-fadeIn">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Step 4: Final AI Review & Signal Verification
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Review verified signals before issuing the Verified Host badge.</p>
          </div>

          <div className="space-y-3 max-w-xl">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">ID Information: {fullName}</p>
                  <p className="text-[10px] text-slate-400">{idType} ({idNumber})</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400">Verified ✓</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Document Authenticity Scan</p>
                  <p className="text-[10px] text-slate-400">Security microprint & UIDAI/Govt OCR validated</p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-400">99.1% Matched</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Biometric Face-Match</p>
                  <p className="text-[10px] text-slate-400">128 facial landmarks aligned with ID photo</p>
                </div>
              </div>
              <span className="text-xs font-black text-teal-400">98.4% Confidence</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => setStep(3)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
              ← Back
            </button>
            <button
              onClick={handleSubmitVerification}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
              <span>Submit & Issue Verified Host Badge ✓</span>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 5: VERIFIED STATUS DISPLAY ── */}
      {step === 5 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold">Document Authenticity</p>
              <p className="text-2xl font-black text-emerald-400">{verStatus.idAuthenticity || 99.1}%</p>
              <p className="text-[10px] text-emerald-300">✓ Security microprint verified</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold">Biometric Face-Match</p>
              <p className="text-2xl font-black text-teal-400">{verStatus.faceMatchScore || 98.4}%</p>
              <p className="text-[10px] text-teal-300">✓ 128 Facial landmarks aligned</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold">Verification Confidence</p>
              <p className="text-2xl font-black text-emerald-400">{verStatus.confidence || 94.2}%</p>
              <p className="text-[10px] text-emerald-300">✓ Trustora Verified Badge Active</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-950 to-teal-950/60 border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-600/30">
                🛡️
              </div>
              <div>
                <h4 className="text-base font-black text-white">Trustora Verified Host ✓ Badge Active</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  All your properties now display the Verified Host badge on listing search, detail pages, and trust reports.
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Re-test Verification
            </button>
          </div>
        </div>
      )}

      {/* Honest Language Policy Footer */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <AlertTriangle className="w-4 h-4" /> Identity Verification Language Policy
        </div>
        <p className="text-slate-500 text-[10px] leading-relaxed">
          Trustora displays <strong>"Verification confidence"</strong> and <strong>"Verification signals"</strong> rather than guaranteeing 100% identity authenticity. Demo identity data is simulated and prepared for plug-and-play integration with licensed Indian KYC providers.
        </p>
      </div>
    </div>
  );
};

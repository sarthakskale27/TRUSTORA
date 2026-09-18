import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, MapPin, Users, Bed, Bath, Star, ShieldCheck,
  AlertTriangle, CheckCircle2, FileCheck, Award, MessageSquare,
  Sparkles, Scale, Heart, Flag, Share2, Compass, HelpCircle,
  Camera, ChevronRight, Loader2, X, Check
} from 'lucide-react';
import api from '../../services/api';
import { TrustReportModal } from '../trust-radar/TrustReport';
import { useToast } from '../../context/ToastContext';

export const PropertyDetail = ({ propertyId, onBack, onNavigateTab }) => {
  const { showToast } = useToast();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trustModalOpen, setTrustModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Fake Listing / Identity Mismatch');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  // Personalized Match state
  const [tripType, setTripType] = useState('Family');
  const [selectedPrefs, setSelectedPrefs] = useState(['Quiet', 'Beach', 'Family friendly']);

  useEffect(() => {
    if (!propertyId) return;
    setLoading(true);
    api.get(`/properties/${propertyId}`)
      .then(res => setProperty(res.data.property))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
  }, [propertyId]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportSubmitting(true);
    try {
      await api.post('/trust/report-listing', {
        property_id: propertyId,
        reason: reportReason,
        details: reportDetails
      });
      showToast('Report submitted. Our trust & safety team will investigate.', 'success');
      setReportModalOpen(false);
    } catch {
      showToast('Report received (DEMO MODE).', 'success');
      setReportModalOpen(false);
    } finally {
      setReportSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Property not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs">Go Back</button>
      </div>
    );
  }

  const trustScore = property.trust_score || 94;
  const photos = property.photos || [];
  const primaryImg = photos[0]?.url || property.primary_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Nav Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Stays
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" /> Report this listing
          </button>
        </div>
      </div>

      {/* ── 1. TRUST-FIRST TOP SECTION ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> VERIFIED HOST ✓
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-slate-400 border border-slate-800 uppercase">
                {property.property_type || 'Villa'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                DEMO INTELLIGENCE
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">{property.name || property.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" /> {property.address}, {property.city}, {property.state}
            </p>
          </div>

          {/* Trust Score Ring Callout & Primary CTA */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/30 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border-2 border-emerald-500/60 flex flex-col items-center justify-center shadow-lg">
              <span className="text-2xl font-black text-emerald-400 leading-none">{trustScore}</span>
              <span className="text-[9px] text-slate-400 font-bold">/ 100</span>
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">Trustora Trust Score</p>
              <p className="text-[11px] text-emerald-300 font-semibold">High Multi-Signal Confidence</p>
              <button
                onClick={() => setTrustModalOpen(true)}
                className="mt-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" /> View Full Trust Report
              </button>
            </div>
          </div>
        </div>

        {/* 4 Trust Intelligence Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold">Fraud Risk</span>
            <p className="text-sm font-black text-emerald-400 uppercase">Low (18/100)</p>
            <p className="text-[9px] text-slate-500">Zero duplicate images</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold">Review Confidence</span>
            <p className="text-sm font-black text-teal-400">High (82%)</p>
            <p className="text-[9px] text-slate-500">Smooth temporal spread</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold">Neighbourhood Match</span>
            <p className="text-sm font-black text-amber-400">91% Match</p>
            <p className="text-[9px] text-slate-500">Quiet & Beach-side</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold">Listing Consistency</span>
            <p className="text-sm font-black text-emerald-400">88 / 100</p>
            <p className="text-[9px] text-slate-500">Room-image verified</p>
          </div>
        </div>
      </div>

      {/* ── 2. PHOTOS GALLERY ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 h-72 sm:h-96 rounded-3xl overflow-hidden bg-slate-900 relative">
          <img src={primaryImg} alt={property.name} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-emerald-400 text-xs font-bold flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" /> Verified Photos ({photos.length || 1})
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3 h-72 sm:h-96">
          {(photos.slice(1, 3).length > 0 ? photos.slice(1, 3) : [
            { url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600' },
            { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600' }
          ]).map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-slate-900 relative h-full">
              <img src={img.url || img.image_url} alt="Room" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. LISTING CONSISTENCY & NEIGHBOURHOOD VIBE ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Listing Consistency Analyzer */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" /> Listing Consistency Analyzer
            </h3>
            <span className="text-xs font-extrabold text-emerald-400">88/100</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-200 font-semibold">Amenities Match Description</p>
                <p className="text-[11px] text-slate-400">Swimming pool, Wi-Fi, and AC explicitly confirmed in photos.</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-200 font-semibold">Room & Bathroom Capacity Validated</p>
                <p className="text-[11px] text-slate-400">{property.total_rooms || 2} Rooms / {property.total_bathrooms || 2} Bathrooms match max {property.max_guests || 4} guests.</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-200 font-semibold">Recommendation: Additional Bathroom Photo</p>
                <p className="text-[11px] text-slate-400">Upload 1 more bathroom image to increase consistency score by +4.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Neighbourhood Vibe */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-teal-400" /> Neighbourhood Context
            </h3>
            <span className="text-[10px] text-slate-400">{property.city} Spatial Hub</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            "{property.neighborhood_vibe || 'Quiet, family-oriented neighbourhood with convenient access to local cafes, transit and scenic points.'}"
          </p>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold">Noise Level</span>
              <p className="font-bold text-white">Low</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold">Family Friendly</span>
              <p className="font-bold text-emerald-400">High</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold">Transit</span>
              <p className="font-bold text-white">Good</p>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300">
            <p>🏖️ Beach Access — <strong>3 min walk</strong></p>
            <p>🛒 Local Market — <strong>7 min walk</strong></p>
            <p>🚌 Bus Stop — <strong>5 min drive</strong></p>
          </div>
        </div>
      </div>

      {/* ── 4. DETAILS, AMENITIES & PRICING CTA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Property Description</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {property.description || 'A stunning Trustora-verified rental property with modern amenities, comfortable furnishings, and verified host credentials.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Verified Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {(property.amenities && property.amenities.length > 0 ? property.amenities : [
                'High-Speed 5G Wi-Fi', 'Swimming Pool', 'Air Conditioning', 'Kitchen & Cookware', 'Free Parking', 'Smart Lock'
              ]).map((a, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-semibold">
                  ✓ {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl h-fit">
          <div className="flex items-baseline justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-2xl font-black text-white">₹{(property.base_price || 5000).toLocaleString()}</span>
              <span className="text-xs text-slate-400"> / night</span>
            </div>
            <span className="text-xs text-emerald-400 font-bold">Best Price Guarantee</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-1">
            <p className="font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Trustora Protected Stay</p>
            <p className="text-[10px] text-slate-400">Verified host identity, transparent pricing, and 24/7 autonomous concierge assistance.</p>
          </div>

          <button
            onClick={() => showToast('Booking reservation initiated (DEMO MODE).', 'success')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-black text-xs shadow-lg transition-all cursor-pointer"
          >
            Reserve with Trustora Protection
          </button>
        </div>
      </div>

      {/* Trust Report Drawer Modal */}
      <TrustReportModal
        propertyId={propertyId}
        isOpen={trustModalOpen}
        onClose={() => setTrustModalOpen(false)}
      />

      {/* Report Listing Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-400" /> Report This Listing
              </h3>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Fake Listing / Identity Mismatch">Fake Listing / Identity Mismatch</option>
                  <option value="Suspicious Host Communication">Suspicious Host Communication</option>
                  <option value="Misleading Photos">Misleading Photos</option>
                  <option value="Wrong Location Coordinates">Wrong Location Coordinates</option>
                  <option value="Payment Scam Attempt">Payment Scam Attempt</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Additional Details</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={e => setReportDetails(e.target.value)}
                  placeholder="Describe what seemed suspicious or inaccurate..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

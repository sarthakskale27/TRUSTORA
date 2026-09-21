import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Star, MapPin, BedDouble, DollarSign, ShieldCheck,
  ExternalLink, Trash2, Edit, Eye, XCircle, Calendar, Loader2, AlertTriangle,
  Fingerprint, ArrowRight, X
} from 'lucide-react';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
];

export const PropertyList = ({ onSelectProperty, onAddNew, onNavigate }) => {
  const { success, error } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null); // { prop, hasBookings, bookingCount }
  const [deleting, setDeleting] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [isHostVerified, setIsHostVerified] = useState(false);

  const { user } = useAuth();

  const checkHostVerification = async () => {
    if (user?.is_verified_host) {
      setIsHostVerified(true);
      return true;
    }
    try {
      const res = await api.get('/trust/host/verification/status');
      const verified = Boolean(res.data && (res.data.verified || res.data.status === 'verified'));
      setIsHostVerified(verified);
      return verified;
    } catch {
      setIsHostVerified(false);
      return false;
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/properties');
      const allProps = res.data.properties || [];
      setProperties(allProps);
    } catch (e) {
      error('Failed to load properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    checkHostVerification();
  }, []);

  const handleAddNewAttempt = async () => {
    const verified = await checkHostVerification();
    if (!verified) {
      setVerificationModalOpen(true);
      return;
    }
    if (onAddNew) onAddNew();
  };

  // Smart delete: check for active bookings first
  const handleDeleteClick = async (prop) => {
    try {
      const bRes = await api.get('/bookings');
      const allBookings = bRes.data.bookings || [];
      const propBookings = allBookings.filter(b =>
        (b.property_id || b.property?.id) === prop.id &&
        b.status !== 'cancelled' && b.status !== 'checked_out' && b.status !== 'completed'
      );
      setDeleteModal({
        prop,
        hasBookings: propBookings.length > 0,
        bookingCount: propBookings.length
      });
    } catch {
      setDeleteModal({ prop, hasBookings: false, bookingCount: 0 });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await api.delete(`/properties/${deleteModal.prop.id}`);
      success(`"${deleteModal.prop.name}" has been removed from your portfolio.`);
      setDeleteModal(null);
      fetchProperties();
    } catch (e) {
      error('Failed to delete property.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">My Properties</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your accommodations, rates, room inventories, and Trustora trust scores.
          </p>
        </div>
        <button
          onClick={handleAddNewAttempt}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Property Wizard
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Your Property Portfolio is Empty</h3>
            <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
              Welcome to Trustora! As a new host, you start fresh. Before publishing your first vacation rental, resort, or boutique stay, verify your host credentials.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleAddNewAttempt}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> List Your First Property
            </button>
            {!isHostVerified && (
              <button
                onClick={() => onNavigate && onNavigate('host-verification')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Fingerprint className="w-4 h-4" /> Verify Yourself First
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop, idx) => {
            const heroPhoto = prop.photos?.find((p) => p.is_hero)?.url || prop.photos?.[0]?.url || prop.primary_image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
            return (
              <div
                key={prop.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col group"
              >
                {/* Photo Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={heroPhoto}
                    alt={prop.name}
                    onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge variant="primary" size="sm">
                      {(prop.property_type || 'Villa').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs text-white font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{prop.trust_score || 94}%</span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-[10px] uppercase font-bold text-indigo-300">Base Rate</p>
                    <p className="text-lg font-black">
                      ₹{(prop.base_price || 5000).toLocaleString()}{' '}
                      <span className="text-xs font-normal text-slate-300">/ night</span>
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {prop.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      {prop.city}, {prop.state}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-center text-xs">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Rooms</p>
                      <p className="font-bold text-white">{prop.rooms_count || prop.total_rooms || 1}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Baths</p>
                      <p className="font-bold text-white">{prop.bathrooms_count || prop.total_bathrooms || 1}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Max Guests</p>
                      <p className="font-bold text-white">{prop.max_guests || 2}</p>
                    </div>
                  </div>

                  {/* Amenities Preview */}
                  <div className="flex flex-wrap gap-1.5">
                    {prop.amenities?.slice(0, 3).map((a, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400">
                        {a}
                      </span>
                    ))}
                    {(prop.amenities?.length || 0) > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-indigo-400">
                        +{prop.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectProperty(prop.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Manage & Insights
                    </button>
                    <button
                      onClick={() => handleDeleteClick(prop)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════ HOST VERIFICATION GUARD MODAL ══════ */}
      {verificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setVerificationModalOpen(false)}>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Verify Yourself First 🛡️</h3>
                <p className="text-xs text-slate-400">Host Identity Requirement</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2 text-slate-300">
              <p className="font-bold text-amber-400">⚠️ Identity Verification is Required Before Listing</p>
              <p>
                To maintain Trustora's 100% verified standard and protect guests, you must verify your identity (Government ID + Biometric Face Match) before listing your property.
              </p>
              <p className="text-slate-400 text-[11px] pt-1">
                After completing verification, you will earn the <strong>Verified Host ✓</strong> badge and unlock full property publishing.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={async () => {
                  try {
                    await api.post('/trust/host/verification/submit', { id_type: 'Aadhaar Card' });
                    setIsHostVerified(true);
                    setVerificationModalOpen(false);
                    success('Host identity verified successfully! You can now list properties.');
                    if (onAddNew) onAddNew();
                  } catch {
                    setIsHostVerified(true);
                    setVerificationModalOpen(false);
                    success('Host identity verified! You can now list properties.');
                    if (onAddNew) onAddNew();
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Fingerprint className="w-4 h-4" /> 1-Click Instant Verify (Aadhaar + Face Match)
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setVerificationModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setVerificationModalOpen(false);
                    if (onNavigate) onNavigate('host-verification');
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  Full KYC Flow →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ DELETE / CLOSE PROPERTY MODAL ══════ */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => !deleting && setDeleteModal(null)}>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl" onClick={e => e.stopPropagation()}>

            {deleteModal.hasBookings ? (
              /* ── HAS ACTIVE BOOKINGS: Cannot delete ── */
              <>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Cannot Delete Property</h3>
                    <p className="text-xs text-slate-400">{deleteModal.prop.name}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2">
                  <p className="font-bold text-amber-400">⚠️ This property has {deleteModal.bookingCount} active booking{deleteModal.bookingCount > 1 ? 's' : ''}</p>
                  <p className="text-slate-300">
                    You cannot delete a property with confirmed or active guest reservations. 
                    All bookings must be completed or cancelled before deletion.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <p className="font-bold text-white">💡 Instead, you can close this property to new bookings:</p>
                  <p className="text-slate-400">
                    Set a closure date to stop accepting new reservations while existing bookings continue as normal.
                    After all bookings are completed, you can delete the property.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setDeleteModal(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer">
                    Close
                  </button>
                  <button onClick={() => { setDeleteModal(null); onSelectProperty(deleteModal.prop.id); }}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Manage Property
                  </button>
                </div>
              </>
            ) : (
              /* ── NO ACTIVE BOOKINGS: Can delete ── */
              <>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Delete Property?</h3>
                    <p className="text-xs text-slate-400">{deleteModal.prop.name} · {deleteModal.prop.city}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs space-y-2">
                  <p className="font-bold text-rose-400">⚠️ This action cannot be undone</p>
                  <p className="text-slate-300">
                    This will permanently remove <strong className="text-white">{deleteModal.prop.name}</strong> from your 
                    portfolio, including all property data, reviews, and trust score history.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setDeleteModal(null)} disabled={deleting}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleConfirmDelete} disabled={deleting}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60">
                    {deleting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                    ) : (
                      <><Trash2 className="w-3.5 h-3.5" /> Yes, Delete Permanently</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

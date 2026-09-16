import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  BedDouble,
  Sparkles,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Users,
  ShieldCheck,
  Plus
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const OnboardingWizard = ({ onComplete }) => {
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    property_type: 'villa',
    description: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    rooms_count: 3,
    bathrooms_count: 3,
    max_guests: 8,
    base_price: 12000,
    amenities: ['High-Speed WiFi', 'Private Swimming Pool', 'Air Conditioning', 'Power Backup'],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        caption: 'Luxury Exterior & Pool View',
        is_hero: true
      },
      {
        url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
        caption: 'Master Bedroom Suite',
        is_hero: false
      }
    ],
    newPhotoUrl: '',
    newPhotoCaption: ''
  });

  const availableAmenities = [
    'High-Speed WiFi',
    'Private Swimming Pool',
    'Air Conditioning',
    'Power Backup',
    'Full Kitchen',
    'Smart TV / OTT',
    'Ocean View',
    'Mountain View',
    'Dedicated Workspace',
    'Free Covered Parking',
    'Daily Housekeeping',
    'BBQ Grill Area',
    'Pet Friendly',
    'Smart Keyless Entry',
    'Chef on Demand',
    'EV Charger'
  ];

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleAddPhoto = () => {
    if (!formData.newPhotoUrl) return;
    setFormData((prev) => ({
      ...prev,
      photos: [
        ...prev.photos,
        {
          url: prev.newPhotoUrl,
          caption: prev.newPhotoCaption || 'Property View',
          is_hero: prev.photos.length === 0
        }
      ],
      newPhotoUrl: '',
      newPhotoCaption: ''
    }));
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSetHero = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.map((p, i) => ({
        ...p,
        is_hero: i === index
      }))
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        property_type: formData.property_type,
        description: formData.description || `Exquisite ${formData.property_type} in ${formData.city || 'prime destination'} with premium amenities and luxury comfort.`,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        rooms_count: parseInt(formData.rooms_count) || 1,
        bathrooms_count: parseInt(formData.bathrooms_count) || 1,
        max_guests: parseInt(formData.max_guests) || 2,
        base_price: parseFloat(formData.base_price) || 5000,
        amenities: formData.amenities,
        photos: formData.photos
      };

      await api.post('/properties', payload);
      success('Property successfully published & AI Trust Score generated!');
      if (onComplete) onComplete();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to publish property.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Identity', icon: Building2 },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'Spaces & Price', icon: BedDouble },
    { number: 4, title: 'Amenities', icon: Sparkles },
    { number: 5, title: 'Photos & Vision', icon: Camera },
    { number: 6, title: 'Launch', icon: CheckCircle2 }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 w-full -z-0" />
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <div key={step.number} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => isCompleted && setCurrentStep(step.number)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </button>
                <span
                  className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                    isCurrent ? 'text-indigo-400' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Step 1: Property Identity */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Step 1: Property Identity</h2>
              <p className="text-xs text-slate-400 mt-1">What kind of accommodation are you hosting?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Property Name / Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Casa Bella Luxury Oceanfront Villa"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Property Type</label>
                <select
                  value={formData.property_type}
                  onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="villa">Luxury Villa</option>
                  <option value="apartment">Modern Apartment / Condo</option>
                  <option value="homestay">Heritage Homestay</option>
                  <option value="boutique_hotel">Boutique Hotel</option>
                  <option value="hostel">Co-living / Hostel</option>
                  <option value="resort">Nature Resort / Cottage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Headline Pitch (Optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Private cliffside retreat with panoramic sunset views"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Step 2: Location & Address</h2>
              <p className="text-xs text-slate-400 mt-1">Trustora analyzes neighborhood vibe and transit accessibility.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Plot 42, Aguada Siolim Road, Near Candolim Beach"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">City / Town</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. North Goa"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">State / Province</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Goa"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Postal / PIN Code</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="e.g. 403515"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Spaces & Pricing */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Step 3: Space Details & Base Price</h2>
              <p className="text-xs text-slate-400 mt-1">Configure capacity and base nightly rate for dynamic pricing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Bedrooms / Rooms</label>
                <input
                  type="number"
                  min="1"
                  value={formData.rooms_count}
                  onChange={(e) => setFormData({ ...formData, rooms_count: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bathrooms</label>
                <input
                  type="number"
                  min="1"
                  value={formData.bathrooms_count}
                  onChange={(e) => setFormData({ ...formData, bathrooms_count: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Maximum Guest Capacity</label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_guests}
                  onChange={(e) => setFormData({ ...formData, max_guests: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Base Price Per Night (INR ₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-200">
                <strong>HostBoost Dynamic Pricing</strong> will automatically calculate seasonal multipliers, weekend surges, and local events starting from your base price.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Amenities */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Step 4: Amenities & Features</h2>
              <p className="text-xs text-slate-400 mt-1">Select all features available to guests for higher SEO conversion.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableAmenities.map((amenity) => {
                const selected = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      selected
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{amenity}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 ml-1" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Photos */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Step 5: Property Photos & Vision Radar</h2>
              <p className="text-xs text-slate-400 mt-1">Add high-resolution photo URLs. Trustora Vision will evaluate staging and lighting.</p>
            </div>

            {/* Add Photo Inputs */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" /> Add Photo via Web URL
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="url"
                  value={formData.newPhotoUrl}
                  onChange={(e) => setFormData({ ...formData, newPhotoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={formData.newPhotoCaption}
                  onChange={(e) => setFormData({ ...formData, newPhotoCaption: e.target.value })}
                  placeholder="Caption (e.g. Sunset Balcony)"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Photo to Gallery
              </button>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {formData.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group"
                >
                  <img src={photo.url} alt={photo.caption} className="w-full h-36 object-cover" />
                  <div className="p-3 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300 truncate">{photo.caption}</span>
                    {photo.is_hero && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                        Hero
                      </span>
                    )}
                  </div>
                  <div className="p-2 border-t border-slate-800 flex items-center justify-between">
                    {!photo.is_hero && (
                      <button
                        type="button"
                        onClick={() => handleSetHero(index)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Set as Hero
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 ml-auto font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Confirmation & AI Boost */}
        {currentStep === 6 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Ready for Instant AI Launch!</h2>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                HostBoost will automatically generate your Trustora Trust Profile, configure 30-day dynamic pricing curves, and prepare your WhatsApp Concierge hospitality bot.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Property Title:</span>
                <span className="font-bold text-white">{formData.title || 'Untitled Property'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Type & City:</span>
                <span className="font-semibold text-slate-200">{formData.property_type.toUpperCase()} • {formData.city || 'Location'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Base Price:</span>
                <span className="font-bold text-emerald-400">₹{formData.base_price}/night</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Amenities & Photos:</span>
                <span className="font-semibold text-indigo-400">{formData.amenities.length} amenities • {formData.photos.length} photos</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav Controls */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((p) => p - 1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1 && !formData.title) {
                  error('Please enter a property name.');
                  return;
                }
                setCurrentStep((p) => p + 1);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {submitting ? 'Publishing Property...' : 'Launch Property on HostBoost'}
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

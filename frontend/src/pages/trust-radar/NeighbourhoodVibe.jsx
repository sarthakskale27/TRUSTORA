import React, { useState } from 'react';
import {
  Compass, MapPin, Users, Music, Volume2, ShieldCheck,
  Utensils, Car, Sparkles, Check, AlertTriangle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const CITIES_DATA = {
  Goa: {
    summary: 'Vibrant beachside neighbourhood with a mix of nightlife, seaside cafes, and authentic local Goan culture.',
    noise: 'Medium', nightlife: 'High', family_friendly: 'Medium', tourist: 'High', transport: 'Good', food: 'Excellent',
    nearby: [
      { place: 'Calangute / Baga Beach', time: '3 min walk' },
      { place: 'Local Fish & Spice Market', time: '7 min walk' },
      { place: 'Goa Kadamba Bus Stand', time: '5 min drive' },
      { place: 'Dabolim Airport (GOI)', time: '40 min drive' },
    ]
  },
  Manali: {
    summary: 'Tranquil mountain retreat surrounded by pine forests, cedar groves, and snow-capped Himalayan peaks.',
    noise: 'Low', nightlife: 'Low', family_friendly: 'High', tourist: 'High', transport: 'Moderate', food: 'Good',
    nearby: [
      { place: 'Mall Road Promenade', time: '8 min walk' },
      { place: 'Beas River Rafting Point', time: '10 min walk' },
      { place: 'Solang Valley Adventure Hub', time: '25 min drive' },
      { place: 'Bhuntar Airport (KUU)', time: '50 min drive' },
    ]
  },
  Jaipur: {
    summary: 'Royal heritage quarter with pink sandstone havelis, bustling bazaars, and traditional Rajasthani restaurants.',
    noise: 'Medium', nightlife: 'Low', family_friendly: 'High', tourist: 'High', transport: 'Good', food: 'Excellent',
    nearby: [
      { place: 'Hawa Mahal & City Palace', time: '12 min walk' },
      { place: 'Johari Bazaar Jewellery Market', time: '10 min walk' },
      { place: 'Jaipur Junction Railway Station', time: '15 min drive' },
      { place: 'Jaipur International Airport', time: '25 min drive' },
    ]
  },
  Udaipur: {
    summary: 'Romantic lakeside setting with quiet ghats, palace views, and rooftop dining overlooking Lake Pichola.',
    noise: 'Low', nightlife: 'Low', family_friendly: 'High', tourist: 'High', transport: 'Moderate', food: 'Good',
    nearby: [
      { place: 'Lake Pichola Ghat', time: '5 min walk' },
      { place: 'City Palace Complex', time: '10 min walk' },
      { place: 'Old City Handicraft Market', time: '8 min walk' },
      { place: 'Maharana Pratap Airport', time: '35 min drive' },
    ]
  },
};

export const NeighbourhoodVibe = () => {
  const { showToast } = useToast();
  const [selectedCity, setSelectedCity] = useState('Goa');
  const [tripType, setTripType] = useState('Family');
  const [selectedPrefs, setSelectedPrefs] = useState(['Quiet', 'Beach', 'Family friendly']);

  const currentCityData = CITIES_DATA[selectedCity] || CITIES_DATA['Goa'];

  const allPrefs = [
    'Quiet', 'Nightlife', 'Beach', 'Transport', 'Family friendly', 'Local experience', 'Food & Dining'
  ];

  const togglePref = (p) => {
    setSelectedPrefs(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const calculateMatch = () => {
    let score = 75;
    if (selectedPrefs.includes('Quiet') && currentCityData.noise === 'Low') score += 10;
    if (selectedPrefs.includes('Nightlife') && currentCityData.nightlife === 'High') score += 10;
    if (selectedPrefs.includes('Family friendly') && currentCityData.family_friendly === 'High') score += 10;
    if (selectedPrefs.includes('Beach') && selectedCity === 'Goa') score += 10;
    return Math.min(98, score);
  };

  const matchScore = calculateMatch();

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Spatial Context & Vibe
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              DEMO DATA
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Neighbourhood Vibe & Match</h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate noise levels, family suitability, safety vibes, and match with your guest preferences.
          </p>
        </div>

        {/* City Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {Object.keys(CITIES_DATA).map(c => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCity === c
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
          📍 {selectedCity} Neighbourhood Profile
        </h3>
        <p className="text-sm font-semibold text-white leading-relaxed">
          "{currentCityData.summary}"
        </p>
      </div>

      {/* Factor Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Noise Level', val: currentCityData.noise, icon: Volume2, color: 'emerald' },
          { label: 'Nightlife', val: currentCityData.nightlife, icon: Music, color: 'purple' },
          { label: 'Family Friendly', val: currentCityData.family_friendly, icon: Users, color: 'teal' },
          { label: 'Tourist Density', val: currentCityData.tourist, icon: Compass, color: 'amber' },
          { label: 'Transit Access', val: currentCityData.transport, icon: Car, color: 'blue' },
          { label: 'Food Scene', val: currentCityData.food, icon: Utensils, color: 'rose' },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1.5">
              <Icon className="w-4 h-4 text-emerald-400 mx-auto" />
              <p className="text-[10px] text-slate-400 font-semibold">{f.label}</p>
              <p className="text-xs font-black text-white">{f.val}</p>
            </div>
          );
        })}
      </div>

      {/* Nearby Walking Markers & Match Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nearby Markers */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-400" /> Nearby Proximity Markers (DEMO)
          </h4>
          <div className="space-y-2">
            {currentCityData.nearby.map((n, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs">
                <span className="text-slate-300 font-semibold">{n.place}</span>
                <span className="text-emerald-400 font-bold text-[11px]">{n.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Match Widget */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Guest Vibe Match Calculator
            </h4>
            <span className="text-lg font-black text-emerald-400">{matchScore}% Match</span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Select Preferences:</label>
            <div className="flex flex-wrap gap-1.5">
              {allPrefs.map(p => {
                const isSel = selectedPrefs.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePref(p)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      isSel
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {isSel ? '✓ ' : '+ '} {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
            <p className="text-emerald-300 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> High compatibility with {selectedPrefs.slice(0, 2).join(', ')}
            </p>
            <p className="text-slate-400 text-[11px]">
              {selectedCity} provides matching amenities and vibe based on {tripType} travel profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

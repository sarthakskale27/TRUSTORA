import React, { useState } from 'react';
import { User, Shield, Phone, Mail, Camera, CheckCircle, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const GuestProfile = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);

  const trust_score = 87;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-400" /> My Profile
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your traveller identity and preferences</p>
      </div>

      {/* Avatar & trust */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-400 flex items-center justify-center text-white text-3xl font-black shadow-xl">
            {user?.name?.[0]?.toUpperCase() || 'G'}
          </div>
          <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-white text-xl font-extrabold">{user?.name || 'Guest Traveller'}</h2>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold">Verified Traveller</span>
            <span className="text-slate-600">•</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-amber-400 text-xs font-semibold">Trustora Score: {trust_score}/100</span>
          </div>
        </div>
      </div>

      {/* Profile details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-white font-bold">Personal Information</h3>
        {[
          { icon: User, label: 'Full Name',  value: user?.name || '—' },
          { icon: Mail, label: 'Email',      value: user?.email || '—' },
          { icon: Phone, label: 'Phone',     value: user?.phone || '—' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl">
            <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">{label}</p>
              <p className="text-white text-sm font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trustora badge */}
      <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/10 border border-emerald-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-bold">Trustora Traveller Badge</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'ID Verified',   ok: true },
            { label: 'Phone Verified', ok: true },
            { label: 'Email Verified', ok: true },
            { label: 'KYC Complete',  ok: false },
            { label: 'Review History', ok: true },
            { label: 'Zero Disputes', ok: true },
          ].map(({ label, ok }) => (
            <div key={label} className={`flex items-center gap-1.5 p-2 rounded-lg border text-[10px] font-semibold ${
              ok ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/60 border-slate-700 text-slate-500'
            }`}>
              <CheckCircle className={`w-3 h-3 flex-shrink-0 ${ok ? 'text-emerald-400' : 'text-slate-600'}`} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

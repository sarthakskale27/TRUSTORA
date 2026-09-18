import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Sparkles,
  Camera,
  CalendarCheck,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  X,
  Fingerprint,
  ShieldAlert,
  SearchCheck,
  Compass,
  FileCheck
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const trustNavItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'trust-radar', label: 'Trust Intelligence Hub', icon: ShieldCheck, badge: '96%' },
    { id: 'host-verification', label: 'Host Verification', icon: Fingerprint, badge: 'KYC' },
    { id: 'fraud-radar', label: 'Scam & Fraud Radar', icon: ShieldAlert, badge: 'Active' },
    { id: 'review-anomaly', label: 'Review Anomaly Radar', icon: SearchCheck, badge: 'NLP' },
    { id: 'neighbourhood-vibe', label: 'Neighbourhood Vibe', icon: Compass, badge: 'Geo' },
  ];

  const growthNavItems = [
    { id: 'properties', label: 'My Properties', icon: Building2, badge: '30' },
    { id: 'onboarding', label: 'Add Property Wizard', icon: PlusCircle, badge: 'New' },
    { id: 'ai-copywriter', label: 'AI Listing Copywriter', icon: Sparkles, badge: 'AI' },
    { id: 'photo-analyzer', label: 'Photo Quality Radar', icon: Camera, badge: 'Vision' },
    { id: 'pricing', label: 'Dynamic Pricing Engine', icon: CalendarCheck, badge: 'Smart' },
    { id: 'bookings', label: 'Bookings & Guests', icon: BookOpen, badge: '330' },
    { id: 'concierge', label: 'WhatsApp AI Concierge', icon: MessageSquare, badge: 'Live' },
    { id: 'analytics', label: 'Revenue & Occupancy', icon: TrendingUp, badge: null },
  ];

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" />
      )}

      <aside className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-slate-950 border-r border-slate-800/80 z-50 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
                Trustora
              </span>
              <span className="ml-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Host
              </span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {/* SECTION 1: TRUST INTELLIGENCE */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> Trust Intelligence
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">Core</span>
            </div>
            <div className="space-y-1">
              {trustNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 font-bold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'} transition-colors`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: HOST GROWTH TOOLS */}
          <div className="pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-slate-500" /> Host Growth Tools
              </span>
              <span className="text-[9px] text-slate-500 font-semibold">Operations</span>
            </div>
            <div className="space-y-1">
              {growthNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/20 font-bold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'} transition-colors`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Trustora Layer
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-extrabold">DEMO DATA</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Deterministic verification and anomaly radar for informal rentals.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

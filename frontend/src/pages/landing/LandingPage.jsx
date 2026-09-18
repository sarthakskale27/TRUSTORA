import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck, Shield, User, Building2, Search, Star, TrendingUp,
  MapPin, MessageSquare, Calendar, Camera, Zap, Heart,
  ChevronRight, Sun, Moon, Menu, X, CheckCircle, AlertTriangle,
  BarChart3, Globe, Cpu, ArrowRight, Sparkles, CheckCircle2,
  Fingerprint, FileCheck, Eye, Compass
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CSS = `
  @keyframes floatCard1 {
    0%, 100% { transform: perspective(1200px) rotateX(6deg) rotateY(-10deg) translateY(0px); }
    50% { transform: perspective(1200px) rotateX(6deg) rotateY(-10deg) translateY(-20px); }
  }
  @keyframes floatCard2 {
    0%, 100% { transform: perspective(1200px) rotateX(-4deg) rotateY(8deg) translateY(-10px); }
    50% { transform: perspective(1200px) rotateX(-4deg) rotateY(8deg) translateY(12px); }
  }
  @keyframes orb1 {
    0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
    50% { transform: translate(-50%, -50%) scale(1.3) rotate(180deg); }
  }
  @keyframes orb2 {
    0%, 100% { transform: translate(-50%, -50%) scale(0.9) rotate(0deg); }
    50% { transform: translate(-50%, -50%) scale(1.2) rotate(-180deg); }
  }
  @keyframes shimmer {
    0% { background-position: -800px 0; }
    100% { background-position: 800px 0; }
  }
  .card-float-1 { animation: floatCard1 6s ease-in-out infinite; }
  .card-float-2 { animation: floatCard2 7.5s ease-in-out infinite 0.8s; }
  .orb-1 { animation: orb1 18s ease-in-out infinite; }
  .orb-2 { animation: orb2 22s ease-in-out infinite 3s; }
  .feature-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .feature-card:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(16, 185, 129, 0.15); }
  .dest-card:hover img { transform: scale(1.08); }
  .shimmer-text {
    background: linear-gradient(90deg, #10b981, #06b6d4, #6366f1, #10b981);
    background-size: 200%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }
`;

const HERO_CARDS = [
  {
    name: 'Azure Beach Villa',
    city: 'Goa',
    price: '8,500',
    trust_score: 98,
    vibe: 'Quiet area, 5 min to beach, family-friendly',
    host_verified: true,
    fraud_risk: 'Low (0.2%)',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'
  },
  {
    name: 'Himalayan Snow Chalet',
    city: 'Manali',
    price: '6,200',
    trust_score: 94,
    vibe: 'Scenic mountain trails, peaceful & safe',
    host_verified: true,
    fraud_risk: 'Low (0.4%)',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500'
  }
];

const TRUSTORA_PILLARS = [
  {
    icon: Fingerprint,
    color: 'emerald',
    num: '01',
    title: 'Verified Host (ID & Face-Match)',
    desc: 'Government ID verification combined with basic authenticity & biometric face-matching algorithms to issue verified host credentials.'
  },
  {
    icon: AlertTriangle,
    color: 'rose',
    num: '02',
    title: 'Scam & Fraud Detector',
    desc: 'Multi-signal scanner analyzing listing text, pricing anomalies (>40% underpricing), duplicate photos, and suspicious cross-platform patterns.'
  },
  {
    icon: Zap,
    color: 'amber',
    num: '03',
    title: 'Review Anomaly Radar',
    desc: 'NLP engine that detects sudden review burst clusters within 24-48h, repetitive linguistic templates, and fake sockpuppet accounts.'
  },
  {
    icon: Compass,
    color: 'teal',
    num: '04',
    title: 'Neighbourhood Vibe Intelligence',
    desc: 'Combines verified reviews and spatial data into plain-language summaries: "Quiet area, 5 min from the beach, family-friendly".'
  },
  {
    icon: ShieldCheck,
    color: 'indigo',
    num: '05',
    title: 'Explainable Trust Score (0-100)',
    desc: 'Displays an auditable 0-100 Trust Score detailing exact positive signals and risk warnings behind the score.'
  }
];

const STATS = [
  { value: 400, suffix: '+', label: 'Verified Listings' },
  { value: 20, suffix: '+', label: 'Cities Covered' },
  { value: '99.4%', suffix: '', label: 'Fraud Detection Rate' },
  { value: '0-100', suffix: '', label: 'Explainable Trust Score' }
];

const DESTINATIONS = [
  { city: 'Goa', tag: 'Beach Paradise', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', count: 3, vibe: 'Coastal & Relaxed' },
  { city: 'Manali', tag: 'Mountain Escape', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', count: 2, vibe: 'Scenic & Peaceful' },
  { city: 'Jaipur', tag: 'Royal Heritage', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', count: 3, vibe: 'Historic & Vibrant' },
  { city: 'Kerala', tag: 'Backwater Bliss', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800', count: 4, vibe: 'Serene & Nature-Rich' },
  { city: 'Udaipur', tag: 'Lake Palace', img: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800', count: 2, vibe: 'Royal & Romantic' }
];

export const LandingPage = ({ onGuestLogin, onHostLogin, onRegister }) => {
  const { isDark, toggleTheme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileMenu, setMobileMenu] = useState(false);
  const heroRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setMousePos({ x, y });
  }, []);

  const t = isDark ? {
    bg: 'bg-slate-950',
    navBg: 'bg-slate-950/80',
    card: 'bg-slate-900/70 border-slate-700/60',
    text: 'text-white',
    textSub: 'text-slate-400',
    textMd: 'text-slate-300',
    sectionBg: 'bg-slate-900/40',
    badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    border: 'border-slate-800',
    footerBg: 'bg-slate-950',
    featureCard: 'bg-slate-900/60 border border-slate-800',
    navLink: 'text-slate-400 hover:text-white'
  } : {
    bg: 'bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/40',
    navBg: 'bg-white/90',
    card: 'bg-white border-gray-200 shadow-xl',
    text: 'text-gray-900',
    textSub: 'text-gray-500',
    textMd: 'text-gray-600',
    sectionBg: 'bg-gray-50',
    badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    border: 'border-gray-200',
    footerBg: 'bg-gray-900',
    featureCard: 'bg-white border border-gray-200 shadow-md',
    navLink: 'text-gray-600 hover:text-gray-900'
  };

  const emeraldGrad = 'bg-gradient-to-r from-emerald-600 to-teal-600';
  const indigoGrad = 'bg-gradient-to-r from-indigo-600 to-violet-600';

  return (
    <div className={'min-h-screen ' + t.bg + ' overflow-x-hidden'}>
      <style>{CSS}</style>

      {/* ── NAVBAR ── */}
      <nav className={'fixed top-0 left-0 right-0 z-50 border-b ' + t.border + ' ' + t.navBg + ' backdrop-blur-xl'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={'font-black text-lg tracking-tight ' + t.text}>Trustora</span>
              <span className="ml-1.5 text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Trust Intelligence
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold">
            <a href="#features" className={t.navLink + ' transition-colors'}>Core Features</a>
            <a href="#destinations" className={t.navLink + ' transition-colors'}>Destinations</a>
            <a href="#how-it-works" className={t.navLink + ' transition-colors'}>Trust Intelligence Flow</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={'p-2 rounded-xl border ' + t.border + ' ' + t.navLink + ' transition-all hover:scale-110 cursor-pointer'}
              title={isDark ? 'Switch to Morning Mode' : 'Switch to Night Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
            </button>

            <button
              onClick={onGuestLogin}
              className={'flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border ' + t.border + ' text-xs sm:text-sm font-bold ' + t.navLink + ' transition-all cursor-pointer'}
            >
              <User className="w-3.5 h-3.5" /> Guest Sign In
            </button>
            <button
              onClick={onHostLogin}
              className={'px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-500/20 ' + emeraldGrad + ' hover:opacity-90 transition-all cursor-pointer'}
            >
              Host Portal
            </button>
            <button className={'md:hidden p-2 rounded-lg ' + t.navLink} onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className={'md:hidden border-t ' + t.border + ' ' + t.navBg + ' px-4 py-4 space-y-3'}>
            <a href="#features" onClick={() => setMobileMenu(false)} className={'block text-sm font-semibold ' + t.navLink}>Core Features</a>
            <a href="#destinations" onClick={() => setMobileMenu(false)} className={'block text-sm font-semibold ' + t.navLink}>Destinations</a>
            <div className="flex gap-2 pt-2">
              <button onClick={() => { setMobileMenu(false); onGuestLogin(); }} className={'flex-1 py-2 rounded-xl border ' + t.border + ' text-sm font-bold ' + t.navLink}>Guest In</button>
              <button onClick={() => { setMobileMenu(false); onHostLogin(); }} className={'flex-1 py-2 rounded-xl text-sm font-bold text-white ' + emeraldGrad}>Host In</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO SECTION ── */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex items-center pt-24 pb-14 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb-1 absolute w-[550px] h-[550px] rounded-full opacity-20"
            style={{ left: '25%', top: '20%', background: 'radial-gradient(circle, #10b981, transparent 70%)' }} />
          <div className="orb-2 absolute w-[450px] h-[450px] rounded-full opacity-15"
            style={{ left: '70%', top: '60%', background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className={'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6 ' + t.badge}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              A Trust Intelligence Layer for Local Rentals
            </div>
            
            <h1 className={'text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6 ' + t.text}>
              "Don't just book what looks good.{' '}
              <span className="shimmer-text">Book what you can trust."</span>
            </h1>

            <p className={'text-base sm:text-lg leading-relaxed mb-8 max-w-lg ' + t.textSub}>
              Trustora evaluates informal and local rental listings across <strong>host authenticity</strong>, <strong>fraud risks</strong>, <strong>review manipulation</strong>, <strong>pricing fairness</strong>, and <strong>neighborhood vibe</strong> so you make confident booking decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={onGuestLogin}
                className={'flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-xl shadow-emerald-500/25 ' + emeraldGrad + ' hover:opacity-90 transition-all hover:scale-105 cursor-pointer'}
              >
                <User className="w-4 h-4" /> Guest Login — Search Safe Stays
              </button>
              <button
                onClick={onHostLogin}
                className={'flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-xl shadow-indigo-500/20 ' + indigoGrad + ' hover:opacity-90 transition-all hover:scale-105 cursor-pointer'}
              >
                <Building2 className="w-4 h-4" /> Property Host Login — Get Verified
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              {[
                { icon: Fingerprint, text: 'ID & Face-Match Verified' },
                { icon: AlertTriangle, text: 'Scam & Underpricing Shield' },
                { icon: Zap, text: 'Review Burst Anomaly Radar' }
              ].map(({ icon: Icon, text }) => (
                <div key={text} className={'flex items-center gap-1.5 text-xs font-semibold ' + t.textSub}>
                  <Icon className="w-3.5 h-3.5 text-emerald-400" /> {text}
                </div>
              ))}
            </div>
          </div>

          {/* 3D Property Trust Cards */}
          <div
            className="relative h-[480px] hidden lg:block"
            style={{
              transform: `perspective(1200px) rotateX(${mousePos.y * 0.25}deg) rotateY(${mousePos.x * 0.25}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div
              className="card-float-1 absolute rounded-2xl overflow-hidden shadow-2xl"
              style={{
                width: 270,
                top: 20,
                left: 40,
                zIndex: 30,
                border: '1px solid rgba(16,185,129,0.3)',
                background: isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="relative">
                <img src={HERO_CARDS[0].img} alt={HERO_CARDS[0].name} className="w-full h-32 object-cover" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-black flex items-center gap-1 shadow">
                  <ShieldCheck className="w-3 h-3" /> Trust Score: {HERO_CARDS[0].trust_score}/100
                </div>
              </div>
              <div className="p-3.5 space-y-2">
                <div>
                  <p className={'font-bold text-sm ' + t.text}>{HERO_CARDS[0].name}</p>
                  <p className={'text-xs flex items-center gap-1 ' + t.textSub}><MapPin className="w-3 h-3 text-rose-400" />{HERO_CARDS[0].city}</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[10px] text-emerald-300">
                  <span className="font-bold">📍 Neighbourhood Vibe:</span> {HERO_CARDS[0].vibe}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Face-Match Host
                  </span>
                  <span className={'font-black ' + t.text}>₹{HERO_CARDS[0].price}<span className="text-[9px] font-normal text-slate-400">/night</span></span>
                </div>
              </div>
            </div>

            <div
              className="card-float-2 absolute rounded-2xl overflow-hidden shadow-2xl"
              style={{
                width: 250,
                top: 170,
                right: 20,
                zIndex: 20,
                border: '1px solid rgba(16,185,129,0.2)',
                background: isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="relative">
                <img src={HERO_CARDS[1].img} alt={HERO_CARDS[1].name} className="w-full h-28 object-cover" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-black flex items-center gap-1 shadow">
                  <ShieldCheck className="w-3 h-3" /> {HERO_CARDS[1].trust_score}/100
                </div>
              </div>
              <div className="p-3 space-y-1.5">
                <p className={'font-bold text-xs ' + t.text}>{HERO_CARDS[1].name}</p>
                <div className="p-1.5 rounded bg-slate-900 text-[9px] text-slate-300">
                  <span className="text-teal-400 font-bold">Vibe:</span> {HERO_CARDS[1].vibe}
                </div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-[10px] text-emerald-400 font-semibold">Zero Anomaly</span>
                  <span className={'font-extrabold ' + t.text}>₹{HERO_CARDS[1].price}</span>
                </div>
              </div>
            </div>

            <div
              className="card-float-1 absolute z-40 px-3.5 py-2.5 rounded-2xl shadow-2xl"
              style={{
                bottom: 30,
                left: 20,
                background: 'rgba(6,78,59,0.9)',
                border: '1px solid rgba(52,211,153,0.4)',
                backdropFilter: 'blur(16px)'
              }}
            >
              <p className="text-emerald-200 text-xs font-black flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Trustora 360° Real-Time Fraud Radar Active
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className={'py-12 ' + t.sectionBg + ' border-y ' + t.border}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1">{s.value}{s.suffix}</p>
              <p className={'text-xs sm:text-sm font-semibold ' + t.textSub}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 CORE FEATURES ── */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className={'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 ' + t.badge}>
            <Sparkles className="w-3.5 h-3.5" /> Trust Intelligence Layer
          </div>
          <h2 className={'text-3xl sm:text-5xl font-black mb-4 ' + t.text}>
            Trustora's 5 Core Features
          </h2>
          <p className={'max-w-2xl mx-auto text-sm sm:text-base ' + t.textSub}>
            Evaluating rental listings across host authenticity, listing content, reviews, pricing, and neighbourhood context.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUSTORA_PILLARS.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.num} className={'feature-card p-6 rounded-3xl ' + t.featureCard + ' relative overflow-hidden'}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-emerald-500/20">{f.num}</span>
                </div>
                <h3 className={'font-black text-lg mb-2 ' + t.text}>{f.title}</h3>
                <p className={'text-xs sm:text-sm leading-relaxed ' + t.textSub}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section id="destinations" className={'py-20 ' + t.sectionBg + ' border-y ' + t.border}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className={'inline-block text-xs font-bold uppercase tracking-widest mb-3 ' + t.badge + ' px-3 py-1 rounded-full'}>Explore India</span>
            <h2 className={'text-2xl sm:text-4xl font-black mb-3 ' + t.text}>Trustora Verified Stays Across India</h2>
            <p className={'text-sm sm:text-base ' + t.textSub}>Every property cross-referenced with local spatial data and verified host records.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DESTINATIONS.map(d => (
              <div
                key={d.city}
                onClick={onGuestLogin}
                className="dest-card group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-left cursor-pointer transition-all hover:border-emerald-500/50"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={d.img} alt={d.city} onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800"; }} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-300" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-emerald-400 text-[10px] font-bold">
                    🛡️ Verified
                  </div>
                </div>
                <div className="p-3.5 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-white font-bold text-sm">{d.city}</p>
                    <span className="text-emerald-400 text-[10px] font-bold">{d.count} Properties</span>
                  </div>
                  <p className="text-slate-400 text-xs">Vibe: {d.vibe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST INTELLIGENCE FLOW ── */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className={'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 ' + t.badge}>
            <Cpu className="w-3.5 h-3.5" /> How It Works
          </div>
          <h2 className={'text-3xl sm:text-5xl font-black mb-4 ' + t.text}>
            Trustora Intelligence Flow
          </h2>
          <p className={'max-w-2xl mx-auto text-sm sm:text-base ' + t.textSub}>
            Every listing you view goes through a real-time 5-stage multi-signal verification pipeline before a Trust Score is issued.
          </p>
        </div>

        {/* Flow Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-emerald-500/20 via-emerald-500/60 to-emerald-500/20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {[
              { step: '01', icon: Search,       color: 'emerald', title: 'Listing Ingested',      desc: 'Property URL or listing ID is submitted. Raw content, photos, and pricing are captured.' },
              { step: '02', icon: Fingerprint,  color: 'teal',    title: 'Host ID Verified',      desc: 'Government ID, phone, and optional face-match verification is run against host profile.' },
              { step: '03', icon: AlertTriangle,color: 'rose',    title: 'Fraud Radar Scan',       desc: 'AI detects duplicate photos, >40% underpricing, suspicious cross-platform copy-paste text.' },
              { step: '04', icon: Zap,          color: 'amber',   title: 'Review Anomaly Check',  desc: 'NLP detects burst patterns, templated phrasing, sockpuppet accounts, fake positive clusters.' },
              { step: '05', icon: ShieldCheck,  color: 'indigo',  title: 'Trust Score Issued',    desc: 'An auditable 0–100 score with plain-language breakdown is shown to the traveller.' },
            ].map((s) => {
              const Icon = s.icon;
              const colors = {
                emerald: { bg: 'bg-emerald-600', ring: 'border-emerald-500/40', glow: 'shadow-emerald-600/20', text: 'text-emerald-400' },
                teal:    { bg: 'bg-teal-600',    ring: 'border-teal-500/40',    glow: 'shadow-teal-600/20',    text: 'text-teal-400'    },
                rose:    { bg: 'bg-rose-600',    ring: 'border-rose-500/40',    glow: 'shadow-rose-600/20',    text: 'text-rose-400'    },
                amber:   { bg: 'bg-amber-600',   ring: 'border-amber-500/40',   glow: 'shadow-amber-600/20',   text: 'text-amber-400'   },
                indigo:  { bg: 'bg-indigo-600',  ring: 'border-indigo-500/40',  glow: 'shadow-indigo-600/20',  text: 'text-indigo-400'  },
              }[s.color];
              return (
                <div key={s.step} className={'feature-card flex flex-col items-center text-center p-5 rounded-3xl border ' + colors.ring + ' ' + t.featureCard}>
                  <div className={'w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl mb-3 ' + colors.bg + ' shadow-' + s.color + '-600/25'}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className={'text-[10px] font-black uppercase tracking-widest mb-1 ' + colors.text}>Step {s.step}</span>
                  <h3 className={'font-black text-sm mb-2 ' + t.text}>{s.title}</h3>
                  <p className={'text-[11px] leading-relaxed ' + t.textSub}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Score result card */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-emerald-900/30 via-slate-900/60 to-teal-900/30 border border-emerald-500/30 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-24 h-24 rounded-full border-4 border-emerald-500/60 flex items-center justify-center bg-slate-900 shadow-2xl shadow-emerald-500/20">
            <div className="text-center">
              <p className="text-3xl font-black text-emerald-400 leading-none">96</p>
              <p className="text-[9px] text-slate-400 font-semibold">/100</p>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-white font-black text-xl mb-1">Trustora Score: 96/100 — Highly Trusted</p>
            <p className={'text-sm mb-3 ' + t.textSub}>Azure Beach Villa, Goa has passed all 5 verification stages. Here's what we found:</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {[
                { label: '✅ Host ID & Face-Match Verified', color: 'emerald' },
                { label: '✅ Zero Duplicate Photos',          color: 'emerald' },
                { label: '✅ Price Within Market Range',      color: 'emerald' },
                { label: '✅ 0 Anomalous Reviews Detected',   color: 'emerald' },
                { label: '✅ Neighbourhood: Family-Safe',     color: 'teal'    },
              ].map(b => (
                <span key={b.label} className={`text-[11px] px-2.5 py-1 rounded-full font-semibold bg-${b.color}-900/30 border border-${b.color}-500/30 text-${b.color}-300`}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
          <button onClick={onGuestLogin} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-emerald-600/20 shrink-0">
            <Search className="w-4 h-4" /> Try Trustora Now
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={t.footerBg + ' border-t ' + (isDark ? 'border-slate-800' : 'border-gray-200') + ' py-12'}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-black text-xl text-white">Trustora</span>
              <span className="text-xs text-slate-400 ml-2">Geeks2Code Architecture • B4U Team</span>
            </div>
            <p className="text-xs text-slate-400 italic">
              "Don't just book what looks good. Book what you can trust."
            </p>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 Trustora AI. All rights reserved.</p>
            <p>Trust Intelligence Layer for Local Rentals 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

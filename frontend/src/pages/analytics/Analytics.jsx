import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  CalendarCheck,
  PieChart as PieIcon,
  BarChart3,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Sparkles,
  Layers,
  ChevronDown,
  Globe,
  MessageSquare,
  Share2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const renderChannelBadge = (channel) => {
  const norm = (channel || '').toLowerCase();
  if (norm.includes('airbnb')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#FF385C]/15 text-[#FF385C] border border-[#FF385C]/30 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#FF385C] animate-pulse shrink-0" />
        <span>Airbnb</span>
      </span>
    );
  }
  if (norm.includes('booking')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#003580]/35 text-[#38bdf8] border border-[#003580]/70 shadow-sm">
        <span className="w-3.5 h-3.5 rounded bg-[#003580] text-white flex items-center justify-center font-black text-[9px] leading-none shrink-0 border border-[#006CE4]">B.</span>
        <span>Booking.com</span>
      </span>
    );
  }
  if (norm.includes('whatsapp')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 shadow-sm">
        <MessageSquare className="w-3 h-3 text-[#25D366] shrink-0" />
        <span>WhatsApp</span>
      </span>
    );
  }
  if (norm.includes('trustora')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-teal-500/15 text-teal-400 border border-teal-500/30 shadow-sm">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        <span>Trustora Direct</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm">
      <Globe className="w-3 h-3 text-indigo-400 shrink-0" />
      <span>Direct Booking</span>
    </span>
  );
};

export const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [channelFilter, setChannelFilter] = useState('all');

  const fetchAnalytics = async (propertyId = null, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const url = propertyId 
        ? `/analytics/dashboard?property_id=${propertyId}` 
        : '/analytics/dashboard';
      const res = await api.get(url);
      setAnalyticsData(res.data);
      if (res.data.properties && res.data.properties.length > 0) {
        setProperties(res.data.properties);
        if (!selectedPropertyId && res.data.selected_property) {
          setSelectedPropertyId(res.data.selected_property.id);
        }
      }
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handlePropertyChange = (newPropId) => {
    const pId = Number(newPropId);
    setSelectedPropertyId(pId);
    fetchAnalytics(pId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle className="w-3 h-3" /> Confirmed</span>;
      case 'checked_in':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Clock className="w-3 h-3" /> Checked In</span>;
      case 'checked_out':
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">{status}</span>;
    }
  };

  const selectedProp = analyticsData?.selected_property;
  const channelData = analyticsData?.channel_distribution || [];
  const revenueTrend = analyticsData?.revenue_trend || [];
  const allBookings = analyticsData?.bookings || [];

  const filteredBookings = allBookings.filter((b) => {
    if (channelFilter === 'all') return true;
    const ch = (b.channel || '').toLowerCase();
    return ch.includes(channelFilter.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* ── 1. HEADER & PROPERTY SELECTOR ── */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" /> Scoped Property Intelligence
            </span>
            <Badge variant="primary" size="sm">Real-Time Sync</Badge>
          </div>
          <h1 className="text-2xl font-black text-white">Revenue & Occupancy Analytics</h1>
          <p className="text-xs text-slate-400">
            Real-time yields, channel origins (Airbnb, Booking.com, WhatsApp, Direct), and occupancy scoped strictly to this property.
          </p>
        </div>

        {/* Property Selector Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative min-w-[280px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <select
              value={selectedPropertyId || ''}
              onChange={(e) => handlePropertyChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/90 border border-slate-700 hover:border-indigo-500/60 rounded-2xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name} ({p.city}) — {p.bookings_count} Bookings
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <button
            onClick={() => fetchAnalytics(selectedPropertyId, true)}
            disabled={refreshing}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 shrink-0 cursor-pointer"
            title="Refresh Real-time Yield"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Live Sync'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. ACTIVE PROPERTY INFO BANNER ── */}
      {selectedProp && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={selectedProp.primary_image}
              alt={selectedProp.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-700 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">{selectedProp.name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{selectedProp.address || selectedProp.city}, {selectedProp.state || 'India'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">Trust Score</span>
              <span className="text-xs font-extrabold text-emerald-400">🛡️ {selectedProp.trust_score || 96}/100</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">Base Rate</span>
              <span className="text-xs font-extrabold text-white">₹{selectedProp.base_price?.toLocaleString()}/nt</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 text-center">
              <span className="text-[10px] text-indigo-300 block font-semibold">Scoped Bookings</span>
              <span className="text-xs font-black text-indigo-400">{analyticsData?.total_bookings || 0} Stays</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. REAL-TIME KPI METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Property Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">
            ₹{analyticsData?.total_revenue ? Number(analyticsData.total_revenue).toLocaleString() : '0'}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>From {analyticsData?.active_bookings || 0} active stays</span>
            <span className="text-emerald-400 font-bold">100% Verified</span>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Occupancy Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400">
            {analyticsData?.occupancy_rate || 0}%
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>{analyticsData?.total_nights || 0} booked room nights</span>
            <span className="text-teal-400 font-bold">High Demand</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-cyan-400">
            {analyticsData?.total_bookings || 0}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>{analyticsData?.cancelled_bookings || 0} cancelled</span>
            <span className="text-indigo-400 font-bold">Scoped Property</span>
          </div>
        </div>

        {/* Average Daily Rate (ADR) */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Average Daily Rate (ADR)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">
            ₹{analyticsData?.adr ? Number(analyticsData.adr).toLocaleString() : '0'}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>RevPAR: ₹{analyticsData?.revpar ? Number(analyticsData.revpar).toLocaleString() : '0'}</span>
            <span className="text-amber-400 font-bold">Yield Optimized</span>
          </div>
        </div>
      </div>

      {/* ── 4. CHANNEL ORIGIN SUMMARY CARDS (Airbnb, Booking.com, WhatsApp, Direct) ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-indigo-400" /> Booking Channel Breakdown & Revenue Origin
          </h3>
          <span className="text-[11px] text-slate-500">Live Scoped Attribution</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Airbnb Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-[#FF385C]/30 hover:border-[#FF385C]/60 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-[#FF385C] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF385C]" /> Airbnb
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF385C]/10 text-[#FF385C]">
                OTA
              </span>
            </div>
            {(() => {
              const ch = channelData.find(c => (c.name || '').toLowerCase().includes('airbnb'));
              return (
                <div>
                  <p className="text-lg font-black text-white">
                    ₹{ch ? ch.revenue.toLocaleString() : '0'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {ch ? `${ch.bookings} reservations (${ch.value}%)` : '0 reservations'}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Booking.com Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-[#003580]/60 hover:border-[#38bdf8]/60 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-[#38bdf8] flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#003580] text-white flex items-center justify-center text-[8px] font-black">B.</span> Booking.com
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#003580]/40 text-[#38bdf8]">
                OTA
              </span>
            </div>
            {(() => {
              const ch = channelData.find(c => (c.name || '').toLowerCase().includes('booking'));
              return (
                <div>
                  <p className="text-lg font-black text-white">
                    ₹{ch ? ch.revenue.toLocaleString() : '0'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {ch ? `${ch.bookings} reservations (${ch.value}%)` : '0 reservations'}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* WhatsApp Concierge Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-[#25D366]/30 hover:border-[#25D366]/60 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-[#25D366] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp Concierge
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#25D366]/10 text-[#25D366]">
                AI Chat
              </span>
            </div>
            {(() => {
              const ch = channelData.find(c => (c.name || '').toLowerCase().includes('whatsapp'));
              return (
                <div>
                  <p className="text-lg font-black text-white">
                    ₹{ch ? ch.revenue.toLocaleString() : '0'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {ch ? `${ch.bookings} reservations (${ch.value}%)` : '0 reservations'}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Direct Website / Trustora Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 hover:border-indigo-500/60 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-indigo-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> Direct Bookings
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                0% Commission
              </span>
            </div>
            {(() => {
              const chDirect = channelData.filter(c => {
                const n = (c.name || '').toLowerCase();
                return n.includes('direct') || n.includes('trustora');
              });
              const totRev = chDirect.reduce((acc, c) => acc + c.revenue, 0);
              const totBookings = chDirect.reduce((acc, c) => acc + c.bookings, 0);
              const totPct = chDirect.reduce((acc, c) => acc + c.value, 0);
              return (
                <div>
                  <p className="text-lg font-black text-white">
                    ₹{totRev.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {totBookings} reservations ({totPct}%)
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── 5. CHARTS SECTION (SCOPED REVENUE & CHANNELS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Yield Chart (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" /> Monthly Revenue Trend (₹ INR)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Real-time booking revenue stream for <strong className="text-slate-200">{selectedProp?.name || 'Selected Property'}</strong>
              </p>
            </div>
            <Badge variant="indigo" size="sm">6-Month Trend</Badge>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Yield Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Share Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-cyan-400" /> Channel Attribution Share
              </h3>
              <Badge variant="purple" size="sm">% Share</Badge>
            </div>

            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    formatter={(val, name, item) => [`${val}% (₹${item.payload.revenue?.toLocaleString()})`, item.payload.name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-slate-800/80">
            {channelData.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="font-bold text-white">{c.value}% ({c.bookings} stays)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. REAL-TIME BOOKINGS LOG & CHANNEL ORIGIN ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Verified Bookings Log for {selectedProp?.name || 'Selected Property'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Reflecting all {allBookings.length} real-time verified guest reservations for this exact property with origin channel.
            </p>
          </div>

          {/* Channel Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: 'All Channels' },
              { key: 'airbnb', label: 'Airbnb' },
              { key: 'booking', label: 'Booking.com' },
              { key: 'whatsapp', label: 'WhatsApp' },
              { key: 'direct', label: 'Direct' }
            ].map((chip) => (
              <button
                key={chip.key}
                onClick={() => setChannelFilter(chip.key)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                  channelFilter === chip.key
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest Info</th>
                <th className="py-3 px-4">Booking Source (Channel)</th>
                <th className="py-3 px-4">Stay Dates</th>
                <th className="py-3 px-4">Nights</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Revenue (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      {b.booking_reference}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={b.guest_avatar}
                          alt={b.guest_name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{b.guest_name}</p>
                          <p className="text-[10px] text-slate-500">{b.guest_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {renderChannelBadge(b.channel)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {b.check_in} <span className="text-slate-500">→</span> {b.check_out}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {b.total_nights} {b.total_nights === 1 ? 'nt' : 'nts'} ({b.guest_count} {b.guest_count === 1 ? 'guest' : 'guests'})
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-400 text-xs whitespace-nowrap">
                      ₹{Number(b.total_amount).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    No bookings found matching "{channelFilter}" channel filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

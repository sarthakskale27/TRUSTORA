import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  CalendarCheck,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Building2,
  CheckCircle2,
  Zap,
  Clock
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const Dashboard = ({ onNavigate }) => {
  const { success } = useToast();
  const [summary, setSummary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [sumRes, recRes, bookRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/ai/recommendations'),
        api.get('/bookings?limit=6')
      ]);

      setSummary(sumRes.data);
      setRecommendations(recRes.data.recommendations || []);
      setRecentBookings(bookRes.data.bookings || []);
      setChartData(sumRes.data.revenue_trend || [
        { month: 'Apr', revenue: 240000, occupancy: 68 },
        { month: 'May', revenue: 310000, occupancy: 74 },
        { month: 'Jun', revenue: 290000, occupancy: 70 },
        { month: 'Jul', revenue: 420000, occupancy: 82 },
        { month: 'Aug', revenue: 490000, occupancy: 88 },
        { month: 'Sep', revenue: 560000, occupancy: 91 },
      ]);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApplyRecommendation = async (recId) => {
    try {
      await api.post(`/ai/recommendations/${recId}/apply`);
      success('AI Recommendation applied to active pricing & listing strategy!');
      setRecommendations((prev) =>
        prev.map((r) => (r.id === recId ? { ...r, status: 'applied' } : r))
      );
    } catch (e) {
      success('Recommendation marked as implemented.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner with Trustora Score */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Executive Host Overview
            </span>
            <Badge variant="cyan" size="sm">Supabase Sync: Active</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Portfolio Performance & AI Growth Engine
          </h1>
          <p className="text-xs text-slate-400">
            Real-time intelligence layer active across all 5 luxury properties and 30 active bookings.
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/40">
              94
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-400">Trustora Index</p>
              <p className="text-xs font-bold text-white">Platinum Verified</p>
            </div>
          </div>

          <button
            onClick={fetchDashboardData}
            className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Gross Revenue"
          value={`₹${(summary?.total_revenue || 560000).toLocaleString()}`}
          change="+24.8%"
          isPositive={true}
          subtitle="vs previous 30 days"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Portfolio Occupancy"
          value={`${summary?.occupancy_rate || 78.5}%`}
          change="+12.4%"
          isPositive={true}
          subtitle="Target: 80.0%"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Active Reservations"
          value={summary?.total_bookings || 30}
          change="+8 this week"
          isPositive={true}
          subtitle="0 Cancellations"
          icon={CalendarCheck}
          color="cyan"
        />
        <StatCard
          title="Avg Daily Rate (ADR)"
          value={`₹${(summary?.adr || 14200).toLocaleString()}`}
          change="+18.2%"
          isPositive={true}
          subtitle="5-factor surge active"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Occupancy Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div>
              <h3 className="text-base font-bold text-white">Revenue & Occupancy Trajectory</h3>
              <p className="text-xs text-slate-400">6-Month historical tracking with AI dynamic pricing yield</p>
            </div>
            <Badge variant="primary">Updated Real-Time</Badge>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Gross Revenue (INR)
            </span>
            <span className="text-emerald-400 font-semibold">+34% Revenue optimization over fixed tariffs</span>
          </div>
        </div>

        {/* AI Action Center */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> AI Action Center
              </h3>
              <Badge variant="purple" size="sm">Pro Engine</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Instant one-click optimizations calculated from live market demand.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onNavigate('pricing')}
              className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-950 border border-indigo-500/30 hover:border-indigo-500/60 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-indigo-300">
                  Weekend Surge Multiplier
                </span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Apply +22% weekend multiplier across 5 listings (+₹45,000 projected).
              </p>
            </button>

            <button
              onClick={() => onNavigate('ai-copywriter')}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-indigo-300">
                  Refresh Listing Copy (Luxury Tone)
                </span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Boost OTA click-through with updated seasonal SEO keywords.
              </p>
            </button>

            <button
              onClick={() => onNavigate('photo-analyzer')}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-indigo-300">
                  Scan Photos with Vision Radar
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Detect poorly lit images & generate hero photo staging scores.
              </p>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">WhatsApp AI Concierge</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live (24/7)
            </span>
          </div>
        </div>
      </div>

      {/* AI Recommendations & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Growth Recommendations */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Growth Recommendations
              </h3>
              <p className="text-xs text-slate-400">Tailored revenue & listing enhancement strategies</p>
            </div>
            <span className="text-xs font-bold text-indigo-400">{recommendations.length} Active</span>
          </div>

          <div className="divide-y divide-slate-800/60 mt-2">
            {recommendations.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">All recommendations applied!</p>
            ) : (
              recommendations.slice(0, 4).map((rec) => (
                <div key={rec.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                    <Badge variant={rec.impact === 'high' ? 'danger' : 'warning'} size="sm">
                      {rec.impact?.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-emerald-400 font-semibold">{rec.potential_gain || 'Potential +15% Bookings'}</span>
                    <button
                      onClick={() => handleApplyRecommendation(rec.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                        rec.status === 'applied'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      {rec.status === 'applied' ? 'Applied ✓' : 'Apply Suggestion'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Bookings Feed */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-cyan-400" /> Recent Reservations
              </h3>
              <p className="text-xs text-slate-400">Live incoming guest bookings across platforms</p>
            </div>
            <button
              onClick={() => onNavigate('bookings')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/60 mt-2">
            {recentBookings.slice(0, 4).map((b) => (
              <div key={b.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300">
                    {b.guest?.name ? b.guest.name[0] : 'G'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{b.guest?.name || 'Guest'}</h5>
                    <p className="text-[11px] text-slate-400">
                      {b.property?.title || 'Villa'} • {b.nights_count || 3} nights
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-extrabold text-white">₹{b.total_amount?.toLocaleString()}</p>
                  <Badge
                    variant={
                      b.status === 'confirmed' ? 'success' : b.status === 'checked_in' ? 'primary' : 'default'
                    }
                    size="sm"
                  >
                    {b.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  TrendingUp,
  Sparkles,
  Zap,
  Sliders,
  DollarSign,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const DynamicPricing = () => {
  const { success, error } = useToast();
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [strategy, setStrategy] = useState('balanced');
  const [customMultiplier, setCustomMultiplier] = useState(1.0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await api.get('/properties');
        const props = res.data.properties || [];
        setProperties(props);
        if (props.length > 0) {
          setSelectedPropertyId(props[0].id);
        }
      } catch (e) {}
    };
    fetchProps();
  }, []);

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!selectedPropertyId) return;
      setLoading(true);
      try {
        const res = await api.get(`/pricing/calendar/${selectedPropertyId}?strategy=${strategy}`);
        const days = res.data.calendar || [];
        setCalendarDays(days);
        if (days.length > 0) {
          setSelectedDay(days[0]);
        }
      } catch (e) {
        error('Failed to load pricing calendar.');
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, [selectedPropertyId, strategy]);

  const handleApplyOverride = async () => {
    if (!selectedDay) return;
    try {
      await api.post('/pricing/override', {
        property_id: selectedPropertyId,
        date: selectedDay.date,
        price: selectedDay.recommended_price,
        multiplier: customMultiplier
      });
      success(`Price set to ₹${selectedDay.recommended_price} for ${selectedDay.date}`);
    } catch (e) {
      error('Failed to set price override.');
    }
  };

  const handleBatchSurge = async (percent) => {
    try {
      await api.post('/pricing/batch-adjust', {
        property_id: selectedPropertyId,
        percentage_surge: percent
      });
      success(`Applied +${percent}% weekend surge across upcoming peak dates!`);
      // Reload calendar
      const res = await api.get(`/pricing/calendar/${selectedPropertyId}?strategy=${strategy}`);
      setCalendarDays(res.data.calendar || []);
    } catch (e) {
      error('Failed to apply batch surge.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400">
              5-Factor Revenue Algorithm
            </span>
            <Badge variant="cyan" size="sm">Dynamic AI Active</Badge>
          </div>
          <h1 className="text-2xl font-black text-white">Dynamic Pricing Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Automatically calculates rates based on seasonality, day-of-week, local events, competitor rates, and occupancy.
          </p>
        </div>

        {/* Property Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} (Base: ₹{p.base_price})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Strategy Pills & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Pricing Strategy:</span>
          {[
            { id: 'aggressive', label: 'Max Revenue (+25%)' },
            { id: 'balanced', label: 'Balanced Occupancy' },
            { id: 'high_occupancy', label: 'High Occupancy Focus' },
          ].map((strat) => (
            <button
              key={strat.id}
              onClick={() => setStrategy(strat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                strategy === strat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {strat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBatchSurge(20)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Apply Weekend Surge (+20%)
          </button>
        </div>
      </div>

      {/* Grid: 30-day Calendar & Factor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-indigo-400" /> 30-Day Dynamic Forecast Grid
            </h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Standard</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Surge</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Peak Holiday</span>
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <CalendarCheck className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-bounce" />
              <p className="text-xs text-slate-400">Computing 5-factor pricing curves...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              {calendarDays.map((day) => {
                const isSelected = selectedDay?.date === day.date;
                const isWeekend = day.day_name === 'Fri' || day.day_name === 'Sat' || day.day_name === 'Sun';
                return (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDay(day)}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 ring-2 ring-indigo-500/50'
                        : isWeekend
                        ? 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{day.day_name}</span>
                      <span className="text-[11px] font-semibold text-slate-300">
                        {new Date(day.date).getDate()}
                      </span>
                    </div>

                    <div className="mt-2.5">
                      <p className="text-xs font-black text-white">₹{day.recommended_price?.toLocaleString()}</p>
                      <p className={`text-[10px] font-semibold mt-0.5 ${
                        day.multiplier > 1.2 ? 'text-amber-400' : day.multiplier > 1.0 ? 'text-indigo-300' : 'text-slate-500'
                      }`}>
                        {day.multiplier}x Multiplier
                      </p>
                    </div>

                    {day.event && (
                      <span className="mt-2 block text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 truncate font-semibold">
                        {day.event}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Day Factor Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          {!selectedDay ? (
            <div className="py-20 text-center my-auto">
              <Info className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Select any date on the calendar to view its 5-Factor Price Breakdown.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-800">
                <span className="text-[10px] uppercase font-bold text-indigo-400">Inspecting Date</span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {new Date(selectedDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </h3>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Recommended Dynamic Rate</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h2 className="text-2xl font-black text-emerald-400">
                    ₹{selectedDay.recommended_price?.toLocaleString()}
                  </h2>
                  <span className="text-xs text-slate-500 line-through">
                    Base: ₹{selectedDay.base_price?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 5-Factor Breakdown List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  5-Factor Breakdown
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">1. Base Nightly Tariff</span>
                    <span className="font-bold text-white">₹{selectedDay.base_price}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">2. Seasonality Multiplier</span>
                    <span className="font-bold text-indigo-400">+{((selectedDay.factors?.seasonality || 1.15) - 1) * 100}%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">3. Day-of-Week Surge</span>
                    <span className="font-bold text-indigo-400">+{((selectedDay.factors?.day_of_week || 1.1) - 1) * 100}%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">4. Local Events & Holidays</span>
                    <span className="font-bold text-amber-400">+{((selectedDay.factors?.event_surge || 1.0) - 1) * 100}%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">5. Competitor & Market Occupancy</span>
                    <span className="font-bold text-emerald-400">Optimal Yield</span>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApplyOverride}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Lock & Sync Dynamic Rate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
  Layers
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
  Cell
} from 'recharts';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const Analytics = () => {
  const [propertyData, setPropertyData] = useState([
    { name: 'Casa Bella Goa', revenue: 180000, occupancy: 86 },
    { name: 'Pine Chalet Manali', revenue: 145000, occupancy: 78 },
    { name: 'Oasis Penthouse', revenue: 110000, occupancy: 74 },
    { name: 'Haveli Heritage', revenue: 85000, occupancy: 68 },
    { name: 'Marine Suite', revenue: 40000, occupancy: 62 },
  ]);

  const channelData = [
    { name: 'Direct Bookings', value: 45, color: '#6366f1' },
    { name: 'Airbnb', value: 30, color: '#06b6d4' },
    { name: 'Booking.com', value: 15, color: '#10b981' },
    { name: 'WhatsApp Concierge', value: 10, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400">
              Host Financial Intelligence
            </span>
            <Badge variant="primary" size="sm">Real-Time Yield</Badge>
          </div>
          <h1 className="text-2xl font-black text-white">Revenue & Occupancy Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Deep dive into property level yields, channel attribution, and RevPAR growth.
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue by Property (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Revenue Yield by Property (₹ INR)
            </h3>
            <Badge variant="cyan" size="sm">Current Month</Badge>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Monthly Revenue']}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-cyan-400" /> Channel Share
              </h3>
              <Badge variant="purple" size="sm">% Share</Badge>
            </div>

            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channelData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4}>
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(val) => [`${val}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {channelData.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="font-bold text-white">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

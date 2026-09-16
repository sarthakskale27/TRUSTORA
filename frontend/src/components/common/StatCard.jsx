import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, change, isPositive, subtitle, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'from-indigo-600 to-indigo-700 text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
    emerald: 'from-emerald-600 to-emerald-700 text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    cyan: 'from-cyan-600 to-cyan-700 text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
    amber: 'from-amber-600 to-amber-700 text-amber-400 border-amber-500/20 bg-amber-500/5',
    purple: 'from-purple-600 to-purple-700 text-purple-400 border-purple-500/20 bg-purple-500/5',
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1.5 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colorMap[color] || colorMap.indigo} shadow-inner`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {change && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
        <span className="text-[11px] text-slate-400 truncate">{subtitle}</span>
      </div>
    </div>
  );
};

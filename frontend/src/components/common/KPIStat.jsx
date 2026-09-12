import React from 'react';

export default function KPIStat({ title, value, unit, change, icon: Icon, color = 'cyan', subtext, onClick }) {
  const colorMap = {
    red: 'text-red-400 border-red-500/30 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
    orange: 'text-orange-400 border-orange-500/30 bg-orange-950/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]',
    purple: 'text-purple-400 border-purple-500/30 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]',
    slate: 'text-slate-300 border-slate-700/60 bg-slate-900/40'
  };

  const currentTheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md transition-all duration-200 hover:border-slate-700 ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400 font-mono">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg border ${currentTheme}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white font-mono">
          {value ?? '—'}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
        {change && (
          <span className="text-xs font-mono text-emerald-400 ml-auto">
            {change}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-[11px] text-slate-400 truncate">
          {subtext}
        </p>
      )}
    </div>
  );
}

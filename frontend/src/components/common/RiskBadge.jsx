import React from 'react';

export default function RiskBadge({ level = 'LOW', score, size = 'md' }) {
  const styles = {
    CRITICAL: 'bg-red-500/15 text-red-400 border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.25)]',
    HIGH: 'bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.2)]',
    MEDIUM: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    LOW: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    UNCERTAIN: 'bg-slate-500/15 text-slate-400 border-slate-500/30'
  };

  const currentStyle = styles[level] || styles.LOW;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm font-semibold' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${currentStyle} ${sizeClass} font-mono uppercase tracking-wider`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        level === 'CRITICAL' ? 'bg-red-400 animate-ping' :
        level === 'HIGH' ? 'bg-orange-400' :
        level === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
      }`} />
      <span>{level}</span>
      {score !== undefined && (
        <span className="opacity-80 font-bold ml-0.5">({score})</span>
      )}
    </span>
  );
}

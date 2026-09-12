import React from 'react';
import { Flame, Factory, Trees, Wheat, RefreshCw, HelpCircle } from 'lucide-react';

export default function ClassificationBadge({ classification = 'UNCERTAIN ANOMALY', size = 'md' }) {
  const configs = {
    'INDUSTRIAL FIRE': {
      bg: 'bg-red-500/15 text-red-300 border-red-500/40',
      icon: Flame,
      label: 'Industrial Fire'
    },
    'PERSISTENT THERMAL SOURCE': {
      bg: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
      icon: RefreshCw,
      label: 'Persistent Source'
    },
    'NATURAL / WILDFIRE': {
      bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      icon: Trees,
      label: 'Wildfire / Natural'
    },
    'AGRICULTURAL BURNING': {
      bg: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
      icon: Wheat,
      label: 'Agricultural Burn'
    },
    'ROUTINE INDUSTRIAL HEAT': {
      bg: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
      icon: Factory,
      label: 'Routine Industrial'
    },
    'UNCERTAIN ANOMALY': {
      bg: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
      icon: HelpCircle,
      label: 'Uncertain Anomaly'
    }
  };

  const config = configs[classification] || configs['UNCERTAIN ANOMALY'];
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : size === 'lg' ? 'px-3 py-1.5 text-sm gap-2 font-medium' : 'px-2.5 py-1 text-xs gap-1.5 font-medium';

  return (
    <span className={`inline-flex items-center rounded-md border ${config.bg} ${sizeClasses} whitespace-nowrap`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
}

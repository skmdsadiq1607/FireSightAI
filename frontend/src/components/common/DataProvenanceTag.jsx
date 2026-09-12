import React from 'react';
import { Satellite, MapPin, Database, Cpu } from 'lucide-react';

export default function DataProvenanceTag({ source = 'NASA FIRMS' }) {
  const getSourceConfig = (src) => {
    const s = src.toLowerCase();
    if (s.includes('firms') || s.includes('viirs') || s.includes('modis')) {
      return { label: 'NASA FIRMS VIIRS', icon: Satellite, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60' };
    }
    if (s.includes('osm') || s.includes('openstreetmap') || s.includes('overpass')) {
      return { label: 'OpenStreetMap Overpass', icon: MapPin, color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' };
    }
    if (s.includes('sentinel') || s.includes('copernicus')) {
      return { label: 'Copernicus Sentinel-2', icon: Satellite, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60' };
    }
    if (s.includes('ai') || s.includes('model') || s.includes('forest')) {
      return { label: 'FireSight ML Engine', icon: Cpu, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' };
    }
    return { label: source, icon: Database, color: 'text-slate-400 bg-slate-900/60 border-slate-800' };
  };

  const config = getSourceConfig(source);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${config.color}`}>
      <Icon className="w-2.5 h-2.5" />
      <span>{config.label}</span>
    </span>
  );
}

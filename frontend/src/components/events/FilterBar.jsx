import React from 'react';
import { Filter, RotateCcw, Flame, Check } from 'lucide-react';

export default function FilterBar({ filters, onFilterChange, onReset }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2 px-5 bg-[#0B0F19] border-b border-slate-800 text-xs text-slate-300 select-none">
      <div className="flex items-center gap-1.5 text-slate-400 font-medium shrink-0 pr-3 border-r border-slate-800">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        <span>Filter</span>
      </div>

      {/* Classification Select */}
      <div className="flex items-center gap-1.5 shrink-0">
        <label className="text-slate-400">Class:</label>
        <select
          value={filters.classification || 'ALL'}
          onChange={(e) => onFilterChange('classification', e.target.value)}
          className="bg-slate-900 border border-slate-700/60 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-slate-500 text-xs"
        >
          <option value="ALL">All</option>
          <option value="INDUSTRIAL FIRE">Industrial Fire</option>
          <option value="PERSISTENT THERMAL SOURCE">Persistent Source</option>
          <option value="NATURAL / WILDFIRE">Wildfire</option>
          <option value="AGRICULTURAL BURNING">Agricultural</option>
          <option value="ROUTINE INDUSTRIAL HEAT">Routine Heat</option>
          <option value="UNCERTAIN ANOMALY">Uncertain</option>
        </select>
      </div>

      {/* Risk Level Select */}
      <div className="flex items-center gap-1.5 shrink-0">
        <label className="text-slate-400">Risk:</label>
        <select
          value={filters.riskLevel || 'ALL'}
          onChange={(e) => onFilterChange('riskLevel', e.target.value)}
          className="bg-slate-900 border border-slate-700/60 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-slate-500 text-xs"
        >
          <option value="ALL">All</option>
          <option value="CRITICAL">Critical (81-100)</option>
          <option value="HIGH">High (61-80)</option>
          <option value="MEDIUM">Medium (31-60)</option>
          <option value="LOW">Low (0-30)</option>
        </select>
      </div>

      {/* Satellite Select */}
      <div className="flex items-center gap-1.5 shrink-0">
        <label className="text-slate-400">Sensor:</label>
        <select
          value={filters.satellite || 'ALL'}
          onChange={(e) => onFilterChange('satellite', e.target.value)}
          className="bg-slate-900 border border-slate-700/60 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-slate-500 text-xs"
        >
          <option value="ALL">All Sensors</option>
          <option value="N20">NOAA-20 VIIRS</option>
          <option value="N">Suomi-NPP VIIRS</option>
        </select>
      </div>

      {/* Persistent Toggle Button */}
      <button
        onClick={() => onFilterChange('isPersistent', !filters.isPersistent)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shrink-0 transition-all ${
          filters.isPersistent
            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${filters.isPersistent ? 'bg-purple-400' : 'bg-slate-600'}`} />
        <span>Persistent Only (&ge;2 Days)</span>
      </button>

      {/* Reset Filters */}
      <button
        onClick={onReset}
        className="ml-auto flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 text-xs shrink-0 transition-colors"
        title="Reset all filters"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset</span>
      </button>
    </div>
  );
}

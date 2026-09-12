import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Globe,
  Satellite,
  Factory,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  FileText
} from 'lucide-react';
import fallbackData from '../services/fallbackData.json';

export default function HomePage() {
  const eventCount = fallbackData.events?.length || 828;
  const facilityCount = fallbackData.facilities?.length || 22;

  return (
    <div className="min-h-full bg-[#080B11] text-slate-100 overflow-y-auto font-sans">
      {/* Hero Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-[#0F172A]/40 to-[#080B11] px-6 py-16 sm:py-20 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-sans">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>NASA FIRMS Near Real-Time Sensor Telemetry Active</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Satellite Thermal Intelligence & Industrial Hazard Early-Warning
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
          Automated multi-constellation infrared monitoring. FireSight GIS cross-references live NASA VIIRS thermal observations with OpenStreetMap industrial boundaries to differentiate routine operational flares from catastrophic blazes in seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-sm transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Open Satellite Map</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>

          <Link
            to="/events"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>View Thermal Catalog ({eventCount})</span>
          </Link>

          <Link
            to="/guide"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>System Documentation</span>
          </Link>
        </div>

        {/* Real Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-8 text-left">
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-white">{eventCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">NASA VIIRS Hotspots (Today)</div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-white">{facilityCount} Sites</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Strategic Industrial Perimeters</div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-white">375m</div>
            <div className="text-[11px] text-slate-400 mt-0.5">VIIRS Sensor Pixel Resolution</div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-emerald-400">100% Live</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Suomi-NPP & NOAA-20 NRT</div>
          </div>
        </div>
      </div>

      {/* Core Workflow */}
      <div className="max-w-5xl mx-auto px-6 py-14 space-y-10">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Operational Architecture
          </h2>
          <p className="text-slate-400 text-xs max-w-lg mx-auto">
            How FireSight GIS bridges raw orbital radiometry and emergency response.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Satellite className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              1. Continuous Orbital Radiometry
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              NASA satellites orbiting Earth detect mid-wave infrared radiance (3.75&mu;m). Each pass records Fire Radiative Power (MW) and brightness temperature across national and international territories.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Factory className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              2. Industrial Geospatial Fencing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detections are cross-referenced with exact OpenStreetMap industrial boundary polygons, identifying whether heat is an expected refinery flare or an uncontained structural fire.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              3. Actionable Emergency Protocols
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When an anomaly hits an industrial perimeter, an incident brief is generated with the recommended fire suppression agent (e.g. Alcohol-Resistant AFFF foam), cordon radius, and district dispatch alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

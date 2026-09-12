import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Satellite,
  ShieldAlert,
  Compass,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Globe2,
  Building2,
  Clock
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-full bg-[#07090E] text-slate-100 overflow-y-auto">
      {/* Hero Section */}
      <div className="relative border-b border-slate-800 bg-gradient-to-b from-[#0F172A]/50 via-[#07090E] to-[#07090E] px-6 py-16 sm:py-24 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Smart India Hackathon 2026 &bull; Problem ID: SIH26162</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-mono text-white">
          See the Heat. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-red-500">
            Understand the Disaster Risk.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
          An automated disaster intelligence command platform that ingests live NASA satellite infrared telemetry, cross-references industrial perimeters, separates routine flares from catastrophic blazes, and auto-generates tactical evacuation orders.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all font-mono"
          >
            <Compass className="w-4 h-4" />
            <span>Launch Tactical Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/guide"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-medium text-sm transition-all font-mono"
          >
            <Satellite className="w-4 h-4 text-cyan-400" />
            <span>Read Platform Guide</span>
          </Link>
        </div>

        {/* Live Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
          <div className="p-4 rounded-xl bg-[#0B101D] border border-slate-800">
            <div className="text-2xl font-bold font-mono text-orange-400">400+</div>
            <div className="text-xs text-slate-400 mt-1">Live NASA Satellite Detections (Today)</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0B101D] border border-slate-800">
            <div className="text-2xl font-bold font-mono text-cyan-400">22 Sites</div>
            <div className="text-xs text-slate-400 mt-1">Monitored Indian Petrochemical, Refinery & Steel Hubs</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0B101D] border border-slate-800">
            <div className="text-2xl font-bold font-mono text-amber-400">&lt; 2.0s</div>
            <div className="text-xs text-slate-400 mt-1">Groq LPU Incident Action Directive Speed</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0B101D] border border-slate-800">
            <div className="text-2xl font-bold font-mono text-emerald-400">100% Real</div>
            <div className="text-xs text-slate-400 mt-1">Suomi-NPP & NOAA-20 VIIRS Telemetry</div>
          </div>
        </div>
      </div>

      {/* 3-Step Plain Language Explanation */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white">
            How It Works (In Plain English)
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Traditional satellites only report raw heat coordinates. FireSight AI turns those pixels into emergency rescue decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0B101D] border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Satellite className="w-4 h-4 text-cyan-400" />
              Continuous Orbital Scans
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              NASA satellites orbiting Earth detect mid-wave infrared heat radiation (3.75&micro;m). They capture ground thermal energy (FRP) and temperature across India every single pass.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B101D] border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-mono font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-400" />
              Industrial Spatial Fencing
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              The platform maps OpenStreetMap industrial boundaries. It ignores safe farm stubble and flags any sudden fire inside refineries, chemical yards, or hazardous facilities.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B101D] border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-mono font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-400" />
              Instant Action Directives
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Instead of an empty alert, Groq AI computes a safe evacuation perimeter, specifies the exact fire suppression foam (e.g. Alcohol-Resistant AFFF), and alerts NDRF/DDMA.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="border-t border-slate-800 bg-[#080C16] px-6 py-12 text-center">
        <h3 className="text-xl font-bold font-mono text-white mb-2">Ready to explore the intelligence center?</h3>
        <p className="text-sm text-slate-400 mb-6">Open the tactical map and test real-time thermal observations across India.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm font-mono transition-all"
        >
          <span>Open GIS Map Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

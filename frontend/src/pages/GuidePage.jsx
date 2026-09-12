import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Flame,
  Satellite,
  Building2,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-full bg-[#07090E] text-slate-100 overflow-y-auto p-6 sm:p-10 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>OPERATOR & VISITOR MANUAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
          FireSight AI User Guide
        </h1>
        <p className="text-slate-400 text-sm">
          Everything you need to know about the platform, data sources, and how to evaluate thermal anomalies.
        </p>
      </div>

      {/* Section 1: The Core Mission */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 text-xs flex items-center justify-center font-bold">1</span>
          What is the problem we are solving?
        </h2>
        <div className="p-5 rounded-xl bg-[#0B101D] border border-slate-800 space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            Satellites like NASA's Suomi-NPP fly around the Earth every day and detect thousands of hot spots across India. However:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li><strong className="text-slate-200">Over 90% are harmless:</strong> routine agricultural crop residue burns, controlled furnace exhausts, or brick kilns.</li>
            <li><strong className="text-slate-200">Critical industrial fires go unnoticed:</strong> If a chemical storage tank in a refinery complex catches fire at night, authorities often find out hours later when people call 112.</li>
          </ul>
          <p className="text-orange-300 font-semibold">
            FireSight AI acts as an automated 24/7 radar that filters out the harmless heat and sounds an instant alarm the moment a real industrial fire threatens lives.
          </p>
        </div>
      </div>

      {/* Section 2: How to Read the Map */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-bold">2</span>
          How to read the map and numbers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0B101D] border border-slate-800 space-y-2">
            <div className="text-sm font-bold text-cyan-300 font-mono">FRP (Fire Radiative Power)</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Measured in <strong>MegaWatts (MW)</strong>. This is how much raw heat energy the fire is releasing into the atmosphere.
              <br />&bull; 1 to 5 MW: Small grass/stubble fire.
              <br />&bull; 20 to 50+ MW: Large industrial fire or major flare stack.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B101D] border border-slate-800 space-y-2">
            <div className="text-sm font-bold text-amber-300 font-mono">Brightness Temperature (K)</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Measured in <strong>Kelvin</strong>. Normal ground temperature is ~300 K (27&deg;C). Fires spike the sensor up to 340 K &ndash; 380 K+ (70&deg;C to 110&deg;C+ averaged across a 375m pixel).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B101D] border border-slate-800 space-y-2">
            <div className="text-sm font-bold text-orange-300 font-mono">Cyan Outlined Boxes</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              These are <strong>OpenStreetMap Industrial Geometries</strong>. They mark the physical fences of real Indian facilities (like Hazira Petrochemicals, Jamnagar Refinery, Panipat Naphtha Cracker).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B101D] border border-slate-800 space-y-2">
            <div className="text-sm font-bold text-emerald-300 font-mono">Tactical Dark vs Satellite TrueColor</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use the top-right button on the map to switch between a dark operational view (best for viewing clusters) and ESRI high-resolution satellite imagery (best for seeing actual tanks and structures).
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Step-by-Step Walkthrough for Judges & Visitors */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">3</span>
          Recommended Demonstration Walkthrough
        </h2>
        <div className="p-5 rounded-xl bg-[#0B101D] border border-slate-800 space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-xs font-bold shrink-0">Step 1</span>
            <p className="text-slate-300">
              Go to the <Link to="/dashboard" className="text-orange-400 underline font-semibold">Dashboard</Link>. Notice the 400+ live satellite detections across India photographed today.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-xs font-bold shrink-0">Step 2</span>
            <p className="text-slate-300">
              Click <strong className="text-white">"Case A: Industrial Fire (Hazira)"</strong> at the top. Watch the map fly straight to the petrochemical terminal in Gujarat.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-xs font-bold shrink-0">Step 3</span>
            <p className="text-slate-300">
              Click <strong className="text-white">"View Full Dossier"</strong> on the right panel. Inspect the AI-generated incident directive, safe cordon radius, and firefighting foam recommendations.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-xs font-bold shrink-0">Step 4</span>
            <p className="text-slate-300">
              Visit the <Link to="/facilities" className="text-orange-400 underline font-semibold">Facilities</Link> and <Link to="/analytics" className="text-orange-400 underline font-semibold">Analytics</Link> tabs on the sidebar to review monitored assets and historical heat trends.
            </p>
          </div>
        </div>
      </div>

      {/* Button to Dashboard */}
      <div className="pt-4 text-center">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-mono font-semibold text-sm transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]"
        >
          <span>Go to Interactive Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

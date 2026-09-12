import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  LayoutDashboard,
  Flame,
  Factory,
  BarChart3,
  Activity,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home Overview', icon: Home },
  { path: '/guide', label: 'User Guide & FAQ', icon: BookOpen, badge: 'Help' },
  { path: '/dashboard', label: 'Tactical GIS Map', icon: LayoutDashboard, badge: 'Live' },
  { path: '/events', label: 'Thermal Events', icon: Flame },
  { path: '/facilities', label: 'Facilities', icon: Factory },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/monitoring', label: 'Monitoring', icon: Activity, badge: 'Telemetry' },
  { path: '/settings', label: 'Settings', icon: Settings }
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-[#080C16] flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="p-4 space-y-6">
        {/* Navigation Group */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            Intelligence Center
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.15)] font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Core Differentiation Callout Box */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
            <Flame className="w-3.5 h-3.5" />
            <span>CORE PRINCIPLE</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
            Thermal Anomaly &ne; Confirmed Fire.
          </p>
          <div className="text-[10px] text-slate-400 space-y-1 font-mono pt-1 border-t border-slate-800">
            <div>&bull; NASA FIRMS &rarr; Anomaly</div>
            <div>&bull; OSM &rarr; Industrial Context</div>
            <div>&bull; Multi-Day &rarr; Persistence</div>
            <div>&bull; AI Engine &rarr; Risk Prioritization</div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <div className="truncate">
            <p className="text-slate-200 font-semibold text-[11px]">Smart India Hackathon</p>
            <p className="text-[10px] text-slate-400 font-mono">Problem: SIH26162</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

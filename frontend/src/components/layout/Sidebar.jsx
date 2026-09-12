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
  { path: '/', label: 'Overview', icon: Home },
  { path: '/dashboard', label: 'Satellite Map', icon: LayoutDashboard },
  { path: '/events', label: 'Thermal Detections', icon: Flame },
  { path: '/facilities', label: 'Industrial Assets', icon: Factory },
  { path: '/analytics', label: 'Statistics', icon: BarChart3 },
  { path: '/guide', label: 'Documentation', icon: BookOpen }
];

export default function Sidebar() {
  return (
    <aside className="w-56 border-r border-slate-800 bg-[#0B0F19] flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="p-3 space-y-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Clean Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/30">
        <div className="flex items-center gap-2.5 text-slate-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="truncate">
            <p className="text-slate-200 font-medium text-xs">Disaster Management Portal</p>
            <p className="text-[11px] text-slate-400">SIH 2026 &bull; SIH26162</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

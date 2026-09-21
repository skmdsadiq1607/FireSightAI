import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Flame,
  Satellite,
  RefreshCw,
  Search,
  BookOpen,
  BarChart3,
  Factory,
  Globe,
  Compass
} from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Overview', icon: Compass, end: true },
  { path: '/dashboard', label: 'Live Map', icon: Globe },
  { path: '/events', label: 'Thermal Events', icon: Flame },
  { path: '/facilities', label: 'Industrial Hubs', icon: Factory },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/guide', label: 'Guide', icon: BookOpen }
];

export default function TopBar({ onRefresh, isRefreshing }) {
  const [timeStr, setTimeStr] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-[#0A0E1A] px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm">
            <Flame className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm tracking-wide text-white">
              FireSight<span className="text-orange-400 font-semibold">GIS</span>
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              NASA FIRMS NRT
            </span>
          </div>
        </NavLink>

        {/* Primary Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700/80 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs w-full mx-4">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search facility, state, or event..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/60 font-sans"
        />
      </form>

      {/* Controls & Telemetry */}
      <div className="flex items-center gap-2.5">
        {/* Live Satellite Sensor Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-[11px] font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-300 font-medium">NASA VIIRS Live</span>
        </div>

        {/* Live Clock */}
        <div className="hidden xl:block text-[11px] font-mono text-slate-400 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded">
          {timeStr}
        </div>

        {/* Refresh Feed */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 text-xs transition-colors disabled:opacity-50"
          title="Query latest NASA FIRMS satellite telemetry"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-orange-400' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </header>
  );
}

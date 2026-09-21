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
    <header className="h-[52px] border-b border-white/[0.08] bg-[#090A0F]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-sm group-hover:border-orange-500/50 transition-colors">
            <Flame className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm tracking-tight text-white">
              FireSight
            </span>
            <span className="text-[10px] text-zinc-400 font-medium px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.06] hidden sm:inline">
              VIIRS 375m
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
                      ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 text-zinc-400" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs w-full mx-4">
        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search facility, coordinates, or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#12131A] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-white/10 font-sans transition-all"
        />
      </form>

      {/* Controls & Telemetry */}
      <div className="flex items-center gap-2.5">
        {/* Live Satellite Sensor Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-emerald-400 font-medium">828 Hotspots Logged</span>
        </div>

        {/* Live Clock */}
        <div className="hidden xl:block text-[11px] font-mono text-zinc-400 bg-[#12131A] border border-white/[0.08] px-2.5 py-1 rounded-md">
          {timeStr}
        </div>

        {/* Refresh Feed */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#12131A] hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] text-xs transition-colors disabled:opacity-50"
          title="Query latest NASA FIRMS satellite telemetry"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-orange-400' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </header>
  );
}

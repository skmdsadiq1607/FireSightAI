import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Satellite, RefreshCw, Search, ShieldAlert, Cpu } from 'lucide-react';
import api from '../../services/api';

export default function TopBar({ onRefresh, isRefreshing, dataMode = 'demo', onToggleMode }) {
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
    <header className="h-16 border-b border-slate-800 bg-[#0A0E1A]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-orange-600 to-amber-600 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
          <Flame className="w-5 h-5 text-white" />
          <Satellite className="w-3 h-3 text-cyan-200 absolute -top-1 -right-1" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-wider text-white font-mono">
              FIRESIGHT<span className="text-orange-500 font-black ml-1">AI</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30">
              SIH-2026
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            See the Heat. Understand the Risk.
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-md w-full mx-6">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search facility (e.g. Hazira, Jamnagar), event ID, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-700/70 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
        />
      </form>

      {/* Action Controls & Telemetry */}
      <div className="flex items-center gap-3">
        {/* Data Feed Mode Badge / Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => onToggleMode && onToggleMode(dataMode === 'demo' ? 'live' : 'demo')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
              dataMode === 'demo'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
            title="Click to toggle between Demo and Live Data Feeds"
          >
            <span className={`w-2 h-2 rounded-full ${dataMode === 'demo' ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
            <span>{dataMode === 'demo' ? 'DEMO DATA' : 'LIVE SATELLITE FEED'}</span>
          </button>
        </div>

        {/* Live Clock */}
        <div className="hidden lg:flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{timeStr}</span>
        </div>

        {/* Refresh Ingestion Trigger */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-all disabled:opacity-50"
          title="Poll latest thermal anomalies"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span className="hidden sm:inline">Poll Feeds</span>
        </button>
      </div>
    </header>
  );
}

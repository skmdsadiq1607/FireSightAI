import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Flame,
  Globe,
  RefreshCw,
  Search,
  Menu,
  X,
  ArrowUpRight
} from 'lucide-react';
import fallbackData from '../../services/fallbackData.json';

const navItems = [
  { path: '/dashboard', label: 'Live Map' },
  { path: '/events', label: 'Thermal Events' },
  { path: '/facilities', label: 'Industrial Hubs' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/guide', label: 'Guide' }
];

export default function TopBar({ onRefresh, isRefreshing }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const eventCount = fallbackData.events?.length || 828;

  return (
    <header className="h-16 border-b border-white/[0.07] bg-[#090A0F]/80 backdrop-blur-xl sticky top-0 z-40 shrink-0">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-950/40 group-hover:scale-105 transition-transform">
            <Flame className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">
                FireSight
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium tracking-wide -mt-0.5 hidden sm:block">
              Orbital Fire Intelligence
            </span>
          </div>
        </Link>

        {/* Spacious Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors relative py-1 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Live Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-zinc-200">{eventCount} Hotspots</span>
          </div>

          {/* Contextual Action Button */}
          {location.pathname !== '/dashboard' ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-orange-950/40"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Launch Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-300 text-xs font-medium transition-all disabled:opacity-50"
              title="Refresh satellite telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-orange-400' : ''}`} />
              <span>Refresh Feed</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0E1017] px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium py-1.5 transition-colors ${
                    isActive ? 'text-orange-400 font-semibold' : 'text-zinc-300 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{eventCount} Hotspots Active</span>
            </div>

            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-semibold"
            >
              Launch Map
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

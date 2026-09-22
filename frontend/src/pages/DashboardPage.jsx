import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import {
  Flame,
  Factory,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  X,
  Search,
  Radio,
  Layers,
  Sparkles
} from 'lucide-react';
import GISMap from '../components/map/GISMap';
import IntelligencePanel from '../components/events/IntelligencePanel';
import { eventService, facilityService } from '../services/api';
import fallbackData from '../services/fallbackData.json';

export default function DashboardPage() {
  const { refreshTrigger } = useOutletContext();
  const [searchParams] = useSearchParams();

  const [events, setEvents] = useState(fallbackData.events || []);
  const [facilities, setFacilities] = useState(fallbackData.facilities || []);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Left Incident Sidebar Toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarFilter, setSidebarFilter] = useState('ALL'); // 'ALL', 'INDUSTRIAL_FIRES', 'FLARES'
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Safe data fetcher with Promise.allSettled
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [eventsResult, facilitiesResult] = await Promise.allSettled([
        eventService.getEvents(),
        facilityService.getFacilities()
      ]);

      if (eventsResult.status === 'fulfilled' && eventsResult.value.data?.data?.length > 0) {
        setEvents(eventsResult.value.data.data);
      } else {
        setEvents(fallbackData.events || []);
      }

      if (facilitiesResult.status === 'fulfilled' && facilitiesResult.value.data?.data?.length > 0) {
        setFacilities(facilitiesResult.value.data.data);
      } else {
        setFacilities(fallbackData.facilities || []);
      }
    } catch (err) {
      console.warn('[GIS Map] Backend unreachable, using authentic NASA FIRMS satellite data:', err);
      setEvents(fallbackData.events || []);
      setFacilities(fallbackData.facilities || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // Check if an eventId was passed via query params
  useEffect(() => {
    const eventIdParam = searchParams.get('eventId');
    if (eventIdParam && events.length > 0) {
      const found = events.find(e => e.eventId === eventIdParam);
      if (found) {
        setSelectedEvent(found);
      }
    }
  }, [searchParams, events]);

  // Industrial & High Priority Events for Left Radar
  const industrialEvents = events.filter(e => e.insideIndustrialBoundary || (e.facilityDistance && e.facilityDistance <= 15000));
  
  const displayedSidebarEvents = industrialEvents.filter(e => {
    if (sidebarFilter === 'INDUSTRIAL_FIRES') {
      return e.classification === 'INDUSTRIAL FIRE' || e.riskLevel === 'CRITICAL';
    }
    if (sidebarFilter === 'FLARES') {
      return e.classification === 'PERSISTENT THERMAL SOURCE' || e.classification === 'ROUTINE INDUSTRIAL HEAT';
    }
    if (sidebarSearch.trim()) {
      const q = sidebarSearch.toLowerCase();
      return (
        (e.facilityName && e.facilityName.toLowerCase().includes(q)) ||
        (e.eventId && e.eventId.toLowerCase().includes(q)) ||
        (e.state && e.state.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Non-blocking event selection using React.startTransition
  const handleSelectEvent = React.useCallback((ev) => {
    React.startTransition(() => {
      setSelectedEvent(ev);
    });
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#090A0F] font-sans">
      {/* 100% Full-Bleed Map Canvas */}
      <div className="w-full h-full">
        <GISMap
          events={events}
          facilities={facilities}
          selectedEvent={selectedEvent}
          onSelectEvent={handleSelectEvent}
          showFacilities={true}
          showThermal={true}
        />
      </div>

      {/* Floating Left Incident Stream Drawer */}
      <div
        className={`absolute top-3 left-3 z-30 flex transition-all duration-300 pointer-events-none ${
          sidebarOpen ? 'w-[360px] sm:w-[390px] bottom-3' : 'w-auto'
        }`}
      >
        {sidebarOpen ? (
          <div className="w-full h-full rounded-2xl bg-[#0D0F17]/95 border border-white/[0.12] backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto text-zinc-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/[0.08] bg-[#111320] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span>Incident Surveillance Feed</span>
                  </h2>
                  <div className="text-[10px] text-zinc-400 font-medium">
                    {industrialEvents.length} Monitored Industrial Sites Active
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Collapse Incident Feed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="p-3 border-b border-white/[0.06] bg-[#0E1019] space-y-2 shrink-0">
              <div className="grid grid-cols-3 gap-1 bg-[#141624] p-1 rounded-lg text-xs">
                <button
                  onClick={() => setSidebarFilter('ALL')}
                  className={`py-1 rounded-md text-[11px] font-medium transition-all ${
                    sidebarFilter === 'ALL'
                      ? 'bg-white/[0.1] text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  All ({industrialEvents.length})
                </button>
                <button
                  onClick={() => setSidebarFilter('INDUSTRIAL_FIRES')}
                  className={`py-1 rounded-md text-[11px] font-medium transition-all ${
                    sidebarFilter === 'INDUSTRIAL_FIRES'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Critical Fires
                </button>
                <button
                  onClick={() => setSidebarFilter('FLARES')}
                  className={`py-1 rounded-md text-[11px] font-medium transition-all ${
                    sidebarFilter === 'FLARES'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Flares &amp; Heat
                </button>
              </div>

              {/* Quick Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by facility or city..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full bg-[#131522] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500/40"
                />
              </div>
            </div>

            {/* Scrollable Incidents List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
              {displayedSidebarEvents.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  No observations match the filter.
                </div>
              ) : (
                displayedSidebarEvents.map((ev) => {
                  const isSelected = selectedEvent?.eventId === ev.eventId;
                  const isCritical = ev.classification === 'INDUSTRIAL FIRE' || ev.riskLevel === 'CRITICAL';
                  const isHigh = ev.riskLevel === 'HIGH';

                  return (
                    <div
                      key={ev.eventId}
                      onClick={() => handleSelectEvent(ev)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-[#181B2C] border-orange-500 shadow-md shadow-orange-950/30'
                          : isCritical
                          ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/60 hover:bg-red-950/30'
                          : isHigh
                          ? 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-950/25'
                          : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                          {ev.facilityName || 'Thermal Anomaly'}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            isCritical
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : isHigh
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-white/[0.06] text-zinc-300 border border-white/[0.1]'
                          }`}
                        >
                          {ev.classification}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-400 mt-1">
                        {ev.state || ev.nearestCity || 'India'} &bull;{' '}
                        <span className="font-mono text-zinc-400">
                          {ev.latitude.toFixed(2)}&deg;N, {ev.longitude.toFixed(2)}&deg;E
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/[0.06] text-[11px]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-orange-400">
                            {ev.frp?.toFixed(1)} MW
                          </span>
                          <span className="text-zinc-400 font-mono">
                            {ev.brightnessTemperature?.toFixed(1)} K
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 group-hover:text-white transition-colors">
                          <span>Risk:</span>
                          <span
                            className={`font-bold font-mono ${
                              isCritical ? 'text-red-400' : isHigh ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {ev.riskScore || 20}/100
                          </span>
                          <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer Status */}
            <div className="p-3 border-t border-white/[0.08] bg-[#111320] flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>NASA VIIRS 375m Telemetry</span>
              </span>
              <span>{events.length} Total Passes</span>
            </div>
          </div>
        ) : (
          /* Collapsed Pill Button */
          <button
            onClick={() => setSidebarOpen(true)}
            className="h-10 px-3.5 rounded-xl bg-[#0D0F17]/95 border border-white/[0.15] backdrop-blur-xl shadow-2xl text-zinc-100 hover:text-white hover:border-orange-500/50 flex items-center gap-2 pointer-events-auto text-xs font-semibold whitespace-nowrap transition-all group"
            title="Expand Active Incident Feed"
          >
            <Flame className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform shrink-0" />
            <span>Active Incidents</span>
            <span className="px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-300 font-mono text-[11px] font-bold border border-orange-500/30">
              {industrialEvents.length}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Slide-Out Intelligence Dossier Panel (Right side) */}
      {selectedEvent && (
        <div className="absolute right-0 top-0 bottom-0 z-40 w-full sm:w-[440px] shadow-2xl animate-in slide-in-from-right duration-200">
          <IntelligencePanel
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onUpdateEvent={(updated) => {
              setSelectedEvent(updated);
              setEvents((prev) =>
                prev.map((e) => (e.eventId === updated.eventId ? updated : e))
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

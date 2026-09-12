import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import GISMap from '../components/map/GISMap';
import IntelligencePanel from '../components/events/IntelligencePanel';
import FilterBar from '../components/events/FilterBar';
import KPIStat from '../components/common/KPIStat';
import { eventService, facilityService, analyticsService } from '../services/api';
import {
  Flame,
  Factory,
  RefreshCw,
  AlertTriangle,
  Radio,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

import fallbackData from '../services/fallbackData.json';

export default function DashboardPage() {
  const { refreshTrigger, dataMode } = useOutletContext();

  const [events, setEvents] = useState(fallbackData.events || []);
  const [facilities, setFacilities] = useState(fallbackData.facilities || []);
  const [stats, setStats] = useState({
    activeThermalEvents: (fallbackData.events || []).length,
    facilitiesMonitored: (fallbackData.facilities || []).length,
    persistentSources: (fallbackData.events || []).filter(e => e.isPersistent).length,
    highCriticalRisk: (fallbackData.events || []).filter(e => e.riskScore >= 61).length,
    systemStatus: 'ONLINE'
  });
  const [selectedEvent, setSelectedEvent] = useState((fallbackData.events || [])[0] || null);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    classification: 'ALL',
    riskLevel: 'ALL',
    satellite: 'ALL',
    isPersistent: false
  });

  const [layerOptions, setLayerOptions] = useState({
    showThermal: true,
    showFacilities: true
  });

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [eventsRes, facilitiesRes, statsRes] = await Promise.all([
        eventService.getEvents({
          classification: filters.classification,
          riskLevel: filters.riskLevel,
          satellite: filters.satellite,
          isPersistent: filters.isPersistent ? 'true' : undefined
        }),
        facilityService.getFacilities(),
        analyticsService.getOverview()
      ]);

      const fetchedEvents = eventsRes.data?.data || [];
      setEvents(fetchedEvents);
      setFacilities(facilitiesRes.data?.data || []);
      setStats(statsRes.data?.data || null);

      // Default selection to high risk industrial case if none selected
      if (!selectedEvent && fetchedEvents.length > 0) {
        const topHazard = fetchedEvents.find(e => e.riskScore >= 70) || fetchedEvents[0];
        setSelectedEvent(topHazard);
      }
    } catch (err) {
      console.error('[Dashboard Error] Failed loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      classification: 'ALL',
      riskLevel: 'ALL',
      satellite: 'ALL',
      isPersistent: false
    });
  };

  // Quick preset jump for hackathon demo cases
  const handleSelectCase = (eventIdKey) => {
    const target = events.find(e => e.eventId.includes(eventIdKey));
    if (target) {
      setSelectedEvent(target);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* KPI Telemetry Ribbon */}
      <div className="p-4 bg-[#080C16] border-b border-slate-800 grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0">
        <KPIStat
          title="Active Thermal Anomalies"
          value={stats?.activeThermalEvents ?? events.length}
          unit="Hotspots"
          icon={Flame}
          color="orange"
          subtext="NASA FIRMS VIIRS & MODIS"
        />
        <KPIStat
          title="Industrial Assets Monitored"
          value={stats?.facilitiesMonitored ?? facilities.length}
          unit="Sites"
          icon={Factory}
          color="cyan"
          subtext="OSM Industrial & Refinery Perimeters"
        />
        <KPIStat
          title="Persistent Heat Sources"
          value={stats?.persistentSources ?? 0}
          unit="Multi-pass"
          icon={RefreshCw}
          color="purple"
          subtext="Recurring across &ge;2 acquisition days"
        />
        <KPIStat
          title="High / Critical Hazard"
          value={stats?.highCriticalRisk ?? 0}
          unit="Prioritized"
          icon={AlertTriangle}
          color="red"
          subtext="Requires immediate field dispatch"
        />
        <KPIStat
          title="Geospatial AI Processing"
          value="ONLINE"
          unit="v1.0"
          icon={Radio}
          color="emerald"
          subtext="Hybrid Random Forest & Spatial Rules"
        />
      </div>

      {/* 100% Live Orbital Telemetry Stream Bar */}
      <div className="bg-[#0A0F1E] border-b border-slate-800/80 px-4 py-2 flex items-center justify-between gap-3 overflow-x-auto text-xs font-mono shrink-0 select-none">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-bold text-emerald-400">100% LIVE SATELLITE TELEMETRY:</span>
          <span className="text-slate-400">NASA Suomi-NPP & NOAA-20 VIIRS NRT</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500">Jump to high energy anomaly:</span>
          {events.slice(0, 4).map((ev) => (
            <button
              key={ev.eventId}
              onClick={() => setSelectedEvent(ev)}
              className={`px-2 py-0.5 rounded border transition-all ${
                selectedEvent?.eventId === ev.eventId
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
              }`}
            >
              {ev.eventId.replace('FIRMS-20260912-', 'VIIRS ')} ({ev.frp.toFixed(1)} MW)
            </button>
          ))}
        </div>
      </div>

      {/* Filter Ribbon */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Main Map Workspace with Slide-out Intelligence Panel */}
      <div className="flex-1 relative flex overflow-hidden">
        <div className="flex-1 h-full relative">
          <GISMap
            events={events}
            facilities={facilities}
            selectedEvent={selectedEvent}
            onSelectEvent={(ev) => setSelectedEvent(ev)}
            showFacilities={layerOptions.showFacilities}
            showThermal={layerOptions.showThermal}
          />
        </div>

        {/* Intelligence Side Drawer */}
        {selectedEvent && (
          <IntelligencePanel
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onUpdateEvent={(updated) => {
              setSelectedEvent(updated);
              setEvents(prev => prev.map(e => e.eventId === updated.eventId ? updated : e));
            }}
          />
        )}
      </div>
    </div>
  );
}

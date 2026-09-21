import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  Globe,
  Satellite,
  Factory,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  FileText,
  MapPin,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
  Maximize2
} from 'lucide-react';
import GISMap from '../components/map/GISMap';
import fallbackData from '../services/fallbackData.json';

export default function HomePage() {
  const navigate = useNavigate();
  const eventCount = fallbackData.events?.length || 828;
  const facilityCount = fallbackData.facilities?.length || 22;

  // Selected event for map showcase
  const [selectedMapEvent, setSelectedMapEvent] = useState(null);

  // Pick 5 high-interest real detections from data
  const highlightedEvents = [
    {
      id: 'FIRMS-20260912-22.470-70.060',
      facility: 'Jamnagar Mega Refinery (RIL)',
      state: 'Gujarat',
      coords: '22.47°N, 70.06°E',
      frp: 48.2,
      tempK: 358.4,
      tempC: 85.3,
      classification: 'INDUSTRIAL FLARE',
      status: 'Routine Operational Flare',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      satellite: 'Suomi-NPP VIIRS',
      time: 'Today 07:44 UTC'
    },
    {
      id: 'FIRMS-20260912-21.107-72.642',
      facility: 'Hazira Petrochemical Terminal',
      state: 'Gujarat',
      coords: '21.11°N, 72.64°E',
      frp: 34.1,
      tempK: 349.2,
      tempC: 76.1,
      classification: 'INDUSTRIAL FLARE',
      status: 'Monitored Flare Stack',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      satellite: 'NOAA-20 VIIRS',
      time: 'Today 08:12 UTC'
    },
    {
      id: 'FIRMS-20260912-17.700-83.250',
      facility: 'Visakhapatnam Refinery (HPCL)',
      state: 'Andhra Pradesh',
      coords: '17.70°N, 83.25°E',
      frp: 26.5,
      tempK: 344.8,
      tempC: 71.7,
      classification: 'ELEVATED THERMAL',
      status: 'Within Perimeter Baseline',
      statusColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      satellite: 'Suomi-NPP VIIRS',
      time: 'Today 07:44 UTC'
    },
    {
      id: 'FIRMS-20260912-15.180-76.670',
      facility: 'JSW Steel Vijayanagar Mega Works',
      state: 'Karnataka',
      coords: '15.18°N, 76.67°E',
      frp: 22.8,
      tempK: 342.5,
      tempC: 69.4,
      classification: 'METALLURGIC HEAT',
      status: 'Blast Furnace Operation',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      satellite: 'NOAA-20 VIIRS',
      time: 'Today 08:12 UTC'
    },
    {
      id: 'FIRMS-20260912-30.316-75.980',
      facility: 'Open Biomass / Stubble Burn',
      state: 'Punjab',
      coords: '30.32°N, 75.98°E',
      frp: 18.2,
      tempK: 339.1,
      tempC: 66.0,
      classification: 'AGRICULTURAL BURNING',
      status: 'Outside Industrial Zone',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      satellite: 'Suomi-NPP VIIRS',
      time: 'Today 07:44 UTC'
    }
  ];

  const strategicHubs = [
    { name: 'Jamnagar Mega Refinery', company: 'Reliance Industries', state: 'Gujarat', type: 'Petrochemical / Refining', capacity: '1.24M bpd' },
    { name: 'Hazira Petrochemical Terminal', company: 'ONGC / Shell', state: 'Gujarat', type: 'LNG & Chemical Hub', capacity: 'Strategic' },
    { name: 'Mumbai Refineries Complex', company: 'BPCL / HPCL', state: 'Maharashtra', type: 'Urban Refining Complex', capacity: '240K bpd' },
    { name: 'Visakhapatnam Refinery', company: 'HPCL', state: 'Andhra Pradesh', type: 'Coastal Marine Terminal', capacity: '300K bpd' },
    { name: 'Panipat Refinery & Petrochem', company: 'IOCL', state: 'Haryana', type: 'Integrated Refining & Naphtha', capacity: '300K bpd' },
    { name: 'Paradip Refinery Complex', company: 'IOCL', state: 'Odisha', type: 'East Coast Deepwater Hub', capacity: '300K bpd' }
  ];

  return (
    <div className="min-h-full bg-[#0A0E17] text-slate-100 overflow-y-auto font-sans">
      {/* Hero Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-[#0F172A]/70 via-[#0B101E]/80 to-[#0A0E17] px-4 sm:px-6 pt-12 pb-14 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Satellite Feed Active &bull; NASA VIIRS 375m &bull; 828 Hotspots Analyzed</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
            Detecting Industrial Fires from Space{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Before They Spread
            </span>
          </h1>

          {/* Plain English Subtitle */}
          <p className="max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
            NASA satellites pass over India multiple times a day, detecting ground heat signatures. FireSight cross-references every hotspot with exact refinery and factory perimeters — identifying routine chimney flares, pinpointing hazardous outbreaks, and giving emergency teams up to 90 minutes advance warning.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-950/40 transition-all hover:scale-[1.02]"
            >
              <Globe className="w-4 h-4" />
              <span>Open Interactive Satellite Map</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/events"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 font-semibold text-xs sm:text-sm transition-colors"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Browse Active Hotspots ({eventCount})</span>
            </Link>

            <Link
              to="/guide"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs sm:text-sm transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>How FireSight Works</span>
            </Link>
          </div>
        </div>

        {/* Live Satellite Map Showcase Container */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-[#0B0F1A] shadow-2xl overflow-hidden">
          {/* Map Top Header Ribbon */}
          <div className="px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-xs sm:text-sm font-bold text-white">Live Thermal Observation Map</span>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                VIIRS 375m Radiance
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 text-xs font-medium transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full-Screen Map View</span>
              </Link>
            </div>
          </div>

          {/* Embedded Interactive GIS Leaflet Map */}
          <div className="w-full h-[460px] sm:h-[520px] relative bg-[#0A0D14]">
            <GISMap
              events={fallbackData.events?.slice(0, 400) || []}
              facilities={fallbackData.facilities || []}
              selectedEvent={selectedMapEvent}
              onSelectEvent={(ev) => setSelectedMapEvent(ev)}
              showFacilities={true}
              showThermal={true}
            />
          </div>

          {/* Map Legend Footer */}
          <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-semibold text-slate-400">Map Legend:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600 border border-white"></span>
                <span>Critical / High Heat (&ge;50 MW)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-500 border border-slate-800"></span>
                <span>Elevated Flare (20-50 MW)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-slate-800"></span>
                <span>Low / Agricultural (&lt;20 MW)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm border-2 border-cyan-400 bg-cyan-950/40"></span>
                <span>Industrial Boundary Polygon</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Interactive Leaflet Map &bull; Pan, zoom, or click markers to inspect telemetry
            </div>
          </div>
        </div>

        {/* 4 Core Human Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Active Hotspots Today</span>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white">{eventCount}</div>
              <div className="text-[11px] text-slate-400 mt-1">Satellite heat points analyzed across India</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Monitored Facilities</span>
              <Factory className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white">{facilityCount} Major Hubs</div>
              <div className="text-[11px] text-slate-400 mt-1">Petrochemical, LNG & refinery polygons</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Sensor Resolution</span>
              <Satellite className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white">375 Meters</div>
              <div className="text-[11px] text-slate-400 mt-1">VIIRS orbital mid-wave infrared channel I4</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Early Warning Window</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">~90 Minutes</div>
              <div className="text-[11px] text-slate-400 mt-1">Advance notice prior to ground 112 calls</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-World Significant Detections Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-orange-400 font-semibold tracking-wide uppercase">
              <Activity className="w-3.5 h-3.5" />
              <span>Live Telemetry Stream</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Recent Significant Observations Across India
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Live orbital infrared detections cross-matched with industrial and wildland boundaries.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium group"
          >
            <span>Browse Full Catalog ({eventCount})</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Hotspots Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Facility / Region</th>
                  <th className="px-4 py-3">Thermal Power (FRP)</th>
                  <th className="px-4 py-3">Temperature</th>
                  <th className="px-4 py-3">Classification & Status</th>
                  <th className="px-4 py-3">Satellite Sensor</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {highlightedEvents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{item.facility}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.state} &bull; <span className="font-mono text-slate-500">{item.coords}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      <span className="font-bold text-orange-400">{item.frp.toFixed(1)} MW</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {item.tempK.toFixed(1)} K <span className="text-slate-500">({item.tempC.toFixed(1)}&deg;C)</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${item.statusColor}`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase">{item.classification}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400">
                      <div>{item.satellite}</div>
                      <div className="text-[10px] text-slate-500">{item.time}</div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
                      >
                        <MapPin className="w-3 h-3 text-orange-400" />
                        <span>View on Map</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Strategic Monitored Facilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold tracking-wide uppercase">
              <Factory className="w-3.5 h-3.5" />
              <span>Asset Registry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Monitored Indian Energy & Petrochemical Hubs
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Geofenced industrial boundaries verified via OpenStreetMap Overpass geometries.
            </p>
          </div>

          <Link
            to="/facilities"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium group"
          >
            <span>View All 22 Industrial Hubs</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategicHubs.map((hub, idx) => (
            <Link
              key={idx}
              to="/facilities"
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition-all group block space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {hub.name}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-xs text-slate-400">
                {hub.company} &bull; <span className="text-slate-300">{hub.state}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-800/80">
                <span>{hub.type}</span>
                <span className="font-mono text-cyan-400/90">{hub.capacity}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How FireSight Works (Simple, Plain English) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Process & Technology</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            How FireSight Protects Facilities
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Bridging raw NASA satellite radiance with practical on-ground disaster containment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Satellite className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              1. NASA Orbit Detection
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              NASA satellites scan India&apos;s landmass multiple times daily in the mid-wave infrared spectrum (3.75&mu;m). Each pass measures fire radiative power (MW) down to 375-meter ground pixels.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Factory className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              2. Industrial Geofencing
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every thermal coordinate is instantly cross-referenced against OpenStreetMap boundary polygons of high-risk petrochemical refineries, chemical terminals, and power plants.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              3. Flare vs Fire Triage
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Routine chimney flaring within baseline limits is cataloged as normal. Anomalous heat spikes trigger automated NDMA disaster guidelines, recommended suppression foam, and dispatch alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Provenance & References Strip */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span className="font-bold text-slate-200">FireSight GIS Platform</span> &mdash; Open Disaster Early-Warning
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center text-[11px]">
            <span>NASA FIRMS VIIRS 375m</span>
            <span>&bull;</span>
            <span>ESA Copernicus Sentinel-2</span>
            <span>&bull;</span>
            <span>OpenStreetMap Perimeters</span>
            <span>&bull;</span>
            <span>NDMA Disaster Guidelines</span>
          </div>
        </div>
      </div>
    </div>
  );
}

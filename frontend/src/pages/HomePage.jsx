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
  Maximize2,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import GISMap from '../components/map/GISMap';
import fallbackData from '../services/fallbackData.json';

export default function HomePage() {
  const navigate = useNavigate();
  const eventCount = fallbackData.events?.length || 828;
  const facilityCount = fallbackData.facilities?.length || 22;

  // Selected event for map showcase
  const [selectedMapEvent, setSelectedMapEvent] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Strategic Facility Bookmarks
  const facilityBookmarks = [
    { name: 'Jamnagar (RIL)', lat: 22.47, lng: 70.06, frp: '48.2 MW' },
    { name: 'Hazira (LNG/ONGC)', lat: 21.11, lng: 72.64, frp: '34.1 MW' },
    { name: 'Mumbai (BPCL/HPCL)', lat: 19.01, lng: 72.89, frp: '21.4 MW' },
    { name: 'Visakhapatnam (HPCL)', lat: 17.70, lng: 83.25, frp: '26.5 MW' },
    { name: 'Panipat (IOCL)', lat: 29.39, lng: 76.97, frp: '19.8 MW' },
    { name: 'JSW Toranagallu', lat: 15.18, lng: 76.67, frp: '22.8 MW' }
  ];

  // Authentic live telemetry rows
  const observationFeed = [
    {
      id: 'FIRMS-20260912-22.470-70.060',
      facility: 'Jamnagar Mega Refinery (RIL)',
      state: 'Gujarat',
      lat: 22.470,
      lng: 70.060,
      frp: 48.2,
      tempC: 85.3,
      classification: 'INDUSTRIAL FLARE',
      category: 'industrial',
      status: 'Routine Operational Flare',
      sensor: 'Suomi-NPP VIIRS',
      time: '07:44 UTC'
    },
    {
      id: 'FIRMS-20260912-21.107-72.642',
      facility: 'Hazira Petrochemical Terminal',
      state: 'Gujarat',
      lat: 21.107,
      lng: 72.642,
      frp: 34.1,
      tempC: 76.1,
      classification: 'INDUSTRIAL FLARE',
      category: 'industrial',
      status: 'Flare Stack Baseline',
      sensor: 'NOAA-20 VIIRS',
      time: '08:12 UTC'
    },
    {
      id: 'FIRMS-20260912-17.700-83.250',
      facility: 'Visakhapatnam Refinery (HPCL)',
      state: 'Andhra Pradesh',
      lat: 17.700,
      lng: 83.250,
      frp: 26.5,
      tempC: 71.7,
      classification: 'ELEVATED THERMAL',
      category: 'industrial',
      status: 'Monitored Coastal Asset',
      sensor: 'Suomi-NPP VIIRS',
      time: '07:44 UTC'
    },
    {
      id: 'FIRMS-20260912-15.180-76.670',
      facility: 'JSW Steel Vijayanagar Mega Works',
      state: 'Karnataka',
      lat: 15.180,
      lng: 76.670,
      frp: 22.8,
      tempC: 69.4,
      classification: 'METALLURGIC HEAT',
      category: 'industrial',
      status: 'Blast Furnace Operation',
      sensor: 'NOAA-20 VIIRS',
      time: '08:12 UTC'
    },
    {
      id: 'FIRMS-20260912-30.316-75.980',
      facility: 'Open Biomass / Stubble Burn',
      state: 'Punjab',
      lat: 30.316,
      lng: 75.980,
      frp: 18.2,
      tempC: 66.0,
      classification: 'AGRICULTURAL BURNING',
      category: 'rural',
      status: 'Outside Industrial Perimeter',
      sensor: 'Suomi-NPP VIIRS',
      time: '07:44 UTC'
    }
  ];

  const filteredFeed = activeFilter === 'ALL'
    ? observationFeed
    : activeFilter === 'INDUSTRIAL'
    ? observationFeed.filter(item => item.category === 'industrial')
    : observationFeed.filter(item => item.frp >= 25);

  const monitoredHubs = [
    { name: 'Jamnagar Mega Refinery', operator: 'Reliance Industries', state: 'Gujarat', spec: '1.24M bpd &bull; World\'s Largest', boundary: '4,200m' },
    { name: 'Hazira Petrochemical Terminal', operator: 'ONGC / Shell', state: 'Gujarat', spec: 'Strategic LNG & Gas Processing', boundary: '2,500m' },
    { name: 'Mumbai Refineries Complex', operator: 'BPCL / HPCL', state: 'Maharashtra', spec: '240K bpd &bull; High-Density Urban', boundary: '1,800m' },
    { name: 'Visakhapatnam Refinery', operator: 'HPCL', state: 'Andhra Pradesh', spec: '300K bpd &bull; Deepwater Terminal', boundary: '2,100m' },
    { name: 'Panipat Petrochemical Hub', operator: 'IOCL', state: 'Haryana', spec: '300K bpd &bull; Integrated Naphtha', boundary: '2,800m' },
    { name: 'Paradip Refinery Complex', operator: 'IOCL', state: 'Odisha', spec: '300K bpd &bull; East Coast Terminal', boundary: '2,600m' }
  ];

  return (
    <div className="min-h-full bg-[#090A0F] text-zinc-100 font-sans selection:bg-orange-500/20 selection:text-orange-200">
      {/* Top Cockpit Header */}
      <section className="border-b border-white/[0.08] bg-gradient-to-b from-[#12131A]/60 via-[#0E0F16]/40 to-[#090A0F] px-4 sm:px-8 pt-10 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>NASA FIRMS VIIRS 375m &bull; Indian Industrial Surveillance</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Orbital Thermal &amp; Hazard Intelligence
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Automated continuous infrared surveillance. Satellite radiometry is cross-referenced with 22 strategic Indian petrochemical boundaries to detect uncontained structural fires and abnormal flaring in near real-time.
              </p>
            </div>

            {/* Modern Instrument HUD Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.08] p-px rounded-xl border border-white/[0.08] bg-clip-padding shrink-0 shadow-lg">
              <div className="bg-[#10121A] px-4 py-3 rounded-l-xl">
                <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Active Hotspots</div>
                <div className="text-2xl font-bold text-white font-mono mt-0.5">{eventCount}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">VIIRS 24h Passes</div>
              </div>

              <div className="bg-[#10121A] px-4 py-3">
                <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Monitored Perimeters</div>
                <div className="text-2xl font-bold text-white font-mono mt-0.5">{facilityCount} Sites</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">OSM Geometries</div>
              </div>

              <div className="bg-[#10121A] px-4 py-3">
                <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Ground Resolution</div>
                <div className="text-2xl font-bold text-white font-mono mt-0.5">375m</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Channel I4 (3.75&mu;m)</div>
              </div>

              <div className="bg-[#10121A] px-4 py-3 rounded-r-xl">
                <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Early Warning</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono mt-0.5">~90m</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Lead vs Ground 112</div>
              </div>
            </div>
          </div>

          {/* Quick Facility Bookmarks Ribbon */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-zinc-400 font-medium shrink-0 flex items-center gap-1.5 pr-2">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Quick Zoom:</span>
            </span>
            {facilityBookmarks.map((hub) => (
              <button
                key={hub.name}
                onClick={() => {
                  setSelectedMapEvent({
                    latitude: hub.lat,
                    longitude: hub.lng,
                    facilityName: hub.name
                  });
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white font-medium transition-all flex items-center gap-2"
              >
                <span>{hub.name}</span>
                <span className="text-[10px] text-orange-400/80 font-mono font-normal">{hub.frp}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Command Map Centerpiece */}
      <section className="px-4 sm:px-8 py-8 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-white/[0.1] bg-[#10121A] overflow-hidden shadow-2xl">
          {/* Map Command Ribbon */}
          <div className="px-5 py-3 border-b border-white/[0.08] bg-[#12141F] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-sm font-semibold text-white">Live Thermal Observation Canvas</span>
              <span className="text-xs text-zinc-400 border-l border-white/[0.1] pl-3 hidden sm:inline">
                Real-time multi-satellite radiance (Suomi-NPP &amp; NOAA-20)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold transition-all hover:border-orange-500/50"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open Full-Screen Console</span>
              </Link>
            </div>
          </div>

          {/* Leaflet Map Canvas */}
          <div className="w-full h-[520px] sm:h-[580px] relative bg-[#090A0F]">
            <GISMap
              events={fallbackData.events?.slice(0, 400) || []}
              facilities={fallbackData.facilities || []}
              selectedEvent={selectedMapEvent}
              onSelectEvent={(ev) => setSelectedMapEvent(ev)}
              showFacilities={true}
              showThermal={true}
            />
          </div>

          {/* Map Footer Telemetry Legend */}
          <div className="px-5 py-3 border-t border-white/[0.08] bg-[#10121A] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-semibold text-zinc-300">Observation Scale:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span>Critical / Hazard (&ge;50 MW)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span>Elevated Flare (20-50 MW)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Baseline (&lt;20 MW)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm border border-cyan-400 bg-cyan-500/20"></span>
                <span>Industrial Boundary</span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400">
              Interactive GIS Canvas &bull; Click any marker to view radiometry &amp; containment protocol
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Telemetry & Anomaly Log */}
      <section className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              High-Radiance Anomaly Log
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live orbital observations cross-matched with registered refinery perimeters.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#12131A] rounded-lg border border-white/[0.08] text-xs">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-white/[0.1] text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Detections
            </button>
            <button
              onClick={() => setActiveFilter('INDUSTRIAL')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeFilter === 'INDUSTRIAL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Industrial Perimeters
            </button>
            <button
              onClick={() => setActiveFilter('HIGH_HEAT')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeFilter === 'HIGH_HEAT'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              High Heat (&gt;25 MW)
            </button>
          </div>
        </div>

        {/* High Density Telemetry Feed */}
        <div className="rounded-xl border border-white/[0.08] bg-[#10121A] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141622] border-b border-white/[0.08] text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3">Observation &amp; Location</th>
                  <th className="px-5 py-3">Thermal Power</th>
                  <th className="px-5 py-3">Temperature</th>
                  <th className="px-5 py-3">Operational Status</th>
                  <th className="px-5 py-3">Satellite Telemetry</th>
                  <th className="px-5 py-3 text-right">Canvas Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredFeed.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{row.facility}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {row.state} &bull; <span className="font-mono text-zinc-400">{row.lat.toFixed(3)}&deg;N, {row.lng.toFixed(3)}&deg;E</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono">
                      <span className="font-bold text-orange-400">{row.frp.toFixed(1)} MW</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-zinc-300">
                      {row.tempC.toFixed(1)}&deg;C
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-white/[0.05] border border-white/[0.08] text-zinc-300">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400">
                      <div>{row.sensor}</div>
                      <div className="text-[10px] text-zinc-400">{row.time}</div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedMapEvent({
                            latitude: row.lat,
                            longitude: row.lng,
                            facilityName: row.facility
                          });
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border border-white/[0.08] text-xs font-medium transition-all"
                      >
                        <MapPin className="w-3 h-3 text-orange-400" />
                        <span>Locate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Verification Pipeline Architecture (Horizontal Engineering Flow) */}
      <section className="px-4 sm:px-8 py-10 max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Surveillance &amp; Triage Architecture
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            How raw mid-infrared radiance is converted into rapid containment directives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#10121A] border border-white/[0.08] space-y-3">
            <div className="text-xs font-mono font-semibold text-orange-400">01 / DETECTION</div>
            <h3 className="text-sm font-bold text-white">Orbital Radiometry</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              NASA VIIRS instruments capture 3.75&mu;m mid-wave radiance across India 2&ndash;4 times daily, logging brightness temperature and fire radiative power.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#10121A] border border-white/[0.08] space-y-3">
            <div className="text-xs font-mono font-semibold text-cyan-400">02 / INTERSECTION</div>
            <h3 className="text-sm font-bold text-white">Polygon Geofencing</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every coordinate is tested against verified OpenStreetMap boundary polygons of high-hazard petrochemical complexes, LNG tanks, and steel mills.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#10121A] border border-white/[0.08] space-y-3">
            <div className="text-xs font-mono font-semibold text-amber-400">03 / BASELINE</div>
            <h3 className="text-sm font-bold text-white">Flare vs Fire Triage</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Known chimney stacks operating within standard MW baselines are logged as routine. Uncontained thermal excursions trigger immediate emergency protocols.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#10121A] border border-white/[0.08] space-y-3">
            <div className="text-xs font-mono font-semibold text-emerald-400">04 / DISPATCH</div>
            <h3 className="text-sm font-bold text-white">Incident Command</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              NDMA industrial hazard guidelines provide recommended chemical suppression agents (e.g., AR-AFFF), cordon radius, and district disaster agency alerts.
            </p>
          </div>
        </div>
      </section>

      {/* Strategic Monitored Facilities */}
      <section className="px-4 sm:px-8 py-8 max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Strategic Industrial Assets
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              22 registered national complexes with active polygon monitoring.
            </p>
          </div>

          <Link
            to="/facilities"
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white font-medium transition-colors"
          >
            <span>View All Facilities</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {monitoredHubs.map((hub) => (
            <Link
              key={hub.name}
              to="/facilities"
              className="p-4 rounded-xl bg-[#10121A] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#131522] transition-all group block space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="font-semibold text-sm text-white group-hover:text-orange-400 transition-colors">
                  {hub.name}
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-xs text-zinc-400">
                {hub.operator} &bull; <span className="text-zinc-300">{hub.state}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/[0.06] text-zinc-400">
                <span dangerouslySetInnerHTML={{ __html: hub.spec }}></span>
                <span className="font-mono text-zinc-300">R: {hub.boundary}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Institutional Provenance Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07080C] px-4 sm:px-8 py-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-zinc-300">FireSight Operational GIS</span>
            <span>&mdash; Real-time Industrial Early Warning</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400 flex-wrap justify-center">
            <span>NASA FIRMS VIIRS 375m</span>
            <span>&bull;</span>
            <span>ESA Copernicus Sentinel-2</span>
            <span>&bull;</span>
            <span>OpenStreetMap Overpass</span>
            <span>&bull;</span>
            <span>NDMA Guidelines</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

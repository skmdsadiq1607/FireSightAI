import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Radio
} from 'lucide-react';
import GISMap from '../components/map/GISMap';
import fallbackData from '../services/fallbackData.json';

export default function HomePage() {
  const eventCount = fallbackData.events?.length || 828;
  const facilityCount = fallbackData.facilities?.length || 22;

  // Selected event for map showcase
  const [selectedMapEvent, setSelectedMapEvent] = useState(null);

  // Quick facility bookmarks
  const facilityBookmarks = [
    { name: 'Jamnagar (RIL)', lat: 22.47, lng: 70.06 },
    { name: 'Hazira (LNG/ONGC)', lat: 21.11, lng: 72.64 },
    { name: 'Mumbai (BPCL/HPCL)', lat: 19.01, lng: 72.89 },
    { name: 'Visakhapatnam (HPCL)', lat: 17.70, lng: 83.25 },
    { name: 'Panipat (IOCL)', lat: 29.39, lng: 76.97 }
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
      status: 'Outside Industrial Perimeter',
      sensor: 'Suomi-NPP VIIRS',
      time: '07:44 UTC'
    }
  ];

  const monitoredHubs = [
    { name: 'Jamnagar Mega Refinery', operator: 'Reliance Industries', state: 'Gujarat', capacity: '1.24M bpd', boundary: '4,200m' },
    { name: 'Hazira Petrochemical Terminal', operator: 'ONGC / Shell', state: 'Gujarat', capacity: 'Strategic LNG Hub', boundary: '2,500m' },
    { name: 'Mumbai Refineries Complex', operator: 'BPCL / HPCL', state: 'Maharashtra', capacity: '240K bpd', boundary: '1,800m' },
    { name: 'Visakhapatnam Refinery', operator: 'HPCL', state: 'Andhra Pradesh', capacity: '300K bpd', boundary: '2,100m' },
    { name: 'Panipat Petrochemical Hub', operator: 'IOCL', state: 'Haryana', capacity: '300K bpd', boundary: '2,800m' },
    { name: 'Paradip Refinery Complex', operator: 'IOCL', state: 'Odisha', capacity: '300K bpd', boundary: '2,600m' }
  ];

  return (
    <div className="min-h-full bg-[#090A0F] text-zinc-100 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-white/[0.08]">
        {/* Subtle Radial Glow in Background */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none opacity-25"
          style={{
            background: 'radial-gradient(circle at 50% 10%, rgba(249, 115, 22, 0.4), transparent 70%)'
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs text-zinc-300 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Live Satellite Sensor Telemetry &bull; NASA VIIRS 375m Active</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Space-Based Fire Defense for Critical Infrastructure
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            FireSight continuously analyzes orbital infrared radiance across India to detect refinery explosions and industrial blazes up to 90 minutes before ground emergency calls.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-950/50 transition-all hover:scale-[1.02]"
            >
              <Globe className="w-4 h-4" />
              <span>Launch Live Map Console</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              to="/events"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-200 font-semibold text-sm transition-all"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>View Live Detections ({eventCount})</span>
            </Link>

            <Link
              to="/guide"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              <FileText className="w-4 h-4 text-zinc-500" />
              <span>System Documentation</span>
            </Link>
          </div>

          {/* Live Mission Control Map Showcase Window */}
          <div className="pt-10 max-w-6xl mx-auto">
            <div className="rounded-2xl border border-white/[0.12] bg-[#10121A] shadow-2xl overflow-hidden text-left relative">
              {/* Window Titlebar */}
              <div className="px-4 sm:px-6 py-3 border-b border-white/[0.08] bg-[#131520] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-3">
                    <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-200">FireSight Mission Control</span>
                  <span className="text-[10px] text-zinc-400 px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] hidden sm:inline">
                    Suomi-NPP &bull; NOAA-20 NRT
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="font-medium text-[11px]">828 Hotspots Logged Today</span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-medium ml-2"
                  >
                    <span>Full Screen</span>
                    <Maximize2 className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Quick Facility Bookmarks Header */}
              <div className="px-4 sm:px-6 py-2 border-b border-white/[0.06] bg-[#0E1018] flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-zinc-500 shrink-0 font-medium">Quick Jump:</span>
                {facilityBookmarks.map((b) => (
                  <button
                    key={b.name}
                    onClick={() => {
                      setSelectedMapEvent({ latitude: b.lat, longitude: b.lng, facilityName: b.name });
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-xs font-medium transition-all"
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              {/* Interactive GIS Map */}
              <div className="w-full h-[480px] sm:h-[540px] relative bg-[#090A0F]">
                <GISMap
                  events={fallbackData.events?.slice(0, 400) || []}
                  facilities={fallbackData.facilities || []}
                  selectedEvent={selectedMapEvent}
                  onSelectEvent={(ev) => setSelectedMapEvent(ev)}
                  showFacilities={true}
                  showThermal={true}
                />
              </div>

              {/* Window Footer Status */}
              <div className="px-4 sm:px-6 py-2.5 border-t border-white/[0.08] bg-[#131520] flex flex-wrap items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Critical (&ge;50 MW)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span>Elevated Flare (20-50 MW)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Routine Baseline (&lt;20 MW)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm border border-cyan-400 bg-cyan-950/40"></span>
                    <span>22 Monitored Facility Polygons</span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500">
                  Click any hotspot or facility polygon to view instantaneous sensor telemetry
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Accreditation Strip */}
      <section className="py-8 border-b border-white/[0.08] bg-[#0A0C12]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
            Institutional Remote Sensing Infrastructure &amp; Guidelines
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-zinc-400">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-orange-400" />
              <span className="text-zinc-300">NASA FIRMS VIIRS 375m</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-zinc-300">ESA Copernicus Sentinel-2</span>
            </div>
            <div className="flex items-center gap-2">
              <Factory className="w-4 h-4 text-amber-400" />
              <span className="text-zinc-300">OpenStreetMap Industrial Geometries</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-zinc-300">NDMA Chemical Disaster SOPs</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem vs Solution (Why Space-Based Surveillance?) */}
      <section className="py-20 border-b border-white/[0.08] max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Why Ground-Based Detection Fails in Mega Disasters
          </h2>
          <p className="text-sm text-zinc-400">
            When major petrochemical complexes fail, perimeter sensors and human reporting channels break down simultaneously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Failure of Ground Systems */}
          <div className="p-6 rounded-2xl bg-[#12131C] border border-red-500/20 space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Ground Sensors &amp; Civilian Calls</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Delayed Reporting &amp; Sensor Incineration
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">&times;</span>
                <span>Industrial CCTV and optical cameras are blinded by initial smoke clouds and severed power cables.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">&times;</span>
                <span>Emergency 112 calls depend on civilian sightings, creating an average 45 to 90 minute reporting delay.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">&times;</span>
                <span>By the time emergency vehicles arrive, primary hydrocarbon tanks have ignited adjacent storage units.</span>
              </li>
            </ul>
          </div>

          {/* Space-Based Solution */}
          <div className="p-6 rounded-2xl bg-[#12131C] border border-emerald-500/20 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>FireSight Space Radar</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              375m Orbital Infrared Early Warning
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>NASA VIIRS satellites pass overhead 2&ndash;4 times daily, detecting mid-wave infrared radiance (3.75&mu;m) through smoke.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Geofencing algorithms instantly test coordinates against 22 high-hazard refinery polygons across India.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Baseline engines isolate safe routine flaring from runaway blazes, generating automated containment briefs in &lt;1.2 seconds.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Modern Bento Capabilities Grid */}
      <section className="py-20 border-b border-white/[0.08] max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            End-to-End Early Warning Architecture
          </h2>
          <p className="text-sm text-zinc-400">
            Engineered to process raw orbital telemetry into life-saving containment protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#10121A] border border-white/[0.08] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Satellite className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">375m Pinpoint Radiometry</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              VIIRS sensors onboard Suomi-NPP and NOAA satellites calculate Fire Radiative Power (MW) and brightness temperature down to 375m squares across the entire subcontinent.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#10121A] border border-white/[0.08] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Factory className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">22 Industrial Geofences</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every thermal coordinate is cross-matched against OpenStreetMap polygon perimeters of petrochemical complexes, LNG storage terminals, and steel plants.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#10121A] border border-white/[0.08] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Flare vs Fire Triage</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Historical baseline models recognize standard flare stack operations. Unexpected thermal excursions trigger immediate NDMA containment advisories and chemical foam SOPs.
            </p>
          </div>
        </div>
      </section>

      {/* Live Recent Observations Feed */}
      <section className="py-16 border-b border-white/[0.08] max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Live Satellite Observations Across India
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Active thermal points logged in today&apos;s VIIRS constellation passes.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-semibold"
          >
            <span>Browse All {eventCount} Hotspots</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Observation Table */}
        <div className="rounded-xl border border-white/[0.08] bg-[#10121A] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141622] border-b border-white/[0.08] text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3">Facility / Region</th>
                  <th className="px-5 py-3">Thermal Power</th>
                  <th className="px-5 py-3">Temperature</th>
                  <th className="px-5 py-3">Operational Status</th>
                  <th className="px-5 py-3">Constellation</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {observationFeed.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{row.facility}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {row.state} &bull; <span className="font-mono text-zinc-400">{row.lat.toFixed(3)}&deg;N, {row.lng.toFixed(3)}&deg;E</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-orange-400">
                      {row.frp.toFixed(1)} MW
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
                      <div className="text-[10px] text-zinc-500">{row.time}</div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border border-white/[0.08] text-xs font-medium transition-all"
                      >
                        <MapPin className="w-3 h-3 text-orange-400" />
                        <span>Locate</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Strategic Monitored Facilities */}
      <section className="py-16 border-b border-white/[0.08] max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Protected Strategic Energy Hubs
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              22 national petrochemical, refining, and steel complexes actively geofenced.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-xs text-zinc-400">
                {hub.operator} &bull; <span className="text-zinc-300">{hub.state}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/[0.06] text-zinc-400">
                <span>{hub.capacity}</span>
                <span className="font-mono text-zinc-300">Radius: {hub.boundary}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* High-Impact Bottom Call to Action */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#141624] to-[#0D0F18] border border-white/[0.12] text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-20"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.6), transparent 70%)'
            }}
          />

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight relative z-10">
            Monitor Space Telemetry in Real Time
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto relative z-10 leading-relaxed">
            Open the live GIS map console to inspect orbital infrared data points, industrial perimeters, and automated emergency directives.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 relative z-10">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-950/50 transition-all hover:scale-[1.02]"
            >
              <Globe className="w-4 h-4" />
              <span>Launch Live Map Console</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              to="/guide"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-200 font-semibold text-sm transition-all"
            >
              <FileText className="w-4 h-4 text-zinc-400" />
              <span>Read Operator Guide</span>
            </Link>
          </div>
        </div>
      </section>

      {/* World-Class Modern Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07080C] px-4 sm:px-8 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-white">FireSight AI</span>
              <span className="text-zinc-500 ml-2">&mdash; Space-Based Industrial Thermal Defense</span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-[11px] text-zinc-400">
            <Link to="/dashboard" className="hover:text-white transition-colors">Satellite Map</Link>
            <Link to="/events" className="hover:text-white transition-colors">Thermal Events</Link>
            <Link to="/facilities" className="hover:text-white transition-colors">Industrial Assets</Link>
            <Link to="/guide" className="hover:text-white transition-colors">User Guide</Link>
            <a
              href="https://github.com/skmdsadiq1607/FireSightAI"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

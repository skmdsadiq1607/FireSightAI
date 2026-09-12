import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import RiskBadge from '../common/RiskBadge';
import ClassificationBadge from '../common/ClassificationBadge';
import {
  Flame,
  Globe,
  Layers,
  Activity,
  ExternalLink,
  MapPin,
  Compass,
  Zap,
  Eye,
  Info
} from 'lucide-react';

// Authentic NASA FIRMS marker generator
const createCustomIcon = (frp = 10, riskLevel = 'LOW', classification = '', isSelected = false, markerStyle = 'flame') => {
  // NASA FIRMS intensity color scale
  let color = '#EAB308'; // < 5 MW (Yellow)
  let innerColor = '#FEF08A';
  if (frp >= 50 || riskLevel === 'CRITICAL' || classification === 'INDUSTRIAL FIRE') {
    color = '#DC2626'; // Vivid Crimson Red
    innerColor = '#FDE047';
  } else if (frp >= 20 || riskLevel === 'HIGH' || classification === 'PERSISTENT THERMAL SOURCE') {
    color = '#EA580C'; // Bright Flame Orange
    innerColor = '#FED7AA';
  } else if (frp >= 5) {
    color = '#F59E0B'; // Amber
    innerColor = '#FEF08A';
  }

  if (markerStyle === 'pixel') {
    const size = isSelected ? 13 : 8;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 10 10">
        <rect x="1" y="1" width="8" height="8" fill="${color}" fill-opacity="0.85" stroke="${isSelected ? '#FFFFFF' : 'rgba(0,0,0,0.5)'}" stroke-width="${isSelected ? '1.5' : '0.8'}"/>
      </svg>
    `;
    return L.divIcon({
      html: svg,
      className: 'firms-marker-pixel',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    });
  }

  // Authentic NASA FIRMS dual-layer flame silhouette
  const size = isSelected ? 24 : 14;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.65));">
      <path d="M12 2C10.5 4.5 8 7 8 10.5c0 2.5 1.5 4.5 2 5.5-1-.5-2-1.5-2.5-3-.5 1.5-.5 3.5.5 5 1.2 1.8 3.3 2.5 5 2.5 3 0 5-2.5 5-5.5 0-3.5-3-6-3.5-8.5C14 7.5 13.5 5 12 2z" fill="${color}" stroke="${isSelected ? '#FFFFFF' : 'rgba(0,0,0,0.35)'}" stroke-width="${isSelected ? '1.8' : '0.6'}"/>
      <path d="M12 11c-.5 1-1.5 2-1.5 3.2 0 1.2.8 2.3 1.8 2.6.4-.6.7-1.3.7-2 0-1-.5-2.5-1-3.8z" fill="${innerColor}"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'firms-marker-flame',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

// Map controller for programmatic fly-to
function MapController({ targetView, selectedEvent }) {
  const map = useMap();

  useEffect(() => {
    if (selectedEvent && selectedEvent.latitude && selectedEvent.longitude) {
      map.flyTo([selectedEvent.latitude, selectedEvent.longitude], 12, { duration: 1.0 });
    }
  }, [selectedEvent, map]);

  useEffect(() => {
    if (targetView) {
      map.flyTo(targetView.center, targetView.zoom, { duration: 1.2 });
    }
  }, [targetView, map]);

  return null;
}

export default function GISMap({
  events = [],
  facilities = [],
  selectedEvent = null,
  onSelectEvent,
  showFacilities = true,
  showThermal = true
}) {
  const [baseMap, setBaseMap] = useState('dark');
  const [markerStyle, setMarkerStyle] = useState('flame'); // 'flame' or 'pixel'
  const [targetView, setTargetView] = useState(null);
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL', 'HIGH_FRP', 'INDUSTRIAL'

  const tileLayers = {
    dark: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; NASA FIRMS & USGS'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri World Imagery &mdash; Source: Esri, Maxar, Earthstar'
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    }
  };

  const regions = [
    { name: 'India', center: [21.5, 78.9], zoom: 5 },
    { name: 'Global', center: [20, 0], zoom: 2 },
    { name: 'Americas', center: [28, -95], zoom: 4 },
    { name: 'Europe', center: [43, 15], zoom: 4 },
    { name: 'SE Asia', center: [5, 108], zoom: 4 },
    { name: 'Australia', center: [-25, 134], zoom: 4 }
  ];

  // Filter events based on active quick filter
  const displayedEvents = events.filter((ev) => {
    if (filterMode === 'HIGH_FRP') return ev.frp >= 20;
    if (filterMode === 'INDUSTRIAL') return ev.insideIndustrialBoundary || (ev.facilityDistance && ev.facilityDistance < 15000);
    return true;
  });

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0A0D14]">
      {/* Top Floating GIS Toolbar */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2 max-w-[calc(100%-1.5rem)]">
        {/* World Region Selector */}
        <div className="bg-[#0A0E1A]/95 border border-slate-800 rounded-lg p-1 flex items-center gap-1 shadow-lg backdrop-blur-md text-xs font-sans">
          <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1 font-medium">
            <Globe className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Region:</span>
          </span>
          {regions.map((reg) => (
            <button
              key={reg.name}
              onClick={() => setTargetView({ center: reg.center, zoom: reg.zoom })}
              className="px-2 py-1 rounded text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {reg.name}
            </button>
          ))}
        </div>

        {/* Quick Filter Mode */}
        <div className="bg-[#0A0E1A]/95 border border-slate-800 rounded-lg p-1 flex items-center gap-1 shadow-lg backdrop-blur-md text-xs font-sans">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-2 py-1 rounded text-[11px] transition-colors ${
              filterMode === 'ALL'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Hotspots ({events.length})
          </button>
          <button
            onClick={() => setFilterMode('HIGH_FRP')}
            className={`px-2 py-1 rounded text-[11px] transition-colors ${
              filterMode === 'HIGH_FRP'
                ? 'bg-orange-600/30 text-orange-300 border border-orange-500/40 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Radiative Power (&gt;20 MW)
          </button>
          <button
            onClick={() => setFilterMode('INDUSTRIAL')}
            className={`px-2 py-1 rounded text-[11px] transition-colors ${
              filterMode === 'INDUSTRIAL'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Industrial Proximity
          </button>
        </div>
      </div>

      {/* Top Right Floating Layer & Basemap Controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        {/* Marker Symbol Toggle (Flame vs Pixel Footprint) */}
        <div className="bg-[#0A0E1A]/95 border border-slate-800 rounded-lg p-1 flex items-center gap-1 shadow-lg backdrop-blur-md text-xs font-sans">
          <button
            onClick={() => setMarkerStyle('flame')}
            className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 transition-colors ${
              markerStyle === 'flame'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Render crisp NASA FIRMS flame markers"
          >
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="hidden sm:inline">Flames</span>
          </button>
          <button
            onClick={() => setMarkerStyle('pixel')}
            className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 transition-colors ${
              markerStyle === 'pixel'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Render classic 375m sensor pixel grid"
          >
            <span className="w-2.5 h-2.5 border border-current"></span>
            <span className="hidden sm:inline">Pixels</span>
          </button>
        </div>

        {/* Basemap Switcher */}
        <div className="bg-[#0A0E1A]/95 border border-slate-800 rounded-lg p-1 flex items-center gap-1 shadow-lg backdrop-blur-md text-xs font-sans">
          <button
            onClick={() => setBaseMap('dark')}
            className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
              baseMap === 'dark' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setBaseMap('satellite')}
            className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
              baseMap === 'satellite' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Satellite TrueColor
          </button>
        </div>
      </div>

      <MapContainer
        center={[21.5, 78.9]}
        zoom={5}
        minZoom={2}
        maxZoom={18}
        worldCopyJump={true}
        className="w-full h-full z-10"
        scrollWheelZoom={true}
      >
        <TileLayer
          key={baseMap}
          attribution={tileLayers[baseMap].attribution}
          url={tileLayers[baseMap].url}
        />

        <MapController targetView={targetView} selectedEvent={selectedEvent} />

        {/* Industrial Facilities Perimeters & Polygons */}
        {showFacilities && facilities.map((facility) => {
          const isPolygon = facility.geometry?.type === 'Polygon' && Array.isArray(facility.geometry.coordinates);
          const centroid = facility.centroid?.coordinates || (isPolygon ? facility.geometry.coordinates[0][0] : facility.geometry?.coordinates);
          if (!centroid) return null;

          return (
            <React.Fragment key={facility._id || facility.osmId}>
              {isPolygon ? (
                <Polygon
                  positions={facility.geometry.coordinates[0].map(([lon, lat]) => [lat, lon])}
                  pathOptions={{
                    color: '#06B6D4',
                    weight: 1.5,
                    dashArray: '3, 4',
                    fillColor: '#06B6D4',
                    fillOpacity: 0.12
                  }}
                >
                  <Popup>
                    <div className="text-xs p-1 space-y-1 font-sans">
                      <div className="font-bold text-cyan-300">{facility.name}</div>
                      <div className="text-slate-400 capitalize">{facility.facilityType?.replace(/_/g, ' ')}</div>
                      <div className="text-[11px] text-slate-400">
                        Criticality: <strong className="text-amber-400">{facility.criticalityLevel}</strong>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              ) : (
                <Circle
                  center={[centroid[1], centroid[0]]}
                  radius={facility.boundaryRadiusMeters || 2000}
                  pathOptions={{
                    color: '#06B6D4',
                    weight: 1,
                    dashArray: '3, 4',
                    fillColor: '#06B6D4',
                    fillOpacity: 0.08
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Thermal Anomaly Event Markers */}
        {showThermal && displayedEvents.map((event) => {
          const lat = event.latitude;
          const lon = event.longitude;
          if (!lat || !lon) return null;

          const isSelected = selectedEvent && selectedEvent.eventId === event.eventId;

          return (
            <Marker
              key={event.eventId}
              position={[lat, lon]}
              icon={createCustomIcon(event.frp, event.riskLevel, event.classification, isSelected, markerStyle)}
              eventHandlers={{
                click: () => onSelectEvent && onSelectEvent(event)
              }}
            >
              <Popup>
                <div className="p-1 space-y-2 max-w-[260px] text-xs font-sans">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                    <span className="font-bold text-white font-mono">{event.eventId}</span>
                    <RiskBadge level={event.riskLevel} score={event.riskScore} size="sm" />
                  </div>

                  <div className="space-y-1 text-slate-300">
                    <div className="flex items-center justify-between font-mono">
                      <span>Thermal Flux (FRP):</span>
                      <strong className="text-orange-400">{event.frp.toFixed(1)} MW</strong>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span>Brightness Temp:</span>
                      <span>{event.brightnessTemperature.toFixed(1)} K</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span>Sensor:</span>
                      <span className="text-cyan-300">{event.satellite} VIIRS</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span>Acquisition:</span>
                      <span>{event.acquisitionDate} {event.acquisitionTime} UTC</span>
                    </div>

                    {event.facilityName && (
                      <div className="pt-1 text-[11px]">
                        <span className="text-slate-400">Nearest Asset: </span>
                        <strong className="text-amber-400">{event.facilityName}</strong>
                        <div className="text-[10px] text-red-400 font-medium">
                          {event.insideIndustrialBoundary ? 'Direct Perimeter Contact' : `${event.facilityDistance}m from fence`}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-1.5 flex items-center justify-between border-t border-slate-800">
                    <ClassificationBadge classification={event.classification} size="sm" />
                    <button
                      onClick={() => onSelectEvent && onSelectEvent(event)}
                      className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1"
                    >
                      Dossier &rarr;
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Clean Minimal NASA FIRMS Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#0A0E1A]/95 border border-slate-800 p-2.5 rounded-lg shadow-xl text-xs font-sans backdrop-blur-md">
        <div className="font-semibold text-slate-300 text-[11px] mb-2 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>FIRMS Fire Radiative Power (MW)</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-300 font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.5)]"></span>
            <span>&gt; 50 MW (Extreme)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span>20–50 MW (High)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>5–20 MW (Moderate)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span>&lt; 5 MW (Nominal)</span>
          </div>
          <div className="col-span-2 pt-1 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-400">
            <span className="w-3 h-2.5 border border-cyan-400 border-dashed rounded-sm"></span>
            <span>Industrial Facility Boundary (OSM)</span>
          </div>
        </div>
      </div>

      {/* Floating Status Bar (Bottom-Right) */}
      <div className="absolute bottom-4 right-4 z-20 bg-[#0A0E1A]/95 border border-slate-800 px-3 py-1.5 rounded-lg shadow-xl text-[11px] text-slate-400 font-sans backdrop-blur-md flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-white font-medium">{displayedEvents.length} Active Hotspots</span>
        </div>
        <span className="text-slate-600">|</span>
        <span>NASA Suomi-NPP VIIRS 375m</span>
      </div>
    </div>
  );
}

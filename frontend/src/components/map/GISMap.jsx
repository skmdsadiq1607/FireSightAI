import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import RiskBadge from '../common/RiskBadge';
import ClassificationBadge from '../common/ClassificationBadge';
import DataProvenanceTag from '../common/DataProvenanceTag';
import { Flame, ExternalLink, Activity, Radio, AlertTriangle } from 'lucide-react';

// Custom SVG map marker generator
const createCustomIcon = (riskLevel, classification, isSelected = false) => {
  // NASA FIRMS official palette: Bright flame orange, amber yellow, and crimson red
  let color = '#F59E0B'; // Amber default (nominal)
  if (riskLevel === 'CRITICAL' || classification === 'INDUSTRIAL FIRE') color = '#DC2626'; // Red
  else if (riskLevel === 'HIGH' || classification === 'PERSISTENT THERMAL SOURCE') color = '#EA580C'; // Bright flame orange
  else if (classification === 'UNCERTAIN ANOMALY') color = '#D97706'; // Warm amber

  const size = isSelected ? 16 : 9;
  const border = isSelected ? '2px solid #FFFFFF' : '1.5px solid #111827';
  const glow = isSelected ? '0 0 10px #F97316' : '0 0 4px rgba(0,0,0,0.6)';

  const svgHtml = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      border: ${border};
      box-shadow: ${glow};
      cursor: pointer;
      transition: transform 0.15s ease;
    "></div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'nasa-firms-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

// Sub-component to handle programmatically flying to selected event coordinates
function MapController({ selectedEvent }) {
  const map = useMap();

  useEffect(() => {
    if (selectedEvent && selectedEvent.latitude && selectedEvent.longitude) {
      map.flyTo([selectedEvent.latitude, selectedEvent.longitude], 11, {
        duration: 1.2
      });
    }
  }, [selectedEvent, map]);

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
  const indiaCenter = [21.5, 78.9]; // Geographic center of India
  const [baseMap, setBaseMap] = React.useState('dark'); // 'dark' or 'satellite'

  const tileLayers = {
    dark: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ | NASA FIRMS'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }
  };

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-slate-800">
      {/* Basemap Switcher Control */}
      <div className="absolute top-3 right-3 z-20 bg-[#0F1626]/90 border border-slate-700/80 rounded-lg p-1 flex items-center gap-1 shadow-xl font-mono text-[11px] backdrop-blur-md">
        <button
          onClick={() => setBaseMap('dark')}
          className={`px-2.5 py-1 rounded transition-all ${
            baseMap === 'dark'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Tactical Dark
        </button>
        <button
          onClick={() => setBaseMap('satellite')}
          className={`px-2.5 py-1 rounded transition-all ${
            baseMap === 'satellite'
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Satellite TrueColor
        </button>
      </div>

      <MapContainer
        center={indiaCenter}
        zoom={5}
        minZoom={4}
        maxZoom={18}
        className="w-full h-full z-10"
        scrollWheelZoom={true}
      >
        {/* Clean Watermark-Free TileLayer */}
        <TileLayer
          key={baseMap}
          attribution={tileLayers[baseMap].attribution}
          url={tileLayers[baseMap].url}
        />

        <MapController selectedEvent={selectedEvent} />

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
                    dashArray: '4, 4',
                    fillColor: '#06B6D4',
                    fillOpacity: 0.12
                  }}
                >
                  <Popup>
                    <div className="text-xs p-1 space-y-1">
                      <div className="font-bold text-cyan-300 font-mono">{facility.name}</div>
                      <div className="text-slate-400 capitalize">{facility.facilityType.replace(/_/g, ' ')}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Criticality: <span className="text-amber-400 font-semibold">{facility.criticalityLevel}</span>
                      </div>
                      <DataProvenanceTag source={facility.provenance || 'OSM Overpass'} />
                    </div>
                  </Popup>
                </Polygon>
              ) : (
                <Circle
                  center={[centroid[1], centroid[0]]}
                  radius={facility.boundaryRadiusMeters || 1500}
                  pathOptions={{
                    color: '#06B6D4',
                    weight: 1,
                    dashArray: '3, 3',
                    fillColor: '#06B6D4',
                    fillOpacity: 0.08
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Thermal Anomaly Event Markers */}
        {showThermal && events.map((event) => {
          const lat = event.latitude;
          const lon = event.longitude;
          if (!lat || !lon) return null;

          const isSelected = selectedEvent && selectedEvent.eventId === event.eventId;

          return (
            <Marker
              key={event.eventId}
              position={[lat, lon]}
              icon={createCustomIcon(event.riskLevel, event.classification, isSelected)}
              eventHandlers={{
                click: () => onSelectEvent && onSelectEvent(event)
              }}
            >
              <Popup>
                <div className="p-1 space-y-2 max-w-[260px] text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                    <span className="font-bold text-white tracking-wider">{event.eventId}</span>
                    <RiskBadge level={event.riskLevel} score={event.riskScore} size="sm" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-slate-300 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-orange-400" />
                      <span>FRP: <strong>{event.frp.toFixed(1)} MW</strong> ({event.brightnessTemperature.toFixed(1)} K)</span>
                    </div>

                    <div className="text-slate-300">
                      Satellite: <span className="text-cyan-400 font-bold">{event.satellite}</span> ({event.instrument})
                    </div>

                    {event.facilityName && (
                      <div className="text-slate-300 truncate">
                        Asset: <span className="text-amber-400 font-medium">{event.facilityName}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-slate-800">
                    <ClassificationBadge classification={event.classification} size="sm" />
                    <button
                      onClick={() => onSelectEvent && onSelectEvent(event)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline font-medium"
                    >
                      Investigate &rarr;
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Clean Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#0F1626]/90 border border-slate-700/70 p-2.5 rounded-lg shadow-lg text-[11px] font-sans select-none backdrop-blur-sm">
        <div className="font-semibold text-slate-300 text-[11px] mb-1.5 flex items-center gap-1.5">
          <span>Map Legend</span>
        </div>
        <div className="flex flex-col gap-1 text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>NASA Thermal Hotspot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 border border-cyan-400 border-dashed rounded-sm" />
            <span>Industrial Facility Boundary</span>
          </div>
        </div>
      </div>
    </div>
  );
}

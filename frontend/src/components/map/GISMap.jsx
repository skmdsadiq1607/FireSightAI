import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import RiskBadge from '../common/RiskBadge';
import ClassificationBadge from '../common/ClassificationBadge';
import DataProvenanceTag from '../common/DataProvenanceTag';
import { Flame, ExternalLink, Activity, Radio, AlertTriangle } from 'lucide-react';

// Custom SVG map marker generator
const createCustomIcon = (riskLevel, classification) => {
  let color = '#10B981'; // LOW
  if (riskLevel === 'CRITICAL' || classification === 'INDUSTRIAL FIRE') color = '#EF4444';
  else if (riskLevel === 'HIGH' || classification === 'PERSISTENT THERMAL SOURCE') color = '#F97316';
  else if (riskLevel === 'MEDIUM' || classification === 'AGRICULTURAL BURNING') color = '#F59E0B';
  else if (classification === 'UNCERTAIN ANOMALY') color = '#6B7280';

  const isCritical = riskLevel === 'CRITICAL';

  const svgHtml = `
    <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
      ${isCritical ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(239, 68, 68, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
      <div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid #0F1626;
        box-shadow: 0 0 12px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-thermal-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
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

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-slate-800">
      <MapContainer
        center={indiaCenter}
        zoom={5}
        minZoom={4}
        maxZoom={18}
        className="w-full h-full z-10"
        scrollWheelZoom={true}
      >
        {/* CartoDB Dark Matter High-Contrast Basemap */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> | NASA FIRMS | OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
              icon={createCustomIcon(event.riskLevel, event.classification)}
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

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 glass-panel p-3 rounded-xl space-y-2 text-xs font-mono select-none">
        <div className="font-bold text-slate-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>Thermal Classifications</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <span>Industrial Fire</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
            <span>Persistent Source</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_#f59e0b]" />
            <span>Agricultural Burn</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span>Natural Wildfire</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
            <span>Routine Heat</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 border border-cyan-400 border-dashed" />
            <span>OSM Perimeter</span>
          </div>
        </div>
      </div>
    </div>
  );
}

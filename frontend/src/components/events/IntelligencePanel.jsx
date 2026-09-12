import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Flame,
  ShieldAlert,
  Activity,
  Calendar,
  Satellite,
  Factory,
  RefreshCw,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Zap,
  FileText
} from 'lucide-react';
import RiskBadge from '../common/RiskBadge';
import ClassificationBadge from '../common/ClassificationBadge';
import DataProvenanceTag from '../common/DataProvenanceTag';
import { eventService } from '../../services/api';

export default function IntelligencePanel({ event, onClose, onUpdateEvent }) {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetchingSat, setIsFetchingSat] = useState(false);
  const [isGeneratingDirective, setIsGeneratingDirective] = useState(false);
  const [directiveData, setDirectiveData] = useState(null);

  if (!event) return null;

  const handleGenerateDirective = async () => {
    setIsGeneratingDirective(true);
    try {
      const res = await eventService.getIncidentDirective(event.eventId);
      setDirectiveData(res.data?.data || null);
    } catch (err) {
      console.error('Directive generation failed:', err);
    } finally {
      setIsGeneratingDirective(false);
    }
  };

  const handleReanalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await eventService.analyzeEvent(event.eventId);
      if (res.data?.data && onUpdateEvent) {
        onUpdateEvent(res.data.data);
      }
    } catch (err) {
      console.error('Reanalysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFetchSatellite = async () => {
    setIsFetchingSat(true);
    try {
      const res = await eventService.getSatelliteContext(event.eventId);
      if (res.data?.data && onUpdateEvent) {
        onUpdateEvent({
          ...event,
          satelliteVerification: res.data.data
        });
      }
    } catch (err) {
      console.error('Satellite query failed:', err);
    } finally {
      setIsFetchingSat(false);
    }
  };

  const risk = event.riskScore || 10;

  return (
    <div className="w-full sm:w-96 bg-[#0B0F1A]/95 border-l border-slate-800 flex flex-col h-full overflow-y-auto backdrop-blur-xl z-20 select-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between sticky top-0 bg-[#0B0F1A]/90 backdrop-blur-md z-10">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Thermal Intelligence Dossier</span>
          </div>
          <h2 className="text-base font-bold text-white font-mono mt-0.5">{event.eventId}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Badges Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <ClassificationBadge classification={event.classification} size="md" />
          <RiskBadge level={event.riskLevel} score={event.riskScore} size="md" />
        </div>

        {/* Risk Breakdown Meter */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Risk Assessment Score</span>
            <span className="font-bold text-white text-sm">{risk}/100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                risk >= 81 ? 'bg-red-500' :
                risk >= 61 ? 'bg-orange-500' :
                risk >= 31 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${risk}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
            <span>Thermal: {event.riskBreakdown?.thermalScore ?? '—'}</span>
            <span>Persistence: {event.riskBreakdown?.persistenceScore ?? '—'}</span>
            <span>Industry: {event.riskBreakdown?.industrialScore ?? '—'}</span>
          </div>
        </div>

        {/* Explainable AI Evidence ("WHY THIS EVENT?") */}
        <div className="p-3.5 rounded-xl border border-cyan-900/40 bg-cyan-950/15 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explainable AI Reasoning</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              {event.classificationConfidence}% Confidence
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {event.explanation?.summary || 'Multi-factor classification model evaluated thermal and geospatial layers.'}
          </p>

          <div className="space-y-1.5 pt-1 border-t border-cyan-900/30">
            {event.explanation?.evidence && event.explanation.evidence.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <DataProvenanceTag source="FireSight AI Hybrid Random Forest" />
          </div>
        </div>

        {/* Telemetry Core Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40">
            <div className="text-slate-400 text-[10px] uppercase">Fire Radiative Power</div>
            <div className="text-sm font-bold text-orange-400 mt-1 flex items-baseline gap-1">
              {event.frp?.toFixed(1)} <span className="text-xs text-slate-400 font-normal">MW</span>
            </div>
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40">
            <div className="text-slate-400 text-[10px] uppercase">Brightness Temp</div>
            <div className="text-sm font-bold text-amber-400 mt-1 flex items-baseline gap-1">
              {event.brightnessTemperature?.toFixed(1)} <span className="text-xs text-slate-400 font-normal">K</span>
            </div>
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40">
            <div className="text-slate-400 text-[10px] uppercase">Satellite & Sensor</div>
            <div className="text-xs font-semibold text-white mt-1">
              {event.satellite} / {event.instrument}
            </div>
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40">
            <div className="text-slate-400 text-[10px] uppercase">Persistence Days</div>
            <div className="text-xs font-semibold text-cyan-300 mt-1">
              {event.persistenceDays || 1} Days ({event.persistenceCount || 1} Passes)
            </div>
          </div>
        </div>

        {/* Industrial Infrastructure Context */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            <Factory className="w-3.5 h-3.5 text-amber-400" />
            <span>Industrial Context (OSM)</span>
          </div>

          {event.facilityName ? (
            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-white">{event.facilityName}</div>
              <div className="text-slate-400 capitalize text-[11px]">
                Type: <span className="text-slate-300">{event.facilityType?.replace(/_/g, ' ')}</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Status: {event.insideIndustrialBoundary ? (
                  <span className="text-red-400 font-bold ml-1">Inside Industrial Boundary</span>
                ) : (
                  <span className="text-amber-400 font-medium ml-1">{event.facilityDistance ? `${event.facilityDistance}m Proximity` : 'Adjacent'}</span>
                )}
              </div>
              {event.baselineStatus !== 'NO_BASELINE' && (
                <div className="text-[11px] text-slate-300 font-mono">
                  Baseline Anomaly: <span className="font-bold text-orange-400">{event.baselineStatus} ({event.baselineFRPDelta > 0 ? '+' : ''}{event.baselineFRPDelta}%)</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              No industrial facilities within 15km buffer. Area classified as remote / forest or open agricultural parcel.
            </div>
          )}
          <div className="pt-1">
            <DataProvenanceTag source="OpenStreetMap Overpass" />
          </div>
        </div>

        {/* Copernicus Sentinel-2 Satellite Context */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
              <Satellite className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sentinel-2 Satellite Context</span>
            </div>
            <button
              onClick={handleFetchSatellite}
              disabled={isFetchingSat}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isFetchingSat ? 'animate-spin' : ''}`} />
              Verify
            </button>
          </div>

          {event.satelliteVerification ? (
            <div className="space-y-1 text-xs">
              <div className="text-slate-300 text-[11px] leading-relaxed">
                {event.satelliteVerification.message}
              </div>
              {event.satelliteVerification.cloudCoverPercentage != null && (
                <div className="text-[10px] font-mono text-slate-400">
                  Cloud Cover: <span className="text-slate-200">{event.satelliteVerification.cloudCoverPercentage}%</span> |
                  SWIR Anomaly: <span className={event.satelliteVerification.swirAnomalyDetected ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {event.satelliteVerification.swirAnomalyDetected ? 'CONFIRMED' : 'NEGATIVE'}
                  </span>
                </div>
              )}
              {event.satelliteVerification.thumbnailUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-700 max-h-32">
                  <img
                    src={event.satelliteVerification.thumbnailUrl}
                    alt="Sentinel-2 Satellite Scene Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              Satellite verification pending. Click verify to query Copernicus Data Space Sentinel-2 L2A archive.
            </div>
          )}
          <div className="pt-1">
            <DataProvenanceTag source="Copernicus Sentinel-2 L2A" />
          </div>
        </div>

        {/* AI Tactical Incident Directive (Groq LPU Accelerated) */}
        <div className="p-3.5 rounded-xl border border-emerald-900/40 bg-emerald-950/15 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-mono uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tactical Incident Directive</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              Groq LPU
            </span>
          </div>

          {directiveData ? (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 text-[11px] leading-relaxed whitespace-pre-wrap font-sans max-h-56 overflow-y-auto">
                {directiveData.directive}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Model: {directiveData.model}</span>
                <span className="text-emerald-400 font-semibold">{directiveData.latencyMs}ms</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Generate immediate hazardous materials suppression protocols, evacuation cordon radius, and NDRF notification draft.
              </p>
              <button
                onClick={handleGenerateDirective}
                disabled={isGeneratingDirective}
                className="w-full py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${isGeneratingDirective ? 'animate-bounce text-amber-400' : 'text-emerald-400'}`} />
                <span>{isGeneratingDirective ? 'Generating Directive (<1s)...' : 'Generate Action Directive (Groq)'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-slate-800 bg-[#0B0F1A] space-y-2 sticky bottom-0 z-10">
        <button
          onClick={() => navigate(`/events/${event.eventId}`)}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all font-mono"
        >
          <span>View Full Event Investigation</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleReanalyze}
          disabled={isAnalyzing}
          className="w-full py-2 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>{isAnalyzing ? 'Processing Features...' : 'Re-run AI Intelligence Engine'}</span>
        </button>
      </div>
    </div>
  );
}

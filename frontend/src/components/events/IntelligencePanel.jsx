import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Flame,
  Activity,
  Calendar,
  Satellite,
  Factory,
  RefreshCw,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ExternalLink,
  Radio
} from 'lucide-react';
import RiskBadge from '../common/RiskBadge';
import ClassificationBadge from '../common/ClassificationBadge';
import EmergencyAlertModal from './EmergencyAlertModal';
import { eventService } from '../../services/api';

export default function IntelligencePanel({ event, onClose, onUpdateEvent }) {
  const navigate = useNavigate();
  const [isGeneratingDirective, setIsGeneratingDirective] = useState(false);
  const [directiveData, setDirectiveData] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  if (!event) return null;

  const handleGenerateDirective = async () => {
    setIsGeneratingDirective(true);
    try {
      const res = await eventService.getIncidentDirective(event.eventId, event);
      const data = res.data?.data || res.data;
      if (data) {
        setDirectiveData(typeof data === 'string' ? { directive: data, latencyMs: 650 } : data);
      }
    } catch (err) {
      console.error('Directive generation failed:', err);
    } finally {
      setIsGeneratingDirective(false);
    }
  };

  const risk = event.riskScore || 10;

  return (
    <div className="w-full h-full bg-[#0B0F1A]/95 border-l border-slate-800 flex flex-col overflow-y-auto backdrop-blur-xl select-none font-sans text-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0B0F1A]/95 backdrop-blur-md z-10">
        <div>
          <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span>Thermal Observation Dossier</span>
          </div>
          <h2 className="text-sm font-bold text-white font-mono mt-0.5">{event.eventId}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 text-xs">
        {/* Badges Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <ClassificationBadge classification={event.classification} size="md" />
          <RiskBadge level={event.riskLevel} score={event.riskScore} size="md" />
        </div>

        {/* Observation Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 font-sans">
          <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
            <div className="text-slate-400 text-[10px]">Thermal Radiative Power</div>
            <div className="text-sm font-bold text-orange-400 mt-0.5 font-mono">
              {event.frp?.toFixed(1)} MW
            </div>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
            <div className="text-slate-400 text-[10px]">Brightness Temperature</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5 font-mono">
              {event.brightnessTemperature?.toFixed(1)} K
            </div>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
            <div className="text-slate-400 text-[10px]">Satellite Constellation</div>
            <div className="text-xs font-semibold text-white mt-0.5 font-mono">
              {event.satellite} VIIRS
            </div>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
            <div className="text-slate-400 text-[10px]">Acquisition UTC</div>
            <div className="text-xs font-semibold text-slate-300 mt-0.5 font-mono">
              {event.acquisitionDate} {event.acquisitionTime}
            </div>
          </div>
        </div>

        {/* Risk Assessment Summary */}
        <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Risk Severity Index</span>
            <span className="font-bold text-white font-mono">{risk}/100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                risk >= 81 ? 'bg-red-500' :
                risk >= 61 ? 'bg-orange-500' :
                risk >= 31 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${risk}%` }}
            />
          </div>
        </div>

        {/* Assessment & Factors */}
        <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-orange-400" />
            <span>Thermal Assessment</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            {event.explanation?.summary || 'Multi-factor classification evaluated thermal signature and industrial geospatial boundaries.'}
          </p>
          {event.explanation?.evidence && event.explanation.evidence.length > 0 && (
            <div className="space-y-1 pt-1.5 border-t border-slate-800/80">
              {event.explanation.evidence.map((evidence, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{evidence}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Industrial Facility Proximity */}
        <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Factory className="w-3.5 h-3.5 text-cyan-400" />
            <span>Industrial Perimeter Analysis</span>
          </div>

          {event.facilityName ? (
            <div className="space-y-1">
              <div className="font-semibold text-white">{event.facilityName}</div>
              <div className="text-slate-400 capitalize text-[11px]">
                Type: <span className="text-slate-200">{event.facilityType?.replace(/_/g, ' ')}</span>
              </div>
              <div className="text-[11px]">
                Proximity:{' '}
                {event.insideIndustrialBoundary ? (
                  <span className="text-red-400 font-bold">Inside Critical Perimeter (0m)</span>
                ) : (
                  <span className="text-amber-400 font-medium">
                    {event.facilityDistance ? `${event.facilityDistance}m from border` : 'Adjacent'}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-[11px]">
              No industrial facilities within 15 km. Observation located in rural, wildland, or agricultural zone.
            </div>
          )}
        </div>

        {/* Emergency Response Directive */}
        <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tactical Response Directive</span>
            </div>
          </div>

          {directiveData ? (
            <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
              {directiveData.directive}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Generate immediate hazardous containment protocol, safety perimeter, and dispatch advisory.
              </p>
              <button
                onClick={handleGenerateDirective}
                disabled={isGeneratingDirective}
                className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Zap className={`w-3 h-3 ${isGeneratingDirective ? 'animate-bounce text-amber-400' : 'text-emerald-400'}`} />
                <span>{isGeneratingDirective ? 'Drafting Advisory...' : 'Generate Response Directive'}</span>
              </button>
            </div>
          )}

          {/* Quick Authority Alert Dispatch Button */}
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="w-full py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm shadow-red-950/40 hover:scale-[1.01]"
          >
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Dispatch Authority SMS Alert ({event.riskScore || 88}/100)</span>
          </button>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-slate-800 bg-[#0B0F1A] sticky bottom-0 z-10">
        <button
          onClick={() => navigate(`/events/${event.eventId}`)}
          className="w-full py-2 rounded bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
        >
          <span>Open Full Scientific Dossier</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Emergency Alert Modal */}
      <EmergencyAlertModal
        event={event}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
    </div>
  );
}

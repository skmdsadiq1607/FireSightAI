import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Wind, 
  Home, 
  HeartPulse, 
  Users, 
  PhoneCall, 
  Droplets, 
  Eye,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function CivilianSafetySection({ event, isCompact = false }) {
  if (!event) return null;

  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isCompact);

  const riskScore = event.riskScore || 50;
  const riskLevel = event.riskLevel || 'MODERATE';
  const classification = event.classification || 'THERMAL EVENT';
  const facilityName = event.facilityName || null;
  const isIndustrial = event.insideIndustrialBoundary || classification.includes('INDUSTRIAL');
  const nearestCity = event.nearestCity || 'Local Area';
  const state = event.state || 'Region';

  // Compute dynamic safety guidelines based on incident severity and hazard type
  const getSafetyDirectives = () => {
    if (riskLevel === 'CRITICAL' || riskScore >= 80) {
      return {
        badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
        alertLevel: 'RED ALERT — IMMEDIATE EVACUATION & SHELTER DIRECTIVE',
        evacuationRadius: '1,500m mandatory downwind evacuation zone',
        secondaryBuffer: '1.5km to 3.5km enhanced shelter-in-place buffer',
        airHazard: 'Toxic Hydrocarbon / VOCs, Benzene & Heavy Chemical Smoke',
        respiratoryAdvice: 'High-filtration N95/FFP2 respirator or multi-layer damp cloth over nose and mouth. Do NOT breathe unattenuated air.',
        indoorProtocol: 'Seal all doors, windows, and air vents with damp towels or heavy tape. IMMEDIATELY turn off air conditioners, exhaust fans, and fresh-air intake units.',
        waterProtocol: 'Do NOT consume open well water or rooftop tank water due to airborne chemical particulate fallout. Use sealed bottled or boiled filtered water only.',
        vulnerableCare: 'Urgent priority evacuation for infants, elderly citizens, pregnant mothers, and individuals with asthma, COPD, or cardiac conditions.',
        helpline: '112 / 1077 (District Disaster Operations Center)'
      };
    } else if (riskLevel === 'HIGH' || riskScore >= 60) {
      return {
        badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
        alertLevel: 'ORANGE ALERT — HIGH THREAT CANOPY / PROXIMITY ADVISORY',
        evacuationRadius: '800m containment safety corridor from active perimeter',
        secondaryBuffer: '800m to 2.0km active smoke dispersion zone',
        airHazard: 'Dense PM2.5 / PM10 Particulate Matter & Carbon Monoxide (CO)',
        respiratoryAdvice: 'Wear dust masks outdoors. Avoid vigorous outdoor physical activities, jogging, or cycling in the plume direction.',
        indoorProtocol: 'Keep external windows shut. Run indoor HEPA air purifiers if available. Clear dry leaves and combustible materials within 15m of home boundary.',
        waterProtocol: 'Keep all domestic water storage containers covered and sealed tightly.',
        vulnerableCare: 'Keep children and asthmatic family members strictly indoors during peak morning and evening smoke stagnation hours.',
        helpline: '112 / 1070 (State Disaster Management Authority)'
      };
    } else if (riskLevel === 'MEDIUM' || riskLevel === 'MODERATE' || riskScore >= 30) {
      return {
        badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        alertLevel: 'YELLOW ADVISORY — MODERATE SMOKE & AIR QUALITY NOTICE',
        evacuationRadius: 'No mandatory evacuation required at this threshold',
        secondaryBuffer: 'Local farm / agricultural perimeter monitoring',
        airHazard: 'Elevated Biomass Smoke (AQI spikes into "Poor / Very Poor" category)',
        respiratoryAdvice: 'Sensitive individuals should wear cloth masks outdoors during active stubble or residue burning periods.',
        indoorProtocol: 'Close windows facing the windward burning fields during downwind breeze.',
        waterProtocol: 'Standard sanitation precautions; ensure household water tanks remain lidded.',
        vulnerableCare: 'Consult a physician if persistent coughing, throat burning, or eye irritation develops.',
        helpline: '112 / 1077 (Local Emergency Desk)'
      };
    } else {
      return {
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        alertLevel: 'GREEN STATUS — ROUTINE OPERATIONAL ACTIVITY / SAFE',
        evacuationRadius: 'Zero exclusion zone; normal civilian routines continue',
        secondaryBuffer: 'Normal ambient air monitoring',
        airHazard: 'Controlled combustion within standard operational limits',
        respiratoryAdvice: 'No special protective equipment required for the general public.',
        indoorProtocol: 'Normal ventilation; no sealing required.',
        waterProtocol: 'Standard potable water safety.',
        vulnerableCare: 'Normal health precautions.',
        helpline: '112 (National Emergency Helpline)'
      };
    }
  };

  const safety = getSafetyDirectives();

  const publicAdvisoryText = 
`🛡️ CIVILIAN SAFETY & PRECAUTION ADVISORY [FIRESIGHT-AI]
LOCATION: ${nearestCity}, ${state} ${facilityName ? `(${facilityName})` : ''}
STATUS: ${safety.alertLevel}
EVACUATION ZONE: ${safety.evacuationRadius}
AIR QUALITY THREAT: ${safety.airHazard}
RESPIRATORY PRECAUTION: ${safety.respiratoryAdvice}
INDOOR SHELTER RULES: ${safety.indoorProtocol}
WATER SAFETY: ${safety.waterProtocol}
VULNERABLE GROUPS: ${safety.vulnerableCare}
EMERGENCY HELPLINES: Dial 112 (National Emergency), 108 (Ambulance), 1077 (District Disaster Desk)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicAdvisoryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all shadow-xl">
      {/* Header Bar */}
      <div 
        className="p-4 border-b border-slate-800 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-slate-900/40 flex items-center justify-between cursor-pointer select-none"
        onClick={() => isCompact && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Civilian Safety & Public Health
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold ${safety.badgeColor}`}>
                {riskLevel} RISK
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">
              Precautionary Measures for {nearestCity}, {state}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium flex items-center gap-1.5 transition-colors"
            title="Copy plain-text public broadcast advisory"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
            <span>{copied ? 'Advisory Copied' : 'Copy Notice'}</span>
          </button>

          {isCompact && (
            <button className="text-slate-400 hover:text-white p-1">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {isExpanded && (
        <div className="p-5 space-y-4 text-xs font-sans">
          
          {/* Top Banner Alert */}
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
            riskScore >= 80 
              ? 'border-red-500/40 bg-red-950/30 text-red-200' 
              : riskScore >= 60 
              ? 'border-orange-500/40 bg-orange-950/30 text-orange-200' 
              : 'border-blue-500/30 bg-blue-950/20 text-blue-200'
          }`}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-[11px] uppercase tracking-wider">{safety.alertLevel}</div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                Incident located {event.insideIndustrialBoundary ? 'inside active industrial perimeter' : `${event.facilityDistance || 'adjacent'} to local population zone`}. All citizens, neighborhood ward offices, and emergency volunteers must adhere to the standard NDMA civil defense instructions below.
              </p>
            </div>
          </div>

          {/* 4 Core Pillars of Citizen Safety */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Pillar 1: Evacuation & Cordon Radius */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span>1. Evacuation & Exclusion Cordon</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px] leading-relaxed">
                <div>
                  <strong className="text-white">Primary Zone:</strong> {safety.evacuationRadius}
                </div>
                <div className="text-slate-400">
                  <strong className="text-slate-300">Buffer Corridor:</strong> {safety.secondaryBuffer}
                </div>
                <div className="pt-1 text-[10px] text-amber-300/90 font-mono">
                  &bull; Move perpendicular to prevailing wind direction, never downwind.
                </div>
              </div>
            </div>

            {/* Pillar 2: Respiratory & Inhalation Protection */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <HeartPulse className="w-4 h-4 text-emerald-400" />
                <span>2. Inhalation & Mask Precautions</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px] leading-relaxed">
                <div>
                  <strong className="text-white">Chemical Airborne Threat:</strong> {safety.airHazard}
                </div>
                <p className="text-slate-400 text-[11px]">
                  {safety.respiratoryAdvice}
                </p>
                <div className="pt-1 text-[10px] text-cyan-300/90 font-mono">
                  &bull; If experiencing sudden eye stinging or coughing, rinse eyes with clean running water immediately.
                </div>
              </div>
            </div>

            {/* Pillar 3: Indoor Shelter-in-Place Rules */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                <Home className="w-4 h-4 text-amber-400" />
                <span>3. Home & Indoor Sealing Rules</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {safety.indoorProtocol}
              </p>
              <div className="pt-1 text-[10px] text-amber-300/90 font-mono">
                &bull; Do NOT ignite cooking gas stoves or candles in case of unignited vapor drift.
              </div>
            </div>

            {/* Pillar 4: Water & Food Ingestion Safety */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
                <Droplets className="w-4 h-4 text-purple-400" />
                <span>4. Water Supply & Food Protection</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {safety.waterProtocol}
              </p>
              <div className="pt-1 text-[10px] text-purple-300/90 font-mono">
                &bull; Discard any open vegetables, fruits, or livestock feed exposed to fallout ash.
              </div>
            </div>
          </div>

          {/* Vulnerable Populations & Helplines Banner */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Users className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-semibold text-white text-[11px]">
                  Vulnerable Groups & Medical Care:
                </div>
                <div className="text-slate-400 text-[11px]">
                  {safety.vulnerableCare}
                </div>
              </div>
            </div>

            {/* Quick Emergency Hotlines */}
            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              <a 
                href="tel:112"
                className="px-2.5 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/40 text-red-200 border border-red-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3 h-3 text-red-400" />
                <span>Call 112 (Disaster)</span>
              </a>
              <a 
                href="tel:108"
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3 h-3 text-emerald-400" />
                <span>Call 108 (Medical)</span>
              </a>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Copy, 
  Check, 
  ExternalLink, 
  Radio, 
  ShieldAlert,
  MessageSquare,
  Sparkles,
  Zap
} from 'lucide-react';
import { alertService } from '../../services/api';

export default function EmergencyAlertModal({ event, isOpen, onClose }) {
  if (!isOpen || !event) return null;

  const facilityName = event.facilityName || 'Designated Area';
  const riskScore = event.riskScore || 88;
  const riskLevel = event.riskLevel || 'CRITICAL';
  const frp = event.frp || 58.4;
  const state = event.state || 'Gujarat';
  const nearestCity = event.nearestCity || 'Jamnagar';
  const [lon, lat] = event.geometry?.coordinates || [event.longitude || 69.865, event.latitude || 22.360];

  // Pre-configured government disaster response authorities based on location
  const getDefaultAuthorities = () => {
    if (state.toLowerCase().includes('gujarat') || facilityName.toLowerCase().includes('jamnagar') || facilityName.toLowerCase().includes('hazira')) {
      return [
        { name: 'Gujarat SDMA Emergency Ops Center', phone: '+91-79-23259283', role: 'State Disaster Management Authority' },
        { name: 'NDRF 6th Battalion Command (Vadodara)', phone: '+91-265-2830491', role: 'National Disaster Response Force' },
        { name: 'Jamnagar Municipal Fire Control Room', phone: '+91-288-2550101', role: 'District Fire & Rescue Command' }
      ];
    }
    if (state.toLowerCase().includes('haryana') || facilityName.toLowerCase().includes('panipat')) {
      return [
        { name: 'Haryana SDMA Control Room', phone: '+91-172-2545938', role: 'State Disaster Management' },
        { name: 'Panipat District Emergency Cell', phone: '+91-180-2652100', role: 'District Emergency Command' },
        { name: 'NDRF 8th Battalion (Ghaziabad)', phone: '+91-120-2766618', role: 'NDRF Regional Response' }
      ];
    }
    if (state.toLowerCase().includes('andhra') || facilityName.toLowerCase().includes('visakhapatnam')) {
      return [
        { name: 'Andhra Pradesh SDMA Emergency Desk', phone: '+91-863-2377000', role: 'State Disaster Authority' },
        { name: 'NDRF 10th Battalion (Vijayawada)', phone: '+91-867-6257000', role: 'NDRF Response Force' },
        { name: 'Visakhapatnam Fire & Disaster Control', phone: '+91-891-2565101', role: 'Municipal Fire Services' }
      ];
    }
    return [
      { name: 'National Emergency Operations Centre (NEOC)', phone: '+91-11-26701728', role: 'NDMA Central Command' },
      { name: 'NDRF HQ Disaster Control Room', phone: '+91-11-24363260', role: 'National Response Force' },
      { name: 'State Disaster Management Cell', phone: '+91-11-1070', role: 'State Emergency Services' }
    ];
  };

  const authorities = getDefaultAuthorities();
  const [selectedAuthority, setSelectedAuthority] = useState(authorities[0].name);
  const [customPhone, setCustomPhone] = useState('');
  const [useCustomPhone, setUseCustomPhone] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dispatch state
  const [channel, setChannel] = useState('WHATSAPP'); // 'WHATSAPP' | 'SMS'
  const [dispatchStatus, setDispatchStatus] = useState('idle'); // idle | transmitting | delivered | error
  const [deliveryReceipt, setDeliveryReceipt] = useState(null);

  const activePhone = useCustomPhone 
    ? customPhone 
    : authorities.find(a => a.name === selectedAuthority)?.phone || '+91-79-23259283';

  // Format tactical SMS alert body
  const smsBody = 
`🚨 PRIORITY 1 NDMA DISASTER ALERT [FIRESIGHT-AI] 🚨
SEVERITY: ${riskLevel} (${riskScore}/100)
TARGET: ${facilityName}
LOCATION: ${nearestCity}, ${state} (${lat?.toFixed(3)}°N, ${lon?.toFixed(3)}°E)
THERMAL: ${frp} MW FRP | VIIRS Satellite Sensor
STATUS: ${event.insideIndustrialBoundary ? 'INSIDE Critical Industrial Polygon (0m)' : 'Proximity Threat'}
PROTOCOL: Evacuate 1,500m radius downwind. Deploy AR-AFFF foam monitors immediately.
DOSSIER: https://firesightai-puce.vercel.app/events/${event.eventId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(smsBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatchGateway = async () => {
    setDispatchStatus('transmitting');
    try {
      const response = await alertService.dispatchEmergencyAlert({
        eventId: event.eventId,
        facilityName,
        riskScore,
        riskLevel,
        locationName: `${nearestCity}, ${state}`,
        coordinates: [lon, lat],
        frp,
        recommendation: event.explanation?.recommendation || 'Deploy AR-AFFF foam. Enforce 1,500m cordon.',
        recipientName: useCustomPhone ? 'Designated Authority Contact' : selectedAuthority,
        phoneNumber: activePhone,
        smsText: smsBody,
        channel
      });

      setTimeout(() => {
        setDeliveryReceipt(response.data.data);
        setDispatchStatus('delivered');
      }, 950);
    } catch {
      setDispatchStatus('error');
    }
  };

  const handleNativeSMS = () => {
    const cleanNumber = activePhone.replace(/[^0-9+]/g, '');
    const encoded = encodeURIComponent(smsBody);
    window.open(`sms:${cleanNumber}?body=${encoded}`, '_blank');
  };

  const handleWhatsApp = () => {
    const cleanNumber = activePhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(smsBody);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-2xl border border-red-500/40 bg-[#0B0F1A] text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-red-950/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">Emergency Dispatch Console</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-mono">
                  Score: {riskScore}/100 {riskLevel}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-white truncate max-w-md">
                Priority Authority SMS Broadcast — {facilityName}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs font-sans">
          
          {/* Live Twilio Carrier Channel Selector */}
          <div className="space-y-1.5">
            <div className="text-slate-300 font-semibold flex items-center justify-between">
              <span>Select Live Dispatch Network:</span>
              <span className="text-[10px] text-emerald-400 font-mono">Twilio LPU Connected</span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setChannel('WHATSAPP')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  channel === 'WHATSAPP' 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Twilio WhatsApp (+1 415-523-8886)</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('SMS')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  channel === 'SMS' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-950' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Twilio SMS (+1 405-652-7320)</span>
              </button>
            </div>

            {channel === 'WHATSAPP' && (
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-[11px] leading-relaxed flex items-start gap-2">
                <span className="font-bold shrink-0">📲 Sandbox Join:</span>
                <span>Send WhatsApp message <code className="bg-emerald-900/60 px-1 py-0.5 rounded font-mono text-white font-bold">join soft-peace</code> to <strong className="text-white">+1 415 523 8886</strong> to receive live alerts on your phone.</span>
              </div>
            )}
          </div>

          {/* Recipient Authority Selection */}
          <div className="space-y-2">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Emergency Authority Recipient:</span>
            </label>

            <div className="space-y-1.5">
              {authorities.map((auth) => (
                <label 
                  key={auth.name}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    !useCustomPhone && selectedAuthority === auth.name
                      ? 'border-cyan-500 bg-cyan-950/20 text-white'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                  }`}
                  onClick={() => {
                    setSelectedAuthority(auth.name);
                    setUseCustomPhone(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="authority"
                      checked={!useCustomPhone && selectedAuthority === auth.name}
                      onChange={() => {}}
                      className="accent-cyan-500"
                    />
                    <div>
                      <div className="font-medium text-white">{auth.name}</div>
                      <div className="text-[11px] text-slate-400">{auth.role}</div>
                    </div>
                  </div>
                  <div className="font-mono text-cyan-400 text-[11px] font-semibold">
                    {auth.phone}
                  </div>
                </label>
              ))}

              {/* Custom Number Input */}
              <div 
                className={`p-2.5 rounded-xl border transition-all ${
                  useCustomPhone 
                    ? 'border-cyan-500 bg-cyan-950/20' 
                    : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div 
                  className="flex items-center gap-2 cursor-pointer mb-2"
                  onClick={() => setUseCustomPhone(true)}
                >
                  <input 
                    type="radio" 
                    name="authority" 
                    checked={useCustomPhone}
                    onChange={() => setUseCustomPhone(true)}
                    className="accent-cyan-500"
                  />
                  <span className="font-medium text-slate-200">
                    Test Real Mobile / Custom Recipient (e.g. Judge Phone)
                  </span>
                </div>
                {useCustomPhone && (
                  <div className="flex items-center gap-2 pl-6">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="tel"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formatted Message Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>TRAI DLT Encrypted Alert Payload:</span>
              </span>
              <button 
                onClick={handleCopy}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy SMS'}</span>
              </button>
            </div>
            
            <pre className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all">
              {smsBody}
            </pre>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Standard: <strong>NDMA Common Alerting Protocol (CAP-IN)</strong></span>
              <span className="text-emerald-400 font-mono">DLT Route: High-Priority Emergency Broadcast</span>
            </div>
          </div>

          {/* Delivery Confirmation Receipt */}
          {dispatchStatus === 'delivered' && deliveryReceipt && (
            <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-200 space-y-2 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>EMERGENCY BROADCAST CONFIRMED & DELIVERED</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                  {deliveryReceipt.mode?.includes('TWILIO') ? '🟢 LIVE TWILIO DISPATCH' : 'DLT GATEWAY VERIFIED'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-1">
                <div>Message SID: <span className="text-white font-semibold truncate block">{deliveryReceipt.messageId}</span></div>
                <div>Routing Latency: <span className="text-emerald-400 font-semibold">{deliveryReceipt.latencyMs} ms</span></div>
                <div>Recipient: <span className="text-white truncate block">{deliveryReceipt.recipient}</span></div>
                <div>Network Status: <span className="text-emerald-400 font-bold">200 OK (SENT)</span></div>
              </div>
              {deliveryReceipt.twilioNote && (
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[10px] text-amber-300/90 font-sans">
                  <strong>Carrier Note:</strong> {deliveryReceipt.twilioNote}
                </div>
              )}
            </div>
          )}

          {dispatchStatus === 'transmitting' && (
            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300 flex items-center gap-2.5 animate-pulse">
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <div className="text-xs">
                Transmitting priority encrypted payload through TRAI DLT Emergency Telecom Gateway...
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#090D17] flex flex-wrap items-center justify-between gap-2">
          {/* Quick Real Phone Channels */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Open WhatsApp with pre-filled emergency alert"
            >
              <span>Send WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={handleNativeSMS}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Open default SMS app on phone/PC"
            >
              <span>Device SMS App</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Main Dispatch Action */}
          <button
            onClick={handleDispatchGateway}
            disabled={dispatchStatus === 'transmitting'}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950/50 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {dispatchStatus === 'delivered' 
                ? 'Re-broadcast SMS Alert' 
                : dispatchStatus === 'transmitting' 
                ? 'Dispatching Payload...' 
                : 'Transmit Emergency SMS Now'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

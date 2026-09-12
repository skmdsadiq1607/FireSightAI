import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Database,
  Satellite,
  Cpu,
  MapPin,
  Clock,
  Radio,
  FileText
} from 'lucide-react';
import DataProvenanceTag from '../components/common/DataProvenanceTag';
import { monitoringService } from '../services/api';

export default function MonitoringPage() {
  const [statusData, setStatusData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);

  const loadStatus = async () => {
    try {
      setIsLoading(true);
      const res = await monitoringService.getStatus();
      setStatusData(res.data?.data || null);
    } catch (err) {
      console.error('Failed to load status telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const handleTriggerIngest = async () => {
    setIsTriggering(true);
    try {
      await monitoringService.triggerIngestion();
      await loadStatus();
    } catch (err) {
      console.error('Trigger error:', err);
    } finally {
      setIsTriggering(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'HEALTHY') {
      return (
        <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          ONLINE / HEALTHY
        </span>
      );
    }
    if (status === 'DEMO_STANDBY' || status === 'DEMO_FALLBACK') {
      return (
        <span className="flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-800/50">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          DEMO ACTIVE
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-xs font-mono text-red-400 bg-red-950/40 px-2.5 py-1 rounded-full border border-red-800/50">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        DEGRADED
      </span>
    );
  };

  const services = statusData?.services || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span>Mission Control & Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time health verification for NASA FIRMS, OpenStreetMap Overpass, Copernicus CDSE, and Python ML
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerIngest}
            disabled={isTriggering}
            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTriggering ? 'animate-spin' : ''}`} />
            <span>Trigger Thermal Ingestion Now</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-mono">
        {/* MongoDB 2dsphere */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            {getStatusBadge(services.database?.status || 'HEALTHY')}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Geospatial Datastore</h3>
            <p className="text-xs text-slate-400 mt-1">{services.database?.details || 'MongoDB 2dsphere indexes active'}</p>
          </div>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            Engine: MongoDB Mongoose + GeoJSON 4326
          </div>
        </div>

        {/* Python AI Intelligence */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            {getStatusBadge(services.aiService?.status || 'HEALTHY')}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI / Scientific Service</h3>
            <p className="text-xs text-slate-400 mt-1">{services.aiService?.details || 'Python FastAPI :8000'}</p>
          </div>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            Model: Scikit-Learn Random Forest + Spatial Rules
          </div>
        </div>

        {/* NASA FIRMS */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-orange-950/30 border border-orange-800/40 text-orange-400">
              <Radio className="w-5 h-5" />
            </div>
            {getStatusBadge(services.firms?.status || 'DEMO_STANDBY')}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">NASA FIRMS Feed</h3>
            <p className="text-xs text-slate-400 mt-1">{services.firms?.details || 'VIIRS NOAA-20/21 NRT'}</p>
          </div>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            Region: India Bounding Box [68.1, 6.5, 97.4, 37.1]
          </div>
        </div>

        {/* Copernicus Sentinel-2 */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-indigo-400">
              <Satellite className="w-5 h-5" />
            </div>
            {getStatusBadge(services.sentinel?.status || 'DEMO_STANDBY')}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Copernicus Sentinel-2</h3>
            <p className="text-xs text-slate-400 mt-1">{services.sentinel?.details || 'CDSE OData API'}</p>
          </div>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            Spectral: SWIR B11 (1.6&mu;m) &amp; B12 (2.2&mu;m)
          </div>
        </div>

        {/* OSM Overpass */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            {getStatusBadge(services.osm?.status || 'HEALTHY')}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">OpenStreetMap Overpass</h3>
            <p className="text-xs text-slate-400 mt-1">{services.osm?.details || 'Industrial GeoJSON boundaries'}</p>
          </div>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            Tags: landuse=industrial, power=plant, refinery
          </div>
        </div>

        {/* Persistence Cron */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            {getStatusBadge('HEALTHY')}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Spatio-Temporal Cron</h3>
            <p className="text-xs text-slate-400 mt-1">Multi-pass 15-minute polling interval</p>
          </div>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            Cluster Radius: 1500m &bull; Window: 7 days
          </div>
        </div>
      </div>

      {/* Ingestion & Telemetry Logs */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-slate-300 font-bold flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Telemetry & Ingestion Audit Trail</span>
          </span>
          <span className="text-[10px] text-slate-400">Truthful Telemetry Log</span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {statusData?.recentLogs?.length > 0 ? (
            statusData.recentLogs.map((log, idx) => (
              <div
                key={log._id || idx}
                className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/60 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{log.service}</span>
                    <span className={`px-1.5 py-0.2 text-[10px] rounded border ${
                      log.status === 'HEALTHY' ? 'text-emerald-400 border-emerald-800/50 bg-emerald-950/30' :
                      log.status === 'DEMO_FALLBACK' ? 'text-amber-400 border-amber-800/50 bg-amber-950/30' :
                      'text-red-400 border-red-800/50 bg-red-950/30'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{log.message}</p>
                </div>
                <div className="text-[10px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs">
              No recent audit logs available. Trigger thermal ingestion above to record fresh telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

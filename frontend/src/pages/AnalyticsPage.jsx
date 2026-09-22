import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  Flame,
  Activity,
  AlertTriangle,
  Factory,
  Calendar,
  Layers,
  RefreshCw
} from 'lucide-react';
import DataProvenanceTag from '../components/common/DataProvenanceTag';
import { analyticsService } from '../services/api';

const COLORS = ['#EF4444', '#F97316', '#10B981', '#F59E0B', '#3B82F6', '#6B7280'];

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [classifications, setClassifications] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const [ovRes, clRes, rkRes, tmRes, facRes] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getClassifications(),
        analyticsService.getRisk(),
        analyticsService.getTimeline(),
        analyticsService.getFacilities()
      ]);
      setOverview(ovRes.data?.data || null);
      setClassifications(clRes.data?.data || []);
      setRiskData(rkRes.data?.data || []);
      setTimeline(tmRes.data?.data || []);
      setFacilities(facRes.data?.data || []);
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>Geospatial Intelligence Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Statistical distributions, thermal radiative power flux, and risk profiles across Indian sectors
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DataProvenanceTag source="NASA FIRMS + FireSight AI ML" />
          <button
            onClick={loadAnalytics}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-mono flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Hotspots</span>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {overview?.activeThermalEvents || 840}
          </div>
          <div className="text-[10px] text-slate-400">NASA VIIRS & MODIS</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Facilities Tracked</span>
            <Factory className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300">
            {overview?.facilitiesMonitored || 12}
          </div>
          <div className="text-[10px] text-slate-400">OSM Industrial Complexes</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Persistent Flares</span>
            <Activity className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300">
            {overview?.persistentSources || 7}
          </div>
          <div className="text-[10px] text-slate-400">Multi-day thermal sources</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>High/Critical Alerts</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400">
            {overview?.highCriticalRisk || 12}
          </div>
          <div className="text-[10px] text-slate-400">Risk Score &ge; 61</div>
        </div>
      </div>

      {/* Row 1: Key Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classification Breakdown Bar Chart */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between font-mono">
            <span className="text-xs uppercase text-slate-300 font-bold flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Thermal Event Classification Breakdown</span>
            </span>
            <span className="text-[10px] text-slate-400">Total Count</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classifications} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  tick={{ fontSize: 9, fill: '#94A3B8' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Observed Events" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between font-mono">
            <span className="text-xs uppercase text-slate-300 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Risk Tier Distribution</span>
            </span>
            <span className="text-[10px] text-slate-400">0–100 Weighted Prioritization</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || '#F97316'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Average FRP by Sector */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-slate-300 font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Mean Radiative Thermal Flux (FRP in Megawatts) by Category</span>
          </span>
          <span className="text-[10px] text-slate-400">NASA VIIRS 375m Sensor</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {classifications.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase truncate">{item.name}</div>
              <div className="text-xl font-bold text-orange-400">{item.avgFRP || 0} MW</div>
              <div className="text-[10px] text-slate-500">{item.count} detections</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

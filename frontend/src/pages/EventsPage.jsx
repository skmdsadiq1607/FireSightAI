import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Flame,
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Layers,
  Activity
} from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';
import ClassificationBadge from '../components/common/ClassificationBadge';
import DataProvenanceTag from '../components/common/DataProvenanceTag';
import { eventService } from '../services/api';

export default function EventsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [classification, setClassification] = useState(searchParams.get('classification') || 'ALL');
  const [riskLevel, setRiskLevel] = useState(searchParams.get('riskLevel') || 'ALL');
  const [isPersistent, setIsPersistent] = useState(searchParams.get('isPersistent') === 'true');

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const res = await eventService.getEvents({
        search: search || undefined,
        classification: classification !== 'ALL' ? classification : undefined,
        riskLevel: riskLevel !== 'ALL' ? riskLevel : undefined,
        isPersistent: isPersistent ? 'true' : undefined,
        limit: 50
      });
      setEvents(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [classification, riskLevel, isPersistent]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadEvents();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span>Thermal Anomaly Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time feed of multi-satellite observations enriched with industrial boundaries & risk scores
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadEvents}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-mono flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by event ID, facility, city, or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Classifications</option>
            <option value="INDUSTRIAL FIRE">Industrial Fire</option>
            <option value="PERSISTENT THERMAL SOURCE">Persistent Source</option>
            <option value="NATURAL / WILDFIRE">Natural / Wildfire</option>
            <option value="AGRICULTURAL BURNING">Agricultural Burning</option>
            <option value="ROUTINE INDUSTRIAL HEAT">Routine Industrial Heat</option>
            <option value="UNCERTAIN ANOMALY">Uncertain Anomaly</option>
          </select>

          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical (81-100)</option>
            <option value="HIGH">High (61-80)</option>
            <option value="MEDIUM">Medium (31-60)</option>
            <option value="LOW">Low (0-30)</option>
          </select>

          <button
            onClick={() => setIsPersistent(!isPersistent)}
            className={`px-3 py-2 rounded-xl border transition-all ${
              isPersistent
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700/80 hover:text-slate-200'
            }`}
          >
            Persistent Only
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A0E1A] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Event ID</th>
                <th className="p-4">Classification</th>
                <th className="p-4">Risk Index</th>
                <th className="p-4">Thermal Flux (FRP)</th>
                <th className="p-4">Industrial Context</th>
                <th className="p-4">Persistence</th>
                <th className="p-4">Sensor</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">
                    <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2" />
                    Querying thermal anomalies...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">
                    No thermal anomaly records match your filter criteria.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr
                    key={event.eventId}
                    onClick={() => navigate(`/events/${event.eventId}`)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-bold text-white tracking-tight">
                      {event.eventId}
                    </td>
                    <td className="p-4">
                      <ClassificationBadge classification={event.classification} size="sm" />
                    </td>
                    <td className="p-4">
                      <RiskBadge level={event.riskLevel} score={event.riskScore} size="sm" />
                    </td>
                    <td className="p-4 font-bold text-orange-400">
                      {event.frp.toFixed(1)} MW
                      <span className="text-[10px] text-slate-500 ml-1 font-normal">({event.brightnessTemperature.toFixed(1)} K)</span>
                    </td>
                    <td className="p-4">
                      {event.facilityName ? (
                        <div>
                          <div className="font-semibold text-white truncate max-w-[180px]">{event.facilityName}</div>
                          <div className="text-[10px] text-slate-400">
                            {event.insideIndustrialBoundary ? (
                              <span className="text-red-400">Inside Perimeter</span>
                            ) : (
                              <span>{event.facilityDistance ? `${event.facilityDistance}m` : 'Adjacent'}</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">Remote / Non-industrial</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] border ${
                        event.isPersistent
                          ? 'bg-purple-950/40 text-purple-300 border-purple-800/50'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {event.persistenceDays || 1}d / {event.persistenceCount || 1} passes
                      </span>
                    </td>
                    <td className="p-4 text-cyan-300">
                      {event.satellite} ({event.instrument})
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${event.eventId}`);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

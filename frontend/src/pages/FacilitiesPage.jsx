import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Factory,
  Search,
  AlertTriangle,
  Flame,
  PhoneCall,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';
import DataProvenanceTag from '../components/common/DataProvenanceTag';
import { facilityService } from '../services/api';

export default function FacilitiesPage() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const loadFacilities = async () => {
    try {
      setIsLoading(true);
      const res = await facilityService.getFacilities({
        search: search || undefined,
        type: typeFilter !== 'ALL' ? typeFilter : undefined
      });
      setFacilities(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load facilities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, [typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadFacilities();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Factory className="w-6 h-6 text-amber-500" />
            <span>Industrial Infrastructure Registry</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Monitored petrochemical complexes, power plants, steel mills, and chemical terminals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DataProvenanceTag source="OpenStreetMap (Overpass API)" />
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search facility name, district, or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </form>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Facility Types</option>
          <option value="petrochemical_refinery">Petrochemical & Refinery</option>
          <option value="power_plant">Thermal Power Station</option>
          <option value="steel_metallurgy">Steel & Metallurgy</option>
          <option value="chemical_manufacturing">Chemical Manufacturing</option>
          <option value="industrial_estate">Industrial SEZ / Estate</option>
        </select>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-mono">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-slate-500 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
            Loading industrial facilities registry...
          </div>
        ) : facilities.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 text-xs">
            No facilities found matching search criteria.
          </div>
        ) : (
          facilities.map((fac) => (
            <div
              key={fac._id || fac.osmId}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 backdrop-blur-md space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                    {fac.facilityType?.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${
                    fac.criticalityLevel === 'VERY_HIGH' ? 'bg-red-950/40 text-red-400 border-red-800/60' :
                    fac.criticalityLevel === 'HIGH' ? 'bg-orange-950/40 text-orange-400 border-orange-800/60' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {fac.criticalityLevel} PRIORITY
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm leading-snug">{fac.name}</h3>

                <p className="text-xs text-slate-400">
                  {fac.location?.city || fac.location?.district}, {fac.location?.state}
                </p>
              </div>

              {/* Baseline Thermal Profile */}
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Operating Baseline:</span>
                  <span className="text-emerald-400 font-bold">{fac.baselineThermal?.sourceType?.replace(/_/g, ' ').toUpperCase() || 'NONE'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Normal Expected FRP:</span>
                  <span className="font-bold text-orange-400">{fac.baselineThermal?.meanFRP || 0} &plusmn; {fac.baselineThermal?.stdDevFRP || 0} MW</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Baseline Samples:</span>
                  <span>{fac.baselineThermal?.sampleCount || 0} passes ({fac.baselineThermal?.baselineConfidence} confidence)</span>
                </div>
              </div>

              {/* Live Alerts & Emergency */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>{fac.activeEventsCount || 0} Active Events</span>
                </div>

                <button
                  onClick={() => navigate(`/dashboard`)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] font-medium"
                >
                  <span>Locate on Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

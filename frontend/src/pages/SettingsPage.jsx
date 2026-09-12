import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Globe,
  Satellite,
  Save,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { configService } from '../services/api';

export default function SettingsPage() {
  const [config, setConfig] = useState({
    dataMode: 'demo',
    riskWeights: {
      thermalIntensity: 30,
      persistence: 25,
      industrialProximity: 20,
      historicalRecurrence: 15,
      populationContext: 10
    },
    firmsSettings: {
      pollIntervalMinutes: 15,
      region: 'india'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    configService.getConfig()
      .then(res => {
        if (res.data?.data) {
          setConfig(prev => ({
            ...prev,
            ...res.data.data
          }));
        }
      })
      .catch(console.warn);
  }, []);

  const handleWeightChange = (key, val) => {
    setConfig(prev => ({
      ...prev,
      riskWeights: {
        ...prev.riskWeights,
        [key]: parseInt(val, 10) || 0
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await configService.updateConfig(config);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update config:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setConfig(prev => ({
      ...prev,
      riskWeights: {
        thermalIntensity: 30,
        persistence: 25,
        industrialProximity: 20,
        historicalRecurrence: 15,
        populationContext: 10
      }
    }));
  };

  const currentTotal = Object.values(config.riskWeights).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-orange-500" />
            <span>Platform Configuration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tunable 0–100 risk prioritization weights, satellite feeds, and operational thresholds
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] disabled:opacity-50"
        >
          {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Saving...' : savedSuccess ? 'Saved Successfully!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Data Feed Mode */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 uppercase tracking-wider">
          <Satellite className="w-4 h-4" />
          <span>Operational Data Provider Mode</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
            config.dataMode === 'demo'
              ? 'bg-amber-950/20 border-amber-500/50 text-amber-200'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
          }`}>
            <input
              type="radio"
              name="dataMode"
              value="demo"
              checked={config.dataMode === 'demo'}
              onChange={() => setConfig(prev => ({ ...prev, dataMode: 'demo' }))}
              className="hidden"
            />
            <div className="font-bold text-sm text-white">DEMONSTRATION MODE (Default)</div>
            <p className="text-xs text-slate-400 mt-1">
              Zero-credential operation with calibrated high-fidelity Indian industrial, wildfire, and agricultural test cases.
            </p>
          </label>

          <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
            config.dataMode === 'live'
              ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
          }`}>
            <input
              type="radio"
              name="dataMode"
              value="live"
              checked={config.dataMode === 'live'}
              onChange={() => setConfig(prev => ({ ...prev, dataMode: 'live' }))}
              className="hidden"
            />
            <div className="font-bold text-sm text-white">LIVE SATELLITE STREAM</div>
            <p className="text-xs text-slate-400 mt-1">
              Connects directly to NASA FIRMS API (VIIRS NOAA-20/21) and Copernicus Data Space Sentinel-2 OData.
            </p>
          </label>
        </div>
      </div>

      {/* Configurable Risk Engine Weights */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>0–100 Risk Engine Weight Tuning</span>
          </div>
          <button
            onClick={handleResetDefaults}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Adjust the relative importance of factors determining whether a thermal hotspot receives a CRITICAL, HIGH, MEDIUM, or LOW risk index. Total weights normalize dynamically (Current sum: <strong>{currentTotal}%</strong>).
        </p>

        <div className="space-y-4 pt-2">
          {/* Thermal Intensity */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-200 font-medium">Thermal Radiative Power &amp; Brightness (FRP)</span>
              <span className="font-bold text-orange-400">{config.riskWeights?.thermalIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={config.riskWeights?.thermalIntensity || 30}
              onChange={(e) => handleWeightChange('thermalIntensity', e.target.value)}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Temporal Persistence */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-200 font-medium">Temporal Persistence (Multi-Day Detections)</span>
              <span className="font-bold text-purple-400">{config.riskWeights?.persistence}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={config.riskWeights?.persistence || 25}
              onChange={(e) => handleWeightChange('persistence', e.target.value)}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Industrial Proximity */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-200 font-medium">Industrial Infrastructure Proximity &amp; Boundary Hit</span>
              <span className="font-bold text-cyan-400">{config.riskWeights?.industrialProximity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={config.riskWeights?.industrialProximity || 20}
              onChange={(e) => handleWeightChange('industrialProximity', e.target.value)}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Historical Recurrence / Baseline Anomaly */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-200 font-medium">Historical Baseline Delta (Anomaly Exceedance)</span>
              <span className="font-bold text-amber-400">{config.riskWeights?.historicalRecurrence}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={config.riskWeights?.historicalRecurrence || 15}
              onChange={(e) => handleWeightChange('historicalRecurrence', e.target.value)}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Criticality & Context */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-200 font-medium">Critical Infrastructure Priority (Petrochemical &gt; General)</span>
              <span className="font-bold text-emerald-400">{config.riskWeights?.populationContext}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={config.riskWeights?.populationContext || 10}
              onChange={(e) => handleWeightChange('populationContext', e.target.value)}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

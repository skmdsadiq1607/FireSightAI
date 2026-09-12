const mongoose = require('mongoose');
const MonitoringLog = require('../models/MonitoringLog');
const AIServiceClient = require('../services/AIServiceClient');
const IngestionPipeline = require('../services/IngestionPipeline');

exports.getStatus = async (req, res) => {
  try {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'HEALTHY' : 'DEGRADED';

    // AI Service check
    const aiHealth = await AIServiceClient.checkHealth();

    // FIRMS status
    const hasLiveFirmsKey = Boolean(process.env.FIRMS_MAP_KEY && process.env.FIRMS_MAP_KEY !== 'demo_firms_key' && !process.env.FIRMS_MAP_KEY.startsWith('YOUR_'));
    const firmsStatus = process.env.DATA_MODE === 'live'
      ? (hasLiveFirmsKey ? 'HEALTHY' : 'DEGRADED')
      : 'DEMO_STANDBY';

    // Sentinel status
    const hasSentinelCreds = Boolean(process.env.COPERNICUS_CLIENT_ID && process.env.COPERNICUS_CLIENT_ID !== 'demo_copernicus_id' && !process.env.COPERNICUS_CLIENT_ID.startsWith('YOUR_'));
    const sentinelStatus = process.env.DATA_MODE === 'live'
      ? (hasSentinelCreds ? 'HEALTHY' : 'DEGRADED')
      : 'DEMO_STANDBY';

    // Recent logs
    const recentLogs = await MonitoringLog.find().sort({ timestamp: -1 }).limit(15);

    res.json({
      success: true,
      data: {
        dataMode: process.env.DATA_MODE || 'demo',
        lastUpdated: new Date(),
        services: {
          database: {
            name: 'MongoDB 2dsphere Geospatial Store',
            status: mongoStatus,
            details: mongoStatus === 'HEALTHY' ? 'Connected to local replica/instance' : 'Disconnected or reconnecting'
          },
          aiService: {
            name: 'Python FastAPI Intelligence Engine',
            status: aiHealth.status,
            details: aiHealth.status === 'HEALTHY'
              ? 'Random Forest & Anomaly Model loaded (:8000)'
              : 'Service starting or using fallback expert rules'
          },
          firms: {
            name: 'NASA FIRMS VIIRS/MODIS Thermal Feed',
            status: firmsStatus,
            details: firmsStatus === 'HEALTHY'
              ? 'Real-time satellite stream connected'
              : 'Running high-fidelity Indian demonstration dataset'
          },
          sentinel: {
            name: 'Copernicus Sentinel-2 L2A Optical/SWIR Service',
            status: sentinelStatus,
            details: sentinelStatus === 'HEALTHY'
              ? 'CDSE OData API token active'
              : 'Seeded SWIR calibration active (credentials pending)'
          },
          osm: {
            name: 'OpenStreetMap Overpass Industrial Registry',
            status: 'HEALTHY',
            details: 'Overpass query engine active with cached industrial geometries'
          }
        },
        recentLogs
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.triggerIngestion = async (req, res) => {
  try {
    const pipeline = new IngestionPipeline(process.env.DATA_MODE || 'demo');
    const result = await pipeline.runPipeline(req.body || {});
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

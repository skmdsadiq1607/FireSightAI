const mongoose = require('mongoose');

const MonitoringLogSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    enum: ['FIRMS_INGESTION', 'OSM_OVERPASS', 'SENTINEL_COPERNICUS', 'AI_INTELLIGENCE', 'DATABASE_HEALTH', 'PERSISTENCE_CRON']
  },
  status: {
    type: String,
    required: true,
    enum: ['HEALTHY', 'DEGRADED', 'FAILED', 'DEMO_FALLBACK']
  },
  message: {
    type: String,
    required: true
  },
  metrics: {
    responseTimeMs: { type: Number, default: 0 },
    recordsProcessed: { type: Number, default: 0 },
    newEventsCount: { type: Number, default: 0 },
    errorDetails: { type: String, default: null }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

MonitoringLogSchema.index({ service: 1, timestamp: -1 });

module.exports = mongoose.model('MonitoringLog', MonitoringLogSchema);

const mongoose = require('mongoose');

const SystemConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'global_config'
  },
  dataMode: {
    type: String,
    enum: ['demo', 'live'],
    default: 'demo'
  },
  riskWeights: {
    thermalIntensity: { type: Number, default: 30 },
    persistence: { type: Number, default: 25 },
    industrialProximity: { type: Number, default: 20 },
    historicalRecurrence: { type: Number, default: 15 },
    populationContext: { type: Number, default: 10 }
  },
  firmsSettings: {
    pollIntervalMinutes: { type: Number, default: 15 },
    region: { type: String, default: 'india' },
    bbox: {
      minLon: { type: Number, default: 68.1 },
      minLat: { type: Number, default: 6.5 },
      maxLon: { type: Number, default: 97.4 },
      maxLat: { type: Number, default: 37.1 }
    },
    minFRP: { type: Number, default: 1.0 }
  },
  copernicusSettings: {
    maxCloudCoverPercent: { type: Number, default: 30 },
    searchDaysWindow: { type: Number, default: 5 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SystemConfig', SystemConfigSchema);

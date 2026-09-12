const mongoose = require('mongoose');

const ThermalEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  source: {
    type: String,
    enum: ['NASA_FIRMS_LIVE', 'NASA_FIRMS_DEMO', 'MANUAL_INSPECTION'],
    default: 'NASA_FIRMS_DEMO'
  },
  satellite: {
    type: String,
    required: true, // e.g., 'NOAA-20', 'NOAA-21', 'Suomi-NPP', 'Terra', 'Aqua'
    default: 'NOAA-20'
  },
  instrument: {
    type: String,
    required: true, // 'VIIRS' or 'MODIS'
    default: 'VIIRS'
  },
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  acquisitionDate: {
    type: String, // 'YYYY-MM-DD'
    required: true
  },
  acquisitionTime: {
    type: String, // 'HHMM'
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  brightnessTemperature: {
    type: Number, // Kelvin, e.g. 345.8
    required: true
  },
  frp: {
    type: Number, // Fire Radiative Power in Megawatts (MW)
    required: true,
    default: 0
  },
  confidence: {
    type: String, // e.g. 'high', 'nominal', 'low' or percentage string
    default: 'nominal'
  },
  dayNight: {
    type: String,
    enum: ['D', 'N'],
    default: 'D'
  },
  scan: {
    type: Number,
    default: 0.4
  },
  track: {
    type: Number,
    default: 0.4
  },

  // Geospatial & Industrial Context (Enriched via OSM)
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    default: null
  },
  facilityName: {
    type: String,
    default: null
  },
  facilityType: {
    type: String,
    default: null // 'refinery', 'chemical_plant', 'power_plant', 'steel_mill', 'manufacturing'
  },
  facilityDistance: {
    type: Number, // in meters from centroid or polygon border
    default: null
  },
  insideIndustrialBoundary: {
    type: Boolean,
    default: false
  },
  nearestCity: {
    type: String,
    default: 'Unknown'
  },
  state: {
    type: String,
    default: 'Unknown'
  },

  // Temporal Persistence Tracking
  persistenceClusterId: {
    type: String,
    default: null
  },
  persistenceCount: {
    type: Number,
    default: 1
  },
  persistenceDays: {
    type: Number,
    default: 1
  },
  isPersistent: {
    type: Boolean,
    default: false
  },

  // Industrial Baseline & Anomaly
  baselineStatus: {
    type: String,
    enum: ['NORMAL', 'ELEVATED', 'ANOMALOUS', 'SEVERE_ANOMALY', 'NO_BASELINE'],
    default: 'NO_BASELINE'
  },
  baselineFRPDelta: {
    type: Number, // Percentage above baseline FRP, e.g. +145%
    default: 0
  },

  // AI Classification Engine Output
  classification: {
    type: String,
    enum: [
      'INDUSTRIAL FIRE',
      'PERSISTENT THERMAL SOURCE',
      'NATURAL / WILDFIRE',
      'AGRICULTURAL BURNING',
      'ROUTINE INDUSTRIAL HEAT',
      'UNCERTAIN ANOMALY'
    ],
    default: 'UNCERTAIN ANOMALY'
  },
  classificationConfidence: {
    type: Number, // 0 to 100 percentage
    default: 50
  },

  // Risk Prioritization Engine (0 to 100)
  riskScore: {
    type: Number, // 0 to 100
    required: true,
    default: 10,
    index: true
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW',
    index: true
  },
  riskBreakdown: {
    thermalScore: { type: Number, default: 0 },
    persistenceScore: { type: Number, default: 0 },
    industrialScore: { type: Number, default: 0 },
    recurrenceScore: { type: Number, default: 0 },
    populationScore: { type: Number, default: 0 }
  },

  // Explainable AI Evidence
  explanation: {
    summary: { type: String, default: '' },
    evidence: [{ type: String }],
    recommendation: { type: String, default: '' }
  },

  // Copernicus Sentinel-2 Satellite Verification
  satelliteVerification: {
    status: {
      type: String,
      enum: ['VERIFIED_ANOMALY', 'NO_SWIR_ANOMALY', 'CLOUD_OBSCURED', 'PENDING', 'UNAVAILABLE'],
      default: 'UNAVAILABLE'
    },
    message: { type: String, default: 'Satellite verification pending or unavailable' },
    satelliteName: { type: String, default: 'Sentinel-2A/B L2A' },
    acquisitionDate: { type: String, default: null },
    cloudCoverPercentage: { type: Number, default: null },
    swirAnomalyDetected: { type: Boolean, default: false },
    swirReflectanceB12: { type: Number, default: null }, // Band 12 (2.2 um)
    swirReflectanceB11: { type: Number, default: null }, // Band 11 (1.6 um)
    thumbnailUrl: { type: String, default: null },
    falseColorSwirUrl: { type: String, default: null }
  },

  status: {
    type: String,
    enum: ['ACTIVE', 'INVESTIGATING', 'CONTAINED', 'RESOLVED', 'FALSE_POSITIVE'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
});

// Critical 2dsphere index for geospatial queries
ThermalEventSchema.index({ geometry: '2dsphere' });
ThermalEventSchema.index({ riskLevel: 1, classification: 1 });
ThermalEventSchema.index({ timestamp: -1 });
ThermalEventSchema.index({ facilityId: 1 });

module.exports = mongoose.model('ThermalEvent', ThermalEventSchema);

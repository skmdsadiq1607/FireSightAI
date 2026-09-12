const mongoose = require('mongoose');

const FacilitySchema = new mongoose.Schema({
  osmId: {
    type: String,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  facilityType: {
    type: String,
    required: true,
    enum: [
      'petrochemical_refinery',
      'power_plant',
      'steel_metallurgy',
      'chemical_manufacturing',
      'industrial_estate',
      'manufacturing_assembly',
      'storage_terminal',
      'other'
    ],
    default: 'industrial_estate'
  },
  criticalityLevel: {
    type: String,
    enum: ['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW'],
    default: 'MEDIUM'
  },
  location: {
    city: { type: String, default: '' },
    district: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' }
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point', 'Polygon'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  // Centroid point for quick distance computation
  centroid: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number] // [lon, lat]
  },
  boundaryRadiusMeters: {
    type: Number,
    default: 1500 // Approximate boundary radius if polygon unavailable
  },
  // Historical thermal baseline (for anomaly detection)
  baselineThermal: {
    hasKnownThermalSources: { type: Boolean, default: false }, // e.g. continuous flare or blast furnace
    sourceType: { type: String, default: 'none' }, // 'flare_stack', 'coke_oven', 'smelter', 'none'
    meanFRP: { type: Number, default: 0 },
    stdDevFRP: { type: Number, default: 0 },
    maxObservedFRP: { type: Number, default: 0 },
    sampleCount: { type: Number, default: 0 },
    baselineConfidence: { type: String, enum: ['HIGH', 'MODERATE', 'LOW', 'NONE'], default: 'NONE' }
  },
  osmTags: {
    type: Map,
    of: String,
    default: {}
  },
  contact: {
    authority: { type: String, default: 'State Pollution Control Board / District Disaster Cell' },
    emergencyPhone: { type: String, default: '+91-112' }
  },
  activeEventsCount: {
    type: Number,
    default: 0
  },
  highestActiveRisk: {
    type: String,
    enum: ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'NONE'
  },
  provenance: {
    type: String,
    default: 'OpenStreetMap (Overpass) + Industrial Register'
  }
}, {
  timestamps: true
});

FacilitySchema.index({ geometry: '2dsphere' });
FacilitySchema.index({ centroid: '2dsphere' });
FacilitySchema.index({ facilityType: 1, criticalityLevel: 1 });

module.exports = mongoose.model('Facility', FacilitySchema);

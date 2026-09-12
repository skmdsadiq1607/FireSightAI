const mongoose = require('mongoose');

const PersistenceClusterSchema = new mongoose.Schema({
  clusterId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    default: null
  },
  facilityName: {
    type: String,
    default: null
  },
  centroid: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number] // [lon, lat]
  },
  radiusMeters: {
    type: Number,
    default: 1000 // Spatio-temporal clustering radius
  },
  firstDetected: {
    type: Date,
    required: true
  },
  lastDetected: {
    type: Date,
    required: true
  },
  totalDetections: {
    type: Number,
    default: 1
  },
  uniqueDays: {
    type: Number,
    default: 1
  },
  persistenceDays: {
    type: Number,
    default: 1
  },
  maxFRP: {
    type: Number,
    default: 0
  },
  meanFRP: {
    type: Number,
    default: 0
  },
  persistenceScore: {
    type: Number, // 0 to 100
    default: 0
  },
  classification: {
    type: String,
    enum: [
      'PERSISTENT INDUSTRIAL SOURCE',
      'CONTINUOUS FLARE STACK',
      'ACTIVE INDUSTRIAL BLAZE',
      'RECURRING AGRICULTURAL',
      'TRANSIENT EVENT'
    ],
    default: 'TRANSIENT EVENT'
  },
  eventIds: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['ACTIVE', 'DORMANT', 'RESOLVED'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
});

PersistenceClusterSchema.index({ centroid: '2dsphere' });
PersistenceClusterSchema.index({ status: 1 });

module.exports = mongoose.model('PersistenceCluster', PersistenceClusterSchema);

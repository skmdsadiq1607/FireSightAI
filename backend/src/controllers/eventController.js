const ThermalEvent = require('../models/ThermalEvent');
const Facility = require('../models/Facility');
const PersistenceCluster = require('../models/PersistenceCluster');
const RiskEngine = require('../services/RiskEngine');
const AIServiceClient = require('../services/AIServiceClient');
const { LiveSentinelProvider, DemoSatelliteProvider } = require('../services/dataProviders/SatelliteProvider');

exports.getEvents = async (req, res) => {
  try {
    const {
      classification,
      riskLevel,
      minRisk,
      satellite,
      facilityType,
      isPersistent,
      search,
      state,
      startDate,
      endDate,
      limit = 100,
      skip = 0
    } = req.query;

    const query = {};

    if (classification && classification !== 'ALL') {
      query.classification = classification;
    }

    if (riskLevel && riskLevel !== 'ALL') {
      query.riskLevel = riskLevel;
    }

    if (minRisk) {
      query.riskScore = { $gte: parseInt(minRisk, 10) };
    }

    if (satellite && satellite !== 'ALL') {
      query.satellite = satellite;
    }

    if (facilityType && facilityType !== 'ALL') {
      query.facilityType = facilityType;
    }

    if (isPersistent === 'true') {
      query.isPersistent = true;
    }

    if (state) {
      query.state = new RegExp(state, 'i');
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { eventId: searchRegex },
        { facilityName: searchRegex },
        { nearestCity: searchRegex },
        { state: searchRegex }
      ];
    }

    const total = await ThermalEvent.countDocuments(query);
    const events = await ThermalEvent.find(query)
      .sort({ riskScore: -1, timestamp: -1 })
      .skip(parseInt(skip, 10))
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      total,
      count: events.length,
      data: events
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await ThermalEvent.findOne({ eventId: req.params.id })
      .populate('facilityId');

    if (!event) {
      return res.status(404).json({ success: false, error: 'Thermal event not found' });
    }

    // Also fetch associated persistence cluster if any
    let cluster = null;
    if (event.persistenceClusterId) {
      cluster = await PersistenceCluster.findOne({ clusterId: event.persistenceClusterId });
    }

    res.json({
      success: true,
      data: {
        ...event.toObject(),
        cluster
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getHighRiskEvents = async (req, res) => {
  try {
    const events = await ThermalEvent.find({ riskScore: { $gte: 61 } })
      .sort({ riskScore: -1 })
      .limit(20);

    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getPersistentEvents = async (req, res) => {
  try {
    const events = await ThermalEvent.find({ isPersistent: true })
      .sort({ persistenceDays: -1, riskScore: -1 })
      .limit(30);

    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.analyzeEvent = async (req, res) => {
  try {
    const event = await ThermalEvent.findOne({ eventId: req.params.id });
    if (!event) {
      return res.status(404).json({ success: false, error: 'Thermal event not found' });
    }

    const facility = event.facilityId ? await Facility.findById(event.facilityId) : null;

    const features = {
      eventId: event.eventId,
      latitude: event.latitude,
      longitude: event.longitude,
      frp: event.frp,
      brightnessTemperature: event.brightnessTemperature,
      insideIndustrialBoundary: event.insideIndustrialBoundary,
      facilityDistance: event.facilityDistance,
      facilityType: event.facilityType,
      criticalityLevel: facility?.criticalityLevel || 'MEDIUM',
      persistenceDays: event.persistenceDays,
      persistenceCount: event.persistenceCount,
      baselineThermal: facility?.baselineThermal
    };

    const aiOutput = await AIServiceClient.classifyThermalEvent(features);
    const riskResult = RiskEngine.calculateRisk({
      ...features,
      facilityName: event.facilityName,
      classification: aiOutput.classification
    });

    event.classification = aiOutput.classification;
    event.classificationConfidence = aiOutput.classificationConfidence;
    event.riskScore = riskResult.riskScore;
    event.riskLevel = riskResult.riskLevel;
    event.riskBreakdown = riskResult.riskBreakdown;
    event.explanation = {
      summary: `${aiOutput.classification} verified with ${aiOutput.classificationConfidence}% confidence.`,
      evidence: Array.from(new Set([...(aiOutput.evidence || []), ...(riskResult.evidence || [])])),
      recommendation: riskResult.riskLevel === 'CRITICAL' ? 'Immediate industrial dispatch required' : 'Routine monitoring'
    };

    await event.save();

    res.json({
      success: true,
      data: event
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSatelliteContext = async (req, res) => {
  try {
    const event = await ThermalEvent.findOne({ eventId: req.params.id });
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const provider = process.env.DATA_MODE === 'live' && process.env.COPERNICUS_CLIENT_ID
      ? new LiveSentinelProvider(process.env.COPERNICUS_CLIENT_ID, process.env.COPERNICUS_CLIENT_SECRET)
      : new DemoSatelliteProvider();

    const verification = await provider.getVerificationContext(
      event.latitude,
      event.longitude,
      event.acquisitionDate,
      { eventId: event.eventId }
    );

    event.satelliteVerification = verification;
    await event.save();

    res.json({ success: true, data: verification });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getEventHistory = async (req, res) => {
  try {
    const event = await ThermalEvent.findOne({ eventId: req.params.id });
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

    // Generate multi-day temporal sequence
    const history = [];
    const baseFRP = event.frp;
    const days = Math.max(event.persistenceDays || 1, 4);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(event.timestamp.getTime() - i * 24 * 3600 * 1000);
      const dayVariance = 1 + (Math.sin(i * 1.5) * 0.25);
      const curFrp = Number((baseFRP * (i === 0 ? 1 : dayVariance)).toFixed(1));
      const curBright = Number((event.brightnessTemperature - (i * 2.5)).toFixed(1));

      history.push({
        day: `Day -${i}`,
        date: d.toISOString().split('T')[0],
        frp: curFrp,
        brightness: curBright,
        satellite: i % 2 === 0 ? 'NOAA-20' : 'NOAA-21',
        detections: Math.max(1, Math.round(event.persistenceCount / days))
      });
    }

    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getGroqDirective = async (req, res) => {
  try {
    const event = await ThermalEvent.findOne({ eventId: req.params.id });
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

    const GroqBriefingService = require('../services/GroqBriefingService');
    const directive = await GroqBriefingService.generateIncidentDirective(event);

    res.json({ success: true, data: directive });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

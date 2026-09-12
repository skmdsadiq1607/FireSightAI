const ThermalEvent = require('../models/ThermalEvent');
const Facility = require('../models/Facility');
const PersistenceCluster = require('../models/PersistenceCluster');

exports.getOverviewStats = async (req, res) => {
  try {
    const totalEvents = await ThermalEvent.countDocuments();
    const industrialEvents = await ThermalEvent.countDocuments({
      $or: [
        { classification: 'INDUSTRIAL FIRE' },
        { classification: 'PERSISTENT THERMAL SOURCE' },
        { classification: 'ROUTINE INDUSTRIAL HEAT' },
        { insideIndustrialBoundary: true }
      ]
    });
    const persistentCount = await ThermalEvent.countDocuments({ isPersistent: true });
    const highCriticalRisk = await ThermalEvent.countDocuments({ riskScore: { $gte: 61 } });
    const facilitiesMonitored = await Facility.countDocuments();
    const activeClusters = await PersistenceCluster.countDocuments({ status: 'ACTIVE' });

    res.json({
      success: true,
      data: {
        activeThermalEvents: totalEvents,
        industrialEvents,
        persistentSources: persistentCount,
        highCriticalRisk,
        facilitiesMonitored,
        activeClusters
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getClassificationBreakdown = async (req, res) => {
  try {
    const breakdown = await ThermalEvent.aggregate([
      { $group: { _id: '$classification', count: { $sum: 1 }, avgFRP: { $avg: '$frp' } } }
    ]);

    const formatted = breakdown.map(item => ({
      name: item._id || 'UNCERTAIN',
      count: item.count,
      avgFRP: Number(item.avgFRP.toFixed(1))
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRiskDistribution = async (req, res) => {
  try {
    const low = await ThermalEvent.countDocuments({ riskLevel: 'LOW' });
    const medium = await ThermalEvent.countDocuments({ riskLevel: 'MEDIUM' });
    const high = await ThermalEvent.countDocuments({ riskLevel: 'HIGH' });
    const critical = await ThermalEvent.countDocuments({ riskLevel: 'CRITICAL' });

    res.json({
      success: true,
      data: [
        { name: 'Low (0-30)', count: low, fill: '#10b981' },
        { name: 'Medium (31-60)', count: medium, fill: '#f59e0b' },
        { name: 'High (61-80)', count: high, fill: '#f97316' },
        { name: 'Critical (81-100)', count: critical, fill: '#ef4444' }
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTimeline = async (req, res) => {
  try {
    // Return chronological counts
    const events = await ThermalEvent.find().sort({ timestamp: 1 });
    const dailyMap = {};

    events.forEach(e => {
      const date = e.acquisitionDate || '2026-09-12';
      if (!dailyMap[date]) {
        dailyMap[date] = {
          date,
          industrialFire: 0,
          persistentSource: 0,
          wildfire: 0,
          agricultural: 0,
          routine: 0,
          total: 0
        };
      }
      dailyMap[date].total += 1;
      if (e.classification === 'INDUSTRIAL FIRE') dailyMap[date].industrialFire += 1;
      else if (e.classification === 'PERSISTENT THERMAL SOURCE') dailyMap[date].persistentSource += 1;
      else if (e.classification === 'NATURAL / WILDFIRE') dailyMap[date].wildfire += 1;
      else if (e.classification === 'AGRICULTURAL BURNING') dailyMap[date].agricultural += 1;
      else if (e.classification === 'ROUTINE INDUSTRIAL HEAT') dailyMap[date].routine += 1;
    });

    const timelineData = Object.values(dailyMap);
    res.json({ success: true, data: timelineData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTopFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find()
      .sort({ activeEventsCount: -1 })
      .limit(6);

    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

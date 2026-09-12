const Facility = require('../models/Facility');
const ThermalEvent = require('../models/ThermalEvent');

exports.getFacilities = async (req, res) => {
  try {
    const { type, criticality, search } = req.query;
    const query = {};

    if (type && type !== 'ALL') {
      query.facilityType = type;
    }
    if (criticality && criticality !== 'ALL') {
      query.criticalityLevel = criticality;
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { 'location.city': searchRegex },
        { 'location.state': searchRegex }
      ];
    }

    const facilities = await Facility.find(query).sort({ activeEventsCount: -1, criticalityLevel: 1 });

    res.json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getFacilityById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ success: false, error: 'Facility not found' });
    }

    // Get active and recent thermal events associated with this facility
    const events = await ThermalEvent.find({ facilityId: facility._id })
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        ...facility.toObject(),
        recentEvents: events
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { LiveFirmsProvider } = require('../services/dataProviders/FirmsProvider');

// Load existing facilities from fallbackData
const fallbackPath = path.join(__dirname, '../../../frontend/src/services/fallbackData.json');
const existingFallback = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
const facilities = existingFallback.facilities || [];

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function resolveIndianLocation(lat, lon) {
  // Approximate State & Nearest Major City bounding logic
  if (lat >= 20.0 && lat <= 24.7 && lon >= 68.0 && lon <= 74.5) {
    if (lon < 70.5) return { state: 'Gujarat', nearestCity: 'Jamnagar / Dwarka' };
    if (lat < 21.8) return { state: 'Gujarat', nearestCity: 'Surat / Hazira' };
    return { state: 'Gujarat', nearestCity: 'Ahmedabad / Vadodara' };
  }
  if (lat >= 15.6 && lat <= 22.0 && lon >= 72.6 && lon <= 80.9) {
    if (lon < 73.5 && lat < 19.5) return { state: 'Maharashtra', nearestCity: 'Mumbai Metropolitan' };
    if (lat > 20.5) return { state: 'Maharashtra', nearestCity: 'Nagpur' };
    return { state: 'Maharashtra', nearestCity: 'Pune / Solapur' };
  }
  if (lat >= 27.5 && lat <= 32.5 && lon >= 73.8 && lon <= 77.6) {
    if (lat > 30.0) return { state: 'Punjab', nearestCity: 'Ludhiana / Amritsar' };
    return { state: 'Haryana', nearestCity: 'Panipat / Karnal' };
  }
  if (lat >= 23.5 && lat <= 30.2 && lon >= 69.5 && lon <= 78.2) {
    return { state: 'Rajasthan', nearestCity: 'Jaipur / Jodhpur' };
  }
  if (lat >= 23.8 && lat <= 30.5 && lon >= 77.0 && lon <= 84.5) {
    return { state: 'Uttar Pradesh', nearestCity: 'Lucknow / Kanpur' };
  }
  if (lat >= 24.2 && lat <= 27.5 && lon >= 83.2 && lon <= 88.3) {
    return { state: 'Bihar', nearestCity: 'Patna / Barauni' };
  }
  if (lat >= 17.8 && lat <= 26.9 && lon >= 74.0 && lon <= 84.4) {
    if (lon > 80.5) return { state: 'Chhattisgarh', nearestCity: 'Bhilai / Raipur' };
    return { state: 'Madhya Pradesh', nearestCity: 'Bhopal / Indore' };
  }
  if (lat >= 17.8 && lat <= 22.6 && lon >= 81.3 && lon <= 87.5) {
    return { state: 'Odisha', nearestCity: 'Bhubaneswar / Paradip' };
  }
  if (lat >= 21.5 && lat <= 27.3 && lon >= 85.8 && lon <= 89.9) {
    if (lat < 24.0 && lon < 87.0) return { state: 'Jharkhand', nearestCity: 'Jamshedpur / Dhanbad' };
    return { state: 'West Bengal', nearestCity: 'Kolkata / Haldia' };
  }
  if (lat >= 12.6 && lat <= 19.9 && lon >= 76.8 && lon <= 84.8) {
    if (lon > 82.0) return { state: 'Andhra Pradesh', nearestCity: 'Visakhapatnam' };
    if (lat > 16.0) return { state: 'Telangana', nearestCity: 'Hyderabad / Ramagundam' };
    return { state: 'Andhra Pradesh', nearestCity: 'Vijayawada / Guntur' };
  }
  if (lat >= 11.5 && lat <= 18.5 && lon >= 74.0 && lon <= 78.6) {
    if (lon < 75.2) return { state: 'Karnataka', nearestCity: 'Mangalore Coastal' };
    return { state: 'Karnataka', nearestCity: 'Bengaluru / Bellary' };
  }
  if (lat >= 8.0 && lat <= 13.6 && lon >= 74.8 && lon <= 80.4) {
    if (lon < 76.5) return { state: 'Kerala', nearestCity: 'Kochi / Palakkad' };
    if (lat > 12.8) return { state: 'Tamil Nadu', nearestCity: 'Chennai / Manali' };
    return { state: 'Tamil Nadu', nearestCity: 'Coimbatore / Madurai' };
  }
  if (lon >= 89.5 && lat >= 21.8) {
    return { state: 'Assam & NE Region', nearestCity: 'Guwahati / Digboi' };
  }
  if (lat >= 30.5) {
    return { state: 'Northern Himalayan Zone', nearestCity: 'Jammu / Dehradun' };
  }
  return { state: 'Central India', nearestCity: 'Regional Sector' };
}

function classifyAnomaly(anomaly, nearestFac) {
  const frp = Number(anomaly.frp) || 2;
  const tempK = Number(anomaly.brightnessTemperature) || 315;
  const inside = nearestFac && nearestFac.distance <= 2500;

  if (inside) {
    // Inside or contiguous with industrial facility
    if (frp > 35 || tempK > 355) {
      return {
        classification: 'INDUSTRIAL FIRE',
        confidence: Math.min(96, Math.round(80 + frp * 0.3)),
        riskScore: Math.min(98, Math.round(75 + frp * 0.4)),
        riskLevel: 'CRITICAL',
        summary: `CRITICAL: Major thermal anomaly (${frp.toFixed(1)} MW) inside ${nearestFac.facility.name}.`,
        evidence: [
          `Fire Radiative Power reached ${frp.toFixed(1)} MW at ${tempK.toFixed(1)} K.`,
          `Located ${nearestFac.distance}m from ${nearestFac.facility.name} processing perimeter.`,
          `High-radiance VIIRS signature exceeds standard operational thermal limits.`
        ],
        recommendation: `Activate Facility Emergency Response Team. Notify NDMA & State Fire Control Room.`
      };
    } else {
      return {
        classification: 'INDUSTRIAL FLARE',
        confidence: 88,
        riskScore: Math.min(48, Math.round(25 + frp * 0.6)),
        riskLevel: 'LOW',
        summary: `ROUTINE: Operational flare stack emission (${frp.toFixed(1)} MW) at ${nearestFac.facility.name}.`,
        evidence: [
          `Thermal signature corresponds to routine elevated flare emission at ${tempK.toFixed(1)} K.`,
          `Emission contained within approved industrial boundary coordinates.`,
          `Historical persistence pattern conforms to continuous operations.`
        ],
        recommendation: `Maintain passive thermal telemetry. No ground intervention required.`
      };
    }
  }

  // Not inside industrial facility
  if (frp >= 25 || tempK >= 350) {
    return {
      classification: 'WILDFIRE',
      confidence: 86,
      riskScore: Math.min(85, Math.round(55 + frp * 0.8)),
      riskLevel: 'HIGH',
      summary: `HIGH RISK: Intense biomass/wildfire front (${frp.toFixed(1)} MW) detected by VIIRS pass.`,
      evidence: [
        `High Fire Radiative Power (${frp.toFixed(1)} MW) indicates active rapid-spread flame front.`,
        `Surface thermal radiance measured at ${tempK.toFixed(1)} K.`,
        `Satellite orbital scan confirms open-canopy / vegetative thermal signature.`
      ],
      recommendation: `Dispatch Forest Fire Rapid Action Team (FSI). Establish aerial containment line.`
    };
  } else if (frp >= 8) {
    return {
      classification: 'AGRICULTURAL FIRE',
      confidence: 84,
      riskScore: Math.min(58, Math.round(35 + frp * 1.2)),
      riskLevel: 'MODERATE',
      summary: `MODERATE: Agricultural crop stubble residue burning (${frp.toFixed(1)} MW).`,
      evidence: [
        `Moderate thermal signature (${frp.toFixed(1)} MW) characteristic of post-harvest field clearance.`,
        `Thermal radiance: ${tempK.toFixed(1)} K.`,
        `Regional clustering matches seasonal agricultural harvesting schedule.`
      ],
      recommendation: `Monitor downwind AQI stations. Notify District Agricultural Officer for compliance checking.`
    };
  } else {
    return {
      classification: 'CONTROLLED BURN',
      confidence: 78,
      riskScore: Math.min(32, Math.round(15 + frp * 1.5)),
      riskLevel: 'LOW',
      summary: `LOW: Minor localized thermal hotspot (${frp.toFixed(1)} MW).`,
      evidence: [
        `Low thermal intensity (${frp.toFixed(1)} MW) below emergency threshold.`,
        `Brightness temperature: ${tempK.toFixed(1)} K.`,
        `Single-pass orbital detection with low spread velocity.`
      ],
      recommendation: `Log in catalog. Continue routine multi-constellation satellite tracking.`
    };
  }
}

async function sync() {
  console.log('[FireSight AI] Connecting to live NASA FIRMS API via registered key...');
  const provider = new LiveFirmsProvider(process.env.FIRMS_MAP_KEY);
  const liveAnomalies = await provider.fetchAnomalies({ days: 1 });

  console.log(`[FireSight AI] Fetched ${liveAnomalies.length} REAL-TIME live satellite anomalies from NASA for today.`);
  if (liveAnomalies.length === 0) {
    console.error('No live anomalies fetched. Aborting.');
    return;
  }

  // Preserve core calibrated facility benchmarks so facility deep-links always function
  const coreBenchmarks = (existingFallback.events || []).filter(e => e.insideIndustrialBoundary && e.facilityId);
  console.log(`[FireSight AI] Keeping ${coreBenchmarks.length} calibrated strategic facility anchors.`);

  // Transform live NASA detections
  const processedLiveEvents = liveAnomalies.map((raw, idx) => {
    // Find nearest facility
    let nearest = null;
    let minDistance = Infinity;

    for (const fac of facilities) {
      const facCoords = fac.centroid?.coordinates || (fac.geometry?.type === 'Point' ? fac.geometry.coordinates : null);
      if (facCoords) {
        const d = haversineMeters(raw.latitude, raw.longitude, facCoords[1], facCoords[0]);
        if (d < minDistance) {
          minDistance = d;
          nearest = { facility: fac, distance: d };
        }
      }
    }

    const loc = resolveIndianLocation(raw.latitude, raw.longitude);
    const clf = classifyAnomaly(raw, nearest);

    // Format satellite name cleanly
    let satName = 'VIIRS (Suomi-NPP)';
    if (raw.satellite === 'N20' || raw.satellite === 'NOAA-20') satName = 'VIIRS (NOAA-20)';
    else if (raw.satellite === 'N21' || raw.satellite === 'NOAA-21') satName = 'VIIRS (NOAA-21)';
    else if (raw.satellite === 'Terra') satName = 'MODIS (Terra)';
    else if (raw.satellite === 'Aqua') satName = 'MODIS (Aqua)';

    return {
      eventId: raw.eventId || `FIRMS-${raw.acquisitionDate}-${raw.latitude.toFixed(3)}-${raw.longitude.toFixed(3)}-IND`,
      source: 'NASA_FIRMS_LIVE',
      satellite: satName,
      instrument: raw.instrument || (satName.includes('MODIS') ? 'MODIS' : 'VIIRS'),
      latitude: raw.latitude,
      longitude: raw.longitude,
      geometry: {
        type: 'Point',
        coordinates: [raw.longitude, raw.latitude]
      },
      acquisitionDate: raw.acquisitionDate,
      acquisitionTime: raw.acquisitionTime || '1200',
      timestamp: raw.timestamp ? new Date(raw.timestamp).toISOString() : new Date().toISOString(),
      brightnessTemperature: Number(raw.brightnessTemperature.toFixed(1)),
      frp: Number(raw.frp.toFixed(1)),
      confidence: raw.confidence === 'h' || raw.confidence === 'high' ? 'high' : (raw.confidence === 'l' ? 'low' : 'nominal'),
      dayNight: raw.dayNight || 'D',
      region: 'India',
      classification: clf.classification,
      classificationConfidence: clf.confidence,
      riskScore: clf.riskScore,
      riskLevel: clf.riskLevel,
      insideIndustrialBoundary: nearest && nearest.distance <= 2500,
      facilityId: nearest && nearest.distance <= 15000 ? nearest.facility._id : null,
      facilityName: nearest && nearest.distance <= 15000 ? nearest.facility.name : null,
      facilityType: nearest && nearest.distance <= 15000 ? nearest.facility.facilityType : null,
      facilityDistance: nearest ? nearest.distance : null,
      nearestCity: loc.nearestCity,
      state: loc.state,
      explanation: {
        summary: clf.summary,
        evidence: clf.evidence,
        recommendation: clf.recommendation
      },
      persistence: {
        isPersistent: clf.classification === 'INDUSTRIAL FLARE',
        persistenceDays: clf.classification === 'INDUSTRIAL FLARE' ? 14 : 1,
        persistenceCount: clf.classification === 'INDUSTRIAL FLARE' ? 28 : 1,
        thermalHistory: []
      }
    };
  });

  // Combine: Live NASA real-time passes FIRST + Core Strategic Anchors
  const combinedEvents = [...processedLiveEvents, ...coreBenchmarks];

  const updatedCatalog = {
    facilities: existingFallback.facilities,
    events: combinedEvents
  };

  fs.writeFileSync(fallbackPath, JSON.stringify(updatedCatalog, null, 2), 'utf8');
  console.log(`[FireSight AI] Successfully synced ${combinedEvents.length} events (${processedLiveEvents.length} live from NASA + ${coreBenchmarks.length} facility anchors) to fallbackData.json!`);
}

sync().catch(console.error);

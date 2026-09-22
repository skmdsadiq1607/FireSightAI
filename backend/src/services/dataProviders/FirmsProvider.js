const axios = require('axios');

/**
 * NASA FIRMS Data Provider Interface & Implementations
 * Supports VIIRS (NOAA-20, NOAA-21, Suomi-NPP) and MODIS feeds.
 */
class FirmsProvider {
  /**
   * Abstract contract
   * @param {Object} options { region, date, minFRP }
   * @returns {Promise<Array>} Normalized thermal event records
   */
  async fetchAnomalies(options = {}) {
    throw new Error('fetchAnomalies must be implemented by subclass');
  }
}

class LiveFirmsProvider extends FirmsProvider {
  constructor(apiKey, regionBbox = '68.1,6.5,97.4,37.1') {
    super();
    this.apiKey = apiKey;
    this.regionBbox = regionBbox; // minLon,minLat,maxLon,maxLat (India approx)
    this.baseUrl = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';
  }

  async fetchSingleSource(source, days) {
    const url = `${this.baseUrl}/${this.apiKey}/${source}/${this.regionBbox}/${days}`;
    let attempts = 0;
    const maxAttempts = 3;
    let delay = 1000;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`[NASA FIRMS] Querying live thermal feed (attempt ${attempts}/${maxAttempts}): ${source}`);
        const response = await axios.get(url, {
          timeout: 15000,
          headers: { 'User-Agent': 'FireSightAI/1.0 (Disaster-Management-SIH2026)' }
        });

        if (typeof response.data === 'string' && response.data.includes('Invalid MAP_KEY')) {
          throw new Error('NASA FIRMS reports: Invalid MAP_KEY. Fall back to demo provider.');
        }

        return this.parseCsv(response.data, source);
      } catch (err) {
        console.warn(`[NASA FIRMS] Attempt ${attempts} for ${source} failed: ${err.message}`);
        if (attempts >= maxAttempts) return [];
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
      }
    }
    return [];
  }

  async fetchAnomalies(options = {}) {
    if (!this.apiKey || this.apiKey === 'demo_firms_key' || this.apiKey.startsWith('YOUR_')) {
      throw new Error('Valid FIRMS_MAP_KEY required for LiveFirmsProvider');
    }

    const days = options.days || 1;
    if (options.source && options.source !== 'ALL') {
      return this.fetchSingleSource(options.source, days);
    }

    // Default: Query all 4 active NASA satellite constellations across India
    const sources = ['VIIRS_SNPP_NRT', 'VIIRS_NOAA20_NRT', 'VIIRS_NOAA21_NRT', 'MODIS_NRT'];
    console.log(`[NASA FIRMS] Initiating multi-satellite constellation sweep (${sources.length} sources)...`);
    const results = await Promise.all(sources.map(s => this.fetchSingleSource(s, days)));
    const merged = results.flat();

    // Deduplicate by eventId
    const seen = new Set();
    const deduped = [];
    for (const event of merged) {
      if (!seen.has(event.eventId)) {
        seen.add(event.eventId);
        deduped.push(event);
      }
    }
    console.log(`[NASA FIRMS] Multi-satellite sweep complete: ${deduped.length} unique live thermal hotspots detected.`);
    return deduped;
  }

  parseCsv(csvData, sourceName) {
    if (!csvData || typeof csvData !== 'string') return [];
    const lines = csvData.trim().split('\n');
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const latIdx = headers.indexOf('latitude');
    const lonIdx = headers.indexOf('longitude');
    const brightIdx = headers.indexOf('bright_ti4') !== -1 ? headers.indexOf('bright_ti4') : headers.indexOf('brightness');
    const frpIdx = headers.indexOf('frp');
    const dateIdx = headers.indexOf('acq_date');
    const timeIdx = headers.indexOf('acq_time');
    const satIdx = headers.indexOf('satellite');
    const confIdx = headers.indexOf('confidence');
    const dnIdx = headers.indexOf('daynight');
    const scanIdx = headers.indexOf('scan');
    const trackIdx = headers.indexOf('track');

    const results = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(c => c.trim());
      if (row.length < 5) continue;

      const lat = parseFloat(row[latIdx]);
      const lon = parseFloat(row[lonIdx]);
      if (isNaN(lat) || isNaN(lon)) continue;

      const frp = frpIdx !== -1 ? parseFloat(row[frpIdx]) || 0 : 0;
      const bright = brightIdx !== -1 ? parseFloat(row[brightIdx]) || 300 : 300;
      const acqDate = dateIdx !== -1 ? row[dateIdx] : new Date().toISOString().split('T')[0];
      const acqTime = timeIdx !== -1 ? row[timeIdx].padStart(4, '0') : '1200';

      const hours = parseInt(acqTime.substring(0, 2), 10) || 0;
      const minutes = parseInt(acqTime.substring(2, 4), 10) || 0;
      const timestamp = new Date(`${acqDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00Z`);

      results.push({
        eventId: `FIRMS-${acqDate.replace(/-/g, '')}-${lat.toFixed(3)}-${lon.toFixed(3)}`,
        source: 'NASA_FIRMS_LIVE',
        satellite: satIdx !== -1 && row[satIdx] ? row[satIdx] : 'NOAA-20',
        instrument: sourceName.includes('MODIS') ? 'MODIS' : 'VIIRS',
        latitude: lat,
        longitude: lon,
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        acquisitionDate: acqDate,
        acquisitionTime: acqTime,
        timestamp,
        brightnessTemperature: bright,
        frp,
        confidence: confIdx !== -1 ? row[confIdx] : 'nominal',
        dayNight: dnIdx !== -1 ? row[dnIdx] : 'D',
        scan: scanIdx !== -1 ? parseFloat(row[scanIdx]) || 0.4 : 0.4,
        track: trackIdx !== -1 ? parseFloat(row[trackIdx]) || 0.4 : 0.4
      });
    }

    return results;
  }
}

class DemoFirmsProvider extends FirmsProvider {
  constructor() {
    super();
  }

  async fetchAnomalies(options = {}) {
    // Returns realistic simulated thermal anomalies representing diverse scenarios in India
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const generateTimestamp = (daysAgo, hour, minute) => {
      const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      d.setUTCHours(hour, minute, 0, 0);
      return d;
    };

    return [
      // CASE A: High-Confidence Industrial Fire (Hazira Petrochemical Storage Terminal, Gujarat)
      {
        eventId: 'FSA-2026-IND-001',
        source: 'NASA_FIRMS_DEMO',
        satellite: 'NOAA-20',
        instrument: 'VIIRS',
        latitude: 21.108,
        longitude: 72.645,
        geometry: { type: 'Point', coordinates: [72.645, 21.108] },
        acquisitionDate: todayStr,
        acquisitionTime: '0830',
        timestamp: generateTimestamp(0, 8, 30),
        brightnessTemperature: 374.8,
        frp: 84.6, // Very high heat signature
        confidence: 'high',
        dayNight: 'D',
        scan: 0.38,
        track: 0.37
      },
      // CASE B: Persistent Thermal Source (Jamnagar Petroleum Refinery Flare, Gujarat)
      {
        eventId: 'FSA-2026-IND-002',
        source: 'NASA_FIRMS_DEMO',
        satellite: 'NOAA-21',
        instrument: 'VIIRS',
        latitude: 22.361,
        longitude: 69.865,
        geometry: { type: 'Point', coordinates: [69.865, 22.361] },
        acquisitionDate: todayStr,
        acquisitionTime: '0715',
        timestamp: generateTimestamp(0, 7, 15),
        brightnessTemperature: 338.2,
        frp: 28.4,
        confidence: 'nominal',
        dayNight: 'D',
        scan: 0.42,
        track: 0.40,
        persistenceDays: 6,
        persistenceCount: 11
      },
      // CASE C: Natural Wildfire in Remote Forest (Jim Corbett National Park, Uttarakhand)
      {
        eventId: 'FSA-2026-NAT-003',
        source: 'NASA_FIRMS_DEMO',
        satellite: 'Suomi-NPP',
        instrument: 'VIIRS',
        latitude: 29.531,
        longitude: 78.775,
        geometry: { type: 'Point', coordinates: [78.775, 29.531] },
        acquisitionDate: todayStr,
        acquisitionTime: '0940',
        timestamp: generateTimestamp(0, 9, 40),
        brightnessTemperature: 326.5,
        frp: 18.2,
        confidence: 'nominal',
        dayNight: 'D',
        scan: 0.45,
        track: 0.43
      },
      // CASE D: Seasonal Agricultural Stubble Burning (Sangrur District, Punjab)
      {
        eventId: 'FSA-2026-AGR-004',
        source: 'NASA_FIRMS_DEMO',
        satellite: 'NOAA-20',
        instrument: 'VIIRS',
        latitude: 30.245,
        longitude: 75.834,
        geometry: { type: 'Point', coordinates: [75.834, 30.245] },
        acquisitionDate: todayStr,
        acquisitionTime: '0810',
        timestamp: generateTimestamp(0, 8, 10),
        brightnessTemperature: 322.1,
        frp: 12.8,
        confidence: 'nominal',
        dayNight: 'D',
        scan: 0.39,
        track: 0.38
      },
      // CASE E: Routine Blast Furnace Operations (Bhilai Steel Plant, Chhattisgarh)
      {
        eventId: 'FSA-2026-IND-005',
        source: 'NASA_FIRMS_DEMO',
        satellite: 'NOAA-21',
        instrument: 'VIIRS',
        latitude: 21.189,
        longitude: 81.398,
        geometry: { type: 'Point', coordinates: [81.398, 21.189] },
        acquisitionDate: todayStr,
        acquisitionTime: '0745',
        timestamp: generateTimestamp(0, 7, 45),
        brightnessTemperature: 332.6,
        frp: 22.1,
        confidence: 'nominal',
        dayNight: 'D',
        scan: 0.41,
        track: 0.39
      },
      // CASE F: High Reflectance / Uncertain Anomaly (Thar Desert Salt Flats, Rajasthan)
      {
        eventId: 'FSA-2026-UNC-006',
        source: 'NASA_FIRMS_DEMO',
        satellite: 'NOAA-20',
        instrument: 'VIIRS',
        latitude: 27.214,
        longitude: 71.912,
        geometry: { type: 'Point', coordinates: [71.912, 27.214] },
        acquisitionDate: todayStr,
        acquisitionTime: '0855',
        timestamp: generateTimestamp(0, 8, 55),
        brightnessTemperature: 312.4,
        frp: 3.2,
        confidence: 'low',
        dayNight: 'D',
        scan: 0.48,
        track: 0.46
      },
      // Additional Realistic Demonstrable Nodes Across India
      {
        eventId: 'FSA-2026-IND-007',
        source: 'NASA_FIRMS_DEMO',
        satellite: 'NOAA-20',
        instrument: 'VIIRS',
        latitude: 22.825,
        longitude: 69.712, // Mundra SEZ & Port Coal / Thermal terminal
        geometry: { type: 'Point', coordinates: [69.712, 22.825] },
        acquisitionDate: todayStr,
        acquisitionTime: '0730',
        timestamp: generateTimestamp(0, 7, 30),
        brightnessTemperature: 349.5,
        frp: 41.2,
        confidence: 'high',
        dayNight: 'D',
        scan: 0.40,
        track: 0.38
      },
      {
        eventId: 'FSA-2026-IND-008',
        source: 'NASA_FIRMS_DEMO',
        satellite: 'NOAA-21',
        instrument: 'VIIRS',
        latitude: 29.398,
        longitude: 76.968, // Panipat Refinery & Petrochemical Complex, Haryana
        geometry: { type: 'Point', coordinates: [76.968, 29.398] },
        acquisitionDate: todayStr,
        acquisitionTime: '0815',
        timestamp: generateTimestamp(0, 8, 15),
        brightnessTemperature: 335.7,
        frp: 26.5,
        confidence: 'nominal',
        dayNight: 'D',
        scan: 0.42,
        track: 0.41
      },
      {
        eventId: 'FSA-2026-IND-009',
        source: 'NASA_FIRMS_DEMO',
        satellite: 'Suomi-NPP',
        instrument: 'VIIRS',
        latitude: 17.689,
        longitude: 83.218, // Visakhapatnam HPCL Refinery, AP
        geometry: { type: 'Point', coordinates: [83.218, 17.689] },
        acquisitionDate: todayStr,
        acquisitionTime: '0750',
        timestamp: generateTimestamp(0, 7, 50),
        brightnessTemperature: 342.3,
        frp: 34.0,
        confidence: 'nominal',
        dayNight: 'D',
        scan: 0.40,
        track: 0.39
      },
      {
        eventId: 'FSA-2026-IND-010',
        source: 'NASA_FIRMS_DEMO',
        satellite: 'NOAA-20',
        instrument: 'VIIRS',
        latitude: 24.195,
        longitude: 82.664, // Singrauli Super Thermal Power Station, MP/UP
        geometry: { type: 'Point', coordinates: [82.664, 24.195] },
        acquisitionDate: todayStr,
        acquisitionTime: '0805',
        timestamp: generateTimestamp(0, 8, 5),
        brightnessTemperature: 337.8,
        frp: 29.8,
        confidence: 'nominal',
        dayNight: 'D',
        scan: 0.41,
        track: 0.40
      },
      {
        eventId: 'FSA-2026-NAT-011',
        source: 'NASA_FIRMS_DEMO',
        satellite: 'NOAA-21',
        instrument: 'VIIRS',
        latitude: 21.684,
        longitude: 86.342, // Similipal Biosphere Reserve Forest Fire, Odisha
        geometry: { type: 'Point', coordinates: [86.342, 21.684] },
        acquisitionDate: todayStr,
        acquisitionTime: '0915',
        timestamp: generateTimestamp(0, 9, 15),
        brightnessTemperature: 329.4,
        frp: 21.7,
        confidence: 'nominal',
        dayNight: 'D',
        scan: 0.44,
        track: 0.42
      },
      {
        eventId: 'FSA-2026-AGR-012',
        source: 'NASA_FIRMS_DEMO',
        satellite: 'NOAA-20',
        instrument: 'VIIRS',
        latitude: 29.789,
        longitude: 76.985, // Karnal, Haryana - Stubble fire
        geometry: { type: 'Point', coordinates: [76.985, 29.789] },
        acquisitionDate: todayStr,
        acquisitionTime: '0825',
        timestamp: generateTimestamp(0, 8, 25),
        brightnessTemperature: 319.6,
        frp: 9.4,
        confidence: 'nominal',
        dayNight: 'D',
        scan: 0.43,
        track: 0.41
      }
    ];
  }
}

module.exports = {
  FirmsProvider,
  LiveFirmsProvider,
  DemoFirmsProvider
};

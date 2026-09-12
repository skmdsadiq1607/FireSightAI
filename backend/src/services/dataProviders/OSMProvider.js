const axios = require('axios');

class OSMProvider {
  async fetchIndustrialFeatures(bbox) {
    throw new Error('fetchIndustrialFeatures must be implemented by subclass');
  }
}

class LiveOSMProvider extends OSMProvider {
  constructor() {
    super();
    this.overpassUrls = [
      'https://overpass-api.de/api/interpreter',
      'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
    ];
  }

  async fetchIndustrialFeatures(bbox) {
    // bbox: [minLat, minLon, maxLat, maxLon]
    const [minLat, minLon, maxLat, maxLon] = bbox;
    const query = `
      [out:json][timeout:25];
      (
        node["landuse"="industrial"](${minLat},${minLon},${maxLat},${maxLon});
        way["landuse"="industrial"](${minLat},${minLon},${maxLat},${maxLon});
        node["man_made"="works"](${minLat},${minLon},${maxLat},${maxLon});
        way["man_made"="works"](${minLat},${minLon},${maxLat},${maxLon});
        node["power"="plant"](${minLat},${minLon},${maxLat},${maxLon});
        way["power"="plant"](${minLat},${minLon},${maxLat},${maxLon});
        node["industrial"](${minLat},${minLon},${maxLat},${maxLon});
        way["industrial"](${minLat},${minLon},${maxLat},${maxLon});
      );
      out body center;
    `;

    for (const endpoint of this.overpassUrls) {
      try {
        console.log(`[OSM Overpass] Querying industrial features from ${endpoint}`);
        const response = await axios.post(endpoint, `data=${encodeURIComponent(query)}`, {
          timeout: 15000,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (response.data && response.data.elements) {
          return this.parseElements(response.data.elements);
        }
      } catch (err) {
        console.warn(`[OSM Overpass] Failed endpoint ${endpoint}: ${err.message}`);
      }
    }

    throw new Error('All Overpass API endpoints unavailable. Use DemoOSMProvider fallback.');
  }

  parseElements(elements) {
    return elements.map(el => {
      const lat = el.lat || (el.center && el.center.lat);
      const lon = el.lon || (el.center && el.center.lon);
      if (!lat || !lon) return null;

      const tags = el.tags || {};
      const name = tags.name || tags['name:en'] || `Industrial Asset #${el.id}`;

      let facilityType = 'industrial_estate';
      if (tags.power === 'plant') facilityType = 'power_plant';
      else if (tags.industrial === 'oil' || tags.industrial === 'refinery' || (tags.name && tags.name.toLowerCase().includes('refinery'))) {
        facilityType = 'petrochemical_refinery';
      } else if (tags.industrial === 'chemical' || (tags.name && tags.name.toLowerCase().includes('chemical'))) {
        facilityType = 'chemical_manufacturing';
      } else if (tags.industrial === 'steel' || (tags.name && tags.name.toLowerCase().includes('steel'))) {
        facilityType = 'steel_metallurgy';
      }

      return {
        osmId: `osm-${el.type}-${el.id}`,
        name,
        facilityType,
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        centroid: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        boundaryRadiusMeters: 1200,
        osmTags: tags,
        provenance: 'OpenStreetMap Live Overpass'
      };
    }).filter(Boolean);
  }
}

class DemoOSMProvider extends OSMProvider {
  async fetchIndustrialFeatures() {
    return [
      {
        osmId: 'osm-way-hazira-ind',
        name: 'Hazira Petrochemical & Chemical Terminal Complex',
        facilityType: 'petrochemical_refinery',
        criticalityLevel: 'VERY_HIGH',
        location: { city: 'Surat', district: 'Surat', state: 'Gujarat', country: 'India' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.620, 21.090],
            [72.665, 21.090],
            [72.665, 21.125],
            [72.620, 21.125],
            [72.620, 21.090]
          ]]
        },
        centroid: { type: 'Point', coordinates: [72.642, 21.107] },
        boundaryRadiusMeters: 2500,
        baselineThermal: {
          hasKnownThermalSources: true,
          sourceType: 'flare_stack',
          meanFRP: 15.2,
          stdDevFRP: 4.8,
          maxObservedFRP: 28.0,
          sampleCount: 140,
          baselineConfidence: 'HIGH'
        },
        contact: { authority: 'Gujarat Pollution Control Board', emergencyPhone: '+91-261-2472911' },
        provenance: 'OSM Overpass Verified + GIDC Registry'
      },
      {
        osmId: 'osm-way-jamnagar-ref',
        name: 'Jamnagar Mega Refinery & Petrochemical Complex',
        facilityType: 'petrochemical_refinery',
        criticalityLevel: 'VERY_HIGH',
        location: { city: 'Jamnagar', district: 'Jamnagar', state: 'Gujarat', country: 'India' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [69.840, 22.340],
            [69.890, 22.340],
            [69.890, 22.380],
            [69.840, 22.380],
            [69.840, 22.340]
          ]]
        },
        centroid: { type: 'Point', coordinates: [69.865, 22.360] },
        boundaryRadiusMeters: 3000,
        baselineThermal: {
          hasKnownThermalSources: true,
          sourceType: 'flare_stack',
          meanFRP: 24.5,
          stdDevFRP: 5.2,
          maxObservedFRP: 35.0,
          sampleCount: 220,
          baselineConfidence: 'HIGH'
        },
        contact: { authority: 'Gujarat Maritime Board & GPCB', emergencyPhone: '+91-288-2550123' },
        provenance: 'OSM Overpass Verified + Industry Baseline'
      },
      {
        osmId: 'osm-way-bhilai-steel',
        name: 'Bhilai Steel Plant (SAIL)',
        facilityType: 'steel_metallurgy',
        criticalityLevel: 'HIGH',
        location: { city: 'Bhilai', district: 'Durg', state: 'Chhattisgarh', country: 'India' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [81.380, 21.170],
            [81.420, 21.170],
            [81.420, 21.210],
            [81.380, 21.210],
            [81.380, 21.170]
          ]]
        },
        centroid: { type: 'Point', coordinates: [81.400, 21.190] },
        boundaryRadiusMeters: 2200,
        baselineThermal: {
          hasKnownThermalSources: true,
          sourceType: 'smelter',
          meanFRP: 21.0,
          stdDevFRP: 3.5,
          maxObservedFRP: 30.0,
          sampleCount: 310,
          baselineConfidence: 'HIGH'
        },
        contact: { authority: 'SAIL Disaster Control Room', emergencyPhone: '+91-788-2223400' },
        provenance: 'OSM Overpass Verified'
      },
      {
        osmId: 'osm-way-mundra-port',
        name: 'Mundra Special Economic Zone & Power Complex',
        facilityType: 'power_plant',
        criticalityLevel: 'HIGH',
        location: { city: 'Mundra', district: 'Kutch', state: 'Gujarat', country: 'India' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [69.690, 22.800],
            [69.740, 22.800],
            [69.740, 22.850],
            [69.690, 22.850],
            [69.690, 22.800]
          ]]
        },
        centroid: { type: 'Point', coordinates: [69.715, 22.825] },
        boundaryRadiusMeters: 2800,
        baselineThermal: {
          hasKnownThermalSources: true,
          sourceType: 'coke_oven',
          meanFRP: 18.0,
          stdDevFRP: 4.0,
          maxObservedFRP: 28.0,
          sampleCount: 95,
          baselineConfidence: 'MODERATE'
        },
        contact: { authority: 'Kutch Industrial Safety Directorate', emergencyPhone: '+91-2838-255000' },
        provenance: 'OSM Overpass Verified'
      },
      {
        osmId: 'osm-way-panipat-ref',
        name: 'Panipat Refinery & Petrochemical Hub (IOCL)',
        facilityType: 'petrochemical_refinery',
        criticalityLevel: 'VERY_HIGH',
        location: { city: 'Panipat', district: 'Panipat', state: 'Haryana', country: 'India' },
        geometry: {
          type: 'Point',
          coordinates: [76.968, 29.398]
        },
        centroid: { type: 'Point', coordinates: [76.968, 29.398] },
        boundaryRadiusMeters: 2000,
        baselineThermal: {
          hasKnownThermalSources: true,
          sourceType: 'flare_stack',
          meanFRP: 22.0,
          stdDevFRP: 4.5,
          maxObservedFRP: 32.0,
          sampleCount: 180,
          baselineConfidence: 'HIGH'
        },
        contact: { authority: 'Haryana State Pollution Control Board', emergencyPhone: '+91-180-2578800' },
        provenance: 'OSM Overpass Verified'
      },
      {
        osmId: 'osm-way-vizag-hpcl',
        name: 'Visakhapatnam Petroleum Refinery (HPCL)',
        facilityType: 'petrochemical_refinery',
        criticalityLevel: 'VERY_HIGH',
        location: { city: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India' },
        geometry: {
          type: 'Point',
          coordinates: [83.218, 17.689]
        },
        centroid: { type: 'Point', coordinates: [83.218, 17.689] },
        boundaryRadiusMeters: 1800,
        baselineThermal: {
          hasKnownThermalSources: true,
          sourceType: 'flare_stack',
          meanFRP: 25.0,
          stdDevFRP: 4.8,
          maxObservedFRP: 36.0,
          sampleCount: 160,
          baselineConfidence: 'HIGH'
        },
        contact: { authority: 'AP Disaster Response Cell', emergencyPhone: '+91-891-2567890' },
        provenance: 'OSM Overpass Verified'
      },
      {
        osmId: 'osm-way-singrauli-power',
        name: 'Singrauli Super Thermal Power Station (NTPC)',
        facilityType: 'power_plant',
        criticalityLevel: 'HIGH',
        location: { city: 'Shaktinagar', district: 'Sonbhadra', state: 'Uttar Pradesh', country: 'India' },
        geometry: {
          type: 'Point',
          coordinates: [82.664, 24.195]
        },
        centroid: { type: 'Point', coordinates: [82.664, 24.195] },
        boundaryRadiusMeters: 2400,
        baselineThermal: {
          hasKnownThermalSources: true,
          sourceType: 'smelter',
          meanFRP: 26.0,
          stdDevFRP: 4.2,
          maxObservedFRP: 34.0,
          sampleCount: 200,
          baselineConfidence: 'HIGH'
        },
        contact: { authority: 'UPPCB Sonebhadra Regional Office', emergencyPhone: '+91-5446-232100' },
        provenance: 'OSM Overpass Verified'
      }
    ];
  }
}

module.exports = {
  OSMProvider,
  LiveOSMProvider,
  DemoOSMProvider
};

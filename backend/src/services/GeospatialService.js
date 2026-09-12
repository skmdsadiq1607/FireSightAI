const Facility = require('../models/Facility');

class GeospatialService {
  /**
   * Great circle distance using Haversine formula (in meters)
   */
  static calculateDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  /**
   * Standard ray-casting point-in-polygon algorithm for GeoJSON Polygon coordinates
   * @param {Array} point [longitude, latitude]
   * @param {Array} ring Array of [lon, lat] points forming a closed loop
   */
  static isPointInPolygonRing(point, ring) {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * Enriches a thermal event with nearest industrial facility data
   * @param {Number} latitude 
   * @param {Number} longitude 
   * @returns {Promise<Object>} Enriched industrial proximity and boundary status
   */
  static async findIndustrialProximity(latitude, longitude) {
    try {
      // Find facilities within 15km
      const facilities = await Facility.find();
      if (!facilities || facilities.length === 0) {
        return {
          facilityId: null,
          facilityName: null,
          facilityType: null,
          facilityDistance: null,
          insideIndustrialBoundary: false,
          nearestCity: 'Unknown',
          state: 'Unknown',
          baselineStatus: 'NO_BASELINE',
          baselineFRPDelta: 0
        };
      }

      let closestFacility = null;
      let minDistance = Infinity;
      let insideBoundary = false;

      for (const facility of facilities) {
        let facLat, facLon;
        if (facility.centroid && facility.centroid.coordinates) {
          [facLon, facLat] = facility.centroid.coordinates;
        } else if (facility.geometry && facility.geometry.coordinates) {
          if (facility.geometry.type === 'Point') {
            [facLon, facLat] = facility.geometry.coordinates;
          } else {
            [facLon, facLat] = facility.geometry.coordinates[0][0];
          }
        }

        if (facLat == null || facLon == null) continue;

        const dist = this.calculateDistanceMeters(latitude, longitude, facLat, facLon);
        if (dist < minDistance) {
          minDistance = dist;
          closestFacility = facility;
        }

        // Check if inside polygon if geometry is Polygon
        if (facility.geometry && facility.geometry.type === 'Polygon' && Array.isArray(facility.geometry.coordinates)) {
          const ring = facility.geometry.coordinates[0];
          if (this.isPointInPolygonRing([longitude, latitude], ring)) {
            insideBoundary = true;
            closestFacility = facility;
            minDistance = Math.min(dist, 100); // effectively inside
            break;
          }
        } else if (dist <= (facility.boundaryRadiusMeters || 1500)) {
          // Inside approximate boundary radius
          insideBoundary = true;
        }
      }

      if (closestFacility && minDistance <= 15000) { // Within 15 km relevance zone
        return {
          facilityId: closestFacility._id,
          facilityName: closestFacility.name,
          facilityType: closestFacility.facilityType,
          facilityDistance: minDistance,
          insideIndustrialBoundary: insideBoundary,
          nearestCity: closestFacility.location?.city || 'Unknown',
          state: closestFacility.location?.state || 'Unknown',
          baselineThermal: closestFacility.baselineThermal,
          criticalityLevel: closestFacility.criticalityLevel
        };
      }

      return {
        facilityId: null,
        facilityName: null,
        facilityType: null,
        facilityDistance: minDistance < 50000 ? minDistance : null,
        insideIndustrialBoundary: false,
        nearestCity: 'Rural / Remote',
        state: 'India',
        baselineStatus: 'NO_BASELINE',
        baselineFRPDelta: 0
      };
    } catch (err) {
      console.error('[GeospatialService] Error finding industrial proximity:', err.message);
      return {
        facilityId: null,
        facilityName: null,
        facilityType: null,
        facilityDistance: null,
        insideIndustrialBoundary: false,
        nearestCity: 'Unknown',
        state: 'Unknown'
      };
    }
  }
}

module.exports = GeospatialService;

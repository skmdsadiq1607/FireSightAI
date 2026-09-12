const PersistenceCluster = require('../models/PersistenceCluster');
const GeospatialService = require('./GeospatialService');

class PersistenceEngine {
  /**
   * Spatio-temporal cluster association for a newly ingested thermal event
   * @param {Object} event Thermal event data
   * @returns {Promise<Object>} Persistence metadata { clusterId, count, days, score, isPersistent }
   */
  static async evaluateEventPersistence(event) {
    try {
      const { latitude, longitude, timestamp, frp, facilityId, facilityName, eventId } = event;
      const eventTime = new Date(timestamp);
      const clusterThresholdMeters = 1500;
      const timeWindowMs = 7 * 24 * 60 * 60 * 1000; // 7 days window

      // Query active clusters
      const existingClusters = await PersistenceCluster.find({
        status: 'ACTIVE',
        lastDetected: { $gte: new Date(eventTime.getTime() - timeWindowMs) }
      });

      let matchedCluster = null;

      for (const cluster of existingClusters) {
        if (!cluster.centroid || !cluster.centroid.coordinates) continue;
        const [cLon, cLat] = cluster.centroid.coordinates;
        const dist = GeospatialService.calculateDistanceMeters(latitude, longitude, cLat, cLon);

        if (dist <= clusterThresholdMeters) {
          matchedCluster = cluster;
          break;
        }
      }

      if (matchedCluster) {
        // Update matched cluster
        matchedCluster.totalDetections += 1;
        if (!matchedCluster.eventIds.includes(eventId)) {
          matchedCluster.eventIds.push(eventId);
        }

        const firstTime = new Date(matchedCluster.firstDetected).getTime();
        const curTime = eventTime.getTime();
        if (curTime > new Date(matchedCluster.lastDetected).getTime()) {
          matchedCluster.lastDetected = eventTime;
        }

        // Calculate unique days
        const spanDays = Math.max(1, Math.ceil((curTime - firstTime) / (24 * 3600 * 1000)));
        matchedCluster.persistenceDays = Math.min(spanDays, matchedCluster.totalDetections);
        matchedCluster.maxFRP = Math.max(matchedCluster.maxFRP, frp);
        matchedCluster.meanFRP = Number(((matchedCluster.meanFRP * (matchedCluster.totalDetections - 1) + frp) / matchedCluster.totalDetections).toFixed(2));

        // Persistence score (0 - 100) based on days and frequency
        const dayFactor = Math.min(matchedCluster.persistenceDays / 5, 1.0) * 60;
        const countFactor = Math.min(matchedCluster.totalDetections / 10, 1.0) * 40;
        matchedCluster.persistenceScore = Math.round(dayFactor + countFactor);

        await matchedCluster.save();

        return {
          persistenceClusterId: matchedCluster.clusterId,
          persistenceCount: matchedCluster.totalDetections,
          persistenceDays: matchedCluster.persistenceDays,
          isPersistent: matchedCluster.persistenceDays >= 2 || matchedCluster.totalDetections >= 3,
          persistenceScore: matchedCluster.persistenceScore
        };
      } else {
        // Create new cluster
        const newClusterId = `CLUSTER-${latitude.toFixed(2)}-${longitude.toFixed(2)}-${Date.now().toString().slice(-4)}`;
        const initCount = event.persistenceCount || 1;
        const initDays = event.persistenceDays || 1;
        const isPersist = initDays >= 2 || initCount >= 3;
        const pScore = Math.round(Math.min(initDays / 5, 1.0) * 60 + Math.min(initCount / 10, 1.0) * 40);

        const newCluster = new PersistenceCluster({
          clusterId: newClusterId,
          facilityId,
          facilityName,
          centroid: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          radiusMeters: clusterThresholdMeters,
          firstDetected: new Date(eventTime.getTime() - (initDays - 1) * 24 * 3600 * 1000),
          lastDetected: eventTime,
          totalDetections: initCount,
          uniqueDays: initDays,
          persistenceDays: initDays,
          maxFRP: frp,
          meanFRP: frp,
          persistenceScore: pScore,
          classification: isPersist ? 'PERSISTENT INDUSTRIAL SOURCE' : 'TRANSIENT EVENT',
          eventIds: [eventId],
          status: 'ACTIVE'
        });

        await newCluster.save();

        return {
          persistenceClusterId: newClusterId,
          persistenceCount: initCount,
          persistenceDays: initDays,
          isPersistent: isPersist,
          persistenceScore: pScore
        };
      }
    } catch (err) {
      console.error('[PersistenceEngine] Error evaluating persistence:', err.message);
      return {
        persistenceClusterId: null,
        persistenceCount: 1,
        persistenceDays: 1,
        isPersistent: false,
        persistenceScore: 0
      };
    }
  }
}

module.exports = PersistenceEngine;

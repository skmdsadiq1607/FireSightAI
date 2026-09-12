const ThermalEvent = require('../models/ThermalEvent');
const Facility = require('../models/Facility');
const MonitoringLog = require('../models/MonitoringLog');
const GeospatialService = require('./GeospatialService');
const PersistenceEngine = require('./PersistenceEngine');
const RiskEngine = require('./RiskEngine');
const AIServiceClient = require('./AIServiceClient');
const { LiveFirmsProvider, DemoFirmsProvider } = require('./dataProviders/FirmsProvider');
const { LiveSentinelProvider, DemoSatelliteProvider } = require('./dataProviders/SatelliteProvider');

class IngestionPipeline {
  constructor(mode = 'demo') {
    this.mode = mode;
    this.firmsProvider = mode === 'live' && process.env.FIRMS_MAP_KEY && process.env.FIRMS_MAP_KEY !== 'demo_firms_key'
      ? new LiveFirmsProvider(process.env.FIRMS_MAP_KEY)
      : new DemoFirmsProvider();

    this.satelliteProvider = mode === 'live' && process.env.COPERNICUS_CLIENT_ID && process.env.COPERNICUS_CLIENT_ID !== 'demo_copernicus_id'
      ? new LiveSentinelProvider(process.env.COPERNICUS_CLIENT_ID, process.env.COPERNICUS_CLIENT_SECRET)
      : new DemoSatelliteProvider();
  }

  setMode(mode) {
    this.mode = mode;
    this.firmsProvider = mode === 'live' && process.env.FIRMS_MAP_KEY && process.env.FIRMS_MAP_KEY !== 'demo_firms_key'
      ? new LiveFirmsProvider(process.env.FIRMS_MAP_KEY)
      : new DemoFirmsProvider();

    this.satelliteProvider = mode === 'live' && process.env.COPERNICUS_CLIENT_ID && process.env.COPERNICUS_CLIENT_ID !== 'demo_copernicus_id'
      ? new LiveSentinelProvider(process.env.COPERNICUS_CLIENT_ID, process.env.COPERNICUS_CLIENT_SECRET)
      : new DemoSatelliteProvider();
  }

  /**
   * Runs the complete end-to-end ingestion and enrichment pipeline
   */
  async runPipeline(options = {}) {
    const startTime = Date.now();
    let rawAnomalies = [];

    try {
      // 1. Ingest raw thermal anomalies from FIRMS provider
      rawAnomalies = await this.firmsProvider.fetchAnomalies(options);
    } catch (firmsErr) {
      console.warn(`[Pipeline] FIRMS live ingestion failed: ${firmsErr.message}. Activating demo provider fallback.`);
      const fallbackProvider = new DemoFirmsProvider();
      rawAnomalies = await fallbackProvider.fetchAnomalies(options);

      await MonitoringLog.create({
        service: 'FIRMS_INGESTION',
        status: 'DEMO_FALLBACK',
        message: `FIRMS live feed failed: ${firmsErr.message}. Fallback demo feed ingested.`,
        metrics: { responseTimeMs: Date.now() - startTime }
      });
    }

    let processedCount = 0;
    let newEventsCount = 0;

    for (const raw of rawAnomalies) {
      try {
        // 2. Geospatial Enrichment: Match against industrial infrastructure
        const geoContext = await GeospatialService.findIndustrialProximity(raw.latitude, raw.longitude);

        // 3. Temporal Persistence: Match against cluster history
        const persistence = await PersistenceEngine.evaluateEventPersistence({
          ...raw,
          facilityId: geoContext.facilityId,
          facilityName: geoContext.facilityName
        });

        // 4. Feature Assembly for AI Model
        const features = {
          eventId: raw.eventId,
          latitude: raw.latitude,
          longitude: raw.longitude,
          frp: raw.frp,
          brightnessTemperature: raw.brightnessTemperature,
          insideIndustrialBoundary: geoContext.insideIndustrialBoundary,
          facilityDistance: geoContext.facilityDistance,
          facilityType: geoContext.facilityType,
          criticalityLevel: geoContext.criticalityLevel || 'MEDIUM',
          persistenceDays: persistence.persistenceDays,
          persistenceCount: persistence.persistenceCount,
          baselineThermal: geoContext.baselineThermal
        };

        // 5. AI Classification
        const aiOutput = await AIServiceClient.classifyThermalEvent(features);

        // 6. Risk Prioritization Scoring & Transparent Evidence
        const riskResult = RiskEngine.calculateRisk({
          ...features,
          facilityName: geoContext.facilityName,
          classification: aiOutput.classification
        });

        // Combine AI evidence and risk evidence
        const combinedEvidence = Array.from(new Set([
          ...(aiOutput.evidence || []),
          ...(riskResult.evidence || [])
        ]));

        // 7. Satellite Verification Context
        let satVerification = { status: 'UNAVAILABLE', message: 'Verification not requested yet' };
        // If event is high or critical risk, proactively evaluate satellite verification
        if (riskResult.riskScore >= 60 || raw.eventId.includes('IND-001') || raw.eventId.includes('IND-002') || raw.eventId.includes('NAT-003')) {
          satVerification = await this.satelliteProvider.getVerificationContext(
            raw.latitude,
            raw.longitude,
            raw.acquisitionDate,
            { eventId: raw.eventId }
          );
        }

        // 8. Upsert Thermal Event in MongoDB
        const existingEvent = await ThermalEvent.findOne({ eventId: raw.eventId });

        const eventData = {
          ...raw,
          facilityId: geoContext.facilityId,
          facilityName: geoContext.facilityName,
          facilityType: geoContext.facilityType,
          facilityDistance: geoContext.facilityDistance,
          insideIndustrialBoundary: geoContext.insideIndustrialBoundary,
          nearestCity: geoContext.nearestCity,
          state: geoContext.state,
          persistenceClusterId: persistence.persistenceClusterId,
          persistenceCount: persistence.persistenceCount,
          persistenceDays: persistence.persistenceDays,
          isPersistent: persistence.isPersistent,
          baselineStatus: riskResult.baselineStatus,
          baselineFRPDelta: riskResult.baselineFRPDelta,
          classification: aiOutput.classification,
          classificationConfidence: aiOutput.classificationConfidence,
          riskScore: riskResult.riskScore,
          riskLevel: riskResult.riskLevel,
          riskBreakdown: riskResult.riskBreakdown,
          explanation: {
            summary: `${aiOutput.classification} classified with ${aiOutput.classificationConfidence}% confidence. Risk score: ${riskResult.riskScore}/100 (${riskResult.riskLevel}).`,
            evidence: combinedEvidence,
            recommendation: riskResult.riskLevel === 'CRITICAL' || riskResult.riskLevel === 'HIGH'
              ? 'Urgent on-ground thermal inspection & industrial safety protocol activation recommended.'
              : 'Continuous satellite surveillance; baseline thermal verification in progress.'
          },
          satelliteVerification: satVerification,
          status: 'ACTIVE'
        };

        if (existingEvent) {
          await ThermalEvent.updateOne({ eventId: raw.eventId }, { $set: eventData });
        } else {
          await ThermalEvent.create(eventData);
          newEventsCount++;
        }

        // Update facility active events count if attached
        if (geoContext.facilityId) {
          await Facility.findByIdAndUpdate(geoContext.facilityId, {
            $inc: { activeEventsCount: existingEvent ? 0 : 1 },
            $set: { highestActiveRisk: riskResult.riskLevel }
          });
        }

        processedCount++;
      } catch (eventErr) {
        console.error(`[Pipeline] Error processing event ${raw.eventId}:`, eventErr.message);
      }
    }

    const duration = Date.now() - startTime;
    await MonitoringLog.create({
      service: 'FIRMS_INGESTION',
      status: 'HEALTHY',
      message: `Ingestion completed successfully. ${processedCount} events processed (${newEventsCount} new).`,
      metrics: {
        responseTimeMs: duration,
        recordsProcessed: processedCount,
        newEventsCount
      }
    });

    return {
      status: 'SUCCESS',
      mode: this.mode,
      processedCount,
      newEventsCount,
      durationMs: duration
    };
  }
}

module.exports = IngestionPipeline;

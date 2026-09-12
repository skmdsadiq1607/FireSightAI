class RiskEngine {
  /**
   * Evaluates multi-factor risk score (0 to 100) and produces explainable evidence
   * @param {Object} eventData Extracted thermal, spatial, and temporal features
   * @param {Object} customWeights Optional weight overrides
   */
  static calculateRisk(eventData, customWeights = {}) {
    const weights = {
      thermalIntensity: customWeights.thermalIntensity ?? 30,
      persistence: customWeights.persistence ?? 25,
      industrialProximity: customWeights.industrialProximity ?? 20,
      historicalRecurrence: customWeights.historicalRecurrence ?? 15,
      populationContext: customWeights.populationContext ?? 10
    };

    const {
      frp = 0,
      brightnessTemperature = 300,
      insideIndustrialBoundary = false,
      facilityDistance = null,
      facilityType = null,
      criticalityLevel = 'MEDIUM',
      persistenceDays = 1,
      persistenceCount = 1,
      baselineThermal = null,
      classification = 'UNCERTAIN ANOMALY'
    } = eventData;

    const evidence = [];

    // 1. Thermal Intensity Score (0 - 100)
    // FRP typically ranges from 1 to 200+ MW. Brightness from 300 to 380+ K
    let thermalScore = 0;
    if (frp >= 60) {
      thermalScore = 100;
      evidence.push(`Extreme thermal output (${frp.toFixed(1)} MW FRP, ${brightnessTemperature.toFixed(1)} K)`);
    } else if (frp >= 30) {
      thermalScore = 75 + ((frp - 30) / 30) * 25;
      evidence.push(`High thermal radiative power (${frp.toFixed(1)} MW FRP)`);
    } else if (frp >= 15) {
      thermalScore = 45 + ((frp - 15) / 15) * 30;
      evidence.push(`Moderate thermal radiative power (${frp.toFixed(1)} MW FRP)`);
    } else {
      thermalScore = Math.min((frp / 15) * 45, 45);
      evidence.push(`Low thermal signature (${frp.toFixed(1)} MW FRP)`);
    }

    // 2. Persistence Score (0 - 100)
    let persistenceScore = 0;
    if (persistenceDays >= 4 || persistenceCount >= 6) {
      persistenceScore = 95;
      evidence.push(`Persistent thermal source detected across ${persistenceDays} distinct satellite pass days (${persistenceCount} observations)`);
    } else if (persistenceDays >= 2 || persistenceCount >= 3) {
      persistenceScore = 65;
      evidence.push(`Multi-pass thermal persistence (${persistenceDays} days, ${persistenceCount} detections)`);
    } else {
      persistenceScore = 20;
      evidence.push('Single-pass observation (transient anomaly window)');
    }

    // 3. Industrial Proximity Score (0 - 100)
    let industrialScore = 0;
    if (insideIndustrialBoundary) {
      industrialScore = 100;
      evidence.push(`Geospatially located within active industrial perimeter (${eventData.facilityName || 'Designated Facility'})`);
    } else if (facilityDistance !== null && facilityDistance <= 1000) {
      industrialScore = 80;
      evidence.push(`High industrial proximity (${facilityDistance}m from ${eventData.facilityName || 'industrial asset'})`);
    } else if (facilityDistance !== null && facilityDistance <= 3000) {
      industrialScore = 50;
      evidence.push(`Moderate industrial buffer distance (${facilityDistance}m)`);
    } else if (facilityDistance !== null && facilityDistance <= 10000) {
      industrialScore = 25;
      evidence.push(`Peripheral industrial zone (${(facilityDistance / 1000).toFixed(1)}km distance)`);
    } else {
      industrialScore = 5;
      evidence.push('Remote / Non-industrial terrain (isolated from critical industrial assets)');
    }

    // 4. Historical Recurrence & Baseline Anomaly (0 - 100)
    let recurrenceScore = 30;
    let baselineStatus = 'NO_BASELINE';
    let baselineFRPDelta = 0;

    if (baselineThermal && baselineThermal.hasKnownThermalSources && baselineThermal.meanFRP > 0) {
      const mean = baselineThermal.meanFRP;
      const std = baselineThermal.stdDevFRP || (mean * 0.25);
      const zScore = (frp - mean) / std;
      baselineFRPDelta = Math.round(((frp - mean) / mean) * 100);

      if (zScore > 3.0) {
        baselineStatus = 'SEVERE_ANOMALY';
        recurrenceScore = 95;
        evidence.push(`Severe thermal surge: ${baselineFRPDelta > 0 ? '+' : ''}${baselineFRPDelta}% above historical facility baseline (${mean.toFixed(1)} MW mean)`);
      } else if (zScore > 1.5) {
        baselineStatus = 'ANOMALOUS';
        recurrenceScore = 75;
        evidence.push(`Elevated thermal activity: +${baselineFRPDelta}% relative to historical baseline`);
      } else if (zScore > 0.5) {
        baselineStatus = 'ELEVATED';
        recurrenceScore = 50;
        evidence.push(`Slightly elevated thermal signature: +${baselineFRPDelta}% above baseline`);
      } else {
        baselineStatus = 'NORMAL';
        recurrenceScore = 20;
        evidence.push(`Thermal signature matches routine industrial operating baseline (${mean.toFixed(1)} ± ${std.toFixed(1)} MW)`);
      }
    } else if (classification === 'INDUSTRIAL FIRE') {
      baselineStatus = 'ANOMALOUS';
      recurrenceScore = 80;
      evidence.push('No prior operational thermal source registered for this facility perimeter');
    }

    // 5. Criticality & Population/Asset Context (0 - 100)
    let populationScore = 30;
    if (criticalityLevel === 'VERY_HIGH' || facilityType === 'petrochemical_refinery') {
      populationScore = 100;
      evidence.push('Tier-1 Critical Infrastructure: High hydrocarbon / chemical inventory hazard risk');
    } else if (criticalityLevel === 'HIGH' || facilityType === 'power_plant' || facilityType === 'steel_metallurgy') {
      populationScore = 75;
      evidence.push('Major Industrial Asset: Elevated occupational & infrastructural vulnerability');
    } else if (insideIndustrialBoundary) {
      populationScore = 50;
    }

    // Weighted aggregation
    const totalWeight = weights.thermalIntensity + weights.persistence + weights.industrialProximity + weights.historicalRecurrence + weights.populationContext;
    const rawScore = (
      thermalScore * weights.thermalIntensity +
      persistenceScore * weights.persistence +
      industrialScore * weights.industrialProximity +
      recurrenceScore * weights.historicalRecurrence +
      populationScore * weights.populationContext
    ) / (totalWeight || 100);

    // If classification is routine heat or natural/agricultural, modulate risk score appropriately
    let adjustedScore = rawScore;
    if (classification === 'ROUTINE INDUSTRIAL HEAT') {
      adjustedScore = Math.min(adjustedScore * 0.45, 38); // Routine flaring should not trigger critical alarms
      evidence.push('Risk down-weighted: Anomaly aligns with controlled industrial operational process');
    } else if (classification === 'AGRICULTURAL BURNING') {
      adjustedScore = Math.min(adjustedScore * 0.65, 55); // Seasonal stubble burns are medium risk
    } else if (classification === 'NATURAL / WILDFIRE') {
      adjustedScore = Math.min(Math.max(adjustedScore, 35), 75); // Natural forest wildfire
    } else if (classification === 'INDUSTRIAL FIRE') {
      adjustedScore = Math.max(adjustedScore, 70); // Confirmed or likely industrial blaze is high/critical
    }

    const finalScore = Math.min(100, Math.max(1, Math.round(adjustedScore)));

    let riskLevel = 'LOW';
    if (finalScore >= 81) riskLevel = 'CRITICAL';
    else if (finalScore >= 61) riskLevel = 'HIGH';
    else if (finalScore >= 31) riskLevel = 'MEDIUM';
    else riskLevel = 'LOW';

    return {
      riskScore: finalScore,
      riskLevel,
      riskBreakdown: {
        thermalScore: Math.round(thermalScore),
        persistenceScore: Math.round(persistenceScore),
        industrialScore: Math.round(industrialScore),
        recurrenceScore: Math.round(recurrenceScore),
        populationScore: Math.round(populationScore)
      },
      baselineStatus,
      baselineFRPDelta,
      evidence
    };
  }
}

module.exports = RiskEngine;

const axios = require('axios');

class AIServiceClient {
  constructor() {
    this.baseUrl = process.env.PYTHON_AI_URL || 'http://localhost:8000';
  }

  /**
   * Request classification and scientific analysis from Python FastAPI ML service
   */
  async classifyThermalEvent(features) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/classify`, features, {
        timeout: 4000
      });
      return response.data;
    } catch (err) {
      // Graceful fallback to deterministic expert rule model if Python service is starting or unreachable
      return this.fallbackRuleClassifier(features, err.message);
    }
  }

  /**
   * Deterministic scientific expert rule classifier used as graceful fallback
   */
  fallbackRuleClassifier(features, fallbackReason) {
    const {
      frp = 0,
      brightnessTemperature = 300,
      insideIndustrialBoundary = false,
      facilityDistance = null,
      persistenceDays = 1,
      persistenceCount = 1,
      baselineThermal = null,
      latitude = 0,
      longitude = 0
    } = features;

    let classification = 'UNCERTAIN ANOMALY';
    let confidence = 55;
    const reasons = [];

    // Case 1: Extreme FRP or anomalous spike inside industrial boundary
    if (insideIndustrialBoundary || (facilityDistance !== null && facilityDistance <= 1200)) {
      if (baselineThermal && baselineThermal.hasKnownThermalSources) {
        const mean = baselineThermal.meanFRP || 20;
        const maxExpected = baselineThermal.maxObservedFRP || (mean * 1.5);

        if (frp > maxExpected * 1.6 || frp >= 65) {
          classification = 'INDUSTRIAL FIRE';
          confidence = 91;
          reasons.push('FRP significantly exceeds facility maximum operating envelope');
          reasons.push('Located within industrial perimeter');
        } else if (persistenceDays >= 3 || persistenceCount >= 4) {
          classification = 'PERSISTENT THERMAL SOURCE';
          confidence = 88;
          reasons.push('Consistent multi-day heat signature at known industrial point-source');
        } else {
          classification = 'ROUTINE INDUSTRIAL HEAT';
          confidence = 84;
          reasons.push('Thermal output within established historical baseline');
        }
      } else {
        // No known flare/smelter baseline but inside factory
        if (frp >= 35) {
          classification = 'INDUSTRIAL FIRE';
          confidence = 89;
          reasons.push('Significant thermal radiative power at non-flare industrial facility');
        } else {
          classification = 'ROUTINE INDUSTRIAL HEAT';
          confidence = 72;
          reasons.push('Minor thermal reading in industrial area');
        }
      }
    } else {
      // Outside industrial boundary
      // Punjab/Haryana latitude band during daytime with lower FRP and single-pass
      if (latitude >= 28.5 && latitude <= 32.5 && longitude >= 74.0 && longitude <= 77.5 && frp < 25) {
        classification = 'AGRICULTURAL BURNING';
        confidence = 86;
        reasons.push('Spatial correlation with seasonal agrarian stubble burning corridor');
        reasons.push('Low-to-moderate FRP characteristic of open biomass combustion');
      } else if (frp >= 15 && persistenceDays >= 1 && (facilityDistance === null || facilityDistance > 10000)) {
        classification = 'NATURAL / WILDFIRE';
        confidence = 82;
        reasons.push('Isolated heat anomaly in forest / non-industrial terrain');
        reasons.push('Absence of adjacent industrial infrastructure');
      } else if (frp < 8) {
        classification = 'UNCERTAIN ANOMALY';
        confidence = 60;
        reasons.push('Low thermal signature near detection threshold; solar reflectance candidate');
      } else {
        classification = 'UNCERTAIN ANOMALY';
        confidence = 58;
        reasons.push('Anomalous thermal detection requiring satellite corroboration');
      }
    }

    return {
      classification,
      classificationConfidence: confidence,
      evidence: reasons,
      modelEngine: 'Deterministic Expert Rule Engine (Fallback active)',
      fallbackActive: true,
      serviceMessage: fallbackReason ? `AI Service fallback: ${fallbackReason}` : null
    };
  }

  async checkHealth() {
    try {
      const res = await axios.get(`${this.baseUrl}/api/health`, { timeout: 3000 });
      return { status: 'HEALTHY', data: res.data };
    } catch (err) {
      return { status: 'DEGRADED', message: err.message };
    }
  }
}

module.exports = new AIServiceClient();

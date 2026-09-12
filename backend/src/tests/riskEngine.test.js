const RiskEngine = require('../services/RiskEngine');

describe('RiskEngine Unit Tests', () => {
  test('High FRP inside industrial boundary should trigger CRITICAL or HIGH risk', () => {
    const event = {
      frp: 85.0,
      brightnessTemperature: 375.0,
      insideIndustrialBoundary: true,
      facilityDistance: 50,
      facilityType: 'petrochemical_refinery',
      criticalityLevel: 'VERY_HIGH',
      persistenceDays: 2,
      persistenceCount: 4,
      classification: 'INDUSTRIAL FIRE'
    };

    const result = RiskEngine.calculateRisk(event);

    expect(result.riskScore).toBeGreaterThanOrEqual(75);
    expect(['HIGH', 'CRITICAL']).toContain(result.riskLevel);
    expect(result.riskBreakdown.thermalScore).toBe(100);
    expect(result.riskBreakdown.industrialScore).toBe(100);
    expect(result.evidence.length).toBeGreaterThan(0);
  });

  test('Routine industrial heat with normal baseline should result in LOW/MODERATE risk', () => {
    const event = {
      frp: 21.0,
      brightnessTemperature: 330.0,
      insideIndustrialBoundary: true,
      facilityDistance: 100,
      facilityType: 'steel_metallurgy',
      criticalityLevel: 'HIGH',
      persistenceDays: 4,
      persistenceCount: 6,
      classification: 'ROUTINE INDUSTRIAL HEAT',
      baselineThermal: {
        hasKnownThermalSources: true,
        sourceType: 'smelter',
        meanFRP: 21.0,
        stdDevFRP: 3.5
      }
    };

    const result = RiskEngine.calculateRisk(event);

    // Routine operational flaring should be down-weighted
    expect(result.riskScore).toBeLessThanOrEqual(45);
    expect(result.baselineStatus).toBe('NORMAL');
  });

  test('Remote natural wildfire should have low industrial score but moderate overall risk', () => {
    const event = {
      frp: 25.0,
      brightnessTemperature: 328.0,
      insideIndustrialBoundary: false,
      facilityDistance: 25000,
      facilityType: null,
      persistenceDays: 1,
      persistenceCount: 1,
      classification: 'NATURAL / WILDFIRE'
    };

    const result = RiskEngine.calculateRisk(event);

    expect(result.riskBreakdown.industrialScore).toBeLessThanOrEqual(10);
    expect(result.riskScore).toBeGreaterThanOrEqual(30);
    expect(result.riskScore).toBeLessThanOrEqual(75);
  });
});

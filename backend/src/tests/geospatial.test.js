const GeospatialService = require('../services/GeospatialService');

describe('GeospatialService Tests', () => {
  test('calculateDistanceMeters accurately computes distance between two Indian coordinates', () => {
    // Mumbai (19.076, 72.877) to Pune (18.520, 73.856) approx 120-150 km
    const dist = GeospatialService.calculateDistanceMeters(19.076, 72.877, 18.520, 73.856);
    expect(dist).toBeGreaterThan(110000);
    expect(dist).toBeLessThan(145000);
  });

  test('isPointInPolygonRing correctly detects internal point', () => {
    // Square around Hazira: [72.62, 21.09] to [72.66, 21.12]
    const ring = [
      [72.62, 21.09],
      [72.66, 21.09],
      [72.66, 21.12],
      [72.62, 21.12],
      [72.62, 21.09]
    ];

    const insidePoint = [72.64, 21.10];
    const outsidePoint = [72.70, 21.15];

    expect(GeospatialService.isPointInPolygonRing(insidePoint, ring)).toBe(true);
    expect(GeospatialService.isPointInPolygonRing(outsidePoint, ring)).toBe(false);
  });
});

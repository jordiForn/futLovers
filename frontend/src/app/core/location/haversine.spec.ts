import { describe, expect, it } from 'vitest';
import { haversineKm } from './location.service';

describe('haversineKm', () => {
  it('returns ~0 for the same point', () => {
    expect(haversineKm(38.84, 0.1, 38.84, 0.1)).toBeCloseTo(0, 5);
  });

  it('returns a positive distance between two Dénia points', () => {
    const km = haversineKm(38.8408, 0.1057, 38.837, 0.118);
    expect(km).toBeGreaterThan(0);
    expect(km).toBeLessThan(5);
  });
});

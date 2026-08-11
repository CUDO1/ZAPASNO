import { describe, expect, it } from 'vitest';
import { assessEmergency72Hours } from './planningEngine';

it('prioritizes missing water and power from real answers', () => {
  const result = assessEmergency72Hours({ householdSize: 2, waterLiters: 2, foodDays: 3, firstAid: true, lighting: 'good', power: 'none', communication: false, medications: true, stayHome: true });
  expect(result.score).toBeLessThan(80);
  expect(result.priorityActions.map((a) => a.id)).toContain('water');
  expect(result.gaps.some((a) => a.id === 'power')).toBe(true);
});

describe('assessEmergency72Hours', () => {
  it('recognizes a strong 72-hour base', () => {
    const result = assessEmergency72Hours({ householdSize: 1, waterLiters: 12, foodDays: 3, firstAid: true, lighting: 'good', power: 'good', communication: true, medications: true, stayHome: true });
    expect(result.score).toBe(100);
    expect(result.priorityActions).toHaveLength(0);
  });
});

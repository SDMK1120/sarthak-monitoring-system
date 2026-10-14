import { describe, expect, it } from 'vitest';
import { batchCounts, centerCounts, percentage, syncCounts } from '../src/modules/executive/calculations.js';
import { centerStatusAt, syncHealthAt, type BatchFact, type CenterFact, type SyncFact } from '../src/modules/executive/repository.js';

const cutoff = '2026-09-30T12:00:00.000Z';
function batch(id: string, capacity: number | null, occupied_seats: number): BatchFact {
  return { id, center_id: 'c1', scheme_id: 's1', created_at: '2026-08-01T00:00:00.000Z', started_at: '2026-08-05T00:00:00.000Z', completed_at: null, capacity, occupied_seats, enrollments: occupied_seats };
}
function target(overrides: Partial<SyncFact> = {}): SyncFact {
  return { id: 't1', center_id: 'c1', connectivity: 'offline', last_success_at: '2026-09-30T08:00:00.000Z', latest_at: '2026-09-30T08:00:00.000Z', result: 'success', delivery_complete: true, published: true, ...overrides };
}
const center: CenterFact = {
  id: 'c1', code: 'C1', name: 'Center', region_id: 'r1', district_id: 'd1', scheme_ids: ['s1'], onboarded_at: '2026-01-01T00:00:00.000Z',
  history: [{ at: '2026-01-01T00:00:00.000Z', status: 'active' }, { at: '2026-09-01T00:00:00.000Z', status: 'inactive' }],
};

describe('executive metric policies, using hand-calculated populations', () => {
  it('weights utilization by summed capacity and excludes uncomparable batches from both sums', () => {
    const result = batchCounts([batch('a', 20, 10), batch('b', 80, 20), batch('missing', null, 100), batch('zero', 0, 40)], cutoff);
    expect(result).toMatchObject({ current: 4, comparable: 2, excluded: 2, occupied_seats: 30, capacity: 100, utilization_percent: 30 });
  });
  it('preserves overcapacity and returns unavailable for a zero denominator', () => {
    expect(batchCounts([batch('a', 20, 25)], cutoff).utilization_percent).toBe(125);
    expect(batchCounts([batch('missing', null, 12)], cutoff).utilization_percent).toBeNull();
    expect(batchCounts([], cutoff).utilization_percent).toBeNull();
    expect(percentage(0, 0)).toBeNull();
  });
  it('includes planned capacity at cutoff and excludes batches created in the future', () => {
    const planned = { ...batch('planned', 40, 10), started_at: '2026-10-10T00:00:00.000Z' };
    const future = { ...batch('future', 80, 20), created_at: '2026-10-01T00:00:00.000Z' };
    expect(batchCounts([planned, future], cutoff)).toMatchObject({ current: 1, comparable: 1, occupied_seats: 10, capacity: 40, utilization_percent: 25 });
  });
  it('excludes completed stock and resolves historical activity rather than projecting current status', () => {
    const completed = { ...batch('completed', 20, 10), completed_at: '2026-09-01T00:00:00.000Z' };
    expect(batchCounts([completed], cutoff).current).toBe(0);
    expect(centerStatusAt(center, '2026-08-31T23:59:59.000Z')).toBe('active');
    expect(centerStatusAt(center, cutoff)).toBe('inactive');
    expect(centerCounts([center, { ...center, id: 'c2', history: [] }], cutoff)).toEqual({ total: 2, active: 0, inactive: 1, unknown: 1 });
  });
  it('keeps offline fresh complete targets healthy and gives known degradation precedence', () => {
    expect(syncHealthAt(target(), cutoff).status).toBe('healthy');
    for (const override of [{ result: 'failed' as const }, { result: 'partial' as const }, { delivery_complete: false }, { published: false }, { last_success_at: '2026-09-29T11:59:59.000Z' }]) {
      expect(syncHealthAt(target(override), cutoff).status).toBe('degraded');
    }
  });
  it('separates missing evidence and pending within deadline from overdue transfers', () => {
    expect(syncHealthAt(target({ result: null, latest_at: null, last_success_at: null, delivery_complete: null, published: null }), cutoff).status).toBe('unknown');
    expect(syncHealthAt(target({ result: 'pending', latest_at: '2026-09-30T11:00:00.000Z' }), cutoff).status).toBe('unknown');
    expect(syncHealthAt(target({ result: 'pending', latest_at: '2026-09-30T09:59:59.000Z' }), cutoff).status).toBe('degraded');
    expect(syncCounts([target(), target({ result: 'failed' }), target({ result: null, latest_at: null, last_success_at: null })], cutoff)).toMatchObject({ total: 3, healthy: 1, degraded: 1, unknown: 1, health_percent: 33.3, classification_percent: 66.7 });
    expect(syncCounts([], cutoff)).toMatchObject({ total: 0, health_percent: null, classification_percent: null });
  });
});

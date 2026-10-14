import { describe, expect, it, vi } from 'vitest';
import type { SynchronizationTarget } from '@sarthak/shared';
import { buildSynchronizationAlert, DEFAULT_SYNCHRONIZATION_RULES } from '../src/modules/synchronization/rules.js';
import { SynchronizationService } from '../src/modules/synchronization/service.js';

const cutoff = '2026-09-30T12:00:00.000Z';
function target(overrides: Partial<SynchronizationTarget> = {}): SynchronizationTarget {
  return { id: 'target-1', center_id: 'center-1', center_name: 'Center One', region_id: 'region-1', region_name: 'North', district_id: 'district-1', district_name: 'District One', state: 'degraded', reason: 'Latest transfer failed', connectivity: 'offline', result: 'failed', last_success_at: '2026-09-28T00:00:00.000Z', latest_at: cutoff, observation_age_hours: 0, success_age_hours: 60, delivery_complete: true, published: true, ...overrides };
}
describe('synchronization alert policy', () => {
  it.each([[0, 'CM'], [1.999, 'CM'], [2, 'JDM'], [5.999, 'JDM'], [6, 'SDM'], [23.999, 'SDM'], [24, 'Super Admin']] as const)('uses exact observed-age threshold %sh for %s', (hours, role) => {
    const latest = new Date(Date.parse(cutoff) - hours * 3_600_000).toISOString();
    const alert = buildSynchronizationAlert(target({ latest_at: latest, observation_age_hours: hours }), cutoff, DEFAULT_SYNCHRONIZATION_RULES);
    expect(alert).toMatchObject({ cause: 'failed', recommended_role: role, reference_at: latest, age_hours: hours });
  });
  it('does not treat missing evidence or missing failure timestamp as endless downtime', () => {
    const missing = buildSynchronizationAlert(target({ state: 'unknown', result: null, latest_at: null, last_success_at: null, observation_age_hours: null, success_age_hours: null, delivery_complete: null, published: null }), cutoff, DEFAULT_SYNCHRONIZATION_RULES);
    expect(missing).toMatchObject({ cause: 'missing_evidence', severity: 'information', age_hours: null, recommended_role: null });
    const failureWithoutTime = buildSynchronizationAlert(target({ latest_at: null, observation_age_hours: null }), cutoff, DEFAULT_SYNCHRONIZATION_RULES);
    expect(failureWithoutTime?.recommended_role).toBeNull();
    expect(failureWithoutTime?.age_hours).toBeNull();
  });
  it('keeps offline complete health and in-deadline pending separate from alerts', () => {
    expect(buildSynchronizationAlert(target({ state: 'healthy', result: 'success', success_age_hours: 1, last_success_at: '2026-09-30T11:00:00.000Z' }), cutoff, DEFAULT_SYNCHRONIZATION_RULES)).toBeNull();
    expect(buildSynchronizationAlert(target({ state: 'unknown', result: 'pending', latest_at: '2026-09-30T11:00:00.000Z', observation_age_hours: 1, last_success_at: '2026-09-30T08:00:00.000Z', success_age_hours: 4 }), cutoff, DEFAULT_SYNCHRONIZATION_RULES)).toBeNull();
  });
  it('selects one primary cause even when a failed target is also stale and incomplete', () => {
    const alert = buildSynchronizationAlert(target({ latest_at: '2026-09-30T08:00:00.000Z', observation_age_hours: 4, delivery_complete: false, published: false }), cutoff, DEFAULT_SYNCHRONIZATION_RULES);
    expect(alert?.cause).toBe('failed');
    expect(alert?.reference_at).toBe('2026-09-30T08:00:00.000Z');
  });
  it('uses last success for stale evidence and does not age from wall clock', () => {
    const stale = target({ result: 'success', latest_at: cutoff, observation_age_hours: 0, last_success_at: '2026-09-29T10:00:00.000Z', success_age_hours: 26 });
    expect(buildSynchronizationAlert(stale, cutoff, DEFAULT_SYNCHRONIZATION_RULES)).toMatchObject({ cause: 'stale', reference_at: stale.last_success_at, age_hours: 26, recommended_role: 'Super Admin' });
  });
  it('disables recipient recommendations without hiding evidence alerts', () => {
    expect(buildSynchronizationAlert(target(), cutoff, { ...DEFAULT_SYNCHRONIZATION_RULES, enabled: false })).toMatchObject({ cause: 'failed', recommended_role: null });
    expect(buildSynchronizationAlert(target(), cutoff, DEFAULT_SYNCHRONIZATION_RULES)?.cause).toBe('failed');
  });
  it('keeps the dashboard deterministic when the presentation wall clock advances', () => {
    const service = new SynchronizationService();
    const before = service.getDashboard();
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2035-01-01T00:00:00.000Z'));
      expect(service.getDashboard()).toEqual(before);
    } finally { vi.useRealTimers(); }
  });
});

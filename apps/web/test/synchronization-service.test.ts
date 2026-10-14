import { afterEach, describe, expect, it, vi } from 'vitest';
import { evaluateSynchronizationRules, getSynchronizationDashboard, readSynchronizationQuery, synchronizationSearch } from '../src/features/synchronization/service';
import { syncAlerts, syncRules } from './synchronization-fixtures';
afterEach(() => { vi.unstubAllGlobals(); });
describe('synchronization client contracts', () => {
  it('roundtrips all monitoring filters and validates pagination', () => {
    const query = readSynchronizationQuery('?region_id=region-1&district_id=district-1&center_id=center-1&state=degraded&result=failed&search=target-6&page=2&page_size=20&snapshot_id=demo-2026-09-v1');
    expect(query).toMatchObject({ page: 2, page_size: 20, state: 'degraded', result: 'failed' });
    expect(readSynchronizationQuery(synchronizationSearch(query))).toEqual(query);
  });
  it.each(['?state=offline', '?result=degraded', '?page_size=51', '?state=unknown&state=healthy', '?extra=1'])('rejects invalid or ambiguous monitoring URL %s', (query) => {
    expect(() => readSynchronizationQuery(query)).toThrow();
  });
  it('posts validated request-local rules with cancellation and reads a validated response', async () => {
    const response = { data: { ...syncAlerts, preview: true }, meta: { request_id: 'qa', generated_at: '2026-10-14T00:00:00.000Z' } };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(response), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();
    const query = readSynchronizationQuery('?center_id=center-1&snapshot_id=demo-2026-09-v1');
    expect(await evaluateSynchronizationRules(query, syncRules.rules, controller.signal)).toEqual(response.data);
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/synchronization/rules/evaluate', expect.objectContaining({ method: 'POST', signal: controller.signal, body: JSON.stringify({ filters: query, rules: syncRules.rules }) }));
  });
  it('blocks non-increasing rules locally and rejects malformed API data', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: {}, meta: { request_id: 'qa', generated_at: '2026-10-14T00:00:00.000Z' } }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(evaluateSynchronizationRules(readSynchronizationQuery(''), { ...syncRules.rules, thresholds: syncRules.rules.thresholds.map((threshold) => ({ ...threshold, after_hours: 0 })) })).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
    expect(fetchMock).not.toHaveBeenCalled();
    await expect(getSynchronizationDashboard(readSynchronizationQuery(''))).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  });
  it('retains safe server errors across POST evaluation', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'Unknown center.', request_id: 'qa', retryable: false } }), { status: 400 })));
    await expect(evaluateSynchronizationRules(readSynchronizationQuery(''), syncRules.rules)).rejects.toMatchObject({ code: 'VALIDATION_ERROR', message: 'Unknown center.', requestId: 'qa' });
  });
  it.each([{ ...syncAlerts, preview: false }, { ...syncAlerts, preview: true, context: { ...syncAlerts.context, snapshot_id: 'another-publication' } }])('rejects non-preview or mismatched evaluation publications', async (data) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ data, meta: { request_id: 'qa', generated_at: '2026-10-14T00:00:00.000Z' } }), { status: 200 })));
    await expect(evaluateSynchronizationRules(readSynchronizationQuery('?snapshot_id=demo-2026-09-v1'), syncRules.rules)).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { getDashboardOptions, getExecutiveDashboard } from '../src/features/executive/service';

const options = {
  regions: [{ id: 'region-1', name: 'North' }],
  schemes: [],
  snapshot_id: 'demo-2026-09-v1',
  data_as_of: '2026-09-30T12:00:00.000Z',
  timezone: 'UTC',
  available_period: { start: '2026-01-01', end: '2026-10-01' },
  default_period: { start: '2026-04-01', end: '2026-10-01' },
};
function respond(data: unknown) {
  return new Response(
    JSON.stringify({
      data,
      meta: { request_id: 'qa-request', generated_at: '2026-10-14T00:00:00.000Z' },
    }),
    { status: 200 },
  );
}
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('executive API client contract', () => {
  it('loads validated filter options and forwards cancellation', async () => {
    const fetchMock = vi.fn().mockResolvedValue(respond(options));
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();
    expect(await getDashboardOptions(controller.signal)).toEqual(options);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/dashboard/filters',
      expect.objectContaining({ signal: controller.signal, method: 'GET' }),
    );
  });
  it('rejects malformed data even when the transport envelope succeeds', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respond({ centers: { total: '84' } })));
    await expect(
      getExecutiveDashboard({
        region_id: 'region-1',
        period_start: '2026-09-01',
        period_end: '2026-10-01',
      }),
    ).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  });
  it('encodes scoped publication filters and prevents unpaired date requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(respond({}));
    vi.stubGlobal('fetch', fetchMock);
    await expect(
      getExecutiveDashboard({
        region_id: 'region-1',
        scheme_id: 'scheme-2',
        snapshot_id: 'demo-2026-09-v1',
        period_start: '2026-09-01',
        period_end: '2026-10-01',
      }),
    ).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
    const url = new URL(fetchMock.mock.calls[0]?.[0] as string, 'http://localhost');
    expect(url.pathname).toBe('/api/v1/dashboard/executive');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      region_id: 'region-1',
      scheme_id: 'scheme-2',
      snapshot_id: 'demo-2026-09-v1',
      period_start: '2026-09-01',
      period_end: '2026-10-01',
    });
    fetchMock.mockClear();
    await expect(getExecutiveDashboard({ period_start: '2026-09-01' })).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('preserves safe API error messages and distinguishes network failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Unknown region.',
            request_id: 'qa-request',
            retryable: false,
          },
        }),
        { status: 400 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    await expect(getDashboardOptions()).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      message: 'Unknown region.',
      requestId: 'qa-request',
    });
    fetchMock.mockRejectedValue(new Error('socket credentials must not leak'));
    await expect(getDashboardOptions()).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      message: 'Unable to reach the API.',
    });
  });
});

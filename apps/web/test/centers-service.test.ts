import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  centerSearch,
  readCenterQuery,
  getCenterDetail,
  getCenters,
} from '../src/features/centers/service';
import { listing } from './centers-fixtures';

afterEach(() => {
  vi.unstubAllGlobals();
});
describe('center client query and response contracts', () => {
  it('preserves complete URL context while converting pagination to validated numbers', () => {
    const query = readCenterQuery(
      '?region_id=region-1&district_id=district-1&scheme_id=scheme-1&activity_status=unknown&search=SAR%20one&page=2&page_size=20&sort=status&order=desc&snapshot_id=demo-2026-09-v1',
    );
    expect(query).toMatchObject({
      region_id: 'region-1',
      district_id: 'district-1',
      activity_status: 'unknown',
      search: 'SAR one',
      page: 2,
      page_size: 20,
      sort: 'status',
      order: 'desc',
    });
    expect(readCenterQuery(centerSearch(query))).toEqual(query);
  });
  it.each([
    '?page=0',
    '?page_size=51',
    '?region_id=region-1&region_id=region-2',
    '?unknown=1',
    '?activity_status=offline',
  ])('rejects invalid or ambiguous URL context: %s', (search) => {
    expect(() => readCenterQuery(search)).toThrow();
  });
  it('validates list data and forwards request cancellation', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: listing,
          meta: { request_id: 'qa', generated_at: '2026-10-14T00:00:00.000Z' },
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();
    expect(await getCenters(readCenterQuery(''), controller.signal)).toEqual(listing);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/centers?'),
      expect.objectContaining({ signal: controller.signal }),
    );
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { items: 'invalid' },
          meta: { request_id: 'qa', generated_at: '2026-10-14T00:00:00.000Z' },
        }),
        { status: 200 },
      ),
    );
    await expect(getCenters(readCenterQuery(''))).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
    });
  });
  it('sends only the pinned snapshot to detail APIs and safely encodes identities', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {},
          meta: { request_id: 'qa', generated_at: '2026-10-14T00:00:00.000Z' },
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    await expect(getCenterDetail('center-1/other', 'demo-2026-09-v1')).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/centers/center-1%2Fother?snapshot_id=demo-2026-09-v1',
      expect.any(Object),
    );
  });
});

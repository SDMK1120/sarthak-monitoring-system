import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { executiveDashboardSchema } from '@sarthak/shared';
import { buildApp } from '../src/app.js';
import { loadConfig } from '../src/config/env.js';
import { ExecutiveService } from '../src/modules/executive/service.js';
import { SyntheticExecutiveRepository } from '../src/modules/executive/repository.js';

const config = loadConfig({
  NODE_ENV: 'test',
  LOG_LEVEL: 'silent',
  WEB_ORIGIN: 'http://127.0.0.1:5173',
  DATABASE_URL: 'postgresql://local:unused@127.0.0.1:5432/test',
});
const apps: FastifyInstance[] = [];
function createApp() {
  const check = vi.fn().mockRejectedValue(new Error('database is offline'));
  const app = buildApp(config, { check, close: vi.fn().mockResolvedValue(undefined) });
  apps.push(app);
  return { app, check };
}
afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe('executive dashboard HTTP contract', () => {
  it('returns the synthetic partition without requiring a running database', async () => {
    const { app, check } = createApp();
    const response = await app.inject('/api/v1/dashboard/executive');
    expect(response.statusCode).toBe(200);
    const envelope = response.json();
    const data = executiveDashboardSchema.parse(envelope.data);
    expect(data.context.mode).toBe('synthetic_demo');
    expect(data.centers).toMatchObject({ total: 84, active: 68, inactive: 11, unknown: 5 });
    expect(data.sync.total).toBe(168);
    expect(data.sync.healthy + data.sync.degraded + data.sync.unknown).toBe(168);
    expect(data.schemes.membership_count).toBeGreaterThan(data.centers.total);
    expect(envelope.meta.request_id).toBe(response.headers['x-request-id']);
    expect(response.headers['cache-control']).toBe('no-store');
    expect(check).not.toHaveBeenCalled();
  });
  it.each([
    'unknown=1',
    'region_id=missing',
    'scheme_id=missing',
    'period_start=2026-09-01',
    'period_start=2026-02-30&period_end=2026-10-01',
    'period_start=2026-09-02&period_end=2026-10-01',
    'period_start=2026-10-01&period_end=2026-09-01',
    'period_start=2025-12-01&period_end=2026-10-01',
  ])('rejects invalid filters with a safe envelope: %s', async (query) => {
    const { app } = createApp();
    const response = await app.inject(`/api/v1/dashboard/executive?${query}`);
    expect(response.statusCode).toBe(400);
    expect(response.json().error).toMatchObject({
      code: 'VALIDATION_ERROR',
      retryable: false,
      request_id: response.headers['x-request-id'],
    });
    expect(response.body).not.toContain('stack');
  });
  it('rejects an unavailable snapshot rather than silently changing publication', async () => {
    const { app } = createApp();
    expect((await app.inject('/api/v1/dashboard/executive?snapshot_id=missing')).statusCode).toBe(
      404,
    );
  });
  it('keeps section responses consistent with the same composite snapshot', async () => {
    const { app } = createApp();
    const query = '?region_id=region-1&period_start=2026-09-01&period_end=2026-10-01';
    const composite = (await app.inject(`/api/v1/dashboard/executive${query}`)).json().data;
    for (const section of ['centers', 'schemes', 'batches', 'sync', 'trends']) {
      const response = await app.inject(`/api/v1/dashboard/${section}${query}`);
      expect(response.statusCode).toBe(200);
      expect(response.json().data[section]).toEqual(composite[section]);
      expect(response.json().data.context).toEqual(composite.context);
    }
  });
});

describe('scope and stock versus flow semantics', () => {
  const service = new ExecutiveService();
  it('keeps fixed-cutoff stock stable when the event window changes', () => {
    const all = service.getDashboard({ period_start: '2026-01-01', period_end: '2026-10-01' });
    const september = service.getDashboard({
      period_start: '2026-09-01',
      period_end: '2026-10-01',
    });
    expect(september.centers).toEqual(all.centers);
    expect(september.sync).toEqual(all.sync);
    expect(september.batches.capacity).toBe(all.batches.capacity);
    expect(september.batches.occupied_seats).toBe(all.batches.occupied_seats);
    expect(september.batches.created).toBeLessThan(all.batches.created);
    expect(september.trends).toHaveLength(1);
    expect(september.trends[0]?.batches_created).toBe(september.batches.created);
    expect(all.trends[0]?.total_centers).toBe(12);
    expect(all.trends.at(-1)?.total_centers).toBe(84);
  });
  it('intersects geographic and scheme scope but attributes batch creation to its own scheme', () => {
    const facts = new SyntheticExecutiveRepository().getSnapshot();
    const centers = facts.centers.filter(
      (center) => center.region_id === 'region-1' && center.scheme_ids.includes('scheme-1'),
    );
    const result = service.getDashboard({
      region_id: 'region-1',
      scheme_id: 'scheme-1',
      period_start: '2026-01-01',
      period_end: '2026-10-01',
    });
    expect(result.centers.total).toBe(centers.length);
    expect(
      result.center_list.every(
        (center) => center.region_id === 'region-1' && center.schemes.includes('Digital Skills'),
      ),
    ).toBe(true);
    expect(result.sync.total).toBe(centers.length * 2);
    const centerIds = new Set(centers.map((center) => center.id));
    const attributable = facts.batches.filter(
      (batch) => centerIds.has(batch.center_id) && batch.scheme_id === 'scheme-1',
    );
    expect(result.batches.created).toBe(attributable.length);
    expect(result.schemes.by_scheme).toHaveLength(1);
    expect(result.schemes.by_scheme[0]?.batches).toBe(attributable.length);
    expect(result.batches.created).toBeLessThan(
      facts.batches.filter((batch) => centerIds.has(batch.center_id)).length,
    );
  });
});

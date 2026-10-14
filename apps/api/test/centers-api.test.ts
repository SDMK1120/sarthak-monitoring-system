import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { centerListSchema, centerAnalysisSchema, centerDetailSchema, centerOptionsSchema } from '@sarthak/shared';
import { buildApp } from '../src/app.js';
import { loadConfig } from '../src/config/env.js';

const config = loadConfig({ NODE_ENV: 'test', LOG_LEVEL: 'silent', WEB_ORIGIN: 'http://127.0.0.1:5173', DATABASE_URL: 'postgresql://local:unused@127.0.0.1:5432/test' });
const apps: FastifyInstance[] = [];
function createApp() {
  const app = buildApp(config, { check: vi.fn().mockRejectedValue(new Error('offline')), close: vi.fn().mockResolvedValue(undefined) });
  apps.push(app);
  return app;
}
afterEach(async () => { await Promise.all(apps.splice(0).map((app) => app.close())); });

describe('center monitoring APIs', () => {
  it('provides typed options and stable, complete pagination', async () => {
    const app = createApp();
    const options = centerOptionsSchema.parse((await app.inject('/api/v1/centers/options')).json().data);
    expect(options.regions).toHaveLength(3);
    expect(options.districts).toHaveLength(12);
    const query = '?page_size=10&sort=name&order=asc';
    const first = centerListSchema.parse((await app.inject(`/api/v1/centers${query}`)).json().data);
    expect(first).toMatchObject({ matching_total: 84, page: 1, page_size: 10, total_pages: 9 });
    expect(centerListSchema.parse((await app.inject(`/api/v1/centers${query}`)).json().data)).toEqual(first);
    const ids: string[] = [];
    for (let page = 1; page <= first.total_pages; page++) {
      const result = centerListSchema.parse((await app.inject(`/api/v1/centers${query}&page=${page}`)).json().data);
      ids.push(...result.items.map((center) => center.id));
      expect(result.context.snapshot_id).toBe(first.context.snapshot_id);
    }
    expect(ids).toHaveLength(84);
    expect(new Set(ids).size).toBe(84);
    expect((await app.inject(`/api/v1/centers${query}&page=10`)).json().data.items).toEqual([]);
  });
  it.each(['page=0', 'page=-1', 'page=1.5', 'page=01', 'page=1000001', 'page_size=51', 'page_size=0', 'sort=secret', 'order=up', 'activity_status=offline', 'unknown=1', 'search=' + 'x'.repeat(101), 'region_id=missing', 'district_id=missing', 'scheme_id=missing', 'region_id=region-1&district_id=district-8'])('rejects unsupported filters: %s', async (query) => {
    const app = createApp();
    const response = await app.inject(`/api/v1/centers?${query}`);
    expect(response.statusCode).toBe(400);
    expect(response.json().error).toMatchObject({ code: 'VALIDATION_ERROR', retryable: false });
  });
  it('uses the same compound population for list and pre-status analysis', async () => {
    const app = createApp();
    const query = '?region_id=region-1&district_id=district-1&scheme_id=scheme-1&search=SAR&activity_status=active&page_size=50';
    const list = centerListSchema.parse((await app.inject(`/api/v1/centers${query}`)).json().data);
    const analysis = centerAnalysisSchema.parse((await app.inject(`/api/v1/centers/analysis${query}`)).json().data);
    const beforeStatus = centerListSchema.parse((await app.inject(`/api/v1/centers${query.replace('&activity_status=active', '')}`)).json().data);
    expect(list.matching_total).toBe(analysis.matching_total);
    expect(analysis.scope_before_status.total).toBe(beforeStatus.matching_total);
    expect(analysis.scope_before_status.active).toBe(list.matching_total);
    expect(analysis.selected_activity_status).toBe('active');
    expect(list.items.length).toBeGreaterThan(0);
    expect(list.items.every((center) => center.region_id === 'region-1' && center.district_id === 'district-1' && center.schemes.some((scheme) => scheme.id === 'scheme-1') && center.activity_status === 'active')).toBe(true);
  });
  it('keeps unknown classifications and pre-status counts visible under pagination', async () => {
    const app = createApp();
    const response = await app.inject('/api/v1/centers/analysis?activity_status=unknown&page=2&page_size=1');
    const analysis = centerAnalysisSchema.parse(response.json().data);
    expect(analysis.scope_before_status).toMatchObject({ total: 84, active: 68, inactive: 11, unknown: 5 });
    expect(analysis.matching_total).toBe(5);
    expect(analysis.by_region.reduce((sum, region) => sum + region.counts.total, 0)).toBe(84);
    expect(analysis.by_district.reduce((sum, district) => sum + district.counts.total, 0)).toBe(84);
    const list = centerListSchema.parse((await app.inject('/api/v1/centers?activity_status=unknown&page=2&page_size=1')).json().data);
    expect(list.items).toHaveLength(1);
    expect(list.items[0]?.activity_status).toBe('unknown');
    expect(list.matching_total).toBe(5);
  });
  it('returns scoped empty results without converting missing data to negative outcomes', async () => {
    const app = createApp();
    const list = centerListSchema.parse((await app.inject('/api/v1/centers?search=does-not-exist')).json().data);
    const analysis = centerAnalysisSchema.parse((await app.inject('/api/v1/centers/analysis?search=does-not-exist')).json().data);
    expect(list).toMatchObject({ matching_total: 0, total_pages: 0, items: [] });
    expect(analysis.scope_before_status).toMatchObject({ total: 0, active: 0, inactive: 0, unknown: 0, classifiable_percent: null });
  });
  it('preserves pinned snapshot and rejects missing centers and inappropriate detail filters', async () => {
    const app = createApp();
    for (const url of ['/api/v1/centers?snapshot_id=missing', '/api/v1/centers/analysis?snapshot_id=missing', '/api/v1/centers/center-1?snapshot_id=missing', '/api/v1/centers/not-real']) {
      expect((await app.inject(url)).statusCode).toBe(404);
    }
    expect((await app.inject('/api/v1/centers/center-1?activity_status=active')).statusCode).toBe(400);
  });
  it('reconciles detail capacity and sync evidence to executive facts', async () => {
    const app = createApp();
    const executive = (await app.inject('/api/v1/dashboard/executive?period_start=2026-01-01&period_end=2026-10-01')).json().data;
    for (const id of ['center-1', 'center-5', 'center-18']) {
      const detail = centerDetailSchema.parse((await app.inject(`/api/v1/centers/${id}`)).json().data);
      const executiveCenter = executive.center_list.find((center: { id: string }) => center.id === id);
      expect(detail.profile).toMatchObject({ id, activity_status: executiveCenter.activity_status, sync_state: executiveCenter.sync_state, batch_count: executiveCenter.batch_count, enrollments: executiveCenter.enrollments });
      const comparable = detail.batches.filter((batch) => batch.lifecycle !== 'completed' && batch.capacity !== null && batch.capacity > 0);
      const capacity = comparable.reduce((sum, batch) => sum + batch.capacity!, 0);
      const seats = comparable.reduce((sum, batch) => sum + batch.occupied_seats, 0);
      expect(detail.batch_summary).toMatchObject({ comparable: comparable.length, occupied_seats: seats, capacity });
      expect(detail.batch_summary.utilization_percent).toBe(capacity ? Math.round(seats / capacity * 1000) / 10 : null);
      expect(detail.sync_summary.total).toBe(detail.sync_targets.length);
      for (const state of ['healthy', 'degraded', 'unknown'] as const) expect(detail.sync_summary[state]).toBe(detail.sync_targets.filter((target) => target.state === state).length);
      expect(detail.sync_targets.every((target) => target.reason.length > 0)).toBe(true);
      expect(detail.context.snapshot_id).toBe(executive.context.snapshot_id);
    }
  });
});

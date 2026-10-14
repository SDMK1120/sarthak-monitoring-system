import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FastifyInstance } from 'fastify';
import {
  synchronizationAlertsSchema,
  synchronizationDashboardSchema,
  synchronizationOptionsSchema,
  synchronizationTargetDetailSchema,
  synchronizationRulesResponseSchema,
} from '@sarthak/shared';
import { buildApp } from '../src/app.js';
import { loadConfig } from '../src/config/env.js';

const config = loadConfig({
  NODE_ENV: 'test',
  LOG_LEVEL: 'silent',
  WEB_ORIGIN: 'http://127.0.0.1:5173',
  DATABASE_URL: 'postgresql://local:unused@127.0.0.1:5432/test',
});
const apps: FastifyInstance[] = [];
function createApp() {
  const app = buildApp(config, {
    check: vi.fn().mockRejectedValue(new Error('offline')),
    close: vi.fn().mockResolvedValue(undefined),
  });
  apps.push(app);
  return app;
}
afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(apps.splice(0).map((app) => app.close()));
});
const base = '/api/v1/synchronization';

describe('synchronization monitoring HTTP contract', () => {
  it('preserves executive target roster and distinguishes failure observations from degraded health', async () => {
    const app = createApp();
    const response = await app.inject(`${base}/dashboard`);
    expect(response.statusCode).toBe(200);
    const dashboard = synchronizationDashboardSchema.parse(response.json().data);
    const executive = (await app.inject('/api/v1/dashboard/executive')).json().data;
    expect(dashboard.scope_before_state_result).toMatchObject({
      total: executive.sync.total,
      healthy: executive.sync.healthy,
      degraded: executive.sync.degraded,
      unknown: executive.sync.unknown,
      health_percent: executive.sync.health_percent,
    });
    expect(dashboard.latest_failed).toBeLessThan(dashboard.scope_before_state_result.degraded);
    expect(dashboard.context.data_as_of).toBe(executive.context.data_as_of);
    expect(response.headers['cache-control']).toBe('no-store');
    const options = synchronizationOptionsSchema.parse(
      (await app.inject(`${base}/options`)).json().data,
    );
    expect(options.centers).toHaveLength(84);
  });
  it('paginates the full expected roster deterministically and exposes offline healthy targets', async () => {
    const app = createApp();
    const all = [];
    for (let page = 1; page <= 4; page++) {
      const result = synchronizationDashboardSchema.parse(
        (await app.inject(`${base}/dashboard?page_size=50&page=${page}`)).json().data,
      );
      all.push(...result.items);
    }
    expect(all).toHaveLength(168);
    expect(new Set(all.map((target) => target.id)).size).toBe(168);
    expect(
      all.some((target) => target.connectivity === 'offline' && target.state === 'healthy'),
    ).toBe(true);
    const twice = (await app.inject(`${base}/dashboard?page_size=50&page=2`)).json().data;
    expect(twice.items).toEqual(all.slice(50, 100));
    expect(all.some((target) => target.latest_at !== target.last_success_at)).toBe(true);
  });
  it.each([
    'page=0',
    'page=01',
    'page_size=51',
    'state=offline',
    'result=degraded',
    'search=' + 'x'.repeat(101),
    'extra=1',
    'region_id=missing',
    'district_id=missing',
    'center_id=missing',
    'region_id=region-1&district_id=district-8',
    'region_id=region-2&center_id=center-1',
  ])('rejects invalid monitoring scope: %s', async (query) => {
    const app = createApp();
    const response = await app.inject(`${base}/dashboard?${query}`);
    expect(response.statusCode).toBe(400);
    expect(response.json().error).toMatchObject({ code: 'VALIDATION_ERROR', retryable: false });
  });
  it('intersects center and geography filters while preserving pre-state health counts', async () => {
    const app = createApp();
    const full = synchronizationDashboardSchema.parse(
      (
        await app.inject(
          `${base}/dashboard?region_id=region-1&district_id=district-1&center_id=center-1`,
        )
      ).json().data,
    );
    expect(full.scope_before_state_result.total).toBe(2);
    const failed = synchronizationDashboardSchema.parse(
      (
        await app.inject(
          `${base}/dashboard?region_id=region-1&district_id=district-1&center_id=center-1&state=degraded&result=failed`,
        )
      ).json().data,
    );
    expect(failed.scope_before_state_result).toEqual(full.scope_before_state_result);
    expect(
      failed.items.every(
        (target) =>
          target.center_id === 'center-1' &&
          target.state === 'degraded' &&
          target.result === 'failed',
      ),
    ).toBe(true);
    expect(failed.matching_total).toBe(1);
  });
  it('deduplicates primary alerts per target and keeps missing observations informational without role escalation', async () => {
    const app = createApp();
    const first = synchronizationAlertsSchema.parse(
      (await app.inject(`${base}/alerts?page_size=50`)).json().data,
    );
    const alerts = [...first.items];
    for (let page = 2; page <= first.total_pages; page++)
      alerts.push(
        ...synchronizationAlertsSchema.parse(
          (await app.inject(`${base}/alerts?page_size=50&page=${page}`)).json().data,
        ).items,
      );
    expect(new Set(alerts.map((alert) => alert.target_id)).size).toBe(alerts.length);
    expect(alerts.length).toBe(first.matching_total);
    expect(alerts.some((alert) => alert.cause === 'missing_evidence')).toBe(true);
    for (const alert of alerts.filter((alert) => alert.cause === 'missing_evidence'))
      expect(alert).toMatchObject({
        severity: 'information',
        recommended_role: null,
        age_hours: null,
      });
  });
  it('returns full evidence timestamps and rejects missing detail or pinned publication', async () => {
    const app = createApp();
    const detail = synchronizationTargetDetailSchema.parse(
      (await app.inject(`${base}/targets/target-6`)).json().data,
    );
    expect(detail.target).toMatchObject({
      latest_at: '2026-09-30T08:00:00.000Z',
      last_success_at: '2026-09-28T08:00:00.000Z',
      observation_age_hours: 4,
      success_age_hours: 52,
      state: 'degraded',
    });
    expect((await app.inject(`${base}/targets/not-real`)).statusCode).toBe(404);
    for (const route of ['/dashboard', '/alerts', '/rules', '/targets/target-6'])
      expect((await app.inject(`${base}${route}?snapshot_id=missing`)).statusCode).toBe(404);
    expect((await app.inject(`${base}/targets/target-6?state=degraded`)).statusCode).toBe(400);
  });
  it('evaluates modified rules request-locally without changing subsequent rules or alerts', async () => {
    const app = createApp();
    const original = synchronizationRulesResponseSchema.parse(
      (await app.inject(`${base}/rules`)).json().data,
    );
    expect(original).toMatchObject({ persistence: 'request_local_preview', delivery: 'none' });
    const before = (await app.inject(`${base}/alerts?page_size=50`)).json().data;
    const preview = await app.inject({
      method: 'POST',
      url: `${base}/rules/evaluate`,
      payload: { filters: { center_id: 'center-1' }, rules: { ...original.rules, enabled: false } },
    });
    expect(preview.statusCode).toBe(200);
    const evaluation = synchronizationAlertsSchema.parse(preview.json().data);
    expect(evaluation).toMatchObject({ preview: true, matching_total: 2 });
    expect(evaluation.items.every((alert) => alert.recommended_role === null)).toBe(true);
    const edited = await app.inject({
      method: 'POST',
      url: `${base}/rules/evaluate`,
      payload: {
        filters: { center_id: 'center-1' },
        rules: {
          ...original.rules,
          thresholds: [
            { role: 'CM', after_hours: 0 },
            { role: 'JDM', after_hours: 5 },
            { role: 'SDM', after_hours: 10 },
            { role: 'Super Admin', after_hours: 24 },
          ],
          severity: { ...original.rules.severity, failed: 'information' },
        },
      },
    });
    expect(edited.statusCode).toBe(200);
    expect(
      synchronizationAlertsSchema
        .parse(edited.json().data)
        .items.find((alert) => alert.cause === 'failed'),
    ).toMatchObject({ severity: 'information', recommended_role: 'CM', age_hours: 4 });
    expect((await app.inject(`${base}/rules`)).json().data).toEqual(original);
    expect((await app.inject(`${base}/alerts?page_size=50`)).json().data).toEqual(before);
  });
  it('validates rule order, increasing durations, safe payload limits and unsupported fields', async () => {
    const app = createApp();
    const rules = synchronizationRulesResponseSchema.parse(
      (await app.inject(`${base}/rules`)).json().data,
    ).rules;
    const badRules = [
      {
        ...rules,
        thresholds: rules.thresholds.map((threshold) => ({ ...threshold, after_hours: 0 })),
      },
      { ...rules, thresholds: [...rules.thresholds].reverse() },
      { ...rules, severity: { ...rules.severity, failed: 'fatal' } },
      { ...rules, extra: true },
    ];
    for (const candidate of badRules) {
      const response = await app.inject({
        method: 'POST',
        url: `${base}/rules/evaluate`,
        payload: { rules: candidate },
      });
      expect(response.statusCode).toBe(400);
      expect(response.json().error.code).toBe('VALIDATION_ERROR');
    }
    const oversized = await app.inject({
      method: 'POST',
      url: `${base}/rules/evaluate`,
      payload: { rules, private_value: 'private'.repeat(160_000) },
    });
    expect(oversized.statusCode).toBe(413);
    expect(oversized.body).not.toContain('private_value');
  });
});

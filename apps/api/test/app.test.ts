import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';
import { loadConfig } from '../src/config/env.js';
import { AppError } from '../src/lib/errors.js';
import type { DatabaseConnection } from '../src/lib/database.js';

const apps: FastifyInstance[] = [];
const config = loadConfig({ NODE_ENV: 'test', LOG_LEVEL: 'silent', WEB_ORIGIN: 'http://127.0.0.1:5173', DATABASE_URL: 'postgresql://local:unused@127.0.0.1:5432/test' });
function createApp(database: DatabaseConnection = { check: vi.fn().mockResolvedValue(undefined), close: vi.fn().mockResolvedValue(undefined) }) {
  const app = buildApp(config, database);
  apps.push(app);
  return app;
}
afterEach(async () => { await Promise.all(apps.splice(0).map((app) => app.close())); });

describe('infrastructure routes and errors', () => {
  it('is live independently of database availability and generates trusted request IDs', async () => {
    const check = vi.fn().mockRejectedValue(new Error('credential-bearing database error'));
    const app = createApp({ check, close: vi.fn().mockResolvedValue(undefined) });
    const result = await app.inject({ url: '/api/health/live', headers: { 'x-request-id': 'untrusted' } });
    expect(result.statusCode).toBe(200);
    expect(result.json().data.status).toBe('ok');
    expect(result.json().meta.request_id).toBe(result.headers['x-request-id']);
    expect(result.headers['x-request-id']).not.toBe('untrusted');
    expect(check).not.toHaveBeenCalled();
  });
  it('checks database readiness and closes the connection on shutdown', async () => {
    const close = vi.fn().mockResolvedValue(undefined);
    const check = vi.fn().mockResolvedValue(undefined);
    const app = createApp({ close, check });
    expect((await app.inject('/api/health/ready')).json().data.database).toBe('connected');
    expect(check).toHaveBeenCalledOnce();
    await app.close();
    expect(close).toHaveBeenCalledOnce();
  });
  it('returns safe unavailable and not-found envelopes', async () => {
    const app = createApp({ check: vi.fn().mockRejectedValue(new Error('secret')), close: vi.fn().mockResolvedValue(undefined) });
    const result = await app.inject('/api/health/ready');
    expect(result.statusCode).toBe(503);
    expect(result.json().error.code).toBe('SERVICE_UNAVAILABLE');
    expect(result.body).not.toContain('secret');
    const missing = await app.inject('/api/v1/not-implemented');
    expect(missing.statusCode).toBe(404);
    expect(missing.json().error.retryable).toBe(false);
  });
  it('masks unexpected errors and preserves safe expected errors', async () => {
    const app = createApp();
    app.get('/test-failure', async () => { throw new Error('private token and stack'); });
    app.get('/test-expected', async () => { throw new AppError(409, 'CONFLICT', 'Request conflict.'); });
    const failure = await app.inject('/test-failure');
    expect(failure.statusCode).toBe(500);
    expect(failure.body).not.toContain('private');
    expect(failure.json().error.request_id).toBe(failure.headers['x-request-id']);
    const expected = await app.inject('/test-expected');
    expect(expected.statusCode).toBe(409);
    expect(expected.json().error.code).toBe('CONFLICT');
  });
  it('returns a consistent error for invalid JSON and schema validation', async () => {
    const app = createApp();
    app.post('/test-validation', { schema: { body: { type: 'object', required: ['name'], properties: { name: { type: 'string' } } } } }, async () => ({ ok: true }));
    const invalid = await app.inject({ method: 'POST', url: '/test-validation', payload: {} });
    expect(invalid.statusCode).toBe(400);
    expect(invalid.json().error.code).toBe('VALIDATION_ERROR');
    const malformed = await app.inject({ method: 'POST', url: '/test-validation', headers: { 'content-type': 'application/json' }, payload: '{broken' });
    expect(malformed.statusCode).toBe(400);
  });
  it('preserves safe client errors for oversized and unsupported request bodies', async () => {
    const app = createApp();
    app.post('/test-body', async () => ({ ok: true }));
    const oversized = await app.inject({ method: 'POST', url: '/test-body', headers: { 'content-type': 'application/json' }, payload: JSON.stringify({ value: 'x'.repeat(1024 * 1024) }) });
    expect(oversized.statusCode).toBe(413);
    expect(oversized.json().error.retryable).toBe(false);
    const unsupported = await app.inject({ method: 'POST', url: '/test-body', headers: { 'content-type': 'application/octet-stream' }, payload: 'private-body' });
    expect(unsupported.statusCode).toBe(415);
    expect(unsupported.body).not.toContain('private-body');
  });
});

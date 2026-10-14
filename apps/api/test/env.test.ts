import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config/env.js';

const base = { WEB_ORIGIN: 'http://127.0.0.1:5173', DATABASE_URL: 'postgresql://local:secret@127.0.0.1:5432/test' };

describe('environment validation', () => {
  it('parses typed defaults and false without JavaScript truthiness', () => {
    const config = loadConfig(base);
    expect(config.PORT).toBe(3001);
    expect(config.DATABASE_TLS).toBe(false);
  });
  it('rejects missing or malformed values without exposing credentials', () => {
    expect(() => loadConfig({ ...base, PORT: 'invalid', DATABASE_URL: 'secret-value' })).toThrow('PORT');
    expect(() => loadConfig({ ...base, DATABASE_URL: 'secret-value' })).not.toThrow('secret-value');
  });
  it('requires verified TLS for production and disallows URL TLS overrides', () => {
    expect(() => loadConfig({ ...base, NODE_ENV: 'production' })).toThrow('DATABASE_TLS');
    expect(() => loadConfig({ ...base, DATABASE_TLS: 'true', DATABASE_URL: `${base.DATABASE_URL}?sslmode=no-verify` })).toThrow('DATABASE_URL');
  });
  it('rejects a wildcard, path-bearing origin, and a CA file without TLS', () => {
    expect(() => loadConfig({ ...base, WEB_ORIGIN: '*' })).toThrow('WEB_ORIGIN');
    expect(() => loadConfig({ ...base, WEB_ORIGIN: `${base.WEB_ORIGIN}/path` })).toThrow('WEB_ORIGIN');
    expect(() => loadConfig({ ...base, DATABASE_CA_FILE: 'local.pem' })).toThrow('DATABASE_CA_FILE');
  });
});

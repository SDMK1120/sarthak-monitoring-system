import { readFileSync } from 'node:fs';
import pg from 'pg';
import type { FastifyBaseLogger } from 'fastify';
import type { AppConfig } from '../config/env.js';

export interface DatabaseConnection {
  check(): Promise<void>;
  close(): Promise<void>;
}

export function createDatabase(config: AppConfig, logger: Pick<FastifyBaseLogger, 'error'>): DatabaseConnection {
  const ca = config.DATABASE_CA_FILE ? readFileSync(config.DATABASE_CA_FILE, 'utf8') : undefined;
  const pool = new pg.Pool({
    connectionString: config.DATABASE_URL,
    max: config.DATABASE_POOL_MAX,
    connectionTimeoutMillis: config.DATABASE_CONNECTION_TIMEOUT_MS,
    query_timeout: config.DATABASE_QUERY_TIMEOUT_MS,
    idleTimeoutMillis: 30000,
    ssl: config.DATABASE_TLS ? { rejectUnauthorized: true, ...(ca ? { ca } : {}) } : false,
  });
  // Prevent an idle connection failure becoming an unhandled EventEmitter error.
  pool.on('error', () => logger.error({ event: 'database_idle_connection_failure' }, 'PostgreSQL idle connection failed'));
  return {
    async check() { await pool.query('SELECT 1'); },
    async close() { await pool.end(); },
  };
}

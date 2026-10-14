import { randomUUID } from 'node:crypto';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import type { ApiSuccess, HealthData } from '@sarthak/shared';
import type { AppConfig } from './config/env.js';
import { createDatabase } from './lib/database.js';
import type { DatabaseConnection } from './lib/database.js';
import { AppError, registerErrorHandling } from './lib/errors.js';
import { loggerOptions } from './lib/logger.js';
import { executiveRoutes } from './modules/executive/routes.js';
import { centerRoutes } from './modules/centers/routes.js';
import { synchronizationRoutes } from './modules/synchronization/routes.js';

export function buildApp(config: AppConfig, database?: DatabaseConnection) {
  const app = Fastify({
    logger: loggerOptions(config),
    genReqId: () => randomUUID(),
    requestIdHeader: false,
    bodyLimit: 1024 * 1024,
    requestTimeout: 10000,
  });
  const connection = database ?? createDatabase(config, app.log);
  app.addHook('onClose', async () => connection.close());
  app.addHook('onRequest', async (request, reply) => {
    reply.header('X-Request-Id', request.id);
    reply.header('Cache-Control', 'no-store');
  });
  registerErrorHandling(app);
  app.register(cors, { origin: config.WEB_ORIGIN, credentials: false });
  app.register(executiveRoutes);
  app.register(centerRoutes);
  app.register(synchronizationRoutes);

  app.get('/api/health/live', async (request): Promise<ApiSuccess<HealthData>> => ({
    data: { service: 'sarthak-api', status: 'ok' },
    meta: { request_id: request.id, generated_at: new Date().toISOString() },
  }));
  app.get('/api/health/ready', async (request): Promise<ApiSuccess<HealthData>> => {
    try {
      await connection.check();
    } catch {
      throw new AppError(503, 'SERVICE_UNAVAILABLE', 'Database connection is unavailable.');
    }
    return {
      data: { service: 'sarthak-api', status: 'ready', database: 'connected' },
      meta: { request_id: request.id, generated_at: new Date().toISOString() },
    };
  });
  return app;
}

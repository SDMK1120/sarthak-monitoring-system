import type { FastifyInstance } from 'fastify';
import { SynchronizationService } from './service.js';

export async function synchronizationRoutes(app: FastifyInstance): Promise<void> {
  const service = new SynchronizationService();
  app.get('/api/v1/synchronization/options', async (request) => ({
    data: service.getOptions(request.query),
    meta: { request_id: request.id, generated_at: new Date().toISOString() },
  }));
  app.get('/api/v1/synchronization/dashboard', async (request) => ({
    data: service.getDashboard(request.query),
    meta: { request_id: request.id, generated_at: new Date().toISOString() },
  }));
  app.get('/api/v1/synchronization/alerts', async (request) => ({
    data: service.getAlerts(request.query),
    meta: { request_id: request.id, generated_at: new Date().toISOString() },
  }));
  app.get('/api/v1/synchronization/rules', async (request) => ({
    data: service.getRules(request.query),
    meta: { request_id: request.id, generated_at: new Date().toISOString() },
  }));
  app.post('/api/v1/synchronization/rules/evaluate', async (request) => ({
    data: service.evaluate(request.body),
    meta: { request_id: request.id, generated_at: new Date().toISOString() },
  }));
  app.get<{ Params: { id: string } }>('/api/v1/synchronization/targets/:id', async (request) => ({
    data: service.getTargetDetail(request.params.id, request.query),
    meta: { request_id: request.id, generated_at: new Date().toISOString() },
  }));
}

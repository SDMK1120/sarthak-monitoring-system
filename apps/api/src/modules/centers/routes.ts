import type { FastifyInstance } from 'fastify';
import { CenterService } from './service.js';

export async function centerRoutes(app: FastifyInstance): Promise<void> {
  const service = new CenterService();
  app.get('/api/v1/centers/options', async (request) => ({
    data: service.getOptions(request.query),
    meta: { request_id: request.id, generated_at: new Date().toISOString() },
  }));
  app.get('/api/v1/centers/analysis', async (request) => ({
    data: service.getAnalysis(request.query),
    meta: { request_id: request.id, generated_at: new Date().toISOString() },
  }));
  app.get('/api/v1/centers', async (request) => ({
    data: service.getList(request.query),
    meta: { request_id: request.id, generated_at: new Date().toISOString() },
  }));
  app.get<{ Params: { id: string } }>('/api/v1/centers/:id', async (request) => ({
    data: service.getDetail(request.params.id, request.query),
    meta: { request_id: request.id, generated_at: new Date().toISOString() },
  }));
}

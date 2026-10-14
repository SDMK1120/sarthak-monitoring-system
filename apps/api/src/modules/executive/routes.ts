import type { ApiSuccess } from '@sarthak/shared';
import type { FastifyInstance } from 'fastify';
import { ExecutiveService } from './service.js';

export async function executiveRoutes(app: FastifyInstance): Promise<void> {
  const service = new ExecutiveService();
  app.get(
    '/api/v1/dashboard/filters',
    async (request): Promise<ApiSuccess<ReturnType<ExecutiveService['getOptions']>>> => ({
      data: service.getOptions(),
      meta: { request_id: request.id, generated_at: new Date().toISOString() },
    }),
  );
  app.get('/api/v1/dashboard/executive', async (request) => ({
    data: service.getDashboard(request.query),
    meta: { request_id: request.id, generated_at: new Date().toISOString() },
  }));
  const sections = ['centers', 'schemes', 'batches', 'sync', 'trends'] as const;
  for (const section of sections) {
    app.get(`/api/v1/dashboard/${section}`, async (request) => {
      const dashboard = service.getDashboard(request.query);
      return {
        data: {
          context: dashboard.context,
          [section]: dashboard[section],
          ...(section === 'centers' ? { center_list: dashboard.center_list } : {}),
        },
        meta: { request_id: request.id, generated_at: new Date().toISOString() },
      };
    });
  }
}

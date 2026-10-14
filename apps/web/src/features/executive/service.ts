import {
  dashboardOptionsSchema,
  executiveDashboardSchema,
  executiveQuerySchema,
} from '@sarthak/shared';
import type { DashboardOptions, ExecutiveDashboard, ExecutiveQuery } from '@sarthak/shared';
import { apiGet, ApiClientError } from '../../lib/api';

export async function getDashboardOptions(signal?: AbortSignal): Promise<DashboardOptions> {
  const result = await apiGet<unknown>('/v1/dashboard/filters', signal);
  const parsed = dashboardOptionsSchema.safeParse(result.data);
  if (!parsed.success)
    throw new ApiClientError('INVALID_RESPONSE', 'Dashboard options could not be verified.');
  return parsed.data;
}

export async function getExecutiveDashboard(
  query: ExecutiveQuery,
  signal?: AbortSignal,
): Promise<ExecutiveDashboard> {
  const validated = executiveQuerySchema.parse(query);
  const parameters = new URLSearchParams();
  for (const [key, value] of Object.entries(validated))
    if (value !== undefined) parameters.set(key, value);
  const result = await apiGet<unknown>(`/v1/dashboard/executive?${parameters.toString()}`, signal);
  const parsed = executiveDashboardSchema.safeParse(result.data);
  if (!parsed.success)
    throw new ApiClientError('INVALID_RESPONSE', 'Dashboard data could not be verified.');
  return parsed.data;
}

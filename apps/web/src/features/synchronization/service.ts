import {
  synchronizationAlertsSchema,
  synchronizationDashboardSchema,
  synchronizationEvaluationRequestSchema,
  synchronizationOptionsSchema,
  synchronizationQuerySchema,
  synchronizationRulesResponseSchema,
  synchronizationTargetDetailSchema,
} from '@sarthak/shared';
import type { SynchronizationQuery, SynchronizationRules } from '@sarthak/shared';
import { apiGet, apiPost, ApiClientError } from '../../lib/api';

export function readSynchronizationQuery(search = window.location.search): SynchronizationQuery {
  const values: Record<string, string> = {};
  for (const [key, value] of new URLSearchParams(search)) {
    if (key in values)
      throw new ApiClientError(
        'VALIDATION_ERROR',
        'Repeated synchronization filters are not supported. Reset filters to continue.',
      );
    values[key] = value;
  }
  const result = synchronizationQuerySchema.safeParse(values);
  if (!result.success)
    throw new ApiClientError(
      'VALIDATION_ERROR',
      'The synchronization URL contains invalid filters. Reset filters to continue.',
    );
  return result.data;
}

export function synchronizationSearch(query: SynchronizationQuery): string {
  const values = new URLSearchParams();
  for (const [key, value] of Object.entries(synchronizationQuerySchema.parse(query)))
    if (value !== undefined && value !== '') values.set(key, String(value));
  return `?${values.toString()}`;
}

export async function getSynchronizationOptions(signal?: AbortSignal) {
  const response = await apiGet<unknown>('/v1/synchronization/options', signal);
  const result = synchronizationOptionsSchema.safeParse(response.data);
  if (!result.success)
    throw new ApiClientError('INVALID_RESPONSE', 'Synchronization options could not be verified.');
  return result.data;
}
export async function getSynchronizationDashboard(
  query: SynchronizationQuery,
  signal?: AbortSignal,
) {
  const response = await apiGet<unknown>(
    `/v1/synchronization/dashboard${synchronizationSearch(query)}`,
    signal,
  );
  const result = synchronizationDashboardSchema.safeParse(response.data);
  if (!result.success)
    throw new ApiClientError(
      'INVALID_RESPONSE',
      'Synchronization dashboard could not be verified.',
    );
  return result.data;
}
export async function getSynchronizationAlerts(query: SynchronizationQuery, signal?: AbortSignal) {
  const response = await apiGet<unknown>(
    `/v1/synchronization/alerts${synchronizationSearch(query)}`,
    signal,
  );
  const result = synchronizationAlertsSchema.safeParse(response.data);
  if (!result.success)
    throw new ApiClientError('INVALID_RESPONSE', 'Synchronization alerts could not be verified.');
  return result.data;
}
export async function getSynchronizationRules(snapshotId?: string, signal?: AbortSignal) {
  const query = snapshotId ? `?${new URLSearchParams({ snapshot_id: snapshotId })}` : '';
  const response = await apiGet<unknown>(`/v1/synchronization/rules${query}`, signal);
  const result = synchronizationRulesResponseSchema.safeParse(response.data);
  if (!result.success)
    throw new ApiClientError('INVALID_RESPONSE', 'Escalation rules could not be verified.');
  return result.data;
}
export async function getSynchronizationTarget(
  id: string,
  snapshotId?: string,
  signal?: AbortSignal,
) {
  const query = snapshotId ? `?${new URLSearchParams({ snapshot_id: snapshotId })}` : '';
  const response = await apiGet<unknown>(
    `/v1/synchronization/targets/${encodeURIComponent(id)}${query}`,
    signal,
  );
  const result = synchronizationTargetDetailSchema.safeParse(response.data);
  if (!result.success)
    throw new ApiClientError('INVALID_RESPONSE', 'Synchronization target could not be verified.');
  return result.data;
}
export async function evaluateSynchronizationRules(
  filters: SynchronizationQuery,
  rules: SynchronizationRules,
  signal?: AbortSignal,
) {
  const body = synchronizationEvaluationRequestSchema.safeParse({ filters, rules });
  if (!body.success)
    throw new ApiClientError(
      'VALIDATION_ERROR',
      'Use strictly increasing escalation hours: CM at 0, then JDM, SDM and Super Admin.',
    );
  const response = await apiPost<unknown>('/v1/synchronization/rules/evaluate', body.data, signal);
  const result = synchronizationAlertsSchema.safeParse(response.data);
  if (
    !result.success ||
    !result.data.preview ||
    (filters.snapshot_id && result.data.context.snapshot_id !== filters.snapshot_id)
  )
    throw new ApiClientError('INVALID_RESPONSE', 'Escalation preview could not be verified.');
  return result.data;
}

import {
  centerAnalysisSchema,
  centerDetailSchema,
  centerListSchema,
  centerOptionsSchema,
  centerQuerySchema,
} from '@sarthak/shared';
import type { CenterQuery } from '@sarthak/shared';
import { apiGet, ApiClientError } from '../../lib/api';

export function readCenterQuery(search = window.location.search): CenterQuery {
  const parameters = new URLSearchParams(search);
  const values: Record<string, string> = {};
  for (const [key, value] of parameters) {
    if (key in values)
      throw new ApiClientError(
        'VALIDATION_ERROR',
        'Repeated center filters are not supported. Reset filters to continue.',
      );
    values[key] = value;
  }
  const parsed = centerQuerySchema.safeParse(values);
  if (!parsed.success)
    throw new ApiClientError(
      'VALIDATION_ERROR',
      'The center URL contains invalid filters. Reset filters to continue.',
    );
  return parsed.data;
}

export function centerSearch(query: CenterQuery): string {
  const values = new URLSearchParams();
  for (const [key, value] of Object.entries(centerQuerySchema.parse(query)))
    if (value !== undefined && value !== '') values.set(key, String(value));
  return `?${values.toString()}`;
}

export async function getCenterOptions(signal?: AbortSignal) {
  const response = await apiGet<unknown>('/v1/centers/options', signal);
  const parsed = centerOptionsSchema.safeParse(response.data);
  if (!parsed.success)
    throw new ApiClientError('INVALID_RESPONSE', 'Center filter options could not be verified.');
  return parsed.data;
}

export async function getCenters(query: CenterQuery, signal?: AbortSignal) {
  const response = await apiGet<unknown>(`/v1/centers${centerSearch(query)}`, signal);
  const parsed = centerListSchema.safeParse(response.data);
  if (!parsed.success)
    throw new ApiClientError('INVALID_RESPONSE', 'Center listing could not be verified.');
  return parsed.data;
}

export async function getCenterAnalysis(query: CenterQuery, signal?: AbortSignal) {
  const response = await apiGet<unknown>(`/v1/centers/analysis${centerSearch(query)}`, signal);
  const parsed = centerAnalysisSchema.safeParse(response.data);
  if (!parsed.success)
    throw new ApiClientError('INVALID_RESPONSE', 'Center analysis could not be verified.');
  return parsed.data;
}

export async function getCenterDetail(id: string, snapshotId?: string, signal?: AbortSignal) {
  const parameters = new URLSearchParams();
  if (snapshotId) parameters.set('snapshot_id', snapshotId);
  const response = await apiGet<unknown>(
    `/v1/centers/${encodeURIComponent(id)}${parameters.size ? `?${parameters}` : ''}`,
    signal,
  );
  const parsed = centerDetailSchema.safeParse(response.data);
  if (!parsed.success)
    throw new ApiClientError('INVALID_RESPONSE', 'Center details could not be verified.');
  return parsed.data;
}

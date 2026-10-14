import { errorCodes } from '@sarthak/shared';
import type { ApiError, ApiSuccess, ErrorCode } from '@sarthak/shared';
import { webConfig } from '../config/env';
import { logger } from './logger';

export class ApiClientError extends Error {
  constructor(public readonly code: ErrorCode, message: string, public readonly requestId?: string) {
    super(message);
    this.name = 'ApiClientError';
  }
}

function isApiError(value: unknown): value is ApiError {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.code === 'string' && (errorCodes as readonly string[]).includes(record.code)
    && typeof record.message === 'string' && typeof record.retryable === 'boolean'
    && typeof record.request_id === 'string' && record.request_id.length <= 128;
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<ApiSuccess<T>> {
  return apiRequest<T>(path, 'GET', undefined, signal);
}

export async function apiPost<T>(path: string, body: unknown, signal?: AbortSignal): Promise<ApiSuccess<T>> {
  return apiRequest<T>(path, 'POST', body, signal);
}

async function apiRequest<T>(path: string, method: 'GET' | 'POST', requestBody: unknown, signal?: AbortSignal): Promise<ApiSuccess<T>> {
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error('API path must be relative to the configured API base.');
  let response: Response;
  try {
    response = await fetch(`${webConfig.apiBaseUrl}${path}`, {
      method,
      headers: { Accept: 'application/json', ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}) },
      ...(method === 'POST' ? { body: JSON.stringify(requestBody) } : {}),
      ...(signal ? { signal } : {}),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    logger.error('API connection failed');
    throw new ApiClientError('NETWORK_ERROR', 'Unable to reach the API.');
  }
  let body: unknown;
  try { body = await response.json(); } catch {
    throw new ApiClientError('INVALID_RESPONSE', 'The API returned an invalid response.');
  }
  if (!response.ok) {
    const candidate = body && typeof body === 'object' && 'error' in body ? body.error : undefined;
    if (isApiError(candidate)) {
      logger.error('API request failed', { code: candidate.code, request_id: candidate.request_id });
      throw new ApiClientError(candidate.code, candidate.message, candidate.request_id);
    }
    throw new ApiClientError('INVALID_RESPONSE', 'The API returned an unexpected error.');
  }
  if (!body || typeof body !== 'object' || !('data' in body) || !('meta' in body)
    || !body.meta || typeof body.meta !== 'object'
    || !('request_id' in body.meta) || typeof body.meta.request_id !== 'string'
    || !('generated_at' in body.meta) || typeof body.meta.generated_at !== 'string') {
    throw new ApiClientError('INVALID_RESPONSE', 'The API response is incomplete.');
  }
  // Transport envelope check only; later modules must validate their own data schema.
  return body as ApiSuccess<T>;
}

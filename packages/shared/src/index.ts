export * from './dashboard.js';
export * from './centers.js';
export * from './synchronization.js';

export const errorCodes = [
  'BAD_REQUEST',
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'CONFLICT',
  'INTERNAL_ERROR',
  'SERVICE_UNAVAILABLE',
  'NETWORK_ERROR',
  'INVALID_RESPONSE',
] as const;

export type ErrorCode = (typeof errorCodes)[number];

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  request_id: string;
  retryable: boolean;
  field_errors?: FieldError[];
}

export interface ApiMeta {
  request_id: string;
  generated_at: string;
}

export interface ApiSuccess<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiFailure {
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface Page<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface HealthData {
  service: 'sarthak-api';
  status: 'ok' | 'ready';
  database?: 'connected';
}

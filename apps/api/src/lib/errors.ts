import type { ApiFailure, ErrorCode } from '@sarthak/shared';
import type { FastifyInstance } from 'fastify';

export class AppError extends Error {
  constructor(
    public readonly statusCode: 400 | 404 | 409 | 422 | 503,
    public readonly code: ErrorCode,
    public readonly publicMessage: string,
  ) {
    super(publicMessage);
    this.name = 'AppError';
  }
}

export function registerErrorHandling(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    const expected = error instanceof AppError;
    const validation = error instanceof Error && 'validation' in error;
    const code = error instanceof Error && 'code' in error ? String(error.code) : '';
    const parserError = [
      'FST_ERR_CTP_INVALID_JSON_BODY',
      'FST_ERR_CTP_EMPTY_JSON_BODY',
      'FST_ERR_CTP_INVALID_MEDIA_TYPE',
      'FST_ERR_CTP_BODY_TOO_LARGE',
    ].includes(code);
    const parserStatus =
      code === 'FST_ERR_CTP_INVALID_MEDIA_TYPE'
        ? 415
        : code === 'FST_ERR_CTP_BODY_TOO_LARGE'
          ? 413
          : 400;
    const statusCode = expected
      ? error.statusCode
      : validation
        ? 400
        : parserError
          ? parserStatus
          : 500;
    const response: ApiFailure = {
      error: {
        code: expected
          ? error.code
          : validation
            ? 'VALIDATION_ERROR'
            : parserError
              ? 'BAD_REQUEST'
              : 'INTERNAL_ERROR',
        message: expected
          ? error.publicMessage
          : validation || parserError
            ? 'The request is invalid.'
            : 'An unexpected error occurred.',
        request_id: request.id,
        retryable: statusCode >= 500,
      },
    };
    if (!expected && !validation && !parserError) {
      // Arbitrary thrown messages/stacks may contain connection URLs or personal data.
      request.log.error({ request_id: request.id }, 'Unhandled request failure');
    }
    void reply.code(statusCode).send(response);
  });
  app.setNotFoundHandler((request, reply) => {
    const response: ApiFailure = {
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found.',
        request_id: request.id,
        retryable: false,
      },
    };
    void reply.code(404).send(response);
  });
}

import type { AppConfig } from '../config/env.js';

export function loggerOptions(config: AppConfig) {
  return {
    level: config.LOG_LEVEL,
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]', 'password', 'token', 'secret', 'DATABASE_URL'],
      censor: '[REDACTED]',
    },
    serializers: {
      req(request: { method: string; url: string }) {
        return { method: request.method, path: request.url.split('?')[0] };
      },
    },
    ...(config.NODE_ENV === 'development' ? {
      transport: { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' } },
    } : {}),
  };
}

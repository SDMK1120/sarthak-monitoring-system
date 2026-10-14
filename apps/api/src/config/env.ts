import { config as loadDotenv } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    HOST: z.string().min(1).default('127.0.0.1'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3001),
    WEB_ORIGIN: z.url().refine((value) => {
      try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol) && url.origin === value;
      } catch {
        return false;
      }
    }, 'Must be a single HTTP(S) origin without a path'),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    DATABASE_URL: z.url().refine((value) => {
      try {
        const url = new URL(value);
        return (
          ['postgres:', 'postgresql:'].includes(url.protocol) &&
          !['sslmode', 'sslcert', 'sslkey', 'sslrootcert'].some((key) => url.searchParams.has(key))
        );
      } catch {
        return false;
      }
    }, 'Use a PostgreSQL URL; configure TLS with DATABASE_TLS and DATABASE_CA_FILE'),
    DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),
    DATABASE_CONNECTION_TIMEOUT_MS: z.coerce.number().int().positive().default(3000),
    DATABASE_QUERY_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
    DATABASE_TLS: z
      .enum(['true', 'false'])
      .default('false')
      .transform((value) => value === 'true'),
    DATABASE_CA_FILE: z.string().min(1).optional(),
  })
  .superRefine((value, context) => {
    if (value.NODE_ENV === 'production' && !value.DATABASE_TLS) {
      context.addIssue({
        code: 'custom',
        path: ['DATABASE_TLS'],
        message: 'Production requires verified database TLS',
      });
    }
    if (value.DATABASE_CA_FILE && !value.DATABASE_TLS) {
      context.addIssue({
        code: 'custom',
        path: ['DATABASE_CA_FILE'],
        message: 'A CA file requires DATABASE_TLS=true',
      });
    }
  });

export type AppConfig = z.infer<typeof schema>;

export function loadConfig(environment?: NodeJS.ProcessEnv): AppConfig {
  if (!environment) {
    loadDotenv({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });
  }
  const result = schema.safeParse(environment ?? process.env);
  if (!result.success) {
    const fields = [...new Set(result.error.issues.map((issue) => issue.path.join('.')))];
    // Field names only: never print an invalid value or a credential-bearing URL.
    throw new Error(`Invalid environment configuration: ${fields.join(', ')}`);
  }
  return result.data;
}

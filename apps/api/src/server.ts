import { buildApp } from './app.js';
import { loadConfig } from './config/env.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const app = buildApp(config);
  let closing = false;
  const shutdown = async () => {
    if (closing) return;
    closing = true;
    app.log.info('Stopping API');
    try {
      await app.close();
    } catch {
      app.log.error('API shutdown failed');
      process.exitCode = 1;
    }
  };
  process.once('SIGINT', () => {
    void shutdown();
  });
  process.once('SIGTERM', () => {
    void shutdown();
  });
  try {
    await app.listen({ host: config.HOST, port: config.PORT });
  } catch {
    app.log.error('API startup failed; check host and port configuration');
    await shutdown();
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error && error.message.startsWith('Invalid environment configuration:')
      ? error.message
      : 'API initialization failed; check environment configuration and CA file access.',
  );
  process.exitCode = 1;
});

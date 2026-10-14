import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '');
  const proxyTarget = environment.API_PROXY_TARGET ?? 'http://127.0.0.1:3001';
  const url = new URL(proxyTarget);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== '/'
  ) {
    throw new Error(
      'API_PROXY_TARGET must be an HTTP(S) origin without credentials, query or fragment.',
    );
  }
  const publicBase = environment.VITE_API_BASE_URL ?? '/api';
  const rootRelative =
    publicBase.startsWith('/') && !publicBase.startsWith('//') && !/[?#\\]/.test(publicBase);
  let absoluteBase = false;
  try {
    const parsed = new URL(publicBase);
    absoluteBase =
      ['http:', 'https:'].includes(parsed.protocol) &&
      !parsed.username &&
      !parsed.password &&
      !parsed.search &&
      !parsed.hash;
  } catch {
    /* A valid root-relative path does not parse as an absolute URL. */
  }
  if (!rootRelative && !absoluteBase)
    throw new Error(
      'VITE_API_BASE_URL must be a root-relative path or an HTTP(S) URL without credentials, query or fragment.',
    );
  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      proxy: { '/api': { target: proxyTarget, changeOrigin: true } },
    },
    preview: {
      host: '127.0.0.1',
      port: 4173,
      strictPort: true,
      proxy: { '/api': { target: proxyTarget, changeOrigin: true } },
    },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'react-runtime',
                test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                priority: 30,
              },
              { name: 'validation', test: /node_modules[\\/]zod[\\/]/, priority: 20 },
              { name: 'charts', test: /node_modules[\\/]recharts[\\/]/, priority: 10 },
            ],
          },
        },
      },
    },
  };
});

const rawBase = import.meta.env.VITE_API_BASE_URL ?? '/api';
const relative = rawBase.startsWith('/') && !rawBase.startsWith('//') && !/[?#\\]/.test(rawBase);
const absolute = (() => {
  try {
    const url = new URL(rawBase);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash;
  } catch { return false; }
})();

if (!relative && !absolute) {
  throw new Error('VITE_API_BASE_URL must be a root-relative path or an HTTP(S) URL without credentials, query or fragment.');
}

export const webConfig = { apiBaseUrl: rawBase.replace(/\/$/, '') } as const;

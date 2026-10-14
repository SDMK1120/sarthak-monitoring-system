import { useEffect, useState } from 'react';

export function useCenterRequest<T>(load: (signal: AbortSignal) => Promise<T>, key: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const request = new AbortController();
    setData(null);
    setError(null);
    setLoading(true);
    void load(request.signal)
      .then((result) => {
        if (!request.signal.aborted) setData(result);
      })
      .catch((failure: unknown) => {
        if (!request.signal.aborted)
          setError(
            failure instanceof Error ? failure.message : 'The center data could not be loaded.',
          );
      })
      .finally(() => {
        if (!request.signal.aborted) setLoading(false);
      });
    return () => request.abort();
    // The request is tied to the route context and explicit retry, not render callback identity.
  }, [key, attempt]);
  return { data, error, loading, retry: () => setAttempt((value) => value + 1) };
}

import { useCallback, useEffect, useRef, useState } from 'react';
import type { DashboardOptions, ExecutiveDashboard, ExecutiveQuery } from '@sarthak/shared';
import { getDashboardOptions, getExecutiveDashboard } from './service';

export function useExecutiveDashboard() {
  const [options, setOptions] = useState<DashboardOptions | null>(null);
  const [data, setData] = useState<ExecutiveDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const currentQuery = useRef<ExecutiveQuery>({});

  const load = useCallback(
    async (query?: ExecutiveQuery) => {
      controller.current?.abort();
      const request = new AbortController();
      controller.current = request;
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const available = options ?? (await getDashboardOptions(request.signal));
        if (request.signal.aborted) return;
        setOptions(available);
        const requested =
          query ??
          (currentQuery.current.snapshot_id
            ? currentQuery.current
            : {
                snapshot_id: available.snapshot_id,
                period_start: available.default_period.start,
                period_end: available.default_period.end,
              });
        currentQuery.current = requested;
        const response = await getExecutiveDashboard(requested, request.signal);
        if (request.signal.aborted) return;
        setData(response);
      } catch (failure) {
        if (!request.signal.aborted)
          setError(
            failure instanceof Error ? failure.message : 'The dashboard could not be loaded.',
          );
      } finally {
        if (!request.signal.aborted) setLoading(false);
      }
    },
    [options],
  );

  useEffect(() => {
    void load();
    return () => controller.current?.abort();
    // The initial request is run once. Later loads are explicit user actions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { options, data, loading, error, load };
}

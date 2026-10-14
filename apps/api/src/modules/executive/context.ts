import { AppError } from '../../lib/errors.js';
import type { ExecutiveFacts } from './repository.js';

export interface ScopeQuery {
  region_id?: string | undefined;
  scheme_id?: string | undefined;
  period_start?: string | undefined;
  period_end?: string | undefined;
  snapshot_id?: string | undefined;
}

export function resolveContext(facts: ExecutiveFacts, query: ScopeQuery) {
  if (query.snapshot_id && query.snapshot_id !== facts.snapshot_id)
    throw new AppError(404, 'NOT_FOUND', 'The requested dashboard snapshot does not exist.');
  if (query.region_id && !facts.regions.some((region) => region.id === query.region_id))
    throw new AppError(400, 'VALIDATION_ERROR', 'The selected region does not exist.');
  if (query.scheme_id && !facts.schemes.some((scheme) => scheme.id === query.scheme_id))
    throw new AppError(400, 'VALIDATION_ERROR', 'The selected scheme does not exist.');
  const start = query.period_start ?? '2026-04-01';
  const end = query.period_end ?? '2026-10-01';
  if (
    !start.endsWith('-01') ||
    !end.endsWith('-01') ||
    start < '2026-01-01' ||
    end > '2026-10-01' ||
    start >= end
  ) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Use first-of-month boundaries between 2026-01-01 and 2026-10-01, with start before the exclusive end.',
    );
  }
  const centers = facts.centers.filter(
    (center) =>
      center.onboarded_at <= facts.as_of &&
      (!query.region_id || center.region_id === query.region_id) &&
      (!query.scheme_id || center.scheme_ids.includes(query.scheme_id)),
  );
  const centerIds = new Set(centers.map((center) => center.id));
  // Scheme memberships select centers; batch facts themselves must match the selected scheme.
  const batches = facts.batches.filter(
    (batch) =>
      centerIds.has(batch.center_id) &&
      batch.created_at <= facts.as_of &&
      (!query.scheme_id || batch.scheme_id === query.scheme_id),
  );
  const periodBatches = batches.filter(
    (batch) => batch.created_at.slice(0, 10) >= start && batch.created_at.slice(0, 10) < end,
  );
  const targets = facts.sync_targets.filter((target) => centerIds.has(target.center_id));
  return { start, end, centers, centerIds, batches, periodBatches, targets };
}

import type { BatchFact, CenterFact, SyncFact } from './repository.js';
import { centerStatusAt, syncHealthAt } from './repository.js';

export function percentage(numerator: number, denominator: number): number | null {
  return denominator > 0 ? Math.round((1000 * numerator) / denominator) / 10 : null;
}

export function centerCounts(centers: readonly CenterFact[], asOf: string) {
  const counts = { total: centers.length, active: 0, inactive: 0, unknown: 0 };
  centers.forEach((center) => {
    counts[centerStatusAt(center, asOf)]++;
  });
  return counts;
}

export function batchCounts(batches: readonly BatchFact[], asOf: string) {
  const current = batches.filter(
    (batch) => batch.created_at <= asOf && (!batch.completed_at || batch.completed_at > asOf),
  );
  const eligible = current.filter((batch) => batch.capacity !== null && batch.capacity > 0);
  const seats = eligible.reduce((sum, batch) => sum + batch.occupied_seats, 0);
  const capacity = eligible.reduce((sum, batch) => sum + (batch.capacity ?? 0), 0);
  return {
    created: batches.length,
    enrollments: batches.reduce((sum, batch) => sum + batch.enrollments, 0),
    current: current.length,
    comparable: eligible.length,
    excluded: current.length - eligible.length,
    occupied_seats: seats,
    capacity,
    utilization_percent: percentage(seats, capacity),
  };
}

export function syncCounts(targets: readonly SyncFact[], asOf: string) {
  const counts = { total: targets.length, healthy: 0, degraded: 0, unknown: 0 };
  targets.forEach((target) => {
    counts[syncHealthAt(target, asOf).status]++;
  });
  return {
    ...counts,
    health_percent: percentage(counts.healthy, counts.total),
    classification_percent: percentage(counts.healthy + counts.degraded, counts.total),
  };
}

export function monthStarts(start: string, end: string): string[] {
  const months: string[] = [];
  const date = new Date(`${start}T00:00:00.000Z`);
  while (date.toISOString().slice(0, 10) < end) {
    months.push(date.toISOString().slice(0, 10));
    date.setUTCMonth(date.getUTCMonth() + 1);
  }
  return months;
}

import type {
  SynchronizationAlert,
  SynchronizationRules,
  SynchronizationTarget,
} from '@sarthak/shared';

export const DEFAULT_SYNCHRONIZATION_RULES: SynchronizationRules = Object.freeze({
  enabled: true,
  thresholds: Object.freeze(
    [
      { role: 'CM', after_hours: 0 },
      { role: 'JDM', after_hours: 2 },
      { role: 'SDM', after_hours: 6 },
      { role: 'Super Admin', after_hours: 24 },
    ].map((value) => Object.freeze(value)),
  ) as unknown as SynchronizationRules['thresholds'],
  severity: Object.freeze({
    failed: 'critical',
    partial: 'warning',
    stale: 'warning',
    pending_overdue: 'warning',
    incomplete: 'warning',
  }),
});

export function elapsedHours(reference: string | null, asOf: string): number | null {
  if (!reference) return null;
  const elapsed = (Date.parse(asOf) - Date.parse(reference)) / 3_600_000;
  return Number.isFinite(elapsed) && elapsed >= 0 ? elapsed : null;
}

export function buildSynchronizationAlert(
  target: SynchronizationTarget,
  asOf: string,
  rules: SynchronizationRules,
): SynchronizationAlert | null {
  if (target.state === 'healthy') return null;
  let cause: SynchronizationAlert['cause'];
  let reference: string | null;
  if (target.result === 'failed') {
    cause = 'failed';
    reference = target.latest_at;
  } else if (target.result === 'partial') {
    cause = 'partial';
    reference = target.latest_at;
  } else if ((elapsedHours(target.last_success_at, asOf) ?? -1) > 24) {
    cause = 'stale';
    reference = target.last_success_at;
  } else if (target.result === 'pending' && (elapsedHours(target.latest_at, asOf) ?? -1) > 2) {
    cause = 'pending_overdue';
    reference = target.latest_at;
  } else if (target.delivery_complete === false || target.published === false) {
    cause = 'incomplete';
    reference = target.latest_at;
  } else {
    if (
      target.result === 'pending' &&
      elapsedHours(target.latest_at, asOf) !== null &&
      (elapsedHours(target.latest_at, asOf) ?? Infinity) <= 2 &&
      target.last_success_at &&
      target.delivery_complete === true &&
      target.published === true
    )
      return null;
    cause = 'missing_evidence';
    reference = null;
  }
  const age = elapsedHours(reference, asOf);
  const threshold =
    !rules.enabled || cause === 'missing_evidence' || age === null
      ? null
      : [...rules.thresholds].reverse().find((entry) => age >= entry.after_hours);
  return {
    id: `alert-${target.id}`,
    target_id: target.id,
    center_id: target.center_id,
    center_name: target.center_name,
    severity: cause === 'missing_evidence' ? 'information' : rules.severity[cause],
    cause,
    reason: target.reason,
    reference_at: reference,
    age_hours: age,
    recommended_role: threshold?.role ?? null,
    recommendation:
      cause === 'missing_evidence'
        ? 'Inspect missing synchronization evidence; unknown observations do not establish a failure.'
        : !rules.enabled
          ? 'Recipient recommendations are disabled for this preview; the observation still needs review.'
          : threshold
            ? `Review with ${threshold.role}. Age measures the pinned observation reference, not continuous outage duration.`
            : 'Review the observation and its missing timestamp before recommending a role.',
  };
}

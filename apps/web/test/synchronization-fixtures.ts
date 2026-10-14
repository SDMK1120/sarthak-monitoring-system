import type {
  SynchronizationAlerts,
  SynchronizationDashboard,
  SynchronizationOptions,
  SynchronizationRulesResponse,
  SynchronizationTargetDetail,
} from '@sarthak/shared';
export const syncContext = {
  snapshot_id: 'demo-2026-09-v1',
  data_as_of: '2026-09-30T12:00:00.000Z',
  timezone: 'UTC' as const,
  mode: 'synthetic_demo' as const,
};
export const syncOptions: SynchronizationOptions = {
  context: syncContext,
  regions: [{ id: 'region-1', name: 'North Region' }],
  districts: [{ id: 'district-1', name: 'District One', region_id: 'region-1' }],
  centers: [
    { id: 'center-1', name: 'North Center', region_id: 'region-1', district_id: 'district-1' },
  ],
};
export const syncRules: SynchronizationRulesResponse = {
  context: syncContext,
  persistence: 'request_local_preview',
  delivery: 'none',
  rules: {
    enabled: true,
    thresholds: [
      { role: 'CM', after_hours: 0 },
      { role: 'JDM', after_hours: 2 },
      { role: 'SDM', after_hours: 6 },
      { role: 'Super Admin', after_hours: 24 },
    ],
    severity: {
      failed: 'critical',
      partial: 'warning',
      stale: 'warning',
      pending_overdue: 'warning',
      incomplete: 'warning',
    },
  },
};
export const syncTarget: SynchronizationTargetDetail = {
  context: syncContext,
  target: {
    id: 'target-6',
    center_id: 'center-1',
    center_name: 'North Center',
    region_id: 'region-1',
    region_name: 'North Region',
    district_id: 'district-1',
    district_name: 'District One',
    state: 'degraded',
    reason: 'Last success exceeds cadence',
    connectivity: 'offline',
    result: 'success',
    latest_at: '2026-09-30T08:00:00.000Z',
    last_success_at: '2026-09-28T08:00:00.000Z',
    observation_age_hours: 4,
    success_age_hours: 52,
    delivery_complete: true,
    published: true,
  },
  alert: null,
  cadence_hours: 24,
  pending_deadline_hours: 2,
};
export const syncDashboard: SynchronizationDashboard = {
  context: syncContext,
  scope_before_state_result: {
    total: 2,
    healthy: 1,
    degraded: 1,
    unknown: 0,
    health_percent: 50,
    classification_percent: 100,
    cadence_hours: 24,
    pending_deadline_hours: 2,
  },
  matching_total: 1,
  items: [syncTarget.target],
  page: 1,
  page_size: 10,
  total_pages: 1,
  latest_failed: 0,
  latest_partial: 0,
  alert_counts: { information: 0, warning: 1, critical: 0 },
};
export const syncAlerts: SynchronizationAlerts = {
  context: syncContext,
  items: [
    {
      id: 'alert-target-6',
      target_id: 'target-6',
      center_id: 'center-1',
      center_name: 'North Center',
      cause: 'stale',
      reason: 'Last success exceeds cadence',
      severity: 'warning',
      reference_at: '2026-09-28T08:00:00.000Z',
      age_hours: 52,
      recommended_role: 'Super Admin',
      recommendation: 'Review the evidence.',
    },
  ],
  matching_total: 1,
  page: 1,
  page_size: 10,
  total_pages: 1,
  rules: syncRules.rules,
  preview: false,
};

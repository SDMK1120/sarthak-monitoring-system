import type {
  CenterAnalysis,
  CenterDetail,
  CenterList,
  CenterOptions,
  CenterRow,
} from '@sarthak/shared';

export const context = {
  snapshot_id: 'demo-2026-09-v1',
  data_as_of: '2026-09-30T12:00:00.000Z',
  timezone: 'UTC' as const,
  mode: 'synthetic_demo' as const,
};
export const options: CenterOptions = {
  context,
  regions: [
    { id: 'region-1', name: 'North Region' },
    { id: 'region-2', name: 'South Region' },
  ],
  districts: [
    { id: 'district-1', name: 'District One', region_id: 'region-1' },
    { id: 'district-2', name: 'District Two', region_id: 'region-2' },
  ],
  schemes: [{ id: 'scheme-1', name: 'Digital Skills', category: 'Skills' }],
};
export const row: CenterRow = {
  id: 'center-1',
  code: 'SAR-001',
  name: 'North Center',
  region_id: 'region-1',
  region_name: 'North Region',
  district_id: 'district-1',
  district_name: 'District One',
  activity_status: 'active',
  schemes: [{ id: 'scheme-1', name: 'Digital Skills' }],
  onboarded_at: '2026-01-01T00:00:00.000Z',
  batch_count: 1,
  enrollments: 10,
  sync_state: 'unknown',
  last_success: null,
};
export const listing: CenterList = {
  context,
  items: [row],
  matching_total: 1,
  page: 1,
  page_size: 10,
  total_pages: 1,
};
const counts = { total: 2, active: 1, inactive: 0, unknown: 1, classifiable_percent: 50 };
export const analysis: CenterAnalysis = {
  context,
  scope_before_status: counts,
  by_region: [{ id: 'region-1', name: 'North Region', counts }],
  by_district: [{ id: 'district-1', name: 'District One', region_id: 'region-1', counts }],
  matching_total: 1,
  selected_activity_status: null,
};
export const detail: CenterDetail = {
  context,
  profile: row,
  status_history: [{ at: '2026-01-01T00:00:00.000Z', status: 'active' }],
  batches: [],
  batch_summary: {
    created: 0,
    enrollments: 0,
    current: 0,
    comparable: 0,
    excluded: 0,
    occupied_seats: 0,
    capacity: 0,
    utilization_percent: null,
  },
  sync_targets: [],
  sync_summary: {
    total: 0,
    healthy: 0,
    degraded: 0,
    unknown: 0,
    health_percent: null,
    classification_percent: null,
    cadence_hours: 24,
    pending_deadline_hours: 2,
  },
};

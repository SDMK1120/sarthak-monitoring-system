import { z } from 'zod';

const count = z.number().int().nonnegative();
const percent = z.number().nonnegative().nullable();
const option = z.object({ id: z.string(), name: z.string() });
export const activityStatusSchema = z.enum(['active', 'inactive', 'unknown']);
export const syncStateSchema = z.enum(['healthy', 'degraded', 'unknown']);
export const executiveQuerySchema = z.object({
  region_id: z.string().min(1).optional(), scheme_id: z.string().min(1).optional(),
  period_start: z.iso.date().optional(), period_end: z.iso.date().optional(), snapshot_id: z.string().min(1).optional(),
}).strict().superRefine((query, ctx) => {
  if (Boolean(query.period_start) !== Boolean(query.period_end)) ctx.addIssue({ code: 'custom', message: 'Provide both period boundaries.', path: ['period_start'] });
});
export const dashboardOptionsSchema = z.object({
  regions: z.array(option), schemes: z.array(option.extend({ category: z.string() })),
  snapshot_id: z.string(), data_as_of: z.iso.datetime(), timezone: z.string(),
  available_period: z.object({ start: z.iso.date(), end: z.iso.date() }),
  default_period: z.object({ start: z.iso.date(), end: z.iso.date() }),
});
export const dashboardContextSchema = z.object({
  snapshot_id: z.string(), data_as_of: z.iso.datetime(), receipt_cutoff: z.iso.datetime(), timezone: z.string(),
  period_start: z.iso.date(), period_end: z.iso.date(), region_id: z.string().nullable(), scheme_id: z.string().nullable(), mode: z.literal('synthetic_demo'),
});
export const centerSummarySchema = z.object({ total: count, active: count, inactive: count, unknown: count, classifiable_percent: percent });
const schemeRow = option.extend({ category: z.string(), centers: count, active_centers: count, batches: count, enrollments: count });
export const schemeSummarySchema = z.object({
  by_scheme: z.array(schemeRow), by_category: z.array(option.extend({ centers: count, active_centers: count, batches: count, enrollments: count })),
  membership_count: count, distinct_centers: count,
});
export const batchSummarySchema = z.object({
  created: count, enrollments: count, current: count, comparable: count, excluded: count,
  occupied_seats: count, capacity: count, utilization_percent: percent,
});
export const syncSummarySchema = z.object({
  total: count, healthy: count, degraded: count, unknown: count, health_percent: percent, classification_percent: percent, cadence_hours: z.number().positive(),
  exceptions: z.array(z.object({ id: z.string(), center_id: z.string(), center_name: z.string(), region_name: z.string(), state: syncStateSchema, last_success: z.iso.datetime().nullable(), reason: z.string() })),
});
export const dashboardTrendSchema = z.object({
  month: z.string(), label: z.string(), total_centers: count, active_centers: count, inactive_centers: count, unknown_centers: count,
  batches_created: count, enrollments: count, utilization_percent: percent, occupied_seats: count, capacity: count,
});
export const dashboardCenterSchema = z.object({
  id: z.string(), code: z.string(), name: z.string(), region_id: z.string(), region_name: z.string(), district_name: z.string(),
  activity_status: activityStatusSchema, schemes: z.array(z.string()), batch_count: count, enrollments: count, sync_state: syncStateSchema, last_success: z.iso.datetime().nullable(),
});
export const executiveDashboardSchema = z.object({
  context: dashboardContextSchema, centers: centerSummarySchema, schemes: schemeSummarySchema, batches: batchSummarySchema,
  sync: syncSummarySchema, trends: z.array(dashboardTrendSchema), center_list: z.array(dashboardCenterSchema),
});
export type ExecutiveQuery = z.infer<typeof executiveQuerySchema>;
export type DashboardOptions = z.infer<typeof dashboardOptionsSchema>;
export type ExecutiveDashboard = z.infer<typeof executiveDashboardSchema>;
export type DashboardCenter = z.infer<typeof dashboardCenterSchema>;

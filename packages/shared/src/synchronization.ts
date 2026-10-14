import { z } from 'zod';
import { syncStateSchema } from './dashboard.js';
const option = z.object({ id: z.string(), name: z.string() });
const integer = (max: number) =>
  z
    .union([
      z.number().int(),
      z
        .string()
        .regex(/^[1-9]\d*$/)
        .transform(Number),
    ])
    .pipe(z.number().int().min(1).max(max));
export const synchronizationQuerySchema = z
  .object({
    region_id: z.string().min(1).optional(),
    district_id: z.string().min(1).optional(),
    center_id: z.string().min(1).optional(),
    state: syncStateSchema.optional(),
    result: z.enum(['success', 'failed', 'partial', 'pending', 'unknown']).optional(),
    search: z.string().max(100).optional(),
    page: integer(1_000_000).default(1),
    page_size: integer(50).default(10),
    snapshot_id: z.string().min(1).optional(),
  })
  .strict();
export const synchronizationDetailQuerySchema = z
  .object({ snapshot_id: z.string().min(1).optional() })
  .strict();
export const synchronizationContextSchema = z.object({
  snapshot_id: z.string(),
  data_as_of: z.iso.datetime(),
  mode: z.literal('synthetic_demo'),
  timezone: z.literal('UTC'),
});
export const escalationRoleSchema = z.enum(['CM', 'JDM', 'SDM', 'Super Admin']);
export const alertSeveritySchema = z.enum(['information', 'warning', 'critical']);
export const synchronizationRulesSchema = z
  .object({
    enabled: z.boolean(),
    thresholds: z
      .array(
        z.object({ role: escalationRoleSchema, after_hours: z.number().min(0).max(720) }).strict(),
      )
      .length(4),
    severity: z
      .object({
        failed: alertSeveritySchema,
        partial: alertSeveritySchema,
        stale: alertSeveritySchema,
        pending_overdue: alertSeveritySchema,
        incomplete: alertSeveritySchema,
      })
      .strict(),
  })
  .strict()
  .superRefine((rules, ctx) => {
    const expected = ['CM', 'JDM', 'SDM', 'Super Admin'];
    rules.thresholds.forEach((threshold, index) => {
      if (threshold.role !== expected[index])
        ctx.addIssue({
          code: 'custom',
          message: 'Threshold roles must be CM, JDM, SDM, Super Admin in order.',
          path: ['thresholds', index, 'role'],
        });
      if (index === 0 && threshold.after_hours !== 0)
        ctx.addIssue({
          code: 'custom',
          message: 'CM threshold must be zero hours.',
          path: ['thresholds', index, 'after_hours'],
        });
      if (index > 0 && threshold.after_hours <= rules.thresholds[index - 1]!.after_hours)
        ctx.addIssue({
          code: 'custom',
          message: 'Threshold hours must be strictly increasing.',
          path: ['thresholds', index, 'after_hours'],
        });
    });
  });
export const synchronizationEvaluationRequestSchema = z
  .object({ filters: synchronizationQuerySchema.optional(), rules: synchronizationRulesSchema })
  .strict();
export const synchronizationTargetSchema = z.object({
  id: z.string(),
  center_id: z.string(),
  center_name: z.string(),
  region_id: z.string(),
  region_name: z.string(),
  district_id: z.string(),
  district_name: z.string(),
  state: syncStateSchema,
  reason: z.string(),
  connectivity: z.enum(['online', 'offline']),
  result: z.enum(['success', 'failed', 'partial', 'pending']).nullable(),
  last_success_at: z.iso.datetime().nullable(),
  latest_at: z.iso.datetime().nullable(),
  observation_age_hours: z.number().nonnegative().nullable(),
  success_age_hours: z.number().nonnegative().nullable(),
  delivery_complete: z.boolean().nullable(),
  published: z.boolean().nullable(),
});
export const synchronizationAlertSchema = z.object({
  id: z.string(),
  target_id: z.string(),
  center_id: z.string(),
  center_name: z.string(),
  severity: alertSeveritySchema,
  cause: z.enum([
    'failed',
    'partial',
    'stale',
    'pending_overdue',
    'incomplete',
    'missing_evidence',
  ]),
  reason: z.string(),
  reference_at: z.iso.datetime().nullable(),
  age_hours: z.number().nonnegative().nullable(),
  recommended_role: escalationRoleSchema.nullable(),
  recommendation: z.string(),
});
const summary = z.object({
  total: z.number().int().nonnegative(),
  healthy: z.number().int().nonnegative(),
  degraded: z.number().int().nonnegative(),
  unknown: z.number().int().nonnegative(),
  health_percent: z.number().nullable(),
  classification_percent: z.number().nullable(),
  cadence_hours: z.literal(24),
  pending_deadline_hours: z.literal(2),
});
export const synchronizationOptionsSchema = z.object({
  context: synchronizationContextSchema,
  regions: z.array(option),
  districts: z.array(option.extend({ region_id: z.string() })),
  centers: z.array(option.extend({ region_id: z.string(), district_id: z.string() })),
});
export const synchronizationDashboardSchema = z.object({
  context: synchronizationContextSchema,
  scope_before_state_result: summary,
  matching_total: z.number().int().nonnegative(),
  items: z.array(synchronizationTargetSchema),
  page: z.number().int().positive(),
  page_size: z.number().int().positive(),
  total_pages: z.number().int().nonnegative(),
  latest_failed: z.number().int().nonnegative(),
  latest_partial: z.number().int().nonnegative(),
  alert_counts: z.object({
    information: z.number().int().nonnegative(),
    warning: z.number().int().nonnegative(),
    critical: z.number().int().nonnegative(),
  }),
});
export const synchronizationAlertsSchema = z.object({
  context: synchronizationContextSchema,
  items: z.array(synchronizationAlertSchema),
  matching_total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  page_size: z.number().int().positive(),
  total_pages: z.number().int().nonnegative(),
  rules: synchronizationRulesSchema,
  preview: z.boolean(),
});
export const synchronizationTargetDetailSchema = z.object({
  context: synchronizationContextSchema,
  target: synchronizationTargetSchema,
  alert: synchronizationAlertSchema.nullable(),
  cadence_hours: z.literal(24),
  pending_deadline_hours: z.literal(2),
});
export const synchronizationRulesResponseSchema = z.object({
  context: synchronizationContextSchema,
  rules: synchronizationRulesSchema,
  persistence: z.literal('request_local_preview'),
  delivery: z.literal('none'),
});
export type SynchronizationQuery = z.infer<typeof synchronizationQuerySchema>;
export type SynchronizationRules = z.infer<typeof synchronizationRulesSchema>;
export type SynchronizationTarget = z.infer<typeof synchronizationTargetSchema>;
export type SynchronizationAlert = z.infer<typeof synchronizationAlertSchema>;
export type SynchronizationDashboard = z.infer<typeof synchronizationDashboardSchema>;
export type SynchronizationOptions = z.infer<typeof synchronizationOptionsSchema>;
export type SynchronizationAlerts = z.infer<typeof synchronizationAlertsSchema>;
export type SynchronizationTargetDetail = z.infer<typeof synchronizationTargetDetailSchema>;
export type SynchronizationRulesResponse = z.infer<typeof synchronizationRulesResponseSchema>;

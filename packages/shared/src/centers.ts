import { z } from 'zod';
import { activityStatusSchema, syncStateSchema, batchSummarySchema, centerSummarySchema } from './dashboard.js';

const option = z.object({ id: z.string(), name: z.string() });
const queryInteger = (maximum: number) => z.union([z.number().int(), z.string().regex(/^[1-9]\d*$/).transform(Number)]).pipe(z.number().int().min(1).max(maximum));
export const centerQuerySchema = z.object({
  region_id: z.string().min(1).optional(), district_id: z.string().min(1).optional(), scheme_id: z.string().min(1).optional(),
  activity_status: activityStatusSchema.optional(), search: z.string().max(100).optional(),
  page: queryInteger(1_000_000).default(1), page_size: queryInteger(50).default(10),
  sort: z.enum(['name', 'code', 'status']).default('name'), order: z.enum(['asc', 'desc']).default('asc'), snapshot_id: z.string().min(1).optional(),
}).strict();
export const centerDetailQuerySchema = z.object({ snapshot_id: z.string().min(1).optional() }).strict();
export const centerContextSchema = z.object({ snapshot_id: z.string(), data_as_of: z.iso.datetime(), timezone: z.literal('UTC'), mode: z.literal('synthetic_demo') });
export const centerOptionsSchema = z.object({ context: centerContextSchema, regions: z.array(option), districts: z.array(option.extend({ region_id: z.string() })), schemes: z.array(option.extend({ category: z.string() })) });
export const centerRowSchema = z.object({
  id: z.string(), code: z.string(), name: z.string(), region_id: z.string(), region_name: z.string(), district_id: z.string(), district_name: z.string(),
  activity_status: activityStatusSchema, schemes: z.array(option), onboarded_at: z.iso.datetime(),
  batch_count: z.number().int().nonnegative(), enrollments: z.number().int().nonnegative(), sync_state: syncStateSchema, last_success: z.iso.datetime().nullable(),
});
export const centerListSchema = z.object({ context: centerContextSchema, items: z.array(centerRowSchema), matching_total: z.number().int().nonnegative(), page: z.number().int().positive(), page_size: z.number().int().positive(), total_pages: z.number().int().nonnegative() });
export const centerAnalysisSchema = z.object({
  context: centerContextSchema, scope_before_status: centerSummarySchema,
  by_region: z.array(option.extend({ counts: centerSummarySchema })),
  by_district: z.array(option.extend({ region_id: z.string(), counts: centerSummarySchema })),
  matching_total: z.number().int().nonnegative(), selected_activity_status: activityStatusSchema.nullable(),
});
export const centerDetailSchema = z.object({
  context: centerContextSchema, profile: centerRowSchema,
  status_history: z.array(z.object({ at: z.iso.datetime(), status: activityStatusSchema })),
  batches: z.array(z.object({ id: z.string(), scheme_id: z.string(), scheme_name: z.string(), created_at: z.iso.datetime(), started_at: z.iso.datetime(), completed_at: z.iso.datetime().nullable(), capacity: z.number().int().nonnegative().nullable(), enrollments: z.number().int().nonnegative(), occupied_seats: z.number().int().nonnegative(), lifecycle: z.enum(['planned', 'running', 'completed']) })),
  batch_summary: batchSummarySchema,
  sync_targets: z.array(z.object({ id: z.string(), connectivity: z.enum(['online', 'offline']), state: syncStateSchema, reason: z.string(), last_success_at: z.iso.datetime().nullable(), latest_at: z.iso.datetime().nullable(), result: z.enum(['success', 'failed', 'partial', 'pending']).nullable(), delivery_complete: z.boolean().nullable(), published: z.boolean().nullable() })),
  sync_summary: z.object({ total: z.number().int().nonnegative(), healthy: z.number().int().nonnegative(), degraded: z.number().int().nonnegative(), unknown: z.number().int().nonnegative(), health_percent: z.number().nonnegative().nullable(), classification_percent: z.number().nonnegative().nullable(), cadence_hours: z.literal(24), pending_deadline_hours: z.literal(2) }),
});
export type CenterQuery = z.infer<typeof centerQuerySchema>;
export type CenterContext = z.infer<typeof centerContextSchema>;
export type CenterOptions = z.infer<typeof centerOptionsSchema>;
export type CenterRow = z.infer<typeof centerRowSchema>;
export type CenterList = z.infer<typeof centerListSchema>;
export type CenterAnalysis = z.infer<typeof centerAnalysisSchema>;
export type CenterDetail = z.infer<typeof centerDetailSchema>;

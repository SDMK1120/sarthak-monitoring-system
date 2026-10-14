import { centerQuerySchema, centerDetailQuerySchema } from '@sarthak/shared';
import type {
  CenterAnalysis,
  CenterContext,
  CenterDetail,
  CenterList,
  CenterOptions,
  CenterQuery,
  CenterRow,
} from '@sarthak/shared';
import { AppError } from '../../lib/errors.js';
import { batchCounts, centerCounts, percentage, syncCounts } from '../executive/calculations.js';
import type { CenterFact, ExecutiveFacts, ExecutiveRepository } from '../executive/repository.js';
import {
  centerStatusAt,
  syncHealthAt,
  SyntheticExecutiveRepository,
} from '../executive/repository.js';

export class CenterService {
  constructor(
    private readonly repository: ExecutiveRepository = new SyntheticExecutiveRepository(),
  ) {}

  private context(facts: ExecutiveFacts): CenterContext {
    return {
      snapshot_id: facts.snapshot_id,
      data_as_of: facts.as_of,
      timezone: 'UTC',
      mode: 'synthetic_demo',
    };
  }
  private checkSnapshot(facts: ExecutiveFacts, snapshotId: string | undefined) {
    if (snapshotId && snapshotId !== facts.snapshot_id)
      throw new AppError(404, 'NOT_FOUND', 'The requested dashboard snapshot does not exist.');
  }
  private scope(input: unknown) {
    const parsed = centerQuerySchema.safeParse(input);
    if (!parsed.success) throw new AppError(400, 'VALIDATION_ERROR', 'Center filters are invalid.');
    const query = parsed.data;
    const facts = this.repository.getSnapshot();
    this.checkSnapshot(facts, query.snapshot_id);
    if (query.region_id && !facts.regions.some((region) => region.id === query.region_id))
      throw new AppError(400, 'VALIDATION_ERROR', 'The selected region does not exist.');
    const district = query.district_id
      ? facts.districts.find((item) => item.id === query.district_id)
      : undefined;
    if (query.district_id && !district)
      throw new AppError(400, 'VALIDATION_ERROR', 'The selected district does not exist.');
    if (district && query.region_id && district.region_id !== query.region_id)
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'The selected district does not belong to the selected region.',
      );
    if (query.scheme_id && !facts.schemes.some((scheme) => scheme.id === query.scheme_id))
      throw new AppError(400, 'VALIDATION_ERROR', 'The selected scheme does not exist.');
    const search = query.search?.trim().toLocaleLowerCase('en-US') ?? '';
    const scoped = facts.centers.filter(
      (center) =>
        center.onboarded_at <= facts.as_of &&
        (!query.region_id || center.region_id === query.region_id) &&
        (!query.district_id || center.district_id === query.district_id) &&
        (!query.scheme_id || center.scheme_ids.includes(query.scheme_id)) &&
        (!search || `${center.name} ${center.code}`.toLocaleLowerCase('en-US').includes(search)),
    );
    const matching = scoped.filter(
      (center) =>
        !query.activity_status || centerStatusAt(center, facts.as_of) === query.activity_status,
    );
    return { query, facts, scoped, matching };
  }

  getOptions(input: unknown = {}): CenterOptions {
    const parsed = centerDetailQuerySchema.safeParse(input);
    if (!parsed.success)
      throw new AppError(400, 'VALIDATION_ERROR', 'Center options query is invalid.');
    const facts = this.repository.getSnapshot();
    this.checkSnapshot(facts, parsed.data.snapshot_id);
    return {
      context: this.context(facts),
      regions: facts.regions.map(({ id, name }) => ({ id, name })),
      districts: facts.districts.map(({ id, name, region_id }) => ({ id, name, region_id })),
      schemes: facts.schemes.map(({ id, name, category_id }) => ({
        id,
        name,
        category: facts.categories.find((category) => category.id === category_id)!.name,
      })),
    };
  }

  private row(center: CenterFact, facts: ExecutiveFacts, schemeId?: string): CenterRow {
    const batches = facts.batches.filter(
      (batch) =>
        batch.center_id === center.id &&
        batch.created_at <= facts.as_of &&
        (!schemeId || batch.scheme_id === schemeId),
    );
    const targets = facts.sync_targets.filter((target) => target.center_id === center.id);
    const counts = syncCounts(targets, facts.as_of);
    const latestSuccess =
      targets
        .map((target) => target.last_success_at)
        .filter((at): at is string => at !== null && at <= facts.as_of)
        .sort()
        .at(-1) ?? null;
    return {
      id: center.id,
      code: center.code,
      name: center.name,
      region_id: center.region_id,
      region_name: facts.regions.find((region) => region.id === center.region_id)!.name,
      district_id: center.district_id,
      district_name: facts.districts.find((district) => district.id === center.district_id)!.name,
      activity_status: centerStatusAt(center, facts.as_of),
      schemes: center.scheme_ids.map((id) => {
        const scheme = facts.schemes.find((item) => item.id === id)!;
        return { id: scheme.id, name: scheme.name };
      }),
      onboarded_at: center.onboarded_at,
      batch_count: batches.length,
      enrollments: batches.reduce((sum, batch) => sum + batch.enrollments, 0),
      sync_state:
        counts.degraded > 0
          ? 'degraded'
          : counts.total > 0 && counts.healthy === counts.total
            ? 'healthy'
            : 'unknown',
      last_success: latestSuccess,
    };
  }

  getList(input: unknown = {}): CenterList {
    const { query, facts, matching } = this.scope(input);
    const field = (center: CenterFact, sort: CenterQuery['sort']) =>
      sort === 'status' ? centerStatusAt(center, facts.as_of) : center[sort];
    const direction = query.order === 'desc' ? -1 : 1;
    const ordered = [...matching].sort(
      (a, b) =>
        direction * field(a, query.sort).localeCompare(field(b, query.sort), 'en-US') ||
        a.id.localeCompare(b.id, 'en-US', { numeric: true }),
    );
    const offset = (query.page - 1) * query.page_size;
    return {
      context: this.context(facts),
      items: ordered
        .slice(offset, offset + query.page_size)
        .map((center) => this.row(center, facts, query.scheme_id)),
      matching_total: matching.length,
      page: query.page,
      page_size: query.page_size,
      total_pages: Math.ceil(matching.length / query.page_size),
    };
  }

  getAnalysis(input: unknown = {}): CenterAnalysis {
    const { query, facts, scoped, matching } = this.scope(input);
    const summary = (centers: readonly CenterFact[]) => {
      const counts = centerCounts(centers, facts.as_of);
      return {
        ...counts,
        classifiable_percent: percentage(counts.active + counts.inactive, counts.total),
      };
    };
    return {
      context: this.context(facts),
      scope_before_status: summary(scoped),
      matching_total: matching.length,
      selected_activity_status: query.activity_status ?? null,
      by_region: facts.regions
        .filter((region) => !query.region_id || region.id === query.region_id)
        .filter(
          (region) =>
            !query.district_id ||
            facts.districts.find((district) => district.id === query.district_id)?.region_id ===
              region.id,
        )
        .map(({ id, name }) => ({
          id,
          name,
          counts: summary(scoped.filter((center) => center.region_id === id)),
        })),
      by_district: facts.districts
        .filter(
          (district) =>
            (!query.region_id || district.region_id === query.region_id) &&
            (!query.district_id || district.id === query.district_id),
        )
        .map(({ id, name, region_id }) => ({
          id,
          name,
          region_id,
          counts: summary(scoped.filter((center) => center.district_id === id)),
        })),
    };
  }

  getDetail(id: string, input: unknown = {}): CenterDetail {
    const parsed = centerDetailQuerySchema.safeParse(input);
    if (!parsed.success)
      throw new AppError(400, 'VALIDATION_ERROR', 'Center detail query is invalid.');
    const facts = this.repository.getSnapshot();
    this.checkSnapshot(facts, parsed.data.snapshot_id);
    const center = /^center-[1-9]\d*$/.test(id)
      ? facts.centers.find((item) => item.id === id && item.onboarded_at <= facts.as_of)
      : undefined;
    if (!center) throw new AppError(404, 'NOT_FOUND', 'The requested center does not exist.');
    const batches = facts.batches.filter(
      (batch) => batch.center_id === center.id && batch.created_at <= facts.as_of,
    );
    const targets = facts.sync_targets.filter((target) => target.center_id === center.id);
    return {
      context: this.context(facts),
      profile: this.row(center, facts),
      status_history: center.history
        .filter((entry) => entry.at <= facts.as_of)
        .map((entry) => ({ ...entry })),
      batches: batches.map((batch) => ({
        id: batch.id,
        scheme_id: batch.scheme_id,
        scheme_name: facts.schemes.find((scheme) => scheme.id === batch.scheme_id)!.name,
        created_at: batch.created_at,
        started_at: batch.started_at,
        completed_at: batch.completed_at,
        capacity: batch.capacity,
        enrollments: batch.enrollments,
        occupied_seats: batch.occupied_seats,
        lifecycle:
          batch.completed_at && batch.completed_at <= facts.as_of
            ? 'completed'
            : batch.started_at > facts.as_of
              ? 'planned'
              : 'running',
      })),
      batch_summary: batchCounts(batches, facts.as_of),
      sync_targets: targets.map((target) => {
        const health = syncHealthAt(target, facts.as_of);
        return {
          id: target.id,
          connectivity: target.connectivity,
          state: health.status,
          reason: health.reason,
          last_success_at: target.last_success_at,
          latest_at: target.latest_at,
          result: target.result,
          delivery_complete: target.delivery_complete,
          published: target.published,
        };
      }),
      sync_summary: {
        ...syncCounts(targets, facts.as_of),
        cadence_hours: 24,
        pending_deadline_hours: 2,
      },
    };
  }
}

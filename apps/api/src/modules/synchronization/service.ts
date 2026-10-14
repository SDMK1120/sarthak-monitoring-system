import {
  synchronizationQuerySchema,
  synchronizationDetailQuerySchema,
  synchronizationEvaluationRequestSchema,
} from '@sarthak/shared';
import type {
  SynchronizationAlerts,
  SynchronizationDashboard,
  SynchronizationOptions,
  SynchronizationRules,
  SynchronizationRulesResponse,
  SynchronizationTarget,
  SynchronizationTargetDetail,
} from '@sarthak/shared';
import { AppError } from '../../lib/errors.js';
import { syncCounts } from '../executive/calculations.js';
import type { ExecutiveFacts, ExecutiveRepository, SyncFact } from '../executive/repository.js';
import { SyntheticExecutiveRepository, syncHealthAt } from '../executive/repository.js';
import { buildSynchronizationAlert, DEFAULT_SYNCHRONIZATION_RULES, elapsedHours } from './rules.js';

export class SynchronizationService {
  constructor(
    private readonly repository: ExecutiveRepository = new SyntheticExecutiveRepository(),
  ) {}
  private context(facts: ExecutiveFacts) {
    return {
      snapshot_id: facts.snapshot_id,
      data_as_of: facts.as_of,
      timezone: 'UTC' as const,
      mode: 'synthetic_demo' as const,
    };
  }
  private snapshot(facts: ExecutiveFacts, id: string | undefined) {
    if (id && id !== facts.snapshot_id)
      throw new AppError(404, 'NOT_FOUND', 'The requested dashboard snapshot does not exist.');
  }
  private detailInput(input: unknown) {
    const result = synchronizationDetailQuerySchema.safeParse(input);
    if (!result.success)
      throw new AppError(400, 'VALIDATION_ERROR', 'Synchronization query is invalid.');
    const facts = this.repository.getSnapshot();
    this.snapshot(facts, result.data.snapshot_id);
    return facts;
  }
  private target(fact: SyncFact, facts: ExecutiveFacts): SynchronizationTarget {
    const center = facts.centers.find((item) => item.id === fact.center_id)!;
    const health = syncHealthAt(fact, facts.as_of);
    return {
      id: fact.id,
      center_id: center.id,
      center_name: center.name,
      region_id: center.region_id,
      region_name: facts.regions.find((region) => region.id === center.region_id)!.name,
      district_id: center.district_id,
      district_name: facts.districts.find((district) => district.id === center.district_id)!.name,
      state: health.status,
      reason: health.reason,
      connectivity: fact.connectivity,
      result: fact.result,
      last_success_at: fact.last_success_at,
      latest_at: fact.latest_at,
      observation_age_hours: elapsedHours(fact.latest_at, facts.as_of),
      success_age_hours: elapsedHours(fact.last_success_at, facts.as_of),
      delivery_complete: fact.delivery_complete,
      published: fact.published,
    };
  }
  private scope(input: unknown) {
    const result = synchronizationQuerySchema.safeParse(input);
    if (!result.success)
      throw new AppError(400, 'VALIDATION_ERROR', 'Synchronization filters are invalid.');
    const query = result.data;
    const facts = this.repository.getSnapshot();
    this.snapshot(facts, query.snapshot_id);
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
    const center = query.center_id
      ? facts.centers.find((item) => item.id === query.center_id)
      : undefined;
    if (query.center_id && !center)
      throw new AppError(400, 'VALIDATION_ERROR', 'The selected center does not exist.');
    if (
      center &&
      ((query.region_id && center.region_id !== query.region_id) ||
        (query.district_id && center.district_id !== query.district_id))
    )
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'The selected center does not belong to the selected geography.',
      );
    const search = query.search?.trim().toLocaleLowerCase('en-US') ?? '';
    const centerIds = new Set(
      facts.centers
        .filter(
          (item) =>
            item.onboarded_at <= facts.as_of &&
            (!query.region_id || item.region_id === query.region_id) &&
            (!query.district_id || item.district_id === query.district_id) &&
            (!query.center_id || item.id === query.center_id),
        )
        .map((item) => item.id),
    );
    const scoped = facts.sync_targets
      .filter((target) => centerIds.has(target.center_id))
      .map((target) => this.target(target, facts))
      .filter(
        (target) =>
          !search ||
          `${target.id} ${target.center_name} ${facts.centers.find((item) => item.id === target.center_id)!.code}`
            .toLocaleLowerCase('en-US')
            .includes(search),
      )
      .sort((a, b) => a.id.localeCompare(b.id, 'en-US', { numeric: true }));
    const matching = scoped.filter(
      (target) =>
        (!query.state || target.state === query.state) &&
        (!query.result ||
          (query.result === 'unknown' ? target.result === null : target.result === query.result)),
    );
    return { query, facts, scoped, matching };
  }
  getOptions(input: unknown = {}): SynchronizationOptions {
    const facts = this.detailInput(input);
    return {
      context: this.context(facts),
      regions: facts.regions.map(({ id, name }) => ({ id, name })),
      districts: facts.districts.map(({ id, name, region_id }) => ({ id, name, region_id })),
      centers: facts.centers
        .filter((center) => center.onboarded_at <= facts.as_of)
        .map(({ id, name, region_id, district_id }) => ({ id, name, region_id, district_id })),
    };
  }
  getDashboard(input: unknown = {}): SynchronizationDashboard {
    const { facts, query, scoped, matching } = this.scope(input);
    const raw = facts.sync_targets.filter((target) => scoped.some((item) => item.id === target.id));
    const counts = { information: 0, warning: 0, critical: 0 };
    for (const target of scoped) {
      const alert = buildSynchronizationAlert(target, facts.as_of, DEFAULT_SYNCHRONIZATION_RULES);
      if (alert) counts[alert.severity]++;
    }
    const offset = (query.page - 1) * query.page_size;
    return {
      context: this.context(facts),
      scope_before_state_result: {
        ...syncCounts(raw, facts.as_of),
        cadence_hours: 24,
        pending_deadline_hours: 2,
      },
      items: matching.slice(offset, offset + query.page_size),
      matching_total: matching.length,
      page: query.page,
      page_size: query.page_size,
      total_pages: Math.ceil(matching.length / query.page_size),
      latest_failed: scoped.filter((target) => target.result === 'failed').length,
      latest_partial: scoped.filter((target) => target.result === 'partial').length,
      alert_counts: counts,
    };
  }
  private alerts(
    input: unknown,
    rules: SynchronizationRules,
    preview: boolean,
  ): SynchronizationAlerts {
    const { facts, query, matching } = this.scope(input);
    const alerts = matching.flatMap((target) => {
      const alert = buildSynchronizationAlert(target, facts.as_of, rules);
      return alert ? [alert] : [];
    });
    const offset = (query.page - 1) * query.page_size;
    return {
      context: this.context(facts),
      items: alerts.slice(offset, offset + query.page_size),
      matching_total: alerts.length,
      page: query.page,
      page_size: query.page_size,
      total_pages: Math.ceil(alerts.length / query.page_size),
      rules,
      preview,
    };
  }
  getAlerts(input: unknown = {}): SynchronizationAlerts {
    return this.alerts(input, DEFAULT_SYNCHRONIZATION_RULES, false);
  }
  getRules(input: unknown = {}): SynchronizationRulesResponse {
    const facts = this.detailInput(input);
    return {
      context: this.context(facts),
      rules: DEFAULT_SYNCHRONIZATION_RULES,
      persistence: 'request_local_preview',
      delivery: 'none',
    };
  }
  evaluate(input: unknown): SynchronizationAlerts {
    const result = synchronizationEvaluationRequestSchema.safeParse(input);
    if (!result.success)
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Escalation rules or preview filters are invalid.',
      );
    return this.alerts(result.data.filters ?? {}, result.data.rules, true);
  }
  getTargetDetail(id: string, input: unknown = {}): SynchronizationTargetDetail {
    const facts = this.detailInput(input);
    const fact = /^target-[1-9]\d*$/.test(id)
      ? facts.sync_targets.find((target) => target.id === id)
      : undefined;
    if (!fact)
      throw new AppError(404, 'NOT_FOUND', 'The requested synchronization target does not exist.');
    const target = this.target(fact, facts);
    return {
      context: this.context(facts),
      target,
      alert: buildSynchronizationAlert(target, facts.as_of, DEFAULT_SYNCHRONIZATION_RULES),
      cadence_hours: 24,
      pending_deadline_hours: 2,
    };
  }
}

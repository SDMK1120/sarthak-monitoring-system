import { executiveQuerySchema } from '@sarthak/shared';
import type { DashboardOptions, ExecutiveDashboard } from '@sarthak/shared';
import { AppError } from '../../lib/errors.js';
import { batchCounts, centerCounts, monthStarts, percentage, syncCounts } from './calculations.js';
import { resolveContext } from './context.js';
import type { ExecutiveRepository } from './repository.js';
import { centerStatusAt, SyntheticExecutiveRepository, syncHealthAt } from './repository.js';

export class ExecutiveService {
  constructor(
    private readonly repository: ExecutiveRepository = new SyntheticExecutiveRepository(),
  ) {}

  getOptions(): DashboardOptions {
    const facts = this.repository.getSnapshot();
    return {
      regions: facts.regions.map(({ id, name }) => ({ id, name })),
      schemes: facts.schemes.map(({ id, name, category_id }) => ({
        id,
        name,
        category: facts.categories.find((category) => category.id === category_id)!.name,
      })),
      snapshot_id: facts.snapshot_id,
      data_as_of: facts.as_of,
      timezone: 'UTC',
      available_period: { start: '2026-01-01', end: '2026-10-01' },
      default_period: { start: '2026-04-01', end: '2026-10-01' },
    };
  }

  getDashboard(input: unknown = {}): ExecutiveDashboard {
    const result = executiveQuerySchema.safeParse(input);
    if (!result.success)
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Dashboard filters are invalid. Provide valid paired dates and supported query fields.',
      );
    const query = result.data;
    const facts = this.repository.getSnapshot();
    const scope = resolveContext(facts, query);
    const centerSummary = centerCounts(scope.centers, facts.as_of);
    const stock = batchCounts(scope.batches, facts.as_of);
    const categoryName = (id: string) =>
      facts.categories.find((category) => category.id === id)!.name;
    const regionName = (id: string) => facts.regions.find((region) => region.id === id)!.name;
    const byScheme = facts.schemes
      .filter((scheme) => !query.scheme_id || scheme.id === query.scheme_id)
      .map((scheme) => {
        const centers = scope.centers.filter((center) => center.scheme_ids.includes(scheme.id));
        const batches = scope.periodBatches.filter((batch) => batch.scheme_id === scheme.id);
        return {
          id: scheme.id,
          name: scheme.name,
          category: categoryName(scheme.category_id),
          centers: centers.length,
          active_centers: centerCounts(centers, facts.as_of).active,
          batches: batches.length,
          enrollments: batches.reduce((sum, batch) => sum + batch.enrollments, 0),
        };
      });
    const visibleSchemes = new Set(byScheme.map((scheme) => scheme.id));
    const byCategory = facts.categories
      .map((category) => {
        const schemes = new Set(
          facts.schemes
            .filter((scheme) => scheme.category_id === category.id && visibleSchemes.has(scheme.id))
            .map((scheme) => scheme.id),
        );
        const centers = scope.centers.filter((center) =>
          center.scheme_ids.some((id) => schemes.has(id)),
        );
        const batches = scope.periodBatches.filter((batch) => schemes.has(batch.scheme_id));
        return {
          id: category.id,
          name: category.name,
          centers: centers.length,
          active_centers: centerCounts(centers, facts.as_of).active,
          batches: batches.length,
          enrollments: batches.reduce((sum, batch) => sum + batch.enrollments, 0),
        };
      })
      .filter((category) => !query.scheme_id || category.centers > 0);
    const centerList = scope.centers.map((center) => {
      const targets = scope.targets.filter((target) => target.center_id === center.id);
      const health = syncCounts(targets, facts.as_of);
      const successfulTimes = targets
        .map((target) => target.last_success_at)
        .filter((at): at is string => at !== null)
        .sort();
      const batches = scope.periodBatches.filter((batch) => batch.center_id === center.id);
      return {
        id: center.id,
        code: center.code,
        name: center.name,
        region_id: center.region_id,
        region_name: regionName(center.region_id),
        district_name: facts.districts.find((district) => district.id === center.district_id)!.name,
        activity_status: centerStatusAt(center, facts.as_of),
        schemes: center.scheme_ids.map(
          (id) => facts.schemes.find((scheme) => scheme.id === id)!.name,
        ),
        batch_count: batches.length,
        enrollments: batches.reduce((sum, batch) => sum + batch.enrollments, 0),
        sync_state:
          health.degraded > 0
            ? ('degraded' as const)
            : health.total > 0 && health.healthy === health.total
              ? ('healthy' as const)
              : ('unknown' as const),
        last_success: successfulTimes.at(-1) ?? null,
      };
    });
    const exceptions = scope.targets
      .flatMap((target) => {
        const health = syncHealthAt(target, facts.as_of);
        if (health.status === 'healthy') return [];
        const center = scope.centers.find((item) => item.id === target.center_id)!;
        return [
          {
            id: target.id,
            center_id: center.id,
            center_name: center.name,
            region_name: regionName(center.region_id),
            state: health.status,
            last_success: target.last_success_at,
            reason: health.reason,
          },
        ];
      })
      .sort((a, b) => a.state.localeCompare(b.state) || a.id.localeCompare(b.id));
    return {
      context: {
        snapshot_id: facts.snapshot_id,
        data_as_of: facts.as_of,
        receipt_cutoff: facts.as_of,
        timezone: 'UTC',
        period_start: scope.start,
        period_end: scope.end,
        region_id: query.region_id ?? null,
        scheme_id: query.scheme_id ?? null,
        mode: 'synthetic_demo',
      },
      centers: {
        ...centerSummary,
        classifiable_percent: percentage(
          centerSummary.active + centerSummary.inactive,
          centerSummary.total,
        ),
      },
      schemes: {
        by_scheme: byScheme,
        by_category: byCategory,
        membership_count: byScheme.reduce((sum, scheme) => sum + scheme.centers, 0),
        distinct_centers: scope.centers.length,
      },
      batches: {
        ...stock,
        created: scope.periodBatches.length,
        enrollments: scope.periodBatches.reduce((sum, batch) => sum + batch.enrollments, 0),
      },
      sync: { ...syncCounts(scope.targets, facts.as_of), cadence_hours: 24, exceptions },
      trends: monthStarts(scope.start, scope.end).map((month) => {
        const next = new Date(`${month}T00:00:00.000Z`);
        next.setUTCMonth(next.getUTCMonth() + 1);
        const exclusiveEnd = next.toISOString();
        const historicalAsOf = new Date(
          Math.min(next.getTime() - 1, Date.parse(facts.as_of)),
        ).toISOString();
        const centers = scope.centers.filter((center) => center.onboarded_at <= historicalAsOf);
        const counts = centerCounts(centers, historicalAsOf);
        const original = scope.batches.filter(
          (batch) =>
            batch.created_at >= `${month}T00:00:00.000Z` && batch.created_at < exclusiveEnd,
        );
        const historical = batchCounts(
          scope.batches.filter((batch) => batch.created_at <= historicalAsOf),
          historicalAsOf,
        );
        return {
          month,
          label: new Date(`${month}T00:00:00.000Z`).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
          }),
          total_centers: counts.total,
          active_centers: counts.active,
          inactive_centers: counts.inactive,
          unknown_centers: counts.unknown,
          batches_created: original.length,
          enrollments: original.reduce((sum, batch) => sum + batch.enrollments, 0),
          utilization_percent: historical.utilization_percent,
          occupied_seats: historical.occupied_seats,
          capacity: historical.capacity,
        };
      }),
      center_list: centerList,
    };
  }
}

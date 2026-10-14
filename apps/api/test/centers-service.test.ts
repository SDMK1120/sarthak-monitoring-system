import { describe, expect, it } from 'vitest';
import { CenterService } from '../src/modules/centers/service.js';
import { SyntheticExecutiveRepository, type ExecutiveFacts } from '../src/modules/executive/repository.js';

describe('center service deterministic source-grain behavior', () => {
  const original = new SyntheticExecutiveRepository().getSnapshot();
  it('uses selected batch scheme attribution for list counts at an overlapping center', () => {
    const center = original.centers.find((candidate) => candidate.scheme_ids.length > 1)!;
    const scheme = center.scheme_ids[0]!;
    const service = new CenterService();
    const row = service.getList({ scheme_id: scheme, search: center.code }).items[0]!;
    const allBatches = original.batches.filter((batch) => batch.center_id === center.id);
    const attributed = allBatches.filter((batch) => batch.scheme_id === scheme);
    expect(row.batch_count).toBe(attributed.length);
    expect(row.enrollments).toBe(attributed.reduce((sum, batch) => sum + batch.enrollments, 0));
    expect(row.batch_count).toBeLessThan(allBatches.length);
    expect(service.getDetail(center.id).profile.batch_count).toBe(allBatches.length);
  });
  it('uses stable identity ordering for tied names and status sorting across pages', () => {
    const facts: ExecutiveFacts = { ...original, centers: original.centers.slice(0, 12).map((center) => ({ ...center, name: 'Same name', history: [{ at: '2026-01-01T00:00:00.000Z', status: 'active' }] })) };
    const service = new CenterService({ getSnapshot: () => facts });
    for (const sort of ['name', 'status']) {
      const first = service.getList({ sort, page_size: 5 });
      const second = service.getList({ sort, page_size: 5, page: 2 });
      expect(first.items.map((center) => center.id)).toEqual(['center-1', 'center-2', 'center-3', 'center-4', 'center-5']);
      expect(second.items.map((center) => center.id)).toEqual(['center-6', 'center-7', 'center-8', 'center-9', 'center-10']);
    }
  });
  it('retains unknown sync and unavailable utilization when no expected targets or capacity exist', () => {
    const firstCenter = original.centers[0]!;
    const facts: ExecutiveFacts = { ...original, centers: [firstCenter], batches: [], sync_targets: [] };
    const detail = new CenterService({ getSnapshot: () => facts }).getDetail(firstCenter.id);
    expect(detail.profile.sync_state).toBe('unknown');
    expect(detail.profile.last_success).toBeNull();
    expect(detail.sync_summary).toMatchObject({ total: 0, healthy: 0, degraded: 0, unknown: 0, health_percent: null, classification_percent: null });
    expect(detail.batch_summary).toMatchObject({ current: 0, comparable: 0, utilization_percent: null });
  });
});

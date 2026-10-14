export type CenterStatus = 'active' | 'inactive' | 'unknown';
export interface StatusObservation { at: string; status: CenterStatus }
export interface CenterFact {
  id: string; code: string; name: string; region_id: string; district_id: string;
  onboarded_at: string; scheme_ids: readonly string[]; history: readonly StatusObservation[];
}
export interface BatchFact {
  // Demo assignments are known at creation and never change. Historical occupancy
  // therefore follows the recorded batch lifecycle, not a reconstructed live LMS feed.
  id: string; center_id: string; scheme_id: string; created_at: string;
  capacity: number | null; enrollments: number; occupied_seats: number;
  started_at: string; completed_at: string | null;
}
export interface SyncFact {
  id: string; center_id: string; connectivity: 'online' | 'offline';
  last_success_at: string | null; latest_at: string | null;
  result: 'success' | 'failed' | 'partial' | 'pending' | null;
  delivery_complete: boolean | null; published: boolean | null;
}
export interface NamedFact { id: string; name: string }
export interface SchemeFact extends NamedFact { category_id: string }
export interface DistrictFact extends NamedFact { region_id: string }
export interface ExecutiveFacts {
  snapshot_id: string; as_of: string; centers: readonly CenterFact[];
  batches: readonly BatchFact[]; sync_targets: readonly SyncFact[];
  regions: readonly NamedFact[]; districts: readonly DistrictFact[];
  schemes: readonly SchemeFact[]; categories: readonly NamedFact[];
}
export interface ExecutiveRepository { getSnapshot(): ExecutiveFacts }

const atMonth = (month: number, day = 1) => `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00.000Z`;
const recordedStatus = (i: number): CenterStatus => i % 17 === 0 ? 'unknown' : i % 7 === 0 ? 'inactive' : 'active';

function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

function createFacts(): ExecutiveFacts {
  const regions = ['North', 'Central', 'South'].map((name, i) => ({ id: `region-${i + 1}`, name: `${name} Region` }));
  const districts = Array.from({ length: 12 }, (_, i) => ({ id: `district-${i + 1}`, name: `District ${String(i + 1).padStart(2, '0')}`, region_id: `region-${Math.floor(i / 4) + 1}` }));
  const categories = [{ id: 'category-skilling', name: 'Skills Development' }, { id: 'category-employment', name: 'Employment Readiness' }];
  const schemes = ['Digital Skills', 'Career Readiness', 'Vocational Training', 'Enterprise Skills'].map((name, i) => ({ id: `scheme-${i + 1}`, name, category_id: i < 2 ? 'category-skilling' : 'category-employment' }));
  const centers: CenterFact[] = Array.from({ length: 84 }, (_, index) => {
    const i = index + 1;
    const districtIndex = index % 12;
    const primary = `scheme-${index % 4 + 1}`;
    const memberships = i % 5 === 0 ? [primary, `scheme-${(index + 1) % 4 + 1}`] : [primary];
    const onboardMonth = 1 + Math.floor(index / 12);
    const history: StatusObservation[] = [];
    for (let month = onboardMonth; month <= 9; month++) {
      history.push({ at: atMonth(month), status: month === 9 ? recordedStatus(index) : (i + month) % 19 === 0 ? 'unknown' : (i + month) % 8 === 0 ? 'inactive' : 'active' });
    }
    return { id: `center-${i}`, code: `SAR-${String(i).padStart(3, '0')}`, name: `Sarthak Center ${String(i).padStart(2, '0')}`, region_id: `region-${Math.floor(districtIndex / 4) + 1}`, district_id: `district-${districtIndex + 1}`, onboarded_at: atMonth(onboardMonth), scheme_ids: memberships, history };
  });
  const batches: BatchFact[] = [];
  for (const [index, center] of centers.entries()) {
    for (let month = 1; month <= 9; month++) {
      if (atMonth(month) < center.onboarded_at || (index + month) % 3 === 0) continue;
      const key = index * 9 + month;
      const capacity = key % 13 === 0 ? null : key % 29 === 0 ? 0 : 20 + key % 4 * 10;
      const seats = capacity && capacity > 0 ? Math.floor(capacity * (0.45 + (key % 10) * 0.05)) : 12 + key % 8;
      const completed = month <= 6;
      batches.push({ id: `batch-${center.id}-${month}`, center_id: center.id, scheme_id: center.scheme_ids[month % center.scheme_ids.length]!, created_at: atMonth(month, 3), capacity, enrollments: seats + key % 3, occupied_seats: seats, started_at: atMonth(month, 5), completed_at: completed ? atMonth(month + 2, 26) : null });
    }
  }
  const sync_targets: SyncFact[] = centers.flatMap((center, i) => [0, 1].map((target) => {
    const key = i * 2 + target;
    const variant = key % 10;
    const result = variant === 0 ? null : variant === 1 ? 'failed' : variant === 2 ? 'partial' : variant === 3 || variant === 4 ? 'pending' : 'success';
    return { id: `target-${key + 1}`, center_id: center.id, connectivity: key % 3 === 0 ? 'offline' : 'online', result,
      last_success_at: variant === 0 ? null : variant === 5 ? '2026-09-28T08:00:00.000Z' : '2026-09-30T08:00:00.000Z',
      latest_at: variant === 0 ? null : variant === 3 ? '2026-09-30T11:00:00.000Z' : '2026-09-30T08:00:00.000Z',
      delivery_complete: variant === 0 ? null : variant !== 2 && variant !== 6,
      published: variant === 0 ? null : variant !== 7,
    } as SyncFact;
  }));
  return freeze({ snapshot_id: 'demo-2026-09-v1', as_of: '2026-09-30T12:00:00.000Z', centers, batches, sync_targets, regions, districts, schemes, categories });
}

const facts = createFacts();
export class SyntheticExecutiveRepository implements ExecutiveRepository {
  getSnapshot(): ExecutiveFacts { return facts; }
}

export function centerStatusAt(center: CenterFact, at: string): CenterStatus {
  return center.history.filter((entry) => entry.at <= at).at(-1)?.status ?? 'unknown';
}

export function syncHealthAt(target: SyncFact, asOf: string): { status: 'healthy' | 'degraded' | 'unknown'; reason: string } {
  const ageHours = (date: string) => (Date.parse(asOf) - Date.parse(date)) / 3_600_000;
  if (target.result === 'failed' || target.result === 'partial') return { status: 'degraded', reason: 'Latest transfer failed or was partial' };
  if (target.last_success_at && ageHours(target.last_success_at) > 24) return { status: 'degraded', reason: 'Last success exceeds synthetic 24-hour cadence' };
  if (target.result === 'pending' && target.latest_at && ageHours(target.latest_at) > 2) return { status: 'degraded', reason: 'Pending transfer exceeds synthetic 2-hour deadline' };
  if (target.delivery_complete === false || target.published === false) return { status: 'degraded', reason: 'Required delivery or publication is incomplete' };
  if (target.result === 'success' && target.last_success_at && target.latest_at && ageHours(target.last_success_at) >= 0 && ageHours(target.latest_at) >= 0 && target.delivery_complete === true && target.published === true) return { status: 'healthy', reason: 'Fresh successful transfer with complete published delivery' };
  return { status: 'unknown', reason: 'Missing evidence or pending within allowed deadline' };
}

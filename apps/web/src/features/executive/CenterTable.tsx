import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { DashboardCenter } from '@sarthak/shared';
import { number, Panel } from './components';
import { RouteLink } from '../centers/navigation';

export type ActivityFilter = 'all' | 'active' | 'inactive' | 'unknown';

export function CenterTable({ centers, activity, setActivity }: { centers: DashboardCenter[]; activity: ActivityFilter; setActivity: (value: ActivityFilter) => void }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const matching = useMemo(() => centers.filter((center) => (activity === 'all' || center.activity_status === activity) && `${center.name} ${center.code} ${center.region_name} ${center.district_name}`.toLowerCase().includes(search.toLowerCase().trim())), [centers, activity, search]);
  const lastPage = Math.max(0, Math.ceil(matching.length / 8) - 1);
  const currentPage = Math.min(page, lastPage);
  const visible = matching.slice(currentPage * 8, currentPage * 8 + 8);
  return <Panel title="Center directory" subtitle="Activity and sync classifications are independent. Table filters only affect this directory.">
    <div className="table-toolbar"><label className="search-control"><Search size={16} aria-hidden="true" /><input aria-label="Search centers" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Search center, district or code" /></label><label className="table-select"><span>Center activity</span><select aria-label="Center activity" value={activity} onChange={(event) => { setActivity(event.target.value as ActivityFilter); setPage(0); }}><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="unknown">Unknown</option></select></label></div>
    <div className="table-scroll"><table className="center-table"><thead><tr><th scope="col">Center</th><th scope="col">Location</th><th scope="col">Activity</th><th scope="col">Batches*</th><th scope="col">Enrollments*</th><th scope="col">Sync</th></tr></thead><tbody>{visible.map((center) => <tr key={center.id}><td><RouteLink className="center-detail-link" href={`/centers/${encodeURIComponent(center.id)}`}><strong>{center.name}</strong></RouteLink><span className="cell-secondary">{center.code}</span></td><td>{center.district_name}<span className="cell-secondary">{center.region_name}</span></td><td><span className={`status-pill ${center.activity_status}`}>{center.activity_status}</span></td><td>{number(center.batch_count)}</td><td>{number(center.enrollments)}</td><td><span className={`status-pill ${center.sync_state}`}>{center.sync_state}</span></td></tr>)}</tbody></table></div>
    {matching.length === 0 && <p className="empty-message">No centers match these table filters.</p>}
    <div className="table-footer"><span>{matching.length === 0 ? '0 results' : `${currentPage * 8 + 1}â€“${Math.min((currentPage + 1) * 8, matching.length)} of ${matching.length} centers`}</span><div><button type="button" aria-label="Previous centers page" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={16} /></button><span>Page {currentPage + 1} of {lastPage + 1}</span><button type="button" aria-label="Next centers page" disabled={currentPage >= lastPage} onClick={() => setPage(currentPage + 1)}><ChevronRight size={16} /></button></div></div>
    <p className="chart-note">*Batches created in the selected period and their enrollments; counts use batch scheme attribution.</p>
  </Panel>;
}

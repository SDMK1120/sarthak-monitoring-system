import { useState } from 'react';
import { Building2, CheckCircle2, HelpCircle, RefreshCw, XCircle } from 'lucide-react';
import type { CenterQuery } from '@sarthak/shared';
import { DashboardShell, MetricCard, number, Panel, percent, SectionHeading } from '../executive/components';
import { CenterContextNotice, CenterRequestState } from './common';
import { navigate, RouteLink } from './navigation';
import { centerSearch, getCenterAnalysis, getCenterOptions, getCenters, readCenterQuery } from './service';
import { useCenterRequest } from './useCenterRequest';

const emptyQuery: CenterQuery = { page: 1, page_size: 10, sort: 'name', order: 'asc' };

export function CenterMonitoringPage() {
  const routeSearch = window.location.search;
  let initial = emptyQuery;
  try { initial = readCenterQuery(routeSearch); } catch { /* Display the actionable request error below. */ }
  const [draft, setDraft] = useState(initial);
  const request = useCenterRequest(async (signal) => {
    const query = readCenterQuery(routeSearch);
    const options = await getCenterOptions(signal);
    const pinned = { ...query, snapshot_id: query.snapshot_id ?? options.context.snapshot_id };
    const [listing, analysis] = await Promise.all([getCenters(pinned, signal), getCenterAnalysis(pinned, signal)]);
    if (listing.context.snapshot_id !== analysis.context.snapshot_id || listing.context.snapshot_id !== pinned.snapshot_id) throw new Error('Center publications do not match. Try again.');
    return { options, listing, analysis, query: pinned };
  }, routeSearch);
  const result = request.data;
  function apply(next = draft) { navigate(`/centers${centerSearch({ ...next, page: 1, ...(result ? { snapshot_id: next.snapshot_id ?? result.options.context.snapshot_id } : {}) })}`); }
  function inspectStatus(status?: CenterQuery['activity_status']) {
    if (!result) return;
    const next = { ...result.query };
    if (status) next.activity_status = status;
    else delete next.activity_status;
    apply(next);
  }
  function change(key: keyof CenterQuery, value: string) {
    setDraft((previous) => {
      const updated = { ...previous };
      if (!value) delete updated[key];
      else Object.assign(updated, { [key]: value });
      if (key === 'region_id') delete updated.district_id;
      return updated;
    });
  }
  const districts = result?.options.districts.filter((item) => !draft.region_id || item.region_id === draft.region_id) ?? [];
  return <DashboardShell><main className="dashboard-main" id="center-monitoring"><div className="page-heading"><div><p className="eyebrow">OPERATIONS / CENTER NETWORK</p><h1>Center monitoring</h1><p>Explore onboarded centers, recorded activity and source coverage.</p></div><button className="secondary-button" aria-label="Refresh centers" type="button" disabled={request.loading} onClick={request.retry}><RefreshCw size={16} />Refresh</button></div>
    {result && <CenterContextNotice context={result.listing.context} />}
    <form className="filter-bar center-filter-bar" onSubmit={(event) => { event.preventDefault(); apply(); }}>
      <label>Region<select aria-label="Region" value={draft.region_id ?? ''} disabled={!result} onChange={(event) => change('region_id', event.target.value)}><option value="">All regions</option>{result?.options.regions.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
      <label>District<select aria-label="District" value={draft.district_id ?? ''} disabled={!result} onChange={(event) => change('district_id', event.target.value)}><option value="">All districts</option>{districts.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
      <label>Scheme<select aria-label="Scheme" value={draft.scheme_id ?? ''} disabled={!result} onChange={(event) => change('scheme_id', event.target.value)}><option value="">All schemes</option>{result?.options.schemes.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
      <label>Activity status<select aria-label="Activity status" value={draft.activity_status ?? ''} disabled={!result} onChange={(event) => change('activity_status', event.target.value)}><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="unknown">Unknown</option></select></label>
      <label className="center-search-field">Search centers<input aria-label="Search centers" maxLength={100} placeholder="Name or center code" value={draft.search ?? ''} onChange={(event) => change('search', event.target.value)} /></label>
      <label>Sort by<select aria-label="Sort by" value={draft.sort} onChange={(event) => change('sort', event.target.value)}><option value="name">Name</option><option value="code">Center code</option><option value="status">Activity status</option></select></label>
      <label>Sort order<select aria-label="Sort order" value={draft.order} onChange={(event) => change('order', event.target.value)}><option value="asc">Ascending</option><option value="desc">Descending</option></select></label>
      <button className="primary-button" type="submit" disabled={!result}>Apply filters</button><button className="text-button" type="button" onClick={() => navigate('/centers')}>Reset filters</button>
    </form>
    <CenterRequestState {...request} />
    {result && <><div className="context-line"><span>Applied scope: {result.options.regions.find((row) => row.id === result.query.region_id)?.name ?? 'All regions'} Â· {result.options.districts.find((row) => row.id === result.query.district_id)?.name ?? 'All districts'} Â· {result.options.schemes.find((row) => row.id === result.query.scheme_id)?.name ?? 'All schemes'} Â· Activity: {result.query.activity_status ?? 'all'}{result.query.search ? ` Â· Search: ${result.query.search}` : ''}</span><span>{number(result.listing.matching_total)} matching centers</span></div>
      <div className="metric-grid center-metric-grid"><MetricCard label="Total centers" value={number(result.analysis.scope_before_status.total)} detail="Scoped centers before activity filter" icon={<Building2 size={19} />} onClick={() => inspectStatus()} /><MetricCard label="Active centers" value={number(result.analysis.scope_before_status.active)} detail="Recorded active; before activity filter" icon={<CheckCircle2 size={19} />} tone="green" onClick={() => inspectStatus('active')} /><MetricCard label="Inactive centers" value={number(result.analysis.scope_before_status.inactive)} detail="Recorded inactive; before activity filter" icon={<XCircle size={19} />} tone="amber" onClick={() => inspectStatus('inactive')} /><MetricCard label="Unknown activity" value={number(result.analysis.scope_before_status.unknown)} detail={`Classification coverage ${percent(result.analysis.scope_before_status.classifiable_percent)}`} icon={<HelpCircle size={19} />} onClick={() => inspectStatus('unknown')} /></div>
      <SectionHeading id="center-list" number="01" title="Center directory" subtitle="Server-paginated results; open a center to inspect its evidence" />
      <Panel title="Onboarded centers" subtitle="Batch and enrollment counts cover all recorded creation dates, attributed to the selected batch scheme where filtered."><div className="table-scroll"><table className="center-table" aria-label="Center listing"><thead><tr><th scope="col">Center</th><th scope="col">Location</th><th scope="col">Schemes</th><th scope="col">Activity</th><th scope="col">Batches</th><th scope="col">Enrollments</th><th scope="col">Sync</th></tr></thead><tbody>{result.listing.items.map((center) => <tr key={center.id}><td><RouteLink className="center-detail-link" href={`/centers/${encodeURIComponent(center.id)}${centerSearch(result.query)}`}><strong>{center.name}</strong></RouteLink><span className="cell-secondary">{center.code}</span></td><td>{center.district_name}<span className="cell-secondary">{center.region_name}</span></td><td>{center.schemes.map((scheme) => scheme.name).join(', ')}</td><td><span className={`status-pill ${center.activity_status}`}>{center.activity_status}</span></td><td>{number(center.batch_count)}</td><td>{number(center.enrollments)}</td><td><span className={`status-pill ${center.sync_state}`}>{center.sync_state}</span></td></tr>)}</tbody></table></div>{result.listing.items.length === 0 && <div className="empty-message">{result.listing.matching_total > 0 ? <><p>This page is beyond the available results.</p><button type="button" className="text-button" onClick={() => navigate(`/centers${centerSearch({ ...result.query, page: 1 })}`)}>Go to first page</button></> : <p>No centers match these filters. Reset or broaden your search.</p>}</div>}<div className="table-footer"><span>{result.listing.items.length === 0 ? `${result.listing.matching_total} matching centers · no results on this page` : `${(result.listing.page - 1) * result.listing.page_size + 1}â€“${Math.min(result.listing.page * result.listing.page_size, result.listing.matching_total)} of ${result.listing.matching_total} centers`}</span><div><button type="button" aria-label="Previous page" disabled={result.listing.page <= 1} onClick={() => navigate(`/centers${centerSearch({ ...result.query, page: result.query.page - 1 })}`)}>â†</button><span>Page {result.listing.page} of {Math.max(1, result.listing.total_pages)}</span><button type="button" aria-label="Next page" disabled={result.listing.page >= result.listing.total_pages} onClick={() => navigate(`/centers${centerSearch({ ...result.query, page: result.query.page + 1 })}`)}>â†’</button></div></div></Panel>
      <SectionHeading id="center-geography" number="02" title="Geographical analysis" subtitle="Counts use the same region, district, scheme and search scope before activity filtering" />
      <div className="two-panels"><Panel title="Region coverage"><Geography rows={result.analysis.by_region} drill={(id) => { const next = { ...result.query, region_id: id }; delete next.district_id; apply(next); }} kind="region" /></Panel><Panel title="District coverage"><Geography rows={result.analysis.by_district} drill={(id) => { const district = result.options.districts.find((row) => row.id === id); if (district) apply({ ...result.query, region_id: district.region_id, district_id: id }); }} kind="district" /></Panel></div>
    </>}
  </main></DashboardShell>;
}

function Geography({ rows, drill, kind }: { rows: { id: string; name: string; counts: { total: number; active: number; inactive: number; unknown: number } }[]; drill: (id: string) => void; kind: string }) {
  return <div className="table-scroll"><table aria-label={`${kind} analysis`}><thead><tr><th scope="col">{kind}</th><th scope="col">Total</th><th scope="col">Active</th><th scope="col">Inactive</th><th scope="col">Unknown</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><button type="button" className="geography-link" aria-label={`Show ${kind} ${row.name}`} onClick={() => drill(row.id)}>{row.name}</button></td><td>{row.counts.total}</td><td>{row.counts.active}</td><td>{row.counts.inactive}</td><td>{row.counts.unknown}</td></tr>)}</tbody></table>{rows.length === 0 && <p className="empty-message">No geographical observations for this scope.</p>}</div>;
}

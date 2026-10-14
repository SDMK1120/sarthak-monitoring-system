import { useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, Radio, RefreshCw } from 'lucide-react';
import type { SynchronizationQuery } from '@sarthak/shared';
import { DashboardShell, MetricCard, number, Panel, percent, SectionHeading } from '../executive/components';
import { navigate, RouteLink } from '../centers/navigation';
import { useCenterRequest } from '../centers/useCenterRequest';
import { getSynchronizationAlerts, getSynchronizationDashboard, getSynchronizationOptions, getSynchronizationRules, readSynchronizationQuery, synchronizationSearch } from './service';
import { syncTimestamp, SyncNotice, SyncRequestState } from './common';
import { AlertTable } from './AlertTable';
import { EscalationPreview } from './EscalationPreview';

const defaultQuery: SynchronizationQuery = { page: 1, page_size: 10 };

export function SynchronizationPage() {
  const routeSearch = window.location.search;
  let initial = defaultQuery;
  try { initial = readSynchronizationQuery(routeSearch); } catch { /* Invalid context is displayed below. */ }
  const [draft, setDraft] = useState(initial);
  const request = useCenterRequest(async (signal) => {
    const query = readSynchronizationQuery(routeSearch);
    const options = await getSynchronizationOptions(signal);
    const pinned = { ...query, snapshot_id: query.snapshot_id ?? options.context.snapshot_id };
    const [dashboard, alerts, rules] = await Promise.all([getSynchronizationDashboard(pinned, signal), getSynchronizationAlerts(pinned, signal), getSynchronizationRules(pinned.snapshot_id, signal)]);
    if ([dashboard.context, alerts.context, rules.context].some((context) => context.snapshot_id !== pinned.snapshot_id)) throw new Error('Synchronization publications do not match. Try again.');
    return { options, dashboard, alerts, rules, query: pinned };
  }, routeSearch);
  const result = request.data;
  function apply(next = draft) { navigate(`/synchronization${synchronizationSearch({ ...next, page: 1, ...(result ? { snapshot_id: next.snapshot_id ?? result.options.context.snapshot_id } : {}) })}`); }
  function change(key: keyof SynchronizationQuery, value: string) {
    setDraft((current) => {
      const next = { ...current };
      if (value) Object.assign(next, { [key]: value }); else delete next[key];
      if (key === 'region_id') { delete next.district_id; delete next.center_id; }
      if (key === 'district_id') delete next.center_id;
      return next;
    });
  }
  const districts = result?.options.districts.filter((row) => !draft.region_id || row.region_id === draft.region_id) ?? [];
  const centers = result?.options.centers.filter((row) => (!draft.region_id || row.region_id === draft.region_id) && (!draft.district_id || row.district_id === draft.district_id)) ?? [];
  function inspect(state?: SynchronizationQuery['state']) { if (result) { const next = { ...result.query }; if (state) next.state = state; else delete next.state; delete next.result; apply(next); } }
  function failures(transfer: 'failed' | 'partial') { if (result) { const next = { ...result.query, result: transfer }; delete next.state; apply(next); } }
  return <DashboardShell><main className="dashboard-main" id="synchronization-monitoring"><div className="page-heading"><div><p className="eyebrow">OPERATIONS / SYNCHRONIZATION</p><h1>Synchronization monitoring</h1><p>Inspect target health, transfer evidence and recommended escalation.</p></div><button type="button" className="secondary-button" aria-label="Refresh synchronization" disabled={request.loading} onClick={request.retry}><RefreshCw size={16} />Refresh</button></div>
    {result && <SyncNotice asOf={result.dashboard.context.data_as_of} />}
    <form className="filter-bar sync-filter-bar" onSubmit={(event) => { event.preventDefault(); apply(); }}>
      <label>Region<select aria-label="Region" value={draft.region_id ?? ''} disabled={!result} onChange={(event) => change('region_id', event.target.value)}><option value="">All regions</option>{result?.options.regions.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
      <label>District<select aria-label="District" value={draft.district_id ?? ''} disabled={!result} onChange={(event) => change('district_id', event.target.value)}><option value="">All districts</option>{districts.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
      <label>Center<select aria-label="Center" value={draft.center_id ?? ''} disabled={!result} onChange={(event) => change('center_id', event.target.value)}><option value="">All centers</option>{centers.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
      <label>Sync health<select aria-label="Sync health" value={draft.state ?? ''} disabled={!result} onChange={(event) => change('state', event.target.value)}><option value="">All health states</option><option value="healthy">Healthy</option><option value="degraded">Degraded</option><option value="unknown">Unknown</option></select></label>
      <label>Transfer result<select aria-label="Transfer result" value={draft.result ?? ''} disabled={!result} onChange={(event) => change('result', event.target.value)}><option value="">All results</option><option value="success">Success</option><option value="failed">Failed</option><option value="partial">Partial</option><option value="pending">Pending</option><option value="unknown">Unknown evidence</option></select></label>
      <label>Search sync targets<input aria-label="Search sync targets" maxLength={100} value={draft.search ?? ''} placeholder="Target or center" onChange={(event) => change('search', event.target.value)} /></label>
      <button className="primary-button" type="submit" disabled={!result}>Apply filters</button><button className="text-button" type="button" onClick={() => navigate('/synchronization')}>Reset filters</button>
    </form><SyncRequestState {...request} />
    {result && <><div className="context-line"><span>Applied scope: {result.options.regions.find((row) => row.id === result.query.region_id)?.name ?? 'All regions'} · {result.options.districts.find((row) => row.id === result.query.district_id)?.name ?? 'All districts'} · {result.options.centers.find((row) => row.id === result.query.center_id)?.name ?? 'All centers'} · Health: {result.query.state ?? 'all'} · Transfer: {result.query.result ?? 'all'}{result.query.search ? ` · Search: ${result.query.search}` : ''}</span><span>{number(result.dashboard.matching_total)} matching targets</span></div>
      <div className="metric-grid center-metric-grid"><MetricCard label="Expected targets" value={number(result.dashboard.scope_before_state_result.total)} detail="Scoped roster before health/result filters" icon={<Radio size={19} />} onClick={() => inspect()} /><MetricCard label="Healthy targets" value={number(result.dashboard.scope_before_state_result.healthy)} detail="Fresh, complete and published evidence" icon={<CheckCircle2 size={19} />} tone="green" onClick={() => inspect('healthy')} /><MetricCard label="Degraded targets" value={number(result.dashboard.scope_before_state_result.degraded)} detail="Known delivery or freshness issues" icon={<AlertTriangle size={19} />} tone="amber" onClick={() => inspect('degraded')} /><MetricCard label="Unknown targets" value={number(result.dashboard.scope_before_state_result.unknown)} detail="Missing or not-yet-overdue evidence" icon={<HelpCircle size={19} />} onClick={() => inspect('unknown')} /></div>
      <p className="coverage-notice">Health: {percent(result.dashboard.scope_before_state_result.health_percent)} of expected targets. Classification coverage: {percent(result.dashboard.scope_before_state_result.classification_percent)}. Healthy + degraded + unknown = expected roster. Demo cadence 24 hours; pending deadline 2 hours.</p>
      <SectionHeading id="sync-targets" number="01" title="Target & transfer monitoring" subtitle="Latest transfer observations and last recorded successful synchronization" /><div className="batch-context"><span><strong>{result.dashboard.latest_failed}</strong> latest failed transfers</span><span><strong>{result.dashboard.latest_partial}</strong> latest partial transfers</span><button className="geography-link" type="button" onClick={() => failures('failed')}>Monitor failed transfers</button><button className="geography-link" type="button" onClick={() => failures('partial')}>Monitor partial transfers</button></div>
      <Panel title="Synchronization targets" subtitle="Connectivity does not determine activity or health. Failure counts describe latest observed results, not all historical attempts."><div className="table-scroll"><table className="sync-target-table" aria-label="Synchronization target listing"><thead><tr><th scope="col">Target / center</th><th scope="col">Health / reason</th><th scope="col">Connectivity</th><th scope="col">Latest result</th><th scope="col">Last observation</th><th scope="col">Last successful sync</th></tr></thead><tbody>{result.dashboard.items.map((target) => <tr key={target.id}><td><RouteLink className="center-detail-link" href={`/synchronization/targets/${encodeURIComponent(target.id)}${synchronizationSearch(result.query)}`}>{target.id}</RouteLink><span className="cell-secondary">{target.center_name} · {target.district_name}</span></td><td><span className={`status-pill ${target.state}`}>{target.state}</span><span className="cell-secondary">{target.reason}</span></td><td>{target.connectivity}</td><td>{target.result ?? 'Unknown'}</td><td>{syncTimestamp(target.latest_at)}</td><td>{syncTimestamp(target.last_success_at)}</td></tr>)}</tbody></table></div>
        {result.dashboard.items.length === 0 && <div className="empty-message">{result.dashboard.matching_total > 0 ? <><p>This page is beyond the available targets.</p><button className="text-button" type="button" onClick={() => apply(result.query)}>Go to first page</button></> : <p>No synchronization targets match these filters.</p>}</div>}
        <div className="table-footer"><span>{result.dashboard.items.length === 0 ? `${result.dashboard.matching_total} matching targets · no results on this page` : `${(result.dashboard.page - 1) * result.dashboard.page_size + 1}–${Math.min(result.dashboard.page * result.dashboard.page_size, result.dashboard.matching_total)} of ${result.dashboard.matching_total} targets`}</span><div><button type="button" aria-label="Previous page" disabled={result.dashboard.page <= 1} onClick={() => navigate(`/synchronization${synchronizationSearch({ ...result.query, page: result.dashboard.page - 1 })}`)}>←</button><span>Page {result.dashboard.page} of {Math.max(1, result.dashboard.total_pages)}</span><button type="button" aria-label="Next page" disabled={result.dashboard.page >= result.dashboard.total_pages} onClick={() => navigate(`/synchronization${synchronizationSearch({ ...result.query, page: result.dashboard.page + 1 })}`)}>→</button></div></div>
      </Panel><SectionHeading id="sync-alerts" number="02" title="Alert feed" subtitle="Primary observations with evidence age and recommended recipient role" /><Panel title="Synchronization alerts" subtitle={`Scope counts before health/result filters: Critical: ${result.dashboard.alert_counts.critical} · Warning: ${result.dashboard.alert_counts.warning} · Information: ${result.dashboard.alert_counts.information}`}><AlertTable alerts={result.alerts} query={result.query} /></Panel>
      <SectionHeading id="sync-escalation" number="03" title="Escalation preview" subtitle="Review the threshold ladder without persisting policies or sending notifications" /><EscalationPreview rules={result.rules.rules} query={result.query} />
    </>}
  </main></DashboardShell>;
}

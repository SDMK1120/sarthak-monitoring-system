import { useState } from 'react';
import { Activity, AlertCircle, ArrowRight, Building2, CalendarDays, CheckCircle2, Layers3, RefreshCw, Users, XCircle } from 'lucide-react';
import type { ExecutiveQuery } from '@sarthak/shared';
import { BatchCharts, NetworkChart, SchemeChart } from './Charts';
import { CenterTable } from './CenterTable';
import type { ActivityFilter } from './CenterTable';
import { DashboardShell, dateLabel, MetricCard, number, percent, SectionHeading } from './components';
import { SyncHealth } from './SyncHealth';
import { useExecutiveDashboard } from './useExecutiveDashboard';

export function ExecutiveDashboardPage() {
  const { options, data, loading, error, load } = useExecutiveDashboard();
  const [region, setRegion] = useState('');
  const [scheme, setScheme] = useState('');
  const [months, setMonths] = useState('6');
  const [activity, setActivity] = useState<ActivityFilter>('all');
  function query(regionId: string, schemeId: string, monthCount: string): ExecutiveQuery {
    const end = options?.default_period.end ?? '2026-10-01';
    const start = new Date(`${end}T00:00:00Z`);
    start.setUTCMonth(start.getUTCMonth() - Number(monthCount));
    return { ...(regionId ? { region_id: regionId } : {}), ...(schemeId ? { scheme_id: schemeId } : {}), period_start: start.toISOString().slice(0, 10), period_end: end, ...(options ? { snapshot_id: options.snapshot_id } : {}) };
  }
  function apply() { setActivity('all'); void load(query(region, scheme, months)); }
  function reset() { setRegion(''); setScheme(''); setMonths('6'); setActivity('all'); void load(query('', '', '6')); }
  function inspect(status: ActivityFilter) { setActivity(status); document.getElementById('center-directory')?.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }
  const regionName = options?.regions.find((item) => item.id === data?.context.region_id)?.name ?? 'All regions';
  const schemeName = options?.schemes.find((item) => item.id === data?.context.scheme_id)?.name ?? 'All schemes';
  return <DashboardShell><main className="dashboard-main" id="overview">
    <div className="page-heading"><div><p className="eyebrow">ORGANIZATION AT A GLANCE</p><h1>Executive dashboard</h1><p>Monitor the center network, learning operations and data coverage.</p></div><button type="button" className="secondary-button refresh-button" aria-label="Refresh dashboard" disabled={loading} onClick={() => { void load(); }}><RefreshCw size={16} className={loading ? 'spin' : ''} />Refresh</button></div>
    <div className="demo-notice"><span className="notice-icon"><Activity size={17} /></span><div><strong>A connected view of an offline-first LMS</strong><span>This presentation uses synthetic data. Refresh reloads the published demo snapshot.</span></div><span className="notice-label">DEMONSTRATION</span></div>
    <form className="filter-bar" onSubmit={(event) => { event.preventDefault(); apply(); }}><label>Region<select aria-label="Region" disabled={loading || !options} value={region} onChange={(event) => setRegion(event.target.value)}><option value="">All regions</option>{options?.regions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Scheme<select aria-label="Scheme" disabled={loading || !options} value={scheme} onChange={(event) => setScheme(event.target.value)}><option value="">All schemes</option>{options?.schemes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Event period<select aria-label="Event period" disabled={loading || !options} value={months} onChange={(event) => setMonths(event.target.value)}><option value="6">Last 6 months</option><option value="3">Last 3 months</option><option value="1">Last month</option></select></label><button type="submit" className="primary-button" disabled={loading || !options}>Apply filters<ArrowRight size={15} /></button><button type="button" className="text-button" disabled={loading || !options} onClick={reset}>Reset filters</button></form>
    {loading && <div className="loading-state" role="status"><span className="loading-ring" /><h2>Loading dashboard…</h2><p>Preparing a consistent view of your selected scope.</p></div>}
    {error && <div className="error-state" role="alert"><AlertCircle size={28} /><h2>Dashboard unavailable</h2><p>{error}</p><button type="button" className="primary-button" onClick={() => { void load(); }}>Try again</button></div>}
    {data && <>
      <div className="context-line"><div><span className="scope-chip">{regionName}</span><span className="scope-chip">{schemeName}</span><span className="period-label"><CalendarDays size={14} />{dateLabel(`${data.context.period_start}T00:00:00Z`)} – {dateLabel(new Date(new Date(`${data.context.period_end}T00:00:00Z`).getTime() - 86400000).toISOString())}</span></div><span>Stock snapshot: {dateLabel(data.context.data_as_of)} · IST</span></div>
      {data.centers.total === 0 && <div className="coverage-notice"><AlertCircle size={17} /><p>No centers are available for this scope. Try another region or scheme.</p></div>}
      <div className="metric-grid"><MetricCard label="Total centers" value={number(data.centers.total)} detail="Distinct onboarded centers · snapshot" icon={<Building2 size={19} />} onClick={() => inspect('all')} /><MetricCard label="Active centers" value={number(data.centers.active)} detail="Recorded active · snapshot" icon={<CheckCircle2 size={19} />} tone="green" onClick={() => inspect('active')} /><MetricCard label="Inactive centers" value={number(data.centers.inactive)} detail="Recorded inactive · snapshot" icon={<XCircle size={19} />} tone="amber" onClick={() => inspect('inactive')} /><MetricCard label="Batches created" value={number(data.batches.created)} detail="Original creations · selected period" icon={<Layers3 size={19} />} /><MetricCard label="Learner enrollments" value={number(data.batches.enrollments)} detail="In period-created batches · not unique learners" icon={<Users size={19} />} tone="violet" /><MetricCard label="Batch utilization" value={percent(data.batches.utilization_percent)} detail={`${number(data.batches.occupied_seats)} seats / ${number(data.batches.capacity)} capacity · snapshot`} icon={<Activity size={19} />} tone="teal" /></div>
      <div className="coverage-notice"><AlertCircle size={16} /><p><strong>{data.centers.unknown} centers with unknown activity.</strong> Classification coverage {percent(data.centers.classifiable_percent)}. Unknown activity is not counted as inactive; sync health is assessed separately.</p></div>
      <SectionHeading id="network" number="01" title="Center network" subtitle="Coverage across schemes and operating locations" /><SchemeChart data={data} />
      <div id="center-directory"><CenterTable key={`${data.context.region_id}-${data.context.scheme_id}-${data.context.period_start}`} centers={data.center_list} activity={activity} setActivity={setActivity} /></div>
      <SectionHeading id="batches" number="02" title="Batch analytics" subtitle="Creation flow and month-end capacity, with separate time bases" />
      <div className="batch-context"><span><strong>{number(data.batches.current)}</strong> planned/running batches at snapshot</span><span><strong>{number(data.batches.comparable)}</strong> comparable batches</span><span><strong>{number(data.batches.excluded)}</strong> excluded from utilization</span></div><BatchCharts data={data} />
      <SectionHeading id="sync" number="03" title="Synchronization health" subtitle="A transparent view of freshness, failures and missing evidence" /><SyncHealth data={data} />
      <SectionHeading id="trends" number="04" title="Network trends" subtitle="Historical observations, rather than today's status projected backward" /><NetworkChart data={data} />
      <footer className="dashboard-footer"><span>Sarthak Monitoring System · Executive dashboard</span><span>Published synthetic snapshot · Received through {dateLabel(data.context.receipt_cutoff)}</span></footer>
    </>}
  </main></DashboardShell>;
}

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ExecutiveDashboard } from '@sarthak/shared';
import { ChartTable, number, Panel, percent } from './components';

const axis = { fontSize: 11, fill: '#758397' };
const tooltipStyle = { borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 };

export function SchemeChart({ data }: { data: ExecutiveDashboard }) {
  return <Panel title="Scheme distribution" eyebrow="NETWORK COVERAGE" subtitle="Distinct onboarded centers by scheme at the snapshot">
    <div className="chart-box scheme-chart" role="img" aria-label="Horizontal bar chart of centers per scheme"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.schemes.by_scheme} layout="vertical" margin={{ left: 8, right: 30, top: 5, bottom: 0 }}><CartesianGrid stroke="#eef2f6" horizontal={false} /><XAxis type="number" allowDecimals={false} tick={axis} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={120} tick={axis} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f5f8ff' }} /><Bar dataKey="centers" name="Centers" fill="#4276f6" radius={[0, 5, 5, 0]} barSize={22} /></BarChart></ResponsiveContainer></div>
    <p className="chart-note">Centers may belong to multiple schemes. Counts cannot be added as a network total.</p>
    <ChartTable headers={['Scheme', 'Category', 'Centers', 'Active centers']} rows={data.schemes.by_scheme.map((row) => [row.name, row.category, row.centers, row.active_centers])} />
  </Panel>;
}

export function BatchCharts({ data }: { data: ExecutiveDashboard }) {
  return <div className="two-panels"><Panel title="Monthly batch creation" eyebrow="BATCH ACTIVITY" subtitle="Original creations in the selected event period">
    <div className="chart-box" role="img" aria-label="Monthly batch creation bar chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.trends} margin={{ left: -15, right: 12, top: 15, bottom: 0 }}><CartesianGrid vertical={false} stroke="#eef2f6" /><XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={axis} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f5f8ff' }} /><Bar dataKey="batches_created" name="Batches created" fill="#4276f6" radius={[5, 5, 0, 0]} maxBarSize={38} /></BarChart></ResponsiveContainer></div>
    <ChartTable headers={['Month', 'Batches created', 'Enrollments in created batches']} rows={data.trends.map((row) => [row.month, row.batches_created, row.enrollments])} />
  </Panel><Panel title="Batch utilization trend" eyebrow="CAPACITY AT MONTH END" subtitle="Weighted occupied seats ÷ comparable capacity">
    <div className="chart-box" role="img" aria-label="Month-end batch utilization percentage chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.trends} margin={{ left: -10, right: 15, top: 15, bottom: 0 }}><CartesianGrid vertical={false} stroke="#eef2f6" /><XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} /><YAxis tick={axis} axisLine={false} tickLine={false} unit="%" /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="utilization_percent" name="Utilization (%)" stroke="#0f9c91" strokeWidth={3} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} connectNulls={false} /></LineChart></ResponsiveContainer></div>
    <ChartTable headers={['Month', 'Occupied seats', 'Capacity', 'Utilization']} rows={data.trends.map((row) => [row.month, number(row.occupied_seats), number(row.capacity), percent(row.utilization_percent)])} />
  </Panel></div>;
}

export function NetworkChart({ data }: { data: ExecutiveDashboard }) {
  return <Panel title="Center activity over time" eyebrow="HISTORICAL NETWORK" subtitle="Recorded activity status at each month-end; synchronization is separate">
    <div className="chart-box" role="img" aria-label="Historical active inactive and unknown center counts"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.trends} margin={{ left: -15, right: 12, top: 15, bottom: 0 }}><defs><linearGradient id="activeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4276f6" stopOpacity={0.17} /><stop offset="100%" stopColor="#4276f6" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#eef2f6" /><XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={axis} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} /><Area type="monotone" dataKey="active_centers" name="Active" stroke="#4276f6" fill="url(#activeFill)" strokeWidth={2.5} /><Area type="monotone" dataKey="inactive_centers" name="Inactive" stroke="#e79a36" fill="transparent" strokeWidth={2} /><Area type="monotone" dataKey="unknown_centers" name="Unknown" stroke="#94a3b8" fill="transparent" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
    <ChartTable headers={['Month', 'Total centers', 'Active', 'Inactive', 'Unknown']} rows={data.trends.map((row) => [row.month, row.total_centers, row.active_centers, row.inactive_centers, row.unknown_centers])} />
  </Panel>;
}

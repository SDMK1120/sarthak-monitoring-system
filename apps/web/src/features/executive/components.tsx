import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, Building2, Layers3, LayoutDashboard, Radio, TrendingUp } from 'lucide-react';
import { RouteLink } from '../centers/navigation';

const sections = [
  { id: 'overview', label: 'Executive overview', icon: LayoutDashboard },
  { id: 'network', label: 'Center network', icon: Building2 },
  { id: 'batches', label: 'Batch analytics', icon: Layers3 },
  { id: 'sync', label: 'Synchronization', icon: Radio },
  { id: 'trends', label: 'Network trends', icon: TrendingUp },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState('overview');
  const centersPage = window.location.pathname.startsWith('/centers');
  const syncPage = window.location.pathname.startsWith('/synchronization');
  const dedicatedPage = centersPage || syncPage;
  return (
    <div className="dashboard-shell">
      <a
        className="skip-link"
        href={
          centersPage
            ? '#center-monitoring'
            : syncPage
              ? '#synchronization-monitoring'
              : '#overview'
        }
      >
        Skip to content
      </a>
      <aside className="sidebar">
        <RouteLink className="brand" href="/" onClick={() => setActiveSection('overview')}>
          <span className="brand-mark">S</span>
          <span>
            Sarthak<span className="brand-caption">MONITORING SYSTEM</span>
          </span>
        </RouteLink>
        <div className="sidebar-label">WORKSPACE</div>
        <nav aria-label="Dashboard sections">
          {dedicatedPage && (
            <RouteLink href="/">
              <LayoutDashboard size={18} aria-hidden="true" />
              <span>Executive overview</span>
            </RouteLink>
          )}
          <RouteLink href="/centers" aria-current={centersPage ? 'page' : undefined}>
            <Building2 size={18} aria-hidden="true" />
            <span>Center monitoring</span>
          </RouteLink>
          <RouteLink href="/synchronization" aria-current={syncPage ? 'page' : undefined}>
            <Radio size={18} aria-hidden="true" />
            <span>Synchronization monitoring</span>
          </RouteLink>
          {!dedicatedPage &&
            sections.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeSection === id ? 'location' : undefined}
                onClick={() => setActiveSection(id)}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </a>
            ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="workspace-dot" />
          Demo workspace
          <p>
            Offline-first learning.
            <br />
            Organization-wide visibility.
          </p>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span className="topbar-breadcrumb">
            Sarthak LMS <span>/</span> Monitoring
          </span>
          <span className="demo-badge">
            <span />
            Synthetic demo data
          </span>
        </header>
        {children}
      </div>
    </div>
  );
}

export function Panel({
  title,
  eyebrow,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-heading">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h3>{title}</h3>
          {subtitle && <p className="panel-subtitle">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon,
  tone = 'blue',
  onClick,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  tone?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="metric-top">
        <span>{label}</span>
        <span className={`metric-icon ${tone}`}>{icon}</span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-detail">
        {detail}
        {onClick && <ArrowUpRight size={14} aria-hidden="true" />}
      </div>
    </>
  );
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className="metric-card clickable-card"
      aria-label={`View ${label.toLowerCase()}`}
    >
      {content}
    </button>
  ) : (
    <div className="metric-card">{content}</div>
  );
}

export function SectionHeading({
  id,
  number,
  title,
  subtitle,
}: {
  id: string;
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="section-heading" id={id}>
      <div>
        <span className="section-number">{number}</span>
        <h2>{title}</h2>
      </div>
      <p>{subtitle}</p>
    </div>
  );
}

export const number = (value: number) => new Intl.NumberFormat('en-IN').format(value);
export const percent = (value: number | null) => (value === null ? 'N/A' : `${value.toFixed(1)}%`);
export const dateLabel = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value));

export function ChartTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <details className="chart-details">
      <summary>View data table</summary>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th scope="col" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

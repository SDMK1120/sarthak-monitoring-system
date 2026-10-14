import { useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, Radio } from 'lucide-react';
import type { ExecutiveDashboard } from '@sarthak/shared';
import { number, Panel, percent } from './components';
import { RouteLink } from '../centers/navigation';
import { syncTimestamp } from '../synchronization/common';

export function SyncHealth({ data }: { data: ExecutiveDashboard }) {
  const summary = data.sync;
  const [showAll, setShowAll] = useState(false);
  const observations = showAll ? summary.exceptions : summary.exceptions.slice(0, 5);
  return (
    <div className="sync-grid">
      <Panel
        title="Synchronization health"
        eyebrow="EXPECTED SYNC TARGETS"
        subtitle={`Demonstration cadence: ${summary.cadence_hours} hours. Offline connectivity alone is not a failure.`}
      >
        <div className="sync-score">
          <span className="sync-score-icon">
            <Radio size={25} />
          </span>
          <div>
            <strong>{percent(summary.health_percent)}</strong>
            <p>
              {number(summary.healthy)} healthy / {number(summary.total)} expected targets
            </p>
          </div>
        </div>
        <div
          className="sync-bar"
          aria-label={`${summary.healthy} healthy, ${summary.degraded} degraded, ${summary.unknown} unknown targets`}
        >
          {summary.total > 0 && (
            <>
              <span
                className="healthy"
                style={{ width: `${(summary.healthy / summary.total) * 100}%` }}
              />
              <span
                className="degraded"
                style={{ width: `${(summary.degraded / summary.total) * 100}%` }}
              />
              <span
                className="unknown"
                style={{ width: `${(summary.unknown / summary.total) * 100}%` }}
              />
            </>
          )}
        </div>
        <div className="sync-categories">
          <div>
            <CheckCircle2 size={16} />
            <span>Healthy</span>
            <strong>{number(summary.healthy)}</strong>
          </div>
          <div>
            <AlertTriangle size={16} />
            <span>Degraded</span>
            <strong>{number(summary.degraded)}</strong>
          </div>
          <div>
            <HelpCircle size={16} />
            <span>Unknown</span>
            <strong>{number(summary.unknown)}</strong>
          </div>
        </div>
        <p className="chart-note">
          Classification coverage: {percent(summary.classification_percent)}. Unknown targets remain
          in the health denominator. Targets are devices or sources, not centers.
        </p>
        <RouteLink className="back-link" href="/synchronization">
          Open synchronization monitoring
        </RouteLink>
      </Panel>
      <Panel
        title="Sync observations requiring attention"
        subtitle="Known degraded or unknown targets; repeated centers may have separate targets."
      >
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Center / target</th>
                <th scope="col">Observation</th>
                <th scope="col">Last success</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((exception) => (
                <tr key={exception.id}>
                  <td>
                    <RouteLink
                      className="center-detail-link"
                      href={`/synchronization/targets/${encodeURIComponent(exception.id)}`}
                    >
                      <strong>{exception.center_name}</strong>
                    </RouteLink>
                    <span className="cell-secondary">{exception.id}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${exception.state}`}>{exception.state}</span>
                    <span className="cell-secondary">{exception.reason}</span>
                  </td>
                  <td>{syncTimestamp(exception.last_success)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {summary.exceptions.length === 0 && (
          <p className="empty-message">No degraded or unknown sync observations in this scope.</p>
        )}
        {summary.exceptions.length > 5 && (
          <button type="button" className="text-button" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show fewer observations' : 'View all sync observations'}
          </button>
        )}
        <p className="chart-note">
          Showing {observations.length} of {summary.exceptions.length} exception observations.
          Freshness is assessed against the fixed snapshot.
        </p>
      </Panel>
    </div>
  );
}

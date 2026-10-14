import type { SynchronizationAlerts, SynchronizationQuery } from '@sarthak/shared';
import { RouteLink, navigate } from '../centers/navigation';
import { synchronizationSearch } from './service';
import { syncTimestamp } from './common';

export function AlertTable({
  alerts,
  query,
  preview = false,
  onPage,
}: {
  alerts: SynchronizationAlerts;
  query: SynchronizationQuery;
  preview?: boolean;
  onPage?: (page: number) => void;
}) {
  function changePage(page: number) {
    if (onPage) onPage(page);
    else navigate(`/synchronization${synchronizationSearch({ ...query, page })}`);
  }
  return (
    <>
      <div className="table-scroll">
        <table aria-label={preview ? 'Escalation preview alerts' : 'Synchronization alerts'}>
          <thead>
            <tr>
              <th scope="col">Target / center</th>
              <th scope="col">Severity / cause</th>
              <th scope="col">Evidence / age</th>
              <th scope="col">Recommended recipient</th>
            </tr>
          </thead>
          <tbody>
            {alerts.items.map((alert) => (
              <tr key={alert.id}>
                <td>
                  <RouteLink
                    className="center-detail-link"
                    href={`/synchronization/targets/${encodeURIComponent(alert.target_id)}${synchronizationSearch(query)}`}
                  >
                    {alert.target_id}
                  </RouteLink>
                  <span className="cell-secondary">{alert.center_name}</span>
                </td>
                <td>
                  <span className={`status-pill ${alert.severity}`}>{alert.severity}</span>
                  <span className="cell-secondary">
                    {alert.cause.replaceAll('_', ' ')}: {alert.reason}
                  </span>
                </td>
                <td>
                  {syncTimestamp(alert.reference_at)}
                  <span className="cell-secondary">
                    {alert.age_hours === null
                      ? 'Age unknown'
                      : `${alert.age_hours.toFixed(2)} hours at snapshot`}
                  </span>
                </td>
                <td>
                  {alert.recommended_role ?? 'Evidence review'}
                  <span className="cell-secondary">{alert.recommendation}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {alerts.items.length === 0 && (
        <p className="empty-message">No alert observations match this scope.</p>
      )}
      <div className="table-footer">
        <span>
          {alerts.items.length === 0
            ? `${alerts.matching_total} matching alerts · no results on this page`
            : `${(alerts.page - 1) * alerts.page_size + 1}–${Math.min(alerts.page * alerts.page_size, alerts.matching_total)} of ${alerts.matching_total} alerts`}
        </span>
        <div>
          <button
            type="button"
            aria-label={preview ? 'Previous preview page' : 'Previous alerts page'}
            disabled={alerts.page <= 1}
            onClick={() => changePage(alerts.page - 1)}
          >
            ←
          </button>
          <span>
            Page {alerts.page} of {Math.max(1, alerts.total_pages)}
          </span>
          <button
            type="button"
            aria-label={preview ? 'Next preview page' : 'Next alerts page'}
            disabled={alerts.page >= alerts.total_pages}
            onClick={() => changePage(alerts.page + 1)}
          >
            →
          </button>
        </div>
      </div>
      {alerts.items.length === 0 && alerts.matching_total > 0 && (
        <button type="button" className="text-button" onClick={() => changePage(1)}>
          Go to first alerts page
        </button>
      )}
      <p className="chart-note">
        One primary alert per target. Missing evidence is informational, with no inferred failure
        age or recipient escalation. Recipient roles are recommendations; no notifications are sent.
      </p>
      {preview && (
        <p className="chart-note">
          Opening a target shows its default-rule recommendation. Your unsaved preview rules remain
          local to this page.
        </p>
      )}
    </>
  );
}

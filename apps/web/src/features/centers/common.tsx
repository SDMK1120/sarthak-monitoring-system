import { AlertCircle } from 'lucide-react';
import type { CenterContext } from '@sarthak/shared';
import { dateLabel } from '../executive/components';

export function CenterContextNotice({ context }: { context: CenterContext }) {
  return (
    <div className="demo-notice">
      <AlertCircle size={18} />
      <div>
        <strong>Synthetic demonstration · fixed published snapshot</strong>
        <span>
          Data as of {dateLabel(context.data_as_of)}. Activity status and synchronization health are
          assessed independently.
        </span>
      </div>
    </div>
  );
}

export function CenterRequestState({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: string | null;
  retry: () => void;
}) {
  if (loading)
    return (
      <div className="loading-state" role="status">
        <span className="loading-ring" />
        <h2>Loading center data…</h2>
      </div>
    );
  if (error)
    return (
      <div className="error-state" role="alert">
        <AlertCircle size={28} />
        <h2>Center data unavailable</h2>
        <p>{error}</p>
        <button className="primary-button" type="button" onClick={retry}>
          Try again
        </button>
      </div>
    );
  return null;
}

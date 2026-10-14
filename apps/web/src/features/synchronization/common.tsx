import { AlertCircle } from 'lucide-react';

export function syncTimestamp(value: string | null) {
  if (!value) return 'No evidence';
  return `${new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date(value))} IST (UTC+05:30)`;
}

export function SyncNotice({ asOf }: { asOf: string }) {
  return <div className="demo-notice"><AlertCircle size={18} /><div><strong>Synthetic demonstration · fixed published snapshot</strong><span>Evidence assessed at {syncTimestamp(asOf)}. Connectivity, transfer results and target health are distinct observations.</span></div></div>;
}

export function SyncRequestState({ loading, error, retry }: { loading: boolean; error: string | null; retry: () => void }) {
  if (loading) return <div className="loading-state" role="status"><span className="loading-ring" /><h2>Loading synchronization data…</h2></div>;
  if (error) return <div className="error-state" role="alert"><AlertCircle size={28} /><h2>Synchronization data unavailable</h2><p>{error}</p><button className="primary-button" type="button" onClick={retry}>Try again</button></div>;
  return null;
}

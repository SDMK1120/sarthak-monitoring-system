import { lazy, Suspense, useEffect, useState } from 'react';
import './features/centers/centers.css';
import './features/synchronization/synchronization.css';
const ExecutiveDashboardPage = lazy(async () => ({
  default: (await import('./features/executive/ExecutiveDashboardPage')).ExecutiveDashboardPage,
}));
const CenterMonitoringPage = lazy(async () => ({
  default: (await import('./features/centers/CenterMonitoringPage')).CenterMonitoringPage,
}));
const CenterDetailsPage = lazy(async () => ({
  default: (await import('./features/centers/CenterDetailsPage')).CenterDetailsPage,
}));
const SynchronizationPage = lazy(async () => ({
  default: (await import('./features/synchronization/SynchronizationPage')).SynchronizationPage,
}));
const SynchronizationTargetPage = lazy(async () => ({
  default: (await import('./features/synchronization/SynchronizationTargetPage'))
    .SynchronizationTargetPage,
}));

export function App() {
  const [url, setUrl] = useState(() => window.location.pathname + window.location.search);
  useEffect(() => {
    const update = () => setUrl(window.location.pathname + window.location.search);
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  return (
    <Suspense
      fallback={
        <div className="loading-state" role="status">
          <span className="loading-ring" />
          <h1>Sarthak Monitoring System</h1>
          <p>Loading workspace...</p>
        </div>
      }
    >
      <Route url={url} />
    </Suspense>
  );
}

function Route({ url }: { url: string }) {
  const pathname = url.split('?')[0] ?? '/';
  if (pathname === '/synchronization') return <SynchronizationPage key={url} />;
  if (pathname.startsWith('/synchronization/targets/')) {
    let targetId = pathname.slice('/synchronization/targets/'.length);
    try {
      targetId = decodeURIComponent(targetId);
    } catch {
      /* The API handles an invalid identifier. */
    }
    return <SynchronizationTargetPage key={url} targetId={targetId} />;
  }
  if (pathname === '/centers') return <CenterMonitoringPage key={url} />;
  if (pathname.startsWith('/centers/')) {
    let centerId = pathname.slice('/centers/'.length);
    try {
      centerId = decodeURIComponent(centerId);
    } catch {
      /* The API returns an actionable invalid identifier error. */
    }
    return <CenterDetailsPage key={url} centerId={centerId} />;
  }
  return <ExecutiveDashboardPage />;
}

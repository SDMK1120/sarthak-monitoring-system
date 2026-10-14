import { Component } from 'react';
import type { ReactNode } from 'react';
import { logger } from '../lib/logger';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(error: Error) {
    logger.error('Application render failed', { error_name: error.name });
  }
  override render() {
    if (this.state.failed)
      return (
        <main className="grid min-h-screen place-items-center p-6">
          <section
            role="alert"
            className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8"
          >
            <h1 className="text-xl font-semibold">Unable to display the application</h1>
            <p className="mt-3 text-slate-600">Reload the page to try again.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-white focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Reload
            </button>
          </section>
        </main>
      );
    return this.props.children;
  }
}

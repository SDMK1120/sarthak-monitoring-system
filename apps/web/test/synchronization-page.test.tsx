import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';
import {
  evaluateSynchronizationRules,
  getSynchronizationAlerts,
  getSynchronizationDashboard,
  getSynchronizationOptions,
  getSynchronizationRules,
  getSynchronizationTarget,
} from '../src/features/synchronization/service';
import {
  syncAlerts,
  syncContext,
  syncDashboard,
  syncOptions,
  syncRules,
  syncTarget,
} from './synchronization-fixtures';

vi.mock('../src/features/synchronization/service', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/features/synchronization/service')>()),
  getSynchronizationOptions: vi.fn(),
  getSynchronizationDashboard: vi.fn(),
  getSynchronizationAlerts: vi.fn(),
  getSynchronizationRules: vi.fn(),
  getSynchronizationTarget: vi.fn(),
  evaluateSynchronizationRules: vi.fn(),
}));
vi.mock('../src/features/executive/ExecutiveDashboardPage', () => ({
  ExecutiveDashboardPage: () => <p>Executive dashboard</p>,
}));
beforeEach(() => {
  window.history.replaceState(null, '', '/synchronization');
  vi.stubGlobal('scrollTo', vi.fn());
  vi.mocked(getSynchronizationOptions).mockReset().mockResolvedValue(syncOptions);
  vi.mocked(getSynchronizationDashboard).mockReset().mockResolvedValue(syncDashboard);
  vi.mocked(getSynchronizationAlerts).mockReset().mockResolvedValue(syncAlerts);
  vi.mocked(getSynchronizationRules).mockReset().mockResolvedValue(syncRules);
  vi.mocked(getSynchronizationTarget).mockReset().mockResolvedValue(syncTarget);
  vi.mocked(evaluateSynchronizationRules)
    .mockReset()
    .mockResolvedValue({ ...syncAlerts, preview: true });
});

describe('synchronization dashboard user behavior', () => {
  it('stages compound filters then resets their pinned scope', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('table', { name: 'Synchronization target listing' });
    await user.selectOptions(screen.getByLabelText('Region'), 'region-1');
    await user.selectOptions(screen.getByLabelText('District'), 'district-1');
    await user.selectOptions(screen.getByLabelText('Center'), 'center-1');
    await user.selectOptions(screen.getByLabelText('Sync health'), 'degraded');
    await user.selectOptions(screen.getByLabelText('Transfer result'), 'failed');
    expect(getSynchronizationDashboard).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Apply filters' }));
    await waitFor(() =>
      expect(getSynchronizationDashboard).toHaveBeenLastCalledWith(
        expect.objectContaining({
          region_id: 'region-1',
          district_id: 'district-1',
          center_id: 'center-1',
          state: 'degraded',
          result: 'failed',
          snapshot_id: syncContext.snapshot_id,
          page: 1,
        }),
        expect.any(AbortSignal),
      ),
    );
    await screen.findByRole('table', { name: 'Synchronization target listing' });
    await user.click(screen.getByRole('button', { name: 'Reset filters' }));
    await waitFor(() =>
      expect(getSynchronizationDashboard).toHaveBeenLastCalledWith(
        { page: 1, page_size: 10, snapshot_id: syncContext.snapshot_id },
        expect.any(AbortSignal),
      ),
    );
  });
  it('preserves filter context through target details and displays different complete timestamps', async () => {
    const user = userEvent.setup();
    window.history.replaceState(
      null,
      '',
      '/synchronization?region_id=region-1&state=degraded&page=2&snapshot_id=demo-2026-09-v1',
    );
    render(<App />);
    const table = await screen.findByRole('table', { name: 'Synchronization target listing' });
    const targetLink = within(table).getByRole('link', { name: 'target-6' });
    const returnSearch = new URL(targetLink.getAttribute('href')!, 'http://localhost').search;
    await user.click(targetLink);
    await screen.findByRole('heading', { name: 'Target evidence' });
    expect(getSynchronizationTarget).toHaveBeenLastCalledWith(
      'target-6',
      syncContext.snapshot_id,
      expect.any(AbortSignal),
    );
    expect(screen.getByText(/30 Sept 2026, 13:30:00 IST/)).toBeInTheDocument();
    expect(screen.getByText(/28 Sept 2026, 13:30:00 IST/)).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Back to synchronization' }));
    await screen.findByRole('table', { name: 'Synchronization target listing' });
    expect(window.location.search).toBe(returnSearch);
  });
  it('previews modified thresholds and clears request-local results when rules reset', async () => {
    const user = userEvent.setup();
    render(<App />);
    const jdm = await screen.findByLabelText('JDM after hours');
    await user.clear(jdm);
    await user.type(jdm, '3');
    await user.click(screen.getByRole('button', { name: 'Preview escalation' }));
    await screen.findByRole('table', { name: 'Escalation preview alerts' });
    expect(evaluateSynchronizationRules).toHaveBeenLastCalledWith(
      expect.objectContaining({ snapshot_id: syncContext.snapshot_id, page: 1 }),
      expect.objectContaining({
        thresholds: [
          { role: 'CM', after_hours: 0 },
          { role: 'JDM', after_hours: 3 },
          { role: 'SDM', after_hours: 6 },
          { role: 'Super Admin', after_hours: 24 },
        ],
      }),
      expect.any(AbortSignal),
    );
    expect(
      screen.getByText(/Changes are not persisted and no notification delivery occurs/),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reset escalation rules' }));
    expect(screen.getByLabelText('JDM after hours')).toHaveValue(2);
    expect(
      screen.queryByRole('table', { name: 'Escalation preview alerts' }),
    ).not.toBeInTheDocument();
    expect(getSynchronizationDashboard).toHaveBeenCalledTimes(1);
  });
  it('shows preview validation errors and ignores a pending preview after a rule edit', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByLabelText('JDM after hours');
    vi.mocked(evaluateSynchronizationRules).mockRejectedValueOnce(
      new Error('Use strictly increasing escalation hours.'),
    );
    await user.click(screen.getByRole('button', { name: 'Preview escalation' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Use strictly increasing');
    let resolvePreview!: (value: typeof syncAlerts) => void;
    vi.mocked(evaluateSynchronizationRules).mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePreview = resolve;
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Preview escalation' }));
    const signal = vi.mocked(evaluateSynchronizationRules).mock.calls.at(-1)?.[2];
    await user.click(screen.getByRole('button', { name: 'Reset escalation rules' }));
    expect(signal?.aborted).toBe(true);
    await act(async () => {
      resolvePreview({ ...syncAlerts, preview: true });
    });
    expect(
      screen.queryByRole('table', { name: 'Escalation preview alerts' }),
    ).not.toBeInTheDocument();
  });
  it('paginates preview results with the same edited rules without changing the dashboard route', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByLabelText('JDM after hours');
    vi.mocked(evaluateSynchronizationRules)
      .mockResolvedValueOnce({ ...syncAlerts, preview: true, matching_total: 11, total_pages: 2 })
      .mockResolvedValueOnce({
        ...syncAlerts,
        preview: true,
        page: 2,
        matching_total: 11,
        total_pages: 2,
      });
    await user.click(screen.getByRole('button', { name: 'Preview escalation' }));
    await screen.findByRole('table', { name: 'Escalation preview alerts' });
    const routeBefore = window.location.pathname + window.location.search;
    await user.click(screen.getByRole('button', { name: 'Next preview page' }));
    await waitFor(() =>
      expect(evaluateSynchronizationRules).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2, snapshot_id: syncContext.snapshot_id }),
        syncRules.rules,
        expect.any(AbortSignal),
      ),
    );
    expect(window.location.pathname + window.location.search).toBe(routeBefore);
    expect(getSynchronizationDashboard).toHaveBeenCalledTimes(1);
  });
  it('shows loading, retries a failed filtered route and supports empty target results', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/synchronization?center_id=center-1&state=unknown');
    vi.mocked(getSynchronizationDashboard)
      .mockRejectedValueOnce(new Error('Unable to reach the API.'))
      .mockResolvedValueOnce({ ...syncDashboard, matching_total: 0, total_pages: 0, items: [] });
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading synchronization data');
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to reach the API.');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(
      await screen.findByText('No synchronization targets match these filters.'),
    ).toBeInTheDocument();
    expect(getSynchronizationDashboard).toHaveBeenLastCalledWith(
      expect.objectContaining({
        center_id: 'center-1',
        state: 'unknown',
        snapshot_id: syncContext.snapshot_id,
      }),
      expect.any(AbortSignal),
    );
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DashboardOptions, ExecutiveDashboard } from '@sarthak/shared';
import { ExecutiveDashboardPage } from '../src/features/executive/ExecutiveDashboardPage';
import { getDashboardOptions, getExecutiveDashboard } from '../src/features/executive/service';
import { useExecutiveDashboard } from '../src/features/executive/useExecutiveDashboard';

vi.mock('../src/features/executive/service', () => ({
  getDashboardOptions: vi.fn(),
  getExecutiveDashboard: vi.fn(),
}));
// Chart drawing is checked in a real browser. These tests focus on page requests and state.
vi.mock('../src/features/executive/Charts', () => ({
  BatchCharts: () => null,
  SchemeChart: () => null,
  NetworkChart: () => null,
}));
const options: DashboardOptions = {
  regions: [{ id: 'region-1', name: 'North Region' }],
  schemes: [{ id: 'scheme-1', name: 'Digital Skills', category: 'Skills' }],
  snapshot_id: 'demo-2026-09-v1',
  data_as_of: '2026-09-30T12:00:00.000Z',
  timezone: 'UTC',
  available_period: { start: '2026-01-01', end: '2026-10-01' },
  default_period: { start: '2026-04-01', end: '2026-10-01' },
};
const data: ExecutiveDashboard = {
  context: {
    snapshot_id: options.snapshot_id,
    data_as_of: options.data_as_of,
    receipt_cutoff: options.data_as_of,
    timezone: 'UTC',
    period_start: '2026-04-01',
    period_end: '2026-10-01',
    region_id: null,
    scheme_id: null,
    mode: 'synthetic_demo',
  },
  centers: { total: 2, active: 1, inactive: 0, unknown: 1, classifiable_percent: 50 },
  schemes: { by_scheme: [], by_category: [], membership_count: 2, distinct_centers: 2 },
  batches: {
    created: 3,
    enrollments: 30,
    current: 2,
    comparable: 1,
    excluded: 1,
    occupied_seats: 10,
    capacity: 20,
    utilization_percent: 50,
  },
  sync: {
    total: 0,
    healthy: 0,
    degraded: 0,
    unknown: 0,
    health_percent: null,
    classification_percent: null,
    cadence_hours: 24,
    exceptions: [],
  },
  trends: [],
  center_list: [
    {
      id: 'c1',
      code: 'C1',
      name: 'North Active Center',
      region_id: 'region-1',
      region_name: 'North Region',
      district_name: 'District One',
      activity_status: 'active',
      schemes: ['Digital Skills'],
      batch_count: 2,
      enrollments: 20,
      sync_state: 'unknown',
      last_success: null,
    },
    {
      id: 'c2',
      code: 'C2',
      name: 'North Unknown Center',
      region_id: 'region-1',
      region_name: 'North Region',
      district_name: 'District Two',
      activity_status: 'unknown',
      schemes: ['Digital Skills'],
      batch_count: 1,
      enrollments: 10,
      sync_state: 'unknown',
      last_success: null,
    },
  ],
};
beforeEach(() => {
  vi.mocked(getDashboardOptions).mockReset().mockResolvedValue(options);
  vi.mocked(getExecutiveDashboard).mockReset().mockResolvedValue(data);
});

describe('executive dashboard user behavior', () => {
  it('ignores an older response after a new filtered request begins', async () => {
    const { result } = renderHook(() => useExecutiveDashboard());
    await waitFor(() => expect(result.current.data).toEqual(data));
    let resolveOlder!: (value: ExecutiveDashboard) => void;
    vi.mocked(getExecutiveDashboard).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveOlder = resolve;
      }),
    );
    let olderRequest!: Promise<void>;
    act(() => {
      olderRequest = result.current.load({ region_id: 'region-1' });
    });
    const olderSignal = vi.mocked(getExecutiveDashboard).mock.calls.at(-1)?.[1];
    const newData = { ...data, context: { ...data.context, scheme_id: 'scheme-1' } };
    vi.mocked(getExecutiveDashboard).mockResolvedValueOnce(newData);
    await act(async () => {
      await result.current.load({ scheme_id: 'scheme-1' });
    });
    expect(olderSignal?.aborted).toBe(true);
    await act(async () => {
      resolveOlder(data);
      await olderRequest;
    });
    expect(result.current.data?.context.scheme_id).toBe('scheme-1');
    expect(result.current.loading).toBe(false);
  });
  it('applies draft filters only on submit, pins the snapshot and resets the scope', async () => {
    const user = userEvent.setup();
    render(<ExecutiveDashboardPage />);
    await screen.findByText('Total centers');
    expect(getExecutiveDashboard).toHaveBeenLastCalledWith(
      { snapshot_id: options.snapshot_id, period_start: '2026-04-01', period_end: '2026-10-01' },
      expect.any(AbortSignal),
    );
    await user.selectOptions(screen.getByLabelText('Region'), 'region-1');
    await user.selectOptions(screen.getByLabelText('Scheme'), 'scheme-1');
    await user.selectOptions(screen.getByLabelText('Event period'), '1');
    expect(getExecutiveDashboard).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Apply filters' }));
    await waitFor(() =>
      expect(getExecutiveDashboard).toHaveBeenLastCalledWith(
        {
          region_id: 'region-1',
          scheme_id: 'scheme-1',
          period_start: '2026-09-01',
          period_end: '2026-10-01',
          snapshot_id: options.snapshot_id,
        },
        expect.any(AbortSignal),
      ),
    );
    await user.click(screen.getByRole('button', { name: 'Reset filters' }));
    await waitFor(() =>
      expect(getExecutiveDashboard).toHaveBeenLastCalledWith(
        { period_start: '2026-04-01', period_end: '2026-10-01', snapshot_id: options.snapshot_id },
        expect.any(AbortSignal),
      ),
    );
    expect(screen.getByLabelText('Region')).toHaveValue('');
  });
  it('shows loading and safe failure, then recovers through retry', async () => {
    let rejectOptions!: (reason: Error) => void;
    vi.mocked(getDashboardOptions).mockReturnValueOnce(
      new Promise((_resolve, reject) => {
        rejectOptions = reject;
      }),
    );
    const user = userEvent.setup();
    render(<ExecutiveDashboardPage />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading dashboard');
    expect(screen.getByRole('button', { name: 'Apply filters' })).toBeDisabled();
    rejectOptions(new Error('Unable to reach the API.'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to reach the API.');
    expect(screen.queryByText('Total centers')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('Total centers')).toBeInTheDocument();
  });
  it('keeps unknown activity distinct and local directory searches independent of API scope', async () => {
    const user = userEvent.setup();
    render(<ExecutiveDashboardPage />);
    await screen.findByText('North Active Center');
    await user.selectOptions(screen.getByLabelText('Center activity'), 'unknown');
    expect(screen.queryByText('North Active Center')).not.toBeInTheDocument();
    expect(screen.getByText('North Unknown Center')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Search centers'), 'unmatched');
    expect(screen.getByText('No centers match these table filters.')).toBeInTheDocument();
    expect(getExecutiveDashboard).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/1 centers with unknown activity/)).toBeInTheDocument();
  });
});

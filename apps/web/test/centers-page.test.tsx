import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';
import {
  getCenterAnalysis,
  getCenterDetail,
  getCenterOptions,
  getCenters,
} from '../src/features/centers/service';
import { useCenterRequest } from '../src/features/centers/useCenterRequest';
import { analysis, context, detail, listing, options } from './centers-fixtures';

vi.mock('../src/features/centers/service', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/features/centers/service')>()),
  getCenterOptions: vi.fn(),
  getCenters: vi.fn(),
  getCenterAnalysis: vi.fn(),
  getCenterDetail: vi.fn(),
}));
vi.mock('../src/features/executive/ExecutiveDashboardPage', () => ({
  ExecutiveDashboardPage: () => <p>Executive dashboard</p>,
}));
beforeEach(() => {
  window.history.replaceState(null, '', '/centers');
  vi.stubGlobal('scrollTo', vi.fn());
  vi.mocked(getCenterOptions).mockReset().mockResolvedValue(options);
  vi.mocked(getCenters).mockReset().mockResolvedValue(listing);
  vi.mocked(getCenterAnalysis).mockReset().mockResolvedValue(analysis);
  vi.mocked(getCenterDetail).mockReset().mockResolvedValue(detail);
});

describe('center monitoring navigation and request state', () => {
  it('stages filters, applies their intersection, and resets dependent district on region change', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('link', { name: 'North Center' });
    await user.selectOptions(screen.getByLabelText('Region'), 'region-1');
    await user.selectOptions(screen.getByLabelText('District'), 'district-1');
    await user.selectOptions(screen.getByLabelText('Activity status'), 'unknown');
    await user.selectOptions(screen.getByLabelText('Scheme'), 'scheme-1');
    expect(getCenters).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Apply filters' }));
    await waitFor(() =>
      expect(getCenters).toHaveBeenLastCalledWith(
        expect.objectContaining({
          region_id: 'region-1',
          district_id: 'district-1',
          scheme_id: 'scheme-1',
          activity_status: 'unknown',
          page: 1,
          snapshot_id: context.snapshot_id,
        }),
        expect.any(AbortSignal),
      ),
    );
    await screen.findByRole('link', { name: 'North Center' });
    await user.selectOptions(screen.getByLabelText('Region'), 'region-2');
    expect(screen.getByLabelText('District')).toHaveValue('');
    expect(screen.queryByRole('option', { name: 'District One' })).not.toBeInTheDocument();
  });
  it('drills geography and preserves the complete listing context through details and back', async () => {
    const user = userEvent.setup();
    window.history.replaceState(
      null,
      '',
      '/centers?activity_status=active&page=2&page_size=10&sort=code&order=desc&snapshot_id=demo-2026-09-v1',
    );
    render(<App />);
    await screen.findByRole('button', { name: 'Show district District One' });
    await user.click(screen.getByRole('button', { name: 'Show district District One' }));
    await waitFor(() =>
      expect(getCenters).toHaveBeenLastCalledWith(
        expect.objectContaining({
          region_id: 'region-1',
          district_id: 'district-1',
          activity_status: 'active',
          page: 1,
          sort: 'code',
          order: 'desc',
        }),
        expect.any(AbortSignal),
      ),
    );
    const link = await screen.findByRole('link', { name: 'North Center' });
    const detailUrl = link.getAttribute('href')!;
    const returnSearch = detailUrl.slice(detailUrl.indexOf('?'));
    await user.click(link);
    await screen.findByRole('table', { name: 'Synchronization targets' });
    expect(getCenterDetail).toHaveBeenLastCalledWith(
      'center-1',
      context.snapshot_id,
      expect.any(AbortSignal),
    );
    expect(window.location.pathname).toBe('/centers/center-1');
    await user.click(screen.getByRole('link', { name: 'Back to centers' }));
    await screen.findByRole('link', { name: 'North Center' });
    expect(window.location.pathname).toBe('/centers');
    expect(window.location.search).toBe(returnSearch);
  });
  it('shows error and retries the same latest filtered route, then shows empty results', async () => {
    const user = userEvent.setup();
    window.history.replaceState(
      null,
      '',
      '/centers?region_id=region-1&activity_status=unknown&search=nothing',
    );
    vi.mocked(getCenters)
      .mockRejectedValueOnce(new Error('Unable to reach the API.'))
      .mockResolvedValueOnce({ ...listing, matching_total: 0, total_pages: 0, items: [] });
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading center data');
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to reach the API.');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(
      await screen.findByText('No centers match these filters. Reset or broaden your search.'),
    ).toBeInTheDocument();
    expect(getCenters).toHaveBeenLastCalledWith(
      expect.objectContaining({
        region_id: 'region-1',
        activity_status: 'unknown',
        search: 'nothing',
        snapshot_id: context.snapshot_id,
      }),
      expect.any(AbortSignal),
    );
  });
  it('does not publish mismatched analysis and listing snapshots', async () => {
    vi.mocked(getCenterAnalysis).mockResolvedValueOnce({
      ...analysis,
      context: { ...context, snapshot_id: 'another-publication' },
    });
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Center publications do not match');
    expect(screen.queryByRole('table', { name: 'Center listing' })).not.toBeInTheDocument();
  });
  it('recovers an out-of-range page without displaying a reversed result range', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/centers?page=10&page_size=10&region_id=region-1');
    vi.mocked(getCenters).mockResolvedValueOnce({
      ...listing,
      page: 10,
      matching_total: 84,
      total_pages: 9,
      items: [],
    });
    render(<App />);
    await screen.findByRole('button', { name: 'Go to first page' });
    expect(screen.queryByText(/91.*84 of 84/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Go to first page' }));
    await waitFor(() =>
      expect(getCenters).toHaveBeenLastCalledWith(
        expect.objectContaining({ region_id: 'region-1', page: 1 }),
        expect.any(AbortSignal),
      ),
    );
  });
  it('ignores late responses after navigation changes the request context', async () => {
    let resolveOld!: (value: string) => void;
    let oldSignal!: AbortSignal;
    const oldLoad = vi.fn((signal: AbortSignal) => {
      oldSignal = signal;
      return new Promise<string>((resolve) => {
        resolveOld = resolve;
      });
    });
    const newLoad = vi.fn(async (_signal: AbortSignal) => 'new scope');
    const { result, rerender } = renderHook(
      ({ loader, route }) => useCenterRequest(loader, route),
      {
        initialProps: { loader: oldLoad as (signal: AbortSignal) => Promise<string>, route: 'old' },
      },
    );
    rerender({ loader: newLoad, route: 'new' });
    await waitFor(() => expect(result.current.data).toBe('new scope'));
    expect(oldSignal.aborted).toBe(true);
    await act(async () => {
      resolveOld('old scope');
    });
    expect(result.current.data).toBe('new scope');
    expect(result.current.loading).toBe(false);
  });
});

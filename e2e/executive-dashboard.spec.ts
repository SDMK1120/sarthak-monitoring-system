import { expect, test } from '@playwright/test';

test('real API dashboard, staged filters, period semantics and center interaction', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'View total centers', exact: true })).toContainText(
    '84',
  );
  await expect(
    page.getByRole('button', { name: 'View active centers', exact: true }),
  ).toContainText('68');
  await expect(
    page.getByRole('button', { name: 'View inactive centers', exact: true }),
  ).toContainText('11');
  await expect(page.getByText('Synthetic demo data', { exact: true })).toBeVisible();
  await expect(page.getByRole('application')).toHaveCount(4);
  await page.screenshot({ path: 'test-results/executive-desktop.png', fullPage: true });
  await page.getByLabel('Region', { exact: true }).selectOption('region-1');
  await page.getByLabel('Scheme', { exact: true }).selectOption('scheme-1');
  await page.getByLabel('Event period', { exact: true }).selectOption('1');
  await expect(page.getByRole('button', { name: 'View total centers', exact: true })).toContainText(
    '84',
  );
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/dashboard/executive?') &&
      response.url().includes('region_id=region-1'),
  );
  await page.getByRole('button', { name: 'Apply filters', exact: true }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  const { data } = await response.json();
  expect(data.context.period_start).toBe('2026-09-01');
  expect(data.context.scheme_id).toBe('scheme-1');
  await expect(page.getByRole('button', { name: 'View total centers', exact: true })).toContainText(
    String(data.centers.total),
  );
  await page.getByRole('button', { name: 'View inactive centers', exact: true }).click();
  await expect(page.getByLabel('Center activity', { exact: true })).toHaveValue('inactive');
  await page.getByLabel('Search centers', { exact: true }).fill('no-such-center');
  await expect(
    page.getByText('No centers match these table filters.', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
  await expect(page.getByRole('button', { name: 'View total centers', exact: true })).toContainText(
    '84',
  );
  const capacity = await page
    .locator('.metric-card')
    .filter({ hasText: 'Batch utilization' })
    .textContent();
  await page.getByLabel('Event period', { exact: true }).selectOption('1');
  await page.getByRole('button', { name: 'Apply filters', exact: true }).click();
  await expect(page.getByRole('button', { name: 'View total centers', exact: true })).toContainText(
    '84',
  );
  await expect(page.locator('.metric-card').filter({ hasText: 'Batch utilization' })).toHaveText(
    capacity ?? '',
  );
  expect(errors).toEqual([]);
});

test('mobile layout and keyboard-accessible chart data', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'View total centers', exact: true })).toContainText(
    '84',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('link', { name: 'Batch analytics', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Batch analytics', exact: true }),
  ).toBeInViewport();
  const details = page.locator('.chart-details').first();
  await details.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await expect(details.getByRole('columnheader', { name: 'Scheme', exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/executive-mobile.png', fullPage: true });
});

test('API failure is actionable and retry restores the real snapshot', async ({ page }) => {
  await page.route('**/api/v1/dashboard/executive?*', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Demo snapshot temporarily unavailable.',
          request_id: 'browser-test',
          retryable: true,
        },
      }),
    }),
  );
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Demo snapshot temporarily unavailable.');
  await page.unroute('**/api/v1/dashboard/executive?*');
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.getByRole('button', { name: 'View total centers', exact: true })).toContainText(
    '84',
  );
});

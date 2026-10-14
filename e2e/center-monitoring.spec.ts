import { expect, test } from '@playwright/test';

test('center filters, details, refresh and preserved return context use the real API', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link', { name: 'Center monitoring', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Center monitoring', exact: true })).toBeVisible();
  const listing = page.getByRole('table', { name: 'Center listing', exact: true });
  await expect(listing.getByRole('row')).toHaveCount(11);
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(listing.getByRole('row')).toHaveCount(11);
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
  await expect(listing.getByRole('link', { name: 'Sarthak Center 01', exact: true })).toBeVisible();
  await page.getByLabel('Region', { exact: true }).selectOption('region-1');
  await page.getByLabel('District', { exact: true }).selectOption('district-2');
  await page.getByLabel('Scheme', { exact: true }).selectOption('scheme-2');
  await page.getByLabel('Activity status', { exact: true }).selectOption('active');
  await page.getByLabel('Search centers', { exact: true }).fill('SAR-002');
  await expect(listing.getByRole('row')).toHaveCount(11);
  await page.getByRole('button', { name: 'Apply filters', exact: true }).click();
  await expect(listing.getByRole('row')).toHaveCount(2);
  const returnUrl = page.url();
  await listing.getByRole('link', { name: 'Sarthak Center 02', exact: true }).click();
  await expect(page).toHaveURL(/\/centers\/center-2\?/);
  await expect(page.getByRole('heading', { name: 'Sarthak Center 02', exact: true })).toBeVisible();
  await expect(
    page.getByRole('table', { name: 'Center batches', exact: true }).getByRole('row'),
  ).toHaveCount(7);
  await expect(
    page.getByRole('table', { name: 'Synchronization targets', exact: true }).getByRole('row'),
  ).toHaveCount(3);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Sarthak Center 02', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Back to centers', exact: true }).click();
  await expect(page).toHaveURL(returnUrl);
  await expect(listing.getByRole('row')).toHaveCount(2);
  await expect(page.getByLabel('District', { exact: true })).toHaveValue('district-2');
  expect(errors).toEqual([]);
});

test('activity and geographic drilldowns preserve comparison and render on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/centers');
  await expect(
    page.getByRole('table', { name: 'Center listing', exact: true }).getByRole('row'),
  ).toHaveCount(11);
  await page.getByRole('button', { name: 'View inactive centers', exact: true }).click();
  await expect(page).toHaveURL(/activity_status=inactive/);
  await expect(page.getByLabel('Activity status', { exact: true })).toHaveValue('inactive');
  await expect(page.getByRole('button', { name: 'View total centers', exact: true })).toContainText(
    '84',
  );
  await expect(
    page.getByRole('button', { name: 'View inactive centers', exact: true }),
  ).toContainText('11');
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
  await page.getByRole('button', { name: 'Show region North Region', exact: true }).click();
  await expect(page.getByLabel('Region', { exact: true })).toHaveValue('region-1');
  await page.getByRole('button', { name: 'Show district District 01', exact: true }).click();
  await expect(page.getByLabel('District', { exact: true })).toHaveValue('district-1');
  await expect(page.getByRole('button', { name: 'View total centers', exact: true })).toContainText(
    '7',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/centers-mobile.png', fullPage: true });
  await page
    .getByRole('table', { name: 'Center listing', exact: true })
    .getByRole('link')
    .first()
    .click();
  await expect(
    page.getByRole('table', { name: 'Synchronization targets', exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/center-details-mobile.png', fullPage: true });
});

test('invalid URL and missing center are actionable and do not silently broaden scope', async ({
  page,
}) => {
  await page.goto('/centers?page=0');
  await expect(page.getByRole('alert')).toContainText('invalid filters');
  await expect(page.getByRole('table', { name: 'Center listing', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
  await expect(
    page.getByRole('table', { name: 'Center listing', exact: true }).getByRole('row'),
  ).toHaveCount(11);
  await page.goto('/centers/center-9999');
  await expect(page.getByRole('alert')).toContainText('The requested center does not exist.');
  await page.getByRole('link', { name: 'Back to centers', exact: true }).click();
  await expect(
    page.getByRole('table', { name: 'Center listing', exact: true }).getByRole('row'),
  ).toHaveCount(11);
});

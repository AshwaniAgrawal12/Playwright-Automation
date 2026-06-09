import { test } from '@playwright/test';

test('Login and save session', async ({ page }) => {

  await page.goto('https://rc.stg.xytech.fabricdata.com/Login');

  const dropdowns = page.locator('select');
  await dropdowns.nth(1).selectOption({ label: 'Database' });

  await page.getByPlaceholder('User name').fill('xytadmin');
  await page.getByPlaceholder('Password').fill('qr75rz39l9zlkk6n');

  await page.getByRole('button', { name: 'Sign In' }).click();

  // Handle popup
  const noButton = page.getByRole('button', { name: 'No' });
  if (await noButton.isVisible().catch(() => false)) {
    await noButton.click();
  }

  // Wait until app loads
  // await page.getByText('Xytech', { exact: false }).waitFor();

  // ✅ Save login session
  await page.context().storageState({ path: 'storageState.json' });

});
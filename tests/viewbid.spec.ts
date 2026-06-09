
// tests/viewbid.spec.ts
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { BiddingPage } from '../pages/BiddingPage';

test.setTimeout(120000);

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.login('xytadmin', 'qr75rz39l9zlkk6n');
});

test('View Bids', async ({ page }) => {

  const home = new HomePage(page);
  const bidding = new BiddingPage(page);

  // Navigate
  await home.openBiddingModule();

  // Open Bids
  await bidding.openBids();

  await page.waitForTimeout(3000);

  // Wait for right panel
  await bidding.waitForBidsPage();

  await page.waitForTimeout(3000);

  // Click search icon
  await bidding.clickSearch();

  // Validate grid loaded
  await bidding.verifyBidsLoaded();

});
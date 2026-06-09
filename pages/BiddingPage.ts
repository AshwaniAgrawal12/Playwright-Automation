
import { Page, expect } from '@playwright/test';

export class BiddingPage {
  constructor(private page: Page) {}


async openBids() {
  const bidsNode = this.page.getByRole('treeitem', { name: 'Bids' });

  await expect(bidsNode).toBeVisible();
  await bidsNode.click();
}

  async waitForBidsPage() {
    // Wait for right panel (grid area)
    await expect(this.page.locator('text=Bid Description'))
      .toBeVisible({ timeout: 30000 });
  }

//   async clickSearch() {
//     // Magnify/search icon (top right)
//     const searchBtn = this.page.locator('button[aria-label="Search"], i[class*="search"]').first();

//     await expect(searchBtn).toBeVisible();
//     await searchBtn.click();
//   }

async clickSearch() {
  const searchBtn = this.page.locator('button:has(i[class*="search"]), i[class*="search"]').first();
    
  await expect(searchBtn).toBeVisible();
  await searchBtn.click();

  await this.page.waitForTimeout(5000);
}
    // problem de rh hai 
//   async verifyBidsLoaded() {
//     // Grid rows appear
//     await expect(this.page.locator('table, [role="grid"]'))
//       .toBeVisible({ timeout: 30000 });
//   }

async verifyBidsLoaded() {
  await expect(
    this.page.getByText('Bid Description')
  ).toBeVisible({ timeout: 30000 });
}
}


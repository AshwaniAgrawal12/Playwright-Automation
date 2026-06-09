// pages/HomePage.ts
import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async openBiddingModule() {
    await this.page.getByText('Modules', { exact: false }).click();
    await this.page.getByText('Bidding', { exact: false }).click();
  }
//    await this.page.waitForTimeout(2000); // wait for 2 seconds before clicking
}
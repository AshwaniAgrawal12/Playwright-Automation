import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {

    await this.page.goto('https://rc.stg.xytech.fabricdata.com/Login');

    const dropdowns = this.page.locator('select');
    await expect(dropdowns).toHaveCount(3);
    await dropdowns.nth(1).selectOption({ label: 'Database' });

    await this.page.getByPlaceholder('User name').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);

    await this.page.getByRole('button', { name: 'Sign In' }).click();

    // Handle restore popup
    const noButton = this.page.getByRole('button', { name: 'No' });
    if (await noButton.isVisible().catch(() => false)) {
      await noButton.click();
    }

    // ✅ BEST WAIT: wait for actual UI element
    // await expect(this.page.getByText('Xytech'))
    //   .toBeVisible({ timeout: 60000 });
  }
}
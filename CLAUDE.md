# Playwright Automation — Xytech Application

## Project Context

This project automates end-to-end tests for **Xytech**, a media operations/ERP platform hosted at:
- **Staging URL:** `https://rc.stg.xytech.fabricdata.com`
- **Login page:** `https://rc.stg.xytech.fabricdata.com/Login`

**Stack:** TypeScript + Playwright (`@playwright/test` v1.59+), running on Chromium.

---

## Architecture: Page Object Model (POM)

All automation follows the **Page Object Model** pattern strictly:

- `pages/` — one class per application page/module
- `tests/` — test spec files that import and use page classes
- Page classes handle all locators and actions; test files contain only test logic and assertions

### Page Class Template

```typescript
import { Page, expect } from '@playwright/test';

export class ModulePage {
  constructor(private page: Page) {}

  async someAction() {
    // locators and interactions go here
  }

  async verifysomething() {
    await expect(this.page.locator('...')).toBeVisible({ timeout: 30000 });
  }
}
```

### Test File Template

```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ModulePage } from '../pages/ModulePage';

test.setTimeout(120000);

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.login('xytadmin', 'qr75rz39l9zlkk6n');
});

test('Test description', async ({ page }) => {
  const module = new ModulePage(page);
  await module.someAction();
  await module.verifySomething();
});
```

---

## Login

### Credentials (staging)
- **Username:** `xytadmin`
- **Password:** `qr75rz39l9zlkk6n`
- **Auth type:** Select "Database" from the 2nd dropdown on the login page

### LoginPage (`pages/LoginPage.ts`)
Always use the existing `LoginPage.login()` method in `test.beforeEach`. Do not duplicate login logic in test files.

### Session Reuse
`storageState.json` is configured globally in `playwright.config.ts`. To pre-save a session (so tests skip login), run `tests/loginall.spec.ts` first, which saves session state to `storageState.json`.

### Restore Session Popup
After login, a "Do you want to restore your last session?" popup may appear. Always handle it:
```typescript
const noButton = this.page.getByRole('button', { name: 'No' });
if (await noButton.isVisible().catch(() => false)) {
  await noButton.click();
}
```

---

## Existing Pages

| Class | File | Covers |
|---|---|---|
| `LoginPage` | `pages/LoginPage.ts` | Login, auth dropdown, restore popup |
| `HomePage` | `pages/HomePage.ts` | Top-level module navigation |
| `BiddingPage` | `pages/BiddingPage.ts` | Bidding module: open Bids, search, verify grid |

---

## How to Add a New Module

1. **Create a page class** in `pages/` named after the module (e.g., `pages/OrdersPage.ts`)
2. **Add navigation** to `HomePage.ts` (e.g., `openOrdersModule()`)
3. **Create a test file** in `tests/` (e.g., `tests/orders.spec.ts`)
4. Always `import { LoginPage }` and call `login.login()` in `test.beforeEach`

---

## Locator Strategy (in priority order)

Use Playwright's semantic locators — prefer these in order:

1. `page.getByRole('button', { name: '...' })` — buttons, links, headings
2. `page.getByPlaceholder('...')` — input fields
3. `page.getByText('...', { exact: false })` — visible text
4. `page.getByRole('treeitem', { name: '...' })` — sidebar/tree navigation nodes
5. `page.locator('...')` — CSS/attribute selectors as last resort

Avoid `page.locator('xpath=...')` unless there is no other option.

---

## Waits and Timeouts

- **Test timeout:** `test.setTimeout(120000)` — set at the top of every spec file (Xytech loads slowly)
- **Network idle:** Use `page.waitForLoadState('networkidle')` after navigation
- **Element wait:** Use `expect(locator).toBeVisible({ timeout: 30000 })` rather than fixed sleeps
- **Fixed waits:** Use `page.waitForTimeout(ms)` only when an element-based wait is not possible (e.g., animation delays). Keep them short (2000–5000ms max).

---

## Application Navigation Patterns

### Module Navigation (via HomePage)
```typescript
await this.page.getByText('Modules', { exact: false }).click();
await this.page.getByText('ModuleName', { exact: false }).click();
```

### Sidebar Tree Items
```typescript
await this.page.getByRole('treeitem', { name: 'ItemName' }).click();
```

### Search / Grid Actions
- Search button pattern: `page.locator('button:has(i[class*="search"]), i[class*="search"]').first()`
- After search, verify data with: `expect(page.getByText('Column Header')).toBeVisible({ timeout: 30000 })`

---

## Test Naming Conventions

- Test file: `tests/<module>.spec.ts` (lowercase, kebab-case)
- Page class: `pages/<Module>Page.ts` (PascalCase)
- Test name: plain English describing the action, e.g., `'View Bids'`, `'Create New Order'`, `'Search by Client Name'`

---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific file
npx playwright test tests/viewbid.spec.ts

# Run with browser visible (headed mode)
npx playwright test --headed

# Show HTML report after run
npx playwright show-report
```

---

## Configuration (`playwright.config.ts`)

- **testDir:** `./tests`
- **Browser:** Chromium only (Firefox/Safari commented out)
- **Reporter:** HTML
- **storageState:** `storageState.json` loaded globally
- **Retries:** 2 on CI, 0 locally
- **Parallel:** Enabled locally, single worker on CI

---

## What NOT to Do

- Do not put locators or interaction logic directly in test files — put them in page classes
- Do not use `test.only` (it will fail CI builds via `forbidOnly`)
- Do not hardcode waits longer than 10 seconds; use element-based waits instead
- Do not create a new login flow in each test — always reuse `LoginPage.login()` in `beforeEach`
- Do not commit `storageState.json` — it contains session tokens

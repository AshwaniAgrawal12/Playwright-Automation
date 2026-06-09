import { test, expect } from '@playwright/test';

test.setTimeout(120000);  // Set timeout to 2 minutes for this test, as it involves multiple steps and waits

test('Login with username/password and handle restore session popup', async ({ page }) => {

  // 1. Open URL and wait for page load
  await page.goto('https://rc.stg.xytech.fabricdata.com/Login');


  await page.waitForLoadState('networkidle');

  // 2. Verify dropdowns and select 2nd dropdown = Database
  const dropdowns = page.locator('select');
  await expect(dropdowns).toHaveCount(3);

  const secondDropdown = dropdowns.nth(1);
  await secondDropdown.selectOption({ label: 'Database' });

  // 3. Wait for username/password fields
  const usernameField = page.getByPlaceholder('User name');
  const passwordField = page.getByPlaceholder('Password');


  await expect(usernameField).toBeVisible();
  await expect(passwordField).toBeVisible();

  // 4. Enter credentials
  await usernameField.fill('xytadmin');
  await passwordField.fill('qr75rz39l9zlkk6n');

  //ashwani credential

  // 5. Click Sign In
  const signinbtn = page.getByRole('button', { name: 'Sign In' });
  // await signinbtn.highlight();  // highlight the button for debugging
  await page.waitForTimeout(2000); // wait for 2 seconds before clicking
  await signinbtn.click();

  // 6. Wait for application to load
  await page.waitForLoadState('networkidle');

  // Extra wait time of 10 seconds for full application load
  await page.waitForTimeout(5000);

  // 7. If popup appears: "Do you want to restore your last session?"
  const noButton = page.getByRole('button', { name: 'No' });

  if (await noButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await noButton.click();
  } 

  // Final wait
  await page.waitForTimeout(10000);

});





// neeche code mei xytech aane ka wait kar rhe hai


// import { test, expect } from '@playwright/test';

// test.setTimeout(180000);

// test('Login with username/password and handle restore session popup', async ({ page }) => {

//   // 1. Open URL and wait for page load
//   await page.goto('https://rc.stg.xytech.fabricdata.com/Login');
//   await page.waitForLoadState('networkidle');

//   // 2. Verify dropdowns and select 2nd dropdown = Database
//   const dropdowns = page.locator('select');
//   await expect(dropdowns).toHaveCount(3);

//   const secondDropdown = dropdowns.nth(1);
//   await secondDropdown.selectOption({ label: 'Database' });

//   // 3. Wait for username/password fields
//   const usernameField = page.getByPlaceholder('User name');
//   const passwordField = page.getByPlaceholder('Password');

//   await expect(usernameField).toBeVisible();
//   await expect(passwordField).toBeVisible();

//   // 4. Enter credentials
//   await usernameField.fill('xytadmin');
//   await passwordField.fill('qr75rz39l9zlkk6n');

//   // 5. Click Sign In
//   const signinbtn = page.getByRole('button', { name: 'Sign In' });
//   await signinbtn.highlight();
//   await signinbtn.click();

//   // 6. Wait for application initial load
//   await page.waitForLoadState('networkidle');

//   // Extra wait time
//   await page.waitForTimeout(10000);

//   // 7. If popup appears: "Do you want to restore your last session?"
//   const noButton = page.getByRole('button', { name: 'No' });

//   if (await noButton.isVisible({ timeout: 5000 }).catch(() => false)) {
//     await noButton.click();
//   }
//   await page.waitForTimeout(2000);

//   // 8. Wait until full application loads and Xytech appears in left navigation
// //   const xytechNav = page.getByText('Xytech', { exact: false });

// //   await expect(xytechNav).toBeVisible({ timeout: 60000 });

//   // Final wait
//   await page.waitForTimeout(5000);

// });


import { test, expect } from '@playwright/test';

const fs = require('fs');

test.beforeEach(async ({ context, page }) => {
    // Load authentication state (cookies + localStorage)
    const sessionStorage = JSON.parse(fs.readFileSync('playwright/.auth/session.json', 'utf-8'));
    await context.addInitScript(storage => {
      // if (window.location.hostname === 'qa_env.ibiot.net') {
        for (const [key, value] of Object.entries(storage))
          window.sessionStorage.setItem(key, value);
      // }
    }, sessionStorage);
  
    await page.goto(process.env.HOME_URL);
  });
  
  test('Create User Test - Reuse Session', async ({ page }) => {
      await page.click('button[title="User Management"]');
       await page.click('button[class="my-button"]');
      await page.locator('input[name="name"].form-control').fill('mamatha');
      await page.locator('input[name="lastname"].form-control').fill('Sangana');
    await page.locator('input[name="mailId"].form-control').fill('mamatha.sangana@ideabytes.com');
     await page.locator('#cCode').click();
     
     await page.locator('.ng-dropdown-panel .ng-option', { hasText: 'india' }).click();
     
     await page.locator('input[name="mobileNumber"].form-control').fill('9963060211');
   // Locator for the dropdown using the placeholder text
    const roleDropdown = page.locator('.ng-select-container:has-text("Role")');
   
   // Click the dropdown
    await roleDropdown.click();
   await page.waitForSelector('.ng-option');
   
  // Step 3: Click on the option with text "Auditor"
 await page.locator("//span[normalize-space()='temp1']").click();
   // // Click the element
  // Click on the dropdown
    await page.locator('#userPref.ng-select-container').click();
    await page.waitForSelector('.ng-option');
 
   // //await page.locator('.ng-option[role="option"][id="a330298c2a22-3"] .textWrapDD[title="Alerts Management"]');
    await page.locator('div.textWrapDD[title="Dashboard > List View"]').click();
    await page.locator('input[name="password"]').fill('Mamatha@456');
    await page.locator('input[name="confirmPassword"]').fill('Mamatha@456');
   
   

    await page.locator('#sms').check(); // Example for a specific checkbox with id="sms"
    await page.locator('input[name="email"]').check();
    await page.locator("div[class='col-md-6 col-sm-6 col-xs-6'] button[type='submit']").click();
   


  }); 

  
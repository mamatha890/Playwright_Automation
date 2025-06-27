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

    test('Read Excel Data and Login', async ({ page }) => {
        const role=new Modules(page);
       await role.menu("Alarm Setup");
        await role.menu("Reset Rules");
       const dialog=page.locator("//span[text()='Reset Rules']/ancestor::div[@class='ui-modal']");
       if(dialog){
        console.log("visisble");
       await role.dropdown("Location");
    await page.locator("//div[@title='Ideabytes']").click();
       await role.dropdown("Device Model");
       await page.locator("//span[@class='ng-option-label ng-star-inserted' and text()='WTH50']").click();


       await role.dropdown("Device Name");
       await page.locator("//div[@title='Dev001']").click();


       }

  });
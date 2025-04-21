const { test } = require('@playwright/test');
const { ReportsPage } = require('../page/Reports.js');
const fs = require('fs');
const Modules = require('../Common Utils/modules.js');

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
test("Creating User",async({page})=>{

      const role=new Modules(page);
           await role.menu("User Management");
           await role.common("Role Management");
           await role.common("Role");
           const roles = [
            { getRoles: 'roleName', Names: 'admin1' },
            { getRoles: 'roleTag', Names: 'test' },
           
        ];

        
        await role.CreateRole(roles);
        await page.locator('//textarea[@id="description"]').fill("this is my description");
        await page.locator('//button[@type="submit"]').click();
        await page.locator('//button[@type="button"][@class="my-button ng-star-inserted"]').click();
        

          

});

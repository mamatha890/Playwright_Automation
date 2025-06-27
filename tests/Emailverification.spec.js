const { test, expect, context } = require('@playwright/test');
const { ReportsPage } = require('../page/Reports.js');
const fs = require('fs');
const Modules = require('../Common Utils/modules.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');
const UserPage= require('../page/UserManagementmodule.js');

const Loginpage = require('../page/Loginpage.js');

test.beforeEach(async ({ context, page }) => {
    const session = new Modules(page, context);
    await session.sessionstorage(); 
});


test("Creating User", async ({ page }) => {
    


   
const role = new Modules(page);
   
    
    const excelData = extractDataFromExcel(
        'C:/Users/mamatha.sangana/Videos/Playwright_Automation/Common Utils/data.xlsx',
        'usermanagement');


    const user = excelData[0];
    const locator = new UserPage(page);

    await role.menu("User Management");
    locator.EnterSearch(user.Search);



 
    
    await locator.roleCreation(user.RoleName,user.RoleTag,user.description);
    await page.locator('//label[contains( text(),"Report")]').check();

    await page.locator('//label[contains( text(),"Dashboard")]').check();
    const Permissions = await page.locator(
        '//span[contains(text(),"Permissions")]//parent::div//parent::div//following-sibling::div[@class="ui-modal-body"]//input[@type="checkbox" and not(ancestor::label[contains(text(),"Dashboard")])]'
      );
      
      // Loop through and check each checkbox
      const count = await Permissions.count();
      for (let i = 0; i < count; i++) {
          const allpermissions = Permissions.nth(i);
          if (!(await allpermissions.isChecked())) {
              await allpermissions.check(); 
              // Check the checkbox if it's not already checked
          }
      }
     
      // Locate the dialog box containing the "Permission" text

await page.waitForTimeout(3000);
await page.locator('//ng-select[@placeholder="Select home Screen"]').click();
await page.waitForTimeout(3000);
await page.locator('//div[@role="option"]//span[text()="Dashboard"]').click();
await page.waitForTimeout(3000);

await page.locator('//button[contains(text(),"Save")]').click();
const successMessage = await page.locator('//div[contains(text(),"Permissions Updated Successfully")]').textContent();
expect(successMessage).toContain('Permissions Updated Successfully');
await role.menu("User Management");
await role.common("User");
  
  ;

    //role.dialog();
    const fields = [
        { title: 'name', value: user.FirsttName },
        { title: 'lastname', value: user.LastName },
        { title: 'mailId', value: user.EmailId }
    ];
    for (const field of fields) {
        await locator.dynamicLocator(field.title, field.value);
    }
    await locator.fillfiled(user);
    await locator.dynamicLocator('mobileNumber', user.PhoneNumber);
    await locator.rolepeference(user);
    await locator.dynamicLocator('password', user.Password);
    await locator.dynamicLocator('confirmPassword', user.ConfirmPassword);
    const checkboxes = ['sms', 'email', 'warn', 'critical', 'good'];
    for (const checkbox of checkboxes) {
        await locator.checkboxes(checkbox);
    }
   locator.Reportchaeckboxes();
    //await page.locator('//label[@for="createReport"]').check();
    await locator.clicksubmitbutton();
    await page.waitForTimeout(3000);
    
    await locator.outlook();
    await locator.outlookVeification();
    await locator.userEmailVerificationPage();
    await locator.VerificationLink();
},{ timeout: 80000 });




const { test, expect, context } = require('@playwright/test');
const { ReportsPage } = require('../page/Reports.js');
const fs = require('fs');
const Modules = require('../Common Utils/modules.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');
const UserPage = require('../page/UserManagement.js')
test.beforeEach(async ({ context, page }) => {
    const session = new Modules(page, context);
    await session.sessionstorage(); 
});
test("Creating User", async ({ page }) => {
    const role = new Modules(page);
    await role.menu("User Management");
    await role.common("User");
    role.dialog();
    const locator = new UserPage(page);
    const excelData = extractDataFromExcel(
        'C:/Users/mamatha.sangana/Videos/Playwright_Automation/Common Utils/data.xlsx',
        'usermanagement');
    const user = excelData[0];
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
    await locator.submitbutton();
    await locator.outlookVeification();
    await locator.EmailVerificationPage();
    await locator.getVerificationLink();
},{ timeout: 80000 });


const { test, expect, context } = require('@playwright/test');
const { ReportsPage } = require('../page/Reports.js');
const fs = require('fs');
const Modules = require('../Common Utils/modules.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');
const UserPage = require('../page/UserManagement.js')

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
test("Creating User", async ({ page }) => {
    //test.setTimeout(60000); // Incr
    const role = new Modules(page);
    await role.menu("User Management");
    await role.common("User");
    role.dialog();
    const locator = new UserPage(page);
    const excelData = extractDataFromExcel(
        'C:/Users/mamatha.sangana/Videos/Playwright_Automation/Common Utils/data.xlsx',
        'usermanagement');
    const user = excelData[0];
    console.log(user);
    const fields = [
        { title: 'name', value: user.FirsttName },
        { title: 'lastname', value: user.LastName },
        { title: 'mailId', value: user.EmailId }
    ];

    for (const field of fields) {
        await locator.dynamicLocator(field.title, field.value);
    }
    await locator.fillfiled(user);

    //await page.locator('.ng-dropdown-panel .ng-option', { hasText: user.CountryCode }).click();
    await locator.dynamicLocator('mobileNumber', user.PhoneNumber);

    await locator.rolepeference(user);


    await locator.dynamicLocator('password', user.Password);
    await locator.dynamicLocator('confirmPassword', user.ConfirmPassword);
    const checkboxes = ['sms', 'email', 'warn', 'critical', 'good'];
    for (const checkbox of checkboxes) {
        await locator.checkboxes(checkbox);
    }

    await locator.submitbutton();
    await page.waitForTimeout(2000);


    await locator.outlookVeification();



    await locator.EmailVerificationPage();
    await page.waitForTimeout(2000);
    await locator.getVerificationLink();
});
const { test, expect, context } = require('@playwright/test');
const UserPage = require('../page/UserManagementmodule.js');
const Modules = require('../Common Utils/modules.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');
const path = require('path');
const xlsx = require('xlsx');
const Loginpage = require('../page/Loginpage.js');
test.beforeEach(async ({ context, page }) => {
    const session = new Modules(page, context);
    await session.sessionstorage();
});
const filePath = "Common Utils/login.xlsx"; // Path to the Excel file
const sheetName = "UserManagement"; // Name of the sheet in the Excel file
let mydata = extractDataFromExcel(filePath, sheetName);
let testdata = Array.isArray(mydata) ? mydata : [mydata]; // Ensure it's an array

// Function to update the Excel file with the test status
function updateExcelStatus(filePath, sheetName, data) {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    const updatedSheet = xlsx.utils.json_to_sheet(data);
    workbook.Sheets[sheetName] = updatedSheet;
    xlsx.writeFile(workbook, filePath);
}
// Loop through each row of data and create a test
testdata.forEach((code) => {


    if (code.TestCaseName === "user creation and deletion  testcase") {
        test(`${code["TestCaseNumber"]} - user creation and deletion  testcases`, async ({ page }) => {
            try {

    const excelData = extractDataFromExcel(
        'C:/Users/mamatha.sangana/Videos/Playwright_Automation/Common Utils/data.xlsx',
        'usermanagement');
    const user = excelData[0];
    const role = new Modules(page);
    const locator = new UserPage(page);
    await page.locator(('//button[@title="User Management"]')).click();
    await locator.EnterSearch(user.Search);
    await page.waitForTimeout(5000);
    const URL = process.env.BASE_URL;
    const username = process.env.USERNAME1;
    const userId = process.env.User;
    console.log("username", username);
    const password = process.env.PASSWORD;
    console.log(password);
    const table = await page.locator('table.mat-mdc-table');
    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    console.log("rowcount:",rowCount);
    if  (await rowCount === 1) {
        await locator.deleteuser();
        await locator.loginverification(URL, userId, password);
        await locator.login(URL, username, password)

        await role.menu("User Management");
        await role.common("User");
        role.dialog();
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
        await locator.usercheckboxes();
        await page.waitForTimeout(3000);
        await locator.clicksubmitbutton();
        await page.waitForTimeout(3000);
        await locator.outlook();
        await locator.outlookVeification();
        await locator.userEmailVerificationPage();
        await locator.VerificationLink();
        await page.waitForTimeout(3000);
    }
  

    else {
        
        console.log("no data available");
        await role.common("User");
        role.dialog();
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
        await locator.usercheckboxes();
        await page.waitForTimeout(3000);
        await locator.clicksubmitbutton();
        await page.waitForTimeout(3000);
        await locator.outlook();
        await locator.outlookVeification();
        await locator.userEmailVerificationPage();
        await locator.VerificationLink();
         code.Status = "Pass";
    }
}
    catch (err) {
                console.error(`Test case ${code["TestCaseNumber"]} failed: ${err.message}`);
                code.Status = "Fail"; // Mark as failed
                throw err; // Re-throw to ensure Playwright marks the test as failed
            } finally {
                // Update the Excel file
                updateExcelStatus(filePath, sheetName, testdata);
            }
        });
    }
});


      
        












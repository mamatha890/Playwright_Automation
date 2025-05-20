const { test, expect, context } = require('@playwright/test');
const Modules = require('../Common Utils/modules.js');
const UserPage = require('../page/UserManagementmodule.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');
const ScreenshotHelper = require('../Utils/ScreenshotHelper');
test.afterEach(async ({ page }, testInfo) => {
  const screenshotHelper = new ScreenshotHelper(); // Correct initialization
  await screenshotHelper.captureScreenshot(page, testInfo); // Call the method
});
const xlsx = require('xlsx');
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


    if (code.TestCaseName === "usermandetory fields") {
        test(`${code["TestCaseNumber"]} - usermandetory fields`, async ({ page }) => {
            try {
                const user = new Modules(page);
                user.menu("User Management");
                const check = new UserPage(page, expect);
                await check.EnterSearch();
                await page.waitForTimeout(3000);
                await check.edit();
                const excelData = extractDataFromExcel(
                    'C:/Users/mamatha.sangana/Videos/Playwright_Automation/Common Utils/data.xlsx',
                    'usermanagement');
                const data = excelData[0];
                await page.waitForTimeout(3000);
                check.clearfields("name");
                await page.waitForTimeout(3000);
                await check.button();
                await check.errorverification();
                await page.waitForTimeout(3000);
                await check.fillfields(data.FirsttName);
                await check.clearfields("lastname");
                await page.waitForTimeout(3000);
                await check.button();
                await check.lastNameverification();
                await page.waitForTimeout(3000);
                await check.lastname(data.LastName);
                await check.clearfields("mobileNumber");
                await page.waitForTimeout(3000);
                await check.button();
                await check.mobileverification();
                await page.waitForTimeout(3000);
                await check.MobileNumber(data.PhoneNumber);
                code.Status = "Pass"
            } catch (err) {
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







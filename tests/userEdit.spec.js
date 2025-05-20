const { test, expect, context } = require('@playwright/test');
const Modules = require('../Common Utils/modules.js');
const UserPage = require('../page/UserManagementmodule.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');
const ScreenshotHelper = require('../Utils/ScreenshotHelper');
const xlsx = require('xlsx');
test.afterEach(async ({ page }, testInfo) => {
  const screenshotHelper = new ScreenshotHelper(); // Correct initialization
  await screenshotHelper.captureScreenshot(page, testInfo); // Call the method
});
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
  if (code.TestCaseName === "user edit") {
    test(`${code["TestCaseNumber"]} - user edit testcase`, async ({ page }) => {
      try {
        const user = new Modules(page);
        user.menu("User Management");
        const check = new UserPage(page, expect);
        check.EnterSearch();
        await page.waitForTimeout(3000);
        await check.edituser();

        await check.userediting();
        await page.waitForTimeout(3000);
        const locator = new UserPage(page);
        await check.button();
        await check.verifyToastmeasage();
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



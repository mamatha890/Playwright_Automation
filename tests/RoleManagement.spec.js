const {test} = require('@playwright/test');
const Modules = require('../Common Utils/modules.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');
const UserPage = require('../page/UserManagementmodule.js');
const UserPage = require('../page/Api.js');
const xlsx = require('xlsx');
const ScreenshotHelper = require('../Utils/ScreenshotHelper');
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
 if (code.TestCaseName === "roles creation") {
        test(`${code["TestCaseNumber"]} - Roles end to end testcase`, async ({ page }) => {
            try {
     const role = new Modules(page);
  const excelData = extractDataFromExcel(
    'C:/Users/mamatha.sangana/Videos/Playwright_Automation/Common Utils/data.xlsx',
    'usermanagement');
  const user = excelData[0];
  const randomRoleName = `Role${Math.random().toString().substring(2, 8)}`;
  const locator= new UserPage(page);
  await role.menu("User Management");
  await locator.roleCreation(randomRoleName, user.RoleTag, user.description);
  await page.waitForTimeout(3000);
  await locator.permissions(user.dashboard);
  await page.waitForTimeout(3000);
  await locator.verifySearchfunctinality(randomRoleName, user);
  await page.waitForTimeout(3000);
  await locator.verifyPermissioneditfunctinality(randomRoleName, user.dashboard);
  code.Status="Pass"
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







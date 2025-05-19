const { test, expect, context } = require('@playwright/test');
const Modules = require('../Common Utils/modules.js');
const UserPage = require('../page/UserManagementmodule.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');


// Hook to capture screenshots after each test
test.afterEach(async ({ page }, testInfo) => {
  try {
    // Determine the folder based on the test's status
    const folderPath = testInfo.status === 'passed'
      ? path.join(__dirname, 'artifacts/screenshots/passed')
      : path.join(__dirname, 'artifacts/screenshots/failed');

    // Ensure the folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Generate a filename based on the test title
    const fileName = `${testInfo.title.replace(/[\s:]/g, '_')}.png`;

    // Take a screenshot and save it
    await page.screenshot({ path: path.join(folderPath, fileName) });
  } catch (error) {
    console.error('Error while saving screenshot:', error);
  }
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
    await page.locator('//mat-icon[contains(text(),"edit")]').click({ force: true });
    

// Check and update the input field


const nameInputSelector = '//input[@name="name"]';

// Clear and update the input field
await page.locator(nameInputSelector).click(); // Focus on the input field
await page.keyboard.press('Control+A'); // Select all text (use 'Meta+A' for Mac)
await page.keyboard.press('Backspace'); // Clear the field

// Wait for any potential external update script to finish
await page.waitForTimeout(500); 
// Adjust timeout if necessary

    const excelData = extractDataFromExcel(
        'C:/Users/mamatha.sangana/Videos/Playwright_Automation/Common Utils/data.xlsx',
        'usermanagement');
    const exceldata = excelData[0];

// Enter the new value

await page.locator(nameInputSelector).fill(exceldata.FirsttName); 
await page.waitForTimeout(3000);
const nameInputSelector1 = '//input[@name="lastname"]';


// Clear and update the input field
await page.locator(nameInputSelector1).click(); // Focus on the input field
await page.keyboard.press('Control+A'); // Select all text (use 'Meta+A' for Mac)
await page.keyboard.press('Backspace'); // Clear the field

// Wait for any potential external update script to finish
await page.waitForTimeout(500); // Adjust timeout if necessary


await page.locator(nameInputSelector1).fill(exceldata.LastName); 
await page.waitForTimeout(3000);
const locator = new UserPage(page);
await check.button();
await check.verifyToastmeasage();
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



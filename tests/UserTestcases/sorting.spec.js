const {test,expect} = require('@playwright/test');
const Modules = require('../../Common Utils/modules.js');
const path = require('path');
const { extractDataFromExcel } = require('../../Utils/Excel.js');
const xlsx = require('xlsx');
const UserPage = require('../../page/UserManagementmodule.js');

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

  testdata.forEach((code) => {
 if (code.TestCaseName === "sorting order") {
        test(`${code["TestCaseNumber"]} - sorting order in usermanagement module`, async ({ page },testInfo) => {
            try {
              const userPage=new UserPage(page);
              test.step("sortingorderfunctinality",async()=>{
       await userPage.soringfuncctinality(testInfo);
            });
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


const {test} = require('@playwright/test');
const Modules = require('../../Common Utils/modules.js');
const { extractDataFromExcel } = require('../../Utils/Excel.js');
const UserPage = require('../../page/UserManagementmodule.js');
const { takeScreenshotWithTestCase } = require('../../Utils/screenshotUtil.js');
const path = require('path');
 const xlsx = require('xlsx');
 test.beforeEach(async ({ context, page,}, testInfo) => {
  const session = new Modules(page, context);
  await session.sessionstorage(testInfo);

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
        test("Roles end to end testcase", async ({ page },testInfo) => {
            try {
     const role = new Modules(page);
 const excelData = extractDataFromExcel(path.join(__dirname, '..', '..', 'Common Utils', 'data.xlsx'), 'usermanagement');
 
  const data = excelData[0];

  const randomRoleName = `Role${Math.random().toString().substring(2, 8)}`;
  const locator= new UserPage(page);
test.step("Naviagte to usermanagement page", async () => {
   const modules = new Modules(page);
    await modules.verifyuserManagementpage("User Management", data.Verificationdeatils,data.TestCaseName, "Navigate to UserManagement", "passed", testInfo);

  });
    await test.step('Creating Roles in Role Management', async () => {
  await locator.roleCreation(randomRoleName, data.RoleTag, data.description,"RoleManagement",testInfo);


    });
   
  await page.waitForTimeout(3000);
   await test.step('Creating Permissions in Role Management', async () => {
    await locator.permissions(data.dashboard,testInfo);
    //await takeScreenshotWithTestCase(page,'RoleManagement', 'Navigate to permissionpage', 'passed', testInfo);
   });
   
  await page.waitForTimeout(3000);
  await test.step('Verify Search functinality and verify the Role Creation Details', async () => {
  await locator.verifySearchfunctinality(randomRoleName, data,testInfo);
 
  });
  await page.waitForTimeout(3000);
  await test.step('Verify the permissions editing', async () => {
 
  await locator.verifyPermissioneditfunctinality(randomRoleName, data.dashboard,testInfo);
 
  });
   
       code.Status="Pass"
 
             } catch (err) {
                console.error(`Test case ${code["TestCaseNumber"]}failed: ${err.message}`);
                code.Status = "Fail"; // Mark as failed
                throw err; // Re-throw to ensure Playwright marks the test as failed
            } finally {
                // Update the Excel file
                updateExcelStatus(filePath, sheetName, testdata);
            }
        });
    }
});
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    await takeScreenshotWithTestCase(page, 'RoleManagement', 'failed testcases', 'failed', testInfo); // Pass testInfo for report attachment.
  }
});

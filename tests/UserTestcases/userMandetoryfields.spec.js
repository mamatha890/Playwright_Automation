const { test, expect, context } = require('@playwright/test');
const Modules = require('../../Common Utils/modules.js');
const UserPage = require('../../page/UserManagementmodule.js');
const { extractDataFromExcel } = require('../../Utils/Excel.js');

//const { takeScreenshotWithTestCase } = require('../../Utils/screenshotUtil.js');
const path = require('path');

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
        test(`${code["TestCaseNumber"]} - usermandetory fields`, async ({ page },testInfo) => {
            try {
                 const check = new UserPage(page, expect);
               
                
     const excelData = extractDataFromExcel(path.join(__dirname, '..', '..', 'Common Utils', 'data.xlsx'), 'usermanagement');

                const user = new Modules(page);
               
                     const data = excelData[0];

                     
                user.menu("User Management");
              
                await check.EnterSearch(data);
                await page.waitForTimeout(3000);
                await check.edituser();
                
                

                    await page.waitForTimeout(3000);
                check.clearfields("name");
                await page.waitForTimeout(3000);
                await check.button();
                await check.errorverification(testInfo);
                 // await takeScreenshotWithTestCase(page, 'userMandetoryfields', 'please enter firstName', 'passed', testInfo);
                await page.waitForTimeout(3000);
                await check.fillfields(data.FirsttName);
                await check.clearfields("lastname");
                await page.waitForTimeout(3000);
                await check.button();
                await check.lastNameverification();
                                //  await takeScreenshotWithTestCase(page, 'userMandetoryfields', 'please enter LastName', 'passed', testInfo);
                await page.waitForTimeout(3000);
                await check.lastname(data.LastName);
                await check.clearfields("mobileNumber");
                await page.waitForTimeout(3000);
                await check.button();
                await check.mobileverification();
                                //  await takeScreenshotWithTestCase(page, 'userMandetoryfields', 'please enter the mobile number', 'passed', testInfo);
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


test.afterEach(async ({ page }, testInfo) => {
   if (testInfo.status === 'failed') {
 // await takeScreenshotWithTestCase(page,'userMandetoryfields', 'failed testcases', 'failed', testInfo); // Pass testInfo for report attachment.
   }
});









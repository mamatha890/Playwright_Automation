import { test, expect, request } from '@playwright/test';
const Modules = require('../../Common Utils/modules.js');
const UserPage = require('../../page/UserManagementmodule.js');
const Loginpage = require('../../page/Loginpage.js');
const RulePage = require('../../page/Alert verification.js');
const Alertmanagent = require('../../page/Alertmanagement.js');
const { extractDataFromExcel } = require('../../Utils/Excel.js');
const xlsx = require('xlsx');
const { takeScreenshotWithTestCase } = require('../../Utils/screenshotUtil.js');

const UserApi = require('../../page/Api.js');
test.beforeEach(async ({ context, page }) => {
    const session = new Modules(page, context);
    await session.sessionstorage();
});
const filePath = "Common Utils/login.xlsx"; // Path to the Excel file
const sheetName = "Login"; // Name of the sheet in the Excel file
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
    if (code.TestType === "verify emailcheckbox in disabled mode can we get the alerts in mail") {
        test(`${code["TestCaseNumber"]} - negative Login Test`, async ({ page, request }) => {
            try {
                const user = new Modules(page);
                await user.menu("Alerts Management");
                const AlertManagement = new Alertmanagent(page, expect);
                await AlertManagement.clicksettings();
                await page.waitForTimeout(3000);

                await AlertManagement.settingspage();

                await user.menu("Dashboard");

                await AlertManagement.getAndLogAllValues();

                await page.waitForTimeout(3000);

                user.menu("Alarm Setup");
                await AlertManagement.search();

                const results = page.locator('//table//tr'); // Adjust selector as needed
                const rowCount = await results.count(); // Assign row count here

                if (rowCount > 0) {
                    console.log(`Search returned ${rowCount} rows of data`);
                    console.log("data is available");
                    const mydata = extractDataFromExcel("Common Utils/data.xlsx", "postmandata");

                    const data = mydata[0]; // Use 'mydata', not 'Excel'
                    console.log(data);
                    const userApi = new UserApi(request, expect);
                    const response = await userApi.createUser(data);
                    const user1 = new Modules(page);

                    await page.waitForTimeout(5000);
                    await page.reload();
                    await page.waitForTimeout(5000);

                    user1.menu("Dashboard");
                    await AlertManagement.DashboardSettings();

                    await AlertManagement.Dashbordcheckboxes();
                    await AlertManagement.updatedvalues();
                }
                const outlook = new UserPage(page);
                await outlook.outlook();

                await outlook.outlookVeification();

                // Locate the timestamp element and get its content
                await AlertManagement.verifydata();
                code.Status = "Pass"
            }
            catch (err) {
                console.error(`Test case ${code["TestCaseNumber"]} failed: ${err.message}`);
                code.Status = "Fail"; // Mark as failed
                throw err;
            }
            finally {
                updateExcelStatus(filePath, sheetName, testdata)
            }
        });
    }
});
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    await takeScreenshotWithTestCase(page, 'ReleManagement', 'failed testcases', 'failed', testInfo); // Pass testInfo for report attachment.
  }
});

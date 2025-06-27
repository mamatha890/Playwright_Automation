const { test, expect } = require('@playwright/test');
const Modules = require('../../Common Utils/modules.js');
const UserPage = require('../../page/UserManagementmodule.js');
const ExcelUtil = require('../../Utils/ExcelUtils.js');
const { takeScreenshotWithTestCase } = require('../../Utils/screenshotUtil.js');
const { extractDataFromExcel } = require('../../Utils/Excel.js');
const path = require('path');

test.beforeEach(async ({ context, page }) => {
  const session = new Modules(page, context);
  await session.sessionstorage();
});

const filePath = path.join(__dirname, '..', '..', 'Common Utils', 'login.xlsx');
const sheetName = "UserManagement";

const excelUtil = new ExcelUtil(filePath, sheetName);
let testdata = excelUtil.readData();

testdata.forEach((code) => {
  if (code.TestCaseName === "user edit") {
    test(`${code.TestCaseNumber} - user edit testcase`, async ({ page }, testInfo) => {
      try {
        const user = new Modules(page);

        await test.step('Navigate to the User Management Module', async () => {
          await user.menu("User Management");
          test.info().attach('Log', {
            body: 'Successfully navigated to the User Management module.',
          });
        });

        const check = new UserPage(page, expect);
        const excelData = extractDataFromExcel(path.join(__dirname, '..', '..', 'Common Utils', 'data.xlsx'), 'usermanagement');
          
        const data = excelData[0];

        check.EnterSearch(data);
        await page.waitForTimeout(3000);
        await check.edituser();

        await check.userediting();
        await page.waitForTimeout(3000);

        await check.button();
        await check.verifyToastmeasage(data);

        await takeScreenshotWithTestCase(page, 'user Edit Testcase', 'user Updated successfully', 'passed', testInfo);
        code.Status = "Pass";
      
      } catch (err) {
        console.error(`Test case ${code.TestCaseNumber} failed: ${err.message}`);
        code.Status = "Fail";
        throw err;
      } finally {
        // Update only for "user edit" test case
        excelUtil.updateData(testdata, "user edit");
      }
    });
  }

});



test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    await takeScreenshotWithTestCase(page, 'user Edit Testcase', 'failed testcases', 'failed', testInfo);
  }
});

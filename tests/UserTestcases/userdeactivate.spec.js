const { test, expect } = require('@playwright/test');
const Modules = require('../../Common Utils/modules.js');
const UserPage = require('../../page/UserManagementmodule.js');
const { extractDataFromExcel } = require('../../Utils/Excel.js');
const { takeScreenshotWithTestCase } = require('../../Utils/screenshotUtil.js');
const path = require('path');
test.beforeEach(async ({ context, page }) => {
  const session = new Modules(page, context);
  await session.sessionstorage();
});
test('User deactivate Testcase', async ({ page }, testInfo) => {
  const URL = process.env.BASE_URL;
  const username = process.env.USERNAME1;
  const password = process.env.PASSWORD;
  const userId = process.env.USER;

  const modules = new Modules(page);
  const userPage = new UserPage(page);

  // Navigate to User Management
  test.step("Navigate to the UserManagement Module", async () => {
    await modules.menu('User Management');
  });

  // Extract data from Excel
  const excelPath = path.join(__dirname, '..', '..', 'Common Utils', 'data.xlsx');
  const excelData = extractDataFromExcel(excelPath, 'usermanagement');



  const data = excelData[0];
  const mydata = excelData[1];
  // Search and edit user
  const check = new UserPage(page, expect);
  check.EnterSearch(data);
  await page.waitForTimeout(3000);
  await check.edituser();


  await check.Clickbuttons(data.button);
  await modules.gettoastmessage(mydata.toastmessage);

  await takeScreenshotWithTestCase(page, 'userdeactivate', 'Deactivated Successfully', 'passed', testInfo);
  await userPage.deactivateuserlogin(URL, userId, password);
  await modules.gettoastmessage(data.Logoutmessages);
  await takeScreenshotWithTestCase(page, 'userdeactivate', 'user blocked', 'passed', testInfo);


  await page.waitForTimeout(3000);

  await userPage.login(URL, username, password);



  await page.waitForTimeout(3000);
  await modules.menu('User Management');
  await takeScreenshotWithTestCase(page, 'userdeactivate', 'Navigate to UserManagement page', 'passed', testInfo);



  await check.EnterSearch(data);
  //   await page.waitForTimeout(2000);
  await check.edituser();

  check.Clickbuttons(mydata.button);
  await takeScreenshotWithTestCase(page, 'userdeactivate', "userActivated successfully", 'passed', testInfo);
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    await takeScreenshotWithTestCase(page, 'userdeactivate', 'failed testcases', 'failed', testInfo); // Pass testInfo for report attachment.
  }
});

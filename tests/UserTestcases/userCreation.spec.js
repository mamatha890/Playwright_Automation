const { test, expect } = require('@playwright/test');
const UserPage = require('../../page/UserManagementmodule.js');
const Modules = require('../../Common Utils/modules.js');
const { extractDataFromExcel } = require('../../Utils/Excel.js');
const { takeScreenshotWithTestCase } = require('../../Utils/screenshotUtil.js');
//const envConfig= require('../../Env/envConfig.js')
const path = require('path');
const xlsx = require('xlsx');
 const excelData = extractDataFromExcel(path.join(__dirname, '..', '..', 'Common Utils', 'data.xlsx'), 'usermanagement');
  const data = excelData[0];


test.beforeEach(async ({ context, page }, testInfo) => {
  const session = new Modules(page, context);
  await session.sessionstorage(testInfo,data.TestCaseName);
});



//if (data.TestCaseName === "userCreation") {
  if (excelData.some((row) => row.TestCaseName === 'userCreation')) {
       const data = excelData.find((row) => row.TestCaseName === 'userCreation');
      console.log("data:",data);
        test("userCreationand email verification", async ({ page },testInfo) => {
      
 
 
  const URL = process.env.BASE_URL;
  const username = process.env.USERNAME1;
  const userId = process.env.User;
  const password = process.env.PASSWORD;
  const modules = new Modules(page);
  test.step("Naviagte to usermanagement page", async () => {
    await modules.verifyuserManagementpage("User Management",data.TestCaseName,"Navigate to the UserManagement","passed",testInfo);
    console.log(data.Verificationdeatils);
  });

const userPage = new UserPage(page);
 await userPage.EnterSearch(data, data.TestCaseName, "Searchfunctinality", "passed", testInfo);
    await page.waitForTimeout(3000);
     await userPage.userCreation(data,data.TestCaseName,"Navaigate to UserManagement","passed",URL, userId, password, username,testInfo);
    
});
}else {
  console.log(`Test case "${data.TestCaseName}" does not match "userCreation". Skipping test.`);
}
    

   test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    await takeScreenshotWithTestCase(page, 'userCreation', 'failed testcases', 'failed', testInfo); // Pass testInfo for report attachment.
  }

});

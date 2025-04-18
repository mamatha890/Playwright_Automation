import { test, expect } from '@playwright/test';
import { LoginPage } from '../page/useranagement';

// const { ExcelUtils } = require('../utils/excelUtils');

 test('test', async ({ page }) => {
  const login = new LoginPage(page);
//   const testData = ExcelUtils.readExcel('../common/xyz.xlsx'); // Adjust path
//   console.log('Test Data:', testData);
 

//   const { Username, Password } = testData[0];

  await login.performLogin("support@ideabytesiot.com","9S26F7");
 
  await login.clickopen();

  await page.waitForTimeout(4000);


await login.clickUserManagementMenu();
await page.waitForTimeout(4000);
await login.EnterSearch();
await login.deelete();

});








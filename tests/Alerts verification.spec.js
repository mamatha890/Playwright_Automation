const { test, expect } = require('@playwright/test');
const Modules = require('../Common Utils/modules.js');
import fs from "fs";
const RulePage = require('../page/Alert verification.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');

const UserPage = require('../page/UserManagementmodule.js')

const UserApi = require('../page/Api.js');
test.beforeEach(async ({ context, page }) => {
    const session = new Modules(page, context);
    await session.sessionstorage();
});


test("Alerts Veification", async ({ page }) => {
    const role = new Modules(page);
    await role.menu("Alarm Setup");
    await role.menu("Add Rule");

    const rulePage = new RulePage(page);
    const ReadExcelValues = extractDataFromExcel(
        'C:/Users/mamatha.sangana/Videos/Playwright_Automation/Common Utils/data.xlsx',
        'Sheet1'
    );
    console.log('TestData: ', ReadExcelValues);

    // Select Location and Device
    const locationname = ReadExcelValues[0].Location;
    await rulePage.selectLocation(locationname);
    const devicename = ReadExcelValues[0].Device;
    console.log(devicename)
    await rulePage.selectDeviceName(devicename);

    for (let a = 0; a < ReadExcelValues.length; a++) {
        const rowData = ReadExcelValues[a];
        const parameterName = rowData.Parameter;
        const parameterValues = [rowData.Min, rowData.Max, rowData.Tolerance];

        await rulePage.MinMaxValue(parameterName, parameterValues);
        await rulePage.clickApply(parameterName);
    }

});
test('API Test - POST Request', async ({ request }) => {
    // Extract test data from Excel
    const ExcelData = extractDataFromExcel(
        'C:/Users/mamatha.sangana/Videos/Playwright_Automation/Common Utils/data.xlsx',
        'postmandata'
    );

    const user = ExcelData[0];
    console.log('Test Data:', user);

    const userApi = new UserApi(request, expect);
    const response = await userApi.createUser(user);
});
test("Alerts Veification1", async ({ page }) => {
    const locator = new UserPage(page);
    locator.outlook();
    await page.waitForTimeout(5000);
    locator.outlookVeification();
    await page.waitForTimeout(6000);
    const rulePage = new RulePage(page, expect);
    rulePage.Alertclick();
    await page.waitForTimeout(4000);
    rulePage.AlertVerification();

});
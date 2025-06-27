const { test, expect } = require('@playwright/test');
const UserPage = require('../../page/UserManagementmodule.js');
const Modules = require('../../Common Utils/modules.js');
const { extractDataFromExcel } = require('../../Utils/Excel.js');
//const { takeScreenshotWithTestCase } = require('../../Utils/screenshotUtil.js');
const xlsx = require('xlsx');
const path = require('path');

test.beforeEach(async ({ context, page }, testInfo) => {
    const session = new Modules(page, context);
    await session.sessionstorage();
    //await takeScreenshotWithTestCase(page, 'userCreationandDeleteTestcase', 'Navaigate to the Dashboard', 'passed', testInfo);
});

const filePath = "Common Utils/login.xlsx";
const sheetName = "UserManagement";
let mydata = extractDataFromExcel(filePath, sheetName);
let testdata = Array.isArray(mydata) ? mydata : [mydata];

testdata.forEach((code) => {
    if (code.TestCaseName === "user creation and deletion  testcase") {
        test(`${code["TestCaseNumber"]} - user creation and deletion testcases`, async ({ page }, testInfo) => {
            const userPage = new UserPage(page);
            const role = new Modules(page);

            try {
                

                const excelData = extractDataFromExcel(path.join(__dirname, '..', '..', 'Common Utils', 'data.xlsx'), 'usermanagement');

                const data = excelData[0];
               test.step("navigate to userManagement module",async()=>{
                await role.menu("User Management");
                //await takeScreenshotWithTestCase(page, 'userCreationandDeleteTestcase', 'Navigate to usermanagement module', 'passed', testInfo);
})
                await userPage.EnterSearch(data);
                await page.waitForTimeout(5000);
                

                const rows = page.locator('//tbody[@role="rowgroup"]/tr');
                let isMatchFound = false;

                for (let i = 0; i < await rows.count(); i++) {
                    const row = rows.nth(i);
                    const cells = row.locator('td');

                    for (let j = 0; j < await cells.count(); j++) {
                        const cell = cells.nth(j);
                        const cellTitle = await cell.getAttribute('title');

                        if (cellTitle && cellTitle === data.Search) {
                            console.log(`Match found in row ${i + 1}, cell ${j + 1}: ${cellTitle}`);
                            isMatchFound = true;
                            break;
                        }
                    }
                    if (isMatchFound) {
                        console.log("data is available");

                        await userPage.edituser();
                        await userPage.deleteuser(testInfo);

                        const URL = process.env.BASE_URL;
                        const username = process.env.USERNAME1;
                        const userId = process.env.User;
                        const password = process.env.PASSWORD;

                        await userPage.loginverification(URL, userId, password);
                        await userPage.login(URL, username, password);
                        await userPage.userManagementButton.click();
                        await userPage.userbutton();

                        const fields = [
                            { title: 'name', value: data.FirsttName },
                            { title: 'lastname', value: data.LastName },
                            { title: 'mailId', value: data.EmailId }
                        ];

                        for (const field of fields) {
                            await userPage.dynamicLocator(field.title, field.value);
                        }

                        await userPage.countryCode(data);
                        await userPage.dynamicLocator('mobileNumber', data.PhoneNumber);
                        await userPage.rolepeference(data);
                        await userPage.dynamicLocator('password', data.Password);
                        await userPage.dynamicLocator('confirmPassword', data.ConfirmPassword);
                        await userPage.usercheckboxes();
                        await page.waitForTimeout(3000);
                        await userPage.clicksubmitbutton();
                       // await takeScreenshotWithTestCase(page,'userCreationandDeleteTestcase', 'userCreatedsuccasessfully','passed',testInfo);
                         await page.waitForTimeout(3000);
                        await userPage.outlook();
                       // await takeScreenshotWithTestCase(page, 'userCreationandDeleteTestcase', 'email open successfully', 'passed', testInfo);

                        await userPage.outlookVeification();

                        await userPage.userEmailVerificationPage();


                        await userPage.VerificationLink();
                       // await takeScreenshotWithTestCase(page, 'userCreationandDeleteTestcase', 'email Verified successfully', 'passed', testInfo);

                        await page.waitForTimeout(3000);

                        break;  // Exit the row loop after processing
                    }
                }

                if (!isMatchFound) {
                    console.log('No match found for the search term:', data.Search);
                    userPage.userbutton();

                    const fields = [
                        { title: 'name', value: data.FirsttName },
                        { title: 'lastname', value: data.LastName },
                        { title: 'mailId', value: data.EmailId }
                    ];
                    for (const field of fields) {
                        await userPage.dynamicLocator(field.title, field.value);

                    }
                    await userPage.fillfiled(data);
                    await userPage.dynamicLocator('mobileNumber', data.PhoneNumber);
                    await userPage.rolepeference(data);
                    await userPage.dynamicLocator('password', data.Password);
                    await userPage.dynamicLocator('confirmPassword', data.ConfirmPassword);
                    await userPage.usercheckboxes();
                    await page.waitForTimeout(3000);
                    await userPage.clicksubmitbutton();
                    await page.waitForTimeout(3000);
                    await userPage.outlook();
                    await userPage.outlookVeification();
                    await page.waitForTimeout(3000);
                    await userPage.userEmailVerificationPage();
                    await userPage.VerificationLink();
                    await page.waitForTimeout(3000);
                }






            } catch (error) {
                console.error("Error in test execution:", error);
                throw error;  // Fail the test if error occurs
            }
        });
    }
});


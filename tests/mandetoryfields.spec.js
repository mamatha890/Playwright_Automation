import { test, expect } from '@playwright/test';
const Modules = require('../Common Utils/modules.js');
const Alertmanagent = require('../page/Alertmanagement.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');
const path = require('path');
const fs = require("fs");

const xlsx = require('xlsx');


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


    if (code.TestType === "customdate with mandetory fields") {
        test(`${code["TestCaseNumber"]} - Negative Login Test`, async ({ page }) => {
            try {
                const user = new Modules(page);
                await user.menu("Alerts Management");
                await page.waitForTimeout(4000);

                const Management = new Alertmanagent(page, expect);
                const mydata = extractDataFromExcel("Common Utils/data.xlsx", "AlertManagemnt");
                const data = mydata[0];
                console.log(data);

                await Management.AlertmanagemtFileds(data.Location, data.Devicemodel, data.Device, data.Sensor, data.Parameter, data.Status, data.CustomeDate);

                // Select end date
                const AlertManagement = new Alertmanagent(page, expect);
                const today = new Date();

                // Set startDate to 26th of the current month
                const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

                // Set endDate to 29th of the current month
                const endDate = new Date(today.getFullYear(), today.getMonth(), 3);
                await AlertManagement.time(startDate, endDate);

                await page.waitForTimeout(3000);
                await AlertManagement.clearfield();
                await AlertManagement.fetchbutton();
                code.Status = "Pass"
            }
            catch (err) {
                console.error(`Test case ${code["TestCaseNumber"]} failed: ${err.message}`);
                code.Status = "Fail"; // Mark as failed
                throw err;
            } finally {
                updateExcelStatus(filePath, sheetName, testdata)
            }
        });
    }


});

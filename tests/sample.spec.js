const { test, expect } = require('@playwright/test');
const xlsx = require('xlsx');
const path = require('path');
require('dotenv').config(); // Load environment variables

const { extractDataFromExcel } = require('../Utils/Excel.js');

const filePath = "Common Utils/login.xlsx";
const sheetName = "Login";
let mydata = extractDataFromExcel(filePath, sheetName);
let testdata = Array.isArray(mydata) ? mydata : [mydata];

function updateExcelStatus(filePath, sheetName, data) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  const updatedSheet = xlsx.utils.json_to_sheet(data);
  workbook.Sheets[sheetName] = updatedSheet;
  xlsx.writeFile(workbook, filePath);
}

testdata.forEach((data) => {
  const testType = data.TestType.trim().toLowerCase();
  if (testType === "positive") {
    test(`${data.TestCaseNumber} - Positive Login Test`, async ({ page }) => {
      try {
        await page.goto("https://staging.dgtrak.online/IoT/login");

        const username = process.env.USERNAME1;
        const password = process.env.PASSWORD;

        await page.getByRole("textbox", { name: "Enter your username" }).fill(username);
        await page.getByRole("textbox", { name: "Enter your password" }).fill(password);

        const captchaText = await page.textContent("div.captcha-container marquee.marquee-text");
        const abcd = captchaText.trim();
        await page.fill('input[name="capt"]', abcd);

        await page.click('button[type="submit"]');
        await page.locator('//button[@title="Alerts Management"]').click();

        data.Status = "Pass";
      } catch (err) {
        console.error(`Test case ${data.TestCaseNumber} failed: ${err.message}`);
        data.Status = "Fail";
        throw err;
      } finally {
        updateExcelStatus(filePath, sheetName, testdata);
      }
    });
  }
});

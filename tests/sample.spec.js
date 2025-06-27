const { test, expect } = require('@playwright/test');
const xlsx = require('xlsx');
const path = require('path');

const { extractDataFromExcel } = require('../Utils/Excel.js'); // Path to your Excel data extraction function

// Fetch test data from Excel
const filePath = "Common Utils/login.xlsx"; // Path to the Excel file
const sheetName = "Login"; // Name of the sheet in the Excel file
let mydata = extractDataFromExcel(filePath, sheetName);
console.log(mydata);
let testdata = Array.isArray(mydata) ? mydata : [mydata]; 
console.log(testdata);// Ensure it's an array

// Function to update the Excel file with the test status
function updateExcelStatus(filePath, sheetName, data) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  const updatedSheet = xlsx.utils.json_to_sheet(data);
  workbook.Sheets[sheetName] = updatedSheet;
  xlsx.writeFile(workbook, filePath);
}


// Loop through each row of data and create a test
testdata.forEach((data) => {
  
  if (data.TestType === "positive ") {
    test(`${data["TestCaseNumber"]} - Positive Login Test`, async ({ page }) => {
      try {
        // Navigate to the login page
        await page.goto("https://staging.dgtrak.online/IoT/login");

        // Use valid credentials
        const username = process.env.USERNAME1;
        const password = process.env.PASSWORD;

        await page.getByRole("textbox", { name: "Enter your username" }).fill(username);
        await page.getByRole("textbox", { name: "Enter your password" }).fill(password);

        // Simulate CAPTCHA (if necessary)
        const captchaText = await page.textContent("div.captcha-container marquee.marquee-text");
        const abcd = captchaText.trim();
        await page.fill('input[name="capt"]', abcd);

        // Click the login button
        await page.click('button[type="submit"]');

        // Verify dashboard visibility
       await page.locator('//button[@title="Alerts Management"]').click();
        //expect(isDashboardVisible).toBeTruthy();

        // Mark status as 'Pass'
        data.Status = "Pass";
      } catch (err) {
        console.error(`Test case ${data["TestCaseNumber"]} failed: ${err.message}`);
        data.Status = "Fail"; // Mark as failed
        throw err; // Re-throw to ensure Playwright marks the test as failed
      } finally {
        // Update the Excel file
        updateExcelStatus(filePath, sheetName, testdata);
      }
    });
  }
});

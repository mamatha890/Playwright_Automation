const { test,expect } = require('@playwright/test');
const { ReportsPage } = require('../page/Reports');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
 
 
test.beforeEach(async ({ context, page }) => {
    // Load authentication state (cookies + localStorage)
    const sessionStorage = JSON.parse(fs.readFileSync('playwright/.auth/session.json', 'utf-8'));
    await context.addInitScript(storage => {
      // if (window.location.hostname === 'qa_env.ibiot.net') {
        for (const [key, value] of Object.entries(storage))
          window.sessionStorage.setItem(key, value);
      // }
    }, sessionStorage);
 
    await page.goto(process.env.HOME_URL);
});

 
 
 
 
test('Generate Report Test with Dynamic Data', async ({ page }) => {
  
  
 
  const reportsPage = new ReportsPage(page);
  const downloadDir = path.resolve(__dirname, 'downloads');
 
  // Ensure the download directory exists
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
 
 
 
  const today = new Date();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number
  const reportName = `mamatha${randomSuffix}`;
 
  // Build start and end dates
  const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 5); // 2nd of last month
  const endDate = new Date(today.getFullYear(), today.getMonth(), 3); // 3rd of current month
 
  // Extract values for calendar selection
  const startDay = startDate.getDate();
  const startMonth = startDate.toLocaleString('default', { month: 'long' });
  const startYear = startDate.getFullYear();
 
  const endDay = endDate.getDate();
  const endMonth = endDate.toLocaleString('default', { month: 'long' });
  const endYear = endDate.getFullYear();
 
  // Combine all data into reportData
  const reportData = {
    region: "Ideabytes",
    model: "WTH50",
    device: "Dev001",
    parameters: "Temperature",
     startDay,
    startMonth,
    startYear,
    endDay,
    endMonth,
    endYear,
    reportName
  };
 
  console.log(reportData);
 
 
  // Navigate and configure the report
  await reportsPage.navigateToReports();
  await reportsPage.selectCreateReport();
  await reportsPage.CVS();
  await reportsPage.configureReport(reportData);
  const successMessageLocator = page.locator('//div[@aria-label="Success"]');
 
// Wait for the element to be visible
await successMessageLocator.waitFor({ state: 'visible' });
//console.log(successMessageLocator);
 
// Assert that the text content matches "Success"
//const messageText = successMessageLocator.textContent();
//console.log("message test:" +message Text);
//await page.expect(messageText).toBe('Success');
await page.waitForTimeout(3000);
 
await page.reload();
 
  await page.locator('//div[contains(text(),"On-Demand")]').click();
 
 
 
  const row = page.locator('//table//tr[1]');
 
  // Define the button locator within the row
  const button = row.locator('//following-sibling::td//i[@title="Download"]/following-sibling::i[@title="Remove"]/ancestor::div/preceding-sibling::button');
 
  // Click the button
  await button.click();
  const dropdown = row.locator('div.dropdownload-content');
  // Locate and click the "Remove" button
const downloadButton = dropdown.locator("//*[@title='Download']");
const [download] = await Promise.all([
    page.waitForEvent('download'),
    downloadButton.click(),
  ]);
 
//await downloadButton.click();
const fileName = await download.suggestedFilename();
const filePath = path.join(downloadDir, fileName);
await download.saveAs(filePath);
 
console.log(`Downloaded file saved at: ${filePath}`);
 
// Open and process the downloaded CSV file
console.log('Reading the CSV file...');
// 
});
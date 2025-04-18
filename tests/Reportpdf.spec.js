const { test,expect } = require('@playwright/test');
const { ReportsPage } = require('../page/Reports');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');


//const csvParser = require('csv-parser');
 
 
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
  //const downloadDir = path.resolve(__dirname, 'downloads');
 
  // Ensure the download directory exists
  
 
 
 
  const today = new Date();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number
  const reportName = `pdf${randomSuffix}`;
 
  // Build start and end dates
  const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 3); // 2nd of last month
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
  await reportsPage.configureReport(reportData);
  const successMessageLocator = page.locator('//div[@aria-label="Success"]');
 
// Wait for the element to be visible
await successMessageLocator.waitFor({ state: 'visible' });

 test.setTimeout(80000); // Se

 
await page.reload();// 
//await page.waitForTimeout(2000);



 
  await page.locator('//div[contains(text(),"On-Demand")]').click();

  //const row = page.locator('//table//tr[1]');
  

  // Locate the row containing the Name
  const targetRow = page.locator('table tbody tr').filter({
    has: page.locator(`td[title="${reportName}"]`)
  });

  // Locate the dropdown button within the matched row
  const dropdownButton = targetRow.locator('button.my-button');

  // Hover over the dropdown button
  await dropdownButton.hover({ force: true });
  await page.waitForTimeout(2000);
  //await page.locator('//i[@title="Download"]').click();
  const downloadButton =   page.locator('//i[@title="Download"]');
    await downloadButton.waitFor({ state: 'visible' });
  
  
    // Trigger the download and handle the download event
    const [download] = await Promise.all([
      page.waitForEvent('download'), // Wait for the download event
      await downloadButton.click(), // Click the download button
    ]);
    await page.waitForTimeout(3000); 
    // Retrieve the filename and save the file
    const fileName = await download.suggestedFilename();
    const downloadDir = path.resolve(__dirname, 'ReportPDF');
  
    // Ensure the download directory exists
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
  
    const filePath = path.join(downloadDir, fileName);
    await download.saveAs(filePath);
  
    
        console.log(`PDF downloaded and saved to: ${filePath}`);
        
        // Read the PDF file into a buffer
        //const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = fs.readFileSync(filePath);
      const pdfText = await pdfParse(pdfData);
      //expect(pdfText.text).toContain(reportName);

        
        // Parse the PDF
        //const pdfData = await pdfParse(pdfBuffer);
        
        console.log('Extracted PDF Text:');
        console.log(pdfText.text);
        // Extracted PDF Text
console.log('Extracted PDF Text:');
console.log(pdfText.text);

// Check if "No-Data Available" is present in the PDF text
if (pdfText.text.includes('No-Data Available')) {
    console.log("No data available in the report.");
    // Add your assertion or further checks here
    expect(pdfText.text).toContain('No-Data Available');
} else {
    console.log("Data is available in the report.");
    // Verify the parameter values
    expect(pdfText.text).toContain(reportData.parameters);
    expect(pdfText.text).toContain(reportData.device);
    expect(pdfText.text).toContain(reportData.region);
    const startYearPattern = new RegExp(`\\b${reportData.startYear}\\b`);
    const endYearPattern = new RegExp(`\\b${reportData.endYear}\\b`);

    expect(startYearPattern.test(pdfText.text)).toBe(true);
    expect(endYearPattern.test(pdfText.text)).toBe(true);
    
    // Add additional checks for the specific data you expect
}

    });
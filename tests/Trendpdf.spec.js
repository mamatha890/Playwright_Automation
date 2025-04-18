const { test, expect, chromium  } = require('@playwright/test');
const fs = require('fs');
const Modules = require('../Common Utils/modules.js');
const pdfParse = require('pdf-parse');
const dashboard=require('../page/Dashboard.js');


const path = require('path');

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
test("Creating User", async ({ page }) => {
  
  
    
      
     
    const role = new Modules(page);
    await role.menu("Dashboard");
     const trend = new dashboard(page);
     await trend.devicerowclick();
     await trend.parameterclick();
     await trend.dropdownsclick();
     await trend.pdfdownloadVerfication();

//     const row = await page.locator('//tr[.//span[contains(text(),"Dev001")]]');

// // Click the last clickable element (the icon with class `fa fa-list-alt`)
// await row.locator('.fa.fa-list-alt').click();
// const temperatureRow = await page.locator('//tr[.//th[text()=" Temperature"]]');

// // Locate the last clickable element in the row (icon with class 'fa fa-line-chart')
// await temperatureRow.locator('.fa.fa-line-chart').click();
//const dialog=page.locator("//div[contains(@class, 'ui-dialog')]//span[text()='Dev001 : Temperature']");

    
    
//     await page.locator('//span[contains(text(),"Temperature")]//parent::div//parent::div//following-sibling::div//ng-select//div[text()="Duration"]//parent::div//following-sibling::span[@title="Clear all"]').click();
  
//     await page.locator('//span[contains(text(),"Temperature")]//parent::div//parent::div//following-sibling::div//ng-select//div[text()="Duration"]//following-sibling::div').click();
//     await page.locator('//span[contains(text(),"Last 10 Days")]').click();
//     await page.locator('//div[@class="col-md-6 col-sm-6 col-xs-6"]//button[@class="my-button" and text()[normalize-space()="GO"]]').click();




// await page.locator('.dropdownload').hover();
// await page.waitForTimeout(3000);
const downloadButton = page.locator(
    '//span[contains(text(), "Download PDF")]'
  );
  await downloadButton.waitFor({ state: 'visible' });


  // Trigger the download and handle the download event
  const [download] = await Promise.all([
    page.waitForEvent('download'), // Wait for the download event
    await downloadButton.click(), // Click the download button
  ]);

  // Retrieve the filename and save the file
  const fileName = await download.suggestedFilename();
  const downloadDir = path.resolve(__dirname, 'Trend PDF Download');

  // Ensure the download directory exists
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const filePath = path.join(downloadDir, fileName);
  await download.saveAs(filePath);

  console.log(`PDF downloaded and saved to: ${filePath}`);
  const pdfBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(pdfBuffer);

  console.log('PDF Contents:');
  console.log(pdfData.text); 
  const device="Device :Dev001"
  const temparature="Temperature"
  // Logs the text content of the PDF
  expect(pdfData.text).toContain(device);
  expect(pdfData.text).toContain(temparature);
   // Assertion to verify 'Device :Dev001'
});

const { test, expect, context } = require('@playwright/test');
const fs = require('fs');
const Modules = require('../Common Utils/modules.js');
const dashboard=require('../page/Dashboard.js');

const path = require('path');
const csvParser = require('csv-parser');
const { validateHeaderName } = require('http');

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
    const downloadDir = path.resolve(__dirname, 'Trend Download');
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }
     
    const role = new Modules(page);
    await role.menu("Dashboard");
    await trend.devicerowclick();
    await trend.parameterclick();
    await trend.dropdownsclick();


//     const row = await page.locator('//tr[.//span[contains(text(),"Dev001")]]');

// // Click the last clickable element (the icon with class `fa fa-list-alt`)
// await row.locator('.fa.fa-list-alt').click();
// const temperatureRow = await page.locator('//tr[.//th[text()=" Temperature"]]');

// // Locate the last clickable element in the row (icon with class 'fa fa-line-chart')
// await temperatureRow.locator('.fa.fa-line-chart').click();
// const dialog=page.locator("//div[contains(@class, 'ui-dialog')]//span[text()='Dev001 : Temperature']");

    
    
//     await page.locator('//span[contains(text(),"Temperature")]//parent::div//parent::div//following-sibling::div//ng-select//div[text()="Duration"]//parent::div//following-sibling::span[@title="Clear all"]').click();
  
//     await page.locator('//span[contains(text(),"Temperature")]//parent::div//parent::div//following-sibling::div//ng-select//div[text()="Duration"]//following-sibling::div').click();
//     await page.locator('//span[contains(text(),"Last 10 Days")]').click();
//     await page.locator('//div[@class="col-md-6 col-sm-6 col-xs-6"]//button[@class="my-button" and text()[normalize-space()="GO"]]').click();




// await page.locator('.dropdownload').hover();
await page.waitForTimeout(3000);


const downloadPromise = page.waitForEvent('download');
await page.locator('span:has-text("Download CSV")').click();

const download = await downloadPromise;

// Save the downloaded file in the specified directory
const fileName = await download.suggestedFilename();
const filePath = path.join(downloadDir, fileName);
await download.saveAs(filePath);

console.log(`Downloaded file saved at: ${filePath}`);

// Optional: Verify if the file exists
expect(fs.existsSync(filePath)).toBeTruthy();
const expectedColumns = ['deviceId', 'sensorTime', 'Temperature °C'];
    const csvData = [];
    const columnsVerified = new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("headers", (headers) => {
                // Normalize headers to remove extra quotes
                const normalizedHeaders = headers.map((header) =>
                    header.replace(/["']/g, "").trim().toLowerCase()
                  );
                  console.log("Normalized headers:", normalizedHeaders);
                  
                  // Normalize expected columns for comparison
                  const normalizedExpectedColumns = expectedColumns.map((col) =>
                    col.trim().toLowerCase()
                  );
                  
                  // Verify if expected columns are present in the file headers
                  const isValid = normalizedExpectedColumns.every((col) =>
                    normalizedHeaders.includes(col)
                  );
                  console.log("Valid:", isValid);
                  
                  if (!isValid) {
                    reject(
                      new Error(
                        `CSV file is missing expected columns: ${expectedColumns}. Found: ${headers}`
                      )
                    );
                }
            })
                
            .on("data", (row) => {
                csvData.push(row);
            })
            .on("end", () => {
                console.log("CSV parsed successfully:", csvData);
                resolve();
            });
    });
    
    // Await column verification
    await expect(columnsVerified).resolves.toBeUndefined();
    console.log("All expected columns are present in the CSV file.");
});
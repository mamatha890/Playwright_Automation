
const { test } = require('@playwright/test');

const fs = require('fs');

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




test("Repots testcase",async({page})=>{
    await page.locator('button[title="Reports"]').click();
    await page.waitForTimeout(3000);

await page.locator("//span[normalize-space()='Report']").click();
 const dialog= page.locator("//span[text()='Create Report']/ancestor::div[@class='ui-modal']");
 if(dialog.isVisible()){
    console.log("Visible");
 

 
   await page.locator("//span[text()='CSV']/preceding-sibling::input[@type='radio']").check();
   await page.waitForTimeout(3000);
   await page.locator("//ng-select[@placeholder='Region']//div[@role='combobox']//input").click();
   await page.locator("//div[@title='Ideabytes']").click();

   await page.locator('//ng-select[@placeholder="Model"][@bindlabel="modelName"][@name="_modelId"] //div[@role="combobox"]//input').click();
   await page.locator("//span[normalize-space()='WTH50']").click();
  
   await page.locator('//ng-select[@placeholder="Select"][@bindvalue="deviceId"][@name="deviceSelect"]//div[@role="combobox"]//input').click();
   await page.locator("//div[@title='Dev001']").click();
   
   await page.locator('//ng-select[@placeholder="Select"][@bindvalue="key"][@name="deviceSelect"]//div[@role="combobox"]//input').click();
   await page.locator('.ng-option-label:has-text("Temperature")').click();

  // Select the "Humidity" option
  await page.locator('.ng-option-label:has-text("Humidity")').click();
await  page.waitForTimeout(1000);
   await page.locator('//ng-select[@placeholder="Select"][@bindvalue="mathId"][@name="mathSelect"]//div[@role="combobox"]//input').click();
   await page.locator("//span[@class='ng-option-label ng-star-inserted']");
     await  page.waitForTimeout(1000);

     // Open the date picker
     // 1. Get today's date
const today = new Date();

// 2. Build start and end dates
const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 2); // 2nd of last month
const endDate = new Date(today.getFullYear(), today.getMonth(), 3); // 3rd of current month

// 3. Extract values for calendar selection
const startDay = startDate.getDate(); // 2
const startMonth = startDate.toLocaleString('default', { month: 'long' }); // Example: "March"
const startYear = startDate.getFullYear();
console.log(startDay);
console.log(startMonth);
console.log(startYear);

const endDay = endDate.getDate(); // 3
const endMonth = endDate.toLocaleString('default', { month: 'long' }); // Example: "April"
const endYear = endDate.getFullYear();
console.log(endDay);
console.log(endMonth);
console.log(endYear);

// 4. Open the date picker
await page.locator('#fromDate').click();

// 5. Navigate to last month for start date
// You might need to click a back arrow (adjust selector based on your UI)
await page.locator('//button[@class="owl-dt-control owl-dt-control-button owl-dt-control-arrow-button"][@aria-label="Previous month"]').click(); // go to previous month

// 6. Select the start date (2nd of last month)
await page.locator(`//td[@aria-label='${startMonth} ${startDay}, ${startYear}']`).click();

// 7. Navigate to this month for end date
await page.locator('//button[@class="owl-dt-control owl-dt-control-button owl-dt-control-arrow-button"][@aria-label="Next month"]').click(); // back to current month

// 8. Select the end date (3rd of this month)
await page.locator(`//td[@aria-label='${endMonth} ${endDay}, ${endYear}']`).click();
await page.waitForTimeout(1000);
await page.locator('input[name="reportTHr"]').fill('00');
await page.locator('input[name="reportFHr"]').fill('00');
//await page.locator('//ng-select[@name="interval"]//div[contains(text(),"Time Interval")]').click();
await page.locator('//input[@name="reportName"]').fill("mamatha@564");



     
    
   
  
 }
 
 



});
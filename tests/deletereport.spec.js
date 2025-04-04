
const { test } = require('@playwright/test');
import fs from 'fs';

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
   
test('Read Excel Data and Login', async ({ page }) => {
await page.waitForTimeout(1800);
  await page.locator('button[title="Reports"]').click();
  //await page.waitForTimeout(3000);
  await page.locator('//div[contains(text(),"On-Demand")]').click();
  //await page.waitForTimeout(10000);
  // Locate the first row in the table
// Locate the first row
//await page.locator('//i[@title="Dev-430"]/ancestor::td/following-sibling::td//i[@title="Download"]/following-sibling::i[@title="Remove"]/ancestor::div/preceding-sibling::button').click();
const rows = await page.locator('//i[@title="Dev-430"]/ancestor::tr').all();
console.log(rows);

// Iterate through each row and perform actions
for (const row of rows) {
  const Button= row.locator('//following-sibling::td//i[@title="Download"]/following-sibling::i[@title="Remove"]/ancestor::div/preceding-sibling::button');
  console.log(Button);
  const isVisible = await Button.isVisible();
  
  if (isVisible) {
    console.log('Clicking the Remove button for row with device: Dev-430');
    await Button.click();
    const dropdown = row.locator('div.dropdownload-content');
await dropdown.waitFor({ state: 'visible' });

// Log for debugging
console.log('Dropdown visible:', await dropdown.isVisible());

// Locate and click the "Remove" button
const removeButton = dropdown.locator('i.fa.fa-trash-o[title="Remove"]');
await removeButton.click();


    
    await page.waitForTimeout(1000); 
    // Optional: Add a delay between clicks
    // Define the locator using the given XPath
const dialogLocator = page.locator("(//div[@class='swal2-popup swal2-modal swal2-icon-warning swal2-show'])[1]");

// Wait for the element to become visible
await dialogLocator.waitFor({ state: 'visible' });
    await page.locator('button[class="swal2-cancel swal2-styled swal2-default-outline"]').click();

  } else {
    console.log('Remove button not visible for this row.');
  }
}


});




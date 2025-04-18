const { test, expect} = require('@playwright/test');
const Modules = require('../Common Utils/modules.js');
import fs from "fs";
const RulePage= require('../page/Alert verification.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');
const UserPage = require('../page/UserManagement.js')



///const { ExcelUtils } = require('../utils/excelUtils');
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
test("Alerts Veification",async({page})=>{
    const role=new Modules(page);
    await role.menu("Alarm Setup");
     await role.menu("Add Rule");
//     const dialog=page.locator("//span[text()='New Rule']/ancestor::div[@class='ui-modal']");
//        if(dialog){
//         console.log("visisble");
//         await page.locator("//span[text()='Location']//following-sibling::ng-select").click();
//         await page.locator('//div[@title="Ideabytes"]').click();
//         await page.locator('//*[@title=" Dev001"]').click();
//         const temperatureRow = await page.locator('div.row.ng-star-inserted');

//         // Get all text input fields within the temperature row
//         const inputFields = temperatureRow.locator('input[type="text"]');
        
//         // Fill in values for the three input boxes
//         await inputFields.nth(0).fill('20'); // First temperature value
//         await inputFields.nth(1).fill('40'); // Second temperature value
//         await inputFields.nth(2).fill('1'); 
//         await temperatureRow.locator('input[type="button"][value="Apply"]').first().click();
//         const humidityRow = await page.locator('div.row.ng-star-inserted:has-text("Humidity %")');

// // Get all text input fields within the humidity row
// const inputFields1 = humidityRow.locator('input[type="text"]');

// // Fill in values for the three input boxes
// await inputFields1.nth(0).fill('30'); // First humidity value
// await inputFields1.nth(1).fill('50'); // Second humidity value
// await inputFields1.nth(2).fill('1');

// await humidityRow.locator('input[type="button"][value="Apply"]').click();
        
    
//        }
//     });
const rulePage = new RulePage(page);

// Check if the dialog is visible
if (await rulePage.isDialogVisible()) {
    console.log("Dialog is visible");

    // Select Location
//     await rulePage.selectLocation();

//     // Set Temperature Values
//     const temperatureValues = ['20', '40', '1'];
//     await rulePage.setTemperature(temperatureValues);

//     // Set Humidity Values
//     const humidityValues = ['30', '50', '1'];
//     await rulePage.setHumidity(humidityValues);
// }
// });  
const ReadExcelValues = extractDataFromExcel(
    'C:/Users/mamatha.sangana/Videos/Playwright_Automation/Common Utils/data.xlsx',
    'Sheet1'
);
console.log('TestData: ', ReadExcelValues);

// Select Location and Device
const locationname = ReadExcelValues[0].Location;
await rulePage.selectLocation(locationname);
const devicename = ReadExcelValues[0].Device;
console.log(devicename)
await rulePage.selectDeviceName(devicename);
//await page.locator('//span[@title="Dev001"][@class="text-wrapper ng-star-inserted"]').click();

// Process all rows
for (let a = 0; a < ReadExcelValues.length; a++) {
    const rowData = ReadExcelValues[a];
    const parameterName = rowData.Parameter;
    const parameterValues = [rowData.Min, rowData.Max, rowData.Tolerance];

    await rulePage.MinMaxValue(parameterName, parameterValues);
    await rulePage.clickApply(parameterName);
}
}
});

test('API Test - POST Request', async ({ request }) => {
const { test, expect } = require('@playwright/test');

  const response = await request.post(process.env.CREATEAPI, {
    data: {
        
            "deviceId":"WTH_0000001",
            "tms":"1744606424",
            "temp": "37",
            "humidity":"46"
            
            
        },
         
        

    headers:{
        "Accept":"application/json",
       
    }
    
  });



  console.log(await response.json());
  expect(response.status()).toBe(200);
});

  test("Alerts Veification1",async({page})=>{

 locator.outlook1();
 const rulePage=new RulePage(page)
 rulePage.Alertverification();
  });
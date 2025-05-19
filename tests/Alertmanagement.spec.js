const { test, expect, request } = require('@playwright/test');
const Modules = require('../Common Utils/modules.js');
const UserPage = require('../page/UserManagementmodule.js');
const Loginpage = require('../page/Loginpage.js');
const RulePage = require('../page/Alert verification.js');
const Alertmanagent = require('../page/Alertmanagement.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');
const xlsx = require('xlsx');


const UserApi = require('../page/Api.js');
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




test('Alert Management', async ({ page, request }) => {
    const url = process.env.BASE_URL;
    const username = process.env.USERID;
    const password = process.env.PASSWORD;
    const login = new Loginpage(page);
    login.performLogin(url, username, password);


    const user = new Modules(page);
    user.menu("User Management");
    const check = new UserPage(page, expect);
    check.EnterSearch();
    await page.waitForTimeout(3000);
    await page.locator('//mat-icon[contains(text(),"edit")]').click({ force: true });
    const checkboxes = ['warn', 'critical', 'good'];
    for (const checkbox of checkboxes) {
        await check.Verifycheckboxces(checkbox);
    }
    await page.locator('//div[@class="ui-controlbar"]').click();


    await page.locator('//a[@id="userDropdown"][@role="button"][@data-bs-toggle="dropdown"]/div/img').click();
    await page.locator('//a[contains(text(),"Logout")]').click();
    await page.waitForTimeout(3000);
});




testdata.forEach((code) => {
    

  if (code.TestType === "verify alert messages in mail") {
    test(`${code["TestCaseNumber"]} - Positive Login Test`, async ({ page,request }) => {
      try {
    const url = process.env.BASE_URL;
    const username = process.env.USERNAME1;
    const password = process.env.PASSWORD;
    const login = new Loginpage(page);
    login.performLogin(url, username, password);
    await page.waitForTimeout(3000);
    const user = new Modules(page);
    await user.menu("Dashboard");

    const AlertManagement = new Alertmanagent(page, expect);
    AlertManagement.reportcount();
    await user.menu("Alerts Management");
   await AlertManagement.clicksettings();


    const emailCheckbox = page.locator('div.mat-sort-header-content:has(span:text("Email")) input[type="checkbox"]');

    // Check if the checkbox is checked
    const isChecked = await emailCheckbox.isChecked();

    if (!isChecked) {
        console.log("Email checkbox is not enabled. Enabling it now...");
        await emailCheckbox.check(); // Click to enable the checkbox
    } else {
        console.log("Email checkbox is already enabled.");
    }



    const notoficationCheckbox = page.locator('div.mat-sort-header-content:has(span:text(" Notification ")) input[type="checkbox"]');

    // Check if the checkbox is checked
    const isCheckednotification = await notoficationCheckbox.isChecked();

    if (!isCheckednotification) {
        console.log("notification checkbox is not enabled. Enabling it now...");
        await notoficationCheckbox.check(); // Click to enable the checkbox
    } else {
        console.log("notification checkbox is already enabled.");
    }
    await page.locator("//span[contains(text(),'Alert Settings')]//parent::div//following-sibling::div//span").click();

    await user.menu("Dashboard");




    const selectors = {
        reporting: 'div.statusTile:has(span:has-text("Reporting")) span:nth-of-type(2)',
        good: 'div.statusTile:has(span:has-text("Good")) span:nth-of-type(2)',
        warning: 'div.statusTile:has(span:has-text("Warning")) span:nth-of-type(2)',
        critical: 'div.statusTile:has(span:has-text("Critical")) span:nth-of-type(2)'
    };
    // Extract and log the values for each field
    const reportingValue = await page.locator(selectors.reporting).textContent();
    console.log('Reporting:', reportingValue);

    const goodValue = await page.locator(selectors.good).textContent();
    console.log('Good:', goodValue);

    const warningValue = await page.locator(selectors.warning).textContent();
    console.log('Warning:', warningValue);

    const criticalValue = await page.locator(selectors.critical).textContent();
    console.log('Critical:', criticalValue);





    await page.waitForTimeout(3000);

    user.menu("Alarm Setup");
    await page.locator('//input[@placeholder="Search..."]').fill("Dev001");
    const results = page.locator('//table//tr'); // Adjust selector as needed
    const rowCount = await results.count(); // Assign row count here

    if (rowCount > 0) {
        console.log(`Search returned ${rowCount} rows of data`);
        console.log("data is available");
        const mydata = extractDataFromExcel("Common Utils/data.xlsx", "postmandata");


        const data = mydata[0]; // Use 'mydata', not 'Excel'
const userApi = new UserApi(request, expect);
        const response = await userApi.createUser(data);
        const user1 = new Modules(page);
        // user1.menu("Alerts Management");
        // await page.waitForTimeout(5000);
        // await page.reload();
        // await page.reload();
        // await page.waitForTimeout(5000);
        // await page.reload();
        await page.waitForTimeout(5000);
        await page.reload();
        await page.waitForTimeout(5000);

        user1.menu("Dashboard");
        //await page.locator('//span[@title="Sensor Settings"]').click();

        await page.locator('//span[@title="Sensor Settings"]').click();

        const temperatureRow = page.locator('tr.ng-star-inserted', { hasText: 'Temperature' });
        // Locate the checkbox in the 'Temperature' row
        const temperatureCheckbox = temperatureRow.locator('input[type="checkbox"]');
        // Check if the checkbox is checked
        const isTemperatureChecked = await temperatureCheckbox.isChecked();

        // Assert or check the checkbox if it's not already checked
        if (!isTemperatureChecked) {
            console.log('Temperature checkbox is not checked. Checking it now...');
            await temperatureCheckbox.click();

        } else {
            console.log('Temperature checkbox is already checked.');
            const temperatureElement = page.locator("//div[normalize-space()='Temperature']");

            // Assert that the "Temperature" element is visible
            await expect(temperatureElement).toBeVisible({
                timeout: 5000 // Optional: Wait up to 5 seconds for the element to appear
            });

            console.log('The "Temperature" element is visible.');

        }
        const humidityRow = page.locator('tr.ng-star-inserted', { hasText: 'Humidity' });
        const humidityCheckbox = humidityRow.locator('input[type="checkbox"]');
        const isHumidityChecked = await humidityCheckbox.isChecked();
        if (!isHumidityChecked) {
            console.log('Humidity checkbox is not checked. Checking it now...');
            await humidityCheckbox.click();
            await page.waitForTimeout(1000); // Optional: Add a small wait for any updates after clicking
        } else {
            console.log('Humidity checkbox is already checked.');
            const temperatureElement = page.locator("//div[normalize-space()='Humidity']");

            // Assert that the "Temperature" element is visible
            await expect(temperatureElement).toBeVisible({
                timeout: 5000 // Optional: Wait up to 5 seconds for the element to appear
            });
            await page.locator("//span[contains(text(),'Sensors in Live')]//parent::div//following-sibling::div//span").click();

            const updatedWarningValue = await page.locator(selectors.warning).textContent();
            console.log('Updated Warning:', updatedWarningValue);

            const updatedCriticalValue = await page.locator(selectors.critical).textContent();
            console.log('Updated Critical:', updatedCriticalValue);

            // Check if warning value incremented
            if (parseInt(updatedWarningValue) > parseInt(warningValue)) {
               
                console.log('Warning value incremented, clicking checkbox...');
                await page.locator('//span[contains(text(),"Warning")]').click();
                const Device = "Dev001";
                const deviceLocator = page.locator('//span[contains(text(),"Dev001")]');
 
                const actualDeviceName = await deviceLocator.textContent();
                console.log(actualDeviceName);
                const temparature = page.locator('//td//span[contains(@title, "Dev001")]/ancestor::td/following-sibling::td[1]//table//td[2]//span');
                const Humidity = page.locator('//td//span[contains(@title, "Dev001")]/ancestor::td[2]/following-sibling::td[2]/table/tr//span');
 
 
                const actualTemparature = await temparature.textContent();
                const abc = parseFloat(actualTemparature.trim()).toString();
 
                console.log("Extracted Temperature:", abc);
 
 
                const actualHumidity = await Humidity.textContent();
                const abcd = parseFloat(actualHumidity.trim()).toString();
 
                console.log(actualHumidity);
                // Verify visibility
                await expect(actualDeviceName).toContain(Device);
                await expect(abc).toBe(temp.toString());
                await expect(abcd).toBe(hum.toString());
                await page.waitForTimeout(3000);
                const user = new Modules(page);
                await user.menu("Alerts Management");
                await page.waitForTimeout(3000);
 
                await page.locator('//span[contains(text(),"Live Alerts")]/parent::button').click();
                const location = page.locator('//td[@title="Ideabytes"]').first();
                const Locationname = await location.textContent();
                const LocationField = await Locationname.trim();
                console.log("Locationname:", LocationField);
                await expect(data.Location).toContain(LocationField);
                const Devicename = page.locator('//td[@title="Dev001"]').first();
                const DevicenameField = await Devicename.textContent();
                const DeviceName = await DevicenameField.trim();
                console.log("DeviceName:", DeviceName);
                await expect(data.Device).toContain(DeviceName);
 
                const Alert = page.locator('//td[@title="Warning"]').first();
                const AlertField = await Alert.textContent();
                const AlertName = await AlertField.trim();
                console.log("AlertName:", AlertName);
                await expect(data.Alert).toContain(AlertName);
                const locator = new UserPage(page);
                locator.outlook();
                await page.waitForTimeout(5000);
                locator.outlookVeification();
                await page.waitForTimeout(6000);
                const rulePage = new RulePage(page, expect);
                rulePage.Alertclick();
                await page.waitForTimeout(4000);
                rulePage.AlertVerification();
            }

            // Check if critical value incremented
            if (parseInt(updatedCriticalValue) > parseInt(criticalValue)) {
                console.log('Critical value incremented, clicking checkbox...');
                await page.locator('//span[contains(text(),"Critical")]').click({});
                const Device = "Dev001";
                const deviceLocator = page.locator('//span[contains(text(),"Dev001")]');

                const actualDeviceName = await deviceLocator.textContent();
                console.log(actualDeviceName);
                const temparature = page.locator('//td//span[contains(@title, "Dev001")]/ancestor::td/following-sibling::td[1]//table//td[2]//span');
                const Humidity = page.locator('//td//span[contains(@title, "Dev001")]/ancestor::td[2]/following-sibling::td[2]/table/tr//span');


                const actualTemparature = await temparature.textContent();
                const abc = parseFloat(actualTemparature.trim()).toString();

                console.log("Extracted Temperature:", abc);


                const actualHumidity = await Humidity.textContent();
                const abcd = parseFloat(actualHumidity.trim()).toString();

                console.log(actualHumidity);
                // Verify visibility
                await expect(actualDeviceName).toContain(Device);
                await expect(abc).toBe(temp.toString());
                await expect(abcd).toBe(hum.toString());
                await page.waitForTimeout(3000);

                const user = new Modules(page);
                await user.menu("Alerts Management");
                await page.waitForTimeout(3000);

                await page.locator('//span[contains(text(),"Live Alerts")]/parent::button').click();
                const location = page.locator('//td[@title="Ideabytes"]').first();
                const Locationname = await location.textContent();
                const LocationField = await Locationname.trim();
                console.log("Locationname:", LocationField);
                await expect(data.Location).toContain(LocationField);
                const Devicename = page.locator('//td[@title="Dev001"]').first();
                const DevicenameField = await location.textContent();
                const DeviceName = await DevicenameField.trim();
                console.log("DeviceName:", DeviceName);
                await expect(data.Location).toContain(DeviceName);

                const Alert = page.locator('//td[@title="Critical"]').first();
                const AlertField = await Alert.textContent();
                const AlertName = await AlertField.trim();
                console.log("AlertName:", AlertName);
                await expect(data.Alert).toContain(AlertName);
                const locator = new UserPage(page);
                locator.outlook();
                await page.waitForTimeout(5000);
                locator.outlookVeification();
                await page.waitForTimeout(6000);
                const rulePage = new RulePage(page, expect);
                rulePage.Alertclick();
                await page.waitForTimeout(4000);
                rulePage.CriticalAlertverification();

            }

        }

    } else {
        console.log('No data found for the search term "dev001"');
        throw new Error('Search returned no data');
    }

    code.Status="Pass"
}
    catch(err){
        console.error(`Test case ${code["TestCaseNumber"]} failed: ${err.message}`);
    code.Status = "Fail"; // Mark as failed
    throw err;


    }finally{
        updateExcelStatus(filePath, sheetName, testdata)

    }
});
  }
});
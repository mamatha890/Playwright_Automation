const fs = require("fs");
const path = require('path');
const pdfParse = require('pdf-parse');
const Modules = require('../Common Utils/modules.js');
const UserPage = require('../page/UserManagement.js');
const Loginpage = require('../page/Loginpage.js');
const RulePage = require('../page/Alert verification.js');
const xlsx = require('xlsx');

class Alertmanagent {
    constructor(page, expect) {
        this.page = page;
        this.expect = expect;
        this.searchMessage = page.locator('//td[contains(text(), "No data found")]');
        this.downloadHoverButton = page.locator('//i[@class="fa fa-download"]/parent::button');
        this.downloadButton = page.locator('//span[normalize-space()="Alert Summary CSV"]');
        this.hover = page.locator('//i[@class="fa fa-download"]/parent::button');
        this.button = page.locator('//button[@title="Fetch"]');
        this.settings= page.locator('//i[@class="fa fa-cog fa-2x"]');
        this.crossbutton=page.locator("//span[contains(text(),'Alert Settings')]//parent::div//following-sibling::div//span");
        this.selectors = {
            reporting: 'div.statusTile:has(span:has-text("Reporting")) span:nth-of-type(2)',
            good: 'div.statusTile:has(span:has-text("Good")) span:nth-of-type(2)',
            warning: 'div.statusTile:has(span:has-text("Warning")) span:nth-of-type(2)',
            critical: 'div.statusTile:has(span:has-text("Critical")) span:nth-of-type(2)',
          };
          this.dashboardsetting= page.locator('//span[@title="Sensor Settings"]')

    



    }
    async getAndLogAllValues() {
        const values = {};
        console.log('Logging all status values:');
        for (const [field, selector] of Object.entries(this.selectors)) {
          const value = await this.page.locator(selector).textContent();
          console.log(`${field.charAt(0).toUpperCase() + field.slice(1)}:`, value.trim());
          values[field] = value.trim(); // Store the value in the object after trimming whitespace
        }
        return values;
      }
    
    async AlertmanagemtFileds(name, Devicemodel, title, sensor, parameter, Status, period) {
        await this.page.locator('//div[contains(text(),"Location")]/parent::div/parent::div/parent::ng-select[@bindlabel="regionName"]').click();
        await this.page.locator(`//div[@title="${name}"]`).click();


        await this.page.locator('//div[contains(text(),"Device Model")]').click({ force: true });
        await this.page.locator(`//span[text()="${Devicemodel}"]`).click();

        await this.page.locator('//div[contains(text(),"Device")]/parent::div/parent::div/parent::ng-select[@bindlabel="deviceName"]').click({ force: true });
        await this.page.locator(`//div[@title="${title}"]`).click();
        await this.page.locator('//div[contains(text(),"Sensor")]/parent::div/parent::div/parent::ng-select').click({ force: true });
        await this.page.locator(`//span[text()="${sensor}"]`).click();
        await this.page.locator(`//span[text()="${parameter}"]`).click();

        await this.page.locator('//div[contains(text(),"Status")]').click({ force: true });
        await this.page.locator(`//span[text()="${Status}"]`).click();

        await this.page.locator('//div[contains(text(),"Period")]/parent::div/parent::div/parent::ng-select[@name="dateRange"]').click({ force: true });
        await this.page.locator(`//span[text()="${period}"]`).click();

    }
    async fetchbutton() {
        await this.button.click();
    }

    async CSVverification(expectedColumns) {
        const searchMessage = this.searchMessage;
        if (await searchMessage.isVisible()) {
            console.log("no data visisble");
        }
        else {
            await this.downloadHoverButton.hover();



            const downloadButton = this.downloadButton;
            await downloadButton.waitFor({ state: 'visible' });

            const [download] = await Promise.all([
                this.page.waitForEvent('download'), // Wait for the download event
                await downloadButton.click(), // Click the download button
            ]);

            // Retrieve the filename and save the file
            const fileName = await download.suggestedFilename();
            const downloadDir = path.resolve(__dirname, 'Trend');

            // Ensure the download directory exists
            if (!fs.existsSync(downloadDir)) {
                fs.mkdirSync(downloadDir, { recursive: true });
            }

            // Save the downloaded file in the specified directory
            const filePath = path.join(downloadDir, fileName);
            await download.saveAs(filePath);

            console.log(`Downloaded file saved at: ${filePath}`);

            // Read the CSV file content
            const csvContent = fs.readFileSync(filePath, 'utf-8');
            console.log("CSV File Content: ", csvContent);

            // Optional: Verify if the file exists
            await this.expect(fs.existsSync(filePath)).toBeTruthy();



            // Verify if the expected columns' values are present in the CSV content
            for (const [column, expectedValue] of Object.entries(expectedColumns)) {
                if (csvContent.includes(expectedValue)) {
                    console.log(`The value for ${column} ("${expectedValue}") is found in the CSV.`);
                }
            }
        }


    }
    async snapshortverification(data) {
        const searchMessage = await this.searchMessage;
        if (await searchMessage.isVisible()) {
            console.log("no data visisble");
        }

        else {
            await this.downloadHoverButton.hover();

            await this.page.waitForSelector('//span[normalize-space()="Alert Snapshot"]', { state: 'visible' });
            const downloadButton1 = this.page.locator('//span[normalize-space()="Alert Snapshot"]')




            // Trigger the download and handle the download event
            const [download] = await Promise.all([
                this.page.waitForEvent('download'), // Wait for the download event
                await downloadButton1.click(), // Click the download button
            ]);

            // Retrieve the filename and save the file
            const fileName = await download.suggestedFilename();
            const downloadDir = path.resolve(__dirname, 'AlertPdf');
            console.log(downloadDir);

            // Ensure the download directory exists
            if (!fs.existsSync(downloadDir)) {
                fs.mkdirSync(downloadDir, { recursive: true });
            }

            const filePath = path.join(downloadDir, fileName);
            await download.saveAs(filePath);


            console.log(`PDF downloaded and saved to: ${filePath}`);

            // Read the PDF file into a buffer
            const pdfBuffer = fs.readFileSync(filePath);


            const pdfData = await pdfParse(pdfBuffer);
            this.expect(pdfData.text).toContain(data.Location);
            this.expect(pdfData.text).toContain(data.Sensor);
            this.expect(pdfData.text).toContain(data.Parameter);



        }
    }
    async time(startDate, endDate) {
        await this.page.locator('//input[@placeholder="Date Range"]').click();
        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleString('default', { month: 'long' });
        const startYear = startDate.getFullYear();

        // Extract values for endDate
        const endDay = endDate.getDate();
        const endMonth = endDate.toLocaleString('default', { month: 'long' });
        const endYear = endDate.getFullYear();
        await this.page.locator(`//td[@aria-label='${startMonth} ${startDay}, ${startYear}']`).click();

        // Select end date
        await this.page.locator(`//td[@aria-label='${endMonth} ${endDay}, ${endYear}']`).click();
    }
    async min() {
        await this.page.locator('input[name="reportTHr"]').fill('00');
        await this.page.locator('input[name="reportFHr"]').fill('00');
    }
    async clearfield() {
        await this.page.locator('input[name="reportTHr"]').clear();
        await this.page.locator('input[name="reportFHr"]').clear();


    }
    async errorverification() {
        const timerangemessage = this.page.locator('//div[@aria-label="Please provide valid Time Range"]');
        await this.expect(timerangemessage).toBeVisible();
    }
    async headerverification() {
        await this.expect(this.page.locator('th.mat-column-Location')).toContainText('Location');
        await this.expect(this.page.locator('th.mat-column-DeviceName')).toContainText('Device');
        await this.expect(this.page.locator('th.mat-column-Sensor')).toContainText('Sensor');
        await this.expect(this.page.locator('//div[contains(text(),"Alert ")]')).toContainText('Alert');
    }
    async verifinghistorydata(data) {
        await this.page.waitForSelector('//table[@class="mat-mdc-table mdc-data-table__table cdk-table mat-sort"]/parent::div[@class="hideScroll"]//tr');

        // Locate all rows inside the table
        const rows = this.page.locator('//table[@class="mat-mdc-table mdc-data-table__table cdk-table mat-sort"]/parent::div[@class="hideScroll"]//tr', { hasText: '' });

        // Get the row count
        const rowCount = await rows.count();
        if (rowCount > 0) {
            console.log("visisble");
            const Location = this.page.locator('//td[@title="Ideabytes"]').first();
            const locationText = await Location.textContent();
            console.log(`Location text: ${locationText}`);
            await this.expect(locationText.trim()).toBe(data.Location);
            const device = this.page.locator('//td[@title="Dev001"]').first();
            const devicename = await device.textContent();
            console.log(`Device text: ${devicename}`);
            await this.expect(devicename.trim()).toBe(data.Device);
            const parameterfield = this.page.locator('//td[@title="Humidity"]').first();
            const parameter = await parameterfield.textContent();
            console.log(`Device text: ${parameter}`);
            await this.expect(parameter.trim()).toBe(data.Parameter);
            const humidityfield = this.page.locator('//td[@title="Temperature"]').first();
            const Humidity = await humidityfield.textContent();
            console.log(`Device text: ${Humidity}`);
            await this.expect(Humidity.trim()).toBe(data.Sensor);
            const Critical = this.page.locator('//td[@title="Critical"]').first();
            const CricalAlert = await Critical.textContent();
            console.log(`Device text: ${CricalAlert}`);
            await this.expect(CricalAlert.trim()).toBe(data.Status);
        }
        else {
            const verifydetails = this.page('//td[contains(text(),"No data found")]');
            const textContent = await verifydetails.textContent();
            await expect(textContent.trim()).toBe("No data found");

        }


    }
    async reportcount(){
        const notReportingSection = await this.page.locator('//div[@seriesname="Not-Reporting"]').click();
       
        const notReportingTextSelector = 'text.apexcharts-pie-label'; // Adjust selector if necessary
            const textContent = await this.page.locator(notReportingTextSelector).textContent();
        
            // Parse the value to integer
            const notReportingCount = parseInt(textContent, 10);
        
            await console.log('Not-Reporting Count (from text):', notReportingCount);
        
        
            if (notReportingCount > 1) {
                const devSelector = this.page.locator('//span[contains(text(),"Dev001")]');
                await this.expect(devSelector).toBeVisible();
            }
            else {
                const reportingSection = this.page.locator('//div[@seriesname="Reporting"]');
                await reportingSection.click();
               
        
                const reportingTextSelector = 'text.apexcharts-pie-label';
                const reportingText = await this.page.locator(reportingTextSelector).textContent();
                const reportingCount = parseInt(reportingText || '0', 10); // Ensure default to 0 if null
        
                console.log('Reporting Count (from text):', reportingCount);
            }
        }
            async clicksettings(){
                await  this.settings.click();



            }
            async clickcheckboxes(){
                const emailCheckbox = this.page.locator('div.mat-sort-header-content:has(span:text("Email")) input[type="checkbox"]');

    // Check if the checkbox is checked
    const isChecked = await emailCheckbox.isChecked();

    if (!isChecked) {
        console.log("Email checkbox is not enabled. Enabling it now...");
        await emailCheckbox.check(); // Click to enable the checkbox
    } else {
        console.log("Email checkbox is already enabled.");
    }


    const notoficationCheckbox = this.page.locator('div.mat-sort-header-content:has(span:text(" Notification ")) input[type="checkbox"]');

    // Check if the checkbox is checked
    const isCheckednotification = await notoficationCheckbox.isChecked();

    if (!isCheckednotification) {
        console.log("notofication checkbox is not enabled. Enabling it now...");
        await notoficationCheckbox.check(); // Click to enable the checkbox
    
 
    }

     else {
        console.log("Email checkbox is already enabled.");
    }
    await this.crossbutton.click();
            }
           
            async dashboardsettings(){
                  await this.page.locator('//span[@title="Sensor Settings"]').click();
                
                        const temperatureRow = this.page.locator('tr.ng-star-inserted', { hasText: 'Temperature' });
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
                            const temperatureElement =this.page.locator("//div[normalize-space()='Temperature']");
                
                            // Assert that the "Temperature" element is visible
                            await this.expect(temperatureElement).toBeVisible({
                                timeout: 5000 // Optional: Wait up to 5 seconds for the element to appear
                            });
                
                            console.log('The "Temperature" element is visible.');
                
                        }
                        const humidityRow = this.page.locator('tr.ng-star-inserted', { hasText: 'Humidity' });
                        const humidityCheckbox = humidityRow.locator('input[type="checkbox"]');
                        const isHumidityChecked = await humidityCheckbox.isChecked();
                        if (!isHumidityChecked) {
                            console.log('Humidity checkbox is not checked. Checking it now...');
                            await humidityCheckbox.click();
                            await this.page.waitForTimeout(1000); // Optional: Add a small wait for any updates after clicking
                        } else {
                            console.log('Humidity checkbox is already checked.');
                            const temperatureElement = this.page.locator("//div[normalize-space()='Humidity']");
                
                            // Assert that the "Temperature" element is visible
                            await this.expect(temperatureElement).toBeVisible({
                                timeout: 5000 // Optional: Wait up to 5 seconds for the element to appear
                            });
                        }
            }
            async updatedAlertCount(){
                const updatedWarningValue = await page.locator(selectors.warning).textContent();
                console.log('Updated Warning:', updatedWarningValue);
    
                const updatedCriticalValue = await page.locator(selectors.critical).textContent();
                console.log('Updated Critical:', updatedCriticalValue);
    
            }
            async AlertCount() {
                const { reporting, good, warning, critical } = this.selectors;
        
                const reportingValue = await this.page.locator(reporting).textContent();
                const goodValue = await this.page.locator(good).textContent();
                const warningValue = await this.page.locator(warning).textContent();
                const criticalValue = await this.page.locator(critical).textContent();
        
                console.log('Reporting:', reportingValue);
                console.log('Good:', goodValue);
                console.log('Warning:', warningValue);
                console.log('Critical:', criticalValue);
        
                return {
                    reporting: reportingValue,
                    good: goodValue,
                    warning: warningValue,
                    critical: criticalValue,
                };
            }
            async updatedAlertCount() {
                const { warning, critical } = this.selectors;
        
                const updatedWarningValue = await this.page.locator(warning).textContent();
                const updatedCriticalValue = await this.page.locator(critical).textContent();
        
                console.log('Updated Warning:', updatedWarningValue);
                console.log('Updated Critical:', updatedCriticalValue);
        
                return {
                    warning: updatedWarningValue,
                    critical: updatedCriticalValue,
                };
            }
            async   asynccheckAlertIncrease() {
                if (parseInt(this.updatedWarningValue) > parseInt(this.warningValue)) {
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
                if (parseInt(this.updatedCriticalValue) > parseInt(this.criticalValue)) {
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
                    const DevicenameField = await Devicename.textContent();
                    const DeviceName = await DevicenameField.trim();
                    console.log("DeviceName:", DeviceName);
                    await expect(data.Device).toContain(DeviceName);
    
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
                    rulePage.AlertVerification();
            
    
                
            
    
            
    
        } else {
            console.log('No data found for the search term "dev001"');
            throw new Error('Search returned no data');
        }
    }
    async  settingspage(){
        const emailCheckbox =await this.page.locator('div.mat-sort-header-content:has(span:text("Email")) input[type="checkbox"]');

    // Check the current state of the Email checkbox
    const isChecked = await emailCheckbox.isChecked();
    
    if ( isChecked) {
        console.log("Email checkbox is enabled. Disabling it now...");
        await emailCheckbox.uncheck(); // Uncheck if it is already checked
    } else {
        console.log("Email checkbox is already disabled.");
    }
    
    
    // Locator for the Notification checkbox
    const notificationCheckbox = this.page.locator('div.mat-sort-header-content:has(span:text("Notification")) input[type="checkbox"]');
    
    // Check the current state of the Notification checkbox
    const isCheckedNotification = await notificationCheckbox.isChecked();
    
    if (isCheckedNotification) {
        console.log("Notification checkbox is enabled. Disabling it now...");
        await notificationCheckbox.uncheck(); // Uncheck if it is already checked
    } else {
        console.log("Notification checkbox is already disabled.");
    }
    await this.page.locator("//span[contains(text(),'Alert Settings')]//parent::div//following-sibling::div//span").click();
    }
    async DashboardSettings(){

    await this.dashboardsetting.click();
    }
    
    async Dashbordcheckboxes(){
        const temperatureRow = this.page.locator('tr.ng-star-inserted', { hasText: 'Temperature' });
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
                    const temperatureElement = this.page.locator("//div[normalize-space()='Temperature']");
        
                    // Assert that the "Temperature" element is visible
                    await this.expect(temperatureElement).toBeVisible({
                        timeout: 5000 // Optional: Wait up to 5 seconds for the element to appear
                    });
        
                    console.log('The "Temperature" element is visible.');
        
                }
                const humidityRow = this.page.locator('tr.ng-star-inserted', { hasText: 'Humidity' });
                const humidityCheckbox = humidityRow.locator('input[type="checkbox"]');
                const isHumidityChecked = await humidityCheckbox.isChecked();
                if (!isHumidityChecked) {
                    console.log('Humidity checkbox is not checked. Checking it now...');
                    await humidityCheckbox.click();
                   // Optional: Add a small wait for any updates after clicking
                } else {
                    console.log('Humidity checkbox is already checked.');
                    const temperatureElement = this.page.locator("//div[normalize-space()='Humidity']");
        
                    // Assert that the "Temperature" element is visible
                    await this.expect(temperatureElement).toBeVisible({
                        timeout: 5000 // Optional: Wait up to 5 seconds for the element to appear
                    });
                }
    }
    async updatedvalues(){
        const updatedWarningValue = await this.page.locator(this.selectors.warning).textContent();
        console.log('Updated Warning:', updatedWarningValue);

        const updatedCriticalValue = await this.page.locator(this.selectors.critical).textContent();
        console.log('Updated Critical:', updatedCriticalValue);
    }
    async verifydata(){
         const values= this.page.locator('//span[text()="Alert - Dev001 | Temperature | Warning"]/parent::div/following-sibling::span').first();
        const data = await values.textContent();
        console.log("time from alert:", data);
        
        // Parse the extracted time as a timestamp
        const givenTime = parseInt(data, 10);
        
        // Function to check if the current time is within the desired range
        async function isTimeWithinRange() {
            const now = new Date();
            const incrementedTime = new Date(now.getTime() + 60000); 
            const currentTime = now.getTime(); // Current time in milliseconds
            console.log("Current timestamp:", currentTime);
        
            // Format the extracted time to remove leading zeros from hours
            const timestampDate = new Date(givenTime  );
            const timestampFormatted = timestampDate.toLocaleTimeString('en-US', {
                hour: 'numeric', // Removes leading zero from hours
                minute: '2-digit',
            });
        
            // Format the current time similarly
            const currentFormattedTime = incrementedTime.toLocaleTimeString('en-US', {
                hour: 'numeric', // Removes leading zero from hours
                minute: '2-digit',
            });
        
            console.log("Formatted timestamp time:", timestampFormatted);
            console.log("Formatted current time:", currentFormattedTime);
        
            if (data ==currentFormattedTime) {
                console.log("data is available");
                await this.page.locator('//span[starts-with(text(), "Alert - Dev001 | Temperature |")]//parent::div[@class="IjzWp XG5Jd gy2aJ Ejrkd lME98"]').first().click();
                const sensorValue = await page.locator('//td[normalize-space()="Temperature"]').textContent();
                console.log('Sensor Value:', sensorValue);
             
                // Verify that Sensor is "Temperature"
                await expect(sensorValue).toBe('Temperature');
                const statusValue = await this.page.locator('//td[normalize-space()="Critical"]').textContent();
                console.log('Status Value:', statusValue);
             
                await expect(statusValue).toBe('Critical');
                
                await this.page.locator('//span[starts-with(text(), "Alert - Dev001 | Humidity |")]').first().click();
                
               const HumidityValue = await this.page.locator('//td[normalize-space()="Humidity"]').textContent();
               console.log('Sensor Value:', HumidityValue);
             
               await this.expect(HumidityValue).toBe('Humidity');
               const HimiditystatusValue = await page.locator('//td[normalize-space()="Critical"]').textContent();
               console.log('Status Value:', HimiditystatusValue);
         
               await this.expect(statusValue).toBe('Critical');
             }
             
                
                // Add your action code here
             else {
                console.log("Times do not match. No action performed.");
            }
        }
        
        isTimeWithinRange();
    }
    async verifydashboardcheckboxes(){
        await this.page.locator('//span[@title="Sensor Settings"]').click();
        
                const temperatureRow = this.page.locator('tr.ng-star-inserted', { hasText: 'Temperature' });
                
                const temperatureCheckbox = temperatureRow.locator('input[type="checkbox"]');
               
                const isTemperatureChecked = await temperatureCheckbox.isChecked();
        
                // Assert or check the checkbox if it's not already checked
                if (!isTemperatureChecked) {
                    console.log('Temperature checkbox is not checked. Checking it now...');
                    await temperatureCheckbox.click();
        
                } else {
                    console.log('Temperature checkbox is already checked.');
                    const temperatureElement = this.page.locator("//div[normalize-space()='Temperature']");
        
                    // Assert that the "Temperature" element is visible
                    await this.expect(temperatureElement).toBeVisible({
                        timeout: 5000 // Optional: Wait up to 5 seconds for the element to appear
                    });
        
                    console.log('The "Temperature" element is visible.');
        
                }
                const humidityRow = this.page.locator('tr.ng-star-inserted', { hasText: 'Humidity' });
                const humidityCheckbox = humidityRow.locator('input[type="checkbox"]');
                const isHumidityChecked = await humidityCheckbox.isChecked();
                if (!isHumidityChecked) {
                    console.log('Humidity checkbox is not checked. Checking it now...');
                    await humidityCheckbox.click();
                  // Optional: Add a small wait for any updates after clicking
                } else {
                    console.log('Humidity checkbox is already checked.');
                    const temperatureElement = this.page.locator("//div[normalize-space()='Humidity']");
        
                    // Assert that the "Temperature" element is visible
                    await this.expect(temperatureElement).toBeVisible({
                        timeout: 5000 // Optional: Wait up to 5 seconds for the element to appear
                    });
                }
    }
    async search(){
        await this.page.locator('//input[@placeholder="Search..."]').fill("Dev001");
  
    }
}

    
        
 
    




module.exports = Alertmanagent
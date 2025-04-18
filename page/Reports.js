const { expect } = require('@playwright/test');

class ReportsPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.reportsButton = 'button[title="Reports"]';
    this.reportTab = "//span[normalize-space()='Report']";
    this.dialog = "//span[text()='Create Report']/ancestor::div[@class='ui-modal']";
    this.csvRadioButton = "//span[text()='CSV']/preceding-sibling::input[@type='radio']";
    this.regionDropdown = "//ng-select[@placeholder='Region']//div[@role='combobox']//input";
    this.modelDropdown = '//ng-select[@placeholder="Model"][@bindlabel="modelName"][@name="_modelId"]//div[@role="combobox"]//input';
    this.deviceDropdown = '//ng-select[@placeholder="Select"][@bindvalue="deviceId"][@name="deviceSelect"]//div[@role="combobox"]//input';
    this.parametersDropdown = '//ng-select[@placeholder="Select"][@bindvalue="key"][@name="deviceSelect"]//div[@role="combobox"]//input';
    this.mathDropdown = '//ng-select[@placeholder="Select"][@bindvalue="mathId"][@name="mathSelect"]//div[@role="combobox"]//input';
    this.startDatePicker = '#fromDate';
    this.previousMonthButton = '//button[@aria-label="Previous month"]';
    this.nextMonthButton = '//button[@aria-label="Next month"]';
    this.reportStartTime = 'input[name="reportTHr"]';
    this.reportEndTime = 'input[name="reportFHr"]';
    this.reportNameInput = 'input[name="reportName"]';
    this.submit="//button[normalize-space()='Request Report']"
  }

  async navigateToReports() {
    await this.page.locator(this.reportsButton).click();
    await this.page.waitForTimeout(3000);
  }

  async selectCreateReport() {
    await this.page.locator(this.reportTab).click();
    const dialogVisible = await this.page.locator(this.dialog).isVisible();
    expect(dialogVisible).toBeTruthy();
  }
  async CVS(){
     await this.page.locator(this.csvRadioButton).check();
  }

  async configureReport(reportData) {
    const { region, model, device, parameters,  startDay, startMonth, startYear, endDay, endMonth, endYear, reportName } = reportData;

    // Select CSV Radio Button
   
    await this.page.waitForTimeout(3000);

    // Region
    await this.page.locator(this.regionDropdown).click();
    await this.page.locator(`//div[@title='${region}']`).click();

    // Model
    await this.page.locator(this.modelDropdown).click();
    await this.page.locator(`//span[normalize-space()='${model}']`).click();

    // Device
    await this.page.locator(this.deviceDropdown).click();
    await this.page.locator(`//div[@title='${device}']`).click();

    // Parameters
    await this.page.locator(this.parametersDropdown).click();
    
      await this.page.locator(`.ng-option-label:has-text("${parameters}")`).click();
    
    
 
   await this.page.locator(this.mathDropdown).click();
   await this.page.locator("//div[contains(@class, 'ng-option') and contains(@class, 'ng-option-marked') and .//span[text()='Sensor Readings']]").click();
 
      
 


    // Dates
    await this.page.locator(this.startDatePicker).click();

//     // Select start date
    await this.page.locator(this.previousMonthButton).click();
    await this.page.locator(`//td[@aria-label='${startMonth} ${startDay}, ${startYear}']`).click();

//     // Select end date
     await this.page.locator(this.nextMonthButton).click();
     await this.page.locator(`//td[@aria-label='${endMonth} ${endDay}, ${endYear}']`).click();

//     // Time
     await this.page.locator(this.reportStartTime).fill('00');
    await this.page.locator(this.reportEndTime).fill('3');

//     // Report Name
     await this.page.locator(this.reportNameInput).fill(reportName);
     //await this.page.locator(this.reportNameInput).fill(reportName);

// Step 2: Wait for 5 seconds
//await this.page.waitForTimeout(5000);

// Step 3: Clear the input using backspace
const inputLength = reportName.length;
for (let i = 0; i < inputLength; i++) {
  await this.page.locator(this.reportNameInput).press('Backspace');
}

// Step 4: Re-enter the report name
await this.page.locator(this.reportNameInput).fill(reportName);

     
     await this.page.locator( this.submit).click();

  }
 }

module.exports = { ReportsPage };

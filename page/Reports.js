const { expect } = require('@playwright/test');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const path = require('path');
const csvParser = require('csv-parser');


class ReportsPage {
  constructor(page,expect) {
    this.page = page;
    this.expect=expect;

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
 
  }

  async selectCreateReport() {
    await this.page.locator(this.reportTab).click();
    const dialogVisible = await this.page.locator(this.dialog).isVisible();
    expect(dialogVisible).toBeTruthy();
  }
  async CVS(){
     await this.page.locator(this.csvRadioButton).click();
  }

  async configureReport(reportData) {
 
    
    const { region, model, device, sensor,  startDate,endDate, reportName } = reportData;
    const startDay = startDate.getDate();
    const startMonth = startDate.toLocaleString('default', { month: 'long' });
    const startYear = startDate.getFullYear();
  
    const endDay = endDate.getDate();
    const endMonth = endDate.toLocaleString('default', { month: 'long' });
    const endYear = endDate.getFullYear();

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
    
      await this.page.locator(`//span[contains(text(),"${sensor}")]`).click();
    
    
 
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
  async ReportCSVverification(){const row1 = this.page.locator('//table//tr[1]');
    const button = row1.locator('//following-sibling::td//i[@title="Download"]/following-sibling::i[@title="Remove"]/ancestor::div/preceding-sibling::button');

    // Click the button to open the dropdown
    await button.click();

    // Locate and click the "Download" button
    const dropdown = row1.locator('div.dropdownload-content');
    const downloadButton = dropdown.locator("//*[@title='Download']");

    // Define the download directory
    const downloadDir = path.resolve(__dirname, 'downloads');

    // Ensure the download directory exists
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    // Wait for the download event and click the download button
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      downloadButton.click(),
    ]);

    // Retrieve the file name and save it to the specified path
    const fileName = await download.suggestedFilename();
    const filePath = path.join(downloadDir, fileName);
    await download.saveAs(filePath);

    console.log(`File downloaded and saved to: ${filePath}`);
    const pdfBuffer = fs.readFileSync(filePath);
            const pdfData = await csvParser(pdfBuffer);
    
            console.log('PDF Contents:');
            console.log(pdfData.text);


    // Parse the CSV file
    const csvData = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => csvData.push(row))
      .on('end', () => {
        console.log('CSV Contents:', csvData);

        // Optional: Verify expected columns
        const expectedColumns = ['S No', 'Date/Time', 'Temperature (deg C)'];
        if (csvData.length > 0) {
          const actualColumns = Object.keys(csvData[0]);
          expectedColumns.forEach((col) => {
            if (!actualColumns.includes(col)) {
              throw new Error(`Column "${col}" not found in the CSV file.`);
            }
          });
          console.log('CSV verification passed!');
        } else {
          throw new Error('CSV file is empty.');
        }
      })
      .on('error', (error) => {
        console.error('Error parsing the CSV file:', error);
      });
  }

 


        
    async clickondemand(){
      
    
      await this.page.reload();
    
         await this.page.locator('//div[contains(text(),"On-Demand")]').click();
    
    }
    async ReportpdfVerification(reportName){
      const targetRow =this. page.locator('table tbody tr').filter({
          has: this.page.locator(`td[title="${reportName}"]`)
        });
      
        // Locate the dropdown button within the matched row
        const dropdownButton = targetRow.locator('button.my-button');
      
        // Hover over the dropdown button
        await dropdownButton.hover({ force: true });
     
        //await page.locator('//i[@title="Download"]').click();
        const downloadButton =  this.page.locator('//i[@title="Download"]');
          await downloadButton.waitFor({ state: 'visible' });
        
        
          // Trigger the download and handle the download event
          const [download] = await Promise.all([
           this.page.waitForEvent('download'), // Wait for the download event
            await downloadButton.click(), // Click the download button
          ]);
          
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
               const pdfBuffer = fs.readFileSync(filePath);
               console.log('PDF Buffer:', pdfBuffer);
               
                const pdfData = await pdfParse(pdfBuffer);
                console.log('PDF Contents:', pdfData.text);
             
                      
              
                   
              
      
      if (pdfData.text.includes('No-Data Available')) {
          console.log("No data available in the report.");
          // Add your assertion or further checks here
         this.expect(pdfText.text).toContain('No-Data Available');
      } else {
          console.log("Data is available in the report.");
          // Verify the parameter values
          this.expect(pdfText.text).toContain(reportData.parameters);
         this.expect(pdfText.text).toContain(reportData.device);
         this.expect(pdfText.text).toContain(reportData.region);
        //  const startYearPattern = new RegExp(`\\b${reportData.startYear}\\b`);
        //    const endYearPattern = new RegExp(`\\b${reportData.endYear}\\b`);
      
        //    this.expect(startYearPattern.test(pdfText.text)).toBe(true);
        //    this.expect(endYearPattern.test(pdfText.text)).toBe(true);
          
      }
      
      
    }
    
    
    }
    module.exports = ReportsPage;
    


 

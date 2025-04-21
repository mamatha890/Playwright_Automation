const pdfParse = require('pdf-parse');
const path = require('path');
const { validateHeaderName } = require('http');
const csvParser = require('csv-parser');

import fs from "fs";
class dashboard {
    constructor(page,expect) {
        this.page = page;
        this.expect=expect;
        this.locattionclear = this.page.locator('//span[contains(text(),"Temperature")]//parent::div//parent::div//following-sibling::div//ng-select//div[text()="Duration"]//parent::div//following-sibling::span[@title="Clear all"]');

        this.location = this.page.locator('//span[contains(text(),"Temperature")]//parent::div//parent::div//following-sibling::div//ng-select//div[text()="Duration"]//following-sibling::div');
        this.mothdropdown = this.page.locator('//span[contains(text(),"Last 10 Days")]');
        this.gobutton = this.page.locator('//div[@class="col-md-6 col-sm-6 col-xs-6"]//button[@class="my-button" and text()[normalize-space()="GO"]]');
        this.hovering = this.page.locator('.dropdownload')

    }
    async devicerowclick() {
        const row = await this.page.locator('//tr[.//span[contains(text(),"Dev001")]]');

        // Click the last clickable element (the icon with class `fa fa-list-alt`)
        await row.locator('.fa.fa-list-alt').click();
    }
    async parameterclick() {
        const temperatureRow = await this.page.locator('//tr[.//th[text()=" Temperature"]]');

        // Locate the last clickable element in the row (icon with class 'fa fa-line-chart')
        await temperatureRow.locator('.fa.fa-line-chart').click();
    }
    async dropdownsclick() {
        await this.locattionclear.click();
        await this.location.click();
        await this.mothdropdown.click();
        await this.gobutton.click();
        await this.hovering.hover();

    }
    async pdfdownloadVerfication() {
        const downloadButton = this.page.locator(
            '//span[contains(text(), "Download PDF")]'
        );
        await downloadButton.waitFor({ state: 'visible' });
        const [download] = await Promise.all([
            this.page.waitForEvent('download'), // Wait for the download event
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
        const device = "Device :Dev001"
        const temparature = "Temperature"
        // Logs the text content of the PDF
      await this. expect(pdfData.text).toContain(device);
       await  this.expect(pdfData.text).toContain(temparature);
    }
    async CSVverification(){
        const downloadButton = this.page.locator(
            '//span[contains(text(), "Download CSV")]'
        );
        await downloadButton.waitFor({ state: 'visible' });
        const [download] = await Promise.all([
            this.page.waitForEvent('download'), // Wait for the download event
            await downloadButton.click(), // Click the download button
        ]);

        // Retrieve the filename and save the file
        const fileName = await download.suggestedFilename();
        const downloadDir = path.resolve(__dirname, 'Trend ');

        // Ensure the download directory exists
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

    
        

        
        
        
        // Save the downloaded file in the specified directory
        
        const filePath = path.join(downloadDir, fileName);
        await download.saveAs(filePath);
        
        console.log(`Downloaded file saved at: ${filePath}`);
        
        // Optional: Verify if the file exists
        await this.expect(fs.existsSync(filePath)).toBeTruthy();
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
            await this.expect(columnsVerified).resolves.toBeUndefined();
            console.log("All expected columns are present in the CSV file.");
    

    }
    



}
module.exports = dashboard;

class dashboard{
    constructor(page) {
        this.page = page;
         this.locattionclear= this.page.locator('//span[contains(text(),"Temperature")]//parent::div//parent::div//following-sibling::div//ng-select//div[text()="Duration"]//parent::div//following-sibling::span[@title="Clear all"]');
  
    this.location =this.page.locator('//span[contains(text(),"Temperature")]//parent::div//parent::div//following-sibling::div//ng-select//div[text()="Duration"]//following-sibling::div');
   this.mothdropdown =this.page.locator('//span[contains(text(),"Last 10 Days")]');
this.gobutton=this.page.locator('//div[@class="col-md-6 col-sm-6 col-xs-6"]//button[@class="my-button" and text()[normalize-space()="GO"]]');
this.hovering=this.page.locator('.dropdownload')

    }
    async devicerowclick(){
        const row = await this.page.locator('//tr[.//span[contains(text(),"Dev001")]]');

        // Click the last clickable element (the icon with class `fa fa-list-alt`)
        await row.locator('.fa.fa-list-alt').click();
    }
    async parameterclick(){
        const temperatureRow = await this.page.locator('//tr[.//th[text()=" Temperature"]]');

        // Locate the last clickable element in the row (icon with class 'fa fa-line-chart')
        await temperatureRow.locator('.fa.fa-line-chart').click(); 
    }
    async dropdownsclick(){
       await this.locattionclear.click();
       await this.location.click();
       await this.mothdropdown.click();
       await this.gobutton();
       await this.hovering.hover();

    }
    async pdfdownloadVerfication(){
        const downloadButton = page.locator(
            '//span[contains(text(), "Download PDF")]'
          );
          await downloadButton.waitFor({ state: 'visible' });
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
    }


    
}
module.exports=dashboard;

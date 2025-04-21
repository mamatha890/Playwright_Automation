const { extractDataFromExcel } = require('../Utils/Excel.js');
class RulePage {
    constructor(page,expect) {
        this.page = page;
        this.expect=expect;

        // Locators
       // this.dialog = this.page.locator("//span[text()='New Rule']/ancestor::div[@class='ui-modal']");
        this.locationDropdown = this.page.locator("//span[text()='Location']//following-sibling::ng-select");
      

        // Temperature Row Locators
        this.temperatureRow = page.locator('div.row.ng-star-inserted');
        this.temperatureInputFields = this.temperatureRow.locator('input[type="text"]');
        this.temperatureApplyButton = this.temperatureRow.locator('input[type="button"][value="Apply"]');

        // Humidity Row Locators
        this.humidityRow = page.locator('div.row.ng-star-inserted:has-text("Humidity %")');
        this.humidityInputFields = this.humidityRow.locator('input[type="text"]');
        this.humidityApplyButton = this.humidityRow.locator('input[type="button"][value="Apply"]');
    }

    // async isDialogVisible() {
    //     return await this.dialog.isVisible();
    // }

    async selectLocation(locationName) {
        await this.locationDropdown.click();
        const locationOption = this.page.locator(`//div[@title="${locationName}"]`);
        await locationOption.click();
    }

    // Select Device
    async selectDeviceName(devicename) {
      
        //const devicename = rowData.DeviceName.trim(); // Trim spaces
await this.page.locator(`//span[@title=" ${devicename}" and @class="text-wrapper ng-star-inserted"]`).click();

       
    }

    // Set Min, Max, and Tolerance Values
    async MinMaxValue(parameter, values) {
        const parameterRow = this.page.locator(`div.row.ng-star-inserted:has-text("${parameter}")`);
        const inputFields = parameterRow.locator('input[type="text"]');
        for (let i = 0; i < values.length; i++) {
            await inputFields.nth(i).fill(values[i].toString());
        }
    }

    // Click Apply Button
    async clickApply(parameter) {
        const parameterRow = this.page.locator(`div.row.ng-star-inserted:has-text("${parameter}")`);
        const applyButton = parameterRow.locator('input[type="button"][value="Apply"]');
        await applyButton.click();
    }

async Alertclick(){
    await this.page.locator('//span[starts-with(text(), "Alert - Dev001 | Temperature |")]//parent::div[@class="IjzWp XG5Jd gy2aJ Ejrkd lME98"]').first().click();
}
    
    async AlertVerification(){
       const sensorValue = await this.page.locator('//td[normalize-space()="Temperature"]').textContent();
       console.log('Sensor Value:', sensorValue);
    
       // Verify that Sensor is "Temperature"
       await this.expect(sensorValue).toBe('Temperature');
       const statusValue = await this.page.locator('//td[normalize-space()="Good"]').textContent();
       console.log('Status Value:', statusValue);
    
       await this.expect(statusValue).toBe('Good');
       
       await this.page.locator('//span[starts-with(text(), "Alert - Dev001 | Humidity |")]').first().click();
       
      const HumidityValue = await this.page.locator('//td[normalize-space()="Humidity"]').textContent();
      console.log('Sensor Value:', HumidityValue);
    
      await this.expect(HumidityValue).toBe('Humidity');
      const HimiditystatusValue = await this.page.locator('//td[normalize-space()="Good"]').textContent();
      console.log('Status Value:', HimiditystatusValue);

      await this.expect(statusValue).toBe('Good');
    }
    
    

    

}


module.exports=RulePage;

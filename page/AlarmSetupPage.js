class AlarmSetupPage {
  constructor(page) {
    this.page = page;
    this.alarmSetupButton = page.locator('button[title="Alarm Setup"]');
    this.addRuleButton = page.locator('button[title="Add Rule"]');
    this.advancedRulesTab = page.locator('div.tabStyle', { hasText: 'Advanced Rules' });
    this.locationInput = page.locator('(//label[text()="Location"]//following-sibling::ng-select//input)[1]');
    this.locationOption = page.locator('//div[@title="Ideabytes"]');
    this.deviceModelInput = page.locator('(//label[text()="Device Model"]/following-sibling::ng-select//input)[1]');
    this.deviceModelOption = page.locator('//span[@class="ng-option-label ng-star-inserted"]');
    this.deviceNameInput = page.locator('(//*[@name="DeviceName"])');
    this.sensorListInput = page.locator('(//*[@placeholder="Sensor List"])');
    this.sensorOption = page.locator('//span[normalize-space()="Temperature"]');
    this.selectoption=page.locator("//ng-select[@placeholder='Select']");
    this.operatorDropdown = page.locator('(//*[@bindlabel="Operator"])[1]');
    this.operatorOption = page.locator("//span[normalize-space()='>=']");
    this.minValueInput = page.locator('//*[@name="MinValue"]');
    this.stateDropdown = page.locator('//*[@name="state"]');
    this.stateOption = page.locator('//span[normalize-space()="Warning"]');
    this.bufferMinutesDropdown = page.locator("//ng-select[@placeholder='Buffer Mins']//input[@type='text']");
    this.bufferMinutesOption = page.locator('//span[normalize-space()="1 Hr"]');
    this.submitButton = page.locator('//*[@type="submit"][@class="buttonsuc ng-star-inserted"]');
  }

  async setupAlarm(rule) {
    await this.alarmSetupButton.click();
    await this.addRuleButton.click();
    await this.advancedRulesTab.click();

    await this.locationInput.click();
    await this.locationOption.click();

    await this.deviceModelInput.click();
    await this.deviceModelOption.click();

    await this.deviceNameInput.click();
    await this.deviceModelOption.click();

    await this.sensorListInput.click();
    await this.sensorOption.click();

   await this.selectoption.click();
     await this.operatorOption.click();

     await this.minValueInput.fill(rule);

    await this.stateDropdown.click();
     await this.stateOption.click();

     await this.bufferMinutesDropdown.click();
     await this.bufferMinutesOption.click();

    await this.submitButton.click();
  }
  async search(){
    await this.page.locator('//input[@placeholder="Search..."]').fill("Dev001");
  }
}

module.exports = AlarmSetupPage;

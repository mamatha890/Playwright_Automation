
const { test, expect, context } = require('@playwright/test');
import fs from "fs";
const path = require('path');
//const { saveScreenshot } = require('../Utils/ScreenshotHelper.js');

const { takeScreenshotWithTestCase } = require('../Utils/screenshotUtil.js');
class Modules{
    constructor(page,context,expect) {
      this.page = page;
     

      this.context=context;
      this.filed=("//div[@title='Ideabytes']");
      this.dashbord=page.locator("//span[normalize-space()='(Live Status-All Regions)']");
      this.userbutton="button[class='my-button'] span"
  

    }

    // Locator for buttons in the left-side menu
// This dynamically selects a button by its title attribute
    async menu(title) {
      const moduleLocator =(`//button[@title="${title}"]`); 
       await this.page.locator(moduleLocator).click();
    }
    async verifyuserManagementpage(title,testcaseName,Screenshotname,Status,testInfo){
      await this.menu(title);
       const verifyuserbutton=await this.page.locator(this.userbutton).textContent();
       const button=verifyuserbutton.trim();
       

       console.log(button);

      await  expect(button).toBe("User");
       await takeScreenshotWithTestCase(this.page,testcaseName, Screenshotname, Status, testInfo);
    }

      
  
        // Example action
    
    async dropdown(abc){
      await  this.page.locator(`(//label[text()='${abc}']/following-sibling::ng-select)[1]`).click();
      
  }
    async common(button){
      await this.page.locator(`//span[normalize-space()='${button}']`).click();
    }
    
   // async CreateRole(getRoles, Names){
     // await this.page.locator(`//input[@name="${getRoles}"]`).fill(`${Names}`);
     async CreateRole(roles) {
      for (const { getRoles, Names } of roles) {
          await this.page.locator(`//input[@name="${getRoles}"]`).fill(Names);
      }
    }
      async toastmessages(expectedToastMessage,testName,testInfo){
         const toastmeassage = await this.page.locator('#toast-container > div');

            const getmessage = await toastmeassage.textContent();
            const getText = getmessage.trim();
            const Expectedtext =expectedToastMessage;

            expect(await getText).toBe(Expectedtext);
             const screenshotName = `${expectedToastMessage.substring(0, 100).replace(/\s+/g, '_')}`;

    await saveScreenshot(this.page, testName, screenshotName, testInfo);
             // await saveScreenshot(this.page, testName, 'toastmessages',testInfo);
      

  }
  async gettoastmessage(data){
       const toastMessage = await this.page.locator('#toast-container > div').textContent();
   await expect(toastMessage.trim()).toBe(data);

  }

  // async outlook(type,creadentials){
  //   await this.page.locator(`//input[@type="${type}"]`);
  // }
  async dialog(){
    const dailog = this.page.locator('//div[@role="dialog"][@class="ui-modal"]');
    if (dailog.isVisible()) {
        console.log('visible');
  }
}
async sessionstorage(testInfo,testCaseName){

      // Load authentication state (cookies + localStorage)
      const sessionStorage = JSON.parse(fs.readFileSync('playwright/.auth/session.json', 'utf-8'));
      await this.context.addInitScript(storage => {
          // if (window.location.hostname === 'qa_env.ibiot.net') {
          for (const [key, value] of Object.entries(storage))
              window.sessionStorage.setItem(key, value);
          // }
      }, sessionStorage);
  
      await this.page.goto(process.env.HOME_URL);
      const dashboard=await this.dashbord.textContent();
      expect(dashboard).toBe("(Live Status-All Regions)");
      console.log("Live Status-All Regions")
        await takeScreenshotWithTestCase(this.page,testCaseName, 'Navigate to Dashboard', 'passed', testInfo);
      
  

  
}
async logoutfunctinality(){
  // await this.page.locator('//div[@title="IoT"]').click();
                 await this.page.locator('//div[@title="IoT"]').click();
                 await this.page.locator('//a[contains(text(),"Logout")]').click();
}


}


  module.exports = Modules;
  

  

//const { test, expect, context } = require('@playwright/test');
import fs from "fs";
class Modules{
    constructor(page,context) {
      this.page = page;
      this.context=context;
      this.filed=("//div[@title='Ideabytes']");
  

    }
    
    async menu(title) {
      const moduleLocator =(`//button[@title="${title}"]`); 
       await this.page.locator(moduleLocator).click(); // Example action
    }
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
  // async outlook(type,creadentials){
  //   await this.page.locator(`//input[@type="${type}"]`);
  // }
  async dialog(){
    const dailog = this.page.locator('//div[@role="dialog"][@class="ui-modal"]');
    if (dailog.isVisible()) {
        console.log('visible');
  }
}
async sessionstorage(){

      // Load authentication state (cookies + localStorage)
      const sessionStorage = JSON.parse(fs.readFileSync('playwright/.auth/session.json', 'utf-8'));
      await this.context.addInitScript(storage => {
          // if (window.location.hostname === 'qa_env.ibiot.net') {
          for (const [key, value] of Object.entries(storage))
              window.sessionStorage.setItem(key, value);
          // }
      }, sessionStorage);
  
      await this.page.goto(process.env.HOME_URL);

  
}


}


  module.exports = Modules;
  

  
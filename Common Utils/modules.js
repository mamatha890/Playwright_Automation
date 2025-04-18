class Modules{
    constructor(page) {
      this.page = page;
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
}

  module.exports = Modules;
  

  
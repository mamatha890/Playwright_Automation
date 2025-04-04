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
  }
  module.exports = Modules;
  

  
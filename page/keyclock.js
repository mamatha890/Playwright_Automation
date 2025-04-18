class keyclock{
    constructor(page){
       this.page=page
       this.usernameInput=this.page.locator('//input[@name="username"]');
       this.passwordInput= this.page.locator('//input[@name="password"]');
       this.signInButton= this.page.locator('//input[@name="login"]');
   };
   async keyclocklogin(url,username,password){
    await this.page.goto(url);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
   }

    }

    

module.exports=keyclock;
exports.LoginPage = class LoginPage {
    constructor(page) {
      this.page = page; // Playwright page object
      this.url = 'https://staging.dgtrak.online/IoT/login'; // URL of the login page
      this.usernameField = { role: 'textbox', name: 'Enter your username' }; // Username field
      this.passwordField = { role: 'textbox', name: 'Enter your password' }; // Password field
      this.eyeIcon = '//span[@class="input-group-text"]//span[contains(@class, "fa-eye")]'; // Eye icon selector
      this.captchaTextSelector = 'div.captcha-container marquee.marquee-text'; // Captcha text selector
      this.captchaInputField = 'input[name="capt"]'; // Captcha input field selector
      this.loginButton = { role: 'button', name: 'Login' };
      this.menu='button[title="Menu"]'
      this.userManagement= ("button:has-text('User Management')");
      this.Search=('input[aria-label="Search"]');
      this.addUse='button[class="my-button"]';
  }
  
    async performLogin(username, password) {
      await this.page.goto(this.url); // Navigate to the login page
      //await this.page.waitForTimeout(1800); // Wait for animations or loading
  
      await this.page.getByRole(this.usernameField.role, { name: this.usernameField.name }).fill(username.trim()); // Fill the username
      //await this.page.waitForTimeout(1800);
  
      await this.page.getByRole(this.passwordField.role, { name: this.passwordField.name }).fill(password); // Fill the password
      //await this.page.waitForTimeout(1800);
  
      // await this.page.click(this.eyeIcon); // Click the eye icon to reveal the password
  
      // const captchaText = await this.page.textContent(this.captchaTextSelector); // Capture CAPTCHA text
      // const trimmedCaptcha = captchaText.trim(); // Trim spaces from the captured CAPTCHA
      // console.log('Captured CAPTCHA Text:', trimmedCaptcha);
  
      // await this.page.fill(this.captchaInputField, trimmedCaptcha); // Fill the CAPTCHA input field
      // //await this.page.waitForTimeout(1800);
  
      await this.page.getByRole(this.loginButton.role, { name: this.loginButton.name }).click(); // Click the login button
     // await this.page.waitForTimeout(1800); // Wait for animations or redirects
    }
    async clickopen(){
      await this.page.locator(this.menu).click();
    }
     async clickUserManagementMenu(){
    
      await this.page.click(this.userManagement);

    }
    async EnterSearch(name){
      await this.page.fill(`this.Search, "${name}"`);
  
    }
   
    async deelete(){
      const noDataSelector = 'tbody tr.mat-row.mat-mdc-no-data-row td.mat-cell';
       const count = await this.page.locator(noDataSelector).count();
      console.log('Count:', count);
      
      if (count === 1) {
        console.log('No data found');
        await this.page.waitForTimeout(3000);
        //await this.page.click(this.addUser);
          await this.User();
          await this.deleteUser();
      }else{
    
      await this.deleteUser();
         }
        }async User(){

      await this.page.click(this.addUse);
      await this.page.locator('input[name="name"].form-control').fill('Mamatha890');
      await this.page.locator('input[name="lastname"].form-control').fill('Sangana');
    await this.page.locator('input[name="mailId"].form-control').fill('mamatha.sangana@ideabytes.com');
     await this.page.locator('#cCode').click();
     
     await this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'india' }).click();
     
     await this.page.locator('input[name="mobileNumber"].form-control').fill('9963060211');
   // Locator for the dropdown using the placeholder text
    const roleDropdown = this.page.locator('.ng-select-container:has-text("Role")');
   
   // Click the dropdown
    await roleDropdown.click();
   await this.page.waitForSelector('.ng-option');
  // Step 3: Click on the option with text "Auditor"
 await this.page.locator('.ng-option', { hasText: 'Admin' }).click();
   // // Click the element
  // Click on the dropdown
    await this.page.locator('#userPref .ng-select-container').click();
    await this.page.waitForSelector('.ng-option');
 
   // //await page.locator('.ng-option[role="option"][id="a330298c2a22-3"] .textWrapDD[title="Alerts Management"]');
    await this.page.locator('div.textWrapDD[title="Dashboard > List View"]').click();
    await this.page.locator('input[name="password"]').fill('Mamatha@123');
    await this.page.locator('input[name="confirmPassword"]').fill('Mamatha@123');
   
   

    await this.page.locator('#sms').check(); // Example for a specific checkbox with id="sms"
    await this.page.locator('input[name="email"]').check();
    await this.page.locator("div[class='col-md-6 col-sm-6 col-xs-6'] button[type='submit']").click();


     
    }
    async report(){
      await this.page.locator('button[title="Reports"]').click();
      await this.page.locator('//div[contains(text(),"On-Demand")]').click();
      //const row = await page.locator('tr:has(td:has-text("repsvfsd23"))');
      const row = await this.page.locator('tr:has(td:has-text("repsvfsd23"))');
       await row.locator('td').last().hover();



      // Find and click the button with the class `my-button` in that row
      // Click the button
  }
      


    
  
   async deleteUser(){
      await this.page.click('mat-icon:has-text("edit")');
      await this.page.waitForTimeout(2000); 
     const modal = this.page.locator('.ui-modal'); 
    console.log('Clicking the Remove button...');
  
    await modal.locator('button:has-text("Remove")').evaluate((button) => button.click());
    await this.page.waitForTimeout(1000); 
    console.log('Clicked on the Remove button.');
      await this.page.waitForSelector('.swal2-confirm', { state: 'visible' }); 
      await this.page.click('.swal2-confirm'); 
     console.log('Clicked on the "Yes" button in the confirmation dialog.');
      }
    
      
}

  
    
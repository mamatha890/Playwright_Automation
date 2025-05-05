const { expect } = require('@playwright/test');
class UserPage {
    constructor(page,expect) {
        this.page = page;
        this.expect=expect
        this.Search=('input[aria-label="Search"]');
        this.eyeIcon = '//span[@class="input-group-text"]//span[contains(@class, "fa-eye")]'; // Eye icon selector
      this.captchaTextSelector = 'div.captcha-container marquee.marquee-text'; // Captcha text selector
      this.captchaInputField = 'input[name="capt"]'; 


    }

    async dynamicLocator(title, name) {
        await this.page.locator(`input[name="${title}"].form-control`).fill(String(name));



    }

    async checkboxes(parameter) {
        await this.page.locator(`//input[@id="${parameter}"]`).check();
    }
    async outlook(){
        await this.page.goto(process.env.TESTURL);
    }
    async outlookVeification() {
        
  
   
     // Navigate to the test URL

       
        await this.page.locator('//input[@type="email"]').fill(process.env.TESTEMAIL);

        await this.page.locator('//input[@type="submit"]').click();

     
        await this.page.locator('//input[@type="password"]').fill(process.env.TESTPASSWORD);
        await this.page.locator('//input[@type="submit"]').click();
        await this.page.locator('//input[@type="submit"]').click();


    }
    

        async userEmailVerificationPage(){
            await this.page.locator('span[title="IoT_Signup@ideabytesiot.com"]').first().click();

            await this.page.waitForSelector('//a[normalize-space()="Click here to Verify Your Email"]');
           
            const emailVerificationLink = this.page.locator("//a[normalize-space()='Click here to Verify Your Email']");
    
           
            await emailVerificationLink.click();


        }
        
        async VerificationLink(){
            const emailVerificationLink = this.page.locator("//a[normalize-space()='Click here to Verify Your Email']");

            const href = await emailVerificationLink.getAttribute('href');
            console.log('Captured href:', href);
    
            // Step 4: Navigate directly to the URL
            if (href) {
                await this.page.goto(href);
                console.log('Navigated to:', href);
    
                // Step 5: Wait for specific elements on the navigated page
                await this.page.waitForLoadState('domcontentloaded');
                const verificationMessage = this.page.locator("p:has-text('Email Id has been verified !!!')");
                await expect(verificationMessage).toBeVisible(); // Assertion to verify visibility
    
                console.log('Verification message is visible.');
            } else {
                console.log('No href found for the link.');
            }
        }
            
               async fillfiled(user){
                await this.page.locator('#cCode').click();
                await this.page.locator('.ng-dropdown-panel .ng-option', { hasText: user.CountryCode }).click();

               }
               async rolepeference(user){
                const roleDropdown = this.page.locator('.ng-select-container:has-text("Role")');

    // Click the dropdown
    await roleDropdown.click();
    await this.page.waitForSelector('.ng-option');

    // Step 3: Click on the option with text "Auditor"
    await this.page.locator(`//span[normalize-space()="${user.Role}"]`).click();
    await this.page.locator('//*[@bindlabel="name"]').click();

    await this.page.locator(`div.textWrapDD[title="${user.Preference}"]`).click();
    

               }
               async submitbutton(){
                await this.page.locator("div[class='col-md-6 col-sm-6 col-xs-6'] button[type='submit']").click();
               }
           
                async EnterSearch(){
                    await this.page.fill(this.Search, 'mamatha');
                
                  }
                  async edit(){
                    await this.page.locator('//mat-icon[contains(text(),"edit")]').click({ force: true });
                  }
                  async logout(){
                    await this.page.locator('//div[@class="ui-controlbar"]').click();


                    await this.page.locator('//a[@id="userDropdown"][@role="button"][@data-bs-toggle="dropdown"]/div/img').click();
                    await this.page.locator('//a[contains(text(),"Logout")]').click();
                  }

                  async Verifycheckboxces(checkbox){
                    const checkboxLocator = this.page.locator(`//input[@id="${checkbox}"]`);
                    await this.expect(checkboxLocator).toBeChecked();
                }
                
                

               }
            

        
        
    


    


module.exports = UserPage;

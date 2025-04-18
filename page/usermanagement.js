class UserPage {
    constructor(page) {
        this.page = page;


    }

    async dynamicLocator(title, name) {
        await this.page.locator(`input[name="${title}"].form-control`).fill(String(name));



    }

    async checkboxes(parameter) {
        await this.page.locator(`//input[@id="${parameter}"]`).check();
    }
    async outlook1(submitbutton) {
        await this.page.locator(`//input[@type="${submitbutton}"]`).click();
    }
    async outlookVeification() {
        await this.page.goto(process.env.TESTURL); // Navigate to the test URL

        // Initialize the UserPage class

        // Fill the email input field
        await this.page.locator('//input[@type="email"]').fill(process.env.TESTEMAIL);

        // Click submit
        await this.page.locator('//input[@type="submit"]').click();

        // Fill the password input field
        await this.page.locator('//input[@type="password"]').fill(process.env.TESTPASSWORD);
        await this.page.locator('//input[@type="submit"]').click();
        await this.page.locator('//input[@type="submit"]').click();


    }
    

        async EmailVerificationPage(){
            await this.page.locator('span[title="IoT_Signup@ideabytesiot.com"]').first().click();
            // await page.waitForTimeout(2000); // Optional: consider replacing with proper wait for element
            // page.locator("//a[normalize-space()='Click here to Verify Your Email']").click();
            await this.page.waitForSelector('//a[normalize-space()="Click here to Verify Your Email"]');
            await this.page.waitForTimeout(5000); // Wait for the page to load fully
    
            // Locate the email verification link
            const emailVerificationLink = this.page.locator("//a[normalize-space()='Click here to Verify Your Email']");
    
            // Scroll the link into view
    
    
            // Click the link
            await emailVerificationLink.click();


        }
        
        async getVerificationLink(){
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
            }

        
        
    


    


module.exports = UserPage;

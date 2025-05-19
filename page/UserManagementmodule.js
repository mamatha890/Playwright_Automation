const { expect } = require('@playwright/test');
class UserPage {
    constructor(page, expect) {
        this.page = page;
        this.expect = expect
        this.Search = ('input[aria-label="Search"]');
        this.eyeIcon = '//span[@class="input-group-text"]//span[contains(@class, "fa-eye")]'; // Eye icon selector
        this.captchaTextSelector = 'div.captcha-container marquee.marquee-text'; // Captcha text selector
        this.captchaInputField = 'input[name="capt"]';
        this.rolemanagement = page.locator('//span[contains(text(),"Role Management")]');
        this.role = page.locator('//span[contains(text()," Role")]');
        this.rolename = page.locator('//input[@name="roleName"]');
        this.roleTag = page.locator('//input[@name="roleTag"]');
        this.desciption = page.locator('//label[@for="description"]');
        this.submit = page.locator('//button[@type="submit"]');
        this.nameInputSelector = '//input[@name="name"]';
        this.lastNameInputSelector = '//input[@name="lastname"]';
         this.submitButtonSelector = "div[class='col-md-6 col-sm-6 col-xs-6'] button[type='submit']";
        this.firstNameErrorSelector = '//div[contains(text(),"Please enter First Name")]';
        this.lastNameErrorSelector = '//div[contains(text(),"Please Enter Last Name")]';
        this.submitbutton = page.locator("//div[@class='col-md-6 col-sm-6 col-xs-6']/button[@type='submit']");
        this.errormessage = page.locator('//div[contains(text(), "Please Enter First Name")]');
        this.Rolename = page.locator(' // div[contains(text(),"Please Enter Role Name")]');
        this.roletag = page.locator('// div[contains(text(),"Please enter role tag")]');
        this.Reports = page.locator("//label[normalize-space()='Reports']");
        this.Dashboard = page.locator('//label[contains( text(),"Dashboard")]');
        this.save = page.locator("//button[normalize-space()='save']")
        this.checkboxes = page.locator(
            '//span[contains(text(),"Permissions")]//parent::div//parent::div//following-sibling::div[@class="ui-modal-body"]//input[@type="checkbox" and not(ancestor::label[contains(text(),"Dashboard")])]'
        );
        this.name = page.locator('//input[@name="username"]');
        this.password = page.locator('//input[@placeholder="Enter your password"]');

        this.savebutton = page.locator('//button[contains(text(),"Save")]');
        this.success = page.locator('//div[@aria-label="Save Success"]');
        this.successfulmessage = page.locator('//div[contains(text(),"Permissions Updated Successfully")]')

        const nameInputSelector = '//input[@name="name"]';
        const lastNameInputSelector = '//input[@name="lastname"]';

        this.homescreen = page.locator('//ng-select[@placeholder="Select home Screen"]');
        this.mobilenumber= '//div[contains(text(),"Please enter Phone Number")]'; 

    }

    async dynamicLocator(title, name) {
        await this.page.locator(`input[name="${title}"].form-control`).fill(String(name));



    }

    async usercheckboxes() {
        await this.page.locator('//input[@id="sms"]').check();
        await this.page.locator('//input[@id="email"]').check();
    
        await this.page.locator('//input[@id="alerts"]').click();
        //await this.page.locator('//label[@for="createReport"]//preceding-sibling::input[@id="reports"]').check();


    }
   
    async outlook() {
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


    async userEmailVerificationPage() {
        await this.page.locator('span[title="IoT_Signup@ideabytesiot.com"]').first().click();

        await this.page.waitForSelector('//a[normalize-space()="Click here to Verify Your Email"]');

        const emailVerificationLink = this.page.locator("//a[normalize-space()='Click here to Verify Your Email']");


        await emailVerificationLink.click();


    }

    async VerificationLink() {
        const emailVerificationLink = this.page.locator("//a[normalize-space()='Click here to Verify Your Email']");

        const href = await emailVerificationLink.getAttribute('href');
        console.log('Captured href:', href);

        // Step 4: Navigate directly to the URL
        if (href) {
            await this.page.goto(href);
            console.log('Navigated to:', href);

            // Step 5: Wait for specific elements on the navigated page
            await this.page.waitForLoadState('domcontentloaded');
            const verificationMessage = this.page.locator("p:has-text('Account has been verified !!!')");
            await expect(verificationMessage).toBeVisible(); // Assertion to verify visibility

            console.log('Verification message is visible.');
        } else {
            console.log('No href found for the link.');
        }
    }

    async fillfiled(user) {
        await this.page.locator('#cCode').click();
        await this.page.locator('.ng-dropdown-panel .ng-option', { hasText: user.CountryCode }).click();

    }
    async rolepeference(user) {
        const roleDropdown = this.page.locator('.ng-select-container:has-text("Role")');

        // Click the dropdown
        await roleDropdown.click();
        await this.page.waitForSelector('.ng-option');

        // Step 3: Click on the option with text "Auditor"
        await this.page.locator(`//span[normalize-space()="${user.RoleName}"]`).click();
        await this.page.locator('//ng-select[@placeholder="Preference"]').click();

        await this.page.locator(`div.textWrapDD[title="${user.Preference}"]`).click();


    }
    async clicksubmitbutton() {
        await this.page.locator("div[class='col-md-6 col-sm-6 col-xs-6'] button[type='submit']").click();
    }

    async EnterSearch() {
        await this.page.fill(this.Search, 'mamatha sangana');

    }
    async edit() {
        await this.page.locator('//mat-icon[contains(text(),"edit")]').click({ force: true });
    }
    async logout() {
        await this.page.locator('//div[@class="ui-controlbar"]').click();


        await this.page.locator('//a[@id="userDropdown"][@role="button"][@data-bs-toggle="dropdown"]/div/img').click();
        await this.page.locator('//a[contains(text(),"Logout")]').click();
    }

    async Verifycheckboxces(checkbox) {
        const checkboxLocator = this.page.locator(`//input[@id="${checkbox}"]`);
        await this.expect(checkboxLocator).toBeChecked();

    }

    async roleCreation(Rolename, roletag, description) {
        await this.rolemanagement.click();

        await this.role.click();
        await this.submit.click();
        const roleNameverification = await this.Rolename.textContent({ state: 'visible' });
        const RoleNametext = roleNameverification.trim();
        expect(RoleNametext).toBe("Please Enter Role Name");
        await this.rolename.fill(`${Rolename}`);
        await this.submit.click();

        const roletagverification = await this.roletag.textContent();
        const roletagfields = roletagverification.trim();

        console.log("data:", roletagfields);

        expect(roletagfields).toBe("Please enter role tag");

        await this.roleTag.fill(`${roletag}`);
        await this.desciption.fill(`${description}`)
        await this.submit.click();

    }


    async clearfields(firstname) {
        await this.page.locator(`//input[@name="${firstname}"]`).click();
        await this.page.keyboard.press('Control+A'); // Select all text (use 'Meta+A' for Mac)
        await this.page.keyboard.press('Backspace');
    }
    async button() {
        await this.submitbutton.click();
    }
    async errorverification() {
        const fields = await this.errormessage.textContent();
        const message = fields.trim();
        console.log(message);
        await this.expect(message).toBe("Please Enter First Name");
    }
    async fillfields(names) {
        await this.page.locator(this.nameInputSelector).fill(names);
    }
    async lastname(lastname) {
        await this.page.locator(this.lastNameInputSelector).fill(lastname);
    }
     async MobileNumber(number) {
        await this.page.locator('//input[@name="mobileNumber"]').fill(number.toString());
    }
    async CountryCode(CountryCode){

    }
    async lastNameverification() {
        const lastnamefield = await this.page.locator(this.lastNameErrorSelector).textContent();
        const message1 = lastnamefield.trim();
        console.log(message1);
        await this.expect(message1).toBe("Please Enter Last Name");
    }
     async mobileverification() {
        const lastnamefield = await this.page.locator(this.mobilenumber).textContent();
        const message1 = lastnamefield.trim();
        console.log(message1);
        await this.expect(message1).toBe("Please enter Phone Number");
    }
    
    async permissions(dashboard) {
        await this.Reports.check();

        await this.Dashboard.check();
        const Permissions = await this.checkboxes


        // Loop through and check each checkbox
        const count = await Permissions.count();
        for (let i = 0; i < count; i++) {
            const allpermissions = Permissions.nth(i);
            if (!(await allpermissions.isChecked())) {
                await allpermissions.check();
                // Check the checkbox if it's not already checked
            }
        }


        await this.homescreen.click();
        await this.page.locator(`//div[@role="option"]//span[text()="${dashboard}"]`).click();


        await this.savebutton.click();
        const successMessage = await this.successfulmessage.textContent();
        await expect(successMessage).toContain('Permissions Updated Successfully');
    }

    async verifySearchfunctinality(randomRoleName, user) {



        await this.page.locator('//button[@type="button"]/span[contains(text(), "Role")]/parent::button/parent::div/parent::div/div/div/input[@placeholder="Search..."]').fill(randomRoleName);
        // await this.page.locator('//button[text()="Search"]').click();
        const firstRowContent = await this.page.locator('//tr[@class="mat-mdc-row mdc-data-table__row cdk-row table-row custom-mat-column ng-star-inserted"][1]').textContent();
        console.log("firstrow:", firstRowContent);

        // // Check if the search result matches the expected data
        //expect(firstRowContent).includes(randomRoleName);
        expect(firstRowContent.includes(randomRoleName)).toBe(true);
        expect(firstRowContent.includes(user.RoleTag)).toBe(true);
        expect(firstRowContent.includes(user.description)).toBe(true);
        console.log(user.description);







    }
    async verifyPermissioneditfunctinality(randomRoleName, dashboard) {
        await this.page.locator('//button[@type="button"]/span[contains(text(), "Role")]/parent::button/parent::div/parent::div/div/div/input[@placeholder="Search..."]').fill(randomRoleName);

        // Locate the "edit" button in the first row and click it
        await this.page.locator('//tr[1]//td//mat-icon[text()="edit"]').click();

        await this.page.locator('//button[normalize-space()="Permissions"]').click();
        await this.Reports.uncheck();
        await this.homescreen.click();
        await this.page.locator(`//div[@role="option"]//span[text()="${dashboard}"]`).click();
        await this.savebutton.click();
        const successMessage = await this.successfulmessage.textContent();
        await expect(successMessage).toContain('Permissions Updated Successfully');
        await this.save.click();
        const savesuccess = await this.success.textContent();
        const savepopupmessage = savesuccess.trim();
        expect(savepopupmessage).toBe("Save Success")


    }
    
    async loginverification(url, username, password) {
        await this.page.goto(url);
        await this.name.fill(username);
        await this.password.fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();

        const verification = await this.page.locator('//div[contains(text(),"Invalid Credentials")]').textContent();
        const deleteverification = verification.trim();
        expect(deleteverification).toBe("Invalid Credentials");
        await this.page.waitForTimeout(2000);

    }
    async login(url, username, password) {
        await this.page.goto(url);

        await this.name.fill(username);
        await this.password.fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();

    }
    async Reportchaeckboxes() {
        await this.page.locator('//input[@id="alerts"]').click();
        await this.page.locator('//label[@for="createReport"]//preceding-sibling::input[@id="reports"]').check();
    }
    async deleteuser(){
         console.log('data available');
        await this.page.click('mat-icon:has-text("edit")');
        const modal = this.page.locator('.ui-modal');
        console.log('Clicking the Remove button...');
        await modal.locator('button:has-text("Remove")').evaluate((button) => button.click());
        await this.page.waitForTimeout(1000);
        console.log('Clicked on the Remove button.');
        await this.page.waitForSelector('.swal2-confirm', { state: 'visible' });
        await this.page.click('.swal2-confirm');
        console.log('Clicked on the "Yes" button in the confirmation dialog.');
    }
    async verifyToastmeasage(){
        const toastSelector = '#toast-container > div';

// Wait for the toast message to appear (if necessary)
await this.page.waitForSelector(toastSelector);

// Get the text content of the toast message
const toastMessage = await this.page.locator(toastSelector).textContent();
console.log(toastMessage);
const normalizedMessage = toastMessage.trim();

// Verify the toast message contains the expected substring
if (normalizedMessage.includes("updated")) {
    console.log("Toast message verified successfully");
} else {
    console.log(`Unexpected toast message: ${toastMessage}`);
}

// et the text content of the element


    }








}











module.exports = UserPage;

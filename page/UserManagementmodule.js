const { expect } = require('@playwright/test');
const { extractDataFromExcel } = require('../Utils/Excel.js');
const { saveScreenshot } = require('../Utils/ScreenshotHelper.js');
const { takeScreenshotWithTestCase } = require('../Utils/screenshotUtil.js');
const Modules = require('../Common Utils/modules.js');
//const { extractDataFromExcel } = require('../../Utils/Excel.js');
const path = require('path');
const xlsx = require('xlsx');


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
         this.rowsLocator = this.page.locator('//tbody[@role="rowgroup"]/tr');
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
        this.save = page.locator("//button[normalize-space()='save']");
        this.row='//tbody[@role="rowgroup"]/tr';
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
        this.edit=page.locator('//mat-icon[contains(text(),"edit")]');
        this.sensorSettingsSpan = page.locator('//span[@title="Sensor Settings"]');
    this.userManagementButton = page.locator('//button[@title="User Management"]');
    this.userSpan = page.locator("//span[normalize-space()='User']");

    }
//enter First and Last name fields and Mobile Number  and password, confirm password
    async dynamicLocator(title, Name) {
        await this.page.locator(`input[name="${title}"].form-control`).fill(String(Name));



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
   //  Click the country code dropdown
//Select the desired country code
    async countryCode(data) {
        await this.page.locator('#cCode').click();
        await this.page.locator('.ng-dropdown-panel .ng-option', { hasText: data.CountryCode }).click();

    }
    async rolepeference(data) {
        const roleDropdown = this.page.locator('.ng-select-container:has-text("Role")');

        // Click the dropdown
        await roleDropdown.click();
        await this.page.waitForSelector('.ng-option');

        // Step 3: Click on the option with text "Auditor"
        await this.page.locator(`//span[normalize-space()="${data.RoleName}"]`).click();
        await this.page.locator('//ng-select[@placeholder="Preference"]').click();

        await this.page.locator(`div.textWrapDD[title="${data.Preference}"]`).click();


    }
    //click on the submit  button
    async clicksubmitbutton() {
        await this.page.locator("div[class='col-md-6 col-sm-6 col-xs-6'] button[type='submit']").click();

    }
    //// Fills the search field with the provided search data

    async EnterSearch(data,testcaseName,Screenshotname,Status,testInfo) {
        await this.page.locator(this.Search).fill(data.Search);
                        await takeScreenshotWithTestCase(this.page, testcaseName, Screenshotname, Status, testInfo);


    }
    // Find the 'edit' icon on the page using its text.
// Click the icon, forcing the action even if it's not fully visible.
    async edituser(testInfo) {
       await this.page.locator('//mat-icon[contains(text(),"edit")]').click({ force: true });
         await takeScreenshotWithTestCase(this.page, "userCreation", "Editfunctinality" ,"passed", testInfo);


    
    }
    async crossbutton(){
         await this.page.locator("//div[@class='ui-controlbar']//span[@class='ng-star-inserted']").click();
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

    async roleCreation(Rolename, roletag, description,testCaseName,testInfo) {
        await this.rolemanagement.click();

        await this.role.click();
        await this.submit.click();
        const roleNameverification =await this.page.locator('#toast-container > div').textContent({ state: 'visible' });
       console.log(roleNameverification);
        const RoleNametext = roleNameverification.trim();
        expect(RoleNametext).toBe("Please Enter Role Name");
        console.log("verified message");
        await this.rolename.fill(`${Rolename}`);
        await this.submit.click();

        const roletagverification = await this.roletag.textContent();
        const roletagfields = roletagverification.trim();

        console.log("data:", roletagfields);

        expect(roletagfields).toBe("Please enter role tag");

        await this.roleTag.fill(`${roletag}`);
        await this.desciption.fill(`${description}`)
        await this.submit.click();
        await this.page.waitForTimeout(3000);
        await takeScreenshotWithTestCase(this.page,testCaseName, "Navigate to Permissons page", 'passed', testInfo);


    }


    async clearfields(firstname) {
        await this.page.locator(`//input[@name="${firstname}"]`).click();
        await this.page.keyboard.press('Control+A'); // Select all text (use 'Meta+A' for Mac)
        await this.page.keyboard.press('Backspace');
    }
    async button() {
        await this.submitbutton.click();
    }
    async errorverification(testInfo) {
        const fields = await this.errormessage.textContent();
        const message = fields.trim();
        console.log(message);
        await this.expect(message).toBe("Please Enter First Name");
    // await takeScreenshotWithTestCase(this.page, 'userMandetoryfields', 'please enter firstName', 'passed', testInfo);
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
    async Email(email){
        await this.page.locator('//input[@name="mailId"]').fill(email)
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
    
    async permissions(dashboard,testInfo) {
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
           await takeScreenshotWithTestCase(this.page,'RoleManagement', 'Permissions Updated Succssfully', 'passed', testInfo);

    }

    async verifySearchfunctinality(randomRoleName, data,testInfo) {



        await this.page.locator('//button[@type="button"]/span[contains(text(), "Role")]/parent::button/parent::div/parent::div/div/div/input[@placeholder="Search..."]').fill(randomRoleName);
        // await this.page.locator('//button[text()="Search"]').click();
        const firstRowContent = await this.page.locator('//tr[@class="mat-mdc-row mdc-data-table__row cdk-row table-row custom-mat-column ng-star-inserted"][1]').textContent();
        console.log("firstrow:", firstRowContent);

        // // Check if the search result matches the expected data
        //expect(firstRowContent).includes(randomRoleName);
        expect(firstRowContent.includes(randomRoleName)).toBe(true);
        expect(firstRowContent.includes(data.RoleTag)).toBe(true);
        expect(firstRowContent.includes(data.description)).toBe(true);
        console.log(data.description);
          await takeScreenshotWithTestCase(this.page,'RoleManagement', 'verify the search functinality', 'passed', testInfo);







    }
    async userediting(){
            const nameInputSelector = '//input[@name="name"]';
            
            // Clear and update the input field
            await this.page.locator(nameInputSelector).click(); // Focus on the input field
            await this.page.keyboard.press('Control+A'); // Select all text (use 'Meta+A' for Mac)
            await this.page.keyboard.press('Backspace'); // Clear the field
            
            // Wait for any potential external update script to finish
          
            // Adjust timeout if necessary
            
                const excelData = extractDataFromExcel(
                    'C:/Users/mamatha.sangana/Videos/Playwright_Automation/Common Utils/data.xlsx',
                    'usermanagement');
                const exceldata = excelData[0];
            
            // Enter the new value
            
            await this.page.locator(nameInputSelector).fill(exceldata.FirsttName); 
            await this.page.waitForTimeout(3000);
            const nameInputSelector1 = '//input[@name="lastname"]';
            
            
            // Clear and update the input field
            await this.page.locator(nameInputSelector1).click(); // Focus on the input field
            await this.page.keyboard.press('Control+A'); // Select all text (use 'Meta+A' for Mac)
            await this.page.keyboard.press('Backspace'); // Clear the field
            
            // Wait for any potential external update script to finish
            // Adjust timeout if necessary
            
            
            await this.page.locator(nameInputSelector1).fill(exceldata.LastName); 
    }
    async verifyPermissioneditfunctinality(randomRoleName, dashboard,testInfo) {
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
        expect(savepopupmessage).toBe("Save Success");
          await takeScreenshotWithTestCase(this.page,'RoleManagement', 'verify the permissions', 'passed', testInfo);


    }
    //Verify the deleted user's credentials are no longer valid (invalid credentials check)
    
    async loginverification(url, username, password) {
        await this.page.goto(url);
        await this.name.fill(username);
        await this.password.fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();

        const verification = await this.page.locator('//div[contains(text(),"Invalid Credentials")]').textContent();
        const deleteverification = verification.trim();
        expect(deleteverification).toBe("Invalid Credentials");

     

    }
    async deactivateuserlogin(url,username,password){
        await this.page.goto(url);
        await this.name.fill(username);
        await this.password.fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();
         const toast= await this.page.locator('#toast-container > div');
         const toastmessage=await toast.textContent();
         const gettoastmessage=toastmessage.trim();
         expect(gettoastmessage).toBe("Your Account Has Been Blocked. Please Contact Admin")


    }
    async Clickbuttons(data){
         const modal = this.page.locator('.ui-modal');
  console.log('The modal is visible.');

  // Take screenshots before and after deactivate

  await modal.locator(`button:has-text("${data}")`).evaluate((btn) => btn.click());

    }
   //Proceed to create a new user with the same details
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
    //user deletion
    async deleteuser(testInfo,testCaseName){
        //  console.log('data available');
        // await this.page.click('mat-icon:has-text("edit")');
        const modal = this.page.locator('.ui-modal');
        console.log('Clicking the Remove button...');
        await modal.locator('button:has-text("Remove")').evaluate((button) => button.click());
         await takeScreenshotWithTestCase(this.page,testCaseName, 'user Removed successfully', 'passed', testInfo);
       // await this.page.waitForTimeout(1000);
        console.log('Clicked on the Remove button.');
        await this.page.waitForSelector('.swal2-confirm', { state: 'visible' });
        await this.page.click('.swal2-confirm');
        console.log('Clicked on the "Yes" button in the confirmation dialog.');
         await takeScreenshotWithTestCase(this.page,testCaseName, 'user Removed successfully', 'passed', testInfo);


//          const toastSelector = '#toast-container > div';
// const toastMessage = await this.page.locator(toastSelector).textContent();
// const normalizedMessage = toastMessage.trim();
// expect(normalizedMessage).toBe(" Deleted Successfully");
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
    }
async userManagementPageverification(){
    const userManagementSpan = page.locator("//span[normalize-space()='User Management']");

  

  // Verify visibility
  await expect(userManagementSpan).toBeVisible();

}
async soringfuncctinality(testInfo){
    await this.page.locator('//button[@title="User Management"]').click();
        await takeScreenshotWithTestCase(this.page,'SortingTestcase', 'Navigate to userManagement', 'passed', testInfo);
    
  await this.page.locator('//div[@class="mat-sort-header-container mat-focus-indicator ng-tns-c10-0"]').click();
   const rows = this.page.locator('//tbody[@role="rowgroup"]/tr');
    const names = [];
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
        const nameCell = rows.nth(i).locator('td:nth-child(1)'); // Adjust `nth-child(1)` to your column index
        const nameText = await nameCell.textContent();
       console.log(names.push(nameText.trim()));
       
    }
    console.log("names:",names);
    const sortedNames = [...names].sort((a, b) => {
        if (a[0] === b[0]) return a.localeCompare(b); // If the first characters match, sort normally
        if (a[0].toUpperCase() === a[0] && b[0].toUpperCase() !== b[0]) return -1; // Uppercase comes before lowercase
        if (a[0].toUpperCase() !== a[0] && b[0].toUpperCase() === b[0]) return 1; // Lowercase comes after uppercase
        return a.localeCompare(b); // Default locale-based sorting
    });
    console.log("sortedNames:",sortedNames);
    expect(names).toEqual(sortedNames);
        await takeScreenshotWithTestCase(this.page,'SortingTestcase', 'accending order', 'passed', testInfo);
    await this.page.locator('//div[@class="mat-sort-header-stem ng-tns-c10-0"]').click();
   const namesDesc = [];
  for (let i = 0; i < rowCount; i++) {
    const nameCell = rows.nth(i).locator('td:nth-child(1)');
    const text = await nameCell.textContent();
    namesDesc.push(text.trim());
  }

  // Sort descending with lowercase first
  const sortedDescCustom = [...namesDesc].sort((a, b) => {
    const aIsLower = a[0] === a[0].toLowerCase();
    const bIsLower = b[0] === b[0].toLowerCase();

    if (aIsLower && !bIsLower) return -1;  // lowercase before uppercase for descending
    if (!aIsLower && bIsLower) return 1;

    // Same case - descending ignoring case
    return b.toLowerCase().localeCompare(a.toLowerCase());
  });
  console.log("sortedDescCustom",sortedDescCustom);


 await expect(namesDesc).toEqual(sortedDescCustom);
  await takeScreenshotWithTestCase(this.page,'SortingTestcase', 'descending order', 'passed', testInfo);



}
// button click by the user
async userbutton(){
    await this.userSpan.click();
}
 async navigateToUserManagement(testName,testInfo) {
    await this.userManagementButton.click();
    await expect(this.userSpan).toBeVisible();
    await saveScreenshot(this.page, testName, 'UserManagementPage',testInfo);
  }
async verifySensorSettingsVisible(testName,testInfo) {
    await expect(this.sensorSettingsSpan).toBeVisible();
    await saveScreenshot(this.page, testName, 'DashBoardPage',testInfo);
  }

  //user Creation
async userCreation(data,testCaseName,Screenshotname,Status,url,userId,password,username,testInfo){
     
                    const rows = await this.page.locator( this.row);
                     let isMatchFound = false;

                for (let i = 0; i < await rows.count(); i++) {
                    const row = rows.nth(i);
                    const cells = row.locator('td');
                    console.log(cells);

                    for (let j = 0; j < await cells.count(); j++) {
                        const cell = cells.nth(j);
                        const cellTitle = await cell.getAttribute('title');
                        console.log(cellTitle);

                        if (cellTitle && cellTitle === data.Search) {
                            console.log(`Match found in row ${i + 1}, cell ${j + 1}: ${cellTitle}`);
                            isMatchFound = true;
                            break;
                        }
                    }
                     if (isMatchFound) {
                        console.log("data is available");
                      await  this.edituser(testInfo);
                      //await this.page.waitForTimeout(3000);
                      await  this.deleteuser(testInfo,testCaseName);
                       await this.loginverification(url,userId,password);
                        await this.login(url, username, password);
                            const modules= new Modules(this.page);
                        await modules.verifyuserManagementpage("User Management",testCaseName,Screenshotname,Status,testInfo);
                        await  this.userbutton();
                        const fields = [
            { title: 'name', value: data.FirstName },
            { title: 'lastname', value: data.LastName },
            { title: 'mailId', value: data.EmailId },
             // Add title and Name dynamically
        ];
                      for (const field of fields) {
            await this.dynamicLocator(field.title, field.value);
            console.log(`Verified field: ${field.title} with value: ${field.value}`);
        }
      await  this.countryCode(data);
       await this.dynamicLocator("mobileNumber",data.PhoneNumber);
       // await this.page.waitForTimeout(3000);
       await this.page.waitForLoadState('networkidle')
      await  this.rolepeference(data);
      await  this.dynamicLocator('password', data.Password);
     await   this.dynamicLocator('confirmPassword', data.ConfirmPassword);
       await this.usercheckboxes();
        

       await this.clicksubmitbutton();
       // await this.page.waitForTimeout(3000);
        await this.page.waitForLoadState('networkidle')
      
                                   
 //await modules.verifyuserManagementpage("User Management","userCreation","User Created","passed",testInfo);
      //Navigate to outlook mail
       await this.outlook();
        //await this.page.waitForTimeout(3000);
         await this.page.waitForLoadState('networkidle')
         //Verify the email name
       await this.outlookVeification();
        await this.page.waitForLoadState('networkidle')

       // await this.page.waitForTimeout(3000);
       //click on the submit button
      await this.userEmailVerificationPage();
       await this.page.waitForTimeout(3000);
       // verify the verified message
      await this.VerificationLink();
       await this.page.waitForTimeout(3000);
  await takeScreenshotWithTestCase(this.page,testCaseName, 'userVerified successfully', 'passed', testInfo);

 }
    }
                      if (!isMatchFound) {
                    console.log('No match found for the search term:');
                   await this.userbutton();
                     const fields = [
            { title: 'name', value: data.FirstName },
            { title: 'lastname', value: data.LastName },
            { title: 'mailId', value: data.EmailId },
             // Add title and Name dynamically
        ];
                      for (const field of fields) {
            await this.dynamicLocator(field.title, field.value);
            console.log(`Verified field: ${field.title} with value: ${field.value}`);
        }
      await  this.countryCode(data);
       await this.dynamicLocator("mobileNumber",data.PhoneNumber);
       
      await  this.rolepeference(data);
      await  this.dynamicLocator('password', data.Password);
     await   this.dynamicLocator('confirmPassword', data.ConfirmPassword);
       await this.usercheckboxes();
       
         

       await this.clicksubmitbutton();
        await this.page.waitForTimeout(3000);

       
      await  this.outlook();
       await this.page.waitForTimeout(3000);
         
       await this.outlookVeification();
        await this.page.waitForTimeout(3000);
     
       await this.userEmailVerificationPage();
        await this.page.waitForTimeout(3000);

          
      await  this.VerificationLink();


                      }


}
}

  


    




















module.exports = UserPage;

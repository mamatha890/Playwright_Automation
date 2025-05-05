 
 const { test,expect,request} = require('@playwright/test');
 const Loginpage=require('../page/Loginpage.js');
 const Modules = require('../Common Utils/modules.js');
 const { extractDataFromExcel } = require('../Utils/Excel.js');
 const UserPage = require('../page/UserManagement.js')
 const RulePage = require('../page/Alert verification.js');
 test("Login",async({page,request})=>{
    const url=process.env.BASE_URL;
    const username=process.env.USERNAME1;
    const password=process.env.PASSWORD;
    const mydata = extractDataFromExcel("Common Utils/data.xlsx", "postmandata");
    

    const data = mydata[0]; // Use 'mydata', not 'Excel'
   /// console.log(data); 
    
    const login = new Loginpage(page);
    login.performLogin(url,username,password); 
    const user=new Modules(page);
    await user.menu("Alerts Management");
 
 
 await page.locator('//span[contains(text(),"Live Alerts")]/parent::button').click();
        const location = page.locator('//td[@title="Ideabytes"]').first();
        const Locationname = await location.textContent();
        const LocationField=await Locationname.trim();
        console.log("Locationname:", LocationField);
        await expect(data.Location).toContain(LocationField);
    const Devicename=page.locator('//td[@title="Dev001"]').first();
    const DevicenameField = await location.textContent();
        const DeviceName=await DevicenameField.trim();
        console.log("DeviceName:", DeviceName);
        await expect(data.Location).toContain(DeviceName);

      const Alert=page.locator('//td[@title="Critical"]').first();
    const AlertField= await Alert.textContent();
        const AlertName=await AlertField.trim();
        console.log("AlertName:", AlertName);
        await expect(data.Alert).toContain(AlertName);
        await page.locator('//i[@class="fa fa-cog fa-2x"]').click();
        const emailCheckbox = page.locator('div.mat-sort-header-content:has(span:text("Email")) input[type="checkbox"]');

        // Check if the checkbox is checked
        const isChecked = await emailCheckbox.isChecked();
        
        if (!isChecked) {
            console.log("Email checkbox is not enabled. Enabling it now...");
            await emailCheckbox.check(); // Click to enable the checkbox
        } else {
            console.log("Email checkbox is already enabled.");
        }
        
        const notoficationCheckbox = page.locator('div.mat-sort-header-content:has(span:text(" Notification ")) input[type="checkbox"]');

        // Check if the checkbox is checked
        const isCheckednotification = await notoficationCheckbox.isChecked();
        
        if (!isCheckednotification) {
            console.log("notofication checkbox is not enabled. Enabling it now...");
            await notoficationCheckbox.check(); // Click to enable the checkbox
        } else {
            console.log("Notification checkbox is already enabled.");
        }
        const locator = new UserPage(page);
    locator.outlook();
    await page.waitForTimeout(5000);
    locator.outlookVeification();
    await page.waitForTimeout(6000);
    const rulePage = new RulePage(page, expect);
    rulePage.Alertclick();
    await page.waitForTimeout(4000);
    rulePage.AlertVerification();
    });
        
           
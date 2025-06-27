const { test, expect } = require('@playwright/test');
const Modules = require('../../Common Utils/modules.js');
const { saveScreenshot } = require('../../Utils/ScreenshotHelper.js');
const UserPage = require('../../page/UserManagementmodule.js');
const { extractDataFromExcel } = require('../../Utils/Excel.js');
const path = require('path');

test.beforeEach(async ({ context, page }) => {
    const session = new Modules(page, context);
    await session.sessionstorage();
});
test("userManagement fields Validations", async ({ page },testInfo) => {
const excelData = extractDataFromExcel(path.join(__dirname, '..', '..', 'Common Utils', 'data.xlsx'), 'usermanagement');

    const data = excelData[0];
    const mydata = excelData[1];
    const exceldata = excelData[2];
    const excelrow3 = excelData[3];
    const excelrow4 = excelData[4];
    const excelrow5 = excelData[5];
    const testName = 'userValidations';
    const userManagement = new UserPage(page);
    await test.step('Navigate to the Dashboard page', async () => {
    userManagement.verifySensorSettingsVisible(testName,testInfo);
    });
    await test.step('Navigate to the UserManagement page', async () => {
    userManagement.navigateToUserManagement(testName,testInfo);
    });
 
    userManagement.EnterSearch(data);
    await page.waitForTimeout(3000);
    const rows = page.locator('//tbody[@role="rowgroup"]/tr');
    let isMatchFound = false;
    for (let i = 0; i < await rows.count(); i++) {
        const row = rows.nth(i);
        const cells = row.locator('td');
        console.log("row", row)
        for (let j = 0; j < await cells.count(); j++) {
            const cell = cells.nth(j);
            const cellTitle = await cell.getAttribute('title');
            // Get the title attribute of the cell
            console.log("cellTitle:", cellTitle);

            if (cellTitle && cellTitle === data.Search) {
                console.log(`Match found in row ${i + 1}, cell ${j + 1}: ${cellTitle}`);
                isMatchFound = true;
                break;
            }
        }
        if (isMatchFound) {
            userManagement.userbutton();
          
            const fields = [
                { title: 'name', value: data.FirsttName },
                { title: 'lastname', value: data.LastName },
                { title: 'mailId', value: data.EmailId }
            ];
            for (const field of fields) {
                await userManagement.dynamicLocator(field.title, field.value);
            }
            await userManagement.fillfiled(data);
            await userManagement.dynamicLocator('mobileNumber', data.PhoneNumber);
            await userManagement.rolepeference(data);
            await userManagement.dynamicLocator('password', data.Password);
            await userManagement.dynamicLocator('confirmPassword', data.ConfirmPassword);
            await userManagement.usercheckboxes();
            await page.waitForTimeout(3000);
            await userManagement.clicksubmitbutton();
            const toast = new Modules(page);
            toast.toastmessages(data.toastmessage,testName,testInfo);
            await page.waitForTimeout(3000);
            await userManagement.clearfields("name");
            await userManagement.fillfields(mydata.FirsttName);
            await userManagement.button();
            await page.waitForTimeout(3000);
            toast.toastmessages(data.emailvalidation,testName,testInfo);
            await page.waitForTimeout(3000);
            await userManagement.Email(exceldata.EmailId,testInfo);
            await userManagement.button();
             toast.toastmessages(data.wrongemail,testName,testInfo);
            await page.waitForTimeout(5000);
            await userManagement.clearfields("mailId");
            await userManagement.Email(mydata.EmailId);
             await userManagement.button();
            toast.toastmessages(data.mobilevalidation,testName,testInfo);
            await page.waitForTimeout(3000);
            await userManagement.clearfields("mobileNumber");

           

            await userManagement.MobileNumber(mydata.PhoneNumber);

            await userManagement.button();
        
         const toastmeassage = await page.locator('#toast-container > div').first();

            const getmessage = await toastmeassage.textContent();
            const getText = getmessage.trim();
            const Expectedtext =data.mobilelimit

            expect(await getText).toBe(Expectedtext);
            await page.waitForTimeout(3000);
             //const screenshotName = `${expectedToastMessage.substring(0, 100).replace(/\s+/g, '_')}`;

       
             await userManagement.MobileNumber(data.PhoneNumber);
             await page.waitForTimeout(3000);
        
           await userManagement.MobileNumber(exceldata.PhoneNumber);
             await userManagement.button();
            toast.toastmessages(data.mobilelimit,testName,testInfo);
            await page.waitForTimeout(3000);
             await userManagement.MobileNumber(data.PhoneNumber);
             await page.waitForTimeout(3000);
           
            await userManagement.dynamicLocator('password', mydata.Password);
          
            await userManagement.dynamicLocator('confirmPassword', mydata.ConfirmPassword);
            await userManagement.button();
            toast.toastmessages(data.passwordmissmatch,testName,testInfo);
            await page.waitForTimeout(3000);
       

             await userManagement.dynamicLocator('password', exceldata.Password);
         
            await userManagement.dynamicLocator('confirmPassword', exceldata.ConfirmPassword);
            await userManagement.button();
            
           const toastmeassage1 = await page.locator('#toast-container > div').first();
            const getmessage1 = await toastmeassage1.textContent();
           const getText1 = getmessage1.trim();
            const Expectedtext1 =data.passwordvalidation;
               expect(await getText1).toBe(Expectedtext1);
               await page.waitForTimeout(3000);
             

          
              await userManagement.dynamicLocator('password', excelrow3.Password);
         
            await userManagement.dynamicLocator('confirmPassword', excelrow3.ConfirmPassword);
             await userManagement.button();
               await page.waitForTimeout(3000);
             toast.toastmessages(data.passwordvalidation,testName,testInfo);
             await page.waitForTimeout(3000);
      
             await userManagement.dynamicLocator('password', excelrow4.Password);

             await userManagement.dynamicLocator('confirmPassword', excelrow4.ConfirmPassword);
             toast.toastmessages(data.passwordvalidation,testName,testInfo);
           
              await page.waitForTimeout(3000);
             await userManagement.dynamicLocator('password', excelrow5.Password);

             await userManagement.dynamicLocator('confirmPassword', excelrow5.ConfirmPassword);
              await userManagement.button();

             toast.toastmessages(data.passwordvalidation,testName,testInfo);
           
             userManagement.crossbutton();
            
           // toast.logoutfunctinality();
          await page.locator('//div[@title="IoT"]').click();
          await page.locator('//a[contains(text(),"Logout")]').click();

            break;
        }
 }

   if (!isMatchFound) {
        console.log('No match found for the search term:', data.Search);
    }
 });
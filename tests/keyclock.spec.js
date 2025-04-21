const { test,expect } = require('@playwright/test');
const keyclock=require('../page/keyclock.js');

test("keyclock login",async({page})=>{
    
    const login=new keyclock(page);
    const URL=process.env.KEYCLOCKURL;
    const USERNAME=process.env.KEYCLOCKUSERNAME;
    const PASSWORD=process.env.KEYCLOCKPASSWORD;
    const INVALID_USERNAME = "invalid_user@ideabytes.com"; // Invalid username
    const INVALID_PASSWORD = "wrong_password";
    console.log("Testing negative scenario...");
    await login.keyclocklogin(URL, INVALID_USERNAME, INVALID_PASSWORD);

    
    const errorMessage = page.locator('//span[contains(text(),"Invalid username or password")]'); // Adjust selector to match the actual error message
    await expect(errorMessage).toBeVisible();
    console.log("Error message validated for invalid credentials.");
    await page.waitForTimeout(2000);



   await  login.keyclocklogin(URL,USERNAME,PASSWORD);
   await page.waitForTimeout(2000);
    


    
});

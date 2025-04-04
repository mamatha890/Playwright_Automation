const { test } = require('@playwright/test');
const fs = require('fs');
require('dotenv').config();

test('Save Session Storage for Persistent Login', async ({ page }) => {
    const URL = process.env.BASE_URL;
    const username = process.env.USERNAME1;
    const password = process.env.PASSWORD;

    await page.goto(URL);

    // Fill login details
    await page.getByRole('textbox', { name: 'Enter your username' }).fill(username);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
    const captchaSrc = await page.locator("//img[@alt='captcha image']").getAttribute('src');
    console.log('Captcha source:', captchaSrc);
    
    const captchaImageNumber = captchaSrc.split('/').pop();
  
    const captchaValues = {
      "captcha1.png": "r3t7PK",
      "captcha2.png": "jg4VdU",
      "captcha3.png": "mMpdoF",
      "captcha4.png": "sALetS",
      "captcha5.png": "'coIsu2",
      "captcha6.png": "BP2XBI",
      "captcha7.png": "To0W0z",
      "captcha8.png": "MPFO8H",
      "captcha9.png": "CkPpTQ",
      "captcha10.png": "f9zPMo",
      "captcha11.png": "VUC391",
      "captcha12.png": "sUk0U8",
      "captcha13.png": "5gEPOD",
      "captcha14.png": "sPfWKI",
      "captcha15.png": "2EHvzQ",
      "captcha16.png": "B4K8z9",
      "captcha17.png": "ZXaDvV",
      "captcha18.png": "7K38Pb",
      "captcha19.png": "F6AEUb",
      "captcha20.png": "nqvY2m",
    };
    // Solve captcha if necessary
    

    const extractedCaptcha = captchaValues[captchaImageNumber];
    await page.locator('//input[@placeholder="Enter Captcha"]').fill(extractedCaptcha);

    await page.getByRole('button', { name: 'Login' }).click();

    

    await page.waitForURL("https://qa_env.ibiot.net/pages/analytics/tracking");

    await page.context().storageState({ path: 'playwright/.auth/auth.json' });
 
   
    const sessionStorageData = await page.evaluate(() => JSON.stringify(sessionStorage));
    fs.writeFileSync('playwright/.auth/session.json', sessionStorageData, 'utf-8');
 
    console.log('✅ Authentication state and sessionStorage saved!',sessionStorageData);

    setInterval(async () => {
      try {
        console.log('🔄 Refreshing access token...');
        const updatedSessionStorageData  = await page.evaluate(() => JSON.stringify(sessionStorage));
        


        fs.writeFileSync('playwright/.auth/session.json', updatedSessionStorageData, 'utf-8');
      } catch (error) {
        console.error('❌ Failed to refresh token:', error);
      }
    }, 840000);
  
    console.log('✅ Token refresh and session storage updates completed.');

     // Refresh every 1 second
     await page.pause();
     
  });
   
  


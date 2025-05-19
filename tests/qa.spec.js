const { test } = require('@playwright/test');
const fs = require('fs');
require('dotenv').config();

test('Save Session Storage for Persistent Login', async ({ page }) => {
    const URL = process.env.BASE_URL;
    const username = process.env.USERNAME1;
    const password = process.env.PASSWORD;
    const home_url=process.env.HOME_URL;

    await page.goto(URL);

    // Fill login details
    await page.getByRole('textbox', { name: 'Enter your username' }).fill(username);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
    await page.waitForTimeout(1800);
    // await page.click('//span[@class="input-group-text"]//span[contains(@class, "fa-eye")]');
    //     const captchaText = await page.textContent('div.captcha-container marquee.marquee-text');
    //     const abcd = captchaText.trim();
    //   console.log('Captured CAPTCHA Text:', abcd);
    //   await page.fill('input[name="capt"]', abcd);

    await page.getByRole('button', { name: 'Login' }).click();

    

    await page.waitForURL(home_url);

    await page.context().storageState({ path: 'playwright/.auth/auth.json' });
 
   
    const sessionStorageData = await page.evaluate(() => JSON.stringify(sessionStorage));
    fs.writeFileSync('playwright/.auth/session.json', sessionStorageData, 'utf-8');
 
    console.log('✅ Authentication state and sessionStorage saved!',sessionStorageData);

//     setInterval(async () => {
//       try {
//         console.log('🔄 Refreshing access token...');
//         const updatedSessionStorageData  = await page.evaluate(() => JSON.stringify(sessionStorage));
        


//         fs.writeFileSync('playwright/.auth/session.json', updatedSessionStorageData, 'utf-8');
//       } catch (error) {
//         console.error('❌ Failed to refresh token:', error);
//       }
//     }, 840000);
  
//     console.log('✅ Token refresh and session storage updates completed.');

//      // Refresh every 1 second
//      await page.pause();
     
//   });
});
   
  


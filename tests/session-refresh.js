const { chromium } = require('@playwright/test');
const fs = require('fs');

// Function to introduce a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const URL = process.env.BASE_URL;
    const username = process.env.USERNAME1;
    const password = process.env.PASSWORD;

    const authDir = 'playwright/.auth';

    // Ensure the .auth directory exists
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    // Function to login, store session, and logout
    const loginStoreAndLogout = async () => {
        const browser = await chromium.launch({ headless: false }); // Keep browser open
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('https://qa_env.ibiot.net/IoT/login');

        // Login
        await page.getByRole('textbox', { name: 'Enter your username' }).fill('mamatha.sangana@ideabytes.com');
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('6M234D');

        const captchaSrc = await page.locator("//img[@alt='captcha image']").getAttribute('src');
        const captchaImageNumber = captchaSrc.split('/').pop();

        const captchaValues = {
  "captcha20.png": "nqvY2m",
  "captcha19.png": "F6AEUb",
  "captcha18.png": "7K38Pb",
  "captcha17.png": "ZXaDvV",
  "captcha16.png": "B4K8z9",
  "captcha15.png": "2EHvzQ",
  "captcha14.png": "sPfWKI",
  "captcha13.png": "5gEPOD",
  "captcha12.png": "sUk0U8",
  "captcha11.png": "VUC391",
  "captcha10.png": "f9zPMo",
  "captcha9.png": "CkPpTQ",
  "captcha8.png": "MPFO8H",
  "captcha7.png": "To0W0z",
  "captcha6.png": "BP2XBI",
  "captcha5.png": "coIsu2",
  "captcha4.png": "sALetS",
  "captcha3.png": "mMpdoF",
  "captcha2.png": "jg4VdU",
  "captcha1.png": "r3t7PK"
        };

        await page.locator('//input[@placeholder="Enter Captcha"]').fill(captchaValues[captchaImageNumber]);
        await page.getByRole('button', { name: 'Login' }).click();
      

        if (await page.locator('.swal2-popup.swal2-modal.swal2-icon-warning.swal2-show').isVisible()) {
            console.log('Dialog is visible. Clicking "Yes" button...');
            await page.locator("(//button[normalize-space()='Yes'])").click();
        } else {
            console.log('Dialog is not visible. Continuing...');
        }
        
            // Check if the dialog text matches the expected message
           
        
        await page.waitForURL("https://qa_env.ibiot.net/pages/analytics/tracking");

        // Save session storage
        const sessionStorageData = await page.evaluate(() => JSON.stringify(sessionStorage));
        fs.writeFileSync(`${authDir}/session.json`, sessionStorageData, 'utf-8');

        console.log('✅ Session storage saved with new token!', sessionStorageData);

       await page.locator("//div[@class='nav-item dropdown col']").click();
await page.locator("body app-root app-appheader a:nth-child(2)").click();

        // Log out (assuming you have a logout button with a role 'button' and a text 'Logout')
        //await page.getByRole('button', { name: 'Logout' }).click();
        await page.waitForURL("https://qa_env.ibiot.net/IoT/login"); // Wait for the login page to load

        console.log('🔐 Logged out successfully.');

        // Close the browser after logging out
        await browser.close();
    };

    // Function to initiate login -> logout -> login every 14 minutes
    const initiateLoginProcess = async () => {
        // Perform initial login, store session, and logout
        await loginStoreAndLogout();

        // Wait for 14 minutes (840,000 ms) before repeating the process
        setInterval(async () => {
            console.log('🔄 Repeating login -> logout process...');
            await loginStoreAndLogout(); // Repeat login, logout, and session storage saving
        },10000);  // 840,000ms = 14 minutes
    };

    // Start the login -> logout -> login cycle
    await initiateLoginProcess();
})();
 
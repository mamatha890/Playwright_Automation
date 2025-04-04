const { chromium } = require('@playwright/test');
const fs = require('fs');

async function globalSetup() {
  // Launch browser in non-headless mode for debugging
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Environment variables
  const URL = process.env.BASE_URL;
  const username = process.env.USERNAME1;
  const password = process.env.PASSWORD;

  console.log('Navigating to URL:', URL);
  await page.goto(URL);

  // Fill in login details
  console.log('Filling login details...');
  await page.getByRole('textbox', { name: 'Enter your username' }).fill(username);
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);

  // Handle captcha
  const captchaSrc = await page.locator("//img[@alt='captcha image']").getAttribute('src');
  console.log('Captcha source:', captchaSrc);

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

  const captchaImageNumber = captchaSrc.split('/').pop();
  const extractedCaptcha = captchaValues[captchaImageNumber] || '';
  if (!extractedCaptcha) {
    console.error('Captcha value not found!');
    await browser.close();
    return;
  }
  console.log('Captcha value:', extractedCaptcha);

  await page.locator('//input[@placeholder="Enter Captcha"]').fill(extractedCaptcha);

  // Perform login
  await page.getByRole('button', { name: 'Login' }).click();

 

  // Capture local storage data
  const sessionStorageData = await page.evaluate(() => {
    const data = {};
    for (let i = 0; i < session.length; i++) {
      const key = sessionStorage.key(i);
      data[key] = sessionStorage.getItem(key);
    }
    return data;
  });
  console.log('LocalStorage Data:', sessionStorageData);

  // Save local storage data to a file
  fs.writeFileSync('sessionStorage.json', JSON.stringify(sessionStorageData, null, 2));
  console.log('LocalStorage state saved to localStorage.json');

  // Save authentication storage state
  // await context.storageState({ path: './auth.json' });
  console.log('Authentication state saved to auth.json');


}

module.exports = globalSetup;

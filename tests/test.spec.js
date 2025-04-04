import { test, expect } from '@playwright/test';

const LoginPage = require('../page/login');
const { captureScreenshot } = require('../Screenshots/screenhots');
test.afterEach(async ({ page }, testInfo) => {
    await captureScreenshot(page, testInfo);
  });


const url = process.env.BASE_URL
 

const Username = process.env.USERNAME

const Password = process.env.PASSWORD

 
// const { LoginPage } = require('../PageObjectModel/Login');
test('Login Test', async ({ page }) => {
 
    const example = new LoginPage(page)
   
   
 
    await example.performLogin(url, Username, Password)
 
})
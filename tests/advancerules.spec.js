const { test } = require('@playwright/test');
const AlarmSetupPage = require('../page/AlarmSetupPage.js');
const fs = require('fs');

test.beforeEach(async ({ context, page }) => {
    // Load authentication state (cookies + localStorage)
    const sessionStorage = JSON.parse(fs.readFileSync('playwright/.auth/session.json', 'utf-8'));
    await context.addInitScript(storage => {
      // if (window.location.hostname === 'qa_env.ibiot.net') {
        for (const [key, value] of Object.entries(storage))
          window.sessionStorage.setItem(key, value);
      // }
    }, sessionStorage);
  
    await page.goto(process.env.HOME_URL);
  });


test('login',async({page})=>{
    const alarmSetupPage1= new AlarmSetupPage(page);

  
   
  
    // Login to the application
    // Set up an alarm
    const rule ="30"; // Example rule data
    await alarmSetupPage1.setupAlarm(rule);
});



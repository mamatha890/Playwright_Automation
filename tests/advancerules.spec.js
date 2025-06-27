const { test ,context} = require('@playwright/test');
const AlarmSetupPage = require('../page/AlarmSetupPage.js');
const Modules = require('../Common Utils/modules.js');
const fs = require('fs');

test.beforeEach(async ({ context, page }) => {
    const session = new Modules(page, context);
    await session.sessionstorage();
});
test('login',async({page})=>{
    const alarmSetupPage1= new AlarmSetupPage(page);

  
   
  
    // Login to the application
    // Set up an alarm
    const rule ="30"; // Example rule data
    await alarmSetupPage1.setupAlarm(rule);
});



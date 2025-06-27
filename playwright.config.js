
import { defineConfig, devices } from '@playwright/test';
import dotenv from "dotenv";
const CustomReporter = require('./sendEmail');
const CustomReport=require('./Utils/Custome.js')

dotenv.config({
  path: `./Env/.env.${process.env.ENV}`
  
},
console.log(`./Env/.env.${process.env.ENV}`));

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  workers: 1,
  timeout:60000,
  use: {
  trace: 'on-first-retry', 
 screenshot: 'on',// Or 'on', to always capture traces
},







  //reporter: [['html', { outputFolder: 'playwright-report' }]],










  projects: [
    {
      name: 'chromium',
    }
  ],




   reporter:[
     // For console output
    ['html', { outputFolder: 'report/html-report', open: 'never' }], ['./sendEmail.js'],['./Utils/Custome.js']
],

  //  reporter: [
   // ['list'],  // Default console reporter
  //  ['allure-playwright']
 // ],
  

  use: {
     screenshot: 'on', //


    // 30 seconds for navigation

    firefoxUserPrefs: {
      'pdfjs.disabled': true, // Disable the built-in PDF viewer
    },
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'], // Maximize browser window
    },

// Capture screenshots only for failed tests
   // video: 'retain-on-failure',
     video: 'on',
    trace: 'on',
    browserName:'chromium', // Set the browser to Chromium
    headless: false, // Set to false to see the browser actions

  }
  


});





// Other configuration settings















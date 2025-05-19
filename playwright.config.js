
import { defineConfig, devices } from '@playwright/test';
import dotenv from "dotenv";
dotenv.config({
path:`./Env/.env.${process.env.ENV}`
});

export default defineConfig({
  testDir: './tests',

  
  
    
   projects: [
    {
      name:'chromium',
    }    
  ],
testMatch: ['tests/*spec.js'],
  


  reporter: [
  // For console output
    ['html', { outputFolder: 'report/html-report', open: 'never' }], // HTML reports in the report folder
 // JSON report
  ],
  
   timeout:100000,
  use: {
     firefoxUserPrefs: {
    'pdfjs.disabled': true, // Disable the built-in PDF viewer
       },
       viewport: null,
       launchOptions: {
        args: ['--start-maximized'], // Maximize browser window
      },
    
    screenshot: 'only-on-failure', // Capture screenshots only for failed tests
    video: 'retain-on-failure',
    trace:'on',
    browserName:'chromium', // Set the browser to Chromium
    headless: false, // Set to false to see the browser actions
  
}
  

});
   




  // Other configuration settings




 










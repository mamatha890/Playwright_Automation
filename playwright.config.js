
import { defineConfig, devices } from '@playwright/test';
import dotenv from "dotenv";
dotenv.config({
path:`./Env/.env.${process.env.ENV}`
});

export default defineConfig({
  testDir: './tests',
  
  
    
   projects: [
    {
      name: 'chromium',
    }    
  ],
testMatch: ['tests/*spec.js'],
  


  reporter: [
  // For console output
    ['html', { outputFolder: 'report/html-report', open: 'never' }], // HTML reports in the report folder
 // JSON report
  ],
  use: {
    
    screenshot: 'only-on-failure', // Capture screenshots only for failed tests
    video: 'retain-on-failure',
    trace:'on',
    browserName: 'chromium', // Set the browser to Chromium
    headless: false, // Set to false to see the browser actions
    launchOptions: {
      args: [
        '--no-sandbox', // Disable sandbox
        '--disable-setuid-sandbox', // Disable setuid sandbox
        '--disable-extensions', // Disable extensions
        '--disable-gpu' // Disable GPU acceleration
    ]
   
    },
   
    launchOptions: {
     // Disable PDF viewer
    },
    headless: false,
    projects: [
      {
        name: 'chromium',
        use: { browserName: 'chromium' },
      },
    ], // Optional: Set to true for headless mode

  
  }
  

});
   




  // Other configuration settings




 










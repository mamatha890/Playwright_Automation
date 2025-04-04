
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
    trace:'on' 
  
  
  }
  
});
   




  // Other configuration settings




 










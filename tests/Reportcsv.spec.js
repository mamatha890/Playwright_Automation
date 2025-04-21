const { test, expect } = require('@playwright/test');
const ReportsPage = require('../page/Reports.js');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const Modules = require('../Common Utils/modules.js');
const { extractDataFromExcel } = require('../Utils/Excel.js');



test.beforeEach(async ({ context, page }) => {
  const session = new Modules(page, context);
  await session.sessionstorage();
});

test('Generate Report Test with Dynamic Data', async ({ page }) => {

  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number
  const reportName = `mamatha${randomSuffix}`;
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 5); // 2nd of last month
  const endDate = new Date(today.getFullYear(), today.getMonth(), 3);

  const reportsPage = new ReportsPage(page, expect);
  const ReadExcelValues = extractDataFromExcel(
    'C:/Users/mamatha.sangana/Videos/Playwright_Automation/Common Utils/data.xlsx',
    'Reports'
  );
  const row = ReadExcelValues[0];
  const normalizedRow = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key.trim(), value])
  );

  const reportData = {
    region: normalizedRow['Region'],
    model: normalizedRow['Model'],
    device: normalizedRow['Device'],
    sensor: normalizedRow['Sensor'],
    startDate,
    endDate,
    reportName
  };
  console.log(reportData);


  await reportsPage.navigateToReports();
  await page.waitForTimeout(2000);
  await reportsPage.selectCreateReport();
  await page.waitForTimeout(3000);
  await reportsPage.CVS();
  await page.waitForTimeout(3000);

  await reportsPage.configureReport(reportData);
  await page.waitForTimeout(3000);
  await reportsPage.clickondemand();
  await reportsPage.ReportCSVverification();
});
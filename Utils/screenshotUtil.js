const fs = require('fs');
const path = require('path');

function getDateFolder() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getIndiaDateTime() {
  const now = new Date();
  const indiaTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const year = indiaTime.getUTCFullYear();
  const month = (indiaTime.getUTCMonth() + 1).toString().padStart(2, '0');
  const date = indiaTime.getUTCDate().toString().padStart(2, '0');
  const hours = indiaTime.getUTCHours().toString().padStart(2, '0');
  const minutes = indiaTime.getUTCMinutes().toString().padStart(2, '0');
  const seconds = indiaTime.getUTCSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${date}_${hours}-${minutes}-${seconds}`;
}

function ensureTestCaseFolders(basePath, testCaseName) {
  const passedPath = path.join(basePath, testCaseName, 'passed');
  const failedPath = path.join(basePath, testCaseName, 'failed');

  [passedPath, failedPath].forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
}

async function takeScreenshotWithTestCase(page, testCaseName, prefix, status = 'passed', testInfo = null) {
  const dateFolder = getDateFolder();
  const timestamp = getIndiaDateTime();
   
  // Sanitize test case name and prefix for folder and filenames
  const cleanTestCaseName = testCaseName.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');
  const cleanPrefix = prefix.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');

  // Base folder path: screenshots/YYYY-MM-DD
  const baseFolderPath = path.join('screenshots', dateFolder);

  // Ensure test case folders and subfolders are created
  ensureTestCaseFolders(baseFolderPath, cleanTestCaseName);

  // File path: screenshots/YYYY-MM-DD/TestCaseName/status/fileName.png
  const folderPath = path.join(baseFolderPath, cleanTestCaseName, status);
  const fileName = `${cleanPrefix}_${timestamp}.png`;
  const filePath = path.join(folderPath, fileName);

  await page.screenshot({ path: filePath, fullPage: true });
  //console.log(`Screenshot saved: ${filePath}`);

  // Attach screenshot to test report with name
  if (testInfo) {
    const attachmentName = `Screenshot - ${cleanTestCaseName}: ${cleanPrefix}`;
    await testInfo.attach(attachmentName, {
      path: filePath,
      contentType: 'image/png',
    });
  }
}

module.exports = { takeScreenshotWithTestCase };

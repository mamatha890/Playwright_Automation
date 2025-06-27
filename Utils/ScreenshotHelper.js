const fs = require('fs');
const path = require('path');

const screenshotsBaseDir = path.join(__dirname, 'screenshots');

if (!fs.existsSync(screenshotsBaseDir)) {
  fs.mkdirSync(screenshotsBaseDir);
} else {
  fs.rmSync(screenshotsBaseDir, { recursive: true, force: true });
  fs.mkdirSync(screenshotsBaseDir);
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

async function saveScreenshot(page, testName, screenshotName = 'screenshot', testInfo) {
  const testFolder = path.join(screenshotsBaseDir, testName);
  if (!fs.existsSync(testFolder)) {
    fs.mkdirSync(testFolder, { recursive: true });
  }
  const timestamp = getIndiaDateTime();
  const browserName = page.context().browser()?.browserType().name() || 'browser';

  const filename = `${testName}_${screenshotName}_${browserName}_${timestamp}.png`;

  // Sanitize filename for disk (replace spaces/special chars to avoid OS issues)
  const safeFileName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

  const filepath = path.join(testFolder, safeFileName);

  console.log('Saving screenshot:', filename);
  console.log('Safe filename for disk:', safeFileName);
  console.log('Full path:', filepath);

  await page.screenshot({ path: filepath });

  if (testInfo) {
    testInfo.attach(`${testName} - ${screenshotName}`, {
      path: filepath,
      contentType: 'image/png',
    });
  }
}

module.exports = { saveScreenshot };

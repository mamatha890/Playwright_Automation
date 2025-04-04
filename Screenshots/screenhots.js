const fs = require('fs');
const path = require('path');

async function captureScreenshot(page, testInfo) {
  try {
    // Determine the folder based on the test's status
    const folderPath = testInfo.status === 'passed'
      ? path.join(__dirname, 'artifacts/screenshots/passed')
      : path.join(__dirname, 'artifacts/screenshots/failed');

    // Ensure the folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Generate a filename based on the test title
    const fileName = `${testInfo.title.replace(/[\s:]/g, '_')}.png`;

    // Take a screenshot and save it
    await page.screenshot({ path: path.join(folderPath, fileName) });
  } catch (error) {
    console.error('Error while saving screenshot:', error);
  }
}

module.exports = { captureScreenshot };

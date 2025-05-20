const fs = require('fs');
const path = require('path');

class ScreenshotHelper {
  async captureScreenshot(page, testInfo) {
    try {
      const folderPath = testInfo.status === 'passed'
        ? path.join(__dirname, '../Screenshots/passed')
        : path.join(__dirname, '../Screenshots/failed');

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const fileName = `${testInfo.title.replace(/[\s:]/g, '_')}.png`;
      await page.screenshot({ path: path.join(folderPath, fileName) });
    } catch (error) {
      console.error('Error while saving screenshot:', error);
    }
  }
}

module.exports = ScreenshotHelper;

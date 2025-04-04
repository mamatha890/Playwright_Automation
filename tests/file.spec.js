const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Hook to capture screenshots after each test
test.afterEach(async ({ page }, testInfo) => {
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
});

// Example Test Case 1: Passing Test
test('Homepage should load correctly', async ({ page }) => {
  await page.goto('https://qa_env.ibiot.net/IoT/login');
  await expect(page).toHaveTitle('Example Domain'); // Should pass
});

// Example Test Case 2: Failing Test
test('Should find a non-existent element', async ({ page }) => {
  await page.goto('');
  const nonExistentElement = page.locator('#non-existent-element');
  await expect(nonExistentElement).toBeVisible(); // Should fail
});

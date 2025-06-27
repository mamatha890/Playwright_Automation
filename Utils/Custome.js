const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');


class CustomReport {
  constructor() {
    this.results = [];
  }

  getLocalTime(date = new Date()) {
    const localDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000); // Convert UTC to IST (UTC+5:30)
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(localDate.getDate()).padStart(2, '0');
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    const seconds = String(localDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
  }

  onTestBegin(test) {
    console.log(`Test Started: ${test.title}`); // Log the dynamic test case name
  }

  onTestEnd(test, result) {
    const testCaseName = test.title; // Fetch test case name dynamically
    const status = result.status === 'passed' ? 'Passed' : 'Failed';
    const startTime = this.getLocalTime(result.startTime); // Use local time for start
    const endTime = this.getLocalTime(); // Use local time for end
    const duration = `${(result.duration / 1000).toFixed(2)} seconds`;

    let errorMessage = '';
    if (result.errors && result.errors.length > 0) {
      errorMessage = result.errors.map((err) => err.message).join('; '); // Combine multiple errors
    }

    console.log(`Test Case Name: ${testCaseName}, Status: ${status}`);
    if (errorMessage) {
      console.error(`Error in ${testCaseName}: ${errorMessage}`);
    }

    this.results.push({
      TestCaseName: testCaseName,
      Status: status,
      StartTime: startTime,
      EndTime: endTime,
      Duration: duration,
      ErrorMessage: errorMessage || 'N/A', // Include error message if any
    });

    // Throw an error if the test failed
    if (status === 'Failed') {
      throw new Error(`Test case "${testCaseName}" failed: ${errorMessage}`);
    }
  }

  async onEnd() {
    console.log('Test Execution Completed. Generating Report...');
    await this.generateExcelReport();
  }

  async generateExcelReport() {
    // Generate folder path based on the current date (YYYY-MM-DD)
    const currentDate = this.getLocalTime().split('T')[0];
    const reportsFolder = path.join(process.cwd(), 'Reports', currentDate); // Use project root as base

    // Create folder if it doesn't exist
    if (!fs.existsSync(reportsFolder)) {
      fs.mkdirSync(reportsFolder, { recursive: true });
    }

    // Create a unique file name based on the current time
    const timestamp = this.getLocalTime(); // Use local time with timestamp
    const fileName = `Test_Report_${timestamp}.xlsx`;
    const filePath = path.join(reportsFolder, fileName);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Results');

    // Define headers
    worksheet.columns = [
      { header: 'Test Case Name', key: 'TestCaseName', width: 30 },
      { header: 'Status', key: 'Status', width: 10 },
      { header: 'Start Time', key: 'StartTime', width: 25 },
      { header: 'End Time', key: 'EndTime', width: 25 },
      { header: 'Duration', key: 'Duration', width: 15 },
      { header: 'Error Message', key: 'ErrorMessage', width: 50 }, // Include error message column
    ];

    // Add rows
    this.results.forEach((result) => {
      worksheet.addRow(result);
    });

    // Save Excel file
    await workbook.xlsx.writeFile(filePath);
    console.log(`Test report saved at: ${filePath}`);
  }
}

module.exports = CustomReport;

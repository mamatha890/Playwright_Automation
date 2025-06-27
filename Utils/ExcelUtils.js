const xlsx = require("xlsx");

class ExcelUtil {
  constructor(filePath, sheetName) {
    this.filePath = filePath;
    this.sheetName = sheetName;
  }

  // Read test data from Excel sheet
  readData() {
    const workbook = xlsx.readFile(this.filePath);
    const sheet = workbook.Sheets[this.sheetName];
    return xlsx.utils.sheet_to_json(sheet);
  }

  // Get current India time formatted as yyyy-MM-dd_HH-mm-ss using timezone 'Asia/Kolkata'
  getIndiaDateTime() {
    const options = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    const indiaTimeString = new Date().toLocaleString('en-GB', options);
    // Format example: "06/06/2025, 11:48:01"

    const [datePart, timePart] = indiaTimeString.split(', ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');

    return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
  }

updateData(data, testCaseName) {
  data.forEach(item => {
    if (item.TestCaseName === testCaseName) {
      // Set StartDate only if not already set
      if (!item.StartDate) {
        item.StartDate = this.getIndiaDateTime();
      }
      // Always update EndDate
      item.EndDate = this.getIndiaDateTime();

      // Parse string date to JS Date object by replacing '_' with 'T'
      const parseDate = str => new Date(str.replace('_', 'T'));

      const start = parseDate(item.StartDate);
      const end = parseDate(item.EndDate);

      // Calculate duration in seconds
      const durationSeconds = (end - start) / 1000;
      item.Duration = durationSeconds > 0 ? `${durationSeconds.toFixed(2)} seconds` : "0 seconds";
    }
  });

  // Write updated data back to Excel
  const workbook = xlsx.readFile(this.filePath);
  const updatedSheet = xlsx.utils.json_to_sheet(data);
  workbook.Sheets[this.sheetName] = updatedSheet;
  xlsx.writeFile(workbook, this.filePath);
}



    // Write updated data back to Excel
   
}

module.exports = ExcelUtil;

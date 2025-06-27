const XLSX = require('xlsx');


 
// Extract data from a specific sheet in the Excel file
const extractDataFromExcel = (filePath, sheetName) => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
 
  const jsonData = XLSX.utils.sheet_to_json(sheet);
  return jsonData;
};module.exports = {
    extractDataFromExcel
  };
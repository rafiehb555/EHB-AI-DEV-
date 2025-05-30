/**
 * Read and process a JSON file
 */
const fs = require('fs');
const path = require('path');

// File path
const filePath = path.join(__dirname, 'data.json');

// Read and parse JSON file
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error.message);
    return null;
  }
}

// Write data to JSON file
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('File written successfully');
    return true;
  } catch (error) {
    console.error('Error writing JSON file:', error.message);
    return false;
  }
}

// Example usage
const jsonData = readJsonFile(filePath);
if (jsonData) {
  console.log('Data read successfully:', jsonData);
  
  // Modify data
  jsonData.lastAccessed = new Date().toISOString();
  
  // Write modified data back to file
  writeJsonFile(filePath, jsonData);
}

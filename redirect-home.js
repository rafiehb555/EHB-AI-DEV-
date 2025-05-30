/**
 * Redirect script for EHB-HOME
 * This script redirects to the new location in the admin folder
 */
console.log('Redirecting to admin/EHB-HOME...');
process.chdir('admin/EHB-HOME');
require('./index.js');

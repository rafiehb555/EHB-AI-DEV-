/**
 * Redirect script for EHB-DASHBOARD
 * This script redirects to the new location in the admin folder
 */
console.log('Redirecting to admin/EHB-DASHBOARD...');
process.chdir('admin/EHB-DASHBOARD');
require('./index.js');

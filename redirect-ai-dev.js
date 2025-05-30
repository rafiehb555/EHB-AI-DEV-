/**
 * Redirect script for EHB-AI-Dev
 * This script redirects to the new location in the ai-services folder
 */
console.log('Redirecting to ai-services/EHB-AI-Dev...');
process.chdir('ai-services/EHB-AI-Dev');
require('./index.js');

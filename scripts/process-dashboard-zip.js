/**
 * Process Dashboard ZIP
 * This script processes the EHB-DASHBOARD-Phase-Complete.zip file
 * and sets it up in the correct location with proper folder structure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const zipName = 'EHB-DASHBOARD-Phase-Complete.zip';
const zipPath = path.join(process.cwd(), 'attached_assets', zipName);
const extractDir = path.join(process.cwd(), 'admin', 'EHB-DASHBOARD');

console.log(`📦 Processing ${zipName}...`);

// Check if the ZIP file exists
if (!fs.existsSync(zipPath)) {
  console.error(`❌ ZIP file not found: ${zipPath}`);
  process.exit(1);
}

// Ensure the target directory exists
if (!fs.existsSync(extractDir)) {
  fs.mkdirSync(extractDir, { recursive: true });
  console.log(`📁 Created directory: ${extractDir}`);
}

try {
  // Extract the ZIP file
  console.log(`📂 Extracting to: ${extractDir}`);
  execSync(`unzip -o "${zipPath}" -d "${extractDir}"`);
  
  // Fix Tailwind CSS configuration
  console.log('🔧 Fixing Tailwind CSS configuration...');
  
  // Check if postcss.config.js exists and fix it
  const postcssConfigPath = path.join(extractDir, 'postcss.config.js');
  if (fs.existsSync(postcssConfigPath)) {
    let postcssConfig = fs.readFileSync(postcssConfigPath, 'utf8');
    
    // Replace direct tailwindcss reference with @tailwindcss/postcss
    postcssConfig = postcssConfig.replace(
      /tailwindcss/g, 
      '@tailwindcss/postcss7-compat'
    );
    
    fs.writeFileSync(postcssConfigPath, postcssConfig);
    console.log('✅ Fixed postcss.config.js');
  }
  
  // Install required Tailwind dependencies
  console.log('📦 Installing Tailwind dependencies...');
  process.chdir(extractDir);
  execSync('npm install @tailwindcss/postcss7-compat --save-dev');
  
  console.log('✅ Processing complete. ZIP extracted and configured successfully.');
  
} catch (error) {
  console.error(`❌ Error processing ZIP: ${error.message}`);
}
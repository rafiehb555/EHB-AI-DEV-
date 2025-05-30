/**
 * Process Phase ZIPs
 * 
 * This script extracts and processes all ZIP files containing phase modules,
 * organizing them into the proper folder structure and cleaning up afterward.
 * 
 * Usage: node scripts/process-phase-zips.js
 */

const fs = require('fs-extra');
const path = require('path');
const AdmZip = require('adm-zip');
const glob = require('glob');

// Simple chalk replacement
const chalk = {
  blue: (msg) => `\x1b[34m${msg}\x1b[0m`,
  green: (msg) => `\x1b[32m${msg}\x1b[0m`,
  yellow: (msg) => `\x1b[33m${msg}\x1b[0m`,
  red: (msg) => `\x1b[31m${msg}\x1b[0m`,
  white: (msg) => `\x1b[37m${msg}\x1b[0m`,
  gray: (msg) => `\x1b[90m${msg}\x1b[0m`
};

// Configuration
const UPLOAD_DIRS = [
  path.join(process.cwd(), 'uploads'),
  path.join(process.cwd(), 'attached_assets')
];
const EXTRACT_DIR = path.join(process.cwd(), 'temp_extract');
const PHASES_DIR = path.join(process.cwd(), 'phases');
const PHASE_PATTERN = /^(EHB-AI-Dev-Phase-|Phase-|phase-)?(\d+)(-\d+)?$/;
const PROCESSED_DIR = path.join(process.cwd(), 'attached_assets', 'processed');

// Ensure directories exist
async function ensureDirectories() {
  await fs.ensureDir(EXTRACT_DIR);
  await fs.ensureDir(PHASES_DIR);
  await fs.ensureDir(PROCESSED_DIR);
}

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: chalk.blue('[INFO]'),
    success: chalk.green('[SUCCESS]'),
    warning: chalk.yellow('[WARNING]'),
    error: chalk.red('[ERROR]'),
  }[type] || chalk.blue('[INFO]');
  
  console.log(`${prefix} ${timestamp} ${message}`);
}

// Find all ZIP files
async function findZipFiles() {
  const zipFiles = [];
  
  for (const uploadDir of UPLOAD_DIRS) {
    if (await fs.pathExists(uploadDir)) {
      try {
        const files = await fs.readdir(uploadDir);
        for (const file of files) {
          if (file.toLowerCase().endsWith('.zip')) {
            zipFiles.push(path.join(uploadDir, file));
          }
        }
      } catch (error) {
        log(`Error reading directory ${uploadDir}: ${error.message}`, 'error');
      }
    }
  }
  
  // Also search for ZIPs in subdirectories of the project root
  try {
    const rootZips = glob.sync('**/*.zip', {
      cwd: process.cwd(),
      ignore: [
        'node_modules/**',
        'attached_assets/processed/**',
        'temp_extract/**'
      ]
    });
    
    for (const zipPath of rootZips) {
      zipFiles.push(path.join(process.cwd(), zipPath));
    }
  } catch (error) {
    log(`Error searching for ZIPs in project root: ${error.message}`, 'error');
  }
  
  return zipFiles;
}

// Extract a ZIP file
async function extractZip(zipPath) {
  const zipBaseName = path.basename(zipPath, '.zip');
  const extractPath = path.join(EXTRACT_DIR, zipBaseName);
  
  // Clean any previous extraction
  await fs.remove(extractPath);
  await fs.ensureDir(extractPath);
  
  try {
    log(`Extracting ${zipPath} to ${extractPath}`);
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);
    log(`Successfully extracted ${zipPath}`, 'success');
    return extractPath;
  } catch (error) {
    log(`Error extracting ${zipPath}: ${error.message}`, 'error');
    return null;
  }
}

// Analyze extracted content to determine phase number and structure
async function analyzeExtractedContent(extractPath) {
  const dirName = path.basename(extractPath);
  let phaseMatch = dirName.match(PHASE_PATTERN);
  let phaseNumber = null;
  let subPhase = null;
  
  if (phaseMatch) {
    phaseNumber = parseInt(phaseMatch[2], 10);
    subPhase = phaseMatch[3] ? phaseMatch[3].substring(1) : null;
  }
  
  if (!phaseNumber) {
    // Try to find phase number inside the extracted files
    try {
      const files = await fs.readdir(extractPath);
      
      // Check if there's only one directory at the root level
      const subdirs = [];
      for (const file of files) {
        const filePath = path.join(extractPath, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
          subdirs.push(file);
        }
      }
      
      if (subdirs.length === 1) {
        // Check if the subdirectory name indicates a phase
        const subdir = subdirs[0];
        phaseMatch = subdir.match(PHASE_PATTERN);
        if (phaseMatch) {
          phaseNumber = parseInt(phaseMatch[2], 10);
          subPhase = phaseMatch[3] ? phaseMatch[3].substring(1) : null;
          
          // Update extract path to the subdirectory
          return {
            extractPath: path.join(extractPath, subdir),
            phaseNumber,
            subPhase
          };
        }
      }
      
      // Look for README or package.json that might indicate phase number
      for (const file of files) {
        if (file === 'README.md' || file === 'package.json') {
          const filePath = path.join(extractPath, file);
          const content = await fs.readFile(filePath, 'utf8');
          
          // Look for phase number in content
          const contentMatch = content.match(/phase\s*[:#-]?\s*(\d+)/i);
          if (contentMatch) {
            phaseNumber = parseInt(contentMatch[1], 10);
            break;
          }
        }
      }
    } catch (error) {
      log(`Error analyzing extracted content: ${error.message}`, 'error');
    }
  }
  
  if (!phaseNumber) {
    log(`Could not determine phase number for ${extractPath}. Manual intervention required.`, 'warning');
  }
  
  return {
    extractPath,
    phaseNumber,
    subPhase
  };
}

// Process phase files - consolidating duplicates and creating minimal structure
async function processPhaseFiles(analysis) {
  if (!analysis.phaseNumber) {
    log(`Skipping processing for ${analysis.extractPath} as phase number could not be determined`, 'warning');
    return false;
  }
  
  const phaseKey = analysis.subPhase 
    ? `${analysis.phaseNumber}-${analysis.subPhase}` 
    : String(analysis.phaseNumber);
  
  const phaseDirName = `phase-${phaseKey}`;
  const targetDir = path.join(PHASES_DIR, phaseDirName);
  
  log(`Processing phase ${phaseKey} from ${analysis.extractPath} to ${targetDir}`);
  
  try {
    // Ensure target directory exists
    await fs.ensureDir(targetDir);
    
    // Find source files
    const files = await fs.readdir(analysis.extractPath);
    
    // Extract key files
    const indexFiles = files.filter(f => f.startsWith('index.') || f.endsWith('.js') || f.endsWith('.ts'));
    const readmeFiles = files.filter(f => f.toLowerCase() === 'readme.md');
    const configFiles = files.filter(f => f.includes('config') && (f.endsWith('.json') || f.endsWith('.js')));
    const packageFiles = files.filter(f => f === 'package.json');
    
    // Copy and consolidate files
    if (indexFiles.length > 0) {
      const sourceIndex = indexFiles[0];
      await fs.copy(
        path.join(analysis.extractPath, sourceIndex),
        path.join(targetDir, 'index.js')
      );
      log(`Copied index file: ${sourceIndex} -> index.js`, 'success');
    } else {
      // Create a minimal index.js if none exists
      await fs.writeFile(
        path.join(targetDir, 'index.js'),
        `/**
 * EHB AI Dev Phase ${phaseKey}
 * Placeholder module for Phase ${phaseKey}
 */

module.exports = {
  name: "EHB AI Dev Phase ${phaseKey}",
  version: "1.0.0",
  status: "Not Started"
};
`
      );
      log(`Created placeholder index.js for phase ${phaseKey}`, 'warning');
    }
    
    if (readmeFiles.length > 0) {
      await fs.copy(
        path.join(analysis.extractPath, readmeFiles[0]),
        path.join(targetDir, 'README.md')
      );
      log(`Copied README file for phase ${phaseKey}`, 'success');
    } else {
      // Create a minimal README if none exists
      await fs.writeFile(
        path.join(targetDir, 'README.md'),
        `# EHB AI Dev Phase ${phaseKey}

This module is part of the EHB AI Dev System.

## Status: Not Started

## Description

Placeholder for Phase ${phaseKey} module.
`
      );
      log(`Created placeholder README.md for phase ${phaseKey}`, 'warning');
    }
    
    if (configFiles.length > 0) {
      await fs.copy(
        path.join(analysis.extractPath, configFiles[0]),
        path.join(targetDir, 'phase-config.json')
      );
      log(`Copied config file for phase ${phaseKey}`, 'success');
    } else {
      // Create a minimal config if none exists
      await fs.writeJson(
        path.join(targetDir, 'phase-config.json'),
        {
          id: phaseKey,
          name: `EHB AI Dev Phase ${phaseKey}`,
          version: "1.0.0",
          status: "Not Started",
          description: `Phase ${phaseKey} module for EHB AI Dev System`
        },
        { spaces: 2 }
      );
      log(`Created placeholder phase-config.json for phase ${phaseKey}`, 'warning');
    }
    
    // Handle package.json if exists
    if (packageFiles.length > 0) {
      const packageJson = await fs.readJson(path.join(analysis.extractPath, 'package.json'));
      
      // If there are dependencies we should note them
      if (packageJson.dependencies) {
        const depsPath = path.join(targetDir, 'dependencies.json');
        await fs.writeJson(depsPath, packageJson.dependencies, { spaces: 2 });
        log(`Saved dependencies from package.json to dependencies.json`, 'success');
      }
    }
    
    // Copy any other important files
    const otherImportantFiles = [
      ...files.filter(f => f.endsWith('.jsx') || f.endsWith('.tsx')),
      ...files.filter(f => f.startsWith('main.') || f.startsWith('app.')),
      ...files.filter(f => f.includes('components') && f.endsWith('.js'))
    ];
    
    for (const file of otherImportantFiles) {
      if (!indexFiles.includes(file)) { // Don't copy if already copied as index
        await fs.copy(
          path.join(analysis.extractPath, file),
          path.join(targetDir, file)
        );
        log(`Copied additional file: ${file}`, 'success');
      }
    }
    
    return true;
  } catch (error) {
    log(`Error processing phase ${phaseKey}: ${error.message}`, 'error');
    return false;
  }
}

// Move processed ZIP to processed directory
async function moveToProcessed(zipPath) {
  const zipFileName = path.basename(zipPath);
  const processedPath = path.join(PROCESSED_DIR, zipFileName);
  
  try {
    await fs.move(zipPath, processedPath, { overwrite: true });
    log(`Moved processed ZIP to ${processedPath}`, 'success');
    return true;
  } catch (error) {
    log(`Error moving ZIP to processed directory: ${error.message}`, 'error');
    return false;
  }
}

// Clean up temporary files
async function cleanUp() {
  try {
    await fs.remove(EXTRACT_DIR);
    log('Cleaned up temporary extraction directory', 'success');
    return true;
  } catch (error) {
    log(`Error cleaning up: ${error.message}`, 'error');
    return false;
  }
}

// Main function
async function main() {
  log('Starting Process Phase ZIPs Tool');
  
  try {
    // Ensure directories exist
    await ensureDirectories();
    
    // Find ZIP files
    const zipFiles = await findZipFiles();
    log(`Found ${zipFiles.length} ZIP files to process`);
    
    if (zipFiles.length === 0) {
      log('No ZIP files found to process. Exiting.', 'warning');
      return;
    }
    
    // Process each ZIP
    const results = {
      processed: [],
      failed: [],
      skipped: []
    };
    
    for (const zipFile of zipFiles) {
      log(`Processing ZIP file: ${zipFile}`);
      
      // Extract ZIP
      const extractPath = await extractZip(zipFile);
      if (!extractPath) {
        results.failed.push(zipFile);
        continue;
      }
      
      // Analyze content
      const analysis = await analyzeExtractedContent(extractPath);
      
      if (!analysis.phaseNumber) {
        results.skipped.push(zipFile);
        log(`Could not determine phase for ${zipFile}. Skipping.`, 'warning');
        continue;
      }
      
      // Process phase files
      const success = await processPhaseFiles(analysis);
      
      if (success) {
        // Move ZIP to processed directory
        await moveToProcessed(zipFile);
        results.processed.push({
          zipFile,
          phaseNumber: analysis.phaseNumber,
          subPhase: analysis.subPhase
        });
      } else {
        results.failed.push(zipFile);
      }
    }
    
    // Clean up temporary files
    await cleanUp();
    
    // Print summary
    console.log(chalk.green('======================================'));
    console.log(chalk.green('======= ZIP PROCESSING SUMMARY ======='));
    console.log(chalk.green('======================================'));
    console.log(`Processed: ${chalk.green(results.processed.length)}`);
    console.log(`Failed: ${chalk.red(results.failed.length)}`);
    console.log(`Skipped: ${chalk.yellow(results.skipped.length)}`);
    console.log(chalk.green('======================================'));
    
    if (results.processed.length > 0) {
      console.log(chalk.green('\nSuccessfully processed phases:'));
      for (const item of results.processed) {
        const phaseKey = item.subPhase 
          ? `${item.phaseNumber}-${item.subPhase}` 
          : String(item.phaseNumber);
        console.log(`- Phase ${phaseKey} from ${path.basename(item.zipFile)}`);
      }
    }
    
    if (results.failed.length > 0) {
      console.log(chalk.red('\nFailed to process:'));
      for (const zipFile of results.failed) {
        console.log(`- ${path.basename(zipFile)}`);
      }
    }
    
    // Now run dashboard sync
    log('\nRunning dashboard sync to update the dashboard with new phases...');
    try {
      const dashboardSync = require('./dashboard-auto-sync');
      await dashboardSync.main();
    } catch (error) {
      log(`Error running dashboard sync: ${error.message}. Please run 'node scripts/dashboard-auto-sync.js' manually.`, 'error');
    }
    
    log('Phase ZIP processing completed successfully!', 'success');
  } catch (error) {
    log(`Error in process-phase-zips: ${error.message}`, 'error');
    console.error(error);
  }
}

// Export for use in other scripts
module.exports = { main };

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}
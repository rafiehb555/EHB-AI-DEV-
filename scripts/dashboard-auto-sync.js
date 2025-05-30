/**
 * EHB Dashboard Auto-Sync Tool
 * 
 * This script automatically scans all existing phases in the system,
 * identifies missing entries in the dashboard, and syncs them all
 * to ensure 100% of phases appear in the dashboard with correct tracking.
 * 
 * Usage: node scripts/dashboard-auto-sync.js
 */

const fs = require('fs-extra');
const path = require('path');

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
const PHASES_DIR = path.join(process.cwd(), 'phases');
const PHASES_PATTERN = /^(EHB-AI-Dev-Phase-|Phase-|phase-)?(\d+)(-\d+)?$/;
const ADDITIONAL_PHASE_DIRS = [
  path.join(process.cwd(), 'EHB-AI-Agent'),
  path.join(process.cwd(), 'CodeSuggest-Phase-2'),
  path.join(process.cwd(), 'AICodingChat-Phase-3'),
  path.join(process.cwd(), 'VoiceModuleGen-Phase-4'),
  path.join(process.cwd(), 'SQLBadgeSystem-Phase-5'),
  path.join(process.cwd(), 'ReferralTree-Phase-6'),
  path.join(process.cwd(), 'AutoCardGen-Phase-7'),
  path.join(process.cwd(), 'TestPassFail-Phase-8'),
  path.join(process.cwd(), 'AI-Dashboard-Final-Phase-9'),
  path.join(process.cwd(), 'SmartAIAgent-Phase-10'),
  path.join(process.cwd(), 'DashboardCommandAgent-Phase-11'),
  path.join(process.cwd(), 'VoiceGPT-AIAgent-Phase-12'),
  path.join(process.cwd(), 'EHB-MobileSync-Phase-13'),
  path.join(process.cwd(), 'SmartAccessControl-Phase-15'),
];

const DASHBOARD_CONFIG_PATHS = [
  path.join(process.cwd(), 'phases', 'phase-status.json'),
  path.join(process.cwd(), 'config', 'phases.json'),
  path.join(process.cwd(), 'admin', 'ehb-admin-panel', 'src', 'data', 'phases.json'),
  path.join(process.cwd(), 'admin', 'EHB-DASHBOARD', 'frontend', 'src', 'data', 'phases.json'),
  path.join(process.cwd(), 'structure.json'),
];

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

// Find the actual dashboard configuration file
async function findDashboardConfig() {
  for (const configPath of DASHBOARD_CONFIG_PATHS) {
    try {
      if (await fs.pathExists(configPath)) {
        log(`Found dashboard configuration at: ${configPath}`, 'success');
        return configPath;
      }
    } catch (error) {
      // Continue to next path
    }
  }
  
  // If we couldn't find an existing config, create one
  const newConfigPath = DASHBOARD_CONFIG_PATHS[0];
  log(`No dashboard configuration found. Creating new one at: ${newConfigPath}`, 'warning');
  await fs.ensureDir(path.dirname(newConfigPath));
  await fs.writeJson(newConfigPath, { phases: [] }, { spaces: 2 });
  return newConfigPath;
}

// Discover all phase directories in the system
async function discoverPhases() {
  log('Discovering phases in the system...');
  const phaseMap = new Map();

  // First, check if the phases directory exists
  if (await fs.pathExists(PHASES_DIR)) {
    const entries = await fs.readdir(PHASES_DIR);
    
    for (const entry of entries) {
      const entryPath = path.join(PHASES_DIR, entry);
      const stat = await fs.stat(entryPath);
      
      if (stat.isDirectory()) {
        const match = entry.match(PHASES_PATTERN);
        if (match) {
          const phaseNumber = parseInt(match[2], 10);
          const subPhase = match[3] ? match[3].substring(1) : null;
          
          const phaseKey = subPhase ? `${phaseNumber}-${subPhase}` : String(phaseNumber);
          phaseMap.set(phaseKey, {
            id: phaseKey,
            number: phaseNumber,
            subPhase,
            name: `EHB AI Dev Phase ${phaseKey}`, // Default name
            path: entryPath,
            files: []
          });
        }
      }
    }
  }

  // Add additional known phase directories
  for (const dirPath of ADDITIONAL_PHASE_DIRS) {
    if (await fs.pathExists(dirPath)) {
      const dirName = path.basename(dirPath);
      
      // Try to extract phase number from directory name
      const match = dirName.match(PHASES_PATTERN);
      if (match) {
        const phaseNumber = parseInt(match[2], 10);
        const subPhase = match[3] ? match[3].substring(1) : null;
        
        const phaseKey = subPhase ? `${phaseNumber}-${subPhase}` : String(phaseNumber);
        if (!phaseMap.has(phaseKey)) {
          phaseMap.set(phaseKey, {
            id: phaseKey,
            number: phaseNumber,
            subPhase,
            name: dirName.replace(/-/g, ' '),
            path: dirPath,
            files: []
          });
        }
      }
    }
  }

  // Scan for phase files
  for (const phase of phaseMap.values()) {
    try {
      const files = await fs.readdir(phase.path);
      phase.files = files;
      
      // Try to read phase configuration for better names
      if (files.includes('phase-config.json')) {
        try {
          const phaseConfig = await fs.readJson(path.join(phase.path, 'phase-config.json'));
          if (phaseConfig.name) {
            phase.name = phaseConfig.name;
          }
          if (phaseConfig.status) {
            phase.status = phaseConfig.status;
          }
        } catch (error) {
          log(`Error reading phase config for phase ${phase.id}: ${error.message}`, 'warning');
        }
      }
      
      // If there's a README, get name from first header if possible
      if (files.includes('README.md')) {
        try {
          const readmeContent = await fs.readFile(path.join(phase.path, 'README.md'), 'utf8');
          const headerMatch = readmeContent.match(/# (.*?)(\n|$)/);
          if (headerMatch && headerMatch[1]) {
            phase.name = headerMatch[1];
          }
        } catch (error) {
          log(`Error reading README for phase ${phase.id}: ${error.message}`, 'warning');
        }
      }
      
      // Determine phase status by checking if there's code
      if (!phase.status) {
        const hasCode = files.some(file => file.endsWith('.js') || file.endsWith('.jsx') || 
                                           file.endsWith('.ts') || file.endsWith('.tsx'));
        phase.status = hasCode ? 'Completed' : 'Not Started';
      }
    } catch (error) {
      log(`Error scanning files for phase ${phase.id}: ${error.message}`, 'error');
    }
  }

  // Sort phases by number and subphase
  const sortedPhases = Array.from(phaseMap.values()).sort((a, b) => {
    if (a.number !== b.number) {
      return a.number - b.number;
    }
    if (!a.subPhase && b.subPhase) return -1;
    if (a.subPhase && !b.subPhase) return 1;
    if (a.subPhase && b.subPhase) {
      return parseInt(a.subPhase, 10) - parseInt(b.subPhase, 10);
    }
    return 0;
  });

  return sortedPhases;
}

// Create placeholder for missing phases
async function ensurePhasePlaceholders(phases, maxPhaseNumber = 58) {
  const phaseIds = new Set(phases.map(p => p.id));
  
  // Identify any gaps in the phase sequence
  const missingPhases = [];
  for (let i = 0; i <= maxPhaseNumber; i++) {
    const phaseKey = String(i);
    if (!phaseIds.has(phaseKey)) {
      missingPhases.push({
        id: phaseKey,
        number: i,
        name: `EHB AI Dev Phase ${i}`,
        status: 'Not Started',
        placeholder: true
      });
    }
  }
  
  log(`Found ${missingPhases.length} missing phases. Creating placeholders...`);
  return [...phases, ...missingPhases].sort((a, b) => {
    if (a.number !== b.number) {
      return a.number - b.number;
    }
    if (!a.subPhase && b.subPhase) return -1;
    if (a.subPhase && !b.subPhase) return 1;
    if (a.subPhase && b.subPhase) {
      return parseInt(a.subPhase, 10) - parseInt(b.subPhase, 10);
    }
    return 0;
  });
}

// Read existing dashboard configuration
async function readDashboardConfig(configPath) {
  try {
    const config = await fs.readJson(configPath);
    if (Array.isArray(config)) {
      return { phases: config };
    } else if (config.phases && Array.isArray(config.phases)) {
      return config;
    } else {
      return { phases: [] };
    }
  } catch (error) {
    log(`Error reading dashboard config: ${error.message}. Creating new empty config.`, 'warning');
    return { phases: [] };
  }
}

// Merge discovered phases with dashboard configuration
async function mergePhasesWithDashboard(discoveredPhases, dashboardConfig) {
  const existingPhaseMap = new Map();
  for (const phase of dashboardConfig.phases) {
    if (phase.id || phase.number) {
      const phaseId = phase.id || String(phase.number);
      existingPhaseMap.set(phaseId, phase);
    }
  }
  
  const mergedPhases = [];
  
  for (const phase of discoveredPhases) {
    const existingPhase = existingPhaseMap.get(phase.id);
    
    if (existingPhase) {
      // Update existing phase with new information
      mergedPhases.push({
        ...existingPhase,
        name: phase.name || existingPhase.name,
        status: phase.status || existingPhase.status || 'Not Started',
        active: true
      });
      log(`Updated existing phase: ${phase.id} - ${phase.name}`, 'success');
    } else {
      // Add new phase
      mergedPhases.push({
        id: phase.id,
        number: phase.number,
        subPhase: phase.subPhase,
        name: phase.name,
        status: phase.status || 'Not Started',
        active: true,
        placeholder: phase.placeholder || false
      });
      log(`Added new phase: ${phase.id} - ${phase.name}`, 'success');
    }
  }
  
  return {
    ...dashboardConfig,
    phases: mergedPhases
  };
}

// Write updated dashboard configuration
async function writeDashboardConfig(configPath, config) {
  try {
    await fs.writeJson(configPath, config, { spaces: 2 });
    log(`Successfully wrote updated dashboard configuration to: ${configPath}`, 'success');
    
    // Also write a summary for quick reference
    const summaryPath = path.join(path.dirname(configPath), 'phase-summary.json');
    await fs.writeJson(summaryPath, {
      totalPhases: config.phases.length,
      completed: config.phases.filter(p => p.status === 'Completed').length,
      inProgress: config.phases.filter(p => p.status === 'In Progress').length,
      notStarted: config.phases.filter(p => p.status === 'Not Started').length,
      lastUpdated: new Date().toISOString()
    }, { spaces: 2 });
    log(`Wrote phase summary to: ${summaryPath}`, 'success');
    
    return true;
  } catch (error) {
    log(`Error writing dashboard config: ${error.message}`, 'error');
    return false;
  }
}

// Main function
async function main() {
  log('Starting EHB Dashboard Auto-Sync Tool');
  
  try {
    // Find dashboard configuration
    const dashboardConfigPath = await findDashboardConfig();
    
    // Discover phases
    const discoveredPhases = await discoverPhases();
    log(`Discovered ${discoveredPhases.length} phases in the system`);
    
    // Create placeholders for missing phases
    const allPhases = await ensurePhasePlaceholders(discoveredPhases);
    log(`Total phases with placeholders: ${allPhases.length}`);
    
    // Read existing dashboard configuration
    const dashboardConfig = await readDashboardConfig(dashboardConfigPath);
    log(`Read existing dashboard configuration with ${dashboardConfig.phases.length} phases`);
    
    // Merge phases with dashboard
    const updatedConfig = await mergePhasesWithDashboard(allPhases, dashboardConfig);
    log(`Merged configuration now has ${updatedConfig.phases.length} phases`);
    
    // Write updated dashboard configuration
    const success = await writeDashboardConfig(dashboardConfigPath, updatedConfig);
    
    if (success) {
      log('Dashboard auto-sync completed successfully!', 'success');
      
      // Print summary
      const summary = {
        totalPhases: updatedConfig.phases.length,
        completed: updatedConfig.phases.filter(p => p.status === 'Completed').length,
        inProgress: updatedConfig.phases.filter(p => p.status === 'In Progress').length,
        notStarted: updatedConfig.phases.filter(p => p.status === 'Not Started').length
      };
      
      console.log(chalk.green('======================================'));
      console.log(chalk.green('====== DASHBOARD SYNC SUMMARY ======='));
      console.log(chalk.green('======================================'));
      console.log(`Total Phases: ${chalk.white(summary.totalPhases)}`);
      console.log(`Completed: ${chalk.green(summary.completed)}`);
      console.log(`In Progress: ${chalk.yellow(summary.inProgress)}`);
      console.log(`Not Started: ${chalk.gray(summary.notStarted)}`);
      console.log(chalk.green('======================================'));
    }
  } catch (error) {
    log(`Error in dashboard auto-sync: ${error.message}`, 'error');
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
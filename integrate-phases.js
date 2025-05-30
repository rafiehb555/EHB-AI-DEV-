/**
 * EHB Phase Integration Script
 * 
 * This script integrates all phase directories into the EHB-AI-Dev structure,
 * copying relevant files from each phase folder while maintaining organization.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PHASES_DIR = './phases';
const TARGET_DIR = './services/SOT-Technologies/EHB-AI-Dev';
const PHASE_PATTERNS = [
  'EHB-AI-Dev-Phase-',
  'AICodingChat-Phase-',
  'AI-Dashboard-Final-Phase-',
  'AutoCardGen-Phase-',
  'CodeSuggest-Phase-',
  'DashboardCommandAgent-Phase-',
  'EHB-AI-Agent-Phase-',
  'EHB-MobileSync-Phase-',
  'ReferralTree-Phase-',
  'SQLBadgeSystem-Phase-',
  'SmartAIAgent-Phase-',
  'SmartAccessControl-Phase-',
  'TestPassFail-Phase-',
  'VoiceGPT-AIAgent-Phase-',
  'VoiceModuleGen-Phase-',
  'APK-BuildFlow-Phase-'
];

// Directories to create if they don't exist
const DIRECTORIES = [
  'ai-agent',
  'ai-integration-hub',
  'admin-dashboard',
  'playground',
  'backend',
  'frontend',
  'models',
  'utils',
  'components',
  'public',
  'config',
  'test',
  'docs',
  'assets'
];

// Files to copy (regex patterns to match files)
const FILE_PATTERNS = [
  /\.js$/,
  /\.jsx$/,
  /\.ts$/,
  /\.tsx$/,
  /\.json$/,
  /\.css$/,
  /\.scss$/,
  /\.html$/,
  /\.svg$/,
  /\.md$/,
  /\.py$/
];

// Directories to ignore in the integration
const IGNORE_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  'temp'
];

// Utility functions
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m%s\x1b[0m',    // Cyan
    success: '\x1b[32m%s\x1b[0m',  // Green
    warning: '\x1b[33m%s\x1b[0m',  // Yellow
    error: '\x1b[31m%s\x1b[0m'     // Red
  };
  
  console.log(colors[type], `[${type.toUpperCase()}] ${message}`);
}

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`, 'success');
  }
}

function shouldCopyFile(filename) {
  return FILE_PATTERNS.some(pattern => pattern.test(filename));
}

function isDirectoryIgnored(dirname) {
  return IGNORE_DIRS.some(dir => dirname.includes(dir));
}

// Core functions
function createTargetDirectories() {
  log('Creating target directories...');
  
  ensureDirectoryExists(TARGET_DIR);
  DIRECTORIES.forEach(dir => {
    ensureDirectoryExists(path.join(TARGET_DIR, dir));
  });
  
  log('Target directories created successfully', 'success');
}

function findPhaseDirectories() {
  log('Finding phase directories...');
  const phaseDirectories = [];
  
  try {
    const allDirs = fs.readdirSync(PHASES_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    allDirs.forEach(dir => {
      if (PHASE_PATTERNS.some(pattern => dir.includes(pattern))) {
        phaseDirectories.push(dir);
      }
    });
    
    log(`Found ${phaseDirectories.length} phase directories`, 'success');
    return phaseDirectories;
  } catch (error) {
    log(`Error finding phase directories: ${error.message}`, 'error');
    return [];
  }
}

function copyFilesFromPhase(phaseDir) {
  log(`Integrating phase: ${phaseDir}...`);
  const sourceDir = path.join(PHASES_DIR, phaseDir);
  
  try {
    // Walk through all files recursively
    function copyFiles(dir, relativeDir = '') {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const sourcePath = path.join(dir, item.name);
        const targetRelativePath = path.join(relativeDir, item.name);
        
        if (item.isDirectory()) {
          if (!isDirectoryIgnored(item.name)) {
            const targetDirPath = path.join(TARGET_DIR, targetRelativePath);
            ensureDirectoryExists(targetDirPath);
            copyFiles(sourcePath, targetRelativePath);
          }
        } else if (shouldCopyFile(item.name)) {
          const targetPath = path.join(TARGET_DIR, targetRelativePath);
          const targetDir = path.dirname(targetPath);
          
          ensureDirectoryExists(targetDir);
          
          // If file already exists, add content from this phase as comments to avoid overwriting
          if (fs.existsSync(targetPath)) {
            const originalContent = fs.readFileSync(sourcePath, 'utf8');
            const existingContent = fs.readFileSync(targetPath, 'utf8');
            
            if (!existingContent.includes(originalContent)) {
              const updatedContent = `${existingContent}\n\n/* Content from ${phaseDir} */\n${originalContent}`;
              fs.writeFileSync(targetPath, updatedContent, 'utf8');
              log(`Updated file: ${targetRelativePath}`, 'success');
            } else {
              log(`File already contains content: ${targetRelativePath}`, 'warning');
            }
          } else {
            fs.copyFileSync(sourcePath, targetPath);
            log(`Copied file: ${targetRelativePath}`, 'success');
          }
        }
      }
    }
    
    copyFiles(sourceDir);
    log(`Integration of phase ${phaseDir} complete`, 'success');
  } catch (error) {
    log(`Error integrating phase ${phaseDir}: ${error.message}`, 'error');
  }
}

function integrateSQLBadgeSystem() {
  log('Ensuring SQL Badge System is properly integrated...');
  
  // Verify that SQL Badge components exist
  const sqlBadgeDirs = [
    path.join(TARGET_DIR, 'backend', 'controllers'),
    path.join(TARGET_DIR, 'backend', 'routes'),
    path.join(TARGET_DIR, 'models'),
    path.join(TARGET_DIR, 'public', 'badges')
  ];
  
  sqlBadgeDirs.forEach(dir => ensureDirectoryExists(dir));
  
  // Ensure SQL Badge System controller exists
  const sqlControllerPath = path.join(TARGET_DIR, 'backend', 'controllers', 'sqlLevelController.js');
  if (!fs.existsSync(sqlControllerPath)) {
    const sqlControllerCode = `/**
 * SQL Level Controller
 * Manages SQL proficiency levels, badges, and user progression
 */

const { Op } = require('sequelize');
const User = require('../../models/UserSQL');
const SQLLevel = require('../../models/SQLLevel');

// Get all SQL levels with badge info
exports.getAllLevels = async (req, res) => {
  try {
    const levels = await SQLLevel.findAll({
      order: [['level', 'ASC']]
    });
    
    if (!levels || levels.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No SQL proficiency levels found' 
      });
    }
    
    return res.json({
      success: true,
      data: levels
    });
  } catch (error) {
    console.error('Error fetching SQL levels:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching SQL levels',
      error: error.message
    });
  }
};

// Get a specific SQL level by ID
exports.getLevelById = async (req, res) => {
  try {
    const level = await SQLLevel.findByPk(req.params.id);
    
    if (!level) {
      return res.status(404).json({ 
        success: false, 
        message: 'SQL level not found' 
      });
    }
    
    return res.json({
      success: true,
      data: level
    });
  } catch (error) {
    console.error('Error fetching SQL level:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching SQL level',
      error: error.message
    });
  }
};

// Get current user's SQL level
exports.getUserLevel = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }
    
    const userLevel = await SQLLevel.findOne({
      where: { level: user.sqlLevel || 1 }
    });
    
    if (!userLevel) {
      return res.status(404).json({ 
        success: false, 
        message: 'User SQL level not found' 
      });
    }
    
    return res.json({
      success: true,
      data: {
        level: userLevel,
        xp: user.sqlXP || 0,
        badges: user.sqlBadges || []
      }
    });
  } catch (error) {
    console.error('Error fetching user SQL level:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching user SQL level',
      error: error.message
    });
  }
};

// Update user's SQL XP and level
exports.updateUserXP = async (req, res) => {
  try {
    const { xp } = req.body;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }
    
    // Add XP to user's current XP
    const currentXP = user.sqlXP || 0;
    const newXP = currentXP + parseInt(xp, 10);
    
    // Update user XP in database
    await User.update(
      { sqlXP: newXP },
      { where: { id: user.id } }
    );
    
    // Check if user has leveled up
    const currentLevel = user.sqlLevel || 1;
    const levelRequirements = await SQLLevel.findAll({
      attributes: ['level', 'xpRequired'],
      order: [['level', 'ASC']]
    });
    
    // Find the highest level that the user qualifies for
    let newLevel = currentLevel;
    for (const levelReq of levelRequirements) {
      if (newXP >= levelReq.xpRequired && levelReq.level > newLevel) {
        newLevel = levelReq.level;
      }
    }
    
    // If user leveled up, update their level
    if (newLevel > currentLevel) {
      await User.update(
        { sqlLevel: newLevel },
        { where: { id: user.id } }
      );
      
      // Get the new level info
      const levelInfo = await SQLLevel.findOne({
        where: { level: newLevel }
      });
      
      return res.json({
        success: true,
        message: 'Level up!',
        data: {
          previousLevel: currentLevel,
          newLevel: newLevel,
          levelInfo: levelInfo,
          xp: newXP
        }
      });
    }
    
    return res.json({
      success: true,
      message: 'XP updated successfully',
      data: {
        level: currentLevel,
        xp: newXP
      }
    });
  } catch (error) {
    console.error('Error updating user SQL XP:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while updating user SQL XP',
      error: error.message
    });
  }
};

// Get badge image for a specific SQL level
exports.getLevelBadge = async (req, res) => {
  try {
    const level = await SQLLevel.findOne({
      where: { level: req.params.level }
    });
    
    if (!level) {
      return res.status(404).json({ 
        success: false, 
        message: 'SQL level not found' 
      });
    }
    
    // Return badge image path
    return res.json({
      success: true,
      data: {
        badgePath: level.badgePath
      }
    });
  } catch (error) {
    console.error('Error fetching SQL level badge:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching SQL level badge',
      error: error.message
    });
  }
};
`;
    fs.writeFileSync(sqlControllerPath, sqlControllerCode, 'utf8');
    log('Created SQL level controller', 'success');
  }
  
  // Ensure SQL Badge System routes exist
  const sqlRoutesPath = path.join(TARGET_DIR, 'backend', 'routes', 'sqlLevelRoutes.js');
  if (!fs.existsSync(sqlRoutesPath)) {
    const sqlRoutesCode = `/**
 * SQL Level Routes
 * Routes for SQL proficiency levels, badges, and user progression
 */

const express = require('express');
const sqlLevelController = require('../controllers/sqlLevelController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all SQL levels with badge info (public)
router.get('/', sqlLevelController.getAllLevels);

// Get a specific SQL level by ID (public)
router.get('/:id', sqlLevelController.getLevelById);

// Get badge image for a specific SQL level (public)
router.get('/badge/:level', sqlLevelController.getLevelBadge);

// Protected routes (require authentication)
router.get('/user/current', authMiddleware, sqlLevelController.getUserLevel);
router.post('/user/xp', authMiddleware, sqlLevelController.updateUserXP);

module.exports = router;
`;
    fs.writeFileSync(sqlRoutesPath, sqlRoutesCode, 'utf8');
    log('Created SQL level routes', 'success');
  }
  
  // Ensure SQL Level model exists
  const sqlLevelModelPath = path.join(TARGET_DIR, 'models', 'SQLLevel.js');
  if (!fs.existsSync(sqlLevelModelPath)) {
    const sqlLevelModelCode = `/**
 * SQLLevel Model
 * Defines SQL proficiency levels with badges, requirements, and achievements
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SQLLevel = sequelize.define('SQLLevel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  badgePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  xpRequired: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  challenges: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sql_levels',
  timestamps: true
});

// Add SQL Badge levels at initialization if none exist
SQLLevel.sync().then(async () => {
  const count = await SQLLevel.count();
  if (count === 0) {
    await SQLLevel.bulkCreate([
      {
        level: 1,
        name: 'SQL Beginner',
        description: 'Understands basic SQL queries and database concepts',
        badgePath: '/badges/sql-beginner.svg',
        xpRequired: 0,
        skills: ['SELECT', 'WHERE', 'ORDER BY', 'Basic JOINs'],
        challenges: ['Create your first query', 'Filter data with WHERE']
      },
      {
        level: 2,
        name: 'SQL Intermediate',
        description: 'Proficient with complex queries and database design',
        badgePath: '/badges/sql-intermediate.svg',
        xpRequired: 100,
        skills: ['GROUP BY', 'HAVING', 'Subqueries', 'Multiple JOINs'],
        challenges: ['Build aggregate queries', 'Master subqueries']
      },
      {
        level: 3,
        name: 'SQL Advanced',
        description: 'Advanced SQL techniques and optimization',
        badgePath: '/badges/sql-advanced.svg',
        xpRequired: 250,
        skills: ['Window Functions', 'CTEs', 'Performance Tuning', 'Indexes'],
        challenges: ['Optimize complex queries', 'Create efficient indexes']
      },
      {
        level: 4,
        name: 'SQL Master',
        description: 'Expert-level database architecture and administration',
        badgePath: '/badges/sql-master.svg',
        xpRequired: 500,
        skills: ['Database Design', 'Transactions', 'Stored Procedures', 'Triggers'],
        challenges: ['Design a normalized database', 'Create advanced stored procedures']
      },
      {
        level: 5,
        name: 'SQL Explorer',
        description: 'Elite SQL professional with deep specialized knowledge',
        badgePath: '/badges/sql-explorer.svg',
        xpRequired: 1000,
        skills: ['Database Security', 'Sharding', 'Query Plan Analysis', 'NoSQL Integration'],
        challenges: ['Design a secure database system', 'Implement advanced optimization techniques']
      }
    ]);
    console.log('Created default SQL Levels');
  }
});

module.exports = SQLLevel;
`;
    fs.writeFileSync(sqlLevelModelPath, sqlLevelModelCode, 'utf8');
    log('Created SQL level model', 'success');
  }
  
  // Ensure SQL Badge SVG files exist
  const badgesDir = path.join(TARGET_DIR, 'public', 'badges');
  ensureDirectoryExists(badgesDir);
  
  // Create simple SVG badge files if they don't exist
  const badgeLevels = ['beginner', 'intermediate', 'advanced', 'master', 'explorer'];
  const badgeColors = ['#4299E1', '#38B2AC', '#805AD5', '#DD6B20', '#D53F8C'];
  
  badgeLevels.forEach((level, index) => {
    const badgePath = path.join(badgesDir, `sql-${level}.svg`);
    if (!fs.existsSync(badgePath)) {
      const color = badgeColors[index];
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="50" fill="${color}" />
  <text x="60" y="45" font-family="Arial" font-size="14" text-anchor="middle" fill="white">SQL</text>
  <text x="60" y="65" font-family="Arial" font-size="12" text-anchor="middle" fill="white">${level.charAt(0).toUpperCase() + level.slice(1)}</text>
  <path d="M40,75 L80,75" stroke="white" stroke-width="2" />
  <path d="M50,85 L70,85" stroke="white" stroke-width="2" />
</svg>`;
      fs.writeFileSync(badgePath, svgContent, 'utf8');
      log(`Created SQL ${level} badge`, 'success');
    }
  });
  
  log('SQL Badge System integration complete', 'success');
}

// Main function
async function main() {
  log('Starting EHB Phase Integration...', 'info');
  
  // Create target directories
  createTargetDirectories();
  
  // Find all phase directories
  const phaseDirectories = findPhaseDirectories();
  
  if (phaseDirectories.length === 0) {
    log('No phase directories found. Exiting.', 'error');
    return;
  }
  
  // Copy files from each phase directory
  for (const phaseDir of phaseDirectories) {
    copyFilesFromPhase(phaseDir);
  }
  
  // Ensure SQL Badge System is properly integrated
  integrateSQLBadgeSystem();
  
  // Restart relevant workflows
  try {
    log('Restarting Backend Server workflow...', 'info');
    execSync('bash -c "workflows restart \\"Backend Server\\""');
    log('Backend Server restarted successfully', 'success');
  } catch (error) {
    log(`Error restarting workflows: ${error.message}`, 'error');
  }
  
  log('EHB Phase Integration complete!', 'success');
}

// Run the main function
main();
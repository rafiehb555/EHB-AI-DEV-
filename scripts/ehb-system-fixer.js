/**
 * EHB System Fixer
 * 
 * This script automatically detects and fixes common errors in the EHB system,
 * including:
 * 
 * 1. Port conflicts
 * 2. Database connection issues
 * 3. File permissions
 * 4. Missing dependencies
 * 5. Configuration errors
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const http = require('http');
const { Pool } = require('pg');

// Constants
const PORTS_TO_CHECK = [5000, 5001, 5002, 5003, 5005, 5006, 5010, 5011, 5012, 8050];
const DB_URL = process.env.DATABASE_URL;
const ROOT_DIR = process.cwd();

// Logger
function log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type}] ${message}`;
    console.log(logMessage);
    
    // Also append to log file
    try {
        fs.appendFileSync(path.join(ROOT_DIR, 'ehb_system_fixer.log'), logMessage + '\n');
    } catch (err) {
        console.error(`Failed to write to log file: ${err.message}`);
    }
}

// Check and fix port conflicts
async function checkAndFixPortConflicts() {
    log('Checking for port conflicts...');
    
    for (const port of PORTS_TO_CHECK) {
        try {
            // Try to create a server on the port
            const server = http.createServer();
            
            await new Promise((resolve, reject) => {
                server.once('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        log(`Port ${port} is in use`, 'WARNING');
                        // Try to kill the process using this port
                        try {
                            log(`Attempting to kill process using port ${port}...`);
                            execSync(`node kill-port.js ${port}`);
                            log(`Successfully freed port ${port}`);
                        } catch (killErr) {
                            log(`Failed to kill process on port ${port}: ${killErr.message}`, 'ERROR');
                        }
                    }
                    reject(err);
                });
                
                server.once('listening', () => {
                    server.close(() => resolve());
                });
                
                server.listen(port);
            }).catch(err => {
                if (err.code !== 'EADDRINUSE') {
                    log(`Error checking port ${port}: ${err.message}`, 'ERROR');
                }
            });
            
        } catch (err) {
            log(`Error checking port ${port}: ${err.message}`, 'ERROR');
        }
    }
    
    log('Port conflict check completed');
}

// Check and fix database connection
async function checkAndFixDatabaseConnection() {
    log('Checking database connection...');
    
    if (!DB_URL) {
        log('DATABASE_URL environment variable is not set', 'WARNING');
        return;
    }
    
    try {
        const pool = new Pool({
            connectionString: DB_URL
        });
        
        const client = await pool.connect();
        log('Database connection successful');
        
        // Check for common database issues
        try {
            // Check if required tables exist
            const tableCheckResult = await client.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            `);
            
            const existingTables = tableCheckResult.rows.map(row => row.table_name);
            log(`Found ${existingTables.length} tables in database: ${existingTables.join(', ')}`);
            
            // Ensure essential tables exist
            const essentialTables = ['users', 'dashboards', 'analytics'];
            const missingTables = essentialTables.filter(table => !existingTables.includes(table));
            
            if (missingTables.length > 0) {
                log(`Missing essential tables: ${missingTables.join(', ')}`, 'WARNING');
                log('Creating missing tables...');
                
                for (const table of missingTables) {
                    log(`Creating table: ${table}`);
                    
                    if (table === 'users') {
                        await client.query(`
                            CREATE TABLE IF NOT EXISTS users (
                                id SERIAL PRIMARY KEY,
                                username VARCHAR(30) NOT NULL UNIQUE,
                                email VARCHAR(100) NOT NULL UNIQUE,
                                password VARCHAR(100) NOT NULL,
                                first_name VARCHAR(50),
                                last_name VARCHAR(50),
                                avatar VARCHAR(255),
                                role VARCHAR(20) DEFAULT 'user',
                                is_active BOOLEAN DEFAULT TRUE,
                                last_login TIMESTAMP,
                                preferences JSONB DEFAULT '{"theme": "system", "notifications": {"email": true, "push": true}, "language": "en"}',
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                            )
                        `);
                    } else if (table === 'dashboards') {
                        await client.query(`
                            CREATE TABLE IF NOT EXISTS dashboards (
                                id SERIAL PRIMARY KEY,
                                name VARCHAR(100) NOT NULL,
                                description VARCHAR(500),
                                layout VARCHAR(20) DEFAULT 'grid',
                                user_id INTEGER REFERENCES users(id),
                                is_default BOOLEAN DEFAULT FALSE,
                                widgets JSONB DEFAULT '[]',
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                            )
                        `);
                    } else if (table === 'analytics') {
                        await client.query(`
                            CREATE TABLE IF NOT EXISTS analytics (
                                id SERIAL PRIMARY KEY,
                                user_id INTEGER REFERENCES users(id),
                                session_id VARCHAR(100) NOT NULL,
                                event VARCHAR(50) NOT NULL,
                                page JSONB,
                                widget JSONB,
                                api JSONB,
                                error JSONB,
                                custom JSONB,
                                device JSONB,
                                ip VARCHAR(50),
                                location JSONB,
                                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                            )
                        `);
                    }
                }
                
                log('Missing tables created successfully');
            }
            
        } catch (dbErr) {
            log(`Database check error: ${dbErr.message}`, 'ERROR');
        }
        
        client.release();
    } catch (err) {
        log(`Database connection error: ${err.message}`, 'ERROR');
        log('Continuing with application startup despite database issues');
    }
}

// Check and fix file paths and permissions
async function checkAndFixFilePaths() {
    log('Checking file paths and permissions...');
    
    // Ensure critical directories exist
    const criticalDirs = [
        'EHB-DASHBOARD',
        'EHB-DASHBOARD/backend',
        'EHB-DASHBOARD/frontend',
        'EHB-HOME',
        'scripts'
    ];
    
    for (const dir of criticalDirs) {
        const dirPath = path.join(ROOT_DIR, dir);
        if (!fs.existsSync(dirPath)) {
            log(`Critical directory missing: ${dir}`, 'WARNING');
            try {
                fs.mkdirSync(dirPath, { recursive: true });
                log(`Created directory: ${dir}`);
            } catch (err) {
                log(`Failed to create directory ${dir}: ${err.message}`, 'ERROR');
            }
        }
    }
    
    // Check for critical files
    const criticalFiles = [
        'EHB-DASHBOARD/backend/server.js',
        'EHB-HOME/next.config.js',
        'scripts/kill-port.js'
    ];
    
    for (const file of criticalFiles) {
        const filePath = path.join(ROOT_DIR, file);
        if (!fs.existsSync(filePath)) {
            log(`Critical file missing: ${file}`, 'WARNING');
        }
    }
    
    log('File path checks completed');
}

// Check and fix package dependencies
async function checkAndFixDependencies() {
    log('Checking package dependencies...');
    
    const essentialDeps = [
        'express',
        'mongoose',
        'pg',
        'cors',
        'helmet',
        'morgan',
        'compression',
        'dotenv',
        'bcryptjs',
        'jsonwebtoken',
        'next'
    ];
    
    try {
        const packageJsonPath = path.join(ROOT_DIR, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            log('package.json not found!', 'ERROR');
            return;
        }
        
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        const missingDeps = essentialDeps.filter(dep => !dependencies[dep]);
        
        if (missingDeps.length > 0) {
            log(`Missing essential dependencies: ${missingDeps.join(', ')}`, 'WARNING');
            log('Installing missing dependencies...');
            
            try {
                execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
                log('Dependencies installed successfully');
            } catch (installErr) {
                log(`Failed to install dependencies: ${installErr.message}`, 'ERROR');
            }
        } else {
            log('All essential dependencies are installed');
        }
    } catch (err) {
        log(`Error checking dependencies: ${err.message}`, 'ERROR');
    }
}

// Fix EHB-HOME port issues
async function fixEhbHomePort() {
    log('Fixing EHB-HOME port issues...');
    
    try {
        const configPath = path.join(ROOT_DIR, 'EHB-HOME/next.config.js');
        if (!fs.existsSync(configPath)) {
            log('EHB-HOME/next.config.js not found', 'WARNING');
            return;
        }
        
        let content = fs.readFileSync(configPath, 'utf8');
        
        // Check if the port is specified in the next config
        if (!content.includes('port:') && !content.includes('PORT:')) {
            // Add port configuration
            const updatedContent = content.replace(
                'module.exports = {', 
                'module.exports = {\n  port: 5005,'
            );
            
            fs.writeFileSync(configPath, updatedContent);
            log('Added port configuration to EHB-HOME/next.config.js');
        }
        
        // Kill any process running on port 5005
        try {
            execSync('node kill-port.js 5005');
            log('Killed process on port 5005');
        } catch (killErr) {
            log(`Failed to kill process on port 5005: ${killErr.message}`, 'ERROR');
        }
        
    } catch (err) {
        log(`Error fixing EHB-HOME port: ${err.message}`, 'ERROR');
    }
}

// Restart workflows
async function restartWorkflows() {
    log('Restarting workflows...');
    
    // Restart Backend Server workflow
    try {
        const backendProcess = spawn('node', ['EHB-DASHBOARD/backend/server.js'], {
            detached: true,
            stdio: 'ignore'
        });
        backendProcess.unref();
        log('Restarted Backend Server workflow');
    } catch (err) {
        log(`Failed to restart Backend Server workflow: ${err.message}`, 'ERROR');
    }
    
    // Restart EHB-HOME workflow
    try {
        const homeDirPath = path.join(ROOT_DIR, 'EHB-HOME');
        if (fs.existsSync(homeDirPath)) {
            const homeProcess = spawn('npm', ['run', 'dev'], {
                cwd: homeDirPath,
                detached: true,
                stdio: 'ignore'
            });
            homeProcess.unref();
            log('Restarted EHB-HOME workflow');
        }
    } catch (err) {
        log(`Failed to restart EHB-HOME workflow: ${err.message}`, 'ERROR');
    }
    
    log('Workflow restart completed');
}

// Main function
async function main() {
    log('Starting EHB System Fixer...');
    
    try {
        await checkAndFixPortConflicts();
        await checkAndFixDatabaseConnection();
        await checkAndFixFilePaths();
        await checkAndFixDependencies();
        await fixEhbHomePort();
        
        // Final step: restart workflows
        await restartWorkflows();
        
        log('System fixing process completed successfully');
    } catch (err) {
        log(`System fixing process failed: ${err.message}`, 'ERROR');
    }
}

// Run the script
main().catch(err => {
    log(`Unhandled error in main: ${err.message}`, 'ERROR');
    process.exit(1);
});
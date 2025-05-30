/**
 * EHB Auto Fix System
 * 
 * This script automatically detects and fixes common issues that may occur during runtime.
 * It runs in the background and continuously monitors system health.
 * 
 * Features:
 * 1. API Endpoint Monitoring
 * 2. Database Connection Monitoring
 * 3. Memory Usage Monitoring
 * 4. Automatic Port Conflict Resolution
 * 5. Automatic Restart of Failed Services
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const http = require('http');
const https = require('https');
const { Pool } = require('pg');

// Configuration
const CONFIG = {
    checkInterval: 30000, // 30 seconds
    endpoints: [
        { url: 'http://localhost:5001/api/health', name: 'Dashboard Backend' },
        { url: 'http://localhost:5005', name: 'EHB Home' },
        { url: 'http://localhost:5006', name: 'Dashboard Frontend' }
    ],
    maxFailures: 3,
    maxMemoryUsageMB: 1024, // 1GB
    logFile: 'ehb_auto_fix.log'
};

// State tracking
const state = {
    endpointFailures: {},
    lastRestart: {},
    isFixing: false
};

// Logger
function log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type}] ${message}`;
    console.log(logMessage);
    
    try {
        fs.appendFileSync(path.join(process.cwd(), CONFIG.logFile), logMessage + '\n');
    } catch (err) {
        console.error(`Failed to write to log file: ${err.message}`);
    }
}

// Check endpoint health
async function checkEndpoint(endpoint) {
    return new Promise((resolve) => {
        const urlObj = new URL(endpoint.url);
        const requester = urlObj.protocol === 'https:' ? https : http;
        
        const req = requester.get(endpoint.url, { timeout: 5000 }, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true, endpoint, statusCode: res.statusCode, data });
                } else {
                    resolve({ success: false, endpoint, statusCode: res.statusCode, data });
                }
            });
        });
        
        req.on('error', (err) => {
            resolve({ success: false, endpoint, error: err.message });
        });
        
        req.on('timeout', () => {
            req.abort();
            resolve({ success: false, endpoint, error: 'Request timeout' });
        });
    });
}

// Check database health
async function checkDatabase() {
    if (!process.env.DATABASE_URL) {
        return { success: false, error: 'DATABASE_URL not set' };
    }
    
    try {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            connectionTimeoutMillis: 5000
        });
        
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        
        return { success: true, data: result.rows[0] };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

// Check memory usage
function checkMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = Math.round(memoryUsage.rss / 1024 / 1024);
    
    return {
        success: memoryUsageMB < CONFIG.maxMemoryUsageMB,
        memoryUsageMB,
        memoryUsage
    };
}

// Fix a specific endpoint
async function fixEndpoint(endpoint) {
    log(`Attempting to fix ${endpoint.name}...`, 'FIX');
    
    // Check if the service was restarted recently (within the last 5 minutes)
    const now = Date.now();
    const lastRestart = state.lastRestart[endpoint.name] || 0;
    
    if (now - lastRestart < 5 * 60 * 1000) {
        log(`Service ${endpoint.name} was restarted recently. Skipping...`, 'WARN');
        return false;
    }
    
    try {
        // Determine which service to restart
        let serviceCommand;
        let servicePath = process.cwd();
        
        if (endpoint.name === 'Dashboard Backend') {
            servicePath = path.join(process.cwd(), 'EHB-DASHBOARD/backend');
            serviceCommand = 'node server.js';
        } else if (endpoint.name === 'EHB Home') {
            servicePath = path.join(process.cwd(), 'EHB-HOME');
            serviceCommand = 'npm run dev';
        } else if (endpoint.name === 'Dashboard Frontend') {
            servicePath = path.join(process.cwd(), 'EHB-DASHBOARD');
            serviceCommand = 'npm run dev';
        }
        
        // Extract port from URL
        const urlObj = new URL(endpoint.url);
        const port = urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80);
        
        // Kill any process running on this port
        try {
            execSync(`node kill-port.js ${port}`, { stdio: 'ignore' });
            log(`Killed process on port ${port}`, 'FIX');
        } catch (err) {
            log(`Failed to kill process on port ${port}: ${err.message}`, 'ERROR');
        }
        
        // Start the service in the background
        const [cmd, ...args] = serviceCommand.split(' ');
        
        const serviceProcess = spawn(cmd, args, {
            cwd: servicePath,
            detached: true,
            stdio: 'ignore',
            env: { ...process.env, PORT: port }
        });
        
        serviceProcess.unref();
        
        // Update the last restart time
        state.lastRestart[endpoint.name] = Date.now();
        
        log(`Service ${endpoint.name} restarted`, 'FIX');
        return true;
    } catch (err) {
        log(`Failed to fix ${endpoint.name}: ${err.message}`, 'ERROR');
        return false;
    }
}

// Fix database issues
async function fixDatabase() {
    log('Attempting to fix database connection...', 'FIX');
    
    try {
        // Try to ensure database tables are created
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });
        
        const client = await pool.connect();
        
        // Check if essential tables exist
        const tableCheckResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        
        const existingTables = tableCheckResult.rows.map(row => row.table_name);
        const essentialTables = ['users', 'dashboards', 'analytics'];
        const missingTables = essentialTables.filter(table => !existingTables.includes(table));
        
        if (missingTables.length > 0) {
            log(`Missing essential tables: ${missingTables.join(', ')}`, 'FIX');
            
            for (const table of missingTables) {
                log(`Creating table: ${table}`, 'FIX');
                
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
            
            log('Created missing database tables', 'FIX');
        }
        
        client.release();
        return true;
    } catch (err) {
        log(`Failed to fix database: ${err.message}`, 'ERROR');
        return false;
    }
}

// Fix memory issues
function fixMemoryIssues() {
    log('Attempting to fix memory issues...', 'FIX');
    
    try {
        // Force garbage collection (if available)
        if (global.gc) {
            global.gc();
            log('Forced garbage collection', 'FIX');
        }
        
        // Return success - if memory is still an issue after GC, we'll need to restart
        return true;
    } catch (err) {
        log(`Failed to fix memory issues: ${err.message}`, 'ERROR');
        return false;
    }
}

// Main health check function
async function checkHealth() {
    if (state.isFixing) {
        log('Already running a fix operation. Skipping check.', 'WARN');
        return;
    }
    
    log('Running health check...');
    
    // Check endpoints
    const endpointResults = await Promise.all(CONFIG.endpoints.map(checkEndpoint));
    
    // Check database
    const databaseResult = await checkDatabase();
    
    // Check memory
    const memoryResult = checkMemoryUsage();
    
    // Log results
    for (const result of endpointResults) {
        const status = result.success ? 'OK' : 'FAILED';
        log(`Endpoint ${result.endpoint.name}: ${status} - ${result.success ? result.statusCode : result.error}`);
        
        // Track failures
        if (!result.success) {
            state.endpointFailures[result.endpoint.name] = (state.endpointFailures[result.endpoint.name] || 0) + 1;
        } else {
            state.endpointFailures[result.endpoint.name] = 0;
        }
    }
    
    log(`Database connection: ${databaseResult.success ? 'OK' : 'FAILED - ' + databaseResult.error}`);
    log(`Memory usage: ${memoryResult.memoryUsageMB}MB (${memoryResult.success ? 'OK' : 'HIGH'})`);
    
    // Fix issues if necessary
    let fixNeeded = false;
    
    // Check if any endpoint needs fixing
    for (const result of endpointResults) {
        if (!result.success && state.endpointFailures[result.endpoint.name] >= CONFIG.maxFailures) {
            fixNeeded = true;
            break;
        }
    }
    
    // Check if database needs fixing
    if (!databaseResult.success) {
        fixNeeded = true;
    }
    
    // Check if memory needs fixing
    if (!memoryResult.success) {
        fixNeeded = true;
    }
    
    if (fixNeeded) {
        state.isFixing = true;
        log('Issues detected. Starting automatic fix...', 'FIX');
        
        // Fix endpoints
        for (const result of endpointResults) {
            if (!result.success && state.endpointFailures[result.endpoint.name] >= CONFIG.maxFailures) {
                await fixEndpoint(result.endpoint);
                state.endpointFailures[result.endpoint.name] = 0;
            }
        }
        
        // Fix database
        if (!databaseResult.success) {
            await fixDatabase();
        }
        
        // Fix memory
        if (!memoryResult.success) {
            fixMemoryIssues();
        }
        
        log('Automatic fix completed', 'FIX');
        state.isFixing = false;
    }
}

// Start the auto-fix system
async function startAutoFix() {
    log('Starting EHB Auto Fix System...');
    
    // Run an initial health check
    await checkHealth();
    
    // Set up interval for health checks
    setInterval(checkHealth, CONFIG.checkInterval);
}

// Register events for unexpected shutdowns
process.on('uncaughtException', (err) => {
    log(`Uncaught exception: ${err.message}`, 'ERROR');
    log(err.stack, 'ERROR');
});

process.on('unhandledRejection', (reason) => {
    log(`Unhandled rejection: ${reason}`, 'ERROR');
});

// Start the system
startAutoFix().catch(err => {
    log(`Failed to start auto-fix system: ${err.message}`, 'ERROR');
});
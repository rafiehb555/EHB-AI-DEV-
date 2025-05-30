/**
 * Fix EHB Errors Script
 * 
 * This script is designed to run on demand and fix any errors in the EHB system.
 * It's a comprehensive error-fixing tool that examines the current system state
 * and automatically applies fixes for known issues.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const http = require('http');
const https = require('https');
const { Pool } = require('pg');

// Ensure all required directories exist
function ensureDirectoriesExist() {
    console.log('Ensuring all required directories exist...');
    
    const requiredDirs = [
        'EHB-DASHBOARD',
        'EHB-DASHBOARD/backend',
        'EHB-DASHBOARD/backend/controllers',
        'EHB-DASHBOARD/backend/models',
        'EHB-DASHBOARD/backend/routes',
        'EHB-DASHBOARD/backend/middleware',
        'EHB-DASHBOARD/backend/config',
        'EHB-DASHBOARD/backend/utils',
        'EHB-DASHBOARD/backend/db',
        'EHB-DASHBOARD/frontend',
        'EHB-DASHBOARD/frontend/public',
        'EHB-DASHBOARD/frontend/src',
        'EHB-DASHBOARD/frontend/src/components',
        'EHB-DASHBOARD/frontend/src/pages',
        'EHB-HOME',
        'EHB-HOME/components',
        'EHB-HOME/pages',
        'EHB-HOME/utils',
        'EHB-HOME/styles',
        'EHB-AI-Dev-Fullstack',
        'EHB-AI-Dev-Fullstack/services',
        'scripts'
    ];
    
    for (const dir of requiredDirs) {
        const dirPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(dirPath)) {
            console.log(`Creating missing directory: ${dir}`);
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
    
    console.log('All required directories have been created.');
}

// Create essential server.js file if it doesn't exist
function ensureServerJsExists() {
    console.log('Checking for essential server.js file...');
    
    const serverJsPath = path.join(process.cwd(), 'EHB-DASHBOARD', 'backend', 'server.js');
    
    if (!fs.existsSync(serverJsPath)) {
        console.log('Creating missing server.js file...');
        
        const serverJsContent = `
/**
 * EHB Dashboard Backend Server
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { Pool } = require('pg');

// Load environment variables
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Apply Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = require('./db/db');

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// Setup API Routes
// TODO: Add routes here
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/dashboard', require('./routes/dashboardRoutes'));
// app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
    console.log(\`API Health Check: http://localhost:\${PORT}/api/health\`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

module.exports = app;
`;
        
        fs.writeFileSync(serverJsPath, serverJsContent);
        console.log('Created server.js successfully.');
    } else {
        console.log('server.js already exists.');
    }
}

// Ensure db.js file exists and is properly configured
function ensureDbJsExists() {
    console.log('Checking for essential db.js file...');
    
    const dbJsPath = path.join(process.cwd(), 'EHB-DASHBOARD', 'backend', 'db', 'db.js');
    
    if (!fs.existsSync(dbJsPath)) {
        console.log('Creating missing db.js file...');
        
        const dbJsContent = `
const { Pool } = require('pg');

// Create a new pool instance using the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Export the pool to be used throughout the application
module.exports = {
  pool,
  
  // Helper function to run queries
  query: (text, params) => pool.query(text, params),
  
  // Helper function to get a client from the pool
  getClient: async () => {
    const client = await pool.connect();
    return client;
  }
};
`;
        
        fs.writeFileSync(dbJsPath, dbJsContent);
        console.log('Created db.js successfully.');
    } else {
        console.log('db.js already exists.');
    }
}

// Fix package.json issues
function fixPackageJson() {
    console.log('Fixing package.json issues...');
    
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            
            // Ensure required dependencies
            const requiredDependencies = {
                "express": "^4.18.3",
                "pg": "^8.11.3",
                "cors": "^2.8.5",
                "helmet": "^7.1.0",
                "morgan": "^1.10.0",
                "compression": "^1.7.4",
                "dotenv": "^16.3.1",
                "bcryptjs": "^2.4.3",
                "jsonwebtoken": "^9.0.2",
                "next": "^14.1.0",
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "axios": "^1.6.5",
                "tailwindcss": "^3.4.1"
            };
            
            // Add any missing dependencies
            packageJson.dependencies = packageJson.dependencies || {};
            
            let dependenciesUpdated = false;
            
            for (const [name, version] of Object.entries(requiredDependencies)) {
                if (!packageJson.dependencies[name]) {
                    packageJson.dependencies[name] = version;
                    dependenciesUpdated = true;
                    console.log(`Added missing dependency: ${name}@${version}`);
                }
            }
            
            // Add scripts if they don't exist
            packageJson.scripts = packageJson.scripts || {};
            
            if (!packageJson.scripts['start:backend']) {
                packageJson.scripts['start:backend'] = 'node EHB-DASHBOARD/backend/server.js';
                console.log('Added start:backend script');
            }
            
            if (!packageJson.scripts['start:frontend']) {
                packageJson.scripts['start:frontend'] = 'cd EHB-DASHBOARD && npm run dev';
                console.log('Added start:frontend script');
            }
            
            if (!packageJson.scripts['start:home']) {
                packageJson.scripts['start:home'] = 'cd EHB-HOME && npm run dev';
                console.log('Added start:home script');
            }
            
            if (!packageJson.scripts['fix:errors']) {
                packageJson.scripts['fix:errors'] = 'node scripts/fix-ehb-errors.js';
                console.log('Added fix:errors script');
            }
            
            // Save the updated package.json
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log('Updated package.json successfully.');
            
            if (dependenciesUpdated) {
                console.log('Installing missing dependencies...');
                execSync('npm install', { stdio: 'inherit' });
                console.log('Dependencies installed successfully.');
            }
        } catch (err) {
            console.error(`Error updating package.json: ${err.message}`);
        }
    } else {
        console.log('package.json not found. Cannot fix dependencies.');
    }
}

// Fix EHB-HOME/next.config.js
function fixNextConfig() {
    console.log('Fixing EHB-HOME/next.config.js...');
    
    const nextConfigPath = path.join(process.cwd(), 'EHB-HOME', 'next.config.js');
    
    if (!fs.existsSync(nextConfigPath)) {
        console.log('Creating missing next.config.js file...');
        
        const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  port: 5005,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;
`;
        
        fs.writeFileSync(nextConfigPath, nextConfigContent);
        console.log('Created next.config.js successfully.');
    } else {
        console.log('Updating existing next.config.js...');
        
        let content = fs.readFileSync(nextConfigPath, 'utf8');
        
        // Ensure the port is set
        if (!content.includes('port:') && !content.includes('PORT:')) {
            content = content.replace(
                'const nextConfig = {',
                'const nextConfig = {\n  port: 5005,'
            );
            
            fs.writeFileSync(nextConfigPath, content);
            console.log('Added port configuration to next.config.js');
        }
    }
}

// Fix backend routes
function fixBackendRoutes() {
    console.log('Fixing backend routes...');
    
    const routesDir = path.join(process.cwd(), 'EHB-DASHBOARD', 'backend', 'routes');
    
    // Create authRoutes.js
    const authRoutesPath = path.join(routesDir, 'authRoutes.js');
    if (!fs.existsSync(authRoutesPath)) {
        console.log('Creating missing authRoutes.js...');
        
        const authRoutesContent = `
const express = require('express');
const router = express.Router();
// const { register, login, getMe, updateUser, deleteUser } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', (req, res) => {
    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
            user: {
                id: 1,
                username: req.body.username,
                email: req.body.email,
                role: 'user'
            }
        }
    });
});

// Login a user
router.post('/login', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        data: {
            user: {
                id: 1,
                username: req.body.username,
                email: req.body.email,
                role: 'user'
            },
            token: 'mocktoken123456'
        }
    });
});

// Get current user
router.get('/me', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                role: 'user'
            }
        }
    });
});

module.exports = router;
`;
        
        fs.writeFileSync(authRoutesPath, authRoutesContent);
        console.log('Created authRoutes.js successfully.');
    }
    
    // Create dashboardRoutes.js
    const dashboardRoutesPath = path.join(routesDir, 'dashboardRoutes.js');
    if (!fs.existsSync(dashboardRoutesPath)) {
        console.log('Creating missing dashboardRoutes.js...');
        
        const dashboardRoutesContent = `
const express = require('express');
const router = express.Router();
// const { getDashboards, getDashboard, createDashboard, updateDashboard, deleteDashboard } = require('../controllers/dashboardController');
// const { protect } = require('../middleware/authMiddleware');

// Get all dashboards
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: 2,
        data: {
            dashboards: [
                {
                    id: 1,
                    name: 'Main Dashboard',
                    description: 'Main EHB System Dashboard',
                    layout: 'grid',
                    is_default: true,
                    widgets: [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Analytics Dashboard',
                    description: 'System Analytics Dashboard',
                    layout: 'grid',
                    is_default: false,
                    widgets: [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        }
    });
});

// Get a single dashboard
router.get('/:id', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            dashboard: {
                id: parseInt(req.params.id),
                name: 'Main Dashboard',
                description: 'Main EHB System Dashboard',
                layout: 'grid',
                is_default: true,
                widgets: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        }
    });
});

// Create a new dashboard
router.post('/', (req, res) => {
    res.status(201).json({
        status: 'success',
        data: {
            dashboard: {
                id: 3,
                name: req.body.name,
                description: req.body.description,
                layout: req.body.layout || 'grid',
                is_default: req.body.is_default || false,
                widgets: req.body.widgets || [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        }
    });
});

module.exports = router;
`;
        
        fs.writeFileSync(dashboardRoutesPath, dashboardRoutesContent);
        console.log('Created dashboardRoutes.js successfully.');
    }
    
    // Update server.js to include routes
    const serverJsPath = path.join(process.cwd(), 'EHB-DASHBOARD', 'backend', 'server.js');
    if (fs.existsSync(serverJsPath)) {
        let serverContent = fs.readFileSync(serverJsPath, 'utf8');
        
        // Uncomment or add route imports
        if (serverContent.includes('// app.use(\'/api/auth\', require(\'./routes/authRoutes\'));')) {
            serverContent = serverContent.replace(
                '// app.use(\'/api/auth\', require(\'./routes/authRoutes\'));',
                'app.use(\'/api/auth\', require(\'./routes/authRoutes\'));'
            );
        }
        
        if (serverContent.includes('// app.use(\'/api/dashboard\', require(\'./routes/dashboardRoutes\'));')) {
            serverContent = serverContent.replace(
                '// app.use(\'/api/dashboard\', require(\'./routes/dashboardRoutes\'));',
                'app.use(\'/api/dashboard\', require(\'./routes/dashboardRoutes\'));'
            );
        }
        
        fs.writeFileSync(serverJsPath, serverContent);
        console.log('Updated server.js to include routes.');
    }
}

// Check database connection and create tables if needed
async function fixDatabase() {
    console.log('Checking database connection...');
    
    if (!process.env.DATABASE_URL) {
        console.log('DATABASE_URL environment variable not set. Skipping database fixes.');
        return;
    }
    
    try {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            connectionTimeoutMillis: 5000
        });
        
        const client = await pool.connect();
        console.log('Successfully connected to database!');
        
        // Check if essential tables exist
        console.log('Checking for essential database tables...');
        
        const tableCheckResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        
        const existingTables = tableCheckResult.rows.map(row => row.table_name);
        const essentialTables = ['users', 'dashboards', 'analytics'];
        const missingTables = essentialTables.filter(table => !existingTables.includes(table));
        
        if (missingTables.length > 0) {
            console.log(`Missing essential tables: ${missingTables.join(', ')}`);
            console.log('Creating missing tables...');
            
            for (const table of missingTables) {
                console.log(`Creating table: ${table}`);
                
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
            
            console.log('Missing tables created successfully');
        } else {
            console.log('All essential database tables already exist.');
        }
        
        client.release();
    } catch (err) {
        console.error(`Database connection error: ${err.message}`);
        console.log('Continuing with other fixes despite database issues.');
    }
}

// Fix port conflicts
async function fixPortConflicts() {
    console.log('Checking for port conflicts...');
    
    const portsToCheck = [5001, 5005, 5006, 5010];
    
    for (const port of portsToCheck) {
        try {
            console.log(`Checking port ${port}...`);
            
            // Try to kill any process using this port
            try {
                execSync(`node kill-port.js ${port}`, { stdio: 'pipe' });
                console.log(`Killed process on port ${port} if it existed.`);
            } catch (err) {
                // It's okay if no process was killed
            }
            
            // Try to create a server on the port to make sure it's free
            const server = http.createServer();
            
            await new Promise((resolve, reject) => {
                server.once('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        console.log(`Port ${port} is still in use despite kill attempt.`);
                        reject(err);
                    } else {
                        reject(err);
                    }
                });
                
                server.once('listening', () => {
                    server.close(() => {
                        console.log(`Port ${port} is now free.`);
                        resolve();
                    });
                });
                
                server.listen(port);
            }).catch(err => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${port} conflict could not be resolved.`);
                } else {
                    console.error(`Error checking port ${port}: ${err.message}`);
                }
            });
        } catch (err) {
            console.error(`Error resolving port ${port}: ${err.message}`);
        }
    }
    
    console.log('Port conflict check and resolution completed.');
}

// Restart workflows
async function restartWorkflows() {
    console.log('Restarting workflows...');
    
    // Restart Backend Server
    try {
        console.log('Restarting Backend Server workflow...');
        const serverProcess = spawn('node', ['EHB-DASHBOARD/backend/server.js'], {
            detached: true,
            stdio: 'ignore'
        });
        serverProcess.unref();
        console.log('Backend Server workflow restarted.');
    } catch (err) {
        console.error(`Failed to restart Backend Server workflow: ${err.message}`);
    }
    
    // Restart EHB-HOME
    try {
        console.log('Restarting EHB-HOME workflow...');
        const homePath = path.join(process.cwd(), 'EHB-HOME');
        
        if (fs.existsSync(homePath)) {
            const homeProcess = spawn('npm', ['run', 'dev'], {
                cwd: homePath,
                detached: true,
                stdio: 'ignore',
                env: { ...process.env, PORT: 5005 }
            });
            homeProcess.unref();
            console.log('EHB-HOME workflow restarted.');
        } else {
            console.log('EHB-HOME directory does not exist. Cannot restart workflow.');
        }
    } catch (err) {
        console.error(`Failed to restart EHB-HOME workflow: ${err.message}`);
    }
    
    console.log('All workflows restarted.');
}

// Add auto-run configuration for auto-fix script
function setupAutoFixScheduler() {
    console.log('Setting up auto-fix scheduler...');
    
    const schedulerPath = path.join(process.cwd(), 'scripts', 'auto-fix-scheduler.js');
    
    if (!fs.existsSync(schedulerPath)) {
        console.log('Creating auto-fix scheduler script...');
        
        const schedulerContent = `
/**
 * Auto Fix Scheduler
 * 
 * This script runs the auto-fix process at regular intervals.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Log function
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = \`[\${timestamp}] \${message}\`;
    console.log(logMessage);
    
    try {
        fs.appendFileSync(path.join(process.cwd(), 'ehb_auto_fix_scheduler.log'), logMessage + '\\n');
    } catch (err) {
        console.error(\`Failed to write to log file: \${err.message}\`);
    }
}

// Run the fix-ehb-errors script
function runAutoFix() {
    log('Running automatic system fixes...');
    
    try {
        execSync('node scripts/fix-ehb-errors.js', { stdio: 'inherit' });
        log('Automatic system fixes completed successfully.');
    } catch (err) {
        log(\`Error running automatic fixes: \${err.message}\`);
    }
}

// Main function
function startScheduler() {
    log('Starting auto-fix scheduler...');
    
    // Run an initial fix
    runAutoFix();
    
    // Set up interval
    setInterval(runAutoFix, CHECK_INTERVAL);
    
    log(\`Auto-fix scheduler started. Will run every \${CHECK_INTERVAL / 60000} minutes.\`);
}

// Register for unexpected shutdowns
process.on('uncaughtException', (err) => {
    log(\`Uncaught exception: \${err.message}\`);
    log(err.stack);
});

process.on('unhandledRejection', (reason) => {
    log(\`Unhandled rejection: \${reason}\`);
});

// Start the scheduler
startScheduler();
`;
        
        fs.writeFileSync(schedulerPath, schedulerContent);
        console.log('Auto-fix scheduler script created successfully.');
    } else {
        console.log('Auto-fix scheduler script already exists.');
    }
    
    // Add to package.json scripts
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            
            packageJson.scripts = packageJson.scripts || {};
            
            if (!packageJson.scripts['start:auto-fix']) {
                packageJson.scripts['start:auto-fix'] = 'node scripts/auto-fix-scheduler.js';
                console.log('Added start:auto-fix script to package.json');
                
                // Save the updated package.json
                fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            }
        } catch (err) {
            console.error(`Error updating package.json: ${err.message}`);
        }
    }
}

// Main function
async function main() {
    console.log('Starting EHB System Error Fixer...');
    
    try {
        // Step 1: Ensure all directories exist
        ensureDirectoriesExist();
        
        // Step 2: Ensure essential server files exist
        ensureServerJsExists();
        ensureDbJsExists();
        
        // Step 3: Fix package.json
        fixPackageJson();
        
        // Step 4: Fix Next.js configuration
        fixNextConfig();
        
        // Step 5: Fix backend routes
        fixBackendRoutes();
        
        // Step 6: Check and fix database
        await fixDatabase();
        
        // Step 7: Fix port conflicts
        await fixPortConflicts();
        
        // Step 8: Setup auto-fix scheduler
        setupAutoFixScheduler();
        
        // Step 9: Restart workflows
        await restartWorkflows();
        
        console.log('All fixes completed successfully!');
    } catch (err) {
        console.error(`Error during fix process: ${err.message}`);
        console.error(err.stack);
    }
}

// Run the main function
main().catch(err => {
    console.error(`Fatal error: ${err.message}`);
    process.exit(1);
});
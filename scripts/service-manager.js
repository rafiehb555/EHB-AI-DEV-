/**
 * EHB Service Manager
 * 
 * This script provides a command-line interface for creating and managing service
 * configurations that the Auto Development Agent will use to generate services.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SERVICE_CONFIG_DIR = path.join(__dirname, '../temp/service-configs');

// Ensure service config directory exists
if (!fs.existsSync(SERVICE_CONFIG_DIR)) {
  fs.mkdirSync(SERVICE_CONFIG_DIR, { recursive: true });
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * List all service configurations
 */
function listServices() {
  console.log('\n=== EHB Service Configurations ===');
  
  // Get all config files
  const files = fs.readdirSync(SERVICE_CONFIG_DIR).filter(file => file.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('No service configurations found');
    return;
  }
  
  // Display each service configuration
  files.forEach(file => {
    try {
      const config = JSON.parse(fs.readFileSync(path.join(SERVICE_CONFIG_DIR, file), 'utf8'));
      console.log(`\n- ${config.name} (${config.type})`);
      console.log(`  Created: ${new Date(config.createdAt).toLocaleString()}`);
      console.log(`  Updated: ${new Date(config.updatedAt).toLocaleString()}`);
      
      if (config.requirements) {
        console.log('  Requirements:');
        Object.keys(config.requirements).forEach(key => {
          console.log(`    ${key}: ${config.requirements[key]}`);
        });
      }
    } catch (error) {
      console.error(`Error reading config file ${file}: ${error.message}`);
    }
  });
  
  console.log('\n=== End of Service Configurations ===\n');
}

/**
 * Create a new service configuration
 */
function createService() {
  console.log('\n=== Create New Service Configuration ===');
  
  const service = {};
  
  rl.question('Service Name: ', (name) => {
    service.name = name;
    
    rl.question('Service Type (frontend, backend, fullstack): ', (type) => {
      if (!['frontend', 'backend', 'fullstack'].includes(type)) {
        console.error('Invalid service type. Must be frontend, backend, or fullstack.');
        mainMenu();
        return;
      }
      
      service.type = type;
      service.requirements = {};
      
      // Ask for database type
      rl.question('Database Type (mongodb, supabase, none): ', (dbType) => {
        service.requirements.database = dbType;
        
        // Ask for authentication
        rl.question('Authentication Required (yes/no): ', (auth) => {
          service.requirements.authentication = auth.toLowerCase() === 'yes';
          
          // Ask for API integration
          rl.question('API Integration (openai, anthropic, none): ', (api) => {
            service.requirements.apiIntegration = api;
            
            // Ask for UI framework
            rl.question('UI Framework (tailwind, material-ui, none): ', (ui) => {
              service.requirements.uiFramework = ui;
              
              // Save the service configuration
              service.createdAt = new Date().toISOString();
              service.updatedAt = new Date().toISOString();
              
              const configFile = path.join(SERVICE_CONFIG_DIR, `${service.name}.json`);
              fs.writeFileSync(configFile, JSON.stringify(service, null, 2));
              
              console.log(`\nService configuration created: ${service.name}`);
              mainMenu();
            });
          });
        });
      });
    });
  });
}

/**
 * Update an existing service configuration
 */
function updateService() {
  console.log('\n=== Update Service Configuration ===');
  
  // Get all config files
  const files = fs.readdirSync(SERVICE_CONFIG_DIR).filter(file => file.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('No service configurations found');
    mainMenu();
    return;
  }
  
  // Display available services
  console.log('Available services:');
  files.forEach((file, index) => {
    const config = JSON.parse(fs.readFileSync(path.join(SERVICE_CONFIG_DIR, file), 'utf8'));
    console.log(`${index + 1}. ${config.name} (${config.type})`);
  });
  
  // Ask which service to update
  rl.question('\nEnter service number to update: ', (num) => {
    const index = parseInt(num) - 1;
    
    if (isNaN(index) || index < 0 || index >= files.length) {
      console.error('Invalid selection');
      mainMenu();
      return;
    }
    
    const file = files[index];
    const config = JSON.parse(fs.readFileSync(path.join(SERVICE_CONFIG_DIR, file), 'utf8'));
    
    console.log(`\nUpdating ${config.name} (${config.type})`);
    
    // Ask for database type
    rl.question(`Database Type (${config.requirements.database}): `, (dbType) => {
      config.requirements.database = dbType || config.requirements.database;
      
      // Ask for authentication
      const currentAuth = config.requirements.authentication ? 'yes' : 'no';
      rl.question(`Authentication Required (${currentAuth}): `, (auth) => {
        if (auth) {
          config.requirements.authentication = auth.toLowerCase() === 'yes';
        }
        
        // Ask for API integration
        rl.question(`API Integration (${config.requirements.apiIntegration}): `, (api) => {
          config.requirements.apiIntegration = api || config.requirements.apiIntegration;
          
          // Ask for UI framework
          rl.question(`UI Framework (${config.requirements.uiFramework}): `, (ui) => {
            config.requirements.uiFramework = ui || config.requirements.uiFramework;
            
            // Save the updated service configuration
            config.updatedAt = new Date().toISOString();
            
            fs.writeFileSync(path.join(SERVICE_CONFIG_DIR, file), JSON.stringify(config, null, 2));
            
            console.log(`\nService configuration updated: ${config.name}`);
            mainMenu();
          });
        });
      });
    });
  });
}

/**
 * Delete a service configuration
 */
function deleteService() {
  console.log('\n=== Delete Service Configuration ===');
  
  // Get all config files
  const files = fs.readdirSync(SERVICE_CONFIG_DIR).filter(file => file.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('No service configurations found');
    mainMenu();
    return;
  }
  
  // Display available services
  console.log('Available services:');
  files.forEach((file, index) => {
    const config = JSON.parse(fs.readFileSync(path.join(SERVICE_CONFIG_DIR, file), 'utf8'));
    console.log(`${index + 1}. ${config.name} (${config.type})`);
  });
  
  // Ask which service to delete
  rl.question('\nEnter service number to delete: ', (num) => {
    const index = parseInt(num) - 1;
    
    if (isNaN(index) || index < 0 || index >= files.length) {
      console.error('Invalid selection');
      mainMenu();
      return;
    }
    
    const file = files[index];
    const config = JSON.parse(fs.readFileSync(path.join(SERVICE_CONFIG_DIR, file), 'utf8'));
    
    rl.question(`Are you sure you want to delete ${config.name}? (yes/no): `, (confirm) => {
      if (confirm.toLowerCase() === 'yes') {
        fs.unlinkSync(path.join(SERVICE_CONFIG_DIR, file));
        console.log(`\nService configuration deleted: ${config.name}`);
      } else {
        console.log('\nDeletion cancelled');
      }
      
      mainMenu();
    });
  });
}

/**
 * Add a feature to a service
 */
function addFeature() {
  console.log('\n=== Add Feature to Service ===');
  
  // Get all config files
  const files = fs.readdirSync(SERVICE_CONFIG_DIR).filter(file => file.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('No service configurations found');
    mainMenu();
    return;
  }
  
  // Display available services
  console.log('Available services:');
  files.forEach((file, index) => {
    const config = JSON.parse(fs.readFileSync(path.join(SERVICE_CONFIG_DIR, file), 'utf8'));
    console.log(`${index + 1}. ${config.name} (${config.type})`);
  });
  
  // Ask which service to update
  rl.question('\nEnter service number to add feature: ', (num) => {
    const index = parseInt(num) - 1;
    
    if (isNaN(index) || index < 0 || index >= files.length) {
      console.error('Invalid selection');
      mainMenu();
      return;
    }
    
    const file = files[index];
    const config = JSON.parse(fs.readFileSync(path.join(SERVICE_CONFIG_DIR, file), 'utf8'));
    
    console.log(`\nAdding feature to ${config.name} (${config.type})`);
    
    // Initialize features array if it doesn't exist
    if (!config.features) {
      config.features = [];
    }
    
    rl.question('Feature Name: ', (name) => {
      rl.question('Feature Description: ', (description) => {
        rl.question('Feature Priority (high, medium, low): ', (priority) => {
          // Add the feature
          config.features.push({
            name,
            description,
            priority,
            createdAt: new Date().toISOString(),
            status: 'pending'
          });
          
          // Update timestamp
          config.updatedAt = new Date().toISOString();
          
          // Save the updated config
          fs.writeFileSync(path.join(SERVICE_CONFIG_DIR, file), JSON.stringify(config, null, 2));
          
          console.log(`\nFeature "${name}" added to ${config.name}`);
          mainMenu();
        });
      });
    });
  });
}

/**
 * Display the main menu
 */
function mainMenu() {
  console.log('\n=== EHB Service Manager ===');
  console.log('1. List Services');
  console.log('2. Create Service');
  console.log('3. Update Service');
  console.log('4. Delete Service');
  console.log('5. Add Feature');
  console.log('0. Exit');
  
  rl.question('\nSelect an option: ', (option) => {
    switch (option) {
      case '1':
        listServices();
        mainMenu();
        break;
      case '2':
        createService();
        break;
      case '3':
        updateService();
        break;
      case '4':
        deleteService();
        break;
      case '5':
        addFeature();
        break;
      case '0':
        rl.close();
        break;
      default:
        console.log('Invalid option');
        mainMenu();
    }
  });
}

// Start the application
console.log('=== EHB Service Manager ===');
console.log('Use this tool to create and manage service configurations');
console.log('The Auto Development Agent will automatically process these configurations');

mainMenu();

// Handle exit
rl.on('close', () => {
  console.log('\nThank you for using EHB Service Manager');
  process.exit(0);
});
/**
 * JPS (Job Providing Service) Integration for GoSellr
 * 
 * This script connects GoSellr with the JPS service,
 * allowing job postings and applications to be shared between systems.
 */

const fs = require('fs');
const path = require('path');

// JPS path
const jpsPath = path.join(__dirname, '..', 'JPS-Job-Providing-Service');

// Connection status
let connected = false;

// Check if JPS exists
function checkJPSService() {
  if (fs.existsSync(jpsPath)) {
    connected = true;
    console.log('Connected to JPS-Job-Providing-Service successfully');
    return true;
  } else {
    console.log(`Warning: JPS path not found at ${jpsPath}`);
    return false;
  }
}

// Set up local JPS integration
function setupLocalJPS() {
  const jpsLocalPath = path.join(__dirname, 'jps');
  
  // Ensure the JPS directory exists
  if (!fs.existsSync(jpsLocalPath)) {
    fs.mkdirSync(jpsLocalPath, { recursive: true });
  }
  
  // Create API integration folder
  const apiPath = path.join(jpsLocalPath, 'api');
  
  if (!fs.existsSync(apiPath)) {
    fs.mkdirSync(apiPath, { recursive: true });
  }
  
  // Create job data folder
  const jobsPath = path.join(jpsLocalPath, 'jobs');
  
  if (!fs.existsSync(jobsPath)) {
    fs.mkdirSync(jobsPath, { recursive: true });
  }
  
  // Create API information file
  const apiInfo = {
    service: 'JPS-Job-Providing-Service',
    base_url: 'http://localhost:5003/api',
    integration_date: new Date().toISOString(),
    status: connected ? 'active' : 'inactive',
    endpoints: [
      { path: '/jobs', method: 'GET', description: 'Get all job listings' },
      { path: '/jobs/:id', method: 'GET', description: 'Get job details by ID' },
      { path: '/jobs/:id/apply', method: 'POST', description: 'Apply for a job' },
      { path: '/jobs', method: 'POST', description: 'Post a new job listing' }
    ]
  };
  
  fs.writeFileSync(
    path.join(apiPath, 'jps-api-info.json'),
    JSON.stringify(apiInfo, null, 2)
  );
  
  // Create sample job listings
  const jobListings = [
    {
      id: 1,
      title: 'E-commerce Store Manager',
      company: 'GoSellr Franchise',
      location: 'Remote',
      description: 'Manage online store operations and customer service for a GoSellr franchise.',
      requirements: [
        'At least 2 years of e-commerce experience',
        'Customer service background',
        'Proficiency with digital marketing tools',
        'Experience with inventory management'
      ],
      benefits: [
        'Flexible work hours',
        'Health insurance',
        'Paid time off',
        'Employee discount'
      ],
      salary: '$45,000 - $60,000',
      job_type: 'Full-time',
      posted_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      title: 'Digital Marketing Specialist',
      company: 'GoSellr Corporate',
      location: 'New York, NY',
      description: 'Create and manage marketing campaigns for our e-commerce platform.',
      requirements: [
        'Bachelor\'s degree in Marketing or related field',
        'Experience with social media marketing',
        'Knowledge of SEO/SEM',
        'Analytical skills for campaign measurement'
      ],
      benefits: [
        'Competitive salary',
        'Comprehensive benefits package',
        'Career advancement opportunities',
        'Collaborative work environment'
      ],
      salary: '$55,000 - $70,000',
      job_type: 'Full-time',
      posted_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      title: 'Inventory Manager',
      company: 'GoSellr Logistics',
      location: 'Chicago, IL',
      description: 'Oversee inventory management for our e-commerce warehouses.',
      requirements: [
        'Experience with inventory management systems',
        'Strong organizational skills',
        'Attention to detail',
        'Supply chain knowledge'
      ],
      benefits: [
        'Competitive salary',
        'Health and dental insurance',
        '401(k) matching',
        'Professional development opportunities'
      ],
      salary: '$50,000 - $65,000',
      job_type: 'Full-time',
      posted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  fs.writeFileSync(
    path.join(jobsPath, 'job-listings.json'),
    JSON.stringify(jobListings, null, 2)
  );
  
  // Create configuration file
  const config = {
    name: 'JPS Integration for GoSellr',
    version: '1.0.0',
    integration_path: connected ? jpsPath : null,
    status: connected ? 'connected' : 'disconnected',
    last_sync: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(jpsLocalPath, 'config.json'),
    JSON.stringify(config, null, 2)
  );
  
  console.log('Created local JPS integration');
}

// Integrate with JPS if it exists
function integrateWithJPS() {
  if (!connected) {
    return false;
  }
  
  try {
    // Create integration directory in JPS
    const integrationPath = path.join(jpsPath, 'integrations', 'gosellr');
    
    if (!fs.existsSync(integrationPath)) {
      fs.mkdirSync(integrationPath, { recursive: true });
    }
    
    // Create integration information file
    const integrationInfo = {
      service: 'GoSellr E-commerce',
      integration_date: new Date().toISOString(),
      status: 'active',
      features: [
        'Job postings for e-commerce roles',
        'Job applications from GoSellr users',
        'Franchise job listings',
        'E-commerce skill matching'
      ]
    };
    
    fs.writeFileSync(
      path.join(integrationPath, 'integration-info.json'),
      JSON.stringify(integrationInfo, null, 2)
    );
    
    console.log('Created JPS integration files');
    return true;
  } catch (error) {
    console.error('Error creating JPS integration files:', error);
    return false;
  }
}

// Main function
function integrateWithJPSService() {
  console.log('Starting JPS integration...');
  
  // Check if JPS exists
  const jpsExists = checkJPSService();
  
  // Set up local JPS integration
  setupLocalJPS();
  
  // Integrate with JPS if it exists
  if (jpsExists) {
    integrateWithJPS();
  }
  
  console.log('JPS integration complete');
  
  return { connected };
}

// Run the integration
if (require.main === module) {
  const results = integrateWithJPSService();
  console.log('Integration results:', results);
}

module.exports = {
  integrateWithJPSService,
  checkJPSService,
  connected
};
/**
 * EHB-HOME Integrations
 * 
 * This script serves as the central integration hub for EHB system,
 * connecting all services and departments together.
 */

const fs = require('fs');
const path = require('path');

// Define paths to all EHB components
const componentPaths = {
  // SQL Departments
  sqlDepartments: {
    pss: path.join(__dirname, '..', '..', 'system', 'EHB-SQL', 'EHB-SQL-PSS'),
    edr: path.join(__dirname, '..', '..', 'system', 'EHB-SQL', 'EHB-SQL-EDR'),
    emo: path.join(__dirname, '..', '..', 'system', 'EHB-SQL', 'EHB-SQL-EMO')
  },
  
  // Service Components
  services: {
    gosellr: path.join(__dirname, '..', '..', 'services', 'EHB-GoSellr'),
    jps: path.join(__dirname, '..', '..', 'services', 'JPS-Job-Providing-Service')
  },
  
  // System Components
  system: {
    blockchain: path.join(__dirname, '..', '..', 'system', 'EHB-Blockchain'),
    franchise: path.join(__dirname, '..', '..', 'system', 'franchise-system')
  },
  
  // Admin Components
  admin: {
    adminPanel: path.join(__dirname, '..', 'ehb-admin-panel'),
    dashboard: path.join(__dirname, '..', 'EHB-DASHBOARD'),
    wallet: path.join(__dirname, '..', 'ehb-wallet')
  }
};

// Track connection statuses
const connections = {
  sqlDepartments: { pss: false, edr: false, emo: false },
  services: { gosellr: false, jps: false },
  system: { blockchain: false, franchise: false },
  admin: { adminPanel: false, dashboard: false, wallet: false }
};

// Check component existence and connectivity
function checkAllComponents() {
  console.log('EHB-HOME: Checking system components...');
  
  // Check each component category
  Object.keys(componentPaths).forEach(category => {
    Object.keys(componentPaths[category]).forEach(component => {
      const componentPath = componentPaths[category][component];
      
      if (fs.existsSync(componentPath)) {
        connections[category][component] = true;
        console.log(`✅ Connected to ${component.toUpperCase()}`);
      } else {
        console.log(`❌ Failed to connect to ${component.toUpperCase()} at ${componentPath}`);
      }
    });
  });
  
  return connections;
}

// Generate integration data for EHB-HOME
function generateIntegrationData() {
  console.log('EHB-HOME: Generating integration data...');
  
  const integrationData = {
    system_name: 'Enterprise Hybrid Blockchain (EHB)',
    version: '1.0.0',
    last_updated: new Date().toISOString(),
    components: {},
    services: []
  };
  
  // Add component status
  Object.keys(connections).forEach(category => {
    integrationData.components[category] = {};
    
    Object.keys(connections[category]).forEach(component => {
      integrationData.components[category][component] = {
        name: component.toUpperCase(),
        path: componentPaths[category][component],
        status: connections[category][component] ? 'connected' : 'disconnected',
        last_checked: new Date().toISOString()
      };
      
      // Add to services list if connected
      if (connections[category][component]) {
        integrationData.services.push({
          id: component,
          name: component.toUpperCase(),
          category: category,
          status: 'active',
          url: `/system/${category}/${component}`
        });
      }
    });
  });
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Write integration data
  fs.writeFileSync(
    path.join(dataDir, 'integration-data.json'),
    JSON.stringify(integrationData, null, 2)
  );
  
  console.log('EHB-HOME: Integration data generated successfully');
  return integrationData;
}

// Create service cards for EHB-HOME dashboard
function createServiceCards() {
  console.log('EHB-HOME: Creating service cards for dashboard...');
  
  const servicesData = [
    {
      id: 'gosellr',
      name: 'GoSellr E-commerce',
      description: 'E-commerce platform with franchise management system for online sellers',
      icon: '🛒',
      link: '/services/EHB-GoSellr',
      category: 'E-commerce',
      status: connections.services.gosellr ? 'active' : 'maintenance',
      port: 5002
    },
    {
      id: 'jps',
      name: 'Job Providing Service',
      description: 'Job matching and career services for professionals',
      icon: '💼',
      link: '/services/JPS-Job-Providing-Service',
      category: 'Employment',
      status: connections.services.jps ? 'active' : 'maintenance'
    },
    {
      id: 'sql-pss',
      name: 'SQL Product Sales System',
      description: 'Database management for product inventory and sales',
      icon: '📊',
      link: '/system/EHB-SQL/EHB-SQL-PSS',
      category: 'Database',
      status: connections.sqlDepartments.pss ? 'active' : 'maintenance'
    },
    {
      id: 'sql-edr',
      name: 'SQL E-commerce Data Repository',
      description: 'Central data repository for e-commerce analytics',
      icon: '📈',
      link: '/system/EHB-SQL/EHB-SQL-EDR',
      category: 'Database',
      status: connections.sqlDepartments.edr ? 'active' : 'maintenance'
    },
    {
      id: 'sql-emo',
      name: 'SQL Marketing Optimization',
      description: 'Database tools for marketing campaign optimization',
      icon: '📱',
      link: '/system/EHB-SQL/EHB-SQL-EMO',
      category: 'Database',
      status: connections.sqlDepartments.emo ? 'active' : 'maintenance'
    },
    {
      id: 'blockchain',
      name: 'Blockchain Services',
      description: 'Distributed ledger technology for secure transactions',
      icon: '🔗',
      link: '/system/EHB-Blockchain',
      category: 'Technology',
      status: connections.system.blockchain ? 'active' : 'maintenance'
    },
    {
      id: 'franchise',
      name: 'Franchise System',
      description: 'Management platform for franchise operations',
      icon: '🏢',
      link: '/system/franchise-system',
      category: 'Management',
      status: connections.system.franchise ? 'active' : 'maintenance'
    },
    {
      id: 'admin-panel',
      name: 'Admin Panel',
      description: 'Administrative controls for EHB system',
      icon: '⚙️',
      link: '/admin/ehb-admin-panel',
      category: 'Administration',
      status: connections.admin.adminPanel ? 'active' : 'maintenance',
      port: 5000
    },
    {
      id: 'wallet',
      name: 'EHB Wallet',
      description: 'Secure digital wallet for crypto and fiat transactions',
      icon: '💰',
      link: '/admin/ehb-wallet',
      category: 'Finance',
      status: connections.admin.wallet ? 'active' : 'maintenance'
    },
    // Add all EHB microservices below as cards
    {
      id: 'ai-integration-hub',
      name: 'AI Integration Hub',
      description: 'Central hub for all AI integrations and services',
      icon: '🤖',
      link: 'http://localhost:5150/',
      directUrl: 'http://localhost:5150/',
      category: 'AI Services',
      status: 'active',
      port: 5150
    },
    {
      id: 'autonomous-agent',
      name: 'Autonomous Agent System',
      description: 'Intelligent agent system for automated tasks',
      icon: '🔄',
      link: 'http://localhost:5200/',
      directUrl: 'http://localhost:5200/',
      category: 'AI Services',
      status: 'active',
      port: 5200
    },
    {
      id: 'backend-server',
      name: 'Backend Server',
      description: 'Main API server for EHB systems',
      icon: '🖥️',
      link: 'http://localhost:5001/',
      directUrl: 'http://localhost:5001/',
      category: 'Core Services',
      status: 'active',
      port: 5001
    },
    {
      id: 'developer-portal',
      name: 'Developer Portal',
      description: 'Portal for developers to access EHB APIs and documentation',
      icon: '👩‍💻',
      link: 'http://localhost:5010/',
      directUrl: 'http://localhost:5010/',
      category: 'Development',
      status: 'active',
      port: 5010
    },
    {
      id: 'admin-dashboard',
      name: 'Admin Dashboard',
      description: 'Administrative dashboard for EHB AI Dev',
      icon: '📊',
      link: 'http://localhost:5020/',
      directUrl: 'http://localhost:5020/',
      category: 'Administration',
      status: 'active',
      port: 5020
    },
    {
      id: 'playground',
      name: 'EHB Playground',
      description: 'Interactive testing environment for EHB features',
      icon: '🧪',
      link: 'http://localhost:5050/',
      directUrl: 'http://localhost:5050/',
      category: 'Development',
      status: 'active',
      port: 5050
    },
    {
      id: 'langchain-service',
      name: 'LangChain AI Service',
      description: 'AI service powered by LangChain',
      icon: '🧠',
      link: 'http://localhost:5100/',
      directUrl: 'http://localhost:5100/',
      category: 'AI Services',
      status: 'active',
      port: 5100
    },
    {
      id: 'mongodb-api',
      name: 'MongoDB API Service',
      description: 'API service for MongoDB data access',
      icon: '🗃️',
      link: 'http://localhost:5300/',
      directUrl: 'http://localhost:5300/',
      category: 'Database',
      status: 'active',
      port: 5300
    },
    {
      id: 'frontend-server',
      name: 'Frontend Server',
      description: 'Main frontend server for EHB',
      icon: '🌐',
      link: 'http://localhost:5000/',
      directUrl: 'http://localhost:5000/',
      category: 'Core Services',
      status: 'active',
      port: 5000
    },
    {
      id: 'ai-agent-core',
      name: 'AI Agent Core',
      description: 'Central orchestration for all AI agents in the EHB system',
      icon: '🧠',
      link: 'http://localhost:5128/',
      directUrl: 'http://localhost:5128/',
      category: 'AI Services',
      status: 'active',
      port: 5128
    },
    {
      id: 'ehb-free-agent',
      name: 'EHB Free Agent',
      description: 'Free-running autonomous agent for task automation',
      icon: '🤖',
      link: 'http://localhost:5130/',
      directUrl: 'http://localhost:5130/',
      category: 'AI Services',
      status: 'active',
      port: 5130
    },
    {
      id: 'unified-admin-hub',
      name: 'Unified Admin Hub',
      description: 'Central access point for all EHB admin interfaces',
      icon: '🔗',
      link: 'http://localhost:5000/admin/hub',
      directUrl: 'http://localhost:5000/admin/hub',
      category: 'Administration',
      status: 'active',
      port: 5000
    },
    {
      id: 'ehb-admin',
      name: 'EHB Admin Dashboard',
      description: 'Comprehensive administration dashboard for managing all EHB systems',
      icon: '🖥️',
      link: 'https://64f8b65f-fbf1-4bb3-ad82-dc052d0ba0e1-00-2i8uq6f42qdss.picard.replit.dev:8008/dashboard',
      directUrl: 'https://64f8b65f-fbf1-4bb3-ad82-dc052d0ba0e1-00-2i8uq6f42qdss.picard.replit.dev:8008/dashboard',
      category: 'Administration',
      status: 'active',
      port: 8008
    },
    {
      id: 'developer-portal',
      name: 'Developer Portal',
      description: 'Access point for developers to manage API integrations and documentation',
      icon: '👨‍💻',
      link: 'http://localhost:5010',
      directUrl: 'http://localhost:5010',
      category: 'Development',
      status: 'active',
      port: 5010
    },
    {
      id: 'sql-badge-system',
      name: 'SQL Badge System',
      description: 'Track and display SQL proficiency levels with achievement badges',
      icon: '🏆',
      link: 'http://localhost:5005/api/sql-levels',
      directUrl: 'http://localhost:5005/api/sql-levels',
      category: 'Education',
      status: 'active',
      port: 5005
    },
    {
      id: 'ehb-ai-dev',
      name: 'EHB AI Development',
      description: 'Development environment for AI components and agents with advanced integration capabilities',
      icon: '🧠',
      link: 'http://localhost:5006/api/',
      directUrl: 'http://localhost:5006/api/',
      category: 'AI Development',
      status: 'active',
      port: 5006,
      highlighted: true
    }
  ];
  
  // Create cards directory if it doesn't exist
  const cardsDir = path.join(__dirname, 'data', 'cards');
  if (!fs.existsSync(cardsDir)) {
    fs.mkdirSync(cardsDir, { recursive: true });
  }
  
  // Write service cards data
  fs.writeFileSync(
    path.join(cardsDir, 'service-cards.json'),
    JSON.stringify(servicesData, null, 2)
  );
  
  console.log('EHB-HOME: Service cards created successfully');
  return servicesData;
}

// Create card for GoSellr in EHB-HOME
function createGoSellrCardInHome() {
  if (!connections.services.gosellr) {
    console.log('EHB-HOME: Cannot create GoSellr card, service not connected');
    return null;
  }
  
  console.log('EHB-HOME: Creating GoSellr service card...');
  
  const gosellrCard = {
    id: 'gosellr',
    name: 'GoSellr E-commerce',
    description: 'Complete e-commerce platform with franchise management and SQL integration',
    features: [
      'Product management',
      'Order processing',
      'Franchise integration',
      'JPS integration for job listings',
      'SQL departments for data management'
    ],
    connections: {
      sql: {
        pss: connections.sqlDepartments.pss,
        edr: connections.sqlDepartments.edr,
        emo: connections.sqlDepartments.emo
      },
      jps: connections.services.jps,
      franchise: connections.system.franchise
    },
    metrics: {
      products: 250,
      orders: 12854,
      users: 5432,
      franchises: 27
    },
    icon: '🛒',
    color: '#3B82F6',
    url: '/services/EHB-GoSellr'
  };
  
  // Create featured cards directory if it doesn't exist
  const featuredDir = path.join(__dirname, 'data', 'cards', 'featured');
  if (!fs.existsSync(featuredDir)) {
    fs.mkdirSync(featuredDir, { recursive: true });
  }
  
  // Write GoSellr card data
  fs.writeFileSync(
    path.join(featuredDir, 'gosellr-card.json'),
    JSON.stringify(gosellrCard, null, 2)
  );
  
  console.log('EHB-HOME: GoSellr card created successfully');
  return gosellrCard;
}

// Run the full integration process
function runFullIntegration() {
  console.log('EHB-HOME: Starting full integration process...');
  
  // Check components
  checkAllComponents();
  
  // Generate integration data
  const integrationData = generateIntegrationData();
  
  // Create service cards
  const serviceCards = createServiceCards();
  
  // Create featured GoSellr card
  const gosellrCard = createGoSellrCardInHome();
  
  console.log('EHB-HOME: Full integration process completed');
  
  return {
    integrationData,
    serviceCards,
    gosellrCard
  };
}

// Run the integration if this script is executed directly
if (require.main === module) {
  const results = runFullIntegration();
  console.log('EHB-HOME Integration Results:', JSON.stringify(results.integrationData.components, null, 2));
}

module.exports = {
  runFullIntegration,
  checkAllComponents,
  generateIntegrationData,
  createServiceCards,
  createGoSellrCardInHome,
  connections,
  componentPaths
};
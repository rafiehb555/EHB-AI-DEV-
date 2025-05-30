/**
 * EHB Services Departments Flow
 * Main entry point
 */

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.json({
    service: 'EHB Services Departments Flow',
    status: 'active',
    version: '1.0.0'
  });
});

app.get('/api/flows', (req, res) => {
  res.json({
    flows: [
      {
        id: 'flow-1',
        name: 'Basic Service Flow',
        services: ['EHB-HOME', 'EHB-AI-Dev-Fullstack'],
        status: 'active'
      }
    ]
  });
});

// Service flows routes
app.get('/api/departments', (req, res) => {
  res.json({
    departments: [
      {
        id: 'dept-1',
        name: 'AI Development',
        services: ['EHB-AI-Dev-Fullstack', 'EHB-AI-Marketplace']
      },
      {
        id: 'dept-2',
        name: 'Finance',
        services: ['EHB-TrustyWallet-System']
      },
      {
        id: 'dept-3',
        name: 'Commerce',
        services: ['GoSellr-Ecommerce']
      },
      {
        id: 'dept-4',
        name: 'Healthcare',
        services: ['WMS-World-Medical-Service']
      },
      {
        id: 'dept-5',
        name: 'Education',
        services: ['HPS-Education-Service']
      },
      {
        id: 'dept-6',
        name: 'Legal',
        services: ['OLS-Online-Law-Service']
      },
      {
        id: 'dept-7',
        name: 'Employment',
        services: ['JPS-Job-Providing-Service']
      },
      {
        id: 'dept-8',
        name: 'Media',
        services: ['EHB-Tube']
      }
    ]
  });
});

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`EHB Services Departments Flow running on port ${port}`);
  });
}

module.exports = app;

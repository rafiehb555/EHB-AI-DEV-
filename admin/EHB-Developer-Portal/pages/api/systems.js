export default async function handler(req, res) {
  try {
    // Define systems structure
    const systems = [
      {
        id: 'blockchain',
        name: 'Blockchain System',
        description: 'Core blockchain infrastructure for secure transactions',
        status: 'online',
        completionPercentage: 95,
        icon: 'settings',
        color: 'green',
        path: '/blockchain',
        lastUpdated: '2025-05-10T14:20:00Z'
      },
      {
        id: 'sql-department',
        name: 'SQL Department System',
        description: 'Database management and query optimization system',
        status: 'online',
        completionPercentage: 85,
        icon: 'database',
        color: 'blue',
        path: '/sql-department',
        lastUpdated: '2025-05-09T11:45:00Z'
      },
      {
        id: 'franchise',
        name: 'Franchise System',
        description: 'Multi-level franchise management and reporting system',
        status: 'online',
        completionPercentage: 80,
        icon: 'list',
        color: 'purple',
        path: '/franchise',
        lastUpdated: '2025-05-08T16:30:00Z'
      },
      {
        id: 'ehb-home',
        name: 'EHB-HOME System',
        description: 'Central integration hub for all EHB components',
        status: 'online',
        completionPercentage: 90,
        icon: 'home',
        color: 'teal',
        path: '/ehb-home',
        lastUpdated: '2025-05-11T08:15:00Z'
      },
      {
        id: 'pss',
        name: 'PSS System',
        description: 'Product and service search optimization system',
        status: 'online',
        completionPercentage: 75,
        icon: 'search',
        color: 'orange',
        path: '/pss',
        lastUpdated: '2025-05-07T13:40:00Z'
      },
      {
        id: 'edr',
        name: 'EDR System',
        description: 'Enterprise data repository and analytics',
        status: 'online',
        completionPercentage: 70,
        icon: 'bar-chart',
        color: 'red',
        path: '/edr',
        lastUpdated: '2025-05-06T09:55:00Z'
      }
    ];
    
    res.status(200).json(systems);
  } catch (error) {
    console.error('Error fetching systems:', error);
    res.status(500).json({ message: 'Failed to fetch systems data' });
  }
}
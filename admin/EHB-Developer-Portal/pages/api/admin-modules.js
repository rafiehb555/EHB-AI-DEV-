export default async function handler(req, res) {
  try {
    // Define admin modules structure
    const adminModules = [
      {
        id: 'admin-panel',
        name: 'Admin Panel',
        description: 'Main administrative dashboard for EHB system management',
        status: 'online',
        completionPercentage: 100,
        icon: 'settings',
        color: 'red',
        path: '/admin',
        lastUpdated: '2025-05-10T10:15:00Z'
      },
      {
        id: 'dashboard',
        name: 'Dashboard',
        description: 'Data visualization and reporting dashboard',
        status: 'online',
        completionPercentage: 90,
        icon: 'activity',
        color: 'orange',
        path: '/dashboard',
        lastUpdated: '2025-05-09T14:30:00Z'
      },
      {
        id: 'wallet',
        name: 'Wallet System',
        description: 'Digital wallet and transaction management system',
        status: 'online',
        completionPercentage: 85,
        icon: 'database',
        color: 'teal',
        path: '/wallet',
        lastUpdated: '2025-05-08T11:45:00Z'
      },
      {
        id: 'developer-portal',
        name: 'Developer Portal',
        description: 'Central hub for developers with documentation and tools',
        status: 'online',
        completionPercentage: 80,
        icon: 'code',
        color: 'purple',
        path: '/developer',
        lastUpdated: '2025-05-11T09:20:00Z'
      },
      {
        id: 'user-management',
        name: 'User Management',
        description: 'User account management and permission controls',
        status: 'online',
        completionPercentage: 95,
        icon: 'users',
        color: 'blue',
        path: '/users',
        lastUpdated: '2025-05-07T15:50:00Z'
      },
      {
        id: 'api-management',
        name: 'API Management',
        description: 'API key management and usage analytics',
        status: 'online',
        completionPercentage: 75,
        icon: 'server',
        color: 'cyan',
        path: '/api-management',
        lastUpdated: '2025-05-06T12:35:00Z'
      }
    ];
    
    res.status(200).json(adminModules);
  } catch (error) {
    console.error('Error fetching admin modules:', error);
    res.status(500).json({ message: 'Failed to fetch admin modules data' });
  }
}
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import DashboardCard from '../../components/DashboardCard';
import Chart from '../../components/Chart';
import Stats from '../../components/Stats';
import UserTable from '../../components/UserTable';
import { useAuth } from '../../context/AuthContext';
import { fetchAdminDashboardData, fetchUsers } from '../../utils/api';
import { 
  Users, 
  DollarSign, 
  Shield, 
  Activity,
  Server,
  Globe,
  AlertCircle
} from 'react-feather';

export default function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!authLoading && isAuthenticated && user && user.role !== 'admin') {
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    }
    
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, user, router]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAdminDashboardData();
        setDashboardData(data);
        
        // Fetch users separately
        const usersData = await fetchUsers();
        setUsers(usersData);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user && user.role === 'admin') {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Error Loading Dashboard</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  // Default dummy data if backend is not available
  const defaultData = {
    stats: {
      totalUsers: 4256,
      totalRevenue: 2345678.90,
      systemHealth: 98.7,
      apiRequests: 1567890,
      franchises: 18,
      aiInteractions: 89567
    },
    userGrowth: [
      { name: 'Jan', sellers: 245, buyers: 1200, franchise: 8 },
      { name: 'Feb', sellers: 285, buyers: 1350, franchise: 10 },
      { name: 'Mar', sellers: 310, buyers: 1500, franchise: 12 },
      { name: 'Apr', sellers: 340, buyers: 1650, franchise: 14 },
      { name: 'May', sellers: 380, buyers: 1800, franchise: 15 },
      { name: 'Jun', sellers: 410, buyers: 1950, franchise: 17 },
      { name: 'Jul', sellers: 450, buyers: 2100, franchise: 18 }
    ],
    revenueDistribution: [
      { name: 'Seller Fees', value: 35 },
      { name: 'Buyer Premium', value: 28 },
      { name: 'Franchise License', value: 22 },
      { name: 'AI Services', value: 15 }
    ],
    systemPerformance: [
      { name: '00:00', cpu: 35, memory: 50, queries: 220 },
      { name: '04:00', cpu: 28, memory: 45, queries: 180 },
      { name: '08:00', cpu: 60, memory: 70, queries: 560 },
      { name: '12:00', cpu: 85, memory: 85, queries: 780 },
      { name: '16:00', cpu: 95, memory: 90, queries: 830 },
      { name: '20:00', cpu: 70, memory: 75, queries: 650 },
      { name: '23:59', cpu: 45, memory: 60, queries: 380 }
    ],
    recentLogs: [
      { id: 1, timestamp: '2023-05-18 14:23:45', level: 'ERROR', message: 'Failed database connection attempt', service: 'db-connector' },
      { id: 2, timestamp: '2023-05-18 14:22:12', level: 'INFO', message: 'User authentication successful', service: 'auth-service' },
      { id: 3, timestamp: '2023-05-18 14:20:05', level: 'WARNING', message: 'High CPU usage detected', service: 'monitoring' },
      { id: 4, timestamp: '2023-05-18 14:18:32', level: 'INFO', message: 'Scheduled backup completed', service: 'backup-service' },
      { id: 5, timestamp: '2023-05-18 14:15:19', level: 'ERROR', message: 'Payment processing failed', service: 'payment-gateway' }
    ]
  };

  // Default users data if backend is not available
  const defaultUsers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'seller', status: 'active', createdAt: '2023-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'buyer', status: 'active', createdAt: '2023-02-20' },
    { id: 3, name: 'Michael Lee', email: 'michael@example.com', role: 'franchise', status: 'active', createdAt: '2023-01-10' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'buyer', status: 'inactive', createdAt: '2023-03-05' },
    { id: 5, name: 'Robert Brown', email: 'robert@example.com', role: 'seller', status: 'active', createdAt: '2023-02-25' },
    { id: 6, name: 'Jennifer Lopez', email: 'jennifer@example.com', role: 'buyer', status: 'active', createdAt: '2023-04-10' },
    { id: 7, name: 'David Miller', email: 'david@example.com', role: 'franchise', status: 'active', createdAt: '2023-03-18' },
    { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', role: 'buyer', status: 'active', createdAt: '2023-04-22' },
    { id: 9, name: 'James Taylor', email: 'james@example.com', role: 'seller', status: 'inactive', createdAt: '2023-02-12' },
    { id: 10, name: 'Patricia Martin', email: 'patricia@example.com', role: 'buyer', status: 'active', createdAt: '2023-05-01' }
  ];

  // Use fetched data or fallback to default data
  const data = dashboardData || defaultData;
  const userData = users.length > 0 ? users : defaultUsers;

  // Filter users based on search query and role filter
  const filteredUsers = (userData || []).filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard | AI Dashboard</title>
        <meta name="description" content="Administrative dashboard for system management and monitoring" />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {user?.name || 'Administrator'}! Here's the current system overview.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 <Stats 
              title="Total Users"
              value={data.stats.totalUsers.toLocaleString()}
              icon={<Users className="h-6 w-6 text-<Users className="h-6 w-6 text-white" /></Stats>white" /></Users>w-6 text-white" />}
              change={"+256"}
              changeType="increas<Stats 
              title="Total Revenue"
              value={`$${data.stats.totalRevenue.toLocaleString()}`}
              icon={<DollarSign className="h-6 w-6 <DollarSign className="h-6 w-6 text-white" /></Stats>-6 text-white" /></DollarSign>me="h-6 w-6 text-white" />}
              change={"+12.3%"}
              chan<Stats 
              title="System Health"
              value={`${data.stats.systemHealth}%`}
              icon={<Activity className="h-6 w<Activity className="h-6 w-6 text-white" /></Stats>e="h-6 w-6 text-white" /></Activity>ivity className="h-6 w-6 text-white" />}
              change={"+0.5%"}
    <Stats 
              title="API Requests (24h)"
              value={data.stats.apiRequests.toLocaleString()}
              icon={<Server className="h-6 <Server className="h-6 w-6 text-white" /></Stats>className=<Server className="h-6 w-6 text-white" /></<Server className="h-6 w-6 text-white" /></Server>ite" />}
          <Stats 
              title="Franchises"
              value={data.stats.franchises}
              icon={<Globe className="h-6 <Globe className="h-6 w-6 text-white" /></Stats>Name="h-6 <Globe cl<Globe className="h-6 w-6 text-white" /></Globe>  <Globe className="h-6 w-<Stats 
              title="AI Interactions"
              value={data.stats.aiInteractions.toLocaleString()}
              icon={<Shield className="h-6<Shield className="h-6 w-6 text-white" /></Globe>6 text-white" /></Stats>n={<Shield className="h-6<S<Shield className="h-6 w-6 text-white" /></Shield>Shield>ng<Shield className="h-6 w-6 text-white" /></Shield>="h-6 w-6 text-white" />}
              change={"+42.1%"}
              changeType="increase"
              bgColor="bg-rose-600"
            />
          <DashboardCard title="User Growth"></DashboardCard>hart */}
          <div className="mt-<Chart 
                  type="area"
                  data={data.userGrowth}
                  xKey="name"
                  yKey={["sellers", "buyers", "franchise"]}
                  xLabel="Month"
                  yLabel="Users"
                  colors={["#10b981", "#3b82f6", "#8b5cf6"]} 
                  legend={["Sellers", "Buyers", "Franchises"]}
                  stacked={true}
                /></Chart>         legend={["Sellers", "Buyers", "Franchises"]}
                  stacked={true}
                />
              </div>
            </DashboardCard>
          </div>

          {/* System Performance<DashboardCard title="System Performance"></DashboardCard>iv className="mt-8 grid grid-cols-1 ga<Chart 
                  type="line"
                  data={data.systemPerformance}
                  xKey="name"
                  yKey={["cpu", "memory", "queries"]}
                  xLabel="Time"
                  yLabel="Usage (%)"
                  colors={["#ef4444", "#f59e0b", "#3b82f6"]} 
                  legend={["CPU", "Memory", "Queries (scaled)"]}
                /></Chart>  colors={["#ef4444", "#f59e0b", "#3b82f6"]} 
          <DashboardCard title="Revenue Distribution"></DashboardCard>scaled)"]}
                />
        <Chart 
                  type="pie"
                  data={data.revenueDistribution}
                  dataKey="value"
                  nameKey="name"
                  colors={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']}
                /></Chart>              dataKey="value"
                  nameKey="name"
                  colors={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']}
     <DashboardCard title="User Management"></DashboardCard>        </Das<Dashboar<DashboardCard title="User Management"></Dashboar>oardCard title="User Management"></DashboardCard><DashboardCard title="User Management"></DashboardCard>     <DashboardCard title="User Management">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="relative mb-4 sm:mb-0">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="seller">Seller</option>
                    <option value="buyer">Buyer</option>
                    <option value="franchise">Franchise</option>
                  </select>
                  
                  <button className="px-4 py-2 bg-primary<UserTable users={filteredUsers} /></<User<UserTable users={filteredUsers} /></User>  Add User
         <User<UserTable users={filteredUsers} /></UserTab<UserTable users={filteredUsers} /></UserTable>v>
              
              <UserTable users={filteredUsers} />
              
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {filteredUsers.length} of {userData.length} users
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-dark">
                    1
                  </button>
                  <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                    Next
     <DashboardCard title="<Dashboar<DashboardCard title="System Logs"></Dashboar>          </div>
            </Dash<Dashboar<DashboardCard title="System Logs"></<DashboardCard title="System Logs"></DashboardCard> Logs */}
          <div className="mt-8">
            <DashboardCard title="System Logs">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
             (data.recentLogs || []).map((ogs || []).map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            log.level === 'ERROR' ? 'bg-red-100 text-red-800' :
                            log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {log.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.service}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate">
                          {log.message}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-primary hover:text-primary-dark">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm text-primary hover:text-primary-dark font-medi<Dashboar<DashboardCard title="System Controls"></Dashboar>shboardCard>         </button>
              </div>
      <Dashboar<DashboardCard title="Syst<DashboardCard title="System Controls"></DashboardCard>         {/* System Controls */}
          <div className="mt-8">
            <DashboardCard ti<S<Server className="h-8 w-8 text-indigo-600 mb-2" /></S>ame="h-8 w-8 text-indigo-600 mb-2" /></Server>id-cols-4 gap-4">
                <S<Server classNa<Server className="h-8 w-8 text-indigo-600 mb-2" /></Server>>ed-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                  <Server className="h-8 w-8 text-i<S<Shield className="h-8 w-8 text-green-600 mb-2" /></S><Shield className="h-8 w-8 text-green-600 mb-2" /></Shield>>
                </button>
       <S<Shield cla<Shield className="h-8 w-8 text-green-600 mb-2" /></Shield>ield>-300 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                  <Shield cl<Act<Activity className="h-8 w-8 text-blue-600 mb-2" /></Act>    <spa<Activity className="h-8 w-8 text-blue-600 mb-2" /></Activity>an</span>
                </button<Act<Activi<Activity className="h-8 w-8 text-blue-600 mb-2" /></Activity>ity>tivity>der-gray-300 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                  <Activity className="h-8 w-8 text-blue-600 mb-2" />
              <Users className="h-8 w-8 text-purple-600 mb-2" /></Users>rformance Test</span>
             <<Use<Users className="h-8 w-8 text-purple-600 mb-2" /></Users>ers>/Users>4 border border-gray-300 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                  <Users className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-gray-900 font-medium">User Report</span>
                </button>
              </div>
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">System Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Database</span>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">API Services</span>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Authentication</span>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">AI Services</span>
                      <span className="text-sm text-yellow-600">High Load</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </Layout>
  );
}

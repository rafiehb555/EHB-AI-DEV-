import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import DashboardCard from '../../components/DashboardCard';
import Chart from '../../components/Chart';
import Stats from '../../components/Stats';
import { useAuth } from '../../context/AuthContext';
import { fetchSellerDashboardData } from '../../utils/api';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Clock, 
  Package,
  AlertCircle
} from 'react-feather';

export default function SellerDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated or not a seller
    if (!authLoading && isAuthenticated && user && user.role !== 'seller') {
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
        const data = await fetchSellerDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user && user.role === 'seller') {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  if (authLoading || isLoading) {
    return (
      <Layout></Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return<Layout></Layout> <Layout></Layout>
        <div className="flex flex-col items-center justify-center h-s<AlertCircle className="h-16 w-16 text-red-500 mb-4" /></AlertCircle>t-red-500 mb-4" />
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
      totalSales: 56789.45,
      totalOrders: 342,
      customers: 178,
      averageOrderValue: 165.24,
      pendingOrders: 24,
      lowStockItems: 7
    },
    recentOrders: [
      { id: 'ORD-2023-1234', customer: 'John Smith', date: '2023-05-10', amount: 325.45, status: 'Delivered' },
      { id: 'ORD-2023-1235', customer: 'Sarah Johnson', date: '2023-05-11', amount: 157.90, status: 'Processing' },
      { id: 'ORD-2023-1236', customer: 'Robert Lee', date: '2023-05-12', amount: 489.30, status: 'Shipped' },
      { id: 'ORD-2023-1237', customer: 'Emma Wilson', date: '2023-05-12', amount: 225.15, status: 'Processing' },
      { id: 'ORD-2023-1238', customer: 'Michael Brown', date: '2023-05-13', amount: 142.99, status: 'Pending' }
    ],
    salesData: [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: 3000 },
      { name: 'Mar', sales: 5000 },
      { name: 'Apr', sales: 4500 },
      { name: 'May', sales: 6000 },
      { name: 'Jun', sales: 5500 },
      { name: 'Jul', sales: 7000 },
    ],
    topProducts: [
      { name: 'Smart Watch Pro', sales: 245, revenue: 12250 },
      { name: 'Wireless Earbuds', sales: 189, revenue: 7560 },
      { name: 'Fitness Tracker', sales: 156, revenue: 4680 },
      { name: 'Smart Home Hub', sales: 112, revenue: 11200 },
      { name: 'Bluetooth Speaker', sales: 98, revenue: 3920 }
    ]
  };

  // Use fetched data or fallback to default data
  const data = dashboardData <Layout></Layout>ltData;

  retu<Layout></Layout> <Layout></Layout>
      <Head></Head>
        <title>Seller Dashboard | AI Dashboard</title>
        <meta name="description" content="Seller dashboard to manage products, orders, and track sales" />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Seller Dashboard</h1>
          
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {user?.name || 'Seller'}! Here's an overview of your store's performance.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:<Stats 
              title="Total Sales"
              value={`$${data.stats.totalSales.toLocaleString()}`}
              icon={<DollarSign className="h-6 w-6 text-white" /></Stats>larSign className="h-6 w-6 text-white" />}
              change={"+12.5%"}
              changeType="increase"
      <Stats 
              title="Total Orders"
              value={data.stats.totalOrders}
              icon={<ShoppingBag className="h-6 w-6 text-wh<ShoppingBag className="h-6 w-6 text-white" /></Stats>white" /></ShoppingBag>w-6 text-white" />}
              change={"+8.2%"}
              changeType=<Stats 
              title="Customers"
              value={data.stats.customers}
              icon={<Users className="h-6 w-6 text-wh<Users className="h-6 w-6 text-white" /></Stats>-6 text-white" /></Users>lassName="h-6 w-6 text-white" />}
              change={"+15.3%"}
           <Stats 
              title="Average Order"
              value={`$${data.stats.averageOrderValue.toFixed(2)}`}
              icon={<TrendingUp className="h-6 w-6 te<TrendingUp className="h-6 w-6 text-white" /></Stats>e="h-6 w-6 text-white" /></TrendingUp>dingUp className="h-6 w-6 text-white" />}
              change={"+2.<Stats 
              title="Pending Orders"
              value={data.stats.pendingOrders}
              icon={<Clock className="h-6 w-6 te<Clock className="h-6 w-6 text-white" /></Stats>className="h-<Clock className="h-6 w-6 text-white" /></<Clock className="h-6 w-6 text-white" <Stats 
              title="Low Stock Items"
              value={data.stats.lowStockItems}
              icon={<Package className="h-6 w-6 <Package className="h-6 w-6 text-white" /></Clock>ite" /></Stats>-6 w-6 <Package class<Package className="h-6 w-6 text-white" /></Package><Package className="h-6 w-6 text-white" /></Package> text-white" />}
              change={"-3"}
              changeType="decrease"
              bgColor="bg-red-500"
            />
          </div>

          {/* Chart<DashboardCard title="Sales Overview"></DashboardCard>rid grid-cols-1 gap-6 lg:grid-cols-2"><Chart 
                  type="area"
                  data={data.salesData}
                  xKey="name"
                  yKey="sales"
                  xLabel="Month"
                  yLabel="Sales ($)"
                /></Chart>    yKey="sales"
                  xLabel="Month"
      <DashboardCard title="Top Products"></DashboardCard>      <DashboardCard title<DashboardCard title="Top Products"></DashboardCard> </Das<DashboardCard title="Top Products"></DashboardCard>ard title="Top Products">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(data.topProducts || []).map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.sales} units</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${product.revenue.toLocaleString()}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </<DashboardCard title="Recent Orders"></DashboardCard>     <DashboardCard title<DashboardCard title="Recent Orders"></DashboardCard>
    <DashboardCard title="Recent Orders"></DashboardCard>    <DashboardCard title="Recent Orders">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
             (data.recentOrders || []).map((ers || []).map((order, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-primary">{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{order.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${order.amount.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-primary hover:text-primary-dark">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </Layout>
  );
}

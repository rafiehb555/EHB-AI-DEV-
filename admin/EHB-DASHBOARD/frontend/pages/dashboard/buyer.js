import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/Layout';
import DashboardCard from '../../components/DashboardCard';
import Chart from '../../components/Chart';
import Stats from '../../components/Stats';
import { useAuth } from '../../context/AuthContext';
import { fetchBuyerDashboardData } from '../../utils/api';
import { 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  Bookmark,
  Truck,
  Clock,
  AlertCircle
} from 'react-feather';

export default function BuyerDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated or not a buyer
    if (!authLoading && isAuthenticated && user && user.role !== 'buyer') {
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
        const data = await fetchBuyerDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user && user.role === 'buyer') {
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
      totalOrders: 28,
      pendingDeliveries: 3,
      savedItems: 15,
      totalSpent: 3845.78,
      orderHistory: [
        { month: 'Jan', value: 350 },
        { month: 'Feb', value: 420 },
        { month: 'Mar', value: 280 },
        { month: 'Apr', value: 520 },
        { month: 'May', value: 700 },
        { month: 'Jun', value: 890 },
        { month: 'Jul', value: 680 }
      ]
    },
    recentOrders: [
      { id: 'ORD-2023-1543', store: 'Electronics Pro', date: '2023-05-09', amount: 549.99, status: 'Delivered', items: ['SmartTV 32"', 'HDMI Cable'] },
      { id: 'ORD-2023-1589', store: 'Home Essentials', date: '2023-05-12', amount: 129.45, status: 'In Transit', items: ['Bedding Set', 'Towels'] },
      { id: 'ORD-2023-1622', store: 'Sports Outlet', date: '2023-05-16', amount: 87.90, status: 'Processing', items: ['Running Shoes', 'Water Bottle'] },
      { id: 'ORD-2023-1647', store: 'Gourmet Market', date: '2023-05-18', amount: 65.30, status: 'Processing', items: ['Olive Oil', 'Spice Set', 'Coffee Beans'] }
    ],
    recommendedProducts: [
      { id: 1, name: 'Wireless Earbuds', price: 89.99, image: 'https://pixabay.com/get/g0d7886a496e80e8132a2c71d0e9903a3a6bb6e543a8ead8ec155bb69da2e2b6d3fdd951e00b6fe8cbd08b115a0ad59b5df8844f1e1f77dd4db9297959751f3af_1280.jpg', rating: 4.7 },
      { id: 2, name: 'Smart Watch', price: 199.99, image: 'https://pixabay.com/get/gea3717c8a64149eaef7e2a9171a0d41be724558d742823eef131811c8b4099f50baefd91140a5108188333b17ce83431cdfb303dbfd43198dd3dff087fa33124_1280.jpg', rating: 4.5 },
      { id: 3, name: 'Portable Speaker', price: 79.99, image: 'https://pixabay.com/get/ge05182be594959da0f990a8623244ff5a27e343be812b94039faafaa487bff56a9dbce1b8fc5a2d27c5bf3b4abbb8e40d170b0d722dce37e095c3072064241cb_1280.jpg', rating: 4.3 },
      { id: 4, name: 'Laptop Sleeve', price: 29.99, image: 'https://pixabay.com/get/g39ebe55691bef63d55065310b2c6ad5a3ddec52e2f6f3ce16a53de8f93271894fde253c4a938b93caaf922710b71923430276b3597045c56739e922575a9cdee_1280.jpg', rating: 4.2 }
    ]
  };

  // Use fetched data or fallback to default data
  const data = dashboardData <Layout></Layout>ltData;

  retu<Layout></Layout> <Layout></Layout>
      <Head></Head>
        <title>Buyer Dashboard | AI Dashboard</title>
        <meta name="description" content="Buyer dashboard to track orders, discover products, and manage purchases" />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Buyer Dashboard</h1>
          
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {user?.name || 'Valued Customer'}! Here's an overview of your purchases and recommendations.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:<Stats 
              title="Total Orders"
              value={data.stats.totalOrders}
              icon={<ShoppingBag className="h-6 w-6 text-white" /></Stats>pingBag className="h-6 w-6 text-white" />}
     <Stats 
              title="Pending Deliveries"
              value={data.stats.pendingDeliveries}
              icon={<Truck className="h-6 w-6 text-white" /<Truck className="h-6 w-6 text-white" /></Stats>white" /></Truck>w-6 text-wh<Stats 
              title="Saved Items"
              value={data.stats.savedItems}
              icon={<Bookmark className="h-6 w-6 text-white<Bookmark className="h-6 w-6 text-white" /></Stats>-6 text-white" /></Bookmark>me=<Stats 
              title="Total Spent"
              value={`$${data.stats.totalSpent.toL<CreditCard className="h-6 w-6 text-white" /></Stats>e="h-6 w-6 text-white" /></CreditCard>ard className="<CreditCard className="h-6 w-6<CreditCard className="h-6 w-6 text-white" /></CreditCard>className="h-6 w-6 text-white" />}
              bgColor="bg-green-500"
            />
          </div>

          {/* Order <DashboardCard title="Orde<D<Chart 
                  type="bar"
                  data={data.stats.orderHistory}
                  xKey="month"
                  yKey="value"
                  xLabel="Month"
                  yLabel="Amount ($)"
                  barColor="#4f46e5"
                /></DashboardCard>         barColor="#4f46e5"
                /></D>nt ($)"
                  barColor="#4f46e5"
                /></<DashboardCard title="Recent Orders"></DashboardCard>)"
               <DashboardCard title="Recent Orders"></DashboardCard>rders"></Dashboa<Dash<DashboardCard title="Recent Orders"></DashboardCard>hboardCard></Dashb<DashboardCard title="Recent Orders"></DashboardCard> title="Recent Orders">
              <div className="overflow-y-auto max-h-80">
                <div className="space-y-4">
                  {(data.recentOrders || []).map((order, index) => (
                    <div key={index} classNam<ShoppingBag className="h-6 w-6" /></ShoppingBag>ded-lg bg-white shadow-sm hover:shadow-md transition-shadow<ShoppingBag className="h-6 w-6" <ShoppingBag className="h-6 w-6" /></ShoppingBag>h-6 w-6" /></ShoppingBag>00 text-b<ShoppingBag className="h-6 w-6" /></ShoppingBag>    <ShoppingBag className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900">{order.id}</h3>
                          <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
          <Calendar className="h-4 w-4 mr-1" /></Calendar>ext-gray-500">{order.store}</p>
                        <div className="flex justify-<Calendar classN<Calendar className="h-4 w-4 mr-1" /></Calendar>assName="h-4 w-4 mr-1" /></Calendar>-center<Calendar className="h-4 w-4 mr-1" /></Calendar>                <Calendar className="h-4 w-4 mr-1" />
                            {order.date}
                          </div>
                          <div className="font-medium">${order.amount.toFixed(2)}</div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Items: {order.items.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-center">
                <button <DashboardCard title="Recommended For You"></DashboardCard>primary-dark font-medium">
          <Dashboard<DashboardCard title="Recommended For You"></Dashboard>           <Dashboard<DashboardCard title="Recommended For You"></DashboardCard>ardCard title="Recommended For You"></Das<DashboardCard title="Recommended For You"></DashboardCard>iv className="mt-8">
            <DashboardCard title="Recommended For You">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
         (data.recommendedProducts || []).map((cts || []).map((product) => (
                  <div key={product.id} className="relative overflow-hidden round<Image 
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="hover:scale-105 transition-transform duration-300"
                      /></Image>             style={{ objectFit: "cover" }}
                        className="hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                        </div>
                      </div>
                      <button className="w-full mt-4 bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <butt<DashboardCard title="Track Your Deliveries"></DashboardCard> text-primary rounded-md hover:bg-prima<D<DashboardCard title="Track Your Deliveries"></D>           Browse More Products
             <D<DashboardCard title="Track Your Deliveries"></DashboardCard>Dashboa<DashboardCard title="Track Your Deliveries"></Dashb<DashboardCard title="Track Your Deliveries"></DashboardCard>lue-700" /></Truck>v className="mt-8">
            <DashboardCard title="Track Your Deliveries">
              {data.stats.pendingDeliveries > 0 ? (
             <Truck className="h-6 w-6 text-blue-700" /></Truck> w-6 text-blue-700" /></T<Truck className="h-6 w-6 text-blue-<Truck className="h-6 w-6 text-blue-700" /></Truck>className="rounded-full bg-blue-100 p-2 mr-3">
                      <Truck className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-900">You have {data.stats.pendingDeliveries} pending deliveries</h3>
                      <p className="text-sm text-blue-700">Track their status in real-time</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {data.recentOrders
                      .filter(order => order.status !== 'Delivered')
                      .map((order, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between mb-2">
                            <p className="font-medium">{order.id}</p>
                            <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                              order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          
                          {order.status === 'In Transit' ? (
                            <div className="mt-3">
                              <div className="relative pt-1">
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                                  <div style={{ width: "60%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                </div>
                                <div className="flex text-xs justify-between mt-1">
                                  <span>Order Placed</span>
                                  <span>In Transit</span>
                                  <span className="text-gray-400">Delivered<<Clock className="h-4 w-4 mr-1" /></Clock>Name="h-4 w-4 mr-1" /></Clock>    <Clock className="h-4 w-4 mr-1" /></<Clock className="h-4 w-4 mr-1" /></Clock>sName="flex items-center mt-3 text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Estimated delivery: May 20, 2023</span>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3">
                              <div className="relative pt-1">
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                                  <div style={{ width: "30%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                </div>
                                <div className="flex text-xs justify-between mt-1">
                                  <span>Order Placed</span>
                                  <span className="text-gray-400">In Transit</span>
                                  <span className="text-gray-400">De<Clock className="h-4 w-4 mr-1" /></Clock>Name="h-4 w-4 mr-1" /></Clock>    <Clock className="h-4 w-4 mr-1" /></<Clock className="h-4 w-4 mr-1" /></Clock>div className="flex items-center mt-3 text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Processing your order</span>
                              </div>
                            </div>
                          )}
                          
                          <button className="mt-4 w-full text-center text-sm font-medium text-primary hover:text-primary-dark">
                            View Order Details
      <Truck className="h-12 w-12 text-gray-400 mx-auto mb-3" /></Truck>y-400 mx-a<Truck className="h-12 w-12 text-gra<Truck className="h-12 w-12 text-gray-400 mx-auto mb-3" /></Truck>   ) : (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No Pending Deliveries</h3>
                  <p className="text-gray-500 mt-1">All your orders have been delivered!</p>
                </div>
              )}
            </DashboardCard>
          </div>
        </div>
      </div>
    </Layout>
  );
}

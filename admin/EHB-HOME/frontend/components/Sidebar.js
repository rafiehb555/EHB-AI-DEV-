import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart2, 
  Home, 
  ShoppingBag, 
  Users, 
  Package, 
  Briefcase, 
  User, 
  Shield, 
  Settings, 
  HelpCircle, 
  Layers,
  Globe,
  Activity,
  Server
} from 'react-feather';

export default function Sidebar({ mobile = false }) {
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.role || '';

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { name: 'Home', href: '/', icon: Home },
      { name: 'AI Assistant', href: '/ai-assistant', icon: HelpCircle }
    ];

    const roleSpecificItems = {
      seller: [
        { name: 'Dashboard', href: '/dashboard/seller', icon: BarChart2 },
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Orders', href: '/orders', icon: ShoppingBag },
        { name: 'Customers', href: '/customers', icon: Users }
      ],
      buyer: [
        { name: 'Dashboard', href: '/dashboard/buyer', icon: BarChart2 },
        { name: 'Browse Products', href: '/browse', icon: ShoppingBag },
        { name: 'My Orders', href: '/my-orders', icon: Package },
        { name: 'Saved Items', href: '/saved', icon: Layers }
      ],
      franchise: [
        { name: 'Dashboard', href: '/dashboard/franchise', icon: BarChart2 },
        { name: 'Locations', href: '/locations', icon: Globe },
        { name: 'Sellers', href: '/franchise-sellers', icon: Users },
        { name: 'Performance', href: '/performance', icon: Briefcase }
      ],
      admin: [
        { name: 'Dashboard', href: '/dashboard/admin', icon: BarChart2 },
        { name: 'Users', href: '/users', icon: Users },
        { name: 'System', href: '/system', icon: Shield },
        { name: 'Settings', href: '/admin-settings', icon: Settings }
      ]
    };

    return [...commonItems, ...(roleSpecificItems[role.toLowerCase()] || [])];
  };

  const navigation = getNavigationItems();

  const isActive = (path) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <div className={`flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto ${mobile ? 'h-full' : ''}`}>
      <div className="flex items-center flex-shrink-0 px-4">
        <Link href="/" className="flex items-center"></Link>
   <BarChart2 className="h-8 w-8 text-primary" /></BarChart2>ary" />
          <span className="ml-2 text-xl font-bold text-gray-900">AI Dashboard</span>
        </Link>
      </div>

      {user && (
        <div className="mt-5 px-4">
          <div className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div className="inline-block h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center">
                <span className="text-lg font-semibold">{user.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                <p className="text-xs font-medium text-primary capitalize">{user.role || 'User'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 bg-white space-y-1">
          {(navigation || []).map((item) => {
  return (const active = isActive(item.href);
            retu<Link 
                key={item.name} 
                href={item.href}
                className={`${
                  active
                    ? 'bg-primary-light text-primary font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm rounded-md`}
              ></Link>d`}
              >
                <item.icon 
                  className={`${
                    active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500');
} mr-3 flex-shrink-0 h-6 w-6`} 
                  aria-hidden="true" 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="p<Link 
            href="/profile" 
            className="group flex items-center px-2 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          ></Link>text-g<User className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6" /></User>er:text-gray-500 mr-3 h-6 w-6" />
        <Link 
            href="/settings" 
            className="group flex items-center px-2 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          ></Link>gray-5<Settings className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6" /></Settings>-400 group-hover:text-gray-500 mr-3 h-6<Link 
            href="/help" 
            className="group flex items-center px-2 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          ></Link>unded-<HelpCircle className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6" /></HelpCircle>assName="text-gray-400 group-hover:text-gra<Link 
            href="/api-status" 
            className="group flex items-center px-2 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          ></Link>-sm te<Server className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6" /></Server>          <Server className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6" /></Server>
            API Status
          </Link>
        </div>
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-gray-50 rounded-lg p-3<HelpCircle className="h-6 w-6 text-primary" /></HelpCircle> <div className="flex-shrink-0">
     <HelpCircle className="h-6 w-6 text-primary" /></HelpCircle>imary" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Need help?</h3>
              <p className="mt-1 text-xs text-gray-500"<Link 
                href="/ai-assistant" 
                className="mt-2 block text-sm font-medium text-primary hover:text-primary-dark"
              ></Link>            className="mt-2 block text-sm font-medium text-primary hover:text-primary-dark"
              >
                Open AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

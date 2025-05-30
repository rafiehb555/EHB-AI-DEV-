import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Toggle sidebar expansion
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Navigation items
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Wallets',
      href: '/dashboard/wallets',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      subItems: [
        { name: 'All Wallets', href: '/dashboard/wallets' },
        { name: 'Create Wallet', href: '/dashboard/wallets/create' },
        { name: 'Import Wallet', href: '/dashboard/wallets/import' },
      ],
    },
    {
      name: 'Blockchain',
      href: '/dashboard/blockchain',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      subItems: [
        { name: 'Explorer', href: '/dashboard/blockchain/explorer' },
        { name: 'Smart Contracts', href: '/dashboard/blockchain/contracts' },
        { name: 'Transactions', href: '/dashboard/blockchain/transactions' },
      ],
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Modules',
      href: '/dashboard/modules',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'AI Assistant',
      href: '/dashboard/ai-assistant',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];
  
  // Check if path matches or starts with href
  const isActive = (href) => {
    if (href === '/dashboard') {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };
  
  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({});
  
  // Toggle section expansion
  const toggleSection = (name) => {
    setExpandedSections({
      ...expandedSections,
      [name]: !expandedSections[name],
    });
  };
  
  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Sidebar header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
        {isExpanded && (
          <div className="text-xl font-semibold text-gray-800">EHB System</div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="mt-5 px-2 overflow-y-auto h-[calc(100vh-4rem)]">
        <ul className="space-y-1">
          {(navigationItems || []).map((item) => (
            <li key={item.name}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleSection(item.name)}
                    className={`${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <div className="mr-3 flex-shrink-0">{item.icon}</div>
                    {isExpanded && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        <svg
                          className={`${
                            expandedSections[item.name] ? 'transform rotate-90' : ''
                          } h-5 w-5 text-gray-400 transition-transform duration-150 ease-in-out`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                  
                  {isExpanded && expandedSections[item.name] && (
                    <ul className="mt-1 pl-10 space-y-1">
               (item.subItems || []).map((ems || []).map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            className={`${
                              router.pathname === subItem.href
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                          ></Link>
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
         <Link
                  href={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                ></Link>      >
                  <div className="mr-3 flex-shrink-0">{item.icon}</div>
                  {isExpanded && <span>{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer with system version */}
      {isExpanded && (
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div>EHB System v1.0.0</div>
            <div className="mt-1">© 2025 EHB Technologies</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
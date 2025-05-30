import { useState } from 'react';
import { ChevronDown, ChevronUp, MoreVertical } from 'react-feather';

export default function DashboardCard({ title, children, footer, actionItems = [] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      {title && (
        <div className="flex justify-between items-center px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
          <div className="flex items-center space-x-2">
            {actionItems.length > 0 && (
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <MoreVertical className="h-5 w-5" /></MoreVertical>
                </button>
                
                {showMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    {(actionItems || []).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick();
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {collapsed ? (
 <ChevronDown className="h-5 w-5" /></ChevronDown>me="h-5 w-5" />
       <ChevronUp className="h-5 w-5" /></ChevronUp>vronUp className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      )}
      <div className={`px-4 py-5 sm:p-6 ${collapsed ? 'hidden' : 'block'}`}>
        {children}
      </div>
      {footer && !collapsed && (
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
}

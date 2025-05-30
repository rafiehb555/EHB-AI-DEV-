import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TutorialManager from '../../components/onboarding/TutorialManager';
import { useFeedback } from '../../context/FeedbackContext';
import { useContextualHelp } from '../../context/ContextualHelpContext';
import { useNotifications } from '../../context/NotificationContext';

/**
 * Dashboard Home Page
 */
const DashboardHome = () => {
  const { getPageHelp } = useContextualHelp();
  const { showSuccess, showError, showInfo } = useFeedback();
  const { sendTestNotification } = useNotifications();
  
  const [stats, setStats] = useState([
    { id: 1, name: 'Total Wallets', value: '12', change: '+2', changeType: 'increase' },
    { id: 2, name: 'Active Transactions', value: '3', change: '-1', changeType: 'decrease' },
    { id: 3, name: 'Smart Contracts', value: '7', change: '0', changeType: 'neutral' },
    { id: 4, name: 'Total Value Locked', value: '$1,245.89', change: '+$125.40', changeType: 'increase' }
  ]);
  
  // Load dashboard data on mount
  useEffect(() => {
    // Simulate loading data
    const loadDashboardData = async () => {
      try {
        // In a real app, this would be an API call
        const response = await fetch('/api/dashboard/stats');
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.stats) {
            setStats(data.stats);
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    
    loadDashboardData();
    
    // Show welcome message when dashboard loads
    showInfo('Welcome to the EHB Dashboard', 'Enterprise Hybrid Blockchain System');
  }, [showInfo]);
  
  // Show the contextual help for this page
  const handleShowHelp = () => {
    getPageHelp('/dashboard');
  };
  
  // Demo feedback functionality
  const handleShowSuccess = () => {
    showSuccess('Operation completed successfully', 'Success');
  };
  
  const handleShowError = () => {
    showError('Something went wrong', 'Error');
  };
  
  // Demo notification functionality
  const handleSendNotification = () => {
    sendTestNotification();
  };
  
  return (
    <DashboardLayout 
      title="Dashboard | EHB System"
      description="EHB System Dashboard Home"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleShowHelp}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </button>
          </div>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(stats || []).map((stat) => (
            <div key={stat.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-blue-500 p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' 
                          ? 'text-green-600' 
                          : stat.changeType === 'decrease' 
                            ? 'text-red-600' 
                            : 'text-gray-500'
                      }`}>
                        {stat.changeType === 'increase' ? (
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : stat.changeType === 'decrease' ? (
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : null}
                        <span className="sr-only">
                          {stat.changeType === 'increase' ? 'Increased by' : stat.changeType === 'decrease' ? 'Decreased by' : 'No change'}
                        </span>
                        {stat.change}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Demo Actions */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Demo Actions
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Test the functionality of the dashboard components
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleShowSuccess}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Show Success Message
              </button>
              <button
                onClick={handleShowError}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Show Error Message
              </button>
              <button
                onClick={handleSendNotification}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Test Notification
              </button>
            </div>
          </div>
        </div>
        
        {/* Tutorial Manager */}
        <TutorialManager />
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
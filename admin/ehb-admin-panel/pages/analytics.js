import React from 'react';
import Layout from '@/components/Layout';
import WithHelp from '../components/WithHelp';
import { useHelp } from '../context/HelpContext';

export default function AnalyticsPage() {
  // Initialize help context with defensive programming
  let showContextualHelp = () => console.log("Help not available");
  try {
    const helpContext = useHelp();
    if (helpContext && typeof helpContext.showContextualHelp === 'function') {
      showContextualHelp = helpContext.showContextualHelp;
    }
  } catch (err) {
    console.error("Error getting help context:", err);
  }
  
  return (
    <Layout></Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
 <WithHelp
            context="analytics-dashboard"
            query="What is the analytics dashboard used for?"
            position="bottom-right"
          ></WithHelp>        >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">
              View and analyze data metrics across your documents and activities
            </p>
          </WithHelp>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            {/* Time period selector */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-0">
              <div>
                <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period
                </label>
                <select
                  id="timeframe"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="week">Last 7 days</option>
                  <option value="month" selected>Last 30 days</option>
                  <option value="quarter">Last 3 months</option>
                  <option value="year">Last 12 months</option>
                  <option value="all">All time</option>
                </select>
              </div>

              <div>
                <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type
                </label>
                <select
                  id="reportType"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="document" selected>Document Analytics</option>
                  <option value="user">User Analytics</option>
                  <option value="system">System Analytics</option>
                </select>
              </div>
            </div>
            
            {/* Generate report button */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div>
                <label htmlFor="reportFormat" className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <select
                  id="reportFormat"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
         <WithHelp
                context="analytics-reports"
                query="How do I generate and use reports?"
                position="right"
                icon="help"
              ></WithHelp>elp"
              >
                <button
                  className="mt-4 md:mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Generate Report
                </button>
              </WithHelp>
            </div>
          </div>

          {/* <WithHelp
            context="analytics-stats"
            query="What do these statistics cards mean?"
            position="top"
            icon="info"
          ></WithHelp>        icon="info"
          >
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800">Key Metrics</h3>
              <p className="text-sm text-gray-600">Quick overview of important statistics and metrics</p>
            </div>
          </WithHelp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Documents</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">0</p>
                </div>
                <div className="rounded-full bg-gray-50 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Folders</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">0</p>
                </div>
                <div className="rounded-full bg-gray-50 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Storage Used</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">0 KB</p>
                </div>
                <div className="rounded-full bg-gray-50 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">0</p>
                </div>
                <div className="rounded-full bg-gray-50 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
         <WithHelp
            context="analytics-charts"
            query="How do I interpret these analytics charts?"
            position="top-left"
            icon="info"
          ></WithHelp>-left"
            icon="info"
          >
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800">Analytics Visualizations</h3>
              <p className="text-sm text-gray-600">Visual representations of your document usage data</p>
            </div>
          </WithHelp>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Document Activity Over Time</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Timeline chart will appear here</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">File Type Distribution</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Pie chart will appear here</p>
              </div>
            </div>
          </div>
          
          {/* Placeholder for data table */}
          <div className="bg-white rounded-l<WithHelp
              context="analytics-storage-table"
              query="How is storage being used across my folders?"
              position="right"
              icon="info"
            ></WithHelp>ition="right"
              icon="info"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-4">Storage Usage by Folder</h3>
            </WithHelp>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Folder
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Storage Used
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      No data available
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Global Help Button */}
        <div className="fixed bottom-5 right-5">
          <button
            onClick={() => showContextualHelp('analytics-guide', 'How do I use the analytics dashboard effectively?')}
            className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors focus:outline-none"
            aria-label="Get help about analytics"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </Layout>
  );
}
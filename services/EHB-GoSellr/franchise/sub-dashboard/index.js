/**
 * GoSellr Sub-Franchise Dashboard
 * 
 * Sub-Franchise dashboard showing orders, complaints, finance by zone
 */

import React, { useState, useEffect } from 'react';

// Sub-Franchise Dashboard component - placeholder for now
export default function SubFranchiseDashboard() {
  const [franchiseInfo, setFranchiseInfo] = useState({
    name: 'East Region Franchise #42',
    owner: 'Jane Smith',
    establishedDate: '2022-07-15',
    status: 'active',
    zones: 4,
    totalRevenue: 127495.82,
    monthlyGrowth: 12.5
  });
  
  const [zonePerformance, setZonePerformance] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  
  // Simulating data loading
  useEffect(() => {
    // Mock zone performance data
    setZonePerformance([
      { 
        id: 1, 
        name: 'Downtown', 
        revenue: 42578.25, 
        orders: 312, 
        growth: 8.3,
        performanceScore: 'high'
      },
      { 
        id: 2, 
        name: 'Suburban Mall', 
        revenue: 38290.15, 
        orders: 281, 
        growth: 16.7,
        performanceScore: 'high'
      },
      { 
        id: 3, 
        name: 'University Area', 
        revenue: 29387.42, 
        orders: 243, 
        growth: 14.2,
        performanceScore: 'medium'
      },
      { 
        id: 4, 
        name: 'Business District', 
        revenue: 17240.00, 
        orders: 124, 
        growth: -2.8,
        performanceScore: 'low'
      }
    ]);
    
    // Mock recent orders
    setRecentOrders([
      { id: 1, customer: 'John Doe', amount: 289.99, items: 3, date: '2023-05-10', status: 'delivered', zone: 'Downtown' },
      { id: 2, customer: 'Sarah Johnson', amount: 124.50, items: 2, date: '2023-05-10', status: 'processing', zone: 'Suburban Mall' },
      { id: 3, customer: 'Michael Chen', amount: 599.99, items: 1, date: '2023-05-09', status: 'shipped', zone: 'Downtown' },
      { id: 4, customer: 'Emily Brown', amount: 45.75, items: 4, date: '2023-05-09', status: 'delivered', zone: 'University Area' },
      { id: 5, customer: 'Robert Wilson', amount: 199.95, items: 1, date: '2023-05-08', status: 'delivered', zone: 'Business District' }
    ]);
    
    // Mock complaints
    setRecentComplaints([
      { 
        id: 1, 
        customer: 'Lisa Adams', 
        orderId: 'ORD-7842', 
        date: '2023-05-09', 
        issue: 'Delayed Delivery', 
        status: 'resolved', 
        zone: 'Downtown',
        priority: 'medium'
      },
      { 
        id: 2, 
        customer: 'Tom Garcia', 
        orderId: 'ORD-7836', 
        date: '2023-05-09', 
        issue: 'Damaged Product', 
        status: 'in-progress', 
        zone: 'Suburban Mall',
        priority: 'high'
      },
      { 
        id: 3, 
        customer: 'Kelly Wright', 
        orderId: 'ORD-7830', 
        date: '2023-05-08', 
        issue: 'Wrong Item Shipped', 
        status: 'in-progress', 
        zone: 'University Area',
        priority: 'high'
      },
      { 
        id: 4, 
        customer: 'David Lee', 
        orderId: 'ORD-7801', 
        date: '2023-05-07', 
        issue: 'Missing Parts', 
        status: 'resolved', 
        zone: 'Downtown',
        priority: 'medium'
      }
    ]);
  }, []);
  
  // Performance score colors
  const performanceColors = {
    'high': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'low': 'bg-red-100 text-red-800'
  };
  
  // Status colors
  const statusColors = {
    'delivered': 'bg-green-100 text-green-800',
    'shipped': 'bg-blue-100 text-blue-800',
    'processing': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  
  // Complaint status colors
  const complaintStatusColors = {
    'resolved': 'bg-green-100 text-green-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'pending': 'bg-gray-100 text-gray-800',
    'escalated': 'bg-red-100 text-red-800'
  };
  
  // Complaint priority colors
  const priorityColors = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-red-100 text-red-800'
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">GoSellr Franchise</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">Franchise Manager</span>
              <img className="h-8 w-8 rounded-full bg-gray-300" src="#" alt="" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Franchise Info Header */}
        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-blue-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">{franchiseInfo.name}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Managed by {franchiseInfo.owner} • Established {franchiseInfo.establishedDate}
                </p>
              </div>
              <div className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 capitalize">
                {franchiseInfo.status}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Zones</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{franchiseInfo.zones}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Total Revenue</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${franchiseInfo.totalRevenue.toLocaleString()}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Monthly Growth</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  {franchiseInfo.monthlyGrowth >= 0 ? (
                    <svg className="h-5 w-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path>
                    </svg>
                  )}
                  <span className={franchiseInfo.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {franchiseInfo.monthlyGrowth}%
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Zone Performance */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Zone Performance</h2>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Growth
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(zonePerformance || []).map((zone) => (
                      <tr key={zone.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {zone.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${zone.revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {zone.orders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={zone.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {zone.growth}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${performanceColors[zone.performanceScore]}`}>
                            {zone.performanceScore.charAt(0).toUpperCase() + zone.performanceScore.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
         (recentOrders || []).map((ers || []).map((order) => (
                  <li key={order.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {order.customer}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>
                            {order.items} {order.items === 1 ? 'item' : 'items'}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            {order.zone}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          ${order.amount}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  View All Orders
                </button>
              </div>
            </div>
          </div>
          
          {/* Complaint Status */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Complaints</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
 (recentComplaints || (tComplaints || []).map((nts || []).map((complaint) => (
                  <li key={complaint.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {complaint.issue}
                        </p>
                        <div className="ml-2 flex space-x-2">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${complaintStatusColors[complaint.status]}`}>
                            {complaint.status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[complaint.priority]}`}>
                            {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {complaint.customer} • Order {complaint.orderId}
                        </p>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            {complaint.date}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            {complaint.zone}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <button className="text-sm text-indigo-600 hover:text-indigo-900">
                          Respond to Complaint
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  View All Complaints
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
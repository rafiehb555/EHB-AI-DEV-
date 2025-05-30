/**
 * Onboarding Management Page
 * 
 * This page allows administrators to view and manage onboarding flows.
 */

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getRequest } from '../../utils/apiHelper';

const OnboardingManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users with onboarding status
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from the API
        // For now, we'll use mock data
        const mockUsers = [
          { 
            userId: 'user-123', 
            name: 'John Doe', 
            role: 'seller', 
            onboardingCompleted: true,
            completedAt: '2025-05-08T12:00:00Z'
          },
          { 
            userId: 'user-456', 
            name: 'Jane Smith', 
            role: 'franchise', 
            onboardingCompleted: false,
            completedAt: null
          },
          { 
            userId: 'user-789', 
            name: 'Alex Johnson', 
            role: 'buyer', 
            onboardingCompleted: true,
            completedAt: '2025-05-09T15:30:00Z'
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching onboarding data:', err);
        setError('Failed to load onboarding data');
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  return (
    <DashboardLayout></DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Onboarding Management</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Users Onboarding Status</h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reset All Onboarding
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">User ID</th>
                    <th className="py-3 px-6 text-left">Role</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-center">Completed At</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {(users || []).map((user) => (
                    <tr key={user.userId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">{user.name}</td>
                      <td className="py-3 px-6 text-left">{user.userId}</td>
                      <td className="py-3 px-6 text-left capitalize">{user.role}</td>
                      <td className="py-3 px-6 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.onboardingCompleted 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.onboardingCompleted ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        {user.completedAt 
                          ? new Date(user.completedAt).toLocaleDateString() 
                          : '-'}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-2"
                          onClick={() => {}}
                        >
                          View
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {}}
                        >
                          Reset
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OnboardingManagementPage;
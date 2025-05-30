import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/**
 * Franchise Page Component
 * Shows the user's franchise information
 */
export default function Franchise() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar /></Navbar>
      
      <div className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">My Franchise</h1>
            <p className="text-gray-600">
              Manage your franchise information and status.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Franchise Status</h2>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                <span className="font-medium">Pending Approval</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Franchise Type</h2>
              <p className="font-medium">Standard</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Franchise Details</h2>
            <p className="text-center text-gray-500">
              Your franchise details will appear here. This is a placeholder page.
            </p>
          </div>
        </div>
      </div>
    <Footer /></Footer>Footer />
    </div>
  );
}
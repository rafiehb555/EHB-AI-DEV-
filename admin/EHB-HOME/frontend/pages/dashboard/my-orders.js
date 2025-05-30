import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/**
 * My Orders Page Component
 * Shows the user's orders
 */
export default function MyOrders() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar /></Navbar>
      
      <div className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">My Orders</h1>
            <p className="text-gray-600">
              View and manage your orders here.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-center text-gray-500">
              Your order history will appear here. This is a placeholder page.
            </p>
          </div>
        </div>
      </div>
    <Footer /></Footer>Footer />
    </div>
  );
}
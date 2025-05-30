import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/**
 * Wallet Page Component
 * Shows the user's wallet balance and transactions
 */
export default function Wallet() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar /></Navbar>
      
      <div className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">My Wallet</h1>
            <p className="text-gray-600">
              Check your wallet balance and transaction history.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Current Balance</h2>
              <div className="text-2xl font-bold text-green-600">$0.00</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <p className="text-center text-gray-500">
              Your transaction history will appear here. This is a placeholder page.
            </p>
          </div>
        </div>
      </div>
    <Footer /></Footer>Footer />
    </div>
  );
}
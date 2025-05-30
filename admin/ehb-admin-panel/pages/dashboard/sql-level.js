import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/**
 * SQL Level Page Component
 * Shows the user's SQL verification level
 */
export default function SQLLevel() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar /></Navbar>
      
      <div className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">SQL Verification Level</h1>
            <p className="text-gray-600">
              Check your SQL verification level and progress.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Current Level</h2>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-blue-600 mr-2">Level 1</span>
                <span className="text-gray-500">Beginner</span>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">25% to Level 2</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Badges Earned</h2>
              <div className="flex flex-wrap gap-2">
                <div className="p-2 bg-gray-100 rounded-md text-center">
                  <div className="text-xl">🥉</div>
                  <div className="text-sm font-medium">SQL Basics</div>
                </div>
                <div className="p-2 bg-gray-100 rounded-md text-center opacity-50">
                  <div className="text-xl">🥈</div>
                  <div className="text-sm font-medium">Intermediate</div>
                </div>
                <div className="p-2 bg-gray-100 rounded-md text-center opacity-50">
                  <div className="text-xl">🥇</div>
                  <div className="text-sm font-medium">Advanced</div>
                </div>
                <div className="p-2 bg-gray-100 rounded-md text-center opacity-50">
                  <div className="text-xl">🏆</div>
                  <div className="text-sm font-medium">Expert</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Next SQL Challenge</h2>
            <p className="text-gray-600 mb-4">
              Complete the following SQL challenge to progress to the next level:
            </p>
            <div className="p-4 bg-gray-50 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">
                {`SELECT * FROM users WHERE status = 'active' AND signup_date > '2023-01-01'`}
              </pre>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Take Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    <Footer /></Footer>Footer />
    </div>
  );
}
/**
 * Simple Help Demo Page
 * 
 * This is a simplified version of the help demo page without context dependencies
 */

import React from 'react';

const SimpleHelpDemo = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Contextual Help Demo (Simplified)
      </h1>
      
      <p className="text-gray-600 mb-8">
        This is a simplified demo of the help system. The full version uses AI-powered contextual help.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            Key Features
          </h2>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-600 p-1 rounded mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <div className="font-medium">
                  Blockchain Integration
                </div>
                <p className="text-sm text-gray-600">Seamlessly integrate with various blockchain networks for secure transactions.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-600 p-1 rounded mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <div className="font-medium">
                  AI-Powered Analytics
                </div>
                <p className="text-sm text-gray-600">Advanced analytics with AI to provide actionable business insights.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-600 p-1 rounded mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <div className="font-medium">
                  Smart Contracts
                </div>
                <p className="text-sm text-gray-600">Create and deploy smart contracts with our intuitive interface.</p>
              </div>
            </li>
          </ul>
        </div>
        
        {/* Common Questions Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Common Questions</h2>
          
          <div className="space-y-4">
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              What is the EHB platform?
            </button>
            
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              How do I connect my wallet?
            </button>
            
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              What types of blockchain networks are supported?
            </button>
            
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              How can I create a new smart contract?
            </button>
          </div>
        </div>
      </div>
      
      {/* Help Topics Demo */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Help Topics</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {['Dashboard Navigation', 'User Management', 'Transaction History', 'API Integration', 'Security Settings', 'Developer Tools'].map((topic) => (
            <div 
              key={topic}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
            >
              <h3 className="font-semibold text-lg mb-2">{topic}</h3>
              <p className="text-sm text-gray-600">Click to get detailed help about {topic.toLowerCase()}.</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Implementation Notes</h3>
        <p>
          This is a simplified version of the help demo page. The full version includes:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>AI-powered contextual help that uses OpenAI or Claude</li>
          <li>Help triggers next to important UI elements</li>
          <li>Real-time help content generation based on user context</li>
          <li>History tracking of user questions and requests</li>
          <li>Integration with the backend API for generating help content</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleHelpDemo;
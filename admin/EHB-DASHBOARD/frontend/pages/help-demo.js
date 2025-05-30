/**
 * Help Demo Page
 * 
 * This page demonstrates the contextual help features with several examples
 */

import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import HelpTrigger from '../components/help/HelpTrigger';
import { useContextualHelp } from '../context/ContextualHelpContext';

const HelpDemoPage = () => {
  const { getHelpForTopic, askQuestion } = useContextualHelp();
  
  const handleAskQuestion = (question) => {
    askQuestion(question);
  };
  
  return (
    <DashboardLayout></DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Contextual He<HelpTrigger topic="Contextual Help System" /></HelpTrigger>al Help System" />
        </h1>
        
        <p className="text-gray-600 mb-8">
          This page demonstrates the contextual help system. Click on any help icon or use the help button in the corner to explore the AI-powered help features.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Features Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
         <HelpTrigger topic="EHB Platform Features" /></HelpTrigger>topic="EHB Platform Features" />
            </h2>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 p-1 rounded mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <div>
                  <div className="font-medium flex items-center">
                 <HelpTrigger topic="Blockchain Integration" size="xs" /></HelpTrigger>er topic="Blockchain Integration" size="xs" />
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
                  <div className="font-medium flex items-center">
 <HelpTrigger topic="AI Analytics" size="xs" /></HelpTrigger>              <HelpTrigger topic="AI Analytics" size="xs" /></HelpTrigger>
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
                  <div className="font-medium fl<HelpTrigger topic="Smart Contracts" size="xs" /></HelpTrigger>acts
      <HelpTrigger topic="Smart Contracts" size="xs" /></HelpTrigger>" size="xs" />
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
                onClick={() => handleAskQuestion("What is the EHB platform?")}
                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                What is the EHB platform?
              </button>
              
              <button 
                onClick={() => handleAskQuestion("How do I connect my wallet?")}
                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                How do I connect my wallet?
              </button>
              
              <button 
                onClick={() => handleAskQuestion("What types of blockchain networks are supported?")}
                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                What types of blockchain networks are supported?
              </button>
              
              <button 
                onClick={() => handleAskQuestion("How can I create a new smart contract?")}
                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                How can I create a new smart contract?
              </button>
            </div>
          </div>
        </div>
        
        {/* Help Sections Demo */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Help Topics</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {['Dashboard Navigation', 'User Management', 'Transaction History', 'API Integration', 'Security Settings', 'Developer Tools'].map((topic) => (
              <div 
                key={topic}
                onClick={() => getHelpForTopic(topic)}
                className="bg-white shadow-md rounded-lg p-5 border border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
              >
                <h3 className="font-semibold text-lg mb-2">{topic}</h3>
                <p className="text-sm text-gray-600">Click to get detailed help about {topic.toLowerCase()}.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HelpDemoPage;
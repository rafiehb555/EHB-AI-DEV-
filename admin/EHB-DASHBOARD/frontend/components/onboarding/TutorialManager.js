import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { useContextualHelp } from '../../context/ContextualHelpContext';

/**
 * TutorialManager Component
 * Manages tutorials and feature tours for the application
 */
const TutorialManager = () => {
  const { startOnboarding } = useOnboarding();
  const { getPageHelp } = useContextualHelp();
  
  const [tutorials, setTutorials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch available tutorials on mount
  useEffect(() => {
    const fetchTutorials = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        const response = await fetch('/api/tutorials');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tutorials: ${response.status}`);
        }
        
        const data = await response.json();
        setTutorials(data.tutorials || []);
      } catch (error) {
        console.error('Error fetching tutorials:', error);
        setError(error.message);
        
        // Fallback tutorials if API fails
        setTutorials([
          {
            id: 'getting-started',
            title: 'Getting Started with EHB System',
            description: 'Learn the basics of the EHB System and get up and running quickly.',
            type: 'onboarding',
            duration: '5 min',
          },
          {
            id: 'blockchain-basics',
            title: 'Blockchain Basics',
            description: 'Learn about blockchain technology and how it works in the EHB System.',
            type: 'help',
            duration: '8 min',
          },
          {
            id: 'wallet-guide',
            title: 'Wallet Management Guide',
            description: 'Master the wallet features and learn how to manage your digital assets.',
            type: 'onboarding',
            duration: '4 min',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTutorials();
  }, []);
  
  // Start a tutorial
  const startTutorial = (tutorialId, type) => {
    if (type === 'onboarding') {
      startOnboarding({ tutorialId });
    } else if (type === 'help') {
      getPageHelp(`tutorial:${tutorialId}`);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Tutorials & Guides
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started with these helpful tutorials and guides
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : tutorials.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No tutorials available at the moment.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 mt-2">
            {(tutorials || []).map((tutorial) => (
              <div
                key={tutorial.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium text-gray-900">
                      {tutorial.title}
                    </h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tutorial.duration}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {tutorial.description}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => startTutorial(tutorial.id, tutorial.type)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {tutorial.type === 'onboarding' ? 'Start Tutorial' : 'View Guide'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialManager;
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../Navbar';
import Sidebar from './Sidebar';
import { useContextualHelp } from '../../context/ContextualHelpContext';
import { useOnboarding } from '../../context/OnboardingContext';

/**
 * DashboardLayout Component
 * Main layout component for all dashboard pages
 */
const DashboardLayout = ({ children, title, description }) => {
  const { helpSidebarOpen, helpContent } = useContextualHelp();
  const { onboardingActive, currentStep, onboardingData } = useOnboarding();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Head></Head>
        <title>{title || 'EHB System Dashboard'}</title>
        <meta
          name="description"
          content={description || 'Enterprise Hybrid Blockchain System Dashboard'}
        />
      </Head>
      
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-20 mt-4 ml-4">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity ease-linear duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-gray-600 bg-opacity-75"></div>
        
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition ease-in-out duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
   <Sidebar /></Sidebar>ebar />
        </div>
        
        <div className="flex-shrink-0 w-14"></div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-sh<Sidebar /></Sidebar>      <Sidebar /></Sidebar>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1<Navbar /></Navbar>hidden"<Navbar /></Navbar><Navbar /></Navbar>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {onboardingActive ? (
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {onboardingData?.title || 'Welcome to EHB System'}
                  </h2>
                  <p className="text-gray-500 mb-2">
                    Step {currentStep + 1} of {onboardingData?.totalSteps || '5'}
                  </p>
                  <div className="mb-6">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
                        style={{
                          width: `${
                            ((currentStep + 1) / (onboardingData?.totalSteps || 5)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>{onboardingData?.content}</div>
                </div>
              ) : null}
              
              {children}
            </div>
          </div>
        </main>
      </div>
      
      {/* Contextual Help Sidebar */}
      {helpSidebarOpen && (
        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 z-50">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl">
              <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Contextual Help</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      onClick={() => useContextualHelp.getState().toggleHelpSidebar()}
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className="sr-only">Close panel</span>
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="flow-root">
                    {helpContent ? (
                      <div className="prose max-w-none">
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <h3 className="text-md font-medium text-blue-800">
                            {helpContent.title || 'Help & Information'}
                          </h3>
                          <p className="text-sm text-blue-700 mt-1">
                            {helpContent.subtitle || 'AI-powered explanations and guidance'}
                          </p>
                        </div>
                        
                        <div className="mt-4">
                          {helpContent.content || (
                            <p className="text-gray-500">
                              Loading help content for this page...
                            </p>
                          )}
                        </div>
                        
                        {helpContent.relatedTopics && helpContent.relatedTopics.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-900">
                              Related Topics
                            </h4>
                            <ul className="mt-2 space-y-1">
                              {(helpContent.relatedTopics || []).map((topic, index) => (
                                <li key={index}>
                                  <button
                                    onClick={() =>
                                      useContextualHelp.getState().getRelatedTopic(topic.id)
                                    }
                                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                                  >
                                    {topic.title}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-500 mb-4"
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
                        <p className="text-gray-500 text-center">
                          Loading help information...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 py-4 px-4 sm:px-6">
                <div className="flex justify-between text-sm font-medium text-gray-900">
                  <p>Powered by AI</p>
                  <p>
                    <button
                      onClick={() => useContextualHelp.getState().refreshHelp()}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Refresh
                    </button>
                  </p>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  Contextual help is powered by AI and may not always be accurate.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
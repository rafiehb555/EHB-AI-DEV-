import React, { useState, useEffect, useRef } from 'react';
import { useContextualHelp } from '../../context/ContextualHelpContext';

/**
 * Contextual Help Sidebar Component
 * Displays AI-powered contextual help for the current page or feature
 */
const ContextualHelpSidebar = () => {
  const { 
    isHelpOpen, 
    helpTopic, 
    helpContent, 
    isLoading, 
    error, 
    closeHelp, 
    getHelp,
    askQuestion,
    getPopularTopics
  } = useContextualHelp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [popularTopics, setPopularTopics] = useState([]);
  const [isQuestion, setIsQuestion] = useState(false);
  const [activeMode, setActiveMode] = useState('topics'); // 'topics' or 'ask'
  
  // Refs
  const searchInputRef = useRef(null);
  
  // Load popular topics when the component mounts
  useEffect(() => {
    async function loadPopularTopics() {
      try {
        const topics = await getPopularTopics(5);
        if (topics && topics.length > 0) {
          setPopularTopics(topics);
        }
      } catch (error) {
        console.error('Error loading popular topics:', error);
      }
    }
    
    if (isHelpOpen) {
      loadPopularTopics();
    }
  }, [isHelpOpen, getPopularTopics]);
  
  // Focus the search input when the mode changes to ask
  useEffect(() => {
    if (activeMode === 'ask' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [activeMode]);
  
  // Detect if the query is likely a question or a topic
  useEffect(() => {
    // Simple heuristic: If the query starts with who, what, where, why, when, how, is, can, etc.
    const questionStarters = ['who', 'what', 'where', 'why', 'when', 'how', 'is', 'are', 'can', 'should', 'would', 'will', 'do', 'does'];
    const queryWords = searchQuery.toLowerCase().trim().split(' ');
    
    if (queryWords.length > 0) {
      setIsQuestion(
        questionStarters.includes(queryWords[0]) || 
        searchQuery.trim().endsWith('?')
      );
    } else {
      setIsQuestion(false);
    }
  }, [searchQuery]);
  
  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // If it looks like a question, use askQuestion, otherwise use getHelp
      if (isQuestion || activeMode === 'ask') {
        await askQuestion(searchQuery, { 
          currentPath: window.location.pathname,
          mode: activeMode
        });
      } else {
        await getHelp(searchQuery, { 
          currentPath: window.location.pathname,
          mode: activeMode
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle topic click
  const handleTopicClick = async (e, topic) => {
    e.preventDefault();
    
    try {
      setIsSearching(true);
      await getHelp(topic, { currentPath: window.location.pathname });
    } catch (error) {
      console.error('Topic click error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Switch between topic mode and question mode
  const switchMode = (mode) => {
    setActiveMode(mode);
    if (mode === 'ask') {
      setSearchQuery('');
      // Focus on the input after a short delay to ensure the UI has updated
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  };
  
  // Reset search when the sidebar closes
  useEffect(() => {
    if (!isHelpOpen) {
      setSearchQuery('');
      setSearchResults(null);
    }
  }, [isHelpOpen]);
  
  // Default content when no specific help content is available
  const defaultContent = {
    title: 'How can we help you?',
    content: `
      <p>Welcome to the EHB System help center. You can search for help on any topic using the search box above, or browse the common topics below:</p>
      
      <h3>Common Topics</h3>
      <ul>
        <li><a href="#" data-topic="wallet" class="text-blue-600 hover:underline">Blockchain Wallet</a></li>
        <li><a href="#" data-topic="transactions" class="text-blue-600 hover:underline">Transactions</a></li>
        <li><a href="#" data-topic="marketplace" class="text-blue-600 hover:underline">Marketplace</a></li>
        <li><a href="#" data-topic="security" class="text-blue-600 hover:underline">Security</a></li>
      </ul>
      
      <h3>Quick Start</h3>
      <p>If you're new to the EHB System, here are some topics to help you get started:</p>
      <ul>
        <li><a href="#" data-topic="getting-started" class="text-blue-600 hover:underline">Getting Started Guide</a></li>
        <li><a href="#" data-topic="account-setup" class="text-blue-600 hover:underline">Setting Up Your Account</a></li>
        <li><a href="#" data-topic="first-transaction" class="text-blue-600 hover:underline">Making Your First Transaction</a></li>
      </ul>
      
      <div class="mt-6 bg-blue-50 p-4 rounded-md">
        <h3 class="text-lg font-medium text-blue-900 mb-2">Ask AI Assistant</h3>
        <p class="text-blue-800">Don't see what you're looking for? Click the "Ask a Question" tab above and ask our AI assistant anything about the EHB System.</p>
      </div>
    `,
  };
  
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-40 flex flex-col border-l border-gray-200 transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Help & Support</h2>
        <button
          onClick={closeHelp}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close help sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
      
      {/* Mode tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => switchMode('topics')}
            className={`py-3 px-4 font-medium text-sm flex-1 text-center border-b-2 ${
              activeMode === 'topics'
                ? 'text-blue-600 border-blue-500'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Browse Topics
          </button>
          <button
            onClick={() => switchMode('ask')}
            className={`py-3 px-4 font-medium text-sm flex-1 text-center border-b-2 ${
              activeMode === 'ask'
                ? 'text-blue-600 border-blue-500'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ask AI Assistant
          </button>
        </nav>
      </div>
      
      {/* Search bar */}
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={activeMode === 'topics' ? "Search for help topics..." : "Ask a question about EHB System..."}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-4 text-gray-500 hover:text-gray-700"
              disabled={isSearching}
            >
              {isSearching ? (
                <svg
                  className="animate-spin h-5 w-5"
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
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          {activeMode === 'ask' && (
            <p className="mt-2 text-xs text-gray-500">
              Ask any question about the EHB System. For example: "How do I set up a wallet?" or "What is a smart contract?"
            </p>
          )}
        </form>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
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
            <p className="text-gray-600">{activeMode === 'ask' ? 'Processing your question...' : 'Loading help content...'}</p>
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
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {helpContent?.title || defaultContent.title}
            </h3>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: helpContent?.content || defaultContent.content,
              }}
              onClick={(e) => {
                // Handle topic links
                if (e.target.tagName === 'A' && e.target.dataset.topic) {
                  handleTopicClick(e, e.target.dataset.topic);
                }
              }}
            />
            
            {/* Popular topics (shown when no search has been performed) */}
            {!helpContent && activeMode === 'topics' && popularTopics.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Popular Topics</h3>
                <ul className="list-disc list-inside text-blue-600">
                  {popularTopics.map((topic, index) => (
                    <li key={index} className="mb-1">
                      <button
                        className="hover:underline text-left"
                        onClick={(e) => handleTopicClick(e, topic.topic)}
                      >
                        {topic.topic} ({topic.access_count} views)
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* AI assistant introduction (shown when in ask mode with no query) */}
            {!helpContent && activeMode === 'ask' && (
              <div className="bg-blue-50 p-4 rounded-md mt-4">
                <h3 className="font-medium text-blue-900 mb-2">AI Assistant Help</h3>
                <p className="text-blue-800 mb-3">
                  Our AI assistant can answer questions about:
                </p>
                <ul className="list-disc list-inside text-blue-800 ml-2">
                  <li>Blockchain concepts and technology</li>
                  <li>Wallet setup and management</li>
                  <li>Transactions and smart contracts</li>
                  <li>Security best practices</li>
                  <li>EHB System features and functionality</li>
                </ul>
                <p className="text-blue-800 mt-3">
                  Just type your question in the box above and press Enter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-sm text-gray-600">
        <p>Can't find what you're looking for?</p>
        <div className="flex mt-1">
          <a
            href="/support"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Contact Support
          </a>
          <span className="mx-2">•</span>
          <button 
            onClick={() => switchMode(activeMode === 'topics' ? 'ask' : 'topics')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {activeMode === 'topics' ? 'Ask AI Assistant' : 'Browse Topics'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContextualHelpSidebar;
import React from 'react';
import { useFeedback } from '../../context/FeedbackContext';

/**
 * Floating Feedback Button Component
 * Provides a floating button for quick access to feedback and suggestion forms
 */
const FeedbackButton = () => {
  const { openFeedback } = useFeedback();
  
  // Open feedback form
  const handleFeedbackClick = () => {
    openFeedback('feedback', {
      page_url: typeof window !== 'undefined' ? window.location.pathname : ''
    });
  };
  
  // Open suggestion form
  const handleSuggestionClick = () => {
    openFeedback('suggestion', {
      page_url: typeof window !== 'undefined' ? window.location.pathname : ''
    });
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Feedback button with dropdown menu */}
      <div className="relative group">
        <button
          aria-label="Give feedback"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-6 h-6"
          >
            <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Dropdown menu that appears on hover */}
        <div className="absolute bottom-full right-0 mb-2 w-48 scale-0 group-hover:scale-100 transition-transform origin-bottom-right duration-200 ease-in-out">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleFeedbackClick}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Quick Feedback
            </button>
            <button
              onClick={handleSuggestionClick}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Suggestion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackButton;
import React, { useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Feedback Widget Component
 * A floating widget that allows users to quickly navigate to the feedback page
 */
const FeedbackWidget = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // Toggle the widget open/closed
  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };
  
  // Navigate to the feedback page
  const goToFeedback = () => {
    router.push('/feedback');
  };
  
  return (
    <div className="feedback-widget-container">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-2 w-64">
          <h3 className="text-lg font-semibold mb-2">We value your feedback!</h3>
          <p className="text-sm text-gray-600 mb-3">
            Help us improve by sharing your thoughts, reporting issues, or suggesting new features.
          </p>
          <button
            onClick={goToFeedback}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          >
            Give Feedback
          </button>
        </div>
      )}
      
      <button
        onClick={toggleWidget}
        className="feedback-button"
        aria-label="Toggle feedback widget"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default FeedbackWidget;
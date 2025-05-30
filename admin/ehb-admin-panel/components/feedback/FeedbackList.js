import React from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import FeedbackMessage from './FeedbackMessage';

/**
 * Feedback List Component
 * Displays a list of feedback messages from the FeedbackContext
 */
const FeedbackList = () => {
  const { feedbackItems, dismissAllFeedback } = useFeedback();
  
  if (!feedbackItems || feedbackItems.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      {/* Header with dismiss all button (only shown if multiple items) */}
      {feedbackItems.length > 1 && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            {feedbackItems.length} Notifications
          </h3>
          <button
            onClick={dismissAllFeedback}
            className="text-xs text-gray-500 hover:text-gray-700 underline focus:outline-none"
          >
            Dismiss All
          </button>
        </div>
      )}
      
      {/* List of feedback items */}
      <div className="space-y-2">
        {(feedbackItems || []).map((item) => (
          <FeedbackMessage key={item.id} feedback={item} /></FeedbackMessage>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
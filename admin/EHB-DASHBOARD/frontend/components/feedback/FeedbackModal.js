import React from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { FeedbackForm, SuggestionForm } from './';

/**
 * FeedbackModal component
 * 
 * Provides a modal interface for submitting feedback or suggestions
 * This component is rendered by the layout and is controlled by the FeedbackContext
 */
const FeedbackModal = () => {
  const { isFeedbackOpen, feedbackType, prefilledData, closeFeedback } = useFeedback();

  if (!isFeedbackOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 relative">
        {/* Close button */}
        <button 
          onClick={closeFeedback}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close feedback modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold mb-4">
          {feedbackType === 'feedback' ? 'Share Your Feedback' : 'Submit a Suggestion'}
        </h2>
        
        {feedbackType === 'feedback' ? (
          <FeedbackForm 
            initialValues={prefilledData}
            onSuccess={() =></FeedbackForm> {
              closeFeedback();
              // Show success message
              alert('Thank you for your feedback!');
            }} 
          />
        )<SuggestionForm 
            initialValues={prefilledData}
            onSuccess={() =></SuggestionForm>nSuccess={() => {
              closeFeedback();
              // Show success message
              alert('Thank you for your suggestion!');
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
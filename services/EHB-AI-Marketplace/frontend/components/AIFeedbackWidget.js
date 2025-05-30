import React, { useState } from 'react';
import { useAIFeedback } from '../context/AIFeedbackContext';

/**
 * Star Rating component for AI feedback
 */
const StarRating = ({ rating, setRating, disabled = false }) => {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl focus:outline-none ${
            disabled ? 'cursor-default' : 'cursor-pointer'
          }`}
          onClick={() => !disabled && setRating(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
          disabled={disabled}
        >
          <span className={`${
            star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
          }`}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

/**
 * AI Feedback Widget Component
 * Displays after an AI response to collect user feedback
 */
const AIFeedbackWidget = ({ responseId, context = 'general', onFeedbackSubmitted }) => {
  const { submitFeedback, submitSuggestion, loading, error } = useAIFeedback();
  
  // Feedback form state
  const [rating, setRating] = useState(0);
  const [helpful, setHelpful] = useState(null);
  const [accurate, setAccurate] = useState(null);
  const [comments, setComments] = useState('');
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);
  
  /**
   * Handle feedback form submission
   */
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }
    
    try {
      const feedbackData = {
        responseId,
        rating,
        helpful,
        accurate,
        context,
        comments
      };
      
      await submitFeedback(feedbackData);
      setFeedbackSubmitted(true);
      
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(feedbackData);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };
  
  /**
   * Handle suggestion form submission
   */
  const handleSubmitSuggestion = async (e) => {
    e.preventDefault();
    
    if (!suggestion.trim()) {
      alert('Please provide a suggestion');
      return;
    }
    
    try {
      const suggestionData = {
        category,
        suggestion,
        priority
      };
      
      await submitSuggestion(suggestionData);
      setSuggestionSubmitted(true);
    } catch (err) {
      console.error('Error submitting suggestion:', err);
    }
  };
  
  /**
   * Toggle the suggestion form visibility
   */
  const toggleSuggestionForm = () => {
    setShowSuggestionForm(prev => !prev);
  };

  if (feedbackSubmitted && !showSuggestionForm) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center">
          <p className="text-green-600 font-medium">Thank you for your feedback!</p>
          <button
            onClick={toggleSuggestionForm}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Have a suggestion to make our AI better?
          </button>
        </div>
      </div>
    );
  }
  
  if (showSuggestionForm) {
    if (suggestionSubmitted) {
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-green-600 font-medium">Thank you for your suggestion!</p>
            <p className="text-sm text-gray-600 mt-1">
              Your suggestions help us improve our AI assistant.
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
        <h4 className="font-medium text-lg mb-2">Suggest an improvement</h4>
        <form onSubmit={handleSubmitSuggestion}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="general">General</option>
              <option value="knowledge">Knowledge</option>
              <option value="accuracy">Accuracy</option>
              <option value="responsiveness">Responsiveness</option>
              <option value="user_experience">User Experience</option>
              <option value="new_feature">New Feature</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suggestion
            </label>
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Share your ideas to make our AI better..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowSuggestionForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </div>
          
          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </form>
      </div>
    );
  }
  
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
      <h4 className="font-medium text-lg mb-2">Rate this response</h4>
      <form onSubmit={handleSubmitFeedback}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <StarRating rating={rating} setRating={setRating} disabled={loading} /></StarRating>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Was this response helpful?
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setHelpful(true)}
              className={`px-3 py-1 text-sm rounded-full ${
                helpful === true 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setHelpful(false)}
              className={`px-3 py-1 text-sm rounded-full ${
                helpful === false 
                  ? 'bg-red-100 text-red-800 border border-red-300' 
                  : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              No
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Was this response accurate?
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setAccurate(true)}
              className={`px-3 py-1 text-sm rounded-full ${
                accurate === true 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setAccurate(false)}
              className={`px-3 py-1 text-sm rounded-full ${
                accurate === false 
                  ? 'bg-red-100 text-red-800 border border-red-300' 
                  : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              No
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Comments (Optional)
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="What did you like or dislike about this response?"
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || rating === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default AIFeedbackWidget;
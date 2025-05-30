import React, { useState, useEffect } from 'react';
import { useAIFeedback } from '../context/AIFeedbackContext';

/**
 * Floating Feedback Button Component
 * Displays a button that opens a feedback form when clicked
 */
const FloatingFeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formType, setFormType] = useState('suggestion'); // 'suggestion' or 'feedback'
  const [mounted, setMounted] = useState(false);
  
  // Only initialize on client-side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  /**
   * Toggle the floating menu
   */
  const toggleMenu = () => {
    setIsOpen(prev => !prev);
    if (isFormVisible) {
      setIsFormVisible(false);
    }
  };
  
  /**
   * Show the feedback form
   * 
   * @param {string} type - The type of form to show ('suggestion' or 'feedback')
   */
  const showForm = (type) => {
    setFormType(type);
    setIsFormVisible(true);
    setIsOpen(false);
  };
  
  /**
   * Close the form
   */
  const closeForm = () => {
    setIsFormVisible(false);
  };
  
  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }
  
  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
          <div className="mb-4 flex flex-col items-end space-y-4">
            <div className="group">
              <button
                onClick={() => showForm('suggestion')}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                aria-label="Suggest an improvement"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
              <div className="absolute right-14 top-2 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                <span className="whitespace-nowrap px-2 py-1 text-sm font-medium bg-white rounded-md shadow-md text-gray-700">
                  Suggest improvement
                </span>
              </div>
            </div>
            
            <div className="group">
              <button
                onClick={() => showForm('feedback')}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300"
                aria-label="Rate the AI assistant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
              <div className="absolute right-14 top-2 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                <span className="whitespace-nowrap px-2 py-1 text-sm font-medium bg-white rounded-md shadow-md text-gray-700">
                  Rate AI assistant
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={toggleMenu}
          className={`flex items-center justify-center w-14 h-14 rounded-full ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
          aria-label={isOpen ? "Close feedback menu" : "Open feedback menu"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Feedback Forms */}
      {isFormVisible && mounted && (
        <FloatingFeedbackForm 
          type={formType} 
          onClose={closeForm} 
        /></FloatingFeedbackForm>
      )}
    </>
  );
};

/**
 * Floating Feedback Form Component
 * Renders either a suggestion form or feedback form
 */
const FloatingFeedbackForm = ({ type, onClose }) => {
  const { submitFeedback, submitSuggestion, loading, error } = useAIFeedback();
  
  // State for suggestion form
  const [suggestion, setSuggestion] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  
  // State for feedback form
  const [rating, setRating] = useState(0);
  const [helpful, setHelpful] = useState(null);
  const [accurate, setAccurate] = useState(null);
  const [context, setContext] = useState('general');
  const [comments, setComments] = useState('');
  
  // Shared state
  const [submitted, setSubmitted] = useState(false);
  
  /**
   * Star Rating component for AI feedback
   */
  const StarRating = () => {
    const [hover, setHover] = useState(0);
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="text-2xl focus:outline-none cursor-pointer"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
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
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting suggestion:', err);
    }
  };
  
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
      // Generate a unique ID for this feedback
      const responseId = `general-${Date.now()}`;
      
      const feedbackData = {
        responseId,
        rating,
        helpful,
        accurate,
        context,
        comments
      };
      
      await submitFeedback(feedbackData);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };
  
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl mx-4">
          <div className="text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold mt-2">Thank you!</h2>
            <p className="text-gray-600 mt-1">
              {type === 'suggestion'
                ? 'Your suggestion has been submitted successfully.'
                : 'Your feedback has been submitted successfully.'
              }
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {type === 'suggestion'
              ? 'Suggest an Improvement'
              : 'Rate Our AI Assistant'
            }
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {type === 'suggestion' ? (
          <form onSubmit={handleSubmitSuggestion}>
            <div className="mb-4">
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
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Suggestion
              </label>
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Share your ideas to make our AI better..."
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
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
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Suggestion'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitFeedback}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overall Rating
              <StarRating /></StarRating>         <StarRating /></StarRating>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Was our AI assistant helpful?
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
                >
                  No
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Were the responses accurate?
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
                >
                  No
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area of Feedback
              </label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="general">General</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="retail">Retail</option>
                <option value="ecommerce">E-commerce</option>
                <option value="saas">SaaS</option>
                <option value="franchising">Franchising</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your thoughts about our AI assistant..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
        
        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default FloatingFeedbackButton;
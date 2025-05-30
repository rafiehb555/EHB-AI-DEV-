import React, { useState } from 'react';
import axios from 'axios';

/**
 * Quick Feedback Form Component
 * Allows users to provide quick feedback with a rating
 */
const FeedbackForm = ({ onSubmit, onClose }) => {
  const [feedback, setFeedback] = useState({
    content: '',
    category: 'general',
    rating: 5,
    source: 'dashboard'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!feedback.content) {
      setError('Please provide feedback content');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Add current page URL
      const submissionData = {
        ...feedback,
        page_url: window.location.href
      };
      
      // Submit to API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/feedback`, 
        submissionData
      );
      
      setSuccess(true);
      
      // Call parent component callback if provided
      if (onSubmit) {
        onSubmit(response.data);
      }
      
      // Reset form after short delay
      setTimeout(() => {
        setFeedback({
          content: '',
          category: 'general',
          rating: 5,
          source: 'dashboard'
        });
        setSuccess(false);
        
        // Close if onClose function is provided
        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Quick Feedback</h3>
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Thank you for your feedback!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={feedback.category}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="general">General</option>
              <option value="ui">User Interface</option>
              <option value="performance">Performance</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
              Rating (1-5)
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                  className="focus:outline-none"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill={star <= feedback.rating ? 'currentColor' : 'none'}
                    stroke={star <= feedback.rating ? 'none' : 'currentColor'}
                    className={`w-6 h-6 ${star <= feedback.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-gray-600">({feedback.rating}/5)</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
              Your Feedback
            </label>
            <textarea
              id="content"
              name="content"
              rows="3"
              value={feedback.content}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Tell us what you think..."
            ></textarea>
          </div>
          
          <div className="flex items-center justify-between">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
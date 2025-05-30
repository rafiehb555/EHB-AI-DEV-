import React, { useState } from 'react';
import axios from 'axios';

/**
 * Suggestion Form Component
 * Allows users to submit suggestions and feature requests
 */
const SuggestionForm = ({ onSubmit, onClose }) => {
  const [suggestion, setSuggestion] = useState({
    content: '',
    category: 'feature',
    estimated_complexity: 'medium',
    source: 'dashboard'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSuggestion(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!suggestion.content) {
      setError('Please provide suggestion content');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Submit to API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/suggestions`, 
        suggestion
      );
      
      setSuccess(true);
      
      // Call parent component callback if provided
      if (onSubmit) {
        onSubmit(response.data);
      }
      
      // Reset form after short delay
      setTimeout(() => {
        setSuggestion({
          content: '',
          category: 'feature',
          estimated_complexity: 'medium',
          source: 'dashboard'
        });
        setSuccess(false);
        
        // Close if onClose function is provided
        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (err) {
      console.error('Error submitting suggestion:', err);
      setError(err.response?.data?.error || 'Failed to submit suggestion');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Submit a Suggestion</h3>
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Thank you for your suggestion! It has been submitted for review.
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
              value={suggestion.category}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement</option>
              <option value="integration">Integration</option>
              <option value="optimization">Optimization</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estimated_complexity">
              Estimated Complexity
            </label>
            <select
              id="estimated_complexity"
              name="estimated_complexity"
              value={suggestion.estimated_complexity}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="low">Low (Quick Implementation)</option>
              <option value="medium">Medium (Standard Effort)</option>
              <option value="high">High (Complex Change)</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
              Your Suggestion
            </label>
            <textarea
              id="content"
              name="content"
              rows="4"
              value={suggestion.content}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Describe your suggestion in detail..."
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
              {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SuggestionForm;
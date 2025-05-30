import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';

/**
 * Feedback Form Component
 * Allows users to submit feedback, report issues, or make suggestions
 */
const FeedbackForm = ({ onSuccess }) => {
  const { submitFeedback, loading, error, success, clearSuccess, clearError } = useFeedback();
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'feedback', // Default type
    subject: '',
    description: '',
    relatedTo: '',
    attachments: []
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing success/error messages
    clearSuccess();
    clearError();
    
    // Simple validation
    if (!formData.subject || !formData.description) {
      // Show an error message
      return;
    }
    
    // Submit the feedback
    const result = await submitFeedback(formData);
    
    // Reset form on success
    if (result) {
      setFormData({
        type: 'feedback',
        subject: '',
        description: '',
        relatedTo: '',
        attachments: []
      });
      
      // Call the success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Submit Feedback</h2>
      
      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{success}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={clearSuccess}
          >
            <span className="text-green-500">×</span>
          </button>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={clearError}
          >
            <span className="text-red-500">×</span>
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Feedback Type */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Feedback Type
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="feedback"
                checked={formData.type === 'feedback'}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">General Feedback</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="suggestion"
                checked={formData.type === 'suggestion'}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-green-600"
              />
              <span className="ml-2 text-gray-700">Suggestion</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="issue"
                checked={formData.type === 'issue'}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-red-600"
              />
              <span className="ml-2 text-gray-700">Report Issue</span>
            </label>
          </div>
        </div>
        
        {/* Subject */}
        <div className="mb-4">
          <label 
            htmlFor="subject"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Subject
          </label>
          <input
            id="subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Brief description of your feedback"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            maxLength={100}
            required
          />
        </div>
        
        {/* Related To */}
        <div className="mb-4">
          <label 
            htmlFor="relatedTo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Related To (Optional)
          </label>
          <select
            id="relatedTo"
            name="relatedTo"
            value={formData.relatedTo}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a feature/area</option>
            <option value="dashboard">Dashboard</option>
            <option value="documents">Document Management</option>
            <option value="analytics">Analytics & Reporting</option>
            <option value="ai">AI Assistant</option>
            <option value="authentication">Authentication & User Management</option>
            <option value="ui">User Interface</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <label 
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={
              formData.type === 'issue' 
                ? 'Please describe the issue in detail. Include steps to reproduce if possible.' 
                : 'Please provide detailed feedback or suggestion.'
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            maxLength={2000}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.description.length}/2000 characters
          </p>
        </div>
        
        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
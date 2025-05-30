import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FeedbackForm, SuggestionForm } from '../../components/feedback';
import DashboardLayout from '../../components/layout/DashboardLayout';

/**
 * Feedback Dashboard Page
 * Displays all feedback and suggestions, with filtering and analytics
 */
const FeedbackDashboard = () => {
  // State for feedback data
  const [feedback, setFeedback] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [feedbackAnalytics, setFeedbackAnalytics] = useState(null);
  const [suggestionAnalytics, setSuggestionAnalytics] = useState(null);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('feedback');
  
  // State for filters
  const [feedbackFilters, setFeedbackFilters] = useState({
    category: '',
    rating: ''
  });
  
  const [suggestionFilters, setSuggestionFilters] = useState({
    category: '',
    status: '',
    implemented: ''
  });
  
  // Loading states
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  // Error states
  const [feedbackError, setFeedbackError] = useState('');
  const [suggestionError, setSuggestionError] = useState('');
  
  // Function to fetch feedback
  const fetchFeedback = async () => {
    try {
      setLoadingFeedback(true);
      setFeedbackError('');
      
      // Build query parameters
      const params = new URLSearchParams();
      if (feedbackFilters.category) params.append('category', feedbackFilters.category);
      if (feedbackFilters.rating) params.append('rating', feedbackFilters.rating);
      
      // Fetch feedback data
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/feedback?${params.toString()}`
      );
      
      setFeedback(response.data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setFeedbackError('Failed to load feedback data');
    } finally {
      setLoadingFeedback(false);
    }
  };
  
  // Function to fetch suggestions
  const fetchSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      setSuggestionError('');
      
      // Build query parameters
      const params = new URLSearchParams();
      if (suggestionFilters.category) params.append('category', suggestionFilters.category);
      if (suggestionFilters.status) params.append('status', suggestionFilters.status);
      if (suggestionFilters.implemented) params.append('implemented', suggestionFilters.implemented);
      
      // Fetch suggestions data
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/suggestions?${params.toString()}`
      );
      
      setSuggestions(response.data);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestionError('Failed to load suggestion data');
    } finally {
      setLoadingSuggestions(false);
    }
  };
  
  // Function to fetch analytics
  const fetchAnalytics = async () => {
    try {
      // Fetch feedback analytics
      const feedbackResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/feedback/analytics/summary`
      );
      
      setFeedbackAnalytics(feedbackResponse.data);
      
      // Fetch suggestion analytics
      const suggestionResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/suggestions/analytics/summary`
      );
      
      setSuggestionAnalytics(suggestionResponse.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };
  
  // Function to handle feedback filter changes
  const handleFeedbackFilterChange = (e) => {
    const { name, value } = e.target;
    setFeedbackFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Function to handle suggestion filter changes
  const handleSuggestionFilterChange = (e) => {
    const { name, value } = e.target;
    setSuggestionFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Function to handle upvoting a suggestion
  const handleUpvote = async (id) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/suggestions/${id}/upvote`
      );
      
      // Refetch suggestions to update the list
      fetchSuggestions();
    } catch (err) {
      console.error('Error upvoting suggestion:', err);
    }
  };
  
  // Function to handle marking a suggestion as implemented
  const handleMarkAsImplemented = async (id) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/suggestions/${id}/implement`
      );
      
      // Refetch suggestions to update the list
      fetchSuggestions();
    } catch (err) {
      console.error('Error marking suggestion as implemented:', err);
    }
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Load data on initial render and when filters change
  useEffect(() => {
    fetchFeedback();
  }, [feedbackFilters]);
  
  useEffect(() => {
    fetchSuggestions();
  }, [suggestionFilters]);
  
  // Load analytics on initial render
  useEffect(() => {
    fetchAnalytics();
  }, []);
  
  return (
    <DashboardLayout></DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Feedback & Suggestions Dashboard</h1>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Feedback Analytics */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Feedback Overview</h2>
          {feedbackAnalytics ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <span className="block text-sm text-gray-600">Total Feedback</span>
                <span className="text-xl font-bold">{feedbackAnalytics.totalCount}</span>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <span className="block text-sm text-gray-600">Average Rating</span>
                <span className="text-xl font-bold">{feedbackAnalytics.averageRating?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Loading analytics...</div>
          )}
        </div>
        
        {/* Suggestion Analytics */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Suggestion Overview</h2>
          {suggestionAnalytics ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-3 rounded">
                <span className="block text-sm text-gray-600">Total Suggestions</span>
                <span className="text-xl font-bold">{suggestionAnalytics.implementationRate?.total || 0}</span>
              </div>
              <div className="bg-indigo-50 p-3 rounded">
                <span className="block text-sm text-gray-600">Implementation Rate</span>
                <span className="text-xl font-bold">
                  {((suggestionAnalytics.implementationRate?.rate || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Loading analytics...</div>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex">
          <button
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'feedback'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('feedback')}
          >
            Feedback
          </button>
          <button
            className={`ml-8 py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'suggestions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('suggestions')}
          >
            Suggestions
          </button>
          <button
            className={`ml-8 py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'submit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('submit')}
          >
            Submit New
          </button>
        </nav>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'feedback' && (
        <div>
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Filter Feedback</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={feedbackFilters.category}
                  onChange={handleFeedbackFilterChange}
                  className="border border-gray-300 rounded-md w-full p-2"
                >
                  <option value="">All Categories</option>
                  <option value="general">General</option>
                  <option value="ui">User Interface</option>
                  <option value="performance">Performance</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select
                  name="rating"
                  value={feedbackFilters.rating}
                  onChange={handleFeedbackFilterChange}
                  className="border border-gray-300 rounded-md w-full p-2"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          </div>
          
          {feedbackError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {feedbackError}
            </div>
          )}
          
          {loadingFeedback ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-3 text-gray-600">Loading feedback...</p>
            </div>
          ) : feedback.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 text-gray-500 p-8 rounded-lg text-center">
              No feedback found. Adjust filters or submit new feedback.
            </div>
          ) : (
            <div className="space-y-4">
              {(feedback || []).map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                        {item.category}
                      </span>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star}
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill={star <= item.rating ? 'currentColor' : 'none'}
                            stroke={star <= item.rating ? 'none' : 'currentColor'}
                            className={`w-4 h-4 ${star <= item.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{item.content}</p>
                  {item.page_url && (
                    <div className="mt-2 text-xs text-gray-500">
                      Page: {item.page_url}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'suggestions' && (
        <div>
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Filter Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={suggestionFilters.category}
                  onChange={handleSuggestionFilterChange}
                  className="border border-gray-300 rounded-md w-full p-2"
                >
                  <option value="">All Categories</option>
                  <option value="feature">Feature Request</option>
                  <option value="improvement">Improvement</option>
                  <option value="integration">Integration</option>
                  <option value="optimization">Optimization</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={suggestionFilters.status}
                  onChange={handleSuggestionFilterChange}
                  className="border border-gray-300 rounded-md w-full p-2"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Implementation</label>
                <select
                  name="implemented"
                  value={suggestionFilters.implemented}
                  onChange={handleSuggestionFilterChange}
                  className="border border-gray-300 rounded-md w-full p-2"
                >
                  <option value="">All</option>
                  <option value="true">Implemented</option>
                  <option value="false">Not Implemented</option>
                </select>
              </div>
            </div>
          </div>
          
          {suggestionError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {suggestionError}
            </div>
          )}
          
          {loadingSuggestions ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-3 text-gray-600">Loading suggestions...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 text-gray-500 p-8 rounded-lg text-center">
              No suggestions found. Adjust filters or submit a new suggestion.
            </div>
          ) : (
            <div className="space-y-4">
       (suggestions || []).map((ons || []).map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex space-x-2 mb-2">
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {item.category}
                        </span>
                        <span className={`inline-block text-xs px-2 py-1 rounded ${
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'approved' ? 'bg-green-100 text-green-800' :
                          item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                        {item.implemented && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Implemented
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{item.content}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleUpvote(item.id)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="w-4 h-4 mr-1 text-blue-500"
                        >
                          <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                        </svg>
                        Upvote ({item.upvotes})
                      </button>
                    </div>
                    <div>
                      {!item.implemented && (
                        <button 
                          onClick={() => handleMarkAsImplemented(item.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Mark as Implemented
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'submit' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Submit Feedback<FeedbackForm 
              onSubmit={() =></FeedbackForm>   onSubmit={() => {
                // Refresh the feedback list after submission
                fetchFeedback();
                fetchAnalytics();
              }} 
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Su<SuggestionForm 
              onSubmit={() =></SuggestionForm>rm 
              onSubmit={() => {
                // Refresh the suggestion list after submission
                fetchSuggestions();
                fetchAnalytics();
              }} 
            />
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};

export default FeedbackDashboard;
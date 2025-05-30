import React, { useState, useEffect } from 'react';
import { useAIFeedback } from '../context/AIFeedbackContext';

/**
 * AI Feedback Dashboard Component for Admin
 * Shows feedback statistics, ratings, and suggestions
 */
const AIFeedbackDashboard = () => {
  const { 
    getAllFeedback, 
    getAllSuggestions, 
    getFeedbackStats, 
    updateSuggestionStatus,
    loading,
    error 
  } = useAIFeedback();
  
  // State for storing data
  const [feedback, setFeedback] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for filters
  const [feedbackFilters, setFeedbackFilters] = useState({
    context: '',
    minRating: '',
    maxRating: '',
    startDate: '',
    endDate: ''
  });
  
  const [suggestionFilters, setSuggestionFilters] = useState({
    category: '',
    status: '',
    priority: '',
    startDate: '',
    endDate: ''
  });
  
  // State for suggestion status update
  const [editingSuggestion, setEditingSuggestion] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({
    status: 'reviewing',
    adminComment: ''
  });
  
  /**
   * Load dashboard data on component mount
   */
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  /**
   * Fetch all dashboard data
   */
  const fetchDashboardData = async () => {
    try {
      const statsData = await getFeedbackStats();
      setStats(statsData);
      
      const feedbackData = await getAllFeedback();
      setFeedback(feedbackData);
      
      const suggestionsData = await getAllSuggestions();
      setSuggestions(suggestionsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };
  
  /**
   * Apply filters to feedback data
   */
  const applyFeedbackFilters = async () => {
    try {
      const filteredFeedback = await getAllFeedback(feedbackFilters);
      setFeedback(filteredFeedback);
    } catch (err) {
      console.error('Error filtering feedback data:', err);
    }
  };
  
  /**
   * Apply filters to suggestions data
   */
  const applySuggestionFilters = async () => {
    try {
      const filteredSuggestions = await getAllSuggestions(suggestionFilters);
      setSuggestions(filteredSuggestions);
    } catch (err) {
      console.error('Error filtering suggestions data:', err);
    }
  };
  
  /**
   * Reset feedback filters
   */
  const resetFeedbackFilters = () => {
    setFeedbackFilters({
      context: '',
      minRating: '',
      maxRating: '',
      startDate: '',
      endDate: ''
    });
    getAllFeedback();
  };
  
  /**
   * Reset suggestion filters
   */
  const resetSuggestionFilters = () => {
    setSuggestionFilters({
      category: '',
      status: '',
      priority: '',
      startDate: '',
      endDate: ''
    });
    getAllSuggestions();
  };
  
  /**
   * Update a suggestion's status
   */
  const handleUpdateSuggestionStatus = async () => {
    if (!editingSuggestion) return;
    
    try {
      const updatedSuggestion = await updateSuggestionStatus(
        editingSuggestion.id,
        statusUpdate
      );
      
      // Update the suggestion in the local state
      setSuggestions(prevSuggestions => 
        (prevSuggestions || []).map(suggestion => 
          suggestion.id === editingSuggestion.id ? updatedSuggestion : suggestion
        )
      );
      
      // Reset the editing state
      setEditingSuggestion(null);
      setStatusUpdate({
        status: 'reviewing',
        adminComment: ''
      });
    } catch (err) {
      console.error('Error updating suggestion status:', err);
    }
  };
  
  /**
   * Cancel editing a suggestion
   */
  const cancelEditSuggestion = () => {
    setEditingSuggestion(null);
    setStatusUpdate({
      status: 'reviewing',
      adminComment: ''
    });
  };
  
  /**
   * Format a date string
   * 
   * @param {string} dateString - The date string to format
   * @returns {string} - Formatted date string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  /**
   * Render statistics overview
   */
  const renderOverview = () => {
    if (!stats) {
      return <div className="p-4 text-center">Loading statistics...</div>;
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Feedback Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold">{stats.totalFeedback || 0}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold">{stats.averageRating?.toFixed(1) || 0}</p>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="text-yellow-400">
                    {star <= Math.round(stats.averageRating || 0) ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <h4 className="text-md font-semibold mt-6 mb-2">Rating Distribution</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = stats.ratingDistribution?.[rating] || 0;
              const percentage = stats.totalFeedback ? (count / stats.totalFeedback) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center">
                  <span className="w-12">{rating} ★</span>
                  <div className="flex-1 mx-2 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-500 h-4 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-16 text-right">{count} ({percentage.toFixed(1)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Feedback Metrics</h3>
          
          <h4 className="text-md font-semibold mt-2 mb-2">Helpfulness</h4>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-gray-600">Helpful</p>
              <p className="text-xl font-bold">{stats.helpfulDistribution?.helpful || 0}</p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-sm text-gray-600">Not Helpful</p>
              <p className="text-xl font-bold">{stats.helpfulDistribution?.unhelpful || 0}</p>
            </div>
          </div>
          
          <h4 className="text-md font-semibold mt-2 mb-2">Accuracy</h4>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-gray-600">Accurate</p>
              <p className="text-xl font-bold">{stats.accuracyDistribution?.accurate || 0}</p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-sm text-gray-600">Inaccurate</p>
              <p className="text-xl font-bold">{stats.accuracyDistribution?.inaccurate || 0}</p>
            </div>
          </div>
          
          <h4 className="text-md font-semibold mt-2 mb-2">Context Distribution</h4>
          <div className="space-y-2">
            {Object.entries(stats.contextDistribution || {}).map(([context, count]) => {
              const percentage = stats.totalFeedback ? (count / stats.totalFeedback) * 100 : 0;
              
              return (
                <div key={context} className="flex items-center">
                  <span className="w-24 truncate">{context}</span>
                  <div className="flex-1 mx-2 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-purple-500 h-4 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-16 text-right">{count} ({percentage.toFixed(1)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Feedback Over Time</h3>
          <div className="h-64">
            {stats.last7Days?.length > 0 ? (
              <div className="flex h-full items-end space-x-2">
         (stats.last7Days || []).map((ays || []).map(day => {
                  const height = day.count ? (day.coun(stats.last7Days || (s.last7Days || []).map((ays || []).map(d => d.count))) * 100 : 0;
                  
                  return (
                    <div key={day._id} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex justify-center items-end h-[85%]">
                        <div 
                          className="w-full bg-blue-500 rounded-t" 
                          style={{ height: `${height}%` }}
                          title={`${day.count} feedback(s)`}
                        >
                          <div className="h-1 w-full bg-yellow-400" style={{ 
                            position: 'relative', 
                            top: `${(day.averageRating / 5) * 100}%`,
                            display: day.count ? 'block' : 'none'
                          }}></div>
                        </div>
                      </div>
                      <div className="text-xs mt-1 w-full text-center truncate">
                        {new Date(day._id).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {day.count > 0 ? day.averageRating.toFixed(1) : '-'}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No recent data available
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Bars represent feedback count, yellow line indicates average rating
          </div>
        </div>
      </div>
    );
  };
  
  /**
   * Render feedback list with filters
   */
  const renderFeedbackList = () => {
    return (
      <div className="p-4">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Filter Feedback</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Context</label>
              <select
                value={feedbackFilters.context}
                onChange={(e) => setFeedbackFilters({ ...feedbackFilters, context: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Contexts</option>
                <option value="general">General</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="retail">Retail</option>
                <option value="ecommerce">E-commerce</option>
                <option value="saas">SaaS</option>
                <option value="franchising">Franchising</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
              <select
                value={feedbackFilters.minRating}
                onChange={(e) => setFeedbackFilters({ ...feedbackFilters, minRating: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1 ★</option>
                <option value="2">2 ★</option>
                <option value="3">3 ★</option>
                <option value="4">4 ★</option>
                <option value="5">5 ★</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Rating</label>
              <select
                value={feedbackFilters.maxRating}
                onChange={(e) => setFeedbackFilters({ ...feedbackFilters, maxRating: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1 ★</option>
                <option value="2">2 ★</option>
                <option value="3">3 ★</option>
                <option value="4">4 ★</option>
                <option value="5">5 ★</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={feedbackFilters.startDate}
                  onChange={(e) => setFeedbackFilters({ ...feedbackFilters, startDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="self-center">-</span>
                <input
                  type="date"
                  value={feedbackFilters.endDate}
                  onChange={(e) => setFeedbackFilters({ ...feedbackFilters, endDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={applyFeedbackFilters}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none disabled:opacity-50"
              >
                {loading ? 'Filtering...' : 'Apply Filters'}
              </button>
              <button
                onClick={resetFeedbackFilters}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h3 className="text-lg font-semibold p-4 border-b">Feedback List</h3>
          
          {loading ? (
            <div className="p-4 text-center">Loading feedback data...</div>
          ) : feedback.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No feedback found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Context</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Helpful</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accurate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-2(feedback || [])(feedback || [])(feedback || []).map((ack || []).map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star}>
                              {star <= item.rating ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.context}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.helpful === null ? (
                          <span className="text-gray-400">N/A</span>
                        ) : item.helpful ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.accurate === null ? (
                          <span className="text-gray-400">N/A</span>
                        ) : item.accurate ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {item.comments || <span className="text-gray-400 italic">No comments</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.created_at || item.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  /**
   * Render suggestions list with filters
   */
  const renderSuggestionsList = () => {
    return (
      <div className="p-4">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Filter Suggestions</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={suggestionFilters.category}
                onChange={(e) => setSuggestionFilters({ ...suggestionFilters, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="knowledge">Knowledge</option>
                <option value="accuracy">Accuracy</option>
                <option value="responsiveness">Responsiveness</option>
                <option value="user_experience">User Experience</option>
                <option value="new_feature">New Feature</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={suggestionFilters.status}
                onChange={(e) => setSuggestionFilters({ ...suggestionFilters, status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="implemented">Implemented</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={suggestionFilters.priority}
                onChange={(e) => setSuggestionFilters({ ...suggestionFilters, priority: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={suggestionFilters.startDate}
                  onChange={(e) => setSuggestionFilters({ ...suggestionFilters, startDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="self-center">-</span>
                <input
                  type="date"
                  value={suggestionFilters.endDate}
                  onChange={(e) => setSuggestionFilters({ ...suggestionFilters, endDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={applySuggestionFilters}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none disabled:opacity-50"
              >
                {loading ? 'Filtering...' : 'Apply Filters'}
              </button>
              <button
                onClick={resetSuggestionFilters}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h3 className="text-lg font-semibold p-4 border-b">Suggestions List</h3>
          
          {loading ? (
            <div className="p-4 text-center">Loading suggestions data...</div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No suggestions found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggestion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divid(suggestions || (suggestions || (suggestions || (suggestions || []).map(ons.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {item.suggestion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${item.priority === 'critical' ? 'bg-red-100 text-red-800' : 
                            item.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
                            item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${item.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                            item.status === 'reviewing' ? 'bg-purple-100 text-purple-800' : 
                            item.status === 'implemented' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.created_at || item.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingSuggestion(item);
                            setStatusUpdate({
                              status: item.status,
                              adminComment: item.admin_comment || ''
                            });
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render the edit suggestion modal
  const renderEditSuggestionModal = () => {
    if (!editingSuggestion) return null;
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Update Suggestion Status
                  </h3>
                  <div className="mt-2">
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Category:</span> {editingSuggestion.category}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-semibold">Suggestion:</span> {editingSuggestion.suggestion}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={statusUpdate.status}
                        onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="implemented">Implemented</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admin Comment
                      </label>
                      <textarea
                        value={statusUpdate.adminComment}
                        onChange={(e) => setStatusUpdate({ ...statusUpdate, adminComment: e.target.value })}
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add an optional comment..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleUpdateSuggestionStatus}
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>
              <button
                type="button"
                onClick={cancelEditSuggestion}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">AI Feedback Dashboard</h1>
        
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'feedback'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Feedback List
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'suggestions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Suggestions
              </button>
            </nav>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'feedback' && renderFeedbackList()}
        {activeTab === 'suggestions' && renderSuggestionsList()}
        
        {renderEditSuggestionModal()}
      </div>
    </div>
  );
};

export default AIFeedbackDashboard;
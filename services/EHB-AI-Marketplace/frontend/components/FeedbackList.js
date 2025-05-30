import React, { useEffect } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { useAuth } from '../context/AuthContext';

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'under-review':
        return 'bg-purple-100 text-purple-800';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-teal-100 text-teal-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'under-review':
        return 'Under Review';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {getStatusText()}
    </span>
  );
};

// Type badge component
const TypeBadge = ({ type }) => {
  const getTypeColor = () => {
    switch (type) {
      case 'feedback':
        return 'bg-blue-100 text-blue-800';
      case 'suggestion':
        return 'bg-green-100 text-green-800';
      case 'issue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor()}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

/**
 * Feedback List Component
 * Displays a list of feedback items, can be filtered to show all feedback or just the user's
 */
const FeedbackList = ({ showAll = false }) => {
  const { user, isAuthenticated } = useAuth();
  const { 
    feedbackItems, 
    myFeedback, 
    loading, 
    error, 
    getAllFeedback, 
    getMyFeedback 
  } = useFeedback();
  
  // Load feedback on component mount
  useEffect(() => {
    if (isAuthenticated) {
      if (showAll && user?.isAdmin) {
        getAllFeedback();
      } else {
        getMyFeedback();
      }
    }
  }, [isAuthenticated, showAll, user, getAllFeedback, getMyFeedback]);
  
  // Determine which feedback list to display
  const feedbackToDisplay = showAll && user?.isAdmin ? feedbackItems : myFeedback;
  
  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Handle error
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  // Handle empty state
  if (!feedbackToDisplay || feedbackToDisplay.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">
          {showAll 
            ? 'No feedback has been submitted yet.' 
            : 'You have not submitted any feedback yet.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {(feedbackToDisplay || []).map((item) => (
        <div key={item._id || item.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-900">{item.subject}</h3>
              <div className="flex space-x-2">
                <TypeBadge type={item.type} /></TypeBadge>
    <StatusBadge status={item.status} /></StatusBadge>m.status} />
                {item.relatedTo && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.relatedTo}
                  </span>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-500">{formatDate(item.createdAt)}</span>
          </div>
          
          <p className="text-gray-700 whitespace-pre-wrap mb-3">{item.description}</p>
          
          {item.adminResponse && (
            <div className="mt-3 border-t pt-3">
              <p className="text-sm font-medium text-gray-900">Admin Response:</p>
              <p className="text-gray-700 mt-1">{item.adminResponse}</p>
            </div>
          )}
          
          <div className="mt-3 flex justify-between items-center text-sm">
            <div className="flex items-center">
              <span className="text-gray-500">
                {item.upvotes} {item.upvotes === 1 ? 'upvote' : 'upvotes'}
              </span>
            </div>
            
            {/* Only admins can see who submitted the feedback in "all" view */}
            {showAll && user?.isAdmin && item.userId && (
              <span className="text-gray-500">
                Submitted by: {item.userId.name || 'Anonymous'}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
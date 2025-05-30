import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// Import FeedbackContext but we'll use defensive programming when accessing it
import { useFeedback } from '../context/FeedbackContext';
import { useHelp } from '../context/HelpContext';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';
import WithHelp from '../components/WithHelp';

/**
 * Feedback Page
 * Allows users to submit and view feedback
 */
export default function FeedbackPage() {
  // Initialize auth context with defensive programming
  let isAuthenticated = false;
  let user = null;
  try {
    const authContext = useAuth();
    if (authContext) {
      isAuthenticated = authContext.isAuthenticated || false;
      user = authContext.user || null;
    }
  } catch (err) {
    console.error("Error getting auth context:", err);
  }
  const [activeTab, setActiveTab] = useState('submit');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  // Handle feedback submission success
  const handleFeedbackSuccess = () => {
    setFeedbackSubmitted(true);
    // Switch to the "My Feedback" tab after successful submission
    setActiveTab('my');
  };
  
  // Reset feedback submitted state when changing tabs
  useEffect(() => {
    setFeedbackSubmitted(false);
  }, [activeTab]);
  
  // Initialize help context with defensive programming
  let showContextualHelp = () => console.log("Help not available");
  try {
    const helpContext = useHelp();
    if (helpContext && typeof helpContext.showContextualHelp === 'function') {
      showContextualHelp = helpContext.showContextualHelp;
    }
  } catch (err) {
    console.error("Error getting help context:", err);
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <WithHelp 
        context="feedback" 
        query="What is the feedback system used for?"
        position="bottom-right"
      ></WithHelp>
        <h1 className="text-3xl font-bold mb-8">Feedback & Suggestions</h1>
      </WithHelp>
      
      {isAuthenticated ? (
        <>
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('submit')}
              className={`py-2 px-4 font-medium ${
                activeTab === 'submit'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Submit Feedback
            </button>
            
            <button
              onClick={() => setActiveTab('my')}
              className={`py-2 px-4 font-medium ${
                activeTab === 'my'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Feedback
            </button>
            
            {user?.isAdmin && (
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-4 font-medium ${
                  activeTab === 'all'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Feedback
              </button>
            )}
          </div>
          
          {/* Active Tab Content */}
          <div className="mt-6">
            {activeTab === 'submit' && (
              <>
     <WithHelp
                  context="feedback-submit"
                  query="How do I submit effective feedback?"
                  position="top-right"
                  icon="info"
                ></WithHelp>          >
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">Submit New Feedback</h2>
                    <p className="text-gray-600">Share your thoughts, suggestions, or report issues you've encountered.</p>
                  </div>
                </With<FeedbackForm onSuccess={handleFeedbackSuccess} /></FeedbackForm>dleFeedbackSuccess} />
              </>
            )}
            
            {activeTab === 'my' &<WithHelp
                  context="feedback-history"
                  query="How can I track my submitted feedback?"
                  position="top-right"
                  icon="info"
                ></WithHelp>        icon="info"
                >
                  <h2 className="text-xl font-semibold mb-4">My Feedback</h2>
                </WithHelp>
                {feedbackSubmitted && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">
                      Your feedback has been submitted successfully. Thank you!
                    </span>
            <FeedbackList showAll={false} /></FeedbackList>                <FeedbackList showAll={false} /></FeedbackList>
              </>
            )}
            
            {activeTab ==<WithHelp
                  context="feedback-admin"
                  query="How can I manage user feedback as an admin?"
                  position="top-right"
                  icon="info"
                ></WithHelp>ion="top-right"
                  icon="info"
                >
                  <h2 className="text-xl font-sem<FeedbackList showAll={true} /></FeedbackList>               </WithHelp>
 <FeedbackList showAll={true} /></FeedbackList>owAll={true} />
              </>
            )}
          </div>
        </>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Please log in to submit and view feedback.</p>
        </div>
      )}
      
      {/* Global Help Button */}
      <div className="fixed bottom-5 right-5">
        <button
          onClick={() => showContextualHelp('feedback-guide', 'How does the entire feedback system work?')}
          className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors focus:outline-none"
          aria-label="Get help about feedback system"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
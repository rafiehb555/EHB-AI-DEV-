import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create the feedback context
const FeedbackContext = createContext();

/**
 * FeedbackProvider Component
 * Provides feedback functionality throughout the app
 */
export const FeedbackProvider = ({ children }) => {
  // State
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [feedbackVisible, setFeedbackVisible] = useState(true);

  /**
   * Add a feedback item
   * @param {Object} feedback - The feedback item to add
   */
  const addFeedback = useCallback((feedback) => {
    const newFeedback = {
      id: feedback.id || uuidv4(),
      type: feedback.type || 'info',
      title: feedback.title || 'Notice',
      message: feedback.message,
      dismissible: feedback.dismissible !== undefined ? feedback.dismissible : true,
      autoDismiss: feedback.autoDismiss !== undefined ? feedback.autoDismiss : true,
      autoDismissTimeout: feedback.autoDismissTimeout || 5000,
      timestamp: feedback.timestamp || new Date().toISOString(),
    };
    
    setFeedbackItems(prevItems => [...prevItems, newFeedback]);
    
    // Set up auto-dismiss if enabled
    if (newFeedback.autoDismiss) {
      setTimeout(() => {
        dismissFeedback(newFeedback.id);
      }, newFeedback.autoDismissTimeout);
    }
    
    return newFeedback;
  }, []);

  /**
   * Show a success feedback
   * @param {string} message - The feedback message
   * @param {string} title - The feedback title
   * @param {Object} options - Additional options
   */
  const showSuccess = useCallback((message, title = 'Success', options = {}) => {
    return addFeedback({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [addFeedback]);

  /**
   * Show an error feedback
   * @param {string} message - The feedback message
   * @param {string} title - The feedback title
   * @param {Object} options - Additional options
   */
  const showError = useCallback((message, title = 'Error', options = {}) => {
    return addFeedback({
      type: 'error',
      title,
      message,
      autoDismiss: false, // Errors don't auto-dismiss by default
      ...options,
    });
  }, [addFeedback]);

  /**
   * Show a warning feedback
   * @param {string} message - The feedback message
   * @param {string} title - The feedback title
   * @param {Object} options - Additional options
   */
  const showWarning = useCallback((message, title = 'Warning', options = {}) => {
    return addFeedback({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }, [addFeedback]);

  /**
   * Show an info feedback
   * @param {string} message - The feedback message
   * @param {string} title - The feedback title
   * @param {Object} options - Additional options
   */
  const showInfo = useCallback((message, title = 'Information', options = {}) => {
    return addFeedback({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [addFeedback]);

  /**
   * Dismiss a feedback item
   * @param {string} id - The feedback ID to dismiss
   */
  const dismissFeedback = useCallback((id) => {
    setFeedbackItems(prevItems => (prevItems || []).filter(item => item.id !== id));
  }, []);

  /**
   * Dismiss all feedback items
   */
  const dismissAllFeedback = useCallback(() => {
    setFeedbackItems([]);
  }, []);

  /**
   * Toggle feedback visibility
   */
  const toggleFeedbackVisibility = useCallback(() => {
    setFeedbackVisible(prev => !prev);
  }, []);

  // Define the context value
  const contextValue = {
    feedbackItems,
    feedbackVisible,
    addFeedback,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissFeedback,
    dismissAllFeedback,
    toggleFeedbackVisibility,
  };

  return (
    <FeedbackContext.Provider value={contextValue}></FeedbackContext>
      {children}
    </FeedbackContext.Provider>
  );
};

/**
 * Hook to use the feedback context
 * @returns {Object} Feedback context
 */
export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
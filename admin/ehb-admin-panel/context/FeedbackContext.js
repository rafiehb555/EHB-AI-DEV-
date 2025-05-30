import React, { createContext, useContext, useState } from 'react';

// Create a context for feedback
const FeedbackContext = createContext();

/**
 * FeedbackProvider Component
 * 
 * Provides feedback state and actions for the entire application.
 * Manages toast notifications, alert dialogs, and other user feedback mechanisms.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const FeedbackProvider = ({ children }) => {
  // State for toasts (non-blocking notifications)
  const [toasts, setToasts] = useState([]);
  
  // State for alert dialog (blocking notification)
  const [alertDialog, setAlertDialog] = useState(null);
  
  // State for confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  // Add a toast notification
  const addToast = (toast) => {
    const id = Date.now();
    const newToast = {
      id,
      type: toast.type || 'info',
      title: toast.title || '',
      message: toast.message || '',
      duration: toast.duration || 5000,
      ...toast,
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-dismiss toast after duration
    setTimeout(() => {
      dismissToast(id);
    }, newToast.duration);
    
    return id;
  };
  
  // Convenience methods for different toast types
  const showSuccessToast = (title, message, options = {}) => {
    return addToast({
      type: 'success',
      title,
      message,
      ...options,
    });
  };
  
  const showErrorToast = (title, message, options = {}) => {
    return addToast({
      type: 'error',
      title,
      message,
      duration: 8000, // Error toasts show longer by default
      ...options,
    });
  };
  
  const showInfoToast = (title, message, options = {}) => {
    return addToast({
      type: 'info',
      title,
      message,
      ...options,
    });
  };
  
  const showWarningToast = (title, message, options = {}) => {
    return addToast({
      type: 'warning',
      title,
      message,
      ...options,
    });
  };
  
  // Dismiss a toast
  const dismissToast = (id) => {
    setToasts(prev => (prev || []).filter(toast => toast.id !== id));
  };
  
  // Show an alert dialog
  const showAlert = (options) => {
    return new Promise(resolve => {
      const dialog = {
        title: options.title || 'Alert',
        message: options.message || '',
        type: options.type || 'info',
        onClose: () => {
          setAlertDialog(null);
          resolve();
        },
      };
      
      setAlertDialog(dialog);
    });
  };
  
  // Show a confirmation dialog
  const showConfirm = (options) => {
    return new Promise(resolve => {
      const dialog = {
        title: options.title || 'Confirm',
        message: options.message || 'Are you sure?',
        type: options.type || 'question',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        onConfirm: () => {
          setConfirmDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        },
      };
      
      setConfirmDialog(dialog);
    });
  };
  
  // Create the context value object with state and functions
  const contextValue = {
    toasts,
    alertDialog,
    confirmDialog,
    addToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    dismissToast,
    showAlert,
    showConfirm,
  };
  
  return (
    <FeedbackContext.Provider value={contextValue}></FeedbackContext>
      {children}
      
      {/* Toast Container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
   (toasts || []).map((sts || []).map(toast => (
            <div
              key={toast.id}
              className={`p-4 rounded-lg shadow-lg transition-all duration-300 max-w-md ${getToastBgClass(toast.type)}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {getToastIcon(toast.type)}
                </div>
                <div className="flex-1">
                  {toast.title && (
                    <h3 className={`text-sm font-medium ${getToastTextClass(toast.type)}`}>
                      {toast.title}
                    </h3>
                  )}
                  <p className={`text-sm ${getToastTextClass(toast.type, true)}`}>
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className={`ml-4 text-${toast.type === 'info' ? 'gray' : toast.type}-400 hover:text-${toast.type === 'info' ? 'gray' : toast.type}-500`}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Alert Dialog */}
      {alertDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="px-6 py-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {getAlertIcon(alertDialog.type)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{alertDialog.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{alertDialog.message}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 flex justify-end">
              <button
                onClick={alertDialog.onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="px-6 py-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {getAlertIcon(confirmDialog.type)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{confirmDialog.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{confirmDialog.message}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={confirmDialog.onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {confirmDialog.cancelText}
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
};

// Helper functions for toast styling
const getToastBgClass = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-50';
    case 'error':
      return 'bg-red-50';
    case 'warning':
      return 'bg-yellow-50';
    case 'info':
    default:
      return 'bg-blue-50';
  }
};

const getToastTextClass = (type, isBody = false) => {
  const intensity = isBody ? '600' : '800';
  switch (type) {
    case 'success':
      return `text-green-${intensity}`;
    case 'error':
      return `text-red-${intensity}`;
    case 'warning':
      return `text-yellow-${intensity}`;
    case 'info':
    default:
      return `text-blue-${intensity}`;
  }
};

const getToastIcon = (type) => {
  switch (type) {
    case 'success':
      return (
        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'error':
      return (
        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    case 'warning':
      return (
        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'info':
    default:
      return (
        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
  }
};

const getAlertIcon = (type) => {
  switch (type) {
    case 'success':
      return (
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    case 'error':
      return (
        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    case 'warning':
      return (
        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
          <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      );
    case 'question':
      return (
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    case 'info':
    default:
      return (
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
  }
};

// Custom hook for using the feedback context
export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export default FeedbackContext;
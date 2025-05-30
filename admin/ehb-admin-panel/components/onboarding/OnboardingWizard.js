import React, { useState, useEffect } from 'react';

const OnboardingWizard = ({ 
  visible, 
  onComplete, 
  onSkip,
  userRole = 'admin'
}) => {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    prefersDarkMode: false,
    notificationPreferences: {
      email: true,
      inApp: true, 
      walletActivity: true,
      updates: true,
      adminAlerts: userRole === 'admin',
    },
    dashboardWidgets: {
      walletSummary: true,
      transactionHistory: true,
      marketPrices: true,
      securityAlerts: true,
      systemHealth: userRole === 'admin',
    },
  });
  
  // Define steps based on role
  const steps = [
    {
      title: 'Welcome to EHB Admin Panel',
      subtitle: 'Let\'s get you set up in just a few steps',
      content: ({ next }) => (
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to EHB Admin Panel</h3>
          <p className="text-gray-600 mb-6">
            This quick onboarding wizard will help you set up your preferences and introduce you to the key features of the admin panel.
          </p>
          <button
            onClick={next}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Started
          </button>
          <button
            onClick={onSkip}
            className="mt-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Skip for now
          </button>
        </div>
      ),
    },
    {
      title: 'Customize Your Experience',
      subtitle: 'Set your preferences for the admin panel',
      content: ({ next, back }) => (
        <div>
          <div className="space-y-4 mb-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.prefersDarkMode}
                  onChange={(e) => setFormData({
                    ...formData,
                    prefersDarkMode: e.target.checked,
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Enable Dark Mode</span>
              </label>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Notification Preferences</h4>
              <div className="space-y-2 ml-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notificationPreferences.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      notificationPreferences: {
                        ...formData.notificationPreferences,
                        email: e.target.checked,
                      },
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Email Notifications</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notificationPreferences.inApp}
                    onChange={(e) => setFormData({
                      ...formData,
                      notificationPreferences: {
                        ...formData.notificationPreferences,
                        inApp: e.target.checked,
                      },
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">In-App Notifications</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notificationPreferences.walletActivity}
                    onChange={(e) => setFormData({
                      ...formData,
                      notificationPreferences: {
                        ...formData.notificationPreferences,
                        walletActivity: e.target.checked,
                      },
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Wallet Activity</span>
                </label>
                
                {userRole === 'admin' && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notificationPreferences.adminAlerts}
                      onChange={(e) => setFormData({
                        ...formData,
                        notificationPreferences: {
                          ...formData.notificationPreferences,
                          adminAlerts: e.target.checked,
                        },
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">System Alerts</span>
                  </label>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={back}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              onClick={next}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Customize Your Dashboard',
      subtitle: 'Choose which widgets to display on your dashboard',
      content: ({ next, back }) => (
        <div>
          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Dashboard Widgets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.dashboardWidgets.walletSummary}
                  onChange={(e) => setFormData({
                    ...formData,
                    dashboardWidgets: {
                      ...formData.dashboardWidgets,
                      walletSummary: e.target.checked,
                    },
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Wallet Summary</span>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.dashboardWidgets.transactionHistory}
                  onChange={(e) => setFormData({
                    ...formData,
                    dashboardWidgets: {
                      ...formData.dashboardWidgets,
                      transactionHistory: e.target.checked,
                    },
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Transaction History</span>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.dashboardWidgets.marketPrices}
                  onChange={(e) => setFormData({
                    ...formData,
                    dashboardWidgets: {
                      ...formData.dashboardWidgets,
                      marketPrices: e.target.checked,
                    },
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Market Prices</span>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.dashboardWidgets.securityAlerts}
                  onChange={(e) => setFormData({
                    ...formData,
                    dashboardWidgets: {
                      ...formData.dashboardWidgets,
                      securityAlerts: e.target.checked,
                    },
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Security Alerts</span>
              </label>
              
              {userRole === 'admin' && (
                <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.dashboardWidgets.systemHealth}
                    onChange={(e) => setFormData({
                      ...formData,
                      dashboardWidgets: {
                        ...formData.dashboardWidgets,
                        systemHealth: e.target.checked,
                      },
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">System Health</span>
                </label>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={back}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              onClick={next}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Ready to Go!',
      subtitle: 'Your admin panel is now set up',
      content: ({ back }) => (
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">You're All Set!</h3>
          <p className="text-gray-600 mb-6">
            Your preferences have been saved. You can change them anytime from your account settings.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={back}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              onClick={() => handleComplete()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Get Started
            </button>
          </div>
        </div>
      ),
    },
  ];
  
  // Update progress when step changes
  useEffect(() => {
    const newProgress = ((currentStep + 1) / steps.length) * 100;
    setProgress(newProgress);
  }, [currentStep, steps.length]);
  
  // Navigate to next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle wizard completion
  const handleComplete = () => {
    setExiting(true);
    
    // Simulate API call to save preferences
    setTimeout(() => {
      if (onComplete) {
        onComplete(formData);
      }
    }, 300);
  };
  
  // If not visible, don't render
  if (!visible) {
    return null;
  }
  
  const currentStepData = steps[currentStep];
  
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${exiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Progress indicator */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-1 bg-blue-600 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{currentStepData.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{currentStepData.subtitle}</p>
        </div>
        
        {/* Content */}
        <div className="px-6 py-5">
          {currentStepData.content({
            next: nextStep,
            back: prevStep,
            data: formData,
            setData: setFormData,
          })}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
          <div>Step {currentStep + 1} of {steps.length}</div>
          <button 
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-900"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
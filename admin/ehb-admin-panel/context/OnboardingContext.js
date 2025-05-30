import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for onboarding
const OnboardingContext = createContext();

/**
 * OnboardingProvider Component
 * 
 * Provides onboarding state and actions for the entire application.
 * Manages which onboarding steps have been completed and which tutorials are available.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const OnboardingProvider = ({ children }) => {
  // State for onboarding
  const [onboardingStatus, setOnboardingStatus] = useState({
    hasCompletedOnboarding: false,
    onboardingStep: 0,
    showWizard: false,
    tutorialStatus: {},
  });
  
  // Load onboarding status on mount
  useEffect(() => {
    // In a real app, this would be loaded from an API or localStorage
    const loadOnboardingStatus = async () => {
      try {
        // Simulate API call or localStorage read
        const storedStatus = localStorage.getItem('onboardingStatus');
        
        if (storedStatus) {
          setOnboardingStatus(JSON.parse(storedStatus));
        } else {
          // Default status for new users
          const defaultStatus = {
            hasCompletedOnboarding: false,
            onboardingStep: 0,
            showWizard: true,
            tutorialStatus: {
              dashboard: { completed: false, viewed: false },
              walletCreate: { completed: false, viewed: false },
              transactions: { completed: false, viewed: false },
            },
          };
          
          setOnboardingStatus(defaultStatus);
          localStorage.setItem('onboardingStatus', JSON.stringify(defaultStatus));
        }
      } catch (error) {
        console.error('Error loading onboarding status:', error);
      }
    };
    
    loadOnboardingStatus();
  }, []);
  
  // Save onboarding status whenever it changes
  useEffect(() => {
    localStorage.setItem('onboardingStatus', JSON.stringify(onboardingStatus));
  }, [onboardingStatus]);
  
  // Start the onboarding wizard
  const startOnboarding = () => {
    setOnboardingStatus(prev => ({
      ...prev,
      showWizard: true,
      onboardingStep: 0,
    }));
  };
  
  // Complete the onboarding wizard
  const completeOnboarding = (preferences) => {
    setOnboardingStatus(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      showWizard: false,
      preferences,
    }));
  };
  
  // Skip the onboarding wizard
  const skipOnboarding = () => {
    setOnboardingStatus(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      showWizard: false,
    }));
  };
  
  // Start a specific tutorial
  const startTutorial = (tutorialId) => {
    setOnboardingStatus(prev => ({
      ...prev,
      activeTutorial: tutorialId,
      tutorialStatus: {
        ...prev.tutorialStatus,
        [tutorialId]: {
          ...prev.tutorialStatus[tutorialId],
          viewed: true,
        },
      },
    }));
  };
  
  // Complete a tutorial
  const completeTutorial = (tutorialId) => {
    setOnboardingStatus(prev => ({
      ...prev,
      activeTutorial: null,
      tutorialStatus: {
        ...prev.tutorialStatus,
        [tutorialId]: {
          viewed: true,
          completed: true,
        },
      },
    }));
  };
  
  // Skip a tutorial
  const skipTutorial = (tutorialId) => {
    setOnboardingStatus(prev => ({
      ...prev,
      activeTutorial: null,
      tutorialStatus: {
        ...prev.tutorialStatus,
        [tutorialId]: {
          ...prev.tutorialStatus[tutorialId],
          viewed: true,
        },
      },
    }));
  };
  
  // Check if a tutorial has been completed
  const isTutorialCompleted = (tutorialId) => {
    return onboardingStatus.tutorialStatus[tutorialId]?.completed || false;
  };
  
  // Reset all onboarding and tutorial progress (for testing)
  const resetOnboarding = () => {
    const defaultStatus = {
      hasCompletedOnboarding: false,
      onboardingStep: 0,
      showWizard: true,
      tutorialStatus: {
        dashboard: { completed: false, viewed: false },
        walletCreate: { completed: false, viewed: false },
        transactions: { completed: false, viewed: false },
      },
    };
    
    setOnboardingStatus(defaultStatus);
    localStorage.setItem('onboardingStatus', JSON.stringify(defaultStatus));
  };
  
  // Create the context value object with state and functions
  const contextValue = {
    ...onboardingStatus,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    startTutorial,
    completeTutorial,
    skipTutorial,
    isTutorialCompleted,
    resetOnboarding,
  };
  
  return (
    <OnboardingContext.Provider value={contextValue}></OnboardingContext>
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom hook for using the onboarding context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export default OnboardingContext;
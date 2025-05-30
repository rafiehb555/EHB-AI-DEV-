import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Onboarding Context
 * 
 * Provides state and functionality for the AI-powered onboarding wizard
 */

// Create context
const OnboardingContext = createContext();

/**
 * Onboarding Provider Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider component
 */
export const OnboardingProvider = ({ children }) => {
  // State for onboarding flow
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [onboardingSteps, setOnboardingSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [aiGuidance, setAiGuidance] = useState(null);
  const [userResponses, setUserResponses] = useState({});
  const [userPreferences, setUserPreferences] = useState(null);

  // Default steps if API call fails
  const defaultSteps = [
    {
      id: 'welcome',
      title: 'Welcome to EHB System',
      description: 'Welcome to the Enterprise Hybrid Blockchain System. This wizard will help you get started with the platform.',
      type: 'information',
      required: false
    },
    {
      id: 'role',
      title: 'What is your role?',
      description: 'Select your role to customize your dashboard experience.',
      type: 'selection',
      required: true,
      options: [
        {
          id: 'buyer',
          label: 'Buyer',
          description: 'I want to purchase products and services'
        },
        {
          id: 'seller',
          label: 'Seller', 
          description: 'I want to sell products and services'
        },
        {
          id: 'admin',
          label: 'Admin',
          description: 'I manage the platform'
        }
      ]
    },
    {
      id: 'interests',
      title: 'What are you interested in?',
      description: 'Select all areas you\'re interested in to customize your experience.',
      type: 'multi-selection',
      required: true,
      options: [
        {
          id: 'blockchain',
          label: 'Blockchain Technology',
          description: 'Learn about our blockchain implementation'
        },
        {
          id: 'wallet',
          label: 'Wallet Management',
          description: 'Manage digital assets and currencies'
        },
        {
          id: 'marketplace',
          label: 'Marketplace',
          description: 'Buy and sell products and services'
        },
        {
          id: 'analytics',
          label: 'Analytics',
          description: 'Track performance and insights'
        }
      ]
    },
    {
      id: 'feedback',
      title: 'Any initial thoughts?',
      description: 'Please share any thoughts, questions or feedback you have about the platform.',
      type: 'text-input',
      required: false,
      placeholder: 'Type your feedback here...'
    },
    {
      id: 'complete',
      title: 'All Set!',
      description: 'Thank you for completing the onboarding process. Your preferences have been saved, and your dashboard has been customized accordingly.',
      type: 'information',
      required: false
    }
  ];

  /**
   * Check if the user has completed onboarding
   */
  useEffect(() => {
    const hasCompleted = localStorage.getItem('ehb:onboarding:complete') === 'true';
    setIsComplete(hasCompleted);

    // Load saved preferences if they exist
    const savedPreferences = localStorage.getItem('ehb:user:preferences');
    if (savedPreferences) {
      try {
        setUserPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    }
  }, []);

  /**
   * Fetch or generate an onboarding flow for the user
   */
  const fetchOnboardingFlow = useCallback(async (options = {}) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to get a personalized onboarding flow
      const response = await fetch('/api/onboarding/flow');
      
      if (!response.ok) {
        throw new Error('Failed to fetch onboarding flow');
      }
      
      const data = await response.json();
      
      if (data && data.steps && data.steps.length > 0) {
        setOnboardingSteps(data.steps);
      } else {
        // Use default steps if the API doesn't return steps
        setOnboardingSteps(defaultSteps);
      }
    } catch (error) {
      console.error('Error getting onboarding flow:', error);
      // Use default steps if there's an error
      setOnboardingSteps(defaultSteps);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Generate a new personalized onboarding flow
   */
  const generateOnboardingFlow = useCallback(async (userData) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to generate a personalized flow
      const response = await fetch('/api/onboarding/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate onboarding flow');
      }
      
      const data = await response.json();
      
      if (data && data.steps && data.steps.length > 0) {
        setOnboardingSteps(data.steps);
      } else {
        // Use default steps if the API doesn't return steps
        setOnboardingSteps(defaultSteps);
      }
    } catch (error) {
      console.error('Error generating onboarding flow:', error);
      // Use default steps if there's an error
      setOnboardingSteps(defaultSteps);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Start the onboarding process
   */
  const startOnboarding = useCallback(async (options = {}) => {
    // Reset state
    setCurrentStepIndex(0);
    setUserResponses({});
    setIsOnboarding(true);
    
    // Check if we have a specific tutorial or flow to load
    if (options.tutorialId) {
      // In a real app, you'd load a specific tutorial here
      await fetchOnboardingFlow({ tutorialId: options.tutorialId });
    } else {
      // Otherwise, load the general onboarding flow
      await fetchOnboardingFlow();
    }
  }, [fetchOnboardingFlow]);

  /**
   * End the onboarding process without completing it
   */
  const skipOnboarding = useCallback(() => {
    setIsOnboarding(false);
  }, []);

  /**
   * Complete the onboarding process
   */
  const completeOnboarding = useCallback(() => {
    // Save completion status
    localStorage.setItem('ehb:onboarding:complete', 'true');
    
    // Process and save user preferences
    const newPreferences = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    
    // Extract role from responses
    if (userResponses.role) {
      newPreferences.role = userResponses.role;
    }
    
    // Extract interests from responses
    if (userResponses.interests && Array.isArray(userResponses.interests)) {
      newPreferences.interests = userResponses.interests;
    }
    
    // Save the preferences
    localStorage.setItem('ehb:user:preferences', JSON.stringify(newPreferences));
    setUserPreferences(newPreferences);
    
    // Update state
    setIsComplete(true);
    setIsOnboarding(false);
    
    // In a real app, you would also send the preferences to the server
    // to be saved in the user's profile
  }, [userResponses]);

  /**
   * Move to the next step in the onboarding flow
   */
  const nextStep = useCallback(() => {
    if (currentStepIndex < onboardingSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // If we're at the last step, complete the onboarding
      completeOnboarding();
    }
  }, [currentStepIndex, onboardingSteps.length, completeOnboarding]);

  /**
   * Move to the previous step in the onboarding flow
   */
  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  /**
   * Get the current step
   * @returns {Object|null} Current step or null if no steps
   */
  const getCurrentStep = useCallback(() => {
    if (onboardingSteps.length === 0 || currentStepIndex >= onboardingSteps.length) {
      return null;
    }
    
    return onboardingSteps[currentStepIndex];
  }, [onboardingSteps, currentStepIndex]);

  /**
   * Submit a response to the current step
   * @param {Object} response - User's response to the current step
   */
  const submitStepResponse = useCallback(async (response) => {
    const currentStep = getCurrentStep();
    
    if (!currentStep) {
      return;
    }
    
    // Add the response to the userResponses object
    setUserResponses(prev => ({
      ...prev,
      [currentStep.id]: response
    }));
    
    // In a real app, you might want to send this response to the server
    // to get AI-guided feedback
    try {
      const aiResponse = await fetch('/api/onboarding/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stepId: currentStep.id,
          response
        }),
      });
      
      if (aiResponse.ok) {
        const data = await aiResponse.json();
        
        if (data && data.guidance) {
          setAiGuidance(data.guidance);
        }
      }
    } catch (error) {
      console.error('Error getting AI guidance:', error);
    }
    
    // Move to the next step
    nextStep();
  }, [getCurrentStep, nextStep]);

  // Memoized context value
  const contextValue = {
    isOnboarding,
    isLoading,
    isComplete,
    onboardingSteps,
    currentStepIndex,
    aiGuidance,
    userResponses,
    userPreferences,
    startOnboarding,
    skipOnboarding,
    completeOnboarding,
    nextStep,
    prevStep,
    getCurrentStep,
    submitStepResponse,
  };

  return (
    <OnboardingContext.Provider value={contextValue}></OnboardingContext>
      {children}
    </OnboardingContext.Provider>
  );
};

/**
 * Hook to use the onboarding context
 * @returns {Object} Onboarding context value
 */
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
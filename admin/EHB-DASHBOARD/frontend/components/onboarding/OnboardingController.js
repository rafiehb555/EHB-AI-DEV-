/**
 * Onboarding Controller Component
 * 
 * Manages the logic for when to display the onboarding wizard
 * based on user state and application context.
 */

import React, { useEffect } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import OnboardingWizard from './OnboardingWizard';

/**
 * OnboardingController Component
 * @returns {JSX.Element} The onboarding controller component
 */
const OnboardingController = () => {
  const { isComplete, startOnboarding } = useOnboarding();

  // Check if this is a new user or if onboarding is needed
  useEffect(() => {
    // In a real implementation, we would check for a user property 
    // like "isFirstLogin" or a feature flag to control this
    
    // For now, we'll use localStorage to prevent showing it every time
    const hasCompletedOnboarding = localStorage.getItem('ehb:onboarding:complete');
    
    if (!hasCompletedOnboarding && !isComplete) {
      // Show onboarding after a short delay to let the dashboard load
      const timer = setTimeout(() => {
        startOnboarding();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isComplete, startOnboarding]);

  return <OnboardingWizard /></OnboardingWizard>;
};

export default OnboardingController;
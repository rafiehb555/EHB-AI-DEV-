/**
 * Onboarding Completion Component
 * 
 * Displayed when the user completes the onboarding flow
 */

import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';

const OnboardingCompletion = () => {
  const { completeOnboarding } = useOnboarding();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full shadow-xl text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-10 h-10 text-green-600" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Onboarding Complete!</h2>
        
        <p className="mb-6 text-gray-600">
          Congratulations! You've completed the onboarding process and are now ready to use the EHB Enterprise System. Explore the platform and discover all its powerful features.
        </p>
        
        <button
          onClick={completeOnboarding}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Start Using EHB
        </button>
      </div>
    </div>
  );
};

export default OnboardingCompletion;
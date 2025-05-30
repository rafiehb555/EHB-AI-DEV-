/**
 * Onboarding Progress Bar Component
 * 
 * Shows the user's progress through the onboarding flow
 */

import React from 'react';

const OnboardingProgress = ({ currentStep, totalSteps, percentage }) => {
  return (
    <div className="px-6 pt-4 pb-2 border-b border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-600">
          Step {currentStep} of {totalSteps}
        </h3>
        <span className="text-sm text-gray-600">{percentage}% Complete</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OnboardingProgress;
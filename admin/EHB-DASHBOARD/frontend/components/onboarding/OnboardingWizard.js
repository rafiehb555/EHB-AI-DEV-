import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import OnboardingStep from './OnboardingStep';

/**
 * Onboarding Wizard Component
 * Guides new users through onboarding with a step-by-step wizard
 */
const OnboardingWizard = () => {
  const {
    isOnboarding,
    isLoading,
    onboardingSteps,
    currentStepIndex,
    skipOnboarding,
    completeOnboarding,
    nextStep,
    prevStep,
    getCurrentStep,
    submitStepResponse,
  } = useOnboarding();
  
  const [response, setResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the current step
  const currentStep = getCurrentStep();
  
  // Determine if we can go to the next step
  const canGoNext = () => {
    if (!currentStep) return true;
    
    // If the step is required, we need a response
    if (currentStep.required) {
      if (!response) return false;
      
      // Check if the response is valid based on step type
      switch (currentStep.type) {
        case 'selection':
          return !!response;
        case 'multi-selection':
          return Array.isArray(response) && response.length > 0;
        case 'text-input':
          return response && response.trim().length > 0;
        default:
          return true;
      }
    }
    
    return true;
  };
  
  // Handle proceed to next step
  const handleNext = async () => {
    if (isSubmitting) return;
    
    // If on the last step, complete the onboarding
    if (currentStepIndex === onboardingSteps.length - 1) {
      completeOnboarding();
      return;
    }
    
    // If the current step requires a response, submit it first
    if (currentStep && currentStep.required && response) {
      setIsSubmitting(true);
      
      try {
        await submitStepResponse(response);
      } catch (error) {
        console.error('Error submitting response:', error);
      } finally {
        setIsSubmitting(false);
        setResponse(null);
      }
    } else {
      // Otherwise, just go to the next step
      nextStep();
      setResponse(null);
    }
  };
  
  // Handle go back
  const handleBack = () => {
    prevStep();
    setResponse(null);
  };
  
  // Handle response change
  const handleResponseChange = (newResponse) => {
    setResponse(newResponse);
  };
  
  // Determine class names for buttons
  const getButtonClass = (isDisabled) => {
    return `px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      isDisabled
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
    }`;
  };
  
  // If not in onboarding mode, don't render anything
  if (!isOnboarding) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {isLoading ? 'Loading...' : currentStep?.title || 'Welcome to EHB System'}
            </h2>
            <button
              onClick={skipOnboarding}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          {/* Progress indicator */}
          {onboardingSteps.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center">
                {(onboardingSteps || []).map((step, index) => (
                  <React.Fragment key={step.id}></React>
                    {/* Step circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index < currentStepIndex
                          ? 'bg-blue-600 text-white'
                          : index === currentStepIndex
                          ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {index < currentStepIndex ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    
                    {/* Connecting line, except after last step */}
                    {index < onboardingSteps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          index < currentStepIndex
                            ? 'bg-blue-600'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="px-6 py-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <svg
                className="animate-spin h-10 w-10 text-blue-600 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-600">Loading onboarding steps...</p>
            </div>
          ) : currentStep ? (
    <OnboardingStep
              step={currentStep}
              response={response}
              onResponseChange={handleResponseChange}
            /></OnboardingStep>      />
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-600">No onboarding steps available.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleBack}
            className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              currentStepIndex === 0 ? 'invisible' : ''
            }`}
            disabled={currentStepIndex === 0}
          >
            Back
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={skipOnboarding}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none"
            >
              Skip
            </button>
            
            <button
              onClick={handleNext}
              disabled={
                isSubmitting || (currentStep?.required && !canGoNext())
              }
              className={getButtonClass(
                isSubmitting || (currentStep?.required && !canGoNext())
              )}
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 text-white inline mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {currentStepIndex === onboardingSteps.length - 1
                ? 'Finish'
                : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
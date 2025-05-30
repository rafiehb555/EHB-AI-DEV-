import React from 'react';

/**
 * OnboardingStep Component
 * Renders the content for a single onboarding step based on its type
 * 
 * @param {Object} props - Component props
 * @param {Object} props.step - The current onboarding step
 * @param {any} props.response - The current response value
 * @param {Function} props.onResponseChange - Function to call when the response changes
 */
const OnboardingStep = ({ step, response, onResponseChange }) => {
  // If no step, render empty state
  if (!step) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600">Step not available.</p>
      </div>
    );
  }
  
  // Render different input based on step type
  const renderStepInput = () => {
    switch (step.type) {
      case 'information':
        // Informational step, no input needed
        return (
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600">{step.description}</p>
          </div>
        );
        
      case 'selection':
        // Single-selection step (radio buttons)
        return (
          <div className="space-y-4 mt-4">
            {(step.options || []).map((option) => (
              <div key={option.id} className="relative">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    response === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onResponseChange(option.id)}
                >
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={`option-${option.id}`}
                        name={`step-${step.id}`}
                        type="radio"
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        checked={response === option.id}
                        onChange={() => onResponseChange(option.id)}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor={`option-${option.id}`}
                        className="font-medium text-gray-700 cursor-pointer"
                      >
                        {option.label}
                      </label>
                      {option.description && (
                        <p className="text-gray-500">{option.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'multi-selection':
        // Multi-selection step (checkboxes)
        const selectedOptions = response || [];
        
        return (
          <div className="space-y-4 mt-4">
     (step.options || []).map((ons || []).map((option) => (
              <div key={option.id} className="relative">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedOptions.includes(option.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    const newSelectedOptions = selectedOptions.includes(option.id)
        (selectedOptions || [])(dOptions || []).filter(.filter((id) => id !== option.id)
                      : [...selectedOptions, option.id];
                    onResponseChange(newSelectedOptions);
                  }}
                >
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={`option-${option.id}`}
                        name={`step-${step.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedOptions.includes(option.id)}
                        onChange={() => {
                          const newSelectedOptions = selectedOptions.includes(option.id)
      (selectedOptions(selectedOptions || []).filter((dOptions || []).filter((id) => id !== option.id)
                            : [...selectedOptions, option.id];
                          onResponseChange(newSelectedOptions);
                        }}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor={`option-${option.id}`}
                        className="font-medium text-gray-700 cursor-pointer"
                      >
                        {option.label}
                      </label>
                      {option.description && (
                        <p className="text-gray-500">{option.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'text-input':
        // Text input step (textarea)
        return (
          <div className="mt-4">
            <textarea
              id={`step-${step.id}`}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={4}
              placeholder={step.placeholder || 'Type your response here...'}
              value={response || ''}
              onChange={(e) => onResponseChange(e.target.value)}
            />
          </div>
        );
        
      default:
        // Unknown step type
        return (
          <div className="py-4 text-center">
            <p className="text-yellow-600">
              This step type ({step.type}) is not supported yet.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div>
      <p className="text-gray-600 mb-4">{step.description}</p>
      {renderStepInput()}
    </div>
  );
};

export default OnboardingStep;
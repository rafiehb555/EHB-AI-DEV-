import React, { useState, useEffect, useRef } from 'react';

/**
 * TutorialManager Component
 * 
 * Manages interactive tutorials/guided tours for different areas of the application.
 * Highlights UI elements and shows step-by-step instructions to users.
 * 
 * @param {Object} props
 * @param {string} props.tutorialId - ID of the tutorial to display
 * @param {boolean} props.isActive - Whether the tutorial is active
 * @param {Function} props.onComplete - Callback when tutorial is completed
 * @param {Function} props.onSkip - Callback when tutorial is skipped
 */
const TutorialManager = ({
  tutorialId,
  isActive = false,
  onComplete,
  onSkip,
}) => {
  // Store tutorial steps and current step
  const [tutorialSteps, setTutorialSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetElement, setTargetElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  
  // References for positions and animations
  const tooltipRef = useRef(null);
  const highlightRef = useRef(null);
  
  // Load tutorial data when tutorialId changes
  useEffect(() => {
    if (!tutorialId || !isActive) return;
    
    // Simulate fetching tutorial data
    // This would be an API call in production
    const fetchTutorialData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const tutorials = {
        dashboard: {
          title: 'Dashboard Tour',
          steps: [
            {
              target: '.wallet-summary-widget',
              title: 'Wallet Summary',
              content: 'This widget provides an overview of all your connected wallets and their balances.',
              placement: 'bottom',
            },
            {
              target: '.transaction-history-widget',
              title: 'Transaction History',
              content: 'View your recent transactions across all connected wallets here.',
              placement: 'bottom',
            },
            {
              target: '.sidebar-wallets-link',
              title: 'Wallet Management',
              content: 'Click here to manage your wallets, add new ones, or remove existing ones.',
              placement: 'right',
            },
            {
              target: '.help-button',
              title: 'Contextual Help',
              content: 'Need help? Click this button anytime to access contextual help for the current page.',
              placement: 'left',
            },
          ],
        },
        walletCreate: {
          title: 'Creating a Wallet',
          steps: [
            {
              target: '.wallet-type-selector',
              title: 'Select Wallet Type',
              content: 'Choose the type of wallet you want to create.',
              placement: 'bottom',
            },
            {
              target: '.security-options',
              title: 'Security Options',
              content: 'Configure security settings for your new wallet.',
              placement: 'bottom',
            },
            {
              target: '.recovery-phrase',
              title: 'Recovery Phrase',
              content: 'Be sure to save this recovery phrase in a secure location.',
              placement: 'top',
            },
          ],
        },
      };
      
      const tutorial = tutorials[tutorialId];
      if (tutorial) {
        setTutorialSteps(tutorial.steps);
        setIsVisible(true);
        setCurrentStepIndex(0);
      }
    };
    
    fetchTutorialData();
    
    return () => {
      // Clean up tutorial when component unmounts
      setIsVisible(false);
      setTutorialSteps([]);
      setCurrentStepIndex(0);
    };
  }, [tutorialId, isActive]);
  
  // Position tooltip when step or visibility changes
  useEffect(() => {
    if (!isVisible || tutorialSteps.length === 0) return;
    
    const currentStep = tutorialSteps[currentStepIndex];
    if (!currentStep) return;
    
    const positionTooltip = () => {
      // Find target element in the DOM
      const target = document.querySelector(currentStep.target);
      if (!target) return;
      
      setTargetElement(target);
      
      // Get element position and dimensions
      const targetRect = target.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect() || { width: 250, height: 150 };
      
      // Calculate position based on placement
      let top, left;
      
      switch (currentStep.placement) {
        case 'top':
          top = targetRect.top - tooltipRect.height - 10;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = targetRect.bottom + 10;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.left - tooltipRect.width - 10;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.right + 10;
          break;
        default:
          top = targetRect.bottom + 10;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
      }
      
      // Ensure tooltip is in viewport
      if (left < 10) left = 10;
      if (top < 10) top = 10;
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      if (top + tooltipRect.height > window.innerHeight - 10) {
        top = window.innerHeight - tooltipRect.height - 10;
      }
      
      setTooltipPosition({ top, left });
      
      // Position highlight
      if (highlightRef.current) {
        highlightRef.current.style.top = `${targetRect.top}px`;
        highlightRef.current.style.left = `${targetRect.left}px`;
        highlightRef.current.style.width = `${targetRect.width}px`;
        highlightRef.current.style.height = `${targetRect.height}px`;
      }
    };
    
    // Delay to ensure DOM elements are ready
    const timer = setTimeout(positionTooltip, 100);
    
    // Re-position on window resize
    window.addEventListener('resize', positionTooltip);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', positionTooltip);
    };
  }, [isVisible, tutorialSteps, currentStepIndex]);
  
  // Navigate to next step
  const nextStep = () => {
    if (currentStepIndex < tutorialSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Tutorial complete
      setIsVisible(false);
      if (onComplete) onComplete();
    }
  };
  
  // Navigate to previous step
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  // Skip the tutorial
  const skipTutorial = () => {
    setIsVisible(false);
    if (onSkip) onSkip();
  };
  
  if (!isVisible || tutorialSteps.length === 0) return null;
  
  const currentStep = tutorialSteps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === tutorialSteps.length - 1;
  
  return (
    <>
      {/* Highlight element */}
      <div 
        ref={highlightRef}
        className="fixed pointer-events-none z-[9998] transition-all duration-300 ease-in-out"
        style={{
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          border: '2px solid #3b82f6',
          borderRadius: '4px',
        }}
      />
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[9999] bg-white rounded-lg shadow-lg p-4 w-64 transition-all duration-300 ease-in-out"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{currentStep.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{currentStep.content}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Step {currentStepIndex + 1} of {tutorialSteps.length}
          </div>
          
          <div className="flex space-x-2">
            {!isFirstStep && (
              <button
                onClick={prevStep}
                className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900"
              >
                Back
              </button>
            )}
            
            <button
              onClick={skipTutorial}
              className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900"
            >
              Skip
            </button>
            
            <button
              onClick={nextStep}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isLastStep ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorialManager;
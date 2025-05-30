import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';

/**
 * OnboardingButton Component
 * A button to start or restart the onboarding process
 * 
 * @param {Object} props Component props
 * @param {string} [props.variant='primary'] Button variant (primary, outline, text)
 * @param {string} [props.size='medium'] Button size (small, medium, large)
 * @param {string} [props.className] Additional CSS classes
 * @param {ReactNode} [props.children] Button content
 */
const OnboardingButton = ({ 
  variant = 'primary', 
  size = 'medium', 
  className = '',
  children = 'Start Onboarding'
}) => {
  const { startOnboarding } = useOnboarding();

  // Determine button styling based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50';
      case 'text':
        return 'bg-transparent text-blue-500 hover:underline border-none';
      case 'primary':
      default:
        return 'bg-blue-500 text-white hover:bg-blue-600 border border-blue-500';
    }
  };

  // Determine button size
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-sm px-3 py-1';
      case 'large':
        return 'text-lg px-6 py-3';
      case 'medium':
      default:
        return 'text-base px-4 py-2';
    }
  };

  return (
    <button
      onClick={startOnboarding}
      className={`
        rounded-md font-medium transition-colors
        ${getVariantClasses()} 
        ${getSizeClasses()}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default OnboardingButton;
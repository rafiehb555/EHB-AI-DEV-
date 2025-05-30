/**
 * Onboarding Preview Page
 * 
 * This page allows administrators to preview the AI-powered onboarding flow.
 */

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useOnboarding } from '../../context/OnboardingContext';
import OnboardingWizard from '../../components/onboarding/OnboardingWizard';

const OnboardingPreviewPage = () => {
  const { startOnboarding, skipOnboarding, isOnboarding } = useOnboarding();
  const [userRole, setUserRole] = useState('seller');
  const [showSettings, setShowSettings] = useState(!isOnboarding);
  
  // Start preview with custom settings
  const handleStartPreview = () => {
    // In a real implementation, we would pass these settings to the onboarding context
    // For now, we'll just start the onboarding flow with default settings
    setShowSettings(false);
    startOnboarding();
  };
  
  // Exit preview mode
  const handleExitPreview = () => {
    skipOnboarding();
    setShowSettings(true);
  };
  
  return (
    <DashboardLayout></DashboardLayout>
      {showSettings ? (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Onboarding Preview</h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Preview Settings</h2>
            <p className="mb-6 text-gray-600">
              Configure a test user profile to preview the personalized onboarding experience.
            </p>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                User Role
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
                <option value="franchise">Franchise</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                User Skill Level
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="skillLevel"
                    value="beginner"
                    defaultChecked
                    className="mr-2"
                  />
                  <span>Beginner</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="skillLevel"
                    value="intermediate"
                    className="mr-2"
                  />
                  <span>Intermediate</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="skillLevel"
                    value="expert"
                    className="mr-2"
                  />
                  <span>Expert</span>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Feature Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {['Blockchain', 'AI Assistant', 'Analytics', 'Notifications', 'Marketplace'].map((feature) => (
                  <label key={feature} className="flex items-center px-3 py-2 bg-gray-100 rounded-md">
                    <input
                      type="checkbox"
                      className="mr-2"
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleStartPreview}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Start Preview
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You are currently in preview mode. This is how the onboarding will appear to users.
                  <button
                    onClick={handleExitPreview}
                    className="ml-2 text-sm font-medium text-yellow-700 underline"
                  >
                    Exit Preview
                  </button>
                </p>
              </div>
            </div>
          </div>
          
          {/* The actual onboarding wizard will be rendered by the OnboardingController in DashboardLayout */}
        </div>
      )}
    </DashboardLayout>
  );
};

export default OnboardingPreviewPage;
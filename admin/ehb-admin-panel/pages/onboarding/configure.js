/**
 * Onboarding Configuration Page
 * 
 * This page allows administrators to configure the AI-powered onboarding flow.
 */

import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { postRequest } from '../../utils/apiHelper';

const OnboardingConfigurationPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [settings, setSettings] = useState({
    enabledForNewUsers: true,
    aiModel: 'gpt-4o',
    supportedRoles: ['seller', 'buyer', 'franchise'],
    maxSteps: 5,
    customPrompt: 'Create a personalized onboarding flow for new users of the EHB platform. The flow should introduce key features based on the user\'s role and preferences. Each step should be concise and engaging.'
  });
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setSettings({
        ...settings,
        [name]: checked
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };
  
  // Handle role selection
  const toggleRole = (role) => {
    const roles = [...settings.supportedRoles];
    
    if (roles.includes(role)) {
      setSettings({
        ...settings,
        supportedRoles: (roles || []).filter(r => r !== role)
      });
    } else {
      setSettings({
        ...settings,
        supportedRoles: [...roles, role]
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setSuccess(false);
      setError(null);
      
      // In a real implementation, this would submit to the API
      console.log('Submitting settings:', settings);
      
      // Simulate API delay
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error saving onboarding configuration:', err);
      setError('Failed to save configuration');
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout></DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Onboarding Configuration</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">AI Onboarding Settings</h2>
            
            {success && (
              <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Configuration saved successfully!
              </div>
            )}
            
            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="enabledForNewUsers"
                  checked={settings.enabledForNewUsers}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <span>Enable AI-powered onboarding for new users</span>
              </label>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                AI Model
              </label>
              <select
                name="aiModel"
                value={settings.aiModel}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="gpt-4o">GPT-4o (Default)</option>
                <option value="gpt-4-vision">GPT-4 Vision</option>
                <option value="claude-3-7">Claude 3.7</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Maximum Onboarding Steps
              </label>
              <input
                type="number"
                name="maxSteps"
                min="3"
                max="10"
                value={settings.maxSteps}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="mt-1 text-sm text-gray-500">
                Limit the number of steps in the onboarding flow (3-10)
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Supported User Roles
              </label>
              <div className="flex flex-wrap gap-3">
                {['seller', 'buyer', 'franchise', 'admin'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-3 py-1 rounded-md capitalize ${
                      settings.supportedRoles.includes(role)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Custom AI Prompt (Advanced)
              </label>
              <textarea
                name="customPrompt"
                value={settings.customPrompt}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="mt-1 text-sm text-gray-500">
                Customize the prompt used to generate onboarding steps
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md mr-2"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full" />
                  Saving...
                </span>
              ) : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default OnboardingConfigurationPage;
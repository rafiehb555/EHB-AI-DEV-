import React, { useState, useEffect } from 'react';

/**
 * GeneralSettings Component
 * 
 * A component for managing general system settings
 */
const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'EHB Admin Panel',
    siteDescription: 'Enterprise Hybrid Blockchain Administration',
    contactEmail: 'admin@ehb-system.com',
    maxUploadSize: 10,
    defaultLanguage: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        
        // Example API call to fetch settings
        // Replace with your actual API endpoint
        const response = await fetch('/api/settings/general');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch settings');
        }
        
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings. Using default values.');
        // Keep using the default settings set in useState
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage('');
      
      // Example API call to save settings
      // Replace with your actual API endpoint
      const response = await fetch('/api/settings/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save settings');
      }
      
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <div className="loading">Loading settings...</div>;
  }
  
  return (
    <div className="general-settings">
      <form onSubmit={handleSubmit}>
        {/* Site Information */}
        <div className="settings-section">
          <h3>Site Information</h3>
          
          <div className="form-group">
            <label htmlFor="siteName">Site Name</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="siteDescription">Site Description</label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contactEmail">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        {/* Content Settings */}
        <div className="settings-section">
          <h3>Content Settings</h3>
          
          <div className="form-group">
            <label htmlFor="maxUploadSize">Max Upload Size (MB)</label>
            <input
              type="number"
              id="maxUploadSize"
              name="maxUploadSize"
              value={settings.maxUploadSize}
              onChange={handleChange}
              min="1"
              max="100"
            />
          </div>
        </div>
        
        {/* Localization */}
        <div className="settings-section">
          <h3>Localization</h3>
          
          <div className="form-group">
            <label htmlFor="defaultLanguage">Default Language</label>
            <select
              id="defaultLanguage"
              name="defaultLanguage"
              value={settings.defaultLanguage}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="dateFormat">Date Format</label>
            <select
              id="dateFormat"
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="timeFormat">Time Format</label>
            <select
              id="timeFormat"
              name="timeFormat"
              value={settings.timeFormat}
              onChange={handleChange}
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
        </div>
        
        {/* Error and Success Messages */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
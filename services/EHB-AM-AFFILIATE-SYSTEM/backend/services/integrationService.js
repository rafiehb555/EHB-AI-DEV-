/**
 * Integration Service for EHB Affiliate Management System
 * 
 * This service is responsible for communicating with the EHB Integration Hub
 * to synchronize affiliate and referral data across multiple EHB modules.
 */

const axios = require('axios');

class IntegrationService {
  constructor() {
    // Initialize with default Integration Hub URL (would be environment variable in production)
    this.integrationHubUrl = process.env.INTEGRATION_HUB_URL || 'http://localhost:5003';
    this.moduleId = 'EHB-AM-AFFILIATE-SYSTEM';
    console.log(`Initialized Integration Service with URL: ${this.integrationHubUrl}`);
  }
  
  /**
   * Register this module with the Integration Hub
   * @returns {Promise<Object>} Registration response
   */
  async registerWithHub() {
    try {
      const response = await axios.post(`${this.integrationHubUrl}/register-module`, {
        moduleId: this.moduleId,
        capabilities: ['affiliate-management', 'referral-tracking', 'rewards-management'],
        apiEndpoint: 'http://localhost:5005/api'
      });
      
      console.log('Successfully registered with Integration Hub');
      return response.data;
    } catch (error) {
      console.error('Failed to register with Integration Hub:', error.message);
      // Return empty object rather than throwing to prevent service disruption
      return {};
    }
  }
  
  /**
   * Notify the Integration Hub about updated affiliate stats
   * @param {Object} affiliateData Data about the affiliate stats update
   * @returns {Promise<Object>} Notification response
   */
  async notifyAffiliateUpdate(affiliateData) {
    try {
      const response = await axios.post(`${this.integrationHubUrl}/notify`, {
        moduleId: this.moduleId,
        eventType: 'affiliate-stats-update',
        data: {
          ...affiliateData,
          timestamp: new Date().toISOString()
        }
      });
      
      console.log('Successfully notified Integration Hub about affiliate update');
      return response.data;
    } catch (error) {
      console.error('Failed to notify Integration Hub:', error.message);
      // Return empty object rather than throwing to prevent service disruption
      return {};
    }
  }
  
  /**
   * Fetch referral data from the JPS-Job-Providing-Service
   * @returns {Promise<Object>} Referral data
   */
  async getJobReferralData() {
    try {
      const response = await axios.get('http://localhost:5004/api/integrations/referrals');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch job referral data:', error.message);
      return {
        success: false,
        message: 'Unable to fetch job referral data at this time'
      };
    }
  }
  
  /**
   * Subscribe to events from the Integration Hub
   * @param {String} eventType Type of event to subscribe to
   * @param {Function} callback Function to call when event is received
   * @returns {Promise<Object>} Subscription response
   */
  async subscribeToEvent(eventType, callback) {
    try {
      const response = await axios.post(`${this.integrationHubUrl}/subscribe`, {
        moduleId: this.moduleId,
        eventType,
        callbackUrl: `http://localhost:5005/api/webhook/${eventType}`
      });
      
      console.log(`Successfully subscribed to ${eventType} events`);
      return response.data;
    } catch (error) {
      console.error(`Failed to subscribe to ${eventType} events:`, error.message);
      return {};
    }
  }
}

// Export a singleton instance
const integrationService = new IntegrationService();
module.exports = integrationService;
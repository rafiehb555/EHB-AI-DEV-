/**
 * Integration Service for JPS Affiliate System
 * 
 * This service is responsible for communicating with the EHB Integration Hub
 * to synchronize referral data across multiple EHB modules.
 */

const axios = require('axios');

class IntegrationService {
  constructor() {
    // Initialize with default Integration Hub URL (would be environment variable in production)
    this.integrationHubUrl = process.env.INTEGRATION_HUB_URL || 'http://localhost:5003';
    this.moduleId = 'JPS-Job-Providing-Service';
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
        capabilities: ['referral-tracking', 'job-listings'],
        apiEndpoint: 'http://localhost:5004/api'
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
   * Notify the Integration Hub about a new referral
   * @param {Object} referralData Data about the new referral
   * @returns {Promise<Object>} Notification response
   */
  async notifyNewReferral(referralData) {
    try {
      const response = await axios.post(`${this.integrationHubUrl}/notify`, {
        moduleId: this.moduleId,
        eventType: 'new-referral',
        data: {
          ...referralData,
          timestamp: new Date().toISOString()
        }
      });
      
      console.log('Successfully notified Integration Hub about new referral');
      return response.data;
    } catch (error) {
      console.error('Failed to notify Integration Hub:', error.message);
      // Return empty object rather than throwing to prevent service disruption
      return {};
    }
  }
  
  /**
   * Fetch affiliate data from the EHB-AM-AFFILIATE-SYSTEM
   * @returns {Promise<Object>} Affiliate data
   */
  async getAffiliateData() {
    try {
      const response = await axios.get('http://localhost:5005/api/integrations/referrals');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch affiliate data:', error.message);
      return {
        success: false,
        message: 'Unable to fetch affiliate data at this time'
      };
    }
  }
}

// Export a singleton instance
const integrationService = new IntegrationService();
module.exports = integrationService;
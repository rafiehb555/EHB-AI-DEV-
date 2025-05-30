/**
 * Configuration utility for EHB Developer Portal
 * This file provides a way to access the site configuration from any component
 */
import siteConfig from '../siteConfig';

/**
 * Get the site configuration
 * @returns {Object} The site configuration
 */
export function getSiteConfig() {
  return siteConfig;
}

/**
 * Get a specific configuration value
 * @param {string} path - Dot notation path to the configuration value (e.g., 'api.baseUrl')
 * @param {any} defaultValue - Default value to return if the path doesn't exist
 * @returns {any} The configuration value
 */
export function getConfigValue(path, defaultValue) {
  const keys = path.split('.');
  let result = siteConfig;
  
  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
}

/**
 * Get the paths for navigation items
 * @param {string} section - The navigation section (main, ai, system, management)
 * @returns {Array<Object>} The navigation items
 */
export function getNavigationPaths(section = 'main') {
  return siteConfig.navigation[section] || [];
}

/**
 * Get the URL for a service
 * @param {string} service - The service name (backend, home, goSellr, aiDev)
 * @returns {string} The service URL
 */
export function getServiceUrl(service) {
  return siteConfig.services[`${service}Url`] || '';
}

export default getSiteConfig;
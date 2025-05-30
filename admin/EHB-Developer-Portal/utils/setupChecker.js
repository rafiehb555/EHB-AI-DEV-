/**
 * Setup Checker
 * 
 * This utility checks if the setup page should be displayed based on the setup flag.
 */

// Check if setup is needed
export async function isSetupNeeded() {
  try {
    const response = await fetch('/api/setup-status');
    if (response.ok) {
      const data = await response.json();
      return data.setupNeeded === true;
    }
    return false;
  } catch (error) {
    console.error('Error checking setup status:', error);
    return false;
  }
}
/**
 * Setup Redirect Component
 * 
 * This component checks if setup is needed and redirects to the setup page if necessary.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isSetupNeeded } from '../utils/setupChecker';

export default function SetupRedirect({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Skip redirect if already on setup page or API routes
    if (router.pathname === '/setup' || router.pathname.startsWith('/api/')) {
      setLoading(false);
      return;
    }
    
    async function checkSetup() {
      try {
        const setupNeeded = await isSetupNeeded();
        
        if (setupNeeded) {
          router.push('/setup');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking setup status:', error);
        setLoading(false);
      }
    }
    
    checkSetup();
  }, [router]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
          <p className="text-gray-500">Checking installation status</p>
        </div>
      </div>
    );
  }
  
  return children;
}
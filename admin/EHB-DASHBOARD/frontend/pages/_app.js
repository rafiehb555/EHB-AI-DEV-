import { useEffect, useState } from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import { NotificationProvider } from '../context/NotificationContext';
import { OnboardingProvider } from '../context/OnboardingContext';
import { ContextualHelpProvider } from '../context/ContextualHelpContext';
import { FeedbackProvider } from '../context/FeedbackContext';

// Import font styles if needed
// import { Inter } from 'next/font/google';
// const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }) {
  const [isReady, setIsReady] = useState(false);
  
  // Simulate checking auth, loading user preferences, etc.
  useEffect(() => {
    // Load things like user profile, initial settings, etc.
    const initializeApp = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsReady(true);
    };
    
    initializeApp();
  }, []);
  
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Loading EHB System...
          </h2>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>EHB System</title>
      </Head>
      <FeedbackProvider>
        <NotificationProvider>
          <OnboardingProvider>
            <ContextualHelpProvider>
              <Component {...pageProps} />
            </ContextualHelpProvider>
          </OnboardingProvider>
        </NotificationProvider>
      </FeedbackProvider>
    </>
  );
}

export default MyApp;
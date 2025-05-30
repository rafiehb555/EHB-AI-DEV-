import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { SiteConfigProvider } from '../context/SiteConfigContext.jsx';
import { UserPreferencesProvider } from '../context/UserPreferencesContext';
import { LearningProvider } from '../context/LearningContext';
import MockChakraProvider from '../components/chakra/MockChakraProvider';

function ErrorFallback({ error }) {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fff3f3',
      border: '1px solid #ff8080',
      margin: '20px',
      borderRadius: '4px'
    }}>
      <h2 style={{ color: '#d32f2f' }}>⚠️ Something went wrong</h2>
      <pre style={{
        padding: '10px',
        backgroundColor: '#f8f8f8',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        {error.message}
      </pre>
    </div>
  );
}

// Simple non-Chakra alternative for our app
const AppWrapper = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f8fa',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style jsx global>{`
        html, body {
          padding: 0;
          margin: 0;
          min-height: 100vh;
        }
        a {
          color: #0064db;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        * {
          box-sizing: border-box;
        }
        /* Transition effects for sidebar and content */
        .sidebar, .main-content {
          transition: all 0.3s ease-in-out;
        }
        /* Tooltip styles for collapsed sidebar items */
        [data-tooltip]:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          background-color: #333;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
          margin-left: 8px;
        }
      `}</style>
      {children}
    </div>
  );
};

function MyApp({ Component, pageProps }) {
  // State to track if the app is mounted (for client-side only features)
  const [mounted, setMounted] = useState(false);

  // After initial render, set mounted to true
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <title>EHB Developer Portal</title>
      </Head>
      
      <AppWrapper>
        <MockChakraProvider>
          <SiteConfigProvider>
            <UserPreferencesProvider>
              <LearningProvider>
                {/* If in development, wrap with error boundary */}
                {process.env.NODE_ENV === 'development' ? (
                  <ErrorBoundary>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                ) : (
                  <Component {...pageProps} />
                )}
              </LearningProvider>
            </UserPreferencesProvider>
          </SiteConfigProvider>
        </MockChakraProvider>
      </AppWrapper>
    </>
  );
}

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default MyApp;
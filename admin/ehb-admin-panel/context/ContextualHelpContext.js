import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for contextual help
const ContextualHelpContext = createContext();

/**
 * ContextualHelpProvider Component
 * 
 * Provides contextual help state and actions for the entire application.
 * Manages the help sidebar and AI assistance for different areas of the application.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const ContextualHelpProvider = ({ children }) => {
  // State
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [helpContent, setHelpContent] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [recentQuestions, setRecentQuestions] = useState([]);
  
  // Update help content when path changes
  useEffect(() => {
    if (isHelpOpen) {
      fetchHelpContent(currentPath);
    }
  }, [currentPath, isHelpOpen]);
  
  // Update current path when URL changes
  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };
    
    // Set initial path
    updatePath();
    
    // Listen for path changes (for SPA navigation)
    window.addEventListener('popstate', updatePath);
    
    return () => {
      window.removeEventListener('popstate', updatePath);
    };
  }, []);
  
  // Fetch help content for the current path
  const fetchHelpContent = async (path) => {
    try {
      // This would be a real API call in production
      // const response = await fetch(`/api/help?path=${encodeURIComponent(path)}`);
      // const data = await response.json();
      
      // Simulate API response with contextual help data
      const helpData = {
        '/dashboard': {
          title: 'Dashboard Overview',
          description: 'The dashboard provides a comprehensive overview of your blockchain wallet management system.',
          sections: [
            {
              title: 'Key Metrics',
              content: 'The dashboard displays key metrics like total wallets, recent transactions, and system health.',
            },
            {
              title: 'Navigation',
              content: 'Use the sidebar to navigate to different sections of the admin panel.',
            },
          ],
          relatedLinks: [
            { title: 'Understanding Wallet Metrics', url: '/help/wallet-metrics' },
            { title: 'Transaction Analysis', url: '/help/transaction-analysis' },
          ],
        },
        '/dashboard/wallets': {
          title: 'Wallet Management',
          description: 'Manage all your blockchain wallets from a single interface.',
          sections: [
            {
              title: 'Creating Wallets',
              content: 'Create new wallets by clicking the "Create Wallet" button and selecting the blockchain network.',
            },
            {
              title: 'Importing Wallets',
              content: 'Import existing wallets using private keys, seed phrases, or keystore files.',
            },
            {
              title: 'Wallet Security',
              content: 'Ensure your wallets are secure by enabling two-factor authentication and backup options.',
            },
          ],
          relatedLinks: [
            { title: 'Wallet Security Best Practices', url: '/help/wallet-security' },
            { title: 'Supported Blockchain Networks', url: '/help/supported-networks' },
          ],
        },
      };
      
      // Get help data for the current path or closest parent path
      const getHelpForPath = (path) => {
        if (helpData[path]) {
          return helpData[path];
        }
        
        // Try parent paths if exact match not found
        const pathParts = path.split('/').filter(Boolean);
        while (pathParts.length > 0) {
          pathParts.pop();
          const parentPath = '/' + pathParts.join('/');
          if (helpData[parentPath]) {
            return helpData[parentPath];
          }
        }
        
        // Default to dashboard help if nothing else matches
        return helpData['/dashboard'];
      };
      
      setHelpContent(getHelpForPath(path));
    } catch (error) {
      console.error('Error fetching help content:', error);
      setHelpContent(null);
    }
  };
  
  // Ask a question to the AI assistant
  const askAiAssistant = async (question) => {
    if (!question.trim()) return;
    
    setIsAiLoading(true);
    
    try {
      // In a real app, this would call an API that connects to OpenAI, Claude, etc.
      // const response = await fetch('/api/ai-assistant', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     question,
      //     context: currentPath,
      //     // Additional context could be included here
      //   }),
      // });
      // 
      // const data = await response.json();
      // setAiResponse(data.answer);
      
      // Simulate AI response for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a simulated response based on the question
      const simulatedResponse = `Here's information about "${question}":
      
This is a simulated AI assistant response for demonstration purposes. In a production environment, this would connect to an AI service like OpenAI's GPT or Anthropic's Claude to provide real-time, contextual assistance based on your question and the current section of the application you're viewing.

The AI would have access to documentation, best practices, and troubleshooting guides specific to the EHB Admin Panel and blockchain wallet management.`;
      
      setAiResponse(simulatedResponse);
      
      // Add to recent questions
      setRecentQuestions(prev => {
        const newQuestions = [{ question, answer: simulatedResponse, timestamp: new Date().toISOString() }, ...prev];
        // Keep only the 5 most recent questions
        return newQuestions.slice(0, 5);
      });
    } catch (error) {
      console.error('Error asking AI assistant:', error);
      setAiResponse('Sorry, there was an error processing your question. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };
  
  // Toggle help sidebar
  const toggleHelp = () => {
    setIsHelpOpen(prev => !prev);
    if (!isHelpOpen) {
      fetchHelpContent(currentPath);
    }
  };
  
  // Open help sidebar
  const openHelp = () => {
    setIsHelpOpen(true);
    fetchHelpContent(currentPath);
  };
  
  // Close help sidebar
  const closeHelp = () => {
    setIsHelpOpen(false);
  };
  
  // Clear AI response
  const clearAiResponse = () => {
    setAiResponse('');
  };
  
  // Create the context value object with state and functions
  const contextValue = {
    isHelpOpen,
    currentPath,
    helpContent,
    aiResponse,
    isAiLoading,
    recentQuestions,
    toggleHelp,
    openHelp,
    closeHelp,
    askAiAssistant,
    clearAiResponse,
  };
  
  return (
    <ContextualHelpContext.Provider value={contextValue}></ContextualHelpContext>
      {children}
    </ContextualHelpContext.Provider>
  );
};

// Custom hook for using the contextual help context
export const useContextualHelp = () => {
  const context = useContext(ContextualHelpContext);
  if (!context) {
    throw new Error('useContextualHelp must be used within a ContextualHelpProvider');
  }
  return context;
};

export default ContextualHelpContext;
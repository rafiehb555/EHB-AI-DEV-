import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the contextual help context
const ContextualHelpContext = createContext();

/**
 * ContextualHelpProvider Component
 * Provides contextual help functionality throughout the app
 */
export const ContextualHelpProvider = ({ children }) => {
  // State
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpTopic, setHelpTopic] = useState(null);
  const [helpContent, setHelpContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Open the help sidebar
   */
  const openHelp = useCallback(() => {
    setIsHelpOpen(true);
  }, []);

  /**
   * Close the help sidebar
   */
  const closeHelp = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  /**
   * Toggle the help sidebar
   */
  const toggleHelp = useCallback(() => {
    setIsHelpOpen(prev => !prev);
  }, []);

  /**
   * Get help for a specific topic
   * @param {string} topic - The topic to get help for
   * @param {Object} context - Additional context data
   */
  const getHelp = useCallback(async (topic, context = {}) => {
    setHelpTopic(topic);
    setIsLoading(true);
    setError(null);

    try {
      // Use the contextual help API endpoint
      const queryParams = new URLSearchParams({ topic });
      Object.entries(context).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      
      const response = await fetch(`/api/contextual-help?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to get help: ${response.status}`);
      }

      const data = await response.json();
      
      // Format the help content for display
      const content = formatHelpContent(data);
      setHelpContent(content);
      
      // Auto-open the help sidebar if it's not already open
      if (!isHelpOpen) {
        openHelp();
      }
    } catch (error) {
      console.error('Error getting help:', error);
      setError(error.message);
      
      // If we don't have any content yet, provide a fallback
      if (!helpContent) {
        setHelpContent({
          title: 'Help',
          content: `We couldn't find help for "${topic}". Please try another topic or contact support.`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isHelpOpen, openHelp]);
  
  /**
   * Format help content from the API response
   * @param {Object} data - The API response data
   * @returns {Object} - Formatted help content
   */
  const formatHelpContent = (data) => {
    // Check if the data has sections
    if (data.sections && Array.isArray(data.sections)) {
      // Convert sections to HTML content
      const sectionsHtml = data.sections.map(section => `
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">${section.heading}</h3>
          <div class="text-gray-700">${section.content}</div>
        </div>
      `).join('');
      
      // Add tips section if available
      const tipsHtml = data.tips && data.tips.length > 0 ? `
        <div class="mb-4 bg-blue-50 p-4 rounded-md">
          <h3 class="text-lg font-medium text-blue-900 mb-2">Quick Tips</h3>
          <ul class="list-disc pl-5 text-blue-800">
            ${data.tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
      ` : '';
      
      // Add quick links section if available
      const linksHtml = data.quickLinks && data.quickLinks.length > 0 ? `
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Related Links</h3>
          <ul class="list-disc pl-5 text-blue-600">
            ${data.quickLinks.map(link => `<li><a href="${link.url}" class="hover:underline">${link.text}</a></li>`).join('')}
          </ul>
        </div>
      ` : '';
      
      // Combine all HTML content
      return {
        title: data.title,
        content: `
          <div class="text-gray-700 mb-4">${data.description || ''}</div>
          ${sectionsHtml}
          ${tipsHtml}
          ${linksHtml}
        `,
      };
    }
    
    // For custom question responses
    if (data.answer) {
      const relatedTopicsHtml = data.relatedTopics && data.relatedTopics.length > 0 ? `
        <div class="mt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Related Topics</h3>
          <ul class="list-disc pl-5 text-gray-700">
            ${data.relatedTopics.map(topic => `<li>${topic}</li>`).join('')}
          </ul>
        </div>
      ` : '';
      
      const linksHtml = data.usefulLinks && data.usefulLinks.length > 0 ? `
        <div class="mt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Useful Links</h3>
          <ul class="list-disc pl-5 text-blue-600">
            ${data.usefulLinks.map(link => `<li><a href="${link.url}" class="hover:underline">${link.text}</a></li>`).join('')}
          </ul>
        </div>
      ` : '';
      
      return {
        title: 'Answer',
        content: `
          <div class="bg-gray-50 p-4 rounded-md mb-4">
            <div class="text-gray-700 italic">${data.question}</div>
          </div>
          <div class="text-gray-900">${data.answer}</div>
          ${data.additionalInfo ? `<div class="mt-4 text-gray-700">${data.additionalInfo}</div>` : ''}
          ${relatedTopicsHtml}
          ${linksHtml}
        `,
      };
    }
    
    // If the data structure is unknown, return it as-is
    return {
      title: data.title || 'Help',
      content: data.content || JSON.stringify(data),
    };
  };

  /**
   * Get help for the current page
   * @param {string} path - The current page path
   * @param {Object} pageData - Additional page data
   */
  const getPageHelp = useCallback(async (path, pageData = {}) => {
    await getHelp(`page:${path}`, { path, ...pageData });
  }, [getHelp]);

  /**
   * Get help for a specific component
   * @param {string} componentId - The component ID
   * @param {Object} componentData - Additional component data
   */
  const getComponentHelp = useCallback(async (componentId, componentData = {}) => {
    await getHelp(`component:${componentId}`, { componentId, ...componentData });
  }, [getHelp]);

  /**
   * Get help for a specific feature
   * @param {string} featureId - The feature ID
   * @param {Object} featureData - Additional feature data
   */
  const getFeatureHelp = useCallback(async (featureId, featureData = {}) => {
    await getHelp(`feature:${featureId}`, { featureId, ...featureData });
  }, [getHelp]);

  /**
   * Clear the current help content
   */
  const clearHelp = useCallback(() => {
    setHelpTopic(null);
    setHelpContent(null);
    setError(null);
  }, []);

  /**
   * Ask a specific question and get an AI-powered answer
   * @param {string} question - The question to ask
   * @param {Object} context - Additional context data
   */
  const askQuestion = useCallback(async (question, context = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the contextual help ask endpoint
      const response = await fetch('/api/contextual-help/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          ...context,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get answer: ${response.status}`);
      }

      const data = await response.json();
      
      // Format the answer for display
      const content = formatHelpContent(data);
      setHelpContent(content);
      
      // Auto-open the help sidebar if it's not already open
      if (!isHelpOpen) {
        openHelp();
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setError(error.message);
      
      // If we don't have any content yet, provide a fallback
      if (!helpContent) {
        setHelpContent({
          title: 'Answer',
          content: `We couldn't answer your question right now. Please try again later or contact support.`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isHelpOpen, openHelp, helpContent]);

  /**
   * Get popular help topics
   * @param {number} limit - Maximum number of topics to retrieve
   */
  const getPopularTopics = useCallback(async (limit = 5) => {
    try {
      const response = await fetch(`/api/contextual-help/popular?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get popular topics: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting popular topics:', error);
      return [];
    }
  }, []);

  // Define the context value
  const contextValue = {
    isHelpOpen,
    helpTopic,
    helpContent,
    isLoading,
    error,
    openHelp,
    closeHelp,
    toggleHelp,
    getHelp,
    getPageHelp,
    getComponentHelp,
    getFeatureHelp,
    askQuestion,
    getPopularTopics,
    clearHelp,
  };

  return (
    <ContextualHelpContext.Provider value={contextValue}>
      {children}
    </ContextualHelpContext.Provider>
  );
};

/**
 * Hook to use the contextual help context
 * @returns {Object} Contextual help context
 */
export const useContextualHelp = () => {
  const context = useContext(ContextualHelpContext);
  if (!context) {
    throw new Error('useContextualHelp must be used within a ContextualHelpProvider');
  }
  return context;
};
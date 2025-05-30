import React, { useState, useEffect } from 'react';

const ContextualHelpSidebar = ({ 
  contextPath, 
  isOpen, 
  onClose,
  aiPowered = true
}) => {
  const [helpContent, setHelpContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [question, setQuestion] = useState('');
  
  useEffect(() => {
    // If the sidebar is open, fetch contextual help content
    if (isOpen && contextPath) {
      setIsLoading(true);
      
      // Simulate API call to fetch help content
      setTimeout(() => {
        // This would be an actual API call in production
        // fetchHelpContent(contextPath)
        setHelpContent({
          title: 'Wallet Management',
          description: 'The wallet management section allows you to create, import, and manage blockchain wallets across different chains.',
          sections: [
            {
              title: 'Creating a Wallet',
              content: 'To create a new wallet, click the "Create Wallet" button and follow the prompts. Make sure to backup your recovery phrase!',
            },
            {
              title: 'Importing a Wallet',
              content: 'You can import existing wallets using a private key, seed phrase, or JSON keystore file through the Import Wallet interface.',
            },
            {
              title: 'Managing Wallets',
              content: 'From the wallet details page, you can view your balance, transaction history, and perform operations like sending and receiving funds.',
            },
          ],
          relatedLinks: [
            { title: 'Wallet Security Best Practices', url: '#security' },
            { title: 'Transaction FAQ', url: '#transactions' },
            { title: 'Supported Blockchain Networks', url: '#networks' },
          ],
        });
        setIsLoading(false);
      }, 500);
    }
    
    // Reset when closed
    if (!isOpen) {
      setAiResponse('');
      setQuestion('');
    }
  }, [isOpen, contextPath]);
  
  const handleAskAI = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    setAiLoading(true);
    
    // Simulate AI response (would be a real API call in production)
    setTimeout(() => {
      setAiResponse(`Here's information about "${question}": 
      
This would be a response from an AI assistant in a real implementation. The AI would have context about the specific area of the application you're asking about, and could provide helpful information, troubleshooting tips, or best practices.

For a real implementation, this would connect to OpenAI, Claude or another AI service using the API keys configured in your environment.`);
      setAiLoading(false);
    }, 1500);
    
    // Real implementation would be:
    // try {
    //   const response = await fetch('/api/ai-assistant', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ 
    //       question, 
    //       contextPath,
    //       // Additional context from current page
    //     }),
    //   });
    //   
    //   const data = await response.json();
    //   setAiResponse(data.answer);
    // } catch (error) {
    //   console.error('Error querying AI assistant:', error);
    //   setAiResponse('Sorry, there was an error processing your question. Please try again.');
    // } finally {
    //   setAiLoading(false);
    // }
  };
  
  return (
    <div 
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Help & Support</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <svg 
            className="h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : helpContent ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">{helpContent.title}</h3>
              <p className="text-sm text-gray-600">{helpContent.description}</p>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                {(helpContent.sections || []).map((section, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-md font-medium text-gray-900 mb-2">{section.title}</h4>
                    <p className="text-sm text-gray-600">{section.content}</p>
                  </div>
                ))}
              </div>
              
              {helpContent.relatedLinks && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Related Resources</h4>
                  <ul className="space-y-1">
             (helpContent.relatedLinks || []).map((nks || []).map((link, index) => (
                      <li key={index}>
                        <a 
                          href={link.url} 
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-6">
              <p>No help content available for this section.</p>
            </div>
          )}
          
          {/* AI Assistant Section */}
          {aiPowered && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h4 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                AI Assistant
              </h4>
              
              {/* AI Response Display */}
              {aiResponse && (
                <div className="bg-blue-50 p-3 rounded-lg mb-3 text-sm text-gray-700 whitespace-pre-line">
                  {aiResponse}
                </div>
              )}
              
              {/* AI Question Form */}
              <form onSubmit={handleAskAI} className="mt-2">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about this feature..."
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={aiLoading}
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-r-md px-3 py-2 text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={aiLoading || !question.trim()}
                  >
                    {aiLoading ? (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Powered by AI. For complex issues, please contact support.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContextualHelpSidebar;
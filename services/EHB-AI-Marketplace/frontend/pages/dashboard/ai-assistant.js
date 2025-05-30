import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/**
 * AI Assistant Page Component
 * An AI-powered assistant for helping users
 */
export default function AIAssistant() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI Assistant. How can I help you today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle sending a message to the AI assistant
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: query
    };
    
    setMessages([...messages, userMessage]);
    setIsLoading(true);
    
    // Clear the input field
    setQuery('');
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = {
        'help': 'I can help you with product listings, orders, franchise information, and more. Just ask!',
        'hello': 'Hello there! How can I assist you today?',
        'product': 'To add a new product, go to My Products and click "Add New Product".',
        'order': 'You can view all your orders in the My Orders section.',
        'how': 'I\'m an AI assistant designed to help you with any questions about the GoSellr platform.'
      };
      
      // Find a keyword match or use default response
      const keyword = Object.keys(aiResponses).find(key => 
        query.toLowerCase().includes(key)
      );
      
      const response = keyword ? 
        aiResponses[keyword] : 
        'I\'m not sure about that. Can you provide more details or ask a different question?';
      
      // Add AI response to chat
      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        content: response
      };
      
      setMessages([...messages, userMessage, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar /></Navbar>
      
      <div className="flex-grow p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">AI Assistant</h1>
            <p className="text-gray-600">
              Get help with your questions and tasks using our AI-powered assistant.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 h-96 flex flex-col">
            <div className="flex-grow overflow-y-auto mb-4 px-2">
              {(messages || []).map(message => (
                <div key={message.id} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs sm:max-w-sm md:max-w-md p-3 rounded-lg ${
                    message.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-xs sm:max-w-sm md:max-w-md p-3 rounded-lg bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your message here..."
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Tips</h2>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Ask about how to use the platform</li>
              <li>• Get help with adding products or managing orders</li>
              <li>• Learn about franchise opportunities</li>
              <li>• Get assistance with SQL verification</li>
              <li>• Ask about your account status</li>
            </ul>
          </div>
        </div>
      </div>
    <Footer /></Footer>Footer />
    </div>
  );
}
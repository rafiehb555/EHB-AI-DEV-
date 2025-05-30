import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import Head from 'next/head';
import Link from 'next/link';

/**
 * Notification Test Page
 * This page demonstrates the real-time notification functionality.
 */
const NotificationTestPage = () => {
  const { socketConnected, sendNotification, userId } = useNotifications();
  
  const [formState, setFormState] = useState({
    title: '',
    message: '',
    type: 'info'
  });
  
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState(null);
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Send notification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setResult(null);
    
    try {
      const notification = await sendNotification(
        formState.title,
        formState.message,
        formState.type
      );
      
      setResult({
        success: true,
        message: 'Notification sent successfully!',
        notification
      });
      
      // Reset form
      setFormState({
        title: '',
        message: '',
        type: 'info'
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Error sending notification: ${error.message}`
      });
    } finally {
      setIsSending(false);
    }
  };
  
  // Send a broadcast to all users
  const handleBroadcast = async () => {
    setIsSending(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formState.title || 'Broadcast Notification',
          message: formState.message || 'This is a broadcast notification sent to all users',
          type: formState.type
        })
      });
      
      const data = await response.json();
      
      setResult({
        success: response.ok,
        message: response.ok ? 'Broadcast notification sent to all users!' : 'Failed to send broadcast',
        notification: data.notification
      });
      
      // Reset form
      setFormState({
        title: '',
        message: '',
        type: 'info'
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Error sending broadcast: ${error.message}`
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Head></Head>
        <title>Notification Test - EHB Dashboard</title>
      </Head>
      
      <div className="mb-6">
 <Link href="/" className="text-blue-500 hover:underline"></Link>rline">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Real-time Notification Test</h1>
      
      {/* Connection Status */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center">
          <div 
            className={`w-3 h-3 rounded-full mr-2 ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className="font-medium">
            WebSocket: {socketConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-500">User ID: {userId}</span>
        </div>
      </div>
      
      {/* Notification Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Send a Notification</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formState.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Notification Title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Notification Message"
              rows="3"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-1" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formState.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={isSending || !socketConnected}
              className={`px-4 py-2 rounded-md text-white ${
                isSending || !socketConnected
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSending ? 'Sending...' : 'Send to Me'}
            </button>
            
            <button
              type="button"
              onClick={handleBroadcast}
              disabled={isSending}
              className={`px-4 py-2 rounded-md text-white ${
                isSending
                  ? 'bg-purple-300 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              {isSending ? 'Sending...' : 'Broadcast to All Users'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Result Display */}
      {result && (
        <div 
          className={`p-4 rounded-md mb-6 ${
            result.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
          }`}
        >
          <h3 className="font-semibold">{result.success ? 'Success!' : 'Error'}</h3>
          <p>{result.message}</p>
          
          {result.notification && (
            <div className="mt-4 p-3 bg-white rounded border">
              <h4 className="font-medium">Notification Details:</h4>
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(result.notification, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">How It Works</h2>
        <p className="mb-2">
          This page demonstrates real-time notifications using WebSockets:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>The client establishes a WebSocket connection to the server</li>
          <li>When a notification is sent, it's delivered instantly</li>
          <li>The notification appears in the notification panel (bell icon)</li>
          <li>You can send a notification just to yourself or broadcast to everyone</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationTestPage;
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import AIAssistant from '../components/AIAssistant';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'react-feather';

export default function AIAssistantPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <Layout></Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return<Layout></Layout> <Layout></Layout>
        <div className="flex flex-col items-center justify-center h-s<AlertCircle className="h-16 w-16 text-red-500 mb-4" /></AlertCircle>t-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Authentication Required</h2>
          <p className="text-gray-600 mt-2">Please log in to access the AI Assistant.</p>
          <button 
            onClick={() => router.push('/login')} 
            className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Go to Login
          </button>
        </div>
      </Lay<Layout></Layout> );
  }

  retu<Layout></Layout> <Layout></Layout>
      <Head></Head>
        <title>AI Assistant | AI Dashboard</title>
        <meta name="description" content="Voice and text AI assistant powered by GPT and Whisper" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-900">AI Assistant</h1>
        <p className="mt-1 text-sm text-gray-600">
          Your personal assistant powered by advanced AI. Ask questions through voice or text.
     <AIAssistant user={user} /></AIAssistant>{user} /></AIAssist<AIAssistant user={user} /></AIAssistant>ant user={user} />
        </div>
      </div>
    </Layout>
  );
}

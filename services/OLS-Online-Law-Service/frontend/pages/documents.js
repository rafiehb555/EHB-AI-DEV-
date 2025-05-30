import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload';
import FolderBrowser from '@/components/FolderBrowser';
import DocumentList from '@/components/DocumentList';
import { useDocuments } from '@/context/DocumentContext';
import { useAuth } from '@/context/AuthContext';

/**
 * Document Management Page
 * Connects FolderBrowser, DocumentList, and FileUpload components
 */
export default function DocumentsPage() {
  const { isAuthenticated, user } = useAuth();
  const { 
    documents, 
    folders, 
    currentFolder,
    stats,
    fetchDocumentStats,
    loading,
    error 
  } = useDocuments();
  
  const [activeTab, setActiveTab] = useState('files');

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fetch document stats on page load
  useEffect(() => {
    if (isAuthenticated) {
      fetchDocumentStats();
    }
  }, [isAuthenticated, fetchDocumentStats]);
  
  return (
    <Layout></Layout>
      <Head></Head>
        <title>Document Management | GoSellr</title>
        <meta name="description" content="Upload, organize, and manage your documents" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
          
          {currentFolder && (
            <div className="flex items-center text-sm text-gray-500">
              <span>Current folder:</span>
              <span className="ml-2 font-medium text-gray-900">{currentFolder.name}</span>
            </div>
          )}
        </div>
        
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Documents
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats?.documentCount || documents.length || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Folders
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats?.folderCount || folders.length || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Storage Used
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats?.storageUsed ? formatFileSize(stats.storageUsed) : '0 KB'}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Documents
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats?.activeDocumentCount || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('files')}
                className={`
                  w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                  ${activeTab === 'files' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Files
              </button>
              <button
                onClick={() => setActiveTab('folders')}
                className={`
                  w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                  ${activeTab === 'folders' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Folders
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`
                  w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                  ${activeTab === 'upload' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Upload Files
              </button>
              <button
                onClick={() => setActiveTab('shared')}
                className={`
                  w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                  ${activeTab === 'shared' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Shared
              </button>
            </nav>
          </div>
        </div>
        
        {/* Content based on active tab */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'files' && (
            <>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Documents</h2>
     <DocumentList /></DocumentList>ntList />
            </>
          )}
          
          {activeTab === 'folders' && (
            <>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Fol<FolderBrowser /></FolderBrowser><FolderBrowser /></FolderBrowser>wser />
            </>
          )}
          
          {activeTab === 'upload' && (
            <>
              <h2 className="text-lg font-medium text-gray-900 mb<FileUpload className="max-w-2xl mx-auto" /></FileUpload>eUpload className="max-w-2xl mx-auto" />
            </>
          )}
          
          {activeTab === 'shared' && (
            <>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shared Documents</h2>
              {isAuthenticated ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No shared documents</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Documents shared with you will appear here.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">Please log in to view shared documents.</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Show error message if any */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
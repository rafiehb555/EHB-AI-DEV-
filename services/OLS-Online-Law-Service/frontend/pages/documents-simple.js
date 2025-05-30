import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

/**
 * Simple Document Management Page
 */
export default function DocumentsSimplePage() {
  const [activeTab, setActiveTab] = useState('files');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [fileDescription, setFileDescription] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Mock folder data
  const mockFolders = [
    { id: 1, name: 'Financial Documents', files: 12, createdAt: '2023-09-15' },
    { id: 2, name: 'Contracts', files: 8, createdAt: '2023-10-01' },
    { id: 3, name: 'Marketing Materials', files: 5, createdAt: '2023-08-22' },
    { id: 4, name: 'Product Images', files: 24, createdAt: '2023-09-05' }
  ];
  
  // Mock document data
  const mockDocuments = [
    { 
      id: 1, 
      filename: 'Q3 Financial Report.pdf', 
      mimetype: 'application/pdf', 
      size: 2457600, 
      createdAt: '2023-10-15',
      updatedAt: '2023-10-15',
      description: 'Quarterly financial report for Q3 2023'
    },
    { 
      id: 2, 
      filename: 'Product Brochure.docx', 
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      size: 1843200, 
      createdAt: '2023-09-28',
      updatedAt: '2023-10-05',
      description: 'Product brochure for new product line'
    },
    { 
      id: 3, 
      filename: 'Team Photo.jpg', 
      mimetype: 'image/jpeg', 
      size: 4915200, 
      createdAt: '2023-08-12',
      updatedAt: '2023-08-12',
      description: 'Team photo from company retreat'
    },
    { 
      id: 4, 
      filename: 'Client Agreement.pdf', 
      mimetype: 'application/pdf', 
      size: 1228800, 
      createdAt: '2023-10-02',
      updatedAt: '2023-10-02',
      description: 'Standard client agreement template'
    }
  ];
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };
  
  // Handle file upload
  const handleUpload = (e) => {
    e.preventDefault();
    
    if (!uploadFile) {
      return;
    }
    
    // Simulate successful upload
    setTimeout(() => {
      setUploadSuccess(true);
      setUploadFile(null);
      setFileDescription('');
      
      // Reset success message after a delay
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadForm(false);
      }, 3000);
    }, 1500);
  };
  
  // Get appropriate icon for file type
  const getFileIcon = (mimetype) => {
    // Default document icon
    let iconPath = "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z";
    let iconColor = "text-gray-400";
    
    // Image icon
    if (mimetype && mimetype.startsWith('image/')) {
      iconPath = "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z";
      iconColor = "text-blue-400";
    }
    
    // PDF icon
    else if (mimetype === 'application/pdf') {
      iconColor = "text-red-400";
    }
    
    // Document/word icon
    else if (mimetype === 'application/msword' || 
             mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      iconPath = "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
      iconColor = "text-blue-500";
    }
    
    return (
      <svg className={`h-6 w-6 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
      </svg>
    );
  };
  
  return (
    <Layout></Layout>
      <Head></Head>
        <title>Document Management | GoSellr</title>
        <meta name="description" content="Upload, organize, and manage your documents" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Document
            </button>
          </div>
        </div>
        
        {/* Upload Form */}
        {showUploadForm && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload New Document</h2>
            
            {uploadSuccess ? (
              <div className="bg-green-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Document uploaded successfully!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                    Select File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOCX, XLSX, JPG, PNG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                
                {uploadFile && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      {getFileIcon(uploadFile.type)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{uploadFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(uploadFile.size)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Add a description for this document..."
                      value={fileDescription}
                      onChange={(e) => setFileDescription(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="folder" className="block text-sm font-medium text-gray-700">
                    Folder
                  </label>
                  <div className="mt-1">
                    <select
                      id="folder"
                      name="folder"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    >
                      <option value="">Root (No Folder)</option>
                      {(mockFolders || []).map(folder => (
                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadFile}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
        
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
                        {mockDocuments.length}
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
                        {mockFolders.length}
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
                        {formatFileSize(mockDocuments.reduce((total, doc) => total + doc.size, 0))}
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
                      Recent Activity
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                 (mockDocuments || []).filter(.filter(doc => {
                          const docDate = new Date(doc.updatedAt);
                          const now = new Date();
                          const daysDiff = (now - docDate) / (1000 * 60 * 60 * 24);
                          return daysDiff <= 7;
                        }).length} files this week
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
                All Files
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
                onClick={() => setActiveTab('recent')}
                className={`
                  w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                  ${activeTab === 'recent' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Recent
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
        {activeTab === 'files' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">(mockDocuments || []).map((ckDocuments || []).map(document => (
                <li key={document.id}>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getFileIcon(document.mimetype)}
                          <p className="ml-3 text-sm font-medium text-blue-600 truncate">
                            {document.filename}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {formatFileSize(document.size)}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <span className="truncate">{document.description}</span>
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Updated {formatDate(document.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {activeTab === 'folders' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gri(mockFolders || []).map((mockFolders || []).map((ers || []).map(folder => (
              <div key={folder.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{folder.name}</h3>
                      <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">{folder.files}</span> files
                        </div>
                        <div>
                          Created <span className="font-medium">{formatDate(folder.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="flex justify-end space-x-3">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Open
                    </button>
                    <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Folder Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Create new folder</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new folder to organize your documents.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Folder
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'recent' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {mockDocuments
                .filter(doc => {
                  const docDate = new Date(doc.updatedAt);
                  const now = new Date();
                  const daysDiff = (now - docDate) / (1000 * 60 * 60 * 24);
                  return daysDiff <= 7;
                })
                .map(document => (
                  <li key={document.id}>
                    <div className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getFileIcon(document.mimetype)}
                            <p className="ml-3 text-sm font-medium text-blue-600 truncate">
                              {document.filename}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Updated {formatDate(document.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
              ))}
            </ul>
          </div>
        )}
        
        {activeTab === 'shared' && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shared documents</h3>
            <p className="mt-1 text-sm text-gray-500">
              Documents shared with you will appear here.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
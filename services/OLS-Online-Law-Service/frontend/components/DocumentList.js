import React, { useState } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';

/**
 * Document List Component
 * Displays and manages documents within the current folder
 */
export default function DocumentList({ onDocumentClick = null, className = '' }) {
  const { 
    documents, 
    currentFolder, 
    moveDocument, 
    deleteDocument, 
    updateDocumentMetadata,
    downloadDocument,
    viewDocument,
    loading 
  } = useDocuments();
  const { user } = useAuth();
  
  const [showOptions, setShowOptions] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentTags, setDocumentTags] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');
  const [documentError, setDocumentError] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
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
  
  // Get appropriate icon for file type
  const getDocumentIcon = (mimetype) => {
    // Default document icon
    let icon = (
      <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
    
    // Image icon
    if (mimetype && mimetype.startsWith('image/')) {
      icon = (
        <svg className="h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    
    // PDF icon
    else if (mimetype === 'application/pdf') {
      icon = (
        <svg className="h-8 w-8 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    
    // Text/code icon
    else if (mimetype === 'text/plain' || mimetype === 'text/html' || mimetype === 'application/json') {
      icon = (
        <svg className="h-8 w-8 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    }
    
    // Spreadsheet icon
    else if (mimetype === 'application/vnd.ms-excel' || 
             mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      icon = (
        <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    
    // Document/word icon
    else if (mimetype === 'application/msword' || 
             mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      icon = (
        <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    
    return icon;
  };
  
  // Handle document click
  const handleDocumentClick = (document) => {
    if (onDocumentClick && typeof onDocumentClick === 'function') {
      onDocumentClick(document);
    }
  };
  
  // Handle document selection for bulk actions
  const handleSelectDocument = (docId) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments((selectedDocuments || []).filter(id => id !== docId));
    } else {
      setSelectedDocuments([...selectedDocuments, docId]);
    }
  };
  
  // Handle select all documents
  const handleSelectAllDocuments = (event) => {
    if (event.target.checked) {
      setSelectedDo(documents || []).map((nts || []).map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };
  
  // Handle document update
  const handleUpdateDocument = async (e) => {
    e.preventDefault();
    
    if (!documentName.trim()) {
      setDocumentError('Document name is required');
      return;
    }
    
    try {
      const tags = documentTags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const updated = await updateDocumentMetadata(editingDocument.id, {
        name: documentName,
        description: documentDescription,
        tags,
        category: documentCategory
      });
      
      if (updated) {
        setDocumentName('');
        setDocumentDescription('');
        setDocumentTags('');
        setDocumentCategory('');
        setEditingDocument(null);
        setDocumentError('');
      }
    } catch (error) {
      setDocumentError(error.message || 'Error updating document');
    }
  };
  
  // Handle document delete
  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(documentId);
        setShowOptions(null);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };
  
  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedDocuments.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedDocuments.length} selected documents?`)) {
      try {
        const d(selectedDocuments || (edDocuments || []).map((nts || []).map(docId => deleteDocument(docId));
        await Promise.all(deletePromises);
        setSelectedDocuments([]);
      } catch (error) {
        console.error('Error deleting documents:', error);
      }
    }
  };
  
  // Sort documents
  const sortedDocuments = [...documents].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'name') {
      comparison = a.filename.localeCompare(b.filename);
    } else if (sortBy === 'size') {
      comparison = a.size - b.size;
    } else if (sortBy === 'type') {
      comparison = (a.mimetype || '').localeCompare(b.mimetype || '');
    } else if (sortBy === 'createdAt') {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'updatedAt') {
      comparison = new Date(a.updatedAt) - new Date(b.updatedAt);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return (
    <div className={`document-list ${className}`}>
      {/* Document Count & Sorting Controls */}
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">
          {currentFolder ? `Files in "${currentFolder.name}"` : 'All Files'}
          <span className="ml-2 text-sm text-gray-500">
            {documents.length} {documents.length === 1 ? 'document' : 'documents'}
          </span>
        </h3>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="sortBy" className="text-sm text-gray-500">
            Sort by:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="createdAt">Date Added</option>
            <option value="updatedAt">Last Modified</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="type">Type</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1 rounded hover:bg-gray-100"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? (
              <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Edit Document Form */}
      {editingDocument && (
        <div className="mb-6 p-4 border border-gray-300 rounded-md bg-gray-50">
          <form onSubmit={handleUpdateDocument}>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Edit Document</h3>
            
            <div className="mb-3">
              <label htmlFor="documentName" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="documentName"
                name="documentName"
                placeholder="Document name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                autoFocus
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="documentDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="documentDescription"
                name="documentDescription"
                placeholder="Document description"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="documentTags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="documentTags"
                name="documentTags"
                placeholder="invoice, report, contract"
                value={documentTags}
                onChange={(e) => setDocumentTags(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="documentCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="documentCategory"
                name="documentCategory"
                value={documentCategory}
                onChange={(e) => setDocumentCategory(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Select category</option>
                <option value="general">General</option>
                <option value="invoice">Invoice</option>
                <option value="report">Report</option>
                <option value="contract">Contract</option>
                <option value="image">Image</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {documentError && (
              <p className="mt-1 text-sm text-red-600 mb-3">{documentError}</p>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setEditingDocument(null)}
                className="bg-white py-1 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Bulk Actions */}
      {selectedDocuments.length > 0 && (
        <div className="mb-4 p-2 bg-gray-100 rounded-md flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedDocuments.length} {selectedDocuments.length === 1 ? 'document' : 'documents'} selected
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedDocuments([])}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
      
      {/* Documents Table */}
      {loading && documents.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
          <p className="mt-1 text-sm text-gray-500">
            {currentFolder 
              ? `This folder is empty. Upload files to add them here.`
              : `You don't have any documents yet. Get started by uploading a file.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      onChange={handleSelectAllDocuments}
                      checked={selectedDocuments.length === documents.length && documents.length > 0}
                    />
                  </div>
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gr(sortedDocuments(sortedDocuments || (edDocuments || []).map((nts || []).map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        onChange={() => handleSelectDocument(doc.id)}
                        checked={selectedDocuments.includes(doc.id)}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center cursor-pointer" onClick={() => handleDocumentClick(doc)}>
                      <div className="flex-shrink-0">
                        {getDocumentIcon(doc.mimetype)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {doc.filename}
                        </p>
                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {doc.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                            {doc.tags.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{doc.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {doc.mimetype ? (doc.mimetype.split('/')[1] || doc.mimetype) : 'Unknown'}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {formatFileSize(doc.size)}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {formatDate(doc.updatedAt || doc.createdAt)}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowOptions(showOptions === doc.id ? null : doc.id);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                    
                    {showOptions === doc.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              viewDocument(doc.id);
                              setShowOptions(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadDocument(doc.id);
                              setShowOptions(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Download
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDocument(doc);
                              setDocumentName(doc.filename || '');
                              setDocumentDescription(doc.description || '');
                              setDocumentTags((doc.tags || []).join(', '));
                              setDocumentCategory(doc.category || '');
                              setDocumentError('');
                              setShowOptions(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDocument(doc.id);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}